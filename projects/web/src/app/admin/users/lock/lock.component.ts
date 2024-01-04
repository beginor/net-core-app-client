import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService } from 'app-shared';
import { UsersService } from '../users.service';

@Component({
    selector: 'app-user-lock',
    templateUrl: './lock.component.html',
    styleUrl: './lock.component.css',
})
export class LockComponent {

    public editable = true;

    public lockForm: FormGroup;

    public userId = '';
    public fullname = '';
    public get title(): string {
        return `锁定 ${this.fullname || '用户'}`
    }


    public get lockoutEnd(): FormControl {
        return this.lockForm.get('lockoutEnd') as FormControl;
    }

    constructor(
        private drawerRef: NzDrawerRef,
        public account: AccountService,
        public vm: UsersService
    ) {
        this.lockForm  = new FormGroup({
            lockoutEnd: new FormControl(
                { value: new Date(), disabled: !this.editable },
                Validators.required
            )
        });
    }

    public disabledDate = (current: Date): boolean => {
        const today = new Date();
        const diff = current.getTime() - today.getTime();
        return diff < 0;
    };

    public cancel(): void {
        this.drawerRef.close('');
    }

    public save(): void {
        const d = this.lockoutEnd.value as Date;
        // eslint-disable-next-line max-len
        const lockEndTime = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} 23:59:59`;
        void this.vm.lockUser(this.userId, lockEndTime).then(
            () => this.drawerRef.close('ok')
        );
    }

}
