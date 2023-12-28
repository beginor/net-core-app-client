import { Component, OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { AccountService } from 'app-shared';
import { UserModel, UsersService } from '../users.service';
import {
    OrganizeUnitService
} from '../../organize-units/organize-units.service';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
    selector: 'app-users-detail',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    public editable = false;
    public id = '0';

    public getTitle(): string {
        if (this.id === '0') {
            return '新建菜单项';
        }
        else if (this.editable) {
            return '编辑菜单项';
        }
        else {
            return '查看菜单项';
        }
    }

    public model: UserModel = {
        id: '0',
        lockoutEnabled: true, gender: '保密',
        organizeUnit: { id: '', name: '' }
    };
    public dateOfBirthDate: Date = new Date('1970-01-01');

    constructor(
        private activeOffcanvas: NgbActiveOffcanvas,
        public account: AccountService,
        public vm: UsersService,
        public organizeUnitSvc: OrganizeUnitService,
    ) { }

    public async ngOnInit(): Promise<void> {
        if (this.id !== '0') {
            const model = await this.vm.getById(this.id);
            if (!!model) {
                this.model = model;
            }
            if (!!this.model.dateOfBirth) {
                this.dateOfBirthDate = new Date(this.model.dateOfBirth);
            }
        }
        // this.initOrganizeUnit();
    }

    public initOrganizeUnit(): void {
        void this.organizeUnitSvc.search();
        this.organizeUnitSvc.subscribeDataToTreeNodes();
    }

    public cancel(): void {
        this.activeOffcanvas.dismiss('');
    }

    public async save(): Promise<void> {
        const dateOfBirth = `${this.dateOfBirthDate.getFullYear()
            }-${this.dateOfBirthDate.getMonth() + 1
            }-${this.dateOfBirthDate.getDate()}`;
        this.model.dateOfBirth = dateOfBirth;
        if (this.id !== '0') {
            await this.vm.update(this.id, this.model);
        }
        else {
            await this.vm.create(this.model);
        }
        this.activeOffcanvas.close('ok');
    }

    public onOrganizeUnitClick(event: NzFormatEmitEvent)
        : void {
        if (event.node) {
            this.model.organizeUnit = {
                id: event.node.key,
                name: event.node.title,
            }
        }
    }
}
