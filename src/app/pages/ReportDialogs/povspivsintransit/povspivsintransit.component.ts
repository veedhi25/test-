import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { MasterRepo } from '../../../common/repositories';
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import * as moment from 'moment'


@Component({
  selector: 'povspivsintransit',
  templateUrl: './povspivsintransit.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class POVSPIVSINTRANSITReport {

  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;
  constructor(public reportFilterService: ReportMainSerVice,public masterService: MasterRepo, public _transactionService: TransactionService) {
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