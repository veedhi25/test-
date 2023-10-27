import { Component, Output, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';


@Component({
  selector: 'partyageoutstandingreconcillation',
  templateUrl: './partyageoutstandingreconcillation.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class partyAgeOutstandingReconcillationReport implements OnInit {
  @Output() reportdataEmit = new EventEmitter();
  
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo, public _transactionService: TransactionService) {
    
  }
  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;

    this.reportFilterService.repObj.reportparam.REPMODE = this.reportFilterService.repObj.reportparam.REPORTMODE == "0" ? 0 : 1;
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