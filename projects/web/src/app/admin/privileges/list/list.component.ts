import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { AccountService, SvgIconComponent } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';
import { AntdModule } from 'projects/web/src/app/antd.module';

import { AppPrivilegeService } from '../privileges.service';
import { DetailComponent } from '../detail/detail.component';

@Component({
    selector: 'app-privilege-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {

    constructor(
        private drawerService: NzDrawerService,
        public account: AccountService,
        public ui: UiService,
        public vm: AppPrivilegeService
    ) {
        ui.breadcrumbs = [
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin' },
            { label: '权限管理' }
        ];
    }

    public async ngOnInit(): Promise<void> {
        await this.vm.getModules();
    }

    public loadData({
        pageSize = 20,
        pageIndex = 1,
        // sort = [],
        // filter = [],
    }: Partial<NzTableQueryParams>): void {
        this.vm.pageSize = pageSize;
        this.vm.pageIndex = pageIndex;
        void this.vm.search();
    }

    public showDetail(id: string, editable: boolean): void {
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

    public async delete(id: string): Promise<void> {
        const deleted = await this.vm.delete(id);
        if (deleted) {
            void this.vm.search();
        }
    }

}
