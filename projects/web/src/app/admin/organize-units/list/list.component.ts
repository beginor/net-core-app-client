import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { AccountService } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

import {
    AppOrganizeUnitModel,
    OrganizeUnitService,
} from '../organize-units.service';
import { DetailComponent, DetailParams } from '../detail/detail.component';

export interface TreeNodeInterface extends AppOrganizeUnitModel {
    children?: TreeNodeInterface[];
    parent?: TreeNodeInterface;
}

@Component({
    selector: 'app-organize-unit-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzButtonModule,
        NzCardModule,
        NzDrawerModule,
        NzFormModule,
        NzIconModule,
        NzSpaceModule,
        NzTableModule,
        NzToolTipModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {

    protected listData: TreeNodeInterface[] = [];

    private drawerService = inject(NzDrawerService);
    private ui = inject(UiService);
    protected account = inject(AccountService);
    protected vm = inject(OrganizeUnitService);

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin/dashboard' },
            { label: '组织单元' }
        ]);
        this.vm.data.subscribe((data) => {
            this.listData = this.convertTreeToList(data);
        });
        void this.loadData();
    }

    protected convertTreeToList(
        treeList: AppOrganizeUnitModel[],
        parent?: TreeNodeInterface
    ): TreeNodeInterface[] {
        const list: TreeNodeInterface[] = [];
        treeList.forEach((node) => {
            const listNode = node as TreeNodeInterface;
            listNode.parent = parent;
            list.push(listNode);
            if (listNode.children) {
                list.push(...this.convertTreeToList(listNode.children, node));
            }
        });
        return list;
    }

    protected expandChange(data: TreeNodeInterface): void {
        data.expand = !data.expand;
        if (!data.expand) {
            this.collapseChild(data.children);
        }
        // console.log('listData : ', this.listData);
    }

    protected collapseChild(childs?: TreeNodeInterface[]): void {
        if (childs) {
            childs.forEach((child) => {
                child.expand = false;
                this.collapseChild(child.children);
            });
        }
    }

    protected loadData(): void {
        void this.vm.search();
    }

    protected showDetail(id: string, editable: boolean): void {
        const ref = this.drawerService.create<
            DetailComponent,
            DetailParams,
            string
        >({
            nzClosable: false,
            nzContent: DetailComponent,
            nzWidth: '40vw',
            nzBodyStyle: {
                padding: 0
            },
            nzData: { id, editable }
        });
        ref.afterClose.subscribe((result) => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    protected delete(id: string): void {
        void this.vm.delete(id).then((deleted) => {
            if (deleted) {
                void this.vm.search();
            }
        });
    }
}
