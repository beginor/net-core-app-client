import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
    FormGroup, Validators, FormBuilder, FormControl, ReactiveFormsModule,
    FormsModule
} from '@angular/forms';

import {
    AccountService, SvgIconComponent, UserInfo, confirmTo
} from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AntdModule,
    SvgIconComponent,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {

    public user: UserInfo = { id: '' };
    public dob?: Date;
    public loading = false;
    public loadingMessage = '';
    public updatingPwd = false;

    public pwdForm: FormGroup;

    public get currentPassword(): FormControl {
        return this.pwdForm.get('currentPassword') as FormControl;
    }
    public get newPassword(): FormControl {
        return this.pwdForm.get('newPassword') as FormControl;
    }
    public get confirmPassword(): FormControl {
        return this.pwdForm.get('confirmPassword') as FormControl;
    }

    constructor(
        formBuilder: FormBuilder,
        private ui: UiService,
        public account: AccountService,
        @Inject(LOCALE_ID) private localId: string
    ) {
        this.pwdForm = formBuilder.group({
            currentPassword: formBuilder.control(
                { value: '', disabled: false },
                [Validators.required]
            ),
            newPassword: formBuilder.control(
                { value: '', disabled: false},
                [Validators.required, Validators.minLength(8)]
            ),
            confirmPassword: formBuilder.control(
                { value: '', disabled: false },
                [Validators.required, confirmTo('newPassword')]
            )
        });
    }

    public async ngOnInit(): Promise<void> {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '用户信息' }
        ]);
        try {
            this.loading = true;
            this.loadingMessage = '正在加载用户信息 ...';
            const user = await this.account.getUser();
            this.user = user;
            if (user.dateOfBirth) {
                this.dob = new Date(user.dateOfBirth)
            }
        }
        catch (ex: unknown) {
            this.ui.showAlert(
                { type: 'danger', message: '无法获取用户信息！' }
            );
        }
        finally {
            this.loading = false;
        }
    }

    public async saveUser(): Promise<void> {
        if (!this.user) {
            return;
        }
        try {
            this.loading = true;
            this.loadingMessage = '正在更新用户信息 ...';
            if (this.dob) {
                this.user.dateOfBirth = formatDate(
                    this.dob, 'yyyy-MM-dd', this.localId
                );
            }
            this.user = await this.account.updateUser(this.user);
        }
        catch (ex: unknown) {
            this.ui.showAlert(
                { type: 'danger', message: '无法更新用户信息！' }
            );
        }
        finally {
            this.loading = false;
        }
    }

    public async changePassword(): Promise<void> {
        try {
            this.updatingPwd = true;
            await this.account.changePassword(this.pwdForm.value);
            this.ui.showAlert(
                { type: 'success', message: '修改密码成功！' }
            );
            this.pwdForm.reset();
        }
        catch(ex) {
            this.ui.showAlert(
                { type: 'danger', message: '修改密码出错！' }
            );
        }
        finally {
            this.updatingPwd = false;
        }
    }

}
