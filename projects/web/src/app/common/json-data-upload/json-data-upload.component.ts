import {
    Component, ElementRef, inject, input, output, signal, ViewChild
} from '@angular/core';

import {
    NzButtonModule, NzButtonType, NzButtonSize, NzButtonShape
} from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AccountService } from 'app-shared';
import { UiService } from '../services/ui.service';
import { JsonDataService } from '../services/json-data.service';

@Component({
    selector: 'app-json-data-upload',
    standalone: true,
    imports: [
        NzButtonModule,
        NzIconModule,
    ],
    templateUrl: './json-data-upload.component.html',
    styleUrl: './json-data-upload.component.css'
})
export class JsonDataUploadComponent {

    public businessId = input('0');
    public iconPath = input('upload');
    public iconClass = input('');
    public buttonText = input('选择JSON文件');
    public buttonShape = input<NzButtonShape>(null);
    public buttonType = input<NzButtonType>('default');
    public buttonSize = input<NzButtonSize>('default');
    public accept = input('.json');
    public noPrivilegeText = input('没有权限上传!');

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
