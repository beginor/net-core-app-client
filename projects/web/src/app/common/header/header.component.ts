import { Component } from '@angular/core';
import { UiService } from '../services/ui.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

    constructor(
        public ui: UiService,
        public nav: NavigationService,
    ) {  }

}
