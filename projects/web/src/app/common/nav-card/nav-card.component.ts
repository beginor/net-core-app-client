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
      <div class="w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          @for (node of nodes; track node.id) {
            @if (node.url !== router.url) {
              <div class="h-full">
                <nz-card class="h-full">
                  <h5 class="text-lg font-bold">
                    <a [routerLink]="node.url" class="hover:text-blue-600 transition-colors">
                      {{node.title}}
                    </a>
                  </h5>
                </nz-card>
              </div>
            }
          }
        </div>
      </div>
    `,
    styles: []
})
export class NavCardComponent {

    protected router = inject(Router);
    protected nav = inject(NavigationService);

}
