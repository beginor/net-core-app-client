import { Component, inject } from '@angular/core';

import { UiService } from '../../services/ui.service';
import { MatModule } from '../../mat/mat.module';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [
        MatModule
    ],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css',
})
export class AboutComponent {

    private ui = inject(UiService);

    protected toggleDrawer(): void {
        this.ui.drawer.subscribe(drawer => {
            void drawer.toggle();
        });
    }

}
