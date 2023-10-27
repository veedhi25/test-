import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'loyalty-master',
  templateUrl: './loyalty-master.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class LoyaltyMasterReportComponent implements OnInit {
  @Output() reportdataEmit = new EventEmitter();
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  selectedCustomerList: any = [];
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo, public _transactionService: TransactionService) {

    this.gridPopupSettings = {
      title: "Customers List",
      apiEndpoints: `/getAccountPagedListByPType/PA/C`,
      defaultFilterIndex: 0,
      columns: [

        {
          key: 'ACID',
          title: 'Customer Id',
          hidden: false,
          noSearch: false
        },
        {
          key: 'ACNAME',
          title: 'NAME',
          hidden: false,
          noSearch: false
        }
      ]
    }


  }

  ngOnInit() {
    this.reportFilterService.repObj.reportparam.ACID = "%";
  }

  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.date1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.date2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')

    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });

  }

  hide() {
    this.reportdataEmit.emit({ status: "Error", data: this.reportFilterService.repObj });
  }



  CustomerkeyEvent() {
    this.genericGrid.show("", true, "", true, "");
  }

  dblClickPopupCustomer(event) {
    let x: any
    x = this.selectedCustomerList.filter(ID => ID.ACID == event.ACID)
    if (x.length > 0) {
      return;
    }
    this.selectedCustomerList.push(event)
    this.reportFilterService.repObj.reportparam.ACID = this.selectedCustomerList.map(x => x.ACID).join(",");

  }

  remove(index) {
    this.selectedCustomerList.splice(index, 1)

  }



}