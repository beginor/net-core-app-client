import { NgModule } from '@angular/core';

import {
    NgbAlertModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule,
    NgbCollapseModule, NgbNavModule, NgbDatepickerModule, NgbPaginationModule,
    NgbOffcanvasModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        NgbAlertModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbTooltipModule,
        NgbCollapseModule,
        NgbNavModule,
        NgbDatepickerModule,
        NgbPaginationModule,
        NgbOffcanvasModule,
    ],
    exports: [
        NgbAlertModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbTooltipModule,
        NgbCollapseModule,
        NgbNavModule,
        NgbDatepickerModule,
        NgbPaginationModule,
        NgbOffcanvasModule,
    ]
})
export class NgbModule { }
