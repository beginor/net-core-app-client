import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup, FormControl, Validators, FormsModule,
    ReactiveFormsModule
} from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { NZ_DRAWER_DATA, NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';

import { UsersService } from '../users.service';

@Component({
    selector: 'app-user-lock',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzButtonModule,
        NzCardModule,
        NzDatePickerModule,
        NzFormModule,
        NzIconModule,
        NzSpaceModule,
    ],
    templateUrl: './lock.component.html',
    styleUrl: './lock.component.css',
})
export class LockComponent {

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);
    protected params = inject<LockParams>(NZ_DRAWER_DATA);

    protected get title(): string {
        return `锁定 ${this.params.fullname || '用户'}`
    }


    protected get lockoutEnd(): FormControl {
        return this.lockForm.get('lockoutEnd') as FormControl;
    }

    protected lockForm = new FormGroup({
        lockoutEnd: new FormControl(
            { value: new Date(), disabled: !this.params.editable },
            Validators.required
        )
    });


    protected disabledDate = (current: Date): boolean => {
        const today = new Date();
        const diff = current.getTime() - today.getTime();
        return diff < 0;
    };

    protected cancel(): void {
        this.drawerRef.close('');
    }

    protected save(): void {
        const d = this.lockoutEnd.value as Date;
        const lockEndTime = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} 23:59:59`;
        void this.vm.lockUser(this.params.id, lockEndTime).then(
            () => this.drawerRef.close('ok')
        );
    }

}

export interface LockParams {
    id: string;
    editable: boolean;
    fullname: string;
}
