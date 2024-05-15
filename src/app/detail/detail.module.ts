import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    DetailRoutingModule,
    NzInputDirective,
    NzTableComponent,
    NzDividerComponent,
    NzButtonModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
  ],
})
export class DetailModule {}
