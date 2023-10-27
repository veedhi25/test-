
import { Component, Output, EventEmitter } from "@angular/core";
import { MasterRepo } from "../../../common/repositories";


@Component({
    selector: 'customer-master-report',
    templateUrl: './customer-master-report.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],


})
export class CustomerMasterReport {
    @Output()
    reportdataEmit = new EventEmitter();
    constructor(public masterService: MasterRepo) { }

    // onload() {
    //     return this.http
    //         .get(this.apiUrl + `/downloadCustomerCsv?Ptype=C`, this.masterService.getRequestOption());         



    // }
    onload() {
        this.DialogClosedResult("ok");
    }

    public DialogClosedResult(res) {

        this.reportdataEmit.emit({
            status: res, data: {
                reportname: 'CUSTOMER MASTER REPORT', reportparam: {
                }
            }
        });
    }

    // Close Method
    closeReportBox() {
        this.DialogClosedResult("Error");
    }

}