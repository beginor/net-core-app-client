import {
    Component, ElementRef, AfterViewInit, signal, input, effect, untracked
} from '@angular/core';

import { SvgIconService } from './svg-icon.service';

// eslint-disable-next-line max-len
const defaultIcon = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-app" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11 2H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/></svg>';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'svg-icon',
    template: defaultIcon,
    styles: []
})
export class SvgIconComponent implements AfterViewInit {

    private viewInited = signal(false);

    public iconPath = input('');
    public iconSize = input('1rem');
    public iconClass = input('');

    private svgClass = '';
    private currentIcon = '';

    constructor(
        private el: ElementRef<HTMLElement>,
        private svg: SvgIconService
    ) {
        effect(() => {
            const viewInited = this.viewInited();
            if (!viewInited) {
                return;
            }
            const iconPath = this.iconPath();
            const iconSize = this.iconSize();
            const iconClass = this.iconClass();
            untracked(() => {
                if (iconPath) {
                    void this.updateIcon(iconPath).then(() => {
                        this.updateIconClass(iconClass);
                        this.updateIconSize(iconSize);
                    });
                }
                else {
                    this.el.nativeElement.innerHTML = defaultIcon;
                    this.updateIconClass(iconClass);
                    this.updateIconSize(iconSize);
                }
            });
        });
    }

    public ngAfterViewInit(): void {
        const svg = this.el.nativeElement.firstChild as SVGElement;
        this.svgClass = svg.getAttribute('class') ?? '';
        this.viewInited.set(true);
    }

    private async updateIcon(iconPath: string): Promise<void> {
        if (this.currentIcon === iconPath) {
            return;
        }
        this.currentIcon = iconPath;
        let svg = this.el.nativeElement.firstChild as SVGElement;
        const xml = await this.svg.loadSvgFile(iconPath);
        svg.remove();
        this.el.nativeElement.innerHTML = xml;
        svg = this.el.nativeElement.firstChild as SVGElement;
        svg.setAttribute('fill', 'currentColor');
        this.svgClass = svg.getAttribute('class') ?? '';
    }

    private updateIconClass(iconClass: string): void {
        const svg = this.el.nativeElement.firstChild as SVGElement;
        if (!svg) {
            return;
        }
        svg.setAttribute('class', `${this.svgClass} ${iconClass}`);
    }

    private updateIconSize(iconSize: string): void {
        const svg = this.el.nativeElement.firstChild as SVGElement;
        if (!svg) {
            return;
        }
        if (!iconSize) {
            return;
        }
        svg.setAttribute('width', iconSize);
        svg.setAttribute('height', iconSize);
    }

}
