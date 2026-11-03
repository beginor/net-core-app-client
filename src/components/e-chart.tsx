import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useEffect, useRef, useState } from 'react';

import { API_ROOT, BASE_PATH } from '../config';
import { http } from '../api/http';
import { createInitEchartsOption, parseEchartConfig } from '../utils/echarts-config';
import type { EchartProps } from '../utils/echarts-config';

interface EChartProps {
    /** Path of the chart config json, relative to the app base. */
    config: string;
    style?: React.CSSProperties;
}

/** Load a chart config, inject the dataset and render it with echarts. */
export function EChart({ config, style }: EChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<echarts.ECharts | null>(null);
    const [option, setOption] = useState<EChartsOption | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = async (): Promise<void> => {
            // The config is a static asset, so it must not go through the API client.
            const url = config.startsWith('http') ? config : `${BASE_PATH}/${config}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Can not load chart config ${url}`);
            }
            const text = await response.text();
            const props = JSON.parse(text, parseEchartConfig) as EchartProps;
            const dataUrl = props.data.url.startsWith(API_ROOT)
                ? props.data.url
                : `${API_ROOT}${props.data.url}`;
            const result = await http.get<{ data: Record<string, unknown>[] }>(dataUrl);
            props.echarts.dataset = { source: result.data } as EChartsOption['dataset'];
            props.beforeSetChartOptions?.(props.echarts);
            if (!cancelled) {
                setOption(props.echarts);
            }
        };
        load().catch((ex: unknown) => {
            console.error(ex);
        });
        return () => {
            cancelled = true;
        };
    }, [config]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return;
        }
        const chart = echarts.init(element);
        chartRef.current = chart;
        chart.setOption(createInitEchartsOption());
        const observer = new ResizeObserver(() => chart.resize());
        observer.observe(element);
        return () => {
            observer.disconnect();
            chart.dispose();
            chartRef.current = null;
        };
    }, []);

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart || !option) {
            return;
        }
        chart.clear();
        chart.setOption(option);
    }, [option]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%', ...style }} />;
}
