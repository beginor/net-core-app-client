import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-nav-card',
    template: `@if (nav.sidebarNodes | async; as nodes) {
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
    }
    `,
    styles: []
})
export class NavCardComponent {

    constructor(
        public router: Router,
        public nav: NavigationService
    ) {  }

}
