import type { FormInstance } from 'antd/es/form';
import { describe, expect, it } from 'vitest';

import { confirmTo } from './validators';

interface ValidatorRule {
    validator: (rule: unknown, value: string) => Promise<void>;
}

function run(rule: ReturnType<typeof confirmTo>, value: string, other: string): Promise<void> {
    const form = { getFieldValue: () => other } as unknown as FormInstance;
    return (rule(form) as ValidatorRule).validator({}, value);
}

describe('confirmTo', () => {
    it('passes when both values are equal', async () => {
        await expect(run(confirmTo('password'), 'abc', 'abc')).resolves.toBeUndefined();
    });

    it('passes when the value is empty', async () => {
        await expect(run(confirmTo('password'), '', 'abc')).resolves.toBeUndefined();
    });

    it('rejects when the values differ', async () => {
        await expect(run(confirmTo('password'), 'abc', 'abd'))
            .rejects.toThrow('两次输入的内容不一致！');
    });

    it('uses the custom message', async () => {
        await expect(run(confirmTo('password', '不一致'), 'a', 'b')).rejects.toThrow('不一致');
    });
});
