import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators,
} from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NZ_DRAWER_DATA, NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, confirmTo } from 'app-shared';

import { ResetPasswordModel, UsersService } from '../users.service';

@Component({
    selector: 'app-user-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzButtonModule,
        NzCardModule,
        NzFormModule,
        NzIconModule,
        NzInputModule,
        NzSpaceModule,
    ],
    templateUrl: './password.component.html',
    styleUrl: './password.component.css',
})
export class PasswordComponent {

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);
    protected params = inject<PasswordParams>(NZ_DRAWER_DATA);
    protected get title(): string {
        return `重置 ${this.params.fullname} 的密码`;
    }

    protected get password(): FormControl {
        return this.form.get('password') as FormControl;
    }

    protected get confirmPassword(): FormControl {
        return this.form.get('confirmPassword') as FormControl;
    }

    protected form = new FormGroup({
        password: new FormControl(
            { value: '', disabled: !this.params.editable },
            [ Validators.required, Validators.minLength(8) ]
        ),
        confirmPassword: new FormControl(
            { value: '', disabled: !this.params.editable },
            [ Validators.required, confirmTo('password') ]
        )
    });

    protected cancel(): void {
        this.drawerRef.close('');
    }

    protected async save(): Promise<void> {
        await this.vm.resetPass(
            this.params.id,
            this.form.value as unknown as ResetPasswordModel
        );
        this.drawerRef.close('ok');
    }

}

export interface PasswordParams {
    id: string;
    editable: boolean;
    fullname: string;
}
