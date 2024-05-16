import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators
} from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import {
    AccountService, confirmTo, SvgIconComponent
} from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { UsersService } from '../users.service';

@Component({
    selector: 'app-user-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './password.component.html',
    styleUrl: './password.component.css',
})
export class PasswordComponent {

    public userId = '';
    public fullname = '';
    public get title(): string {
        return `重置 ${this.fullname} 的密码`;
    }
    public editable = true;
    public form: FormGroup;

    public get password(): FormControl {
        return this.form.get('password') as FormControl;
    }

    public get confirmPassword(): FormControl {
        return this.form.get('confirmPassword') as FormControl;
    }

    constructor(
        private drawerRef: NzDrawerRef,
        public account: AccountService,
        public vm: UsersService
    ) {
        this.form = new FormGroup({
            password: new FormControl(
                { value: '', disabled: !this.editable },
                [ Validators.required, Validators.minLength(8) ]
            ),
            confirmPassword: new FormControl(
                { value: '', disabled: !this.editable },
                [ Validators.required, confirmTo('password') ]
            )
        });
    }

    public cancel(): void {
        this.drawerRef.close('');
    }

    public async save(): Promise<void> {
        await this.vm.resetPass(this.userId, this.form.value);
        this.drawerRef.close('ok')
    }

}
