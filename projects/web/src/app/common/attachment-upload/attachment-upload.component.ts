import {
    Component, ElementRef, EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import {
    NzButtonType, NzButtonSize, NzButtonShape
} from 'ng-zorro-antd/button';
import { NzProgressStatusType } from 'ng-zorro-antd/progress';

import { AccountService, waitFor } from 'app-shared';

import {
    AttachmentService,
    AttachmentUploadResultModel
} from '../services/attachment.service';

@Component({
    selector: 'app-attachment-upload',
    standalone: false,
    templateUrl: './attachment-upload.component.html',
    styleUrl: './attachment-upload.component.css'
})
export class AttachmentUploadComponent {

    @Input() public businessId!: string;
    @Input() public iconPath = 'bi/upload';
    @Input() public iconClass = 'me-2';
    @Input() public buttonText = '上传附件';
    @Input() public buttonShape: NzButtonShape = null;
    @Input() public buttonType: NzButtonType = 'default';
    @Input() public buttonSize: NzButtonSize = 'default';
    @Input() public accept = 'image/*';
    @Input() public multiple = false;
    @Input() public noPrivilegeText = '没有权限上传!';

    @Output() public fileSelected = new EventEmitter<FileList>();
    @Output() public uploadCompleted = new EventEmitter<void>();

    protected uploading = false;

    @ViewChild('fileInput', { static: false })
    private fileInputRef?: ElementRef<HTMLInputElement>;

    constructor(
        public accountSvc: AccountService,
        public vm: AttachmentService
    ) { }

    public chooseFile(): void {
        if (!this.fileInputRef) {
            return;
        }
        this.fileInputRef.nativeElement.value = '';
        this.fileInputRef.nativeElement.click();
    }

    public async onFileChange(e: Event): Promise<void> {
        e.preventDefault();
        const input = e.target as HTMLInputElement;
        const files = input.files;
        if (!files) {
            return;
        }
        this.vm.setFiles(files);
        this.fileSelected.next(files);
        if (this.businessId) {
            await this.uploadAttachments(this.businessId);
        }
    }

    public async uploadAttachments(businessId: string): Promise<void> {
        this.uploading = true;
        await this.vm.uploadAttachments(businessId);
        await waitFor(500);
        this.uploading = false;
        this.uploadCompleted.next();
    }

    public getItemUploadStatus(
        item: AttachmentUploadResultModel
    ): NzProgressStatusType {
        if (item.error) {
            return 'exception';
        }
        if (item.uploadedSize === 0) {
            return 'normal';
        }
        if (item.uploadedSize < item.length) {
            return 'active';
        }
        if (item.uploadedSize == item.length) {
            return 'success';
        }
        return 'normal';
    }

}
