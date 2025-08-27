import {
    Component, ElementRef, inject, input, output, signal, ViewChild
} from '@angular/core';

import {
    NzButtonType, NzButtonSize, NzButtonShape
} from 'ng-zorro-antd/button';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';
import { JsonDataService } from '../services/json-data.service';

@Component({
    selector: 'app-json-data-upload',
    standalone: true,
    imports: [
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './json-data-upload.component.html',
    styleUrl: './json-data-upload.component.css'
})
export class JsonDataUploadComponent {

    protected businessId = input('0');
    protected iconPath = input('bi/upload');
    protected iconClass = input('me-2');
    protected buttonText = input('选择JSON文件');
    protected buttonShape = input<NzButtonShape>(null);
    protected buttonType = input<NzButtonType>('default');
    protected buttonSize = input<NzButtonSize>('default');
    protected accept = input('.json');
    protected noPrivilegeText = input('没有权限上传!');

    protected uploadCompleted = output();

    protected uploading = signal(false);

    @ViewChild('fileInput', { static: false })
    private fileInputRef?: ElementRef<HTMLInputElement>;

    protected accountService = inject(AccountService);
    protected jsonDataService = inject(JsonDataService);
    private uiService = inject(UiService);

    protected chooseFile(): void {
        if (!this.fileInputRef) {
            return;
        }
        this.fileInputRef.nativeElement.value = '';
        this.fileInputRef.nativeElement.click();
    }

    protected async onFileChange(e: Event): Promise<void> {
        e.preventDefault();
        const businessId = this.businessId();
        if (!this.businessId || businessId === '0') {
            return;
        }
        const input = e.target as HTMLInputElement;
        const files = input.files;
        if (!files?.length) {
            return;
        }
        try {
            const model = await this.jsonDataService.createModelFromJsonFile(
                businessId,
                files[0]
            );
            if (model) {
                await this.jsonDataService.create(model);
                this.uploadCompleted.emit();
            }
        }
        catch (ex: unknown) {
            this.uiService.showAlert({
                type: 'danger', message: '无法上传！',
            });
            console.error(ex);
        }

    }
}
