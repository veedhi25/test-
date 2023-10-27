import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';


@Component({
  selector: 'TransferoutCentralReport',
  templateUrl: './TransferoutCentralReport.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class TransferoutCentralReport implements OnInit {
  @Output() reportdataEmit = new EventEmitter();
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo, public _transactionService: TransactionService) {
    this.reportFilterService.repObj.reportparam.COMPANYID = "";
    this.reportFilterService.repObj.reportparam.division = "%"
  }
  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }
  ngOnInit() {
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }

}