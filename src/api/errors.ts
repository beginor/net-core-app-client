/** Error thrown by the http layer, keeps the raw response body for messages. */
export class ApiError extends Error {
    public readonly status: number;
    public readonly body: unknown;

    public constructor(status: number, body: unknown) {
        super(typeof body === 'string' ? body : `HTTP ${status}`);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}

/** Extract a human readable message from an unknown error. */
export function errorMessage(ex: unknown): string {
    if (ex instanceof ApiError) {
        return typeof ex.body === 'string' ? ex.body : ex.message;
    }
    if (ex instanceof Error) {
        return ex.message;
    }
    return String(ex);
}
