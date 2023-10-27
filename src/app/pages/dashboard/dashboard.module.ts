import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';


import { Dashboard } from './dashboard.component';
import { routing } from './dashboard.routing';

import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TransactionService } from '../../common/Transaction Components/transaction.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    NgxDaterangepickerMd.forRoot()],
    
  declarations: [

    Dashboard
   
  ],
  providers: [
    TransactionService
  ]
})
export class DashboardModule { }
