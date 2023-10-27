import { Component, Output, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';


@Component({
  selector: 'salesmanecoreport',
  templateUrl: './salesmanecoreport.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class SalesmanecoReportComponent implements OnInit {
  @Output() reportdataEmit = new EventEmitter();
  @ViewChild("genericDSMGrid") genericDSMGrid: GenericPopUpComponent;
  dsmGridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo, public _transactionService: TransactionService) {
    this.dsmGridPopupSettings = {
      title: "DSM NAME",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'DSMNAME',
          title: 'Name',
          hidden: false,
          noSearch: false
        },
        {
          key: 'DSMCODE',
          title: 'DSM CODE',
          hidden: false,
          noSearch: false
        }
      ]
    }
  }
  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;

    this.reportFilterService.repObj.reportparam.REPMODE = this.reportFilterService.repObj.reportparam.REPORTMODE == "0" ? 0 : 1;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY');
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY');
    this.reportFilterService.repObj.reportparam.DSM = this.reportFilterService.repObj.reportparam.DSM == '' ? '%' : this.reportFilterService.repObj.reportparam.DSM;
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });

  }
  ngOnInit() {
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }

  loadDSMFilter() {
    this.genericDSMGrid.show("", false, "masterdsmlist", false);
  }


  getDSMSheetVoucher(dsm) {
    this.reportFilterService.repObj.reportparam.DSM = dsm.DSMNAME;


  }

}