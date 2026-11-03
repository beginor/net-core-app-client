/** Deployment context root, must match ASPNETCORE_PATHBASE on the server. */
export const CONTEXT_ROOT = '/net-core-app';

/** API root, all backend requests are prefixed with it. */
export const API_ROOT = `${CONTEXT_ROOT}/api`;

/** Router basename, the app is mounted at /net-core-app/web/. */
export const BASE_PATH = `${CONTEXT_ROOT}/web`;

function getQueryString(name: string): string | null {
    return new URLSearchParams(window.location.search).get(name);
}

/** Production detection, can be overridden with ?mode=prod|dev. */
export function isProd(): boolean {
    const mode = getQueryString('mode');
    if (mode === 'prod') {
        return true;
    }
    if (mode === 'dev') {
        return false;
    }
    return !['127.0.0.1', 'localhost'].includes(window.location.hostname);
}
