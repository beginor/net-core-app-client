import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

import { SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { StorageService, StorageContent } from '../services/storage.service';

@Component({
    selector: 'app-storage-browser',
    standalone: true,
    imports: [
        CommonModule,
        ScrollingModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './storage-browser.component.html',
    styleUrl: './storage-browser.component.css',
})
export class StorageBrowserComponent implements OnInit {

    @ViewChild('searchEl')
    protected searchEl?: ElementRef<HTMLInputElement>;

    protected modal = inject(NzModalRef);
    private service = inject(StorageService);
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
            return 'bi/folder';
        }
        if (item.type === 'file' && item.ext === 'svg') {
            return `${this.params.path}/${item.name}`;
        }
        return 'bi/file-earmark';
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
        this.params = await this.service.getFolderContent(this.params);
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
