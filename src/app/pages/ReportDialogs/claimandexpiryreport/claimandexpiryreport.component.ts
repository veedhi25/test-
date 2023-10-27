import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { MasterRepo } from '../../../common/repositories';

@Component({
  selector: 'claimandexpiryreport',
  templateUrl: './claimandexpiryreport.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class ClaimAndExpiryReportComponent {
  
  @Output() reportdataEmit = new EventEmitter();
  listOfYear: any[] = [];
  months: any[] = [];
  public userProfile: any = {};

  constructor(public http: Http,public reportFilterService: ReportMainSerVice) {
    let currentYear = new Date().getFullYear() - 1;
    for (let i = 0; i < 50; i++) {
      this.listOfYear.push({
        year: currentYear++
      })
    }

    this.months = _.times(12).map(i => <any>{ month: moment().month(i).format("MMMM"), value: i+1 });
    this.userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));


  }



  onload() {
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }

  hide() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }



}