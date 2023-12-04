import { Component } from '@angular/core';

import { UiService } from '../../services/ui.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrl: './about.component.css',
})
export class AboutComponent {

    constructor(
        private ui: UiService
    ) { }

    public toggleDrawer(): void {
        this.ui.drawer.subscribe(drawer => {
            drawer.toggle();
        });
    }

}
