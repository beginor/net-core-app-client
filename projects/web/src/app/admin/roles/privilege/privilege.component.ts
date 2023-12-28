import { Component, OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { RolesService } from '../roles.service';

@Component({
    selector: 'app-role-privilege',
    templateUrl: './privilege.component.html',
    styleUrl: './privilege.component.css',
})
export class PrivilegeComponent implements OnInit {

    public title = '';
    public id = '0';

    constructor(
        private activeOffcanvas: NgbActiveOffcanvas,
        public vm: RolesService
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.vm.getPrivilegesForRole(this.id);
        await this.vm.getAllPrivileges();
    }

    public cancel(): void {
        this.activeOffcanvas.dismiss('');
    }

    public async togglePrivilege(e: Event): Promise<void> {
        e.preventDefault();
        e.stopPropagation();
        const checkbox = e.target as HTMLInputElement;
        const privilege = checkbox.value;
        await this.vm.toggleRolePrivilege(this.id, privilege);
    }

}
