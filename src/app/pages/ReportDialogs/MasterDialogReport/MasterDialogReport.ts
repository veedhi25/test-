import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, ComponentFactoryResolver } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";


export interface DialogInfo {
    activeurlpath: string;
    reportparam: any;
}

@Component({
    selector: 'masterdreportdialog',
    templateUrl: './MasterDialogReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class MasterDialogReport {
    ReportParameters: any = <any>{};
    activeurlpath: string;
    currentreportparam: any;
    constructor(public dialogref: MdDialogRef<MasterDialogReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        this.activeurlpath = data.activeurlpath;
        this.currentreportparam = data.reportparam;
    }

    reportdataEmit(event) {
        if(event.status=="ok")
        {
            if(event.data!=null && event.data.reportparam!=null)
            {
                if(event.data.reportparam.DATE1!=null && event.data.reportparam.DATE1!='')
                {
                    event.data.reportparam.date1=event.data.reportparam.DATE1;
                }
                if(event.data.reportparam.DATE2!=null && event.data.reportparam.DATE2!='')
                {
                    event.data.reportparam.date2=event.data.reportparam.DATE2;
                }
            }
        }
        this.dialogref.close(event);
    }


}