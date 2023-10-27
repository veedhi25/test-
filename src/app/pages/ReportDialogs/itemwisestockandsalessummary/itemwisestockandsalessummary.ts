import { Component, Output, EventEmitter, OnInit, Input, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';


@Component({
  selector: 'itemwisestockandsalessummary',
  templateUrl: './itemwisestockandsalessummary.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})

export class ItemwiseStockandsalessummaryReport {
  @Output() reportdataEmit = new EventEmitter();
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  selectedItemList: any = [];
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) {

    this.gridPopupSettings = {
      title: "ITEMS",
      apiEndpoints: `/getMenuitemWithStockPagedList/0/${'all'}/${'NO'}/${this.masterService.userProfile.userWarehouse}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'DESCA',
          title: 'DESCRIPTION',
          hidden: false,
          noSearch: false
        },
        {
          key: 'MENUCODE',
          title: 'ITEM CODE',
          hidden: false,
          noSearch: false
        }
      ]
    }
  }

  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    if(this.selectedItemList.length){
      this.reportFilterService.repObj.reportparam.SelectedItemList = this.selectedItemList.join(',')
    }else{
      this.reportFilterService.repObj.reportparam.SelectedItemList="%"
    }
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }




  onKeydown(event) {
    if (event.key === "Enter" || event.key === "Tab") { }
    else {
      event.preventDefault();
    }
  }

  ItemkeyEvent() {
    this.genericGrid.show("", false, "", false, "");
  }

  dblClickPopupItem(event) {
    let x: any
    x = this.selectedItemList.filter(itm => itm == event.MENUCODE)
    if (x.length > 0) {
      return;
    }
    this.selectedItemList.push(event.MCODE)
  }

  remove(index) {
    this.selectedItemList.splice(index, 1)

  }


}