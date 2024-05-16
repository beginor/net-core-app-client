import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiService } from 'projects/web/src/app/common';
import { HomeService } from './home.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {

    constructor(
        public ui: UiService,
        public vm: HomeService,
    ) {
        ui.breadcrumbs = [
            { label: '首页' }
        ];
    }

}
