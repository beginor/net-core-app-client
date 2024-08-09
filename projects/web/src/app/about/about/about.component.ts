import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiService } from 'projects/web/src/app/common';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {

    constructor(
        private ui: UiService,
    ) { }

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页', url: '/' },
            { label: '关于' }
        ]);
    }

}
