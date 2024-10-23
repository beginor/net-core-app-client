import {
    Component, ElementRef, input, output, signal, ViewChild
} from '@angular/core';

import {
    NzButtonType, NzButtonSize, NzButtonShape
} from 'ng-zorro-antd/button';

import { AccountService, waitFor, SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';
import { JsonDataService, JsonDataModel } from '../services/json-data.service';

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

    public businessId = input('0');
    public iconPath = input('bi/upload');
    public iconClass = input('me-2');
    public buttonText = input('选择JSON文件');
    public buttonShape = input<NzButtonShape>(null);
    public buttonType = input<NzButtonType>('default');
    public buttonSize = input<NzButtonSize>('default');
    public accept = input('.json');
    public noPrivilegeText = input('没有权限上传!');

    public uploadCompleted = output<void>();

    protected uploading = signal(false);

    @ViewChild('fileInput', { static: false })
    private fileInputRef?: ElementRef<HTMLInputElement>;

    constructor(
        protected accountService: AccountService,
        protected jsonDataService: JsonDataService,
        private uiService: UiService,
    ) { }

    protected chooseFile(): void {
        if (!this.fileInputRef) {
            return;
        }
        this.fileInputRef.nativeElement.value = '';
        this.fileInputRef.nativeElement.click();
    }

    public async onFileChange(e: Event): Promise<void> {
        e.preventDefault();
        const businessId = this.businessId();
        if (!this.businessId || businessId === '0') {
            return;
        }
        const input = e.target as HTMLInputElement;
        const files = input.files;
        if (!files || !files.length) {
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
