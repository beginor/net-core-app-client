import {
    Component, AfterViewInit, ElementRef, OnDestroy, signal, effect, input,
    viewChild, inject,
} from '@angular/core';
import { EChartsType, EChartsOption, init } from 'echarts';

import { EchartService } from './echart.service';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'lib-echart',
    template: '<div class="echart" #echart>App Echart works!</div>',
    styles: [`
        :host { display: block; }
        .echart { width: 100%; height: 100%; }
    `]
})
export class EchartComponent implements AfterViewInit, OnDestroy {

    public config = input<string>('');

    private chartElRef = viewChild.required<ElementRef<HTMLDivElement>>('echart');

    private echart!: EChartsType;

    private echartsOptions = signal<EChartsOption>({});
    private resized = signal(false);

    private rb = new ResizeObserver(() => {
        this.resized.set(true);
    });

    private vm = inject(EchartService);

    constructor() {
        effect(() => {
            const opts = this.echartsOptions();
            if (this.echart) {
                this.echart.clear();
                this.echart.setOption(opts);
            }
        });
        effect(() => {
            const resized = this.resized();
            if (resized) {
                this.resized.set(false);
                if (this.echart) {
                    this.echart.resize();
                }
            }
        })
    }

    public ngAfterViewInit():void {
        const element = this.chartElRef().nativeElement;
        this.echart = init(element);
        this.echart.setOption(this.vm.createInitEchartsOption());
        this.rb.observe(element);
        this.updateChartFromConfig();
    }

    public ngOnDestroy(): void {
        this.rb.unobserve(this.chartElRef().nativeElement);
    }

    private updateChartFromConfig(): void {
        this.vm.loadEcharts(this.config()).subscribe(props => {
            this.echartsOptions.set(props.echarts);
        });
    }

}

