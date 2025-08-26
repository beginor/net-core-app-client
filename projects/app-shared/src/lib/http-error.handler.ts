import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AccountService } from './account.service';
import { API_ROOT, IS_PRODUCTION } from './inject-tokens';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorHandler implements ErrorHandler {

    private location = inject(Location);
    private http = inject(HttpClient);
    private apiRoot = inject(API_ROOT);
    private isProduction = inject(IS_PRODUCTION);
    private account = inject(AccountService);

    private url = `${this.apiRoot}/client-errors`;

    public handleError(error: unknown): void {
        const err: ErrorModel = {
            userName: this.account.current().userName,
            occuredAt: new Date(),
            userAgent: navigator.userAgent,
            path: this.location.path(),
            message: JSON.stringify(error)
        };
        if (this.isProduction) {
            this.http.post(this.url, err).subscribe({ error: err => {
                console.error(err);
                console.error('Can not send error to server. ', error);
            }});
        }
        else {
            console.error(error);
        }
    }

}

export interface ErrorModel {
    id?: string;
    userName?: string;
    occuredAt?: Date;
    userAgent?: string;
    path?: string;
    message?: string;
}
