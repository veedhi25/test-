import { Component, Output, EventEmitter } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';

@Component({
  selector: 'proforma-summary-report',
  templateUrl: './proforma-summary-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class ProformaSummaryReportComponent {
  @Output() reportdataEmit = new EventEmitter();
  constructor(public reportFilterService: ReportMainSerVice,public masterService: MasterRepo, public _transactionService: TransactionService) {
  }


  onload() {
    this.reportFilterService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.date1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.date2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });  
  }

  hide() {
    this.reportdataEmit.emit({ status: "Error", data: this.reportFilterService.repObj });  
  }



}