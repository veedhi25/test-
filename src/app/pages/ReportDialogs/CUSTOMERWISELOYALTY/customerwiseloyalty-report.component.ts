
import { Component, Output, EventEmitter } from "@angular/core";
import { MasterRepo } from "../../../common/repositories";
import { ReportMainSerVice } from '../../Reports/Report.service';


@Component({
    selector: 'customerwiseloyalty-report',
    templateUrl: './customerwiseloyalty-report.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],


})
export class CustomerWiseLoyaltyReport {
    @Output() reportdataEmit = new EventEmitter();
    constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) {
        // this.reportFilterService.repObj.reportparam.COMPANYID = ""
    }
    onload() {
        this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
    }
    ngOnInit() {
    }


    closeReportBox() {
        this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
    }

}