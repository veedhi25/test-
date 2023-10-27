
import { Component, Output, EventEmitter } from "@angular/core";
import { MasterRepo } from "../../../common/repositories";


@Component({
    selector: 'loyalty-report',
    templateUrl: './loyalty-report.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],


})
export class LoyaltyReport {
    @Output()
    reportdataEmit = new EventEmitter();
    constructor(public masterService: MasterRepo) { }
    onload() {
        this.DialogClosedResult("ok");
    }

    public DialogClosedResult(res) {

        this.reportdataEmit.emit({
            status: res, data: {
                reportname: 'LOYALTY REPORT', reportparam: {
                }
            }
        });
    }

    // Close Method
    closeReportBox() {
        this.DialogClosedResult("Error");
    }

}