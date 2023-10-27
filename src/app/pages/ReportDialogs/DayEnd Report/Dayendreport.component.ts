import { Component, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'


@Component({
  selector: 'sales-order-report',
  templateUrl: './sales-order.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class DayEndReportComponent {
  public isActive: boolean = false;
  salesorder={
    reportname:"",
    reportparam:{
      DATE1:"",
      DATE2:""
    }
    
  };
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };

  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType:string;
  constructor(public masterService: MasterRepo) {

  }
  alwaysShowCalendars: boolean = true;
 
  onload() {
    this.salesorder.reportname='Day End Report'
    this.reportdataEmit.emit({ status: "ok", data: this.salesorder });
  }
  ngOnInit() {
    

  }

  
  dateChanged(date) {
    this.salesorder.reportparam.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.salesorder.reportparam.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
  }

  
  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.salesorder });
  }




}