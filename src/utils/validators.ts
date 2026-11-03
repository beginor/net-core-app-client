import type { RuleRender } from 'antd/es/form';

/** Rule requiring the value to equal another form field. */
export function confirmTo(field: string, message = '两次输入的内容不一致！'): RuleRender {
    return ({ getFieldValue }) => ({
        validator(_rule, value: string) {
            if (!value || getFieldValue(field) === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(message));
        },
    });
}
