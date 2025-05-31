import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { EChartsOption } from 'echarts';

import { API_ROOT } from '../inject-tokens';

@Injectable({
    providedIn: 'root'
})
export class EchartService {

    constructor(
        private http: HttpClient,
        @Inject(API_ROOT) private apiRoot: string,
    ) { }

    public createInitEchartsOption(): EChartsOption {
        const columns = [];
        for (let i = 0; i < 10; i++) {
            columns.push({
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
                        { percent: 1, scaleY: 1, easing: 'cubicOut' }
                    ]
                }
            });
        }
        const initOpts: EChartsOption = {
            graphic: {
                elements: [
                    {
                        type: 'group',
                        left: 'center',
                        top: 'center',
                        children: columns as any[],
                    }
                ]
            }
        };
        return initOpts;
    }

    public loadEcharts(config: string): Observable<EchartProps> {
        return this.http.get(
            config,
            { responseType: 'text' }
        ).pipe(
            map(text => JSON.parse(text, parseEchartConfig) as EchartProps),
            switchMap(props => {
                let url = props.data.url;
                if (!url.startsWith(this.apiRoot)) {
                    url = this.apiRoot + url;
                }
                return this.http.get<{ data: any[]; }>(url).pipe(
                    map(result => {
                        props.echarts.dataset = { source: result.data };
                        if (props.beforeSetChartOptions) {
                            props.beforeSetChartOptions(props.echarts);
                        }
                        return props;
                    })
                );
            })
        );
    }

}

export interface EchartProps {
    style?: CSSStyleDeclaration;
    data: {
        url: string;
    };
    echarts: EChartsOption;
    beforeSetChartOptions?: (options: EChartsOption) => void;
}

export function parseEchartConfig(key: string, val: any): any {
    if (typeof val === 'string') {
        if (val.startsWith('(') && val.endsWith('}')) {
            return (0, eval)(`(${val})`);
        }
        if (val.startsWith('--')) {
            return getComputedStyle(
                self.document.documentElement
            ).getPropertyValue(val);
        }
    }
    if (Array.isArray(val)) {
        if (val[0] === '_lambda' && val[val.length - 1] === '}') {
            const lambda = val.slice(1).join('\n');
            return (0, eval)(`(${lambda})`);
        }
    }
    return val;
}
