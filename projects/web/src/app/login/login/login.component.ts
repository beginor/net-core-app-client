import {
    Component, ErrorHandler, OnDestroy, OnInit, signal, inject
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import {
    AccountService, LoginModel, API_ROOT
} from 'app-shared';
import { UiService } from '../../common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        NzAlertModule,
        NzButtonModule,
        NzCardModule,
        NzFormModule,
        NzIconModule,
        NzInputModule,
        NzToolTipModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {

    protected model = signal<LoginModel>({ userName: '', password: '' });
    protected loading = signal(false);
    protected message = signal('');

    protected captchaImageUrl = signal('');

    private siderShown = false;
    private headerShown = false;

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private account = inject(AccountService);
    private errorHandler = inject(ErrorHandler);
    protected ui = inject(UiService);
    private apiRoot = inject(API_ROOT);

    public ngOnInit(): void {
        this.updateCaptcha();
        this.siderShown = this.ui.showSider();
        this.headerShown = this.ui.showHeader();
        this.ui.showHeader.set(false);
        this.ui.showSider.set(false);
    }

    public ngOnDestroy(): void {
        this.ui.showSider.set(this.siderShown);
        this.ui.showHeader.set(this.headerShown);
    }

    protected login(): void {
        this.loading.set(true);
        let { returnUrl } = this.route.snapshot.params;
        returnUrl ??= 'home';
        this.account.login(this.model()).pipe(
            switchMap(() => this.account.getAccountInfo())
        ).subscribe({
            next: () => {
                this.router.navigate(
                    [`/${returnUrl}`],
                    { replaceUrl: true }
                );
            },
            error: (ex: any) => {
                this.errorHandler.handleError(ex);
                const message = typeof ex.error === 'string' ? ex.error : '无法登录！';
                this.message.set(message);
                this.model.update(m => ({ ...m, captcha: '' }));
                this.updateCaptcha();
                this.loading.set(false);
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

    protected clearMessage(): void {
        this.message.set('');
    }

    protected passwordKeyUp(e: KeyboardEvent, loginForm: NgForm): void {
        if (e.key === 'Enter' && loginForm.valid) {
            void this.login();
        }
    }

    private getCaptchaImageUrl(): string {
        return `${this.apiRoot}/captcha?t=${Date.now()}`;
    }

    protected updateCaptcha(): void {
        this.captchaImageUrl.set(this.getCaptchaImageUrl());
    }

}
