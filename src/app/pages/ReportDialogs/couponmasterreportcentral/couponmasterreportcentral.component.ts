import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';


@Component({
  selector: 'couponmasterreportcentral',
  templateUrl: './couponmasterreportcentral.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class CouponMasterReportCentral implements OnInit {
  outletList: any[] = [];
  multiselectOutLetSetting: any = {
    singleSelection: true,
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
    // this.reportFilterService.repObj.reportparam.COMPANYID = ""
    this.masterService.masterGetmethod_NEW("/getoutlets").subscribe((res) => {

      if (res.status == "ok") {
        this.outletList = res.result;
      }
    });
  }
  onload() {
    let currentDate = this.reportFilterService.calendarForm.value;

    this.reportFilterService.repObj.reportparam.REPMODE = this.reportFilterService.repObj.reportparam.REPORTMODE == "0" ? 0 : 1;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')

    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }

  modeStatus: any = [
    {
      name: "All",
      value: 4,
    },
    {
      name: "Reedem",
      value: 1,

    },
    {
      name: "Not Reedem",
      value: 2,

    },
    {
      name: "Free To Use",
      value: 3,

    },

  ];
  ngOnInit() {



  }
  onMultiSelect(event) {
    //  console.log("outletList event", event);
  }



  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }

}