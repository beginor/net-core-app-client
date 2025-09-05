import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { UiService } from 'projects/web/src/app/common';
import { HomeService } from './home.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        NzAlertModule,
        NzButtonModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

    private ui = inject(UiService);
    protected vm = inject(HomeService);

    public ngOnInit(): void {
        this.ui.breadcrumbs.set([
            { label: '首页' }
        ]);
    }

}
