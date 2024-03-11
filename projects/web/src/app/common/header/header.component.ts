import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from 'app-shared';
import { UiService } from '../services/ui.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

    constructor(
        public account: AccountService,
        public ui: UiService,
        public nav: NavigationService,
        private router: Router
    ) {  }

    public async logout(): Promise<void> {
        await this.account.logout();
        await this.router.navigateByUrl('/');
    }


}
