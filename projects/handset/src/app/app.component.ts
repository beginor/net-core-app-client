import {
    Component, AfterViewInit, ViewChild
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';

import { UiService } from './services/ui.service';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { MatModule } from './mat/mat.module';

@Component({
    standalone: true,
    selector: 'app-root',
    imports: [
        RouterModule,
        MatModule,
        NavMenuComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {

    @ViewChild(MatDrawer, { static: true })
    public drawer!: MatDrawer;

    constructor(
        private ui: UiService
    ) {
    }

    public ngAfterViewInit(): void {
        this.ui.setDrawer(this.drawer);
    }

}
