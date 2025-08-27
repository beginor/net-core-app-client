import { Component, inject } from '@angular/core';

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

    private ui = inject(UiService);

    protected toggleDrawer(): void {
        this.ui.drawer.subscribe(drawer => {
            void drawer.toggle();
        });
    }

}
