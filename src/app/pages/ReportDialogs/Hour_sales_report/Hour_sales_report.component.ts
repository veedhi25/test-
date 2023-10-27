import { Component, Inject, Output, EventEmitter, ViewChild, Input, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';


@Component({
  selector: 'hour-sales-report',
  templateUrl: './Hour_sales_report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class HourSalesReport {
  timeList:any=[];

  @Output() reportdataEmit = new EventEmitter();
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) {

  }

  ngOnInit()
  {
    
    
    this.gettimelist();
  }

  onload() {
    if(this.reportFilterService.repObj.reportparam.fromTime==undefined || this.reportFilterService.repObj.reportparam.toTime==undefined)
    {
      alert("fill all mandatory parameters.");
      return false;
    }
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }

  gettimelist()
  {
    for (var i=0;i<24;i++)
    {
      this.timeList.push(i);

    }
    console.log(this.timeList);
  }
}