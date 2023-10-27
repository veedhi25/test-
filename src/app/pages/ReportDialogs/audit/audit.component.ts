import { Component, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'


@Component({
  selector: 'audit-report',
  templateUrl: './audit.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class AuditReport {
  public isActive: boolean = false;
  audit={
    reportname:"",
    reportparam:{
      DATE1:"",
      DATE2:"",
      PHISCALID:""
    }
    
  };
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };

  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType:string;
  constructor(public masterService: MasterRepo) {

  }
  
  onload() {
    this.audit.reportname='Audit Report';
    this.audit.reportparam.PHISCALID=this.masterService.userProfile.CompanyInfo.PhiscalID;
    this.reportdataEmit.emit({ status: "ok", data: this.audit });
  }
  ngOnInit() {
    

  }

  
  dateChanged(date) {
    this.audit.reportparam.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.audit.reportparam.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
  }

  
  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.audit });
  }




}