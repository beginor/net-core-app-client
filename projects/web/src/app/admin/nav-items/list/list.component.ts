import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { AccountService } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

import { NavItemsService } from '../nav-items.service';
import { DetailComponent } from '../detail/detail.component';

@Component({
    selector: 'app-nav-item-list',
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

    private drawerService = inject(NzDrawerService);
    private ui = inject(UiService);
    protected account = inject(AccountService);
    protected vm = inject(NavItemsService);

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin/dashboard' },
            { label: '导航菜单' }
        ]);
    }

    protected loadData({
        pageSize = 20,
        pageIndex = 1,
        // sort = [],
        // filter = [],
    }: Partial<NzTableQueryParams>): void {
        this.vm.pageSize = pageSize;
        this.vm.pageIndex = pageIndex;
        void this.vm.search();
    }

    protected showDetail(id: string, editable: boolean): void {
        const ref = this.drawerService.create<
            DetailComponent,
            Partial<DetailComponent>,
            string
        >({
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: DetailComponent,
            nzBodyStyle: { padding: '0' },
            nzData: { id, editable },
        });
        ref.afterClose.subscribe(result => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    protected async delete(id: string): Promise<void> {
        const deleted = await this.vm.delete(id);
        if (deleted) {
            void this.vm.search();
        }
    }

    protected toNzIconType(icon: string): string {
        if (icon.includes(':')) {
            return icon;
        }
        const idx = icon.indexOf('/');
        if (idx > 0) {
            return icon.substring(0, idx) + ':' + icon.substring(idx + 1);
        }
        return icon;
    }

}
