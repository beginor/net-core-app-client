import { Component, OnInit, input, signal, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';

import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

import { AccountService } from 'app-shared';

import {
    AttachmentService, AttachmentModel
} from '../services/attachment.service';


@Component({
    selector: 'app-attachment-list',
    standalone: true,
    imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzListModule,
],
    templateUrl: './attachment-list.component.html',
    styleUrl: './attachment-list.component.css'
})
export class AttachmentListComponent implements OnInit {

    public businessId = input('0');

    public listSize = input<NzSizeLDSType>('default');
    public listBordered = input(false);
    public listHeader = input('附件列表');
    public listFooter = input<string | TemplateRef<void>>();

    public emptyText = input('无数据');
    public allowDelete = input(true);
    public take = input(99);

    protected attachments = signal<AttachmentModel[]>([]);

    private attachmentService = inject(AttachmentService);
    protected accountService = inject(AccountService);

    public ngOnInit(): void {
        void this.loadAttachments();
    }

    protected async deleteAttachment(id: string): Promise<void> {
        await this.attachmentService.delete(id);
        await this.loadAttachments();
    }

    protected async loadAttachments(): Promise<void> {
        const bizId = this.businessId();
        if (!bizId || bizId === '0') {
            return;
        }
        const result = await this.attachmentService.searchAttachments({
            businessId: bizId,
            skip: 0,
            take: this.take() ?? 99
        });
        this.attachments.set(result.data);
    }
}
