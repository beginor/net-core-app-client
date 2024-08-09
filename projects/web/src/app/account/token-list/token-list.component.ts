import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

import { TokenService } from '../token.service';
import { TokenDetailComponent } from '../token-detail/token-detail.component';

@Component({
    selector: 'app-token-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './token-list.component.html',
    styleUrl: './token-list.component.css',
})
export class TokenListComponent implements OnInit {

    constructor(
        private drawerService: NzDrawerService,
        private ui: UiService,
        public vm: TokenService
    ) { }

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '我的凭证' }
        ]);
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
            TokenDetailComponent,
            Partial<TokenDetailComponent>,
            string
        >({
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: TokenDetailComponent,
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

    public isExpires(date?: string): boolean {
        if (!date) {
            return false;
        }
        const d = new Date(date);
        return d < new Date();
    }

    public resetSearch(): void {
        this.vm.model.keywords = '';
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

}
