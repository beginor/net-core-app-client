import type { EChartsOption } from 'echarts';

export interface EchartProps {
    data: { url: string };
    echarts: EChartsOption;
    beforeSetChartOptions?: (options: EChartsOption) => void;
}

/**
 * JSON.parse reviver supporting the three extensions used by the chart configs:
 * a "(" ... "}" string is a function, a "--name" string is a CSS variable, and
 * an array starting with "_lambda" is a multi-line function body.
 */
export function parseEchartConfig(_key: string, val: unknown): unknown {
    if (typeof val === 'string') {
        if (val.startsWith('(') && val.endsWith('}')) {
            return (0, eval)(`(${val})`) as unknown;
        }
        if (val.startsWith('--')) {
            return getComputedStyle(document.documentElement).getPropertyValue(val);
        }
    }
    if (Array.isArray(val)) {
        const last = val[val.length - 1];
        if (val[0] === '_lambda' && last === '}') {
            const lambda = val.slice(1).join('\n');
            return (0, eval)(`(${lambda})`) as unknown;
        }
    }
    return val;
}

/** Loading placeholder animation shown before the data arrives. */
export function createInitEchartsOption(): EChartsOption {
    const columns = Array.from({ length: 10 }, (_, i) => ({
        type: 'rect',
        x: i * 20,
        shape: { x: 0, y: -40, width: 10, height: 80 },
        style: { fill: '#5470c6' },
        keyframeAnimation: {
            duration: 1000,
            delay: i * 200,
            loop: true,
            keyframes: [
                { percent: 0.5, scaleY: 0.1, easing: 'cubicIn' },
                { percent: 1, scaleY: 1, easing: 'cubicOut' },
            ],
        },
    }));
    return {
        graphic: {
            elements: [
                { type: 'group', left: 'center', top: 'center', children: columns },
            ],
        },
    } as EChartsOption;
}
