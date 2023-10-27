import {Component, Output, EventEmitter} from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ReportMainSerVice } from '../../Reports/Report.service';

@Component({
    selector:'purchase-order-detail-report',
    templateUrl:'./purchase-order-detail.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
  
})
export class PurchaseOrderDetailReport{
    @Output() reportdataEmit = new EventEmitter();
    constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) {

    }
    onload() {
        let currentDate = this.reportFilterService.calendarForm.value;
        this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
        this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
        this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
      }


    closeReportBox() {
        this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
    }

}