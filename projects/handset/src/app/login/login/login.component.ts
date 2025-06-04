import { Component, ErrorHandler, signal } from '@angular/core';
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

    protected model = signal<LoginModel>({ userName: '', password: '' });
    protected loading = signal(false);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private account: AccountService,
        private errorHandler: ErrorHandler
    ) { }

    public async login(): Promise<void> {
        if (this.loading()) {
            return;
        }
        this.loading.set(true);
        let { returnUrl } = this.route.snapshot.params;
        returnUrl ??= 'home';
        this.account.login(this.model()).subscribe({
            next: () => {
                this.router.navigate(
                    [`/${returnUrl}`],
                    { replaceUrl: true }
                );
            },
            error: (ex: any) => {
                this.errorHandler.handleError(ex);
                this.snackBar.open(
                    ex.error ?? ex.toString(),
                    '确定',
                    { duration: 3000 }
                );
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

}
