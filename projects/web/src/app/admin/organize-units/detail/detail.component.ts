import { Component, OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { AccountService } from 'app-shared';
import { OrganizeUnitService, AppOrganizeUnitModel } from '../organize-units.service';

@Component({
    selector: 'app-organize-unit-detail',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

    public id = '';
    public get title(): string {
        let title = '';
        if (this.id === '0') {
            title = '新建组织单元';
        }
        else if (this.editable) {
            title = '编辑组织单元';
        }
        else {
            title = '查看组织单元';
        }
        return title;
    }

    public editable = false;
    public model: AppOrganizeUnitModel = { id: '', code: '', name: '', sequence: 0 };
    private reloadList = false;

    constructor(
        private activeOffcanvas: NgbActiveOffcanvas,
        public account: AccountService,
        public vm: OrganizeUnitService
    ) { }

    public async ngOnInit(): Promise<void> {
        if (this.id !== '0') {
            const model = await this.vm.getById(this.id);
            if (!!model) {
                this.model = model;
            }
        }
    }

    public cancel(): void {
        this.activeOffcanvas.dismiss('');
    }

    public async save(): Promise<void> {
        if (this.id !== '0') {
            await this.vm.update(this.id, this.model);
        }
        else {
            await this.vm.create(this.model);
        }
        this.activeOffcanvas.close('ok');
    }

}
