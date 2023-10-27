import { Component, Output, Inject, EventEmitter } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { Division } from '../../../common/interfaces';



export interface DialogInfo{
    header: string;
    message: Observable<string>;

}

@Component({
    selector : 'result-partypaymentreport-dialog',
    templateUrl : './partypaymentreport.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class PartyPaymentReport{
 ReportParameters:any=<any>{};
 division: any[]=[];
 
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,public dialogref:MdDialogRef<PartyPaymentReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
        //----------default value on load
        this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
        this.changestartDate(this.ReportParameters.DATE1,'AD');
        this.ReportParameters.DATE2 = new Date().toJSON().split('T')[0];
        this.changeEndDate(this.ReportParameters.DATE2,'AD');
        
        this.ReportParameters.DIVISION = "%";

        //-------------------------
        
        
        this.division=[];
        this.masterService.getAllDivisions()
          .subscribe(res => {
            this.division.push(<Division>res);                
          }, error => {
            this.masterService.resolveError(error, "divisions - getDivisions");
          }); 
              
    }

    onload()
    {
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("error");
    }

   public DialogClosedResult(res) {

    this.ReportParameters.DIVISION = (this.ReportParameters.DIVISION == null || this.ReportParameters.DIVISION == "")?"%":this.ReportParameters.DIVISION;
    this.ReportParameters.FLAG = "0";
    this.ReportParameters.DETAIL = "0";
    this.ReportParameters.RMODE = "0";  
    this.ReportParameters.VCHR = "A";
    this.ReportParameters.VCHR1 = "A";
    this.ReportParameters.INAD = "0";
    this.ReportParameters.INDVAT = "0";
    this.ReportParameters.TMODE = "%";
    this.ReportParameters.SERIES = "%";
    this.ReportParameters.ACID = "%";

    this.reportdataEmit.emit({ status: res, data: {reportname:'Party Payment Report', reportparam:this.ReportParameters}});
      
    }

    changestartDate(value, format: string) {
        try{
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
        }catch(e){}
      
    }
    changeEndDate(value, format: string) {
        try{
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);         
                this.ReportParameters.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);         
                this.ReportParameters.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
    
            }
        }
          catch(e){}
      
    }

}