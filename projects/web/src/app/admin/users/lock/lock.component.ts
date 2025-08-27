import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup, FormControl, Validators, FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

import { AccountService, SvgIconComponent } from 'app-shared';
import { AntdModule } from 'projects/web/src/app/common';

import { UsersService } from '../users.service';

@Component({
    selector: 'app-user-lock',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './lock.component.html',
    styleUrl: './lock.component.css',
})
export class LockComponent {

    protected editable = true;

    protected userId = '';
    protected fullname = '';
    protected get title(): string {
        return `锁定 ${this.fullname || '用户'}`
    }


    protected get lockoutEnd(): FormControl {
        return this.lockForm.get('lockoutEnd') as FormControl;
    }

    private drawerRef = inject(NzDrawerRef);
    protected account = inject(AccountService);
    protected vm = inject(UsersService);

    protected lockForm = new FormGroup({
        lockoutEnd: new FormControl(
            { value: new Date(), disabled: !this.editable },
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
        void this.vm.lockUser(this.userId, lockEndTime).then(
            () => this.drawerRef.close('ok')
        );
    }

}
