import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { NzCardModule } from 'ng-zorro-antd/card';

import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-nav-card',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NzCardModule,
    ],
    template: `@let nodes = nav.sidebarNodes();
      <div class="row g-0">
        @for (node of nodes; track node.id) {
          @if (node.url !== router.url) {
            <div class="col-md-6 col-lg-3">
              <nz-card class="m-2">
              <h5><a [routerLink]="node.url">{{node.title}}</a></h5>
              </nz-card>
            </div>
          }
        }
      </div>
    `,
    styles: []
})
export class NavCardComponent {

    protected router = inject(Router);
    protected nav = inject(NavigationService);

}
