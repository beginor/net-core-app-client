import {
    Component, OnInit, input, signal, TemplateRef, ViewChild, ElementRef,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

import { AccountService } from 'app-shared';

import { JsonDataService, JsonDataModel } from '../services/json-data.service';

@Component({
    selector: 'app-json-data-list',
    standalone: true,
    imports: [
        CommonModule,
        NzButtonModule,
        NzIconModule,
        NzListModule,
        NzSpaceModule,
    ],
    templateUrl: './json-data-list.component.html',
    styleUrl: './json-data-list.component.css'
})
export class JsonDataListComponent implements OnInit {
    public businessId = input('0');

    public listSize = input<NzSizeLDSType>('default');
    public listBordered = input(false);
    public listHeader = input('JSON数据列表');
    public listFooter = input<string | TemplateRef<void>>();

    public emptyText = input('无数据');
    public allowDelete = input(true);
    public allowUpdate = input(true);
    public take = input(99);

    public accept = input('.json');

    protected data = signal<JsonDataModel[]>([]);

    @ViewChild('fileInput', { static: false })
    private fileInputRef?: ElementRef<HTMLInputElement>;
    private updatingId = '';

    private jsonDataService = inject(JsonDataService);
    protected accountService = inject(AccountService);

    public ngOnInit(): void {
        void this.loadData();
    }

    protected async delete(id: string): Promise<void> {
        await this.jsonDataService.delete(id);
        await this.loadData();
    }

    protected async update(id: string): Promise<void> {
        if (!this.fileInputRef) {
            return;
        }
        this.updatingId = id;
        this.fileInputRef.nativeElement.value = '';
        this.fileInputRef.nativeElement.click();
    }

    protected async onFileChange(e: Event): Promise<void> {
        e.preventDefault();
        if (!this.updatingId) {
            return;
        }
        const input = e.target as HTMLInputElement;
        const files = input.files;
        if (!files) {
            return;
        }
        const model = await this.jsonDataService.createModelFromJsonFile(
            this.businessId(),
            files[0]
        );
        if (!model) {
            return;
        }
        model.id = this.updatingId;
        await this.jsonDataService.update(this.updatingId, model);
        await this.loadData();
    }

    protected async loadData(): Promise<void> {
        const bizId = this.businessId();
        if (!bizId || bizId === '0') {
            return;
        }
        const result = await this.jsonDataService.search({
            businessId: bizId,
            skip: 0,
            take: this.take() ?? 99
        })
        this.data.set(result.data);
    }

}
