import { Component, ErrorHandler, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { AccountService, LoginModel, SvgIconComponent } from 'app-shared';
import { AntdModule, UiService } from 'projects/web/src/app/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AntdModule,
        SvgIconComponent,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {

    public model: LoginModel = {};
    public loading = false;
    public message = new Subject<string | undefined>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private acntSvc: AccountService,
        private errorHandler: ErrorHandler,
        private ui: UiService,
    ) { }

    public ngOnInit(): void {
        this.ui.showSider = false;
        this.ui.showHeader = false;
    }

    public ngOnDestroy(): void {
        this.ui.showSider = true;
        this.ui.showHeader = true;
    }

    public async login(): Promise<void> {
        try {
            this.loading = true;
            await this.acntSvc.login(this.model);
            await this.acntSvc.getInfo();
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
            this.message.next(message);
        }
        finally {
            this.loading = false;
        }
    }

    public clearMessage(): void {
        this.message.next(undefined);
    }

    public passwordKeyUp(e: KeyboardEvent, loginForm: NgForm): void {
        if (e.key === 'Enter' && loginForm.valid) {
            void this.login();
        }
    }

}
