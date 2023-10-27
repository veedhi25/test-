import { Component, Inject, Output, EventEmitter, ViewChild, Input, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportMainSerVice } from '../../Reports/Report.service';

@Component({
  selector: 'saleseregisterreport-dialog',
  templateUrl: './salesRegisterReport.html',
  styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]

})

export class SalesRegisterReport  {
  @Output() reportdataEmit = new EventEmitter();
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) {

  }

  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }

}