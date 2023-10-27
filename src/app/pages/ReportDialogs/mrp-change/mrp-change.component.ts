import { Component, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'


@Component({
  selector: 'mrp-change-report',
  templateUrl: './mrp-change.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class MRPChangeReport {
  public isActive: boolean = false;
  mrpchange = {
    reportname: "",
    reportparam: {
      DATE1: "",
      DATE2: "",
      PHISCALID: ""
    }

  };
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };

  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;
  constructor(public masterService: MasterRepo) {

  }

  onload() {
    this.mrpchange.reportname = 'MRP Change Report';
    this.mrpchange.reportparam.PHISCALID = this.masterService.userProfile.CompanyInfo.PhiscalID;
    this.reportdataEmit.emit({ status: "ok", data: this.mrpchange });
  }
  ngOnInit() {


  }


  dateChanged(date) {
    this.mrpchange.reportparam.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.mrpchange.reportparam.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.mrpchange });
  }




}