import { Component, Output, EventEmitter } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';


@Component({
    selector: 'item-scheme-master',
    templateUrl: './item-scheme-master.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']

})
export class ItemSchemeMasterReport {
    @Output() reportdataEmit = new EventEmitter();
    constructor(public masterService: MasterRepo) {

    }
    onload() {
        this.DialogClosedResult("ok");
    }
    public DialogClosedResult(res) {
        this.reportdataEmit.emit({
            status: res, data: {
                reportname: 'Item Scheme Master', reportparam: {
                    // COMPANYTYPE:this.masterService.userProfile.CompanyInfo.ORG_TYPE,

                }
            }
        });
    }

    closeReportBox() {
        this.DialogClosedResult("Error");
    }


}