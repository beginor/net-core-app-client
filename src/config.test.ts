import { afterEach, describe, expect, it } from 'vitest';

import { API_ROOT, BASE_PATH, CONTEXT_ROOT, isProd } from './config';

function setLocation(url: string): void {
    window.history.replaceState({}, '', url);
}

describe('config', () => {
    afterEach(() => setLocation('/'));

    it('derives the api root and base path from the context root', () => {
        expect(CONTEXT_ROOT).toBe('/net-core-app');
        expect(API_ROOT).toBe('/net-core-app/api');
        expect(BASE_PATH).toBe('/net-core-app/web');
    });

    it('treats localhost as development', () => {
        setLocation('/?');
        expect(isProd()).toBe(false);
    });

    it('honours the mode query string', () => {
        setLocation('/?mode=prod');
        expect(isProd()).toBe(true);
        setLocation('/?mode=dev');
        expect(isProd()).toBe(false);
    });
});
