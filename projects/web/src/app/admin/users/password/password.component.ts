import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators
} from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import {
    AccountService, confirmTo, SvgIconComponent
} from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { ResetPasswordModel, UsersService } from '../users.service';

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

    protected userId = '';
    protected fullname = '';
    protected get title(): string {
        return `重置 ${this.fullname} 的密码`;
    }
    protected editable = true;

    protected get password(): FormControl {
        return this.form.get('password') as FormControl;
    }

    protected get confirmPassword(): FormControl {
        return this.form.get('confirmPassword') as FormControl;
    }

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);

    protected form = new FormGroup({
        password: new FormControl(
            { value: '', disabled: !this.editable },
            [ Validators.required, Validators.minLength(8) ]
        ),
        confirmPassword: new FormControl(
            { value: '', disabled: !this.editable },
            [ Validators.required, confirmTo('password') ]
        )
    });

    protected cancel(): void {
        this.drawerRef.close('');
    }

    protected async save(): Promise<void> {
        await this.vm.resetPass(
            this.userId,
            this.form.value as unknown as ResetPasswordModel
        );
        this.drawerRef.close('ok');
    }

}
