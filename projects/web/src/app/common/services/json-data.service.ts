import { ErrorHandler, Inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { API_ROOT } from 'app-shared';

import { UiService } from './ui.service';

@Injectable({
    providedIn: 'root'
})
export class JsonDataService {

    public loading = signal(false);
    private readonly baseUrl: string;

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
        private errorHandler: ErrorHandler,
        private ui: UiService
    ) {
        this.baseUrl = `${apiRoot}/json`;
    }

    public async search(
        searchModel: JsonDataSearchModel
    ): Promise<JsonDataResultModel> {
        const { businessId, name } = searchModel;
        if (!businessId && !name) {
            throw new Error('Please provide businessId or name to search!');
        }
        try {
            this.loading.set(true);
            let params = new HttpParams();
            for (const key in searchModel) {
                if (searchModel.hasOwnProperty(key)) {
                    const val = searchModel[key];
                    params = params.set(key, val as string);
                }
            }
            return await lastValueFrom(
                this.http.get<JsonDataResultModel>(
                    this.baseUrl, {params}
                )
            );
        }
        catch (ex) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '获取JSON数据列表出错！' }
            );
            return { data: [] } as unknown as JsonDataResultModel;
        }
        finally {
            this.loading.set(false);
        }
    }

    public getContentUrl(id: string): string {
        return `${this.baseUrl}/${id}`;
    }

    public async getContent(id: string): Promise<any> {
        try {
            const url = this.getContentUrl(id);
            return await lastValueFrom(
                this.http.get(url)
            );
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '获取JSON数据内容出错！' }
            );
        }
    }

    public async create(
        model: JsonDataModel
    ): Promise<JsonDataModel> {
        try {
            return await lastValueFrom(
                this.http.post<JsonDataModel>(this.baseUrl, model)
            );
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '创建JSON数据内容出错！' }
            );
            return model;
        }
    }

    public async update(
        id: string,
        model: JsonDataModel
    ): Promise<JsonDataModel> {
        try {
            return await lastValueFrom(
                this.http.put<JsonDataModel>(`${this.baseUrl}/${id}`, model)
            );
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '更新JSON数据内容出错！' }
            );
            return model;
        }
    }

    public async delete(id: string): Promise<boolean> {
        const confirm = await this.ui.showConfirm('确认删除么？');
        if (!confirm) {
            return false;
        }
        try {
            await lastValueFrom(
                this.http.delete<JsonDataModel>(`${this.baseUrl}/${id}`)
            );
            return true;
        }
        catch (ex: unknown) {
            this.errorHandler.handleError(ex);
            this.ui.showAlert(
                { type: 'danger', message: '更新JSON数据内容出错！' }
            );
            return false;
        }
    }

    public async createModelFromJsonFile(
        businessId: string,
        file: File
    ): Promise<JsonDataModel | undefined> {
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            const name = (json.name ?? file.name) as string;
            const model: JsonDataModel = {
                businessId,
                name,
                value: json
            };
            return model;
        }
        catch(ex: unknown) {
            this.ui.showAlert({
                type: 'danger', message: 'JSON文件格式错误！'
            });
            console.error(ex);
            return undefined;
        }
    }
}

export interface JsonDataModel {
    id?: string;
    businessId?: string;
    name?: string;
    value?: any;
    updatedAt?: Date;
}

export interface JsonDataSearchModel {
    [key: string]: undefined | number | string;
    skip: number;
    take: number;
    businessId?: string;
    name?: string;
}

export interface JsonDataResultModel {
    skip: number;
    take: number;
    total: number;
    data: JsonDataModel[];
}
