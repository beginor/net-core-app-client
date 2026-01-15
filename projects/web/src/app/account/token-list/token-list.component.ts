import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { UiService } from 'projects/web/src/app/common';

import { TokenService } from '../token.service';
import { TokenDetailComponent } from '../token-detail/token-detail.component';

@Component({
    selector: 'app-token-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzButtonModule,
        NzCardModule,
        NzCheckboxModule,
        NzDatePickerModule,
        NzDrawerModule,
        NzFormModule,
        NzIconModule,
        NzInputModule,
        NzSpaceModule,
        NzTableModule,
        NzTooltipModule,
    ],
    templateUrl: './token-list.component.html',
    styleUrl: './token-list.component.css',
})
export class TokenListComponent implements OnInit {

    private drawerService = inject(NzDrawerService);
    private ui = inject(UiService);
    protected vm = inject(TokenService);

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '我的凭证' }
        ]);
    }

    protected loadData({
        pageSize = 20,
        pageIndex = 1,
        // sort = [],
        // filter = [],
    }: Partial<NzTableQueryParams>): void {
        this.vm.pageSize.set(pageSize);
        this.vm.pageIndex.set(pageIndex);
        void this.vm.search();
    }

    protected showDetail(id: string, editable: boolean): void {
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

    protected async delete(id: string): Promise<void> {
        const deleted = await this.vm.delete(id);
        if (deleted) {
            void this.vm.search();
        }
    }

    protected isExpires(date?: string): boolean {
        if (!date) {
            return false;
        }
        const d = new Date(date);
        return d < new Date();
    }

    protected resetSearch(): void {
        this.vm.model().keywords = '';
        this.vm.pageIndex.set(1);
        void this.vm.search();
    }

}
