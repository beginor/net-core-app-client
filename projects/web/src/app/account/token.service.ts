import { Injectable } from '@angular/core';

import {
    AccountService, UserTokenModel, UserTokenSearchModel
} from 'app-shared';
import { UiService } from '../common';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    public pageSizeOptions = [20, 40, 60, 80, 100, 200];
    public pageSize = this.pageSizeOptions[0];
    public pageIndex = 1;

    public model: UserTokenSearchModel = {
        skip: this.pageSize * (this.pageIndex - 1),
        take: this.pageSize,
        keywords: ''
    };

    public total = 0;
    public tokens: UserTokenModel[] = [];

    public loading = false;

    constructor(
        private account: AccountService,
        private ui: UiService
    ) { }

    public async search(): Promise<void> {
        try {
            this.loading = true;
            this.model.skip = this.pageSize * (this.pageIndex - 1);
            this.model.take = this.pageSize;
            const result = await this.account.searchUserTokens(this.model);
            this.total = result.total ?? 0;
            this.tokens = result.data ?? [];
        }
        catch (ex: unknown) {
            console.error(ex);
            this.ui.showAlert(
                { type: 'danger', message: '加载凭证列表出错！' }
            );
        }
        finally {
            this.loading = false;
        }
    }

    public getById(id: string): UserTokenModel | undefined {
        const token = this.tokens.find(t => t.id === id);
        if (!token) {
            return;
        }
        return Object.assign({}, token);
    }

    public async create(model: UserTokenModel): Promise<void> {
        try {
            await this.account.createUserToken(model);
        }
        catch (ex: unknown) {
            console.error(ex);
            this.ui.showAlert(
                { type: 'danger', message: '创建凭证出错！' }
            );
        }
    }

    public async update(id: string, model: UserTokenModel): Promise<void> {
        try {
            await this.account.updateUserToken(id, model);
        }
        catch (ex: unknown) {
            console.error(ex);
            this.ui.showAlert(
                { type: 'danger', message: '更新凭证出错！' }
            );
        }
    }

    public async delete(id: string): Promise<boolean> {
        const confirm = await this.ui.showConfirm('确认删除凭证么？');
        if (!confirm) {
            return false;
        }
        try {
            await this.account.deleteUserToken(id);
            return true;
        }
        catch (ex: unknown) {
            console.error(ex);
            this.ui.showAlert(
                { type: 'danger', message: '删除用户凭证出错！' }
            );
            return false;
        }
    }

}
