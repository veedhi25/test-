import { Component, Output, EventEmitter, Injector } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { MISReportsComponentBase } from '../../MISReportsComponentsBase';


@Component({
  selector : 'outlet-tracking-report.component',
  templateUrl : './outlet-tracking-report.component.html',
  // styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})
export class OutletTrackingComponent extends MISReportsComponentBase{
  constructor(injector: Injector) { 
    super(injector) 
  }

  }


