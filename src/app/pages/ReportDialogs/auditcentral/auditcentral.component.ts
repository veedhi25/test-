import { Component, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { ReportMainSerVice } from '../../Reports/Report.service';

@Component({
  selector: 'auditcentral-report',
  templateUrl: './auditcentral.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class AuditCentralReport {
  public isActive: boolean = false;
  audit = {
    reportname: "",
    reportparam: {
      DATE1: "",
      DATE2: "",
      PHISCALID: "",
      COMPANYID: ""
    }

  };
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
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };

  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;
  constructor(public masterService: MasterRepo, public reportFilterService: ReportMainSerVice) {
   // this.audit.reportparam.COMPANYID = "";
   
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
    this.audit.reportname = 'AUDITREPORTCENTRAL';
    this.audit.reportparam.PHISCALID = this.masterService.userProfile.CompanyInfo.PhiscalID;
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }
  ngOnInit() {


  }


  dateChanged(date) {
    this.audit.reportparam.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.audit.reportparam.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.audit });
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