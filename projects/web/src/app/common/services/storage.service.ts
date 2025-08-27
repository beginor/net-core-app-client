import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';
import { API_ROOT } from 'app-shared';

import { UiService } from './ui.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private http = inject(HttpClient);
    private errorHandler = inject(ErrorHandler);
    private ui = inject(UiService);
    private apiRoot = inject(API_ROOT);

    public async getFolderContent(
        params: StorageContent
    ): Promise<StorageContent> {
        try {
            const url = `${this.apiRoot}/storages/${params.alias}/browse`;
            const httpParams = new HttpParams()
                .set('path', params.path)
                .set('filter', params.filter ?? '');
            const result = await lastValueFrom(
                this.http.get<StorageContent>(url, { params: httpParams })
            );
            return result;
        }
        catch (ex: unknown) {
            this.ui.showAlert(
                { type: 'warning', message: '无法获取存储内容！' }
            );
            this.errorHandler.handleError(ex);
            return params;
        }
    }

}

export interface StorageContent {
    title: string;
    alias: string;
    path: string;
    filter?: string;
    folders?: string[];
    files?: string[];
}
