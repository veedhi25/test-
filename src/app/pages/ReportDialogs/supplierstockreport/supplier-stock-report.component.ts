import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import * as moment from 'moment'
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { AlertService } from '../../../common/services/alert/alert.service';


@Component({
  selector: 'supplier-stock-report',
  templateUrl: './supplier-stock-report.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class SupplierStockReportComponent implements OnInit {
  @Output() reportdataEmit = new EventEmitter();
  supplierList: any[] = [];
  constructor(public alertService:AlertService, public reportFilterService: ReportMainSerVice, public masterService: MasterRepo, public _transactionService: TransactionService) {
    this.masterService.masterGetmethod("/getsdlist").subscribe((res) => {
      if (res.status == "ok") {
        this.supplierList = res.result;
      }
    })
  }
  onload() {
    if(!this.reportFilterService.repObj.reportparam.SUPPLIER){
      this.alertService.error("Please Select Supplier.");
      return;
    }
    let currentDate = this.reportFilterService.calendarForm.value;
    this.reportFilterService.repObj.reportparam.REPMODE = this.reportFilterService.repObj.reportparam.REPORTMODE == "0" ? 0 : 1;
    this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }
  ngOnInit() {
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }

}