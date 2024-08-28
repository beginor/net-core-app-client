import {
    Component, ErrorHandler, OnDestroy, OnInit, Inject, signal
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {
    AccountService, LoginModel, SvgIconComponent, API_ROOT
} from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {

    protected model: LoginModel = {};
    protected loading = signal(false);
    protected message = signal('');

    protected captchaImageUrl = signal('');

    private siderShown = false;
    private headerShown = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private account: AccountService,
        private errorHandler: ErrorHandler,
        protected ui: UiService,
        @Inject(API_ROOT) private apiRoot: string,
    ) {
        this.updateCaptcha();
    }

    public ngOnInit(): void {
        this.siderShown = this.ui.showSider();
        this.headerShown = this.ui.showHeader();
        this.ui.showHeader.set(false);
        this.ui.showSider.set(false);
    }

    public ngOnDestroy(): void {
        this.ui.showSider.set(this.siderShown);
        this.ui.showHeader.set(this.headerShown);
    }

    public async login(): Promise<void> {
        try {
            this.loading.set(true);
            await this.account.login(this.model);
            await this.account.getInfo();
            let { returnUrl } = this.route.snapshot.params;
            if (!returnUrl) {
                returnUrl = 'home';
            }
            await this.router.navigate(
                [`/${returnUrl}`],
                { replaceUrl: true }
            );
        }
        catch (ex: any) {
            this.errorHandler.handleError(ex);
            const message = typeof ex.error === 'string' ? ex.error : '无法登录！'; // eslint-disable-line max-len, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            this.message.set(message);
            this.model.captcha = '';
            this.updateCaptcha();
        }
        finally {
            this.loading.set(false);
        }
    }

    public clearMessage(): void {
        this.message.set('');
    }

    public passwordKeyUp(e: KeyboardEvent, loginForm: NgForm): void {
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
