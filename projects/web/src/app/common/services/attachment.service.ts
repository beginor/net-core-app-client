import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { API_ROOT } from 'app-shared';

import { UiService } from './ui.service';

@Injectable({
    providedIn: 'root'
})
export class AttachmentService {

    public uploadList: AttachmentUploadResultModel[] = [];
    public loading = false;

    private baseUrl: string;
    private bufferSize = 1024 * 1024 * 2;

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
        private errorHandler: ErrorHandler,
        private ui: UiService
    ) {
        this.baseUrl = `${apiRoot}/attachments`;
    }

    public getContentUrl(id: string): string {
        return `${this.baseUrl}/${id}`;
    }

    public getDownloadUrl(id: string): string {
        return `${this.baseUrl}/${id}?action=download`;
    }

    public getThumbnailUrl(id: string): string {
        return `${this.baseUrl}/${id}/thumbnail`;
    }

    public async searchAttachments(
        searchModel: AttachmentSearchModel
    ): Promise<AttachmentSearchResultModel> {
        const { businessId } = searchModel;
        if (!businessId) {
            throw new Error('businessId is required!');
        }
        try {
            this.loading = true;
            let params = new HttpParams();
            for (const key in searchModel) {
                if (searchModel.hasOwnProperty(key)) {
                    const val = searchModel[key];
                    params = params.set(key, val as string);
                }
            }
            const result = await lastValueFrom(
                this.http.get<AttachmentSearchResultModel>(
                    this.baseUrl, { params }
                )
            );
            return result;
        }
        catch (ex) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '获取附件列表出错！' }
            );
            return { data: [] } as unknown as AttachmentSearchResultModel;
        }
    }

    public setFiles(files: FileList): void {
        this.uploadList = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.uploadList.push(
                {
                    fileName: file.name,
                    length: file.size,
                    uploadedSize: 0,
                    percent: 0,
                    file
                }
            );
        }
    }

    public async uploadAttachments(
        businessId: string
    ): Promise<void> {
        for (let i = 0; i < this.uploadList.length; i++) {
            const file = this.uploadList[i].file;
            await this.uploadAttachment(file, businessId);
        }
    }

    private async uploadAttachment(
        file: File,
        businessId: string
    ): Promise<void> {
        try {
            const buffSize = this.bufferSize;
            const model: AttachmentUploadModel = {
                fileName: file.name,
                length: file.size,
                offset: 0,
                businessId,
                contentType: file.type
            };
            if (file.size <= buffSize) {
                model.content = await this.readAsBase64(file);
                await lastValueFrom(
                    this.http.post(this.baseUrl, model)
                );
                const item = this.uploadList.find(
                    item => item.fileName === file.name
                )!;
                item.uploadedSize = file.size;
                item.percent = 100;
            }
            else {
                let start = 0;
                while (start < file.size) {
                    const end = Math.min(start + buffSize, file.size);
                    model.offset = start;
                    const blob = file.slice(start, end);
                    model.content = await this.readAsBase64(blob);
                    await lastValueFrom(
                        this.http.post(this.baseUrl, model)
                    );
                    start = end;
                    const item = this.uploadList.find(
                        item => item.fileName === file.name
                    )!;
                    item.uploadedSize = end;
                    item.percent = Math.round(
                        item.uploadedSize / item.length * 100
                    );
                }
            }
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: `上传附件 ${file.name} 出错！` }
            );
            const item = this.uploadList.find(
                item => item.fileName === file.name
            )!;
            item.error = true;
            return;
        }
    }

    private readAsBase64(blob: Blob): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = (): void => {
                const result = reader.result as string;
                const base64 = 'base64,';
                const buff = result.substring(
                    result.indexOf(base64) + base64.length
                );
                resolve(buff);
            };
            reader.onerror = (): void => {
                reject(new Error('blob read error'));
            }
        });
    }

}

/** 附件信息 */
export interface AttachmentModel {
    /** 内容类型（HTTP Content Type */
    contentType?: string;
    /** 创建时 */
    createdAt?: string;
    /** 创建附件的用户I */
    creatorId?: string;
    /** 创建附件的用户 */
    creatorName?: string;
    /** 文件 */
    fileName?: string;
    /** 附件大 */
    length?: string;
    /** 附件所属的业务I */
    businessId?: string;
    /** 文件路 */
    filePath?: string;
}

export interface AttachmentSearchModel {
    [key: string]: undefined | number | string;
    skip: number;
    take: number;
    businessId?: string;
}

export interface AttachmentSearchResultModel {
    skip: number;
    take: number;
    total: number;
    data: AttachmentModel[];
}

/** 附件上传模型 */
export interface AttachmentUploadModel {
    /** 文件名 */
    fileName: string;
    /** 内容类型（HTTP Content Type） */
    contentType: string;
    /** 附件大小 */
    length: number;
    /** 附件所属的业务ID */
    businessId: string;
    /** 跳过长度 */
    offset: number;
    /** 内容 */
    content?: string;
}

/** 附件上传结果模型 */
export interface AttachmentUploadResultModel {
    /** 文件名 */
    fileName: string;
    /** 附件大小 */
    length: number;
    /** 已上传大小 */
    uploadedSize: number;
    percent: number;
    file: File;
    error?: boolean;
}
