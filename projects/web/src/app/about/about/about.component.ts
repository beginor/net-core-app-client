import { Component } from '@angular/core';

import { UiService } from 'projects/web/src/app/common';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrl: './about.component.css',
})
export class AboutComponent {

    constructor(
        private ui: UiService,
    ) {
        ui.breadcrumbs = [
            { label: '首页', url: '/' },
            { label: '关于' }
        ];
    }

}
