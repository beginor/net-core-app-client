import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class HomeService {

    public message = signal('Hello, angular !');
    public info = signal<string>('');

    private count = 0;

    public updateMessage(): void {
        this.count++;
        const msg = `You have clicked ${this.count} times !`;
        this.message.set(msg);

        if (this.count % 5 === 0) {
            this.info.set('Well done!');
        }
    }

}
