import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { ReportMainSerVice } from '../../Reports/Report.service';
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';


@Component({
  selector: 'erppireport',
  templateUrl: './erp-invoice-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class ERPINVOICEREPORTCOMPONENT {
  @Output() reportdataEmit = new EventEmitter();
  @ViewChild("reportGrid") reportGrid: GenericPopUpComponent;
  reportGridPopSettings: GenericPopUpSettings = new GenericPopUpSettings();
companytype:string;
  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo, public _transactionService: TransactionService) {
    this.companytype= masterService.userProfile.CompanyInfo.COMID;
    this.reportGridPopSettings = {
      title: "Suppliers Vendor Code",
      apiEndpoints: `/getVendorCode`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'ERP_CODE',
          title: 'Vendor Code.',
          hidden: false,
          noSearch: false
        }
      ]
    }

  }
  onload() {
    if(this.companytype=="fitindia")
    {
      this.reportFilterService.repObj.reportparam.COMPANYID= this.masterService.userProfile.CompanyInfo.COMPANYID;
    }
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }

  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService });
  }

  OnvendorSelect() {
    this.reportGrid.show("", false, "supplier");
  }

  onItemDoubleClick(event) {
    this.reportFilterService.repObj.reportparam.VENDORCODE = event.ERP_CODE;
  }



}