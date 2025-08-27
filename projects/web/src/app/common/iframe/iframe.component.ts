import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-iframe',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './iframe.component.html',
    styleUrl: './iframe.component.css',
})
export class IframeComponent implements OnDestroy {

    protected safeUrl?: SafeUrl;

    private actRoute = inject(ActivatedRoute);
    private domSanitizer = inject(DomSanitizer);
    private nav = inject(NavigationService);

    private sub = this.actRoute.params.subscribe(param => {
        const src: string = param['src'];
        if (src.startsWith('http://') || src.startsWith('https://')) {
            this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
                src
            );
        }
        else {
            const iframeUrl = this.nav.findCurrentIframeUrl();
            if (iframeUrl) {
                this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
                    iframeUrl
                );
            }
        }
    });

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

}
