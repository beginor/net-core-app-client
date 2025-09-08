import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { UiService } from '../services/ui.service';

import { StorageService, StorageContent } from '../services/storage.service';

@Component({
    selector: 'app-storage-browser',
    standalone: true,
    imports: [
        CommonModule,
        ScrollingModule,
        NzButtonModule,
        NzCardModule,
        NzIconModule,
        NzInputModule,
        NzSpaceModule,
        NzToolTipModule,
    ],
    templateUrl: './storage-browser.component.html',
    styleUrl: './storage-browser.component.css',
})
export class StorageBrowserComponent implements OnInit {

    @ViewChild('searchEl')
    protected searchEl?: ElementRef<HTMLInputElement>;

    private storage = inject(StorageService);
    private ui = inject(UiService);
    protected modal = inject(NzModalRef);
    protected params = inject<StorageContent>(NZ_MODAL_DATA);


    protected title = this.params.title;
    protected filteredItems: FolderItem[] = [];
    private allItems: FolderItem[] = [];
    protected selectedItem?: FolderItem;
    protected breadcrumbs: BreadCrumb[] = [];
    protected searchFilter?: string;

    public ngOnInit(): void {
        void this.loadData();
    }

    protected async getFolderContentByPath(path: string): Promise<void> {
        this.params.path = path ?? '/';
        await this.loadData();
    }

    protected async getFolderContent(item: FolderItem): Promise<void> {
        if (item.type === 'file') {
            return;
        }
        let path = this.params.path;
        if (!path) {
            path = item.name;
        }
        else {
            if (path.endsWith('.') || path.endsWith('/')) {
                path = path.substring(0, path.length - 1);
            }
            path = `${path}/${item.name}`;
        }
        this.params.path = path;
        await this.loadData();
    }

    protected getFolderItemClass(item: FolderItem): string {
        if (item.type === 'folder') {
            return 'text-info';
        }
        if (item.type === 'file' && item.ext === 'svg') {
            return 'text-info';
        }
        return '';
    }

    protected getFolderItemIconPath(item: FolderItem): string {
        if (item.type === 'folder') {
            return 'folder';
        }
        if (item.type === 'file' && item.ext === 'svg') {
            const path = `${this.params.path}/${item.name}`;
            return this.ui.toNzIconType(path);
        }
        return 'file';
    }

    protected setSelectedItem(item: FolderItem): void {
        this.selectedItem = item;
    }

    protected ok(): void {
        let path = this.params.path;
        if (path === '.') {
            path = '';
        }
        if (path !== '') {
            path += '/';
        }
        let file = this.selectedItem?.name;
        if (this.selectedItem?.type === 'file') {
            file += '.' + this.selectedItem.ext;
        }
        path += file;
        this.modal.close(path);
    }

    protected cancel(): void {
        this.modal.close();
    }

    protected search(e: KeyboardEvent): void {
        const input = e.target as HTMLInputElement;
        const filter = input.value;
        if (filter) {
            this.filteredItems = this.allItems.filter(
                x => x.name.includes(filter)
            );
        }
        else {
            this.filteredItems = this.allItems;
        }
    }

    private async loadData(): Promise<void> {
        if (this.searchEl) {
            this.searchEl.nativeElement.value = '';
        }
        this.allItems = [];
        this.filteredItems = [];
        // this.breadcrumbs = [];
        this.params = await this.storage.getFolderContent(this.params);
        this.buildFolderItems();
        this.buildBreadcrumbs();
    }

    private buildFolderItems(): void {
        this.allItems = [];
        this.params.folders?.sort().forEach(x => {
            this.allItems.push({ name: x, type: 'folder', ext: '' });
        });
        this.params.files?.sort().forEach(x => {
            const idx = x.lastIndexOf('.');
            this.allItems.push({
                name: x.substring(0, idx),
                type: 'file',
                ext: x.substring(idx + 1)
            });
        });
        this.filteredItems = this.allItems;
    }

    private buildBreadcrumbs(): void {
        const path = this.params.path;
        if (path !== '.') {
            const segments = path.split('/');
            this.breadcrumbs = segments.map((segment, idx) => {
                const breadcrumb: BreadCrumb = {
                    name: segment,
                    path: segments.slice(0, idx + 1).join('/')
                };
                return breadcrumb;
            });
        }
        else {
            this.breadcrumbs = [];
        }
    }

}

export interface FolderItem {
    name: string;
    type: 'folder' | 'file';
    ext: string;
}

export interface BreadCrumb {
    name: string;
    path: string;
}
