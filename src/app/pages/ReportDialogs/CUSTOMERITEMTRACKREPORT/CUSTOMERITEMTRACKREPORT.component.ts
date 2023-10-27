import { Component, Output, EventEmitter } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'CUSTOMERITEMTRACKREPORT',
  templateUrl: './CUSTOMERITEMTRACKREPORT.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class CUSTOMERITEMTRACKREPORT {
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


  onload() {
    console.log(this.reportFilterService.repObj.reportparam.ACID);
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.date1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.date2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')

    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }

  hide() {
    this.reportdataEmit.emit({ status: "Error", data: this.reportFilterService.repObj });
  }

  onKeydown(event) {
    if (event.key === "Enter" || event.key === "Tab") { }
    else {
      event.preventDefault();
    }
  }

  CustomerkeyEvent() {
    this.genericGrid.show("", true, "", true, "");
  }

  dblClickPopupCustomer(event) {
    let x: any
    x = this.selectedCustomerList.filter(ID => ID == event.ACID)
    
    if (x.length > 0) {
      return;
    }
    this.selectedCustomerList.push(event.ACID)
    this.reportFilterService.repObj.reportparam.ACID = this.selectedCustomerList.join(",");

  }

  remove(index) {
    this.selectedCustomerList.splice(index, 1)

  }



}