import { Component, OnInit, input, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

import { SvgIconComponent, AccountService } from 'app-shared';

import { AntdModule } from '../antd.module';
import {
    AttachmentService, AttachmentModel
} from '../services/attachment.service';
import {
    AttachmentUploadComponent
} from '../attachment-upload/attachment-upload.component';

@Component({
    selector: 'app-attachment-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
        AttachmentUploadComponent,
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

    constructor(
        private attachmentService: AttachmentService,
        protected accountService: AccountService,
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.loadAttachments();
    }

    protected async deleteAttachment(id: string): Promise<void> {
        await this.attachmentService.delete(id);
        await this.loadAttachments();
    }

    public async loadAttachments(): Promise<void> {
        const id = this.businessId();
        if (!id || id === '0') {
            return;
        }
        const result = await this.attachmentService.searchAttachments({
            businessId: id,
            skip: 0,
            take: this.take() ?? 99
        });
        this.attachments.set(result.data);
    }
}
