import {
    Component, ElementRef, input, output, signal, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    NzButtonType, NzButtonSize, NzButtonShape
} from 'ng-zorro-antd/button';
import { NzProgressStatusType } from 'ng-zorro-antd/progress';

import { AccountService, waitFor, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';
import {
    AttachmentService,
    AttachmentUploadResultModel
} from '../services/attachment.service';

@Component({
    selector: 'app-attachment-upload',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './attachment-upload.component.html',
    styleUrl: './attachment-upload.component.css'
})
export class AttachmentUploadComponent {

    public businessId = input('0');
    public iconPath = input('bi/upload');
    public iconClass = input('me-2');
    public buttonText = input('上传附件');
    public buttonShape = input<NzButtonShape>(null);
    public buttonType = input<NzButtonType>('default');
    public buttonSize = input<NzButtonSize>('default');
    public accept = input('image/*');
    public multiple = input(false);
    public noPrivilegeText = input('没有权限上传!');
    public modalTitle = input('');

    public fileSelected = output<FileList>();
    public uploadCompleted = output<void>();

    protected uploading = signal(false);

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
        this.fileSelected.emit(files);
        if (this.businessId()) {
            await this.uploadAttachments(this.businessId());
        }
    }

    public async uploadAttachments(businessId: string): Promise<void> {
        this.uploading.set(true);
        await this.vm.uploadAttachments(businessId);
        await waitFor(500);
        this.uploading.set(false);
        this.uploadCompleted.emit();
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
