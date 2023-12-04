import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrl: './confirm.component.css',
})
export class ConfirmComponent {

    public title = '提示：';
    public message = '确认么？';

    constructor(
        public modal: NgbActiveModal
    ) { }

}
