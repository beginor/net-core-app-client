import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { AccountService } from 'app-shared';
import { UiService } from 'projects/web/src/app/common';

import { UsersService, UserModel, StringIdNameModel } from '../users.service';
import { DetailComponent, DetailParams } from '../detail/detail.component';
import { LockComponent, LockParams } from '../lock/lock.component';
import { PasswordComponent, PasswordParams } from '../password/password.component';
import { RolesComponent, RolesParams } from '../roles/roles.component';
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
        NzButtonModule,
        NzCardModule,
        NzDrawerModule,
        NzDropDownModule,
        NzFormModule,
        NzIconModule,
        NzInputModule,
        NzSelectModule,
        NzSpaceModule,
        NzTableModule,
        NzToolTipModule,
        NzTreeModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {

    protected organizeUnit?: StringIdNameModel;

    private route = inject(ActivatedRoute);
    private drawerService = inject(NzDrawerService);
    private ui = inject(UiService);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);
    protected organizeUnitSvc = inject(OrganizeUnitService);

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '管理', url: '/admin/dashboard' },
            { label: '用户管理' }
        ]);

        const { roleName } = this.route.snapshot.params;
        if (roleName) {
            this.vm.searchModel.roleName = roleName as string;
        }
        else {
            this.vm.searchModel.roleName = '';
        }

        this.vm.searchModel.organizeUnitId = '';
        void this.loadOrganizeUnit();
    }

    protected async loadData({
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

    protected async loadOrganizeUnit(): Promise<void> {
        await this.organizeUnitSvc.search();
        this.organizeUnitSvc.subscribeDataToTreeNodes();
    }

    protected showDetail(id: string, editable: boolean): void {
        const ref = this.drawerService.create<DetailComponent, DetailParams, string>({ // eslint-disable-line @stylistic/max-len
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

    protected showLock(user: UserModel): void {
        const ref = this.drawerService.create<LockComponent, LockParams, string>({ // eslint-disable-line @stylistic/max-len
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: LockComponent,
            nzBodyStyle: { padding: '0' },
            nzData: {
                id: user.id,
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

    protected showPassword(user: UserModel): void {
        const ref = this.drawerService.create<PasswordComponent, PasswordParams, string>({  // eslint-disable-line @stylistic/max-len
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: PasswordComponent,
            nzBodyStyle: { padding: '0' },
            nzData: {
                id: user.id,
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

    protected showRoles(user: UserModel): void {
        const ref = this.drawerService.create<RolesComponent, RolesParams, string>({ // eslint-disable-line @stylistic/max-len
            nzClosable: false,
            nzPlacement: 'right',
            nzWidth: '40vw',
            nzContent: RolesComponent,
            nzBodyStyle: { padding: '0' },
            nzData: {
                id: user.id,
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

    protected async delete(id: string): Promise<void> {
        const deleted = await this.vm.delete(id);
        if (deleted) {
            void this.vm.search();
        }
    }

    protected getFullname(user: UserModel): string {
        const fullname = [];
        if (user.surname) {
            fullname.push(user.surname);
        }
        if (user.givenName) {
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

    protected cleanUserSearch(): void {
        this.vm.searchModel.userName = '';
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    protected research(): void {
        this.vm.pageIndex = 1;
        void this.vm.search();
    }

    protected isLockout(user: UserModel): boolean {
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

    protected canViewGears(): boolean {
        const p = this.account.current().privileges;
        if (!p) {
            return false;
        }
        return (p['app_users.update'] ?? (p['app_users.delete'])
            ?? (p['app_users.reset_pass']) ?? (p['app_users.lock'])
            ?? p['app_users.unlock']) ?? p['app_users.read_user_roles'];
    }

    protected getUserCount(): number {
        const usersCount = this.vm.roles.getValue()
            .map(r => r.userCount ?? 0)
            .reduce((prev, curr) => prev + curr, 0);
        return usersCount;
    }

    protected onOrganizeUnitClick(event: NzFormatEmitEvent): void {
        if (event.node) {
            this.organizeUnit = {
                id: event.node.key,
                name: event.node.title
            };
            this.vm.searchModel.organizeUnitId = this.organizeUnit.id;
            void this.vm.search();
        }
    }

}
