import { Component, Output, EventEmitter } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';

@Component({
  selector: 'ItemCorelation',
  templateUrl: './ItemCorelation.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class ItemCorelation {
  outletList: any[] = [];
  multiselectOutLet2Setting: any = {
    singleSelection: false,
    text: 'Select Outlets',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    searchBy: [],
    maxHeight: 300,
    badgeShowLimit: 999999999999,
    classes: '',
    disabled: false,
    searchPlaceholderText: 'Search',
    showCheckbox: true,
    noDataLabel: 'No Data Available',
    searchAutofocus: true,
    lazyLoading: false,
    labelKey: 'COMPANYID',
    primaryKey: 'COMPANYID',
    position: 'bottom'

  };
  @Output() reportdataEmit = new EventEmitter();
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo, public _transactionService: TransactionService) {
    this.reportFilterService.repObj.reportparam.division = "%";
    this.masterService.masterGetmethod_NEW("/getoutlets").subscribe((res) => {

      if (res.status == "ok") {
        this.outletList = res.result;
      }
    });
  }



  onload() {
    console.log(this.reportFilterService.repObj.reportparam.rowCount);
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.date1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.date2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')

    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }

  hide() {
    this.reportdataEmit.emit({ status: "Error", data: this.reportFilterService.repObj });
  }
  onMultiSelect() {

  }


}