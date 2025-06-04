import { Component, OnInit, Inject, LOCALE_ID, signal } from '@angular/core';
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

    public user = signal<UserInfo>({ id: '' });
    public dob = signal<Date | undefined>(undefined);
    public loading = signal(false);
    public loadingMessage = signal('');
    public updatingPwd = signal(false);

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
                { value: '', disabled: false },
                [Validators.required, Validators.minLength(8)]
            ),
            confirmPassword: formBuilder.control(
                { value: '', disabled: false },
                [Validators.required, confirmTo('newPassword')]
            )
        });
    }

    public ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '用户信息' }
        ]);

        this.loading.set(true);
        this.loadingMessage.set('正在加载用户信息 ...');
        this.account.getUser().subscribe({
            next: user => {
                this.user.set(user);
                if (user.dateOfBirth) {
                    this.dob.set(new Date(user.dateOfBirth));
                }
            },
            error: (err: unknown) => {
                console.error(err);
                this.ui.showAlert(
                    { type: 'danger', message: '无法获取用户信息！' }
                );
            },
            complete: () => {
                this.loading.set(false);
                this.loadingMessage.set('');
            }
        });
    }

    public async saveUser(): Promise<void> {
        const user = this.user();
        if (!user.id) {
            return;
        }
        this.loading.set(true);
        this.loadingMessage.set('正在更新用户信息 ...');
        const dob = this.dob();
        if (dob) {
            user.dateOfBirth = formatDate(dob, 'yyyy-MM-dd', this.localId);
        }
        this.account.updateUser(user).subscribe({
            next: user => {
                this.user.set(user);
                this.ui.showAlert(
                    { type: 'success', message: '用户信息已更新！' }
                );
            },
            error: (err: unknown) => {
                console.error(err);
                this.ui.showAlert(
                    { type: 'danger', message: '无法更新用户信息！' }
                );
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

    public async changePassword(): Promise<void> {
        this.updatingPwd.set(true);
        this.account.changePassword(this.pwdForm.value).subscribe({
            next: () => {
                this.ui.showAlert(
                    { type: 'success', message: '修改密码成功！' }
                );
                this.pwdForm.reset();
            },
            error: (err: unknown) => {
                console.error(err);
                this.ui.showAlert(
                    { type: 'danger', message: '修改密码出错！' }
                );
            },
            complete: () => {
                this.updatingPwd.set(false);
            }
        });
    }

}
