import { NgModule } from '@angular/core';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@NgModule({
    imports: [
        NzTableModule,
        NzTreeModule,
        NzTreeSelectModule,
        NzFormModule,
        NzInputModule,
        NzInputNumberModule,
        NzGridModule,
        NzLayoutModule,
        NzDividerModule,
        NzSpaceModule,
        NzDrawerModule,
    ],
    exports: [
        NzTableModule,
        NzTreeModule,
        NzTreeSelectModule,
        NzFormModule,
        NzInputModule,
        NzInputNumberModule,
        NzGridModule,
        NzLayoutModule,
        NzDividerModule,
        NzSpaceModule,
        NzDrawerModule,
    ]
})
export class AntdModule {}
