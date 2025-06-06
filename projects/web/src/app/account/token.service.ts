import { Injectable, signal, linkedSignal, } from '@angular/core';
import { Observable, catchError, filter, map, of, switchMap, } from 'rxjs';

import {
    AccountService, UserTokenModel, UserTokenSearchModel
} from 'app-shared';
import { UiService } from '../common';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    public pageSizeOptions = signal<number[]>([20, 40, 60, 80, 100, 200]);
    public pageSize = linkedSignal<number[], number>({
        source: this.pageSizeOptions,
        computation: (newOpts, prev) => {
            return newOpts.find(opt => opt === prev?.value) ?? newOpts[0];
        }
    });
    public pageIndex = signal<number>(1);

    public model = signal<UserTokenSearchModel>({
        skip: this.pageSize() * (this.pageIndex() - 1),
        take: this.pageSize(),
        keywords: ''
    });

    public total = signal<number>(0);
    public tokens = signal<UserTokenModel[]>([]);

    public loading = signal<boolean>(false);

    constructor(
        private account: AccountService,
        private ui: UiService
    ) { }

    public search(): void {
        this.loading.set(true);
        const model = this.model();
        model.skip = this.pageSize() * (this.pageIndex() - 1);
        model.take = this.pageSize();
        this.account.searchUserTokens(model).subscribe({
            next: (result) => {
                this.total.set(result.total ?? 0);
                this.tokens.set(result.data ?? []);
            },
            error: (ex: unknown) => {
                console.error(ex);
                this.ui.showAlert(
                    { type: 'danger', message: '加载凭证列表出错！' }
                );
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

    public getById(id: string): UserTokenModel | undefined {
        const token = this.tokens().find(t => t.id === id);
        if (!token) {
            return;
        }
        return Object.assign({}, token);
    }

    public create(model: UserTokenModel): void {
        this.account.createUserToken(model).subscribe({
            next: () => {
                this.ui.showAlert(
                    { type: 'success', message: '创建凭证成功！' }
                );
            },
            error: (ex: unknown) => {
                console.error(ex);
                this.ui.showAlert(
                    { type: 'danger', message: '创建凭证出错！' }
                );
            }
        });
    }

    public update(id: string, model: UserTokenModel): void {
        this.account.updateUserToken(id, model).subscribe({
            next: () => {
                this.ui.showAlert(
                    { type: 'success', message: '更新凭证成功！' }
                );
            },
            error: (ex: unknown) => {
                console.error(ex);
                this.ui.showAlert(
                    { type: 'danger', message: '更新凭证出错！' }
                );
            }
        });
    }

    public delete(id: string): Observable<boolean> {
        return this.ui.showConfirm('确定要删除该凭证吗？').pipe(
            filter(res => res),
            switchMap(() => {
                return this.account.deleteUserToken(id).pipe(
                    map(() => {
                        this.ui.showAlert(
                            { type: 'success', message: '删除凭证成功！' }
                        );
                        return true;
                    }),
                    catchError((error) => {
                        console.error(error);
                        this.ui.showAlert(
                            { type: 'danger', message: '删除凭证出错！' }
                        );
                        return of(false);
                    })
                );
            })
        );
    }

}
