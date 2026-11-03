/** Encode a string as unpadded base64url, matching the backend decoder. */
export function encodeBase64Url(input: string): string {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/** Decode an unpadded base64url string. */
export function decodeBase64Url(input: string): string {
    let value = input.replace(/-/g, '+').replace(/_/g, '/');
    const remainder = value.length % 4;
    if (remainder === 2) {
        value += '==';
    }
    else if (remainder === 3) {
        value += '=';
    }
    else if (remainder !== 0) {
        throw new Error(`Invalid base64 string ${input}`);
    }
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}
