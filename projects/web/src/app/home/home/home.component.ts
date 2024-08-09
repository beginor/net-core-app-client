import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {

    constructor(
        private ui: UiService,
        protected vm: HomeService,
    ) {}

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页' }
        ]);
    }

}
