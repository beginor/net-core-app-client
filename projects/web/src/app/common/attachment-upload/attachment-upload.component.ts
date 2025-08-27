import {
    Component, ElementRef, inject, input, output, signal, ViewChild
} from '@angular/core';

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
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './attachment-upload.component.html',
    styleUrl: './attachment-upload.component.css'
})
export class AttachmentUploadComponent {

    protected businessId = input('0');
    protected iconPath = input('bi/upload');
    protected iconClass = input('me-2');
    protected buttonText = input('上传附件');
    protected buttonShape = input<NzButtonShape>(null);
    protected buttonType = input<NzButtonType>('default');
    protected buttonSize = input<NzButtonSize>('default');
    protected accept = input('image/*');
    protected multiple = input(false);
    protected noPrivilegeText = input('没有权限上传!');
    protected modalTitle = input('');

    protected fileSelected = output<FileList>();
    protected uploadCompleted = output();

    protected uploading = signal(false);

    @ViewChild('fileInput', { static: false })
    private fileInputRef?: ElementRef<HTMLInputElement>;

    protected accountSvc = inject(AccountService);
    protected vm = inject(AttachmentService);

    protected chooseFile(): void {
        if (!this.fileInputRef) {
            return;
        }
        this.fileInputRef.nativeElement.value = '';
        this.fileInputRef.nativeElement.click();
    }

    protected async onFileChange(e: Event): Promise<void> {
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

    protected async uploadAttachments(businessId: string): Promise<void> {
        this.uploading.set(true);
        await this.vm.uploadAttachments(businessId);
        await waitFor(500);
        this.uploading.set(false);
        this.uploadCompleted.emit();
    }

    protected getItemUploadStatus(
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
