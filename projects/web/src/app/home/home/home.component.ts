import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiService, AntdModule, AttachmentUploadComponent } from 'projects/web/src/app/common';
import { HomeService } from './home.service';

import { AttachmentListComponent } from 'projects/web/src/app/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
    CommonModule,
    AntdModule,
    AttachmentListComponent,
    AttachmentUploadComponent
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
