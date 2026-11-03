import { API_ROOT, isProd } from '../config';
import { ApiError } from './errors';
import { getToken } from './token';

type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
    /** Query string parameters, falsy values are skipped. */
    params?: Record<string, QueryValue>;
    /** Request body, serialized as JSON unless it is a string. */
    body?: unknown;
    /** Expected response type, defaults to json. */
    responseType?: 'json' | 'text' | 'blob';
    /** Abort signal. */
    signal?: AbortSignal;
}

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
    const url = path.startsWith(API_ROOT) ? path : `${API_ROOT}${path}`;
    if (!params) {
        return url;
    }
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            search.set(key, String(value));
        }
    }
    const query = search.toString();
    return query ? `${url}?${query}` : url;
}

/** Report an unexpected client error to the server in production. */
function reportError(ex: unknown, path: string): void {
    if (!isProd()) {
        console.error(ex);
        return;
    }
    const payload = {
        userName: '',
        occuredAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        path: window.location.pathname,
        message: ex instanceof Error ? ex.message : JSON.stringify(ex),
    };
    void fetch(`${API_ROOT}/client-errors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).catch((err: unknown) => {
        console.error('Can not send error to server.', err, path);
    });
}

async function parseBody(response: Response, type: 'json' | 'text' | 'blob'): Promise<unknown> {
    if (type === 'blob') {
        return response.blob();
    }
    const text = await response.text();
    if (type === 'text') {
        return text;
    }
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text) as unknown;
    }
    catch {
        return text;
    }
}

/** Send an authenticated request to the backend API. */
export async function request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const { params, body, responseType = 'json', signal } = options;
    const headers: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest',
    };
    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    try {
        response = await fetch(buildUrl(path, params), {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal,
        });
    }
    catch (ex) {
        reportError(ex, path);
        throw ex;
    }

    const result = await parseBody(response, responseType);
    if (!response.ok) {
        throw new ApiError(response.status, result);
    }
    return result as T;
}

export const http = {
    get: <T = void>(path: string, options?: RequestOptions): Promise<T> =>
        request<T>('GET', path, options),
    post: <T = void>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
        request<T>('POST', path, { ...options, body }),
    put: <T = void>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
        request<T>('PUT', path, { ...options, body }),
    delete: <T = void>(path: string, options?: RequestOptions): Promise<T> =>
        request<T>('DELETE', path, options),
};
