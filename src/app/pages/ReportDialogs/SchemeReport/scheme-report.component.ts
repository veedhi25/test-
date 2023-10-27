import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'scheme-report',
  templateUrl: './scheme-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class SchemeReport {
  reportObj = {
    reportname: "Scheme Report",
    reportparam: {
      DATE1: "",
      DATE2: ""
    }

  };
  calendarForm: FormGroup;
  ranges: any;
  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;
  constructor(public masterService: MasterRepo, private fb: FormBuilder) {
    this.calendarForm = this.fb.group({
      selectedDate: [{
        startDate: moment(),
        endDate: moment()
      }, Validators.required],
    });
    this.ranges = this.masterService.dateFilterRange;
  }
  onload() {
    let currentDate = this.calendarForm.value;
    this.reportObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportObj });
  }

  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportObj });
  }




}