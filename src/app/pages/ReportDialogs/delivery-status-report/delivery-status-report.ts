import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { ReportMainSerVice } from '../../Reports/Report.service';


@Component({
    selector:'delivery-status-report',
    templateUrl:'./delivery-status-report.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class DeliveryStatusReport implements OnInit{
  @Output() reportdataEmit = new EventEmitter();
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) { }

  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.SDATE).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.EDATE).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }
  ngOnInit() {
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }




}