import { describe, expect, it } from 'vitest';

import { parseEchartConfig } from './echarts-config';

describe('parseEchartConfig', () => {
    it('keeps plain values', () => {
        expect(parseEchartConfig('title', 'hello')).toBe('hello');
        expect(parseEchartConfig('count', 3)).toBe(3);
        expect(parseEchartConfig('items', [1, 2])).toEqual([1, 2]);
    });

    it('turns a parenthesised string into a function', () => {
        const formatter = parseEchartConfig('formatter', '(value) => { return `${value}%`; }');
        expect(typeof formatter).toBe('function');
        expect((formatter as (v: number) => string)(5)).toBe('5%');
    });

    it('resolves css variables from the document root', () => {
        document.documentElement.style.setProperty('--test-color', '#123456');
        expect(parseEchartConfig('color', '--test-color')).toBe('#123456');
        document.documentElement.style.removeProperty('--test-color');
    });

    it('turns a _lambda array into a function', () => {
        const lambda = parseEchartConfig('formatter', ['_lambda', '(params) => {', 'return params.name;', '}']);
        expect(typeof lambda).toBe('function');
        expect((lambda as (p: { name: string }) => string)({ name: 'a' })).toBe('a');
    });
});
