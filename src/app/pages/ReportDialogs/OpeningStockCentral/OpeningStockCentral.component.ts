import { Component, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'


@Component({
  selector: 'OpeningStockCentral',
  templateUrl: './OpeningStockCentral.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class OpeningStockCentral {
  public isActive: boolean = false;
  closingStock={
    reportname:"",
    reportparam:{
      DATE1:"",
      DATE2:"",
      PHISCALID:"",
      COMPANYID:""
    }
    
  };
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };

  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType:string;
  constructor(public masterService: MasterRepo) {

  }
  
  onload() {
    this.closingStock.reportname='OpeningStockCentral';
    this.closingStock.reportparam.PHISCALID=this.masterService.userProfile.CompanyInfo.PhiscalID;
    this.reportdataEmit.emit({ status: "ok", data: this.closingStock });
  }
  ngOnInit() {
    

  }

  
  dateChanged(date) {
    this.closingStock.reportparam.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.closingStock.reportparam.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
  }

  
  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.closingStock });
  }




}