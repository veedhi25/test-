import { Component, Output, EventEmitter } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';

@Component({
  selector: 'STOCKISSUEREPORTCENTRAL',
  templateUrl: './STOCKISSUEREPORTCENTRAL.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class STOCKISSUEREPORTCENTRAL {
  @Output() reportdataEmit = new EventEmitter();
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo, public _transactionService: TransactionService) {
    this.reportFilterService.repObj.reportparam.COMPANYID=""
  }


  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.date1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.date2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }

  hide() {
    this.reportdataEmit.emit({ status: "Error", data: this.reportFilterService.repObj });
  }



}