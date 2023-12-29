import { Component } from '@angular/core';

import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-nav-card',
    template: `
      <div class="row g-0" *ngIf="(nav.sidebarNodes | async) as nodes">
        <div class="col-md-6 col-lg-3" *ngFor="let node of nodes">
          <nz-card class="m-2">
          <h5><a [routerLink]="node.url">{{node.title}}</a></h5>
          </nz-card>
        </div>
      </div>
    `,
    styles: []
})
export class NavCardComponent {

    constructor(
        public nav: NavigationService
    ) { }

}
