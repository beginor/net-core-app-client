import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { AccountService } from 'app-shared';

import {
    AppOrganizeUnitModel,
    OrganizeUnitService,
} from '../organize-units.service';
import { DetailComponent } from '../detail/detail.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

export interface TreeNodeInterface extends AppOrganizeUnitModel {
    children?: TreeNodeInterface[];
    parent?: TreeNodeInterface;
}

@Component({
    selector: 'app-organize-unit-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {

    constructor(
        private offcanvas: NgbOffcanvas,
        public account: AccountService,
        public vm: OrganizeUnitService,
        private drawerService: NzDrawerService
    ) { }

    public listData: TreeNodeInterface[] = [];

    public convertTreeToList(
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

    public expandChange(data: TreeNodeInterface): void {
        data.expand = !data.expand;
        if (!data.expand) {
            this.collapseChild(data.children);
        }
        // console.log('listData : ', this.listData);
    }

    public collapseChild(childs?: TreeNodeInterface[]): void {
        if (!!childs) {
            childs.forEach((child) => {
                child.expand = false;
                this.collapseChild(child.children);
            });
        }
    }

    public ngOnInit(): void {
        void this.loadData();
        this.vm.data.subscribe((data) => {
            this.listData = this.convertTreeToList(data);
            // console.log('listData : ', this.listData);
        });
    }

    public loadData(): void {
        void this.vm.search();
    }

    public showDetail(id: string, editable: boolean): void {
        const ref = this.drawerService.create<DetailComponent, {
            id: string,
            editable: boolean
        }, string
        >({
            nzClosable: false,
            nzContent: DetailComponent,
            nzWidth: '40vw',
            nzBodyStyle: {
                padding: 0
            },
            nzContentParams: {
                id,
                editable
            }
        });
        ref.afterClose.subscribe((result) => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    public delete(id: string): void {
        void this.vm.delete(id).then((deleted) => {
            if (deleted) {
                void this.vm.search();
            }
        });
    }
}
