import { Component, Output, EventEmitter } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';


@Component({
    selector: 'itemwise-channel-margin',
    templateUrl: './itemwise-channel-margin.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class ItemwiseChannelmarginReport {
    @Output() reportdataEmit = new EventEmitter();
    constructor(public masterService: MasterRepo) {

    }
    onload() {
        this.DialogClosedResult("ok");
    }
    public DialogClosedResult(res) {
        this.reportdataEmit.emit({
            status: res, data: {
                reportname: 'ITEMWISE CHANNEL MARGIN', reportparam: {
                }
            }
        });
    }

    // Close Method
    closeReportBox() {
        this.DialogClosedResult("Error");
    }

}

