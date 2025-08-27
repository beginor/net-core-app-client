import { Component, OnInit, input, signal, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

import { SvgIconComponent, AccountService } from 'app-shared';

import { AntdModule } from '../antd.module';
import {
    AttachmentService, AttachmentModel
} from '../services/attachment.service';

@Component({
    selector: 'app-attachment-list',
    standalone: true,
    imports: [
        CommonModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './attachment-list.component.html',
    styleUrl: './attachment-list.component.css'
})
export class AttachmentListComponent implements OnInit {
    protected businessId = input('0');

    protected listSize = input<NzSizeLDSType>('default');
    protected listBordered = input(false);
    protected listHeader = input('附件列表');
    protected listFooter = input<string | TemplateRef<void>>();

    protected emptyText = input('无数据');
    protected allowDelete = input(true);
    protected take = input(99);

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
