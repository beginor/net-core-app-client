import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

import { UsersService, UserModel, StringIdNameModel } from '../users.service';
import { DetailComponent } from '../detail/detail.component';
import { LockComponent } from '../lock/lock.component';
import { PasswordComponent } from '../password/password.component';
import { RolesComponent } from '../roles/roles.component';
import {
    OrganizeUnitService
} from '../../organize-units/organize-units.service';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
    selector: 'app-admin-users-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {

    public organizeUnit?: StringIdNameModel;

    constructor(
        route: ActivatedRoute,
        private drawerService: NzDrawerService,
        private ui: UiService,
        public account: AccountService,
        public vm: UsersService,
        public organizeUnitSvc: OrganizeUnitService,
    ) {
        ui.breadcrumbs = [
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin' },
            { label: '用户管理' }
        ];
        const { roleName } = route.snapshot.params;
        if (!!roleName) {
            vm.searchModel.roleName = roleName as string;
        }
        else {
            vm.searchModel.roleName = '';
        }
    }

    public async ngOnInit(): Promise<void> {
        this.vm.searchModel.organizeUnitId = '';
        await this.loadOrganizeUnit();
    }

    public async loadData({
        pageSize = 20,
        pageIndex = 1,
        // sort = [],
        // filter = [],
    }: Partial<NzTableQueryParams>): Promise<void> {
        this.vm.pageSize = pageSize;
        this.vm.pageIndex = pageIndex;
        await this.vm.getRoles();
        await this.vm.search();
    }

    public async loadOrganizeUnit(): Promise<void> {
        await this.organizeUnitSvc.search();
        this.organizeUnitSvc.subscribeDataToTreeNodes();
    }

    public showDetail(id: string, editable: boolean): void {
        const ref = this.drawerService.create<
            DetailComponent,
            Partial<DetailComponent>,
            string
        >({
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: DetailComponent,
            nzBodyStyle: { padding: '0' },
            nzData: { id, editable },
        });
        ref.afterClose.subscribe(result => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    public showLock(user: UserModel): void {
        const ref = this.drawerService.create<
            LockComponent,
            Partial<LockComponent>,
            string
        >({
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: LockComponent,
            nzBodyStyle: { padding: '0' },
            nzData: {
                userId: user.id,
                fullname: this.getFullname(user),
                editable: true
            },
        });
        ref.afterClose.subscribe(result => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    public showPassword(user: UserModel): void {
        const ref = this.drawerService.create<
            PasswordComponent,
            Partial<PasswordComponent>,
            string
        >({
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: PasswordComponent,
            nzBodyStyle: { padding: '0' },
            nzData: {
                userId: user.id,
                fullname: this.getFullname(user),
                editable: true
            },
        });
        ref.afterClose.subscribe(result => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    public showRoles(user: UserModel): void {
        const ref = this.drawerService.create<
            RolesComponent,
            Partial<RolesComponent>,
            string
        >({
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: RolesComponent,
            nzBodyStyle: { padding: '0' },
            nzData: {
                userId: user.id,
                fullname: this.getFullname(user),
                editable: true
            },
        });
        ref.afterClose.subscribe(result => {
            if (result === 'ok') {
                void this.vm.search();
            }
        });
    }

    public async delete(id: string): Promise<void> {
        const deleted = await this.vm.delete(id);
        if (deleted) {
            void this.vm.search();
        }
    }

    public getFullname(user: UserModel): string {
        const fullname = [];
        if (!!user.surname) {
            fullname.push(user.surname);
        }
        if (!!user.givenName) {
            fullname.push(user.givenName);
        }
        if (fullname.length > 0) {
            fullname.push('(');
        }
        fullname.push(user.userName);
        if (fullname.length > 1) {
            fullname.push(')');
        }
        return fullname.join('');
    }

    public cleanUserSearch(): void {
        this.vm.searchModel.userName = '';
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    public research(): void {
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    public isLockout(user: UserModel): boolean {
        if (!user.lockoutEnabled) {
            return false;
        }
        if (!user.lockoutEnd) {
            return false;
        }
        else {
            const lockoutEnd = new Date(user.lockoutEnd);
            return lockoutEnd > new Date();
        }
    }

    public canViewGears(): boolean {
        const p = this.account.info.getValue().privileges;
        if (!p) {
            return false;
        }
        return p['app_users.update'] || p['app_users.delete']
            || p['app_users.reset_pass'] || p['app_users.lock']
            || p['app_users.unlock'] || p['app_users.read_user_roles'];
    }

    public getUserCount(): number {
        const usersCount = this.vm.roles.getValue()
            .map(r => r.userCount || 0)
            .reduce((prev, curr) => prev + curr, 0);
        return usersCount;
    }

    public onOrganizeUnitClick(event: NzFormatEmitEvent): void {
        if (event.node) {
            this.organizeUnit = {
                id: event.node.key,
                name: event.node.title
            };
            this.vm.searchModel['organizeUnitId'] = this.organizeUnit.id;
            void this.vm.search();
        }
    }

}
