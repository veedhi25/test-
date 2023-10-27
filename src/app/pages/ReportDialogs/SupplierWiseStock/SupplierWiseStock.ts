import { Component, Inject, Output, EventEmitter, ViewChild, Input, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';

@Component({
  selector: 'SupplierWiseStock',
  templateUrl: './SupplierWiseStock.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class SupplierWiseStock {

  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;




  @Output() reportdataEmit = new EventEmitter();

  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) {

  }

  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;
    console.log(currentDate)
    this.reportFilterService.repObj.reportparam.date1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.date2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    console.log(this.reportFilterService.repObj.reportparam.date2)
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }



}







