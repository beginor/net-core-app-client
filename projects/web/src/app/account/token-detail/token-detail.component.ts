import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
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

    public model: UserTokenModel = { id: '0', name: '', value: '' };
    public roles: AppRole[] = [];
    public privileges: Array<{ module: string; privileges: AppPrivilege[] }> = []; // eslint-disable-line max-len
    public tokenExpiresAt?: Date;
    public tokenUrls: string[] = [];

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

    public async ngOnInit(): Promise<void> {
        const rap = await  this.account.getRolesAndPrivileges();
        this.roles = rap.roles;
        this.privileges = [];
        for (const p of rap.privileges) {
            let mp = this.privileges.find(
                m => m.module == p.module
            );
            if (!mp) {
                mp = { module: p.module ?? '', privileges: [] };
                this.privileges.push(mp);
            }
            mp.privileges.push(p);
        }
        if (this.id !== '0') {
            const model = this.vm.getById(this.id);
            if (!!model) {
                this.model = model;
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
                if (!!model.expiresAt) {
                    this.tokenExpiresAt = new Date(model.expiresAt);
                }
                if (!!model.urls && model.urls.length > 0) {
                    this.tokenUrls = JSON.parse(
                        JSON.stringify(model.urls)
                    ) as string[];
                }
            }
        }
        else {
            void this.newTokenValue();
        }
    }

    public cancel(): void {
        this.drawerRef.close('');
    }

    public async save(): Promise<void> {
        this.model.roles = this.checkedRoles;
        this.model.privileges = this.checkedPrivileges;
        if (!!this.tokenExpiresAt) {
            this.model.expiresAt = formatDate(
                this.tokenExpiresAt, 'yyyy-MM-dd', this.local
            );
        }
        this.model.urls = this.tokenUrls;
        if (this.id !== '0') {
            await this.vm.update(this.id, this.model);
        }
        else {
            await this.vm.create(this.model);
        }
        this.drawerRef.close('ok');
    }

    public async newTokenValue(): Promise<void> {
        try {
            const val = await this.account.newTokenValue();
            if (!!val) {
                this.model.value = val;
            }
        }
        catch (ex: unknown) {
            this.ui.showAlert(
                { type: 'danger', message: '生成新凭证值出错！' }
            );
        }
    }

    public isChecked(roleName: string, propName: ArrPropName): boolean {
        const arr = this[propName];
        if (!arr) {
            return false;
        }
        return arr.indexOf(roleName) > -1;
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
        const idx = this.tokenUrls.indexOf(url);
        if (idx < 0) {
            this.tokenUrls.push(url);
        }
        el.value = '';
    }

    public removeTokenUrl(url: string): void {
        const idx = this.tokenUrls.indexOf(url);
        if (idx > -1) {
            this.tokenUrls.splice(idx, 1);
        }
    }

    public disabledDate = (current: Date): boolean =>
        // Can not select days before today and today
        differenceInCalendarDays(current, new Date()) < 1;

}

export type ArrPropName = 'checkedRoles' | 'checkedPrivileges';
