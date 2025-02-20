export function isProd(): boolean {
    const mode = getQueryString('mode');
    if (mode) {
        if (mode === 'prod') { return true; }
        if (mode === 'dev') { return false; }
    }
    return !['127.0.0.1', 'localhost'].includes(location.hostname);
}

function getQueryString(key: string): string | null {
    const query = new URLSearchParams(location.search);
    return query.get(key);
}
