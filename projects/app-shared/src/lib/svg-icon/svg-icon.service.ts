import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SvgIconService {

    private basePath = 'assets/icons';
    private loadingMap = new Map<string, Observable<string>>();

    constructor(private http: HttpClient) {
    }

    public setBasePath(basePath: string): void {
        this.basePath = basePath;
    }

    public loadSvgFile(path: string): Promise<string> {
        const key = `svg-icon:${path}`;
        const loadedItem = sessionStorage.getItem(key);
        if (loadedItem) {
            return Promise.resolve(loadedItem);
        }
        if (this.loadingMap.has(key)) {
            const op = this.loadingMap.get(key);
            return new Promise<string>((resolve, reject) => {
                op?.subscribe({
                    next: val => resolve(val),
                    error: ex => reject(ex)
                });
            });
        }
        let url = `${this.basePath}/${path}`;
        if (!url.endsWith('.svg')) {
            url += '.svg';
        }
        const loadingOp = this.http.get(url, { responseType: 'text' })
            .pipe(share());
        this.loadingMap.set(key, loadingOp);
        return new Promise<string>((resolve, reject) => {
            loadingOp.subscribe({
                next: val => {
                    sessionStorage.setItem(key, val);
                    resolve(val);
                },
                error: ex => {
                    reject(ex);
                },
                complete: () => {
                    this.loadingMap.delete(key);
                }
            });
        });
    }

}
