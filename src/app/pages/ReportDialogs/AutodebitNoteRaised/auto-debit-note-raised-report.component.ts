import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'auto-debit-note-raised-report',
  templateUrl: './auto-debit-note-raised-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class AutoDebitNoteRaisedReportComponent {
  repObj = {
    reportname: "Auto DebitNote Raised_Central",
    reportparam: {
      MONTH: "%",
      YEAR: "%",
      COMPANYID: "",
      ITEMDIVISION: "%"
    }
  }
  @Output() reportdataEmit = new EventEmitter();
  listOfYear: any[] = [];
  months: any[] = [];
  constructor(public http: Http) {
    let currentYear = new Date().getFullYear() - 1;
    for (let i = 0; i < 50; i++) {
      this.listOfYear.push({
        year: currentYear++
      })
    }

    this.months = _.times(12).map(i => <any>{ month: moment().month(i).format("MMMM"), value:i+1 });


  }



  onload() {
    this.reportdataEmit.emit({ status: "ok", data: this.repObj });
  }

  hide() {
    this.reportdataEmit.emit({ status: "Error", data: this.repObj });
  }



}