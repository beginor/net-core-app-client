import { describe, expect, it } from 'vitest';

import { decodeBase64Url, encodeBase64Url } from './base64-url';

describe('base64Url', () => {
    it('encodes without padding and with url safe characters', () => {
        expect(encodeBase64Url('admin')).toBe('YWRtaW4');
        expect(encodeBase64Url('a?b>c')).toBe('YT9iPmM');
    });

    it('round trips ascii and unicode', () => {
        for (const text of ['', 'admin', 'P@ssw0rd!', '中文密码']) {
            expect(decodeBase64Url(encodeBase64Url(text))).toBe(text);
        }
    });

    it('rejects an invalid length', () => {
        expect(() => decodeBase64Url('abcde')).toThrow();
    });
});
