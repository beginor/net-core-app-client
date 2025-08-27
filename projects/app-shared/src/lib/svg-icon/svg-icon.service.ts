import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { share, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SvgIconService {

    private basePath = 'assets/';
    private loadingMap = new Map<string, Observable<string>>();

    private http = inject(HttpClient);

    public setBasePath(basePath: string): void {
        this.basePath = basePath;
    }

    public loadSvgFile(path: string): Observable<string> {
        const key = `svg-icon:${path}`;
        const loadedItem = sessionStorage.getItem(key);

        if (loadedItem) {
            return of(loadedItem);
        }

        if (this.loadingMap.has(key)) {
            return this.loadingMap.get(key)!;
        }

        let url = `${this.basePath}/${path}`;
        if (!url.endsWith('.svg')) {
            url += '.svg';
        }

        const loadingOp = this.http.get(url, { responseType: 'text' }).pipe(
            tap({
                next: (val) => sessionStorage.setItem(key, val),
                complete: () => this.loadingMap.delete(key)
            }),
            share()
        );

        this.loadingMap.set(key, loadingOp);
        return loadingOp;
    }
}
