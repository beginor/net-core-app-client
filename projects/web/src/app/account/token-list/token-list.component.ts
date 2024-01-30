import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { TokenService } from '../token.service';
import { TokenDetailComponent } from '../token-detail/token-detail.component';

@Component({
    selector: 'app-token-list',
    templateUrl: './token-list.component.html',
    styleUrl: './token-list.component.css',
})
export class TokenListComponent {

    constructor(
        private drawerService: NzDrawerService,
        public vm: TokenService
    ) { }

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
