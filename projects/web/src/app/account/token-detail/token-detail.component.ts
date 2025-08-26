import { Component, OnInit, Inject, LOCALE_ID, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { differenceInCalendarDays} from 'date-fns';

import {
    AccountService, UserTokenModel, AppRole,
    AppPrivilege,
    SvgIconComponent
} from 'app-shared';
import { UiService, AntdModule } from 'projects/web/src/app/common';

import { TokenService } from '../token.service';

@Component({
    selector: 'app-token-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './token-detail.component.html',
    styleUrl: './token-detail.component.css',
})
export class TokenDetailComponent implements OnInit {

    public id = '0';
    public get title(): string {
        return this.id === '0' ? '新建凭证' : '凭证信息';
    }
    public editable = true;

    protected model = signal<UserTokenModel>({ id: '0', name: '', value: '' });
    protected roles = signal<AppRole[]>([]);
    protected privileges = signal<ModulePrivileges[]>([]);
    protected tokenExpiresAt = signal<Date | undefined>(undefined);
    protected tokenUrls = signal<string[]>([]);

    private reloadList = false;
    private checkedRoles: string[] = [];
    private checkedPrivileges: string[] = [];

    constructor(
        private drawerRef: NzDrawerRef,
        private account: AccountService,
        private ui: UiService,
        @Inject(LOCALE_ID) private local: string,
        public vm: TokenService
    ) { }

    public ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.account.getRolesAndPrivileges().subscribe(rap => {
            this.roles.set(rap.roles);
            const privileges: ModulePrivileges[] = [];
            for (const p of rap.privileges) {
                let mp = privileges.find(m => m.module == p.module);
                if (!mp) {
                    mp = { module: p.module ?? '', privileges: [] };
                    privileges.push(mp);
                }
                mp.privileges.push(p);
            }
            this.privileges.set(privileges);
            if (this.id !== '0') {
                const model = this.vm.getById(this.id);
                if (model) {
                    this.model.set(model);
                    if (!!model.roles && model.roles.length > 0) {
                        this.checkedRoles = JSON.parse(
                            JSON.stringify(model.roles)
                        ) as string[];
                    }
                    if (!!model.privileges && model.privileges.length > 0) {
                        this.checkedPrivileges = JSON.parse(
                            JSON.stringify(model.privileges)
                        ) as string[];
                    }
                    if (model.expiresAt) {
                        this.tokenExpiresAt.set(new Date(model.expiresAt));
                    }
                    if (!!model.urls && model.urls.length > 0) {
                        this.tokenUrls.set(JSON.parse(
                            JSON.stringify(model.urls)
                        ) as string[]);
                    }
                }
            }
            else {
                void this.newTokenValue();
            }
        });
    }

    public cancel(): void {
        this.drawerRef.close('');
    }

    public save(): void {
        const model = this.model();
        model.roles = this.checkedRoles;
        model.privileges = this.checkedPrivileges;
        if (this.tokenExpiresAt()) {
            model.expiresAt = formatDate(
                this.tokenExpiresAt()!, 'yyyy-MM-dd', this.local
            );
        }
        model.urls = this.tokenUrls();
        if (this.id !== '0') {
            this.vm.update(this.id, model);
        }
        else {
            this.vm.create(model);
        }
        this.drawerRef.close('ok');
    }

    public newTokenValue(): void {
        this.account.newTokenValue().subscribe({
            next: (val) => {
                if (val) {
                    this.model.update(prev => {
                        return { ...prev, value: val };
                    });
                }
            },
            error: (ex: unknown) => {
                console.error(ex);
                this.ui.showAlert(
                    { type: 'danger', message: '生成新凭证值出错！' }
                );
            }
        });
    }

    public isChecked(roleName: string, propName: ArrPropName): boolean {
        const arr = this[propName];
        if (!arr) {
            return false;
        }
        return arr.includes(roleName);
    }

    public toggleChecked(
        checked: boolean,
        roleName: string,
        propName: ArrPropName
    ): void {
        if (!this[propName]) {
            this[propName] = [];
        }
        const arr = this[propName];
        if (checked) {
            arr.push(roleName);
        }
        else {
            const idx = arr.indexOf(roleName);
            arr.splice(idx, 1);
        }
    }

    public addTokenUrl(el: HTMLInputElement): void {
        const url = el.value.trim();
        if (!url) {
            return;
        }
        const urls = this.tokenUrls();
        const idx = urls.indexOf(url);
        if (idx < 0) {
            urls.push(url);
        }
        this.tokenUrls.set(urls);
        el.value = '';
    }

    public removeTokenUrl(url: string): void {
        const urls = this.tokenUrls();
        const idx = urls.indexOf(url);
        if (idx > -1) {
            urls.splice(idx, 1);
        }
        this.tokenUrls.set(urls);
    }

    public disabledDate = (current: Date): boolean =>
        // Can not select days before today and today
        differenceInCalendarDays(current, new Date()) < 1;

}

export type ArrPropName = 'checkedRoles' | 'checkedPrivileges';

export interface ModulePrivileges {
    module: string;
    privileges: AppPrivilege[];
}
