import { Component, Inject, Output, EventEmitter, ViewChild, Input, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';

@Component({
  selector: 'ItemTransactionHistoryStandAlone',
  templateUrl: './ItemTransactionHistoryStandAlone.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class ItemTransactionHistoryStandAlone {
  modelList: any[] = [];
  modelListinit: any[] = [];
  BatchList: any[] = [];
  public mode: number = 0;
  batchSelected: boolean = false;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForbatchfilterGrid: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  @ViewChild("batchfilterGrid") batchfilterGrid: GenericPopUpComponent;




  @Output() reportdataEmit = new EventEmitter();

  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) {
    // this.reportFilterService.repObj.reportparam.COMPANYID = "";
    this.reportFilterService.repObj.reportparam.division = "%";

    this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Item List",
      apiEndpoints: `/getItemPagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "MCODE",
          title: "Item Code",
          hidden: false,
          noSearch: false
        },
        {
          key: "Item",
          title: "Item Name",
          hidden: false,
          noSearch: false
        }



      ]
    });





  }
  handleChange(e) {
    this.batchSelected = false;
    if (this.mode == 0) {
      this.batchSelected = false;
    }

    if (this.mode == 1) {
      // this.batchfilterGrid.show();
      this.gridPopupSettingsForbatchfilterGrid = Object.assign(new GenericPopUpSettings, {
        title: "Batch List",
        apiEndpoints: "/getBatchList/" + this.reportFilterService.repObj.reportparam.MCODE,
        defaultFilterIndex: 0,
        columns: [
          {
            key: "MCODE",
            title: "MCODE",
            hidden: false,
            noSearch: false
          },
          {
            key: "BATCHCODE",
            title: " BATCHCODE",
            hidden: false,
            noSearch: false
          },
          {
            key: "EXPDATE",
            title: " EXPDATE",
            hidden: false,
            noSearch: false
          },
        ]
      });
      this.batchSelected = true;
    }
  }

  onload() {

    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.date1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.date2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }



  onMultiSelect(event) {
  }
  onSapcodeClicked() {
    this.genericGrid.show();

  }
  onItemClicked() {
    this.batchfilterGrid.show();
  }


  dblClickPopupItem(event) {
    console.log("event", event);
    this.reportFilterService.repObj.reportparam.MCODE = event.MCODE;
    this.gridPopupSettingsForbatchfilterGrid = Object.assign(new GenericPopUpSettings, {
      title: "Batch List",
      apiEndpoints: "/getBatchList/" + this.reportFilterService.repObj.reportparam.MCODE,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "MCODE",
          title: "MCODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "BATCHCODE",
          title: " BATCHCODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "EXPDATE",
          title: " EXPDATE",
          hidden: false,
          noSearch: false
        },
      ]
    });

  }


  dblClickbatchItemFromFilter(event) {
    console.log(this.reportFilterService.repObj.reportparam.MCODE, "mcode")

    this.reportFilterService.repObj.reportparam.batch = event.BATCHCODE;

  }

}