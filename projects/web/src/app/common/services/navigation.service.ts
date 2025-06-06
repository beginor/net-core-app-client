import { Injectable, Inject, ErrorHandler, effect } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { API_ROOT, AccountService, AccountInfo } from 'app-shared';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    public root = new BehaviorSubject<NavigationNode>(
        { title: '', children: [] }
    );
    public topbarNodes = new BehaviorSubject<NavigationNode[] | undefined>([]);
    public sidebarNodes = new BehaviorSubject<NavigationNode[] | undefined>([]);
    public accountNodes = new BehaviorSubject<NavigationNode[]>([]);
    public initialized = false;
    public showSidebar = false;

    private currentUrl: string;

    constructor(
        private http: HttpClient,
        private title: Title,
        private location: Location,
        private account: AccountService,
        @Inject(API_ROOT) private apiRoot: string,
        private errorHandler: ErrorHandler
    ) {
        this.currentUrl = location.path();
        this.location.onUrlChange(() => {
            this.updateSidebarNodes();
        });
        effect(() => {
            const info = this.account.current();
            this.loadAccountMenu(info);
        });
    }

    public isActiveNode(node: NavigationNode): boolean {
        if (!node.url) {
            return false;
        }
        return this.location.path().includes(node.url);
    }

    public findCurrentIframeUrl(): string | undefined {
        const root = this.root.getValue();
        return this.findIframeUrl(root.children ?? [], this.currentUrl);
    }

    private findIframeUrl(
        nodes: NavigationNode[],
        url: string
    ): string | undefined {
        for (const node of nodes) {
            if (node.url === url) {
                return node.frameUrl;
            }
            if (node.url && url.startsWith(node.url) && !!node.children) {
                return this.findIframeUrl(node.children, url);
            }
        }
        return '';
    }

    private setupNavigationNodes(rootNode: NavigationNode): void {
        this.root.next(rootNode);
        this.topbarNodes.next(rootNode.children);
        this.updateAccountNodes(rootNode);
        if (rootNode.children) {
            this.sidebarNodes.next(
                this.findSidebarNavigationNodes(rootNode.children)
            );
        }
    }

    private updateAccountNodes(rootNode: NavigationNode): void {
        if (!rootNode.children) {
            return;
        }
        const account = rootNode.children.find(n => n.url === '/account');
        if (!account) {
            return;
        }
        this.accountNodes.next(account.children ?? []);
    }

    private updateSidebarNodes(): void {
        const rootNode = this.root.getValue();
        if (!rootNode) {
            return;
        }
        const path = this.location.path();
        if (rootNode.children) {
            for (const node of rootNode.children) {
                if (!node.url) {
                    continue;
                }
                if (path.startsWith(node.url)) {
                    this.sidebarNodes.next(node.children);
                    this.showSidebar =
                        (!!node.children) && node.children.length > 0;
                    break;
                }
            }
        }
        this.currentUrl = path;
    }

    private findSidebarNavigationNodes(
        topNodes: NavigationNode[]
    ): NavigationNode[] {
        const path = this.location.path(false);
        for (const child of topNodes) {
            if (child.url && path.startsWith(child.url)) {
                if (child.children) {
                    return child.children;
                }
            }
        }
        return [];
    }

    private updateTitle(title: string): void {
        this.title.setTitle(title);
    }

    private loadAccountMenu(_: AccountInfo): void {
        const menuUrl = `${this.apiRoot}/account/menu`;
        lastValueFrom(
            this.http.get<NavigationNode>(menuUrl)
        ).then(node => {
            this.setupNavigationNodes(node);
            this.updateTitle(node.title ?? '');
            if (!this.initialized) {
                this.initialized = true;
            }
        })
        .catch(ex => {
            this.errorHandler.handleError(ex);
        });
    }

}

export interface NavigationNode {
    id?: string;
    title?: string;
    url?: string;
    tooltip?: string;
    isHidden?: boolean;
    icon?: string;
    target?: string;
    frameUrl?: string;
    children?: NavigationNode[];
}
