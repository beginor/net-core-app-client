import {
    Component, ElementRef, inject, input, output, signal, viewChild
} from '@angular/core';

import {
    NzButtonModule, NzButtonType, NzButtonSize, NzButtonShape
} from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzProgressModule, NzProgressStatusType } from 'ng-zorro-antd/progress';

import { AccountService, waitFor } from 'app-shared';

import {
    AttachmentService,
    AttachmentUploadResultModel
} from '../services/attachment.service';

@Component({
    selector: 'app-attachment-upload',
    standalone: true,
    imports: [
        NzButtonModule,
        NzModalModule,
        NzProgressModule,
        NzIconModule,
    ],
    templateUrl: './attachment-upload.component.html',
    styleUrl: './attachment-upload.component.css'
})
export class AttachmentUploadComponent {

    public businessId = input('0');
    public iconPath = input('upload');
    public iconClass = input('');
    public buttonText = input('上传附件');
    public buttonShape = input<NzButtonShape>(null);
    public buttonType = input<NzButtonType>('default');
    public buttonSize = input<NzButtonSize>('default');
    public accept = input('image/*');
    public multiple = input(false);
    public noPrivilegeText = input('没有权限上传!');
    public modalTitle = input('');

    public fileSelected = output<FileList>();
    public uploadCompleted = output();

    protected uploading = signal(false);

    private fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

    protected accountSvc = inject(AccountService);
    protected vm = inject(AttachmentService);

    protected chooseFile(): void {
        const fileInput = this.fileInputRef()?.nativeElement;
        if (fileInput) {
            fileInput.value = '';
            fileInput.click();
        }
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
