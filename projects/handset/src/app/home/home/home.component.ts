import { Component } from '@angular/core';

import { UiService } from '../../services/ui.service';
import { MatModule } from '../../mat/mat.module';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        MatModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {

    constructor(
        private ui: UiService
    ) { }

    public toggleDrawer(): void {
        this.ui.drawer.subscribe(drawer => {
            drawer.toggle();
        });
    }

}
