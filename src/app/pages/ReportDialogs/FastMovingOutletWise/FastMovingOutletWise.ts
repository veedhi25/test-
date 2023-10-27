import { Component, Inject, Output, EventEmitter, ViewChild, Input, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';


@Component({
  selector: 'FastMovingOutletWise',
  templateUrl: './FastMovingOutletWise.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class FastMovingOutletWise {
  modelList: any[] = [];
  modelListinit: any[] = [];
  outletList: any[] = [];

  multiselectOutLetSetting: any = {
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

  multiselectmodelSetting: any = {
    singleSelection: false,
    text: 'Select Company Models',
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
    labelKey: 'companynature',
    primaryKey: 'companynature',
    position: 'bottom'

  };

  @Output() reportdataEmit = new EventEmitter();

  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) {
    // this.reportFilterService.repObj.reportparam.COMPANYID = "";
    this.reportFilterService.repObj.reportparam.division = "%"
    this.masterService.masterGetmethod_NEW("/getoutlets").subscribe((res) => {

      if (res.status == "ok") {
        this.outletList = res.result;
      }
    });

    // console.log("after outletlist");
    this.masterService.masterGetmethod_NEW("/getcompanymodelList").subscribe((res) => {

      if (res.status == "ok") {
        this.modelListinit = res.result;
      }
    });
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

  onModelListMultiSelect(item) {

    //console.log("modelList event", this.modelList);
    this.masterService.masterPostmethod_NEW("/getOutletsforCompanyModels", this.modelList).subscribe((res: any) => {
      if (res.status == "ok") {
        //this.reportFilterService.repObj.reportparam.COMPANYID = res.result;
        this.outletList = res.result;
        console.log(this.reportFilterService.repObj.reportparam.COMPANYID, " this.reportFilterService.repObj.reportparam.COMPANYID");

      }
    });


  }

  onMultiSelect(event) {
    //  console.log("outletList event", event);
  }

}