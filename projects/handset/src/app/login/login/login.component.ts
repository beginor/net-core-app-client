import { Component, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService, LoginModel } from 'app-shared';

import { MatModule } from '../../mat/mat.module';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {

    public model: LoginModel = { };
    public loading = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private accountSvc: AccountService,
        private errorHandler: ErrorHandler
    ) { }

    public async login(): Promise<void> {
        if (this.loading) {
            return;
        }
        try {
            this.loading = true;
            await this.accountSvc.login(this.model);
            await this.accountSvc.getInfo();
            let returnUrl = this.route.snapshot.params['returnUrl'] as string;
            if (!returnUrl) {
                returnUrl = '/home';
            }
            void this.router.navigate(
                [`/${returnUrl}`],
                { replaceUrl: true }
            );
        }
        catch (ex: any) {
            this.errorHandler.handleError(ex);
            this.snackBar.open(
                ex.error ?? ex.toString(), // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, max-len
                '确定',
                { duration: 3000 }
            );
        }
        finally {
            this.loading = false;
        }
    }

}
