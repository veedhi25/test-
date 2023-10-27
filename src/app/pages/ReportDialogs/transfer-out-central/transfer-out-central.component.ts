import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MasterRepo } from "../../../common/repositories";
import { ReportMainSerVice } from "../../Reports/Report.service";
import * as moment from 'moment';
import { TransactionService } from "../../../common/Transaction Components/transaction.service";

@Component({
    selector: 'transfer-out-central',
    templateUrl: './transfer-out-central.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"]

})
export class TransferOutCentralComponent {

    @Output() reportdataEmit = new EventEmitter();
    constructor(public reportFilterService: ReportMainSerVice, public MasterService: MasterRepo, public _transactionServcie: TransactionService) {
        this.reportFilterService.repObj.reportparam.COMPANYID = ""
        this.reportFilterService.repObj.reportparam.division = "%"

    }

    onload() {
        let currentDate = this.reportFilterService.calendarForm.value;
        this.reportFilterService.repObj.reportparam.date1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY');
        this.reportFilterService.repObj.reportparam.date2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY');
        this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });

    }
    ngOninit() {

    }
    hide() {
        this.reportdataEmit.emit({ status: "Error", data: this.reportFilterService.repObj });
    }





}