import { NgaModule } from '../../../theme/nga.module';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';


export interface DialogInfo {
    header: string;
    message: Observable<string>;

}
@Component({
    selector: 'result-partyageing-dialog',
    templateUrl: './partyageing.component.html',
    styleUrls: ["../../Reports/reportStyle.css", "../../modal-style.css"]

})

export class PartyAgeing {
    ReportParameters: any = <any>{};
    division: any[] = [];
    partyGroup : any[]=[];


    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo, public dialogref: MdDialogRef<PartyAgeing>, @Inject(MD_DIALOG_DATA) public data: DialogInfo) {
        //----------Default values on load
        this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
        this.changestartDate(this.ReportParameters.DATE1, 'AD');

        this.ReportParameters.DIVISION = '%';
        this.ReportParameters.PARTY = "%";
        this.ReportParameters.FLG = "0";
        this.ReportParameters.D1 = "0";
        this.ReportParameters.D2 = "0";
        this.ReportParameters.D3 = "0";
        this.ReportParameters.D4 = "0";
        this.ReportParameters.D5 = "0";
        this.ReportParameters.D6 = "0";

        //------------------
        this.division = [];

        this.masterService.getAllDivisions()
            .subscribe(res => {
                this.division.push(<Division>res);
            });

        this.partyGroup = [];
        this.masterService.getPartyGroup()
            .subscribe(res => {

                //console.log("partygroup" + (res));
                this.partyGroup.push(res);
            });
    }

    onload() {
        this.DialogClosedResult("ok");
    }

    closeReportBox() {
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res){

        this.ReportParameters.DIVISION = (this.ReportParameters.DIVISION == null || this.ReportParameters.DIVISION == "") ? "%" : this.ReportParameters.DIVISION;
        this.ReportParameters.PARTY = (this.ReportParameters.PARTY == null || this.ReportParameters.PARTY == "") ? "%" : this.ReportParameters.PARTY;

        this.reportdataEmit.emit({ status: res, data: { reportname: 'Party Ageing Report', reportparam: this.ReportParameters } });

    }

    changestartDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.ReportParameters.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);

            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.ReportParameters.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (e) { }

    }


}

