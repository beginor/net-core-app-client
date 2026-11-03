import { API_ROOT } from '../config';

const TOKEN_KEY = `Bearer:${API_ROOT}`;

/** Read the persisted bearer token, empty string when not signed in. */
export function getToken(): string {
    return localStorage.getItem(TOKEN_KEY) ?? '';
}

/** Persist the bearer token, empty value is ignored to keep the old behaviour. */
export function saveToken(token: string): void {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

/** Remove the persisted bearer token. */
export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}
