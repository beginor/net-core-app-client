import { Routes } from '@angular/router';

import { UserInfoComponent } from './user-info/user-info.component';
import { TokenListComponent } from './token-list/token-list.component';
import { TokenDetailComponent } from './token-detail/token-detail.component';

const routes: Routes = [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', component: UserInfoComponent },
    {
        path: 'tokens',
        component: TokenListComponent,
        children: [
            { path: ':id', component: TokenDetailComponent }
        ]
    },
];

export default routes;
