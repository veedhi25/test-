import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter, Input} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';
import { IReport } from '../../DialogReport/components/reports/report.service';
import { ActivatedRoute } from '@angular/router';

export interface DialogInfo{
    header: string;
    message: Observable<string>;

}
@Component({
    selector : 'result-trialbalance-dialog',
    templateUrl : './trialbalance.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class TrialBalance{
    ReportParameters:any=<any>{};
    division:any[]=[];
    public activeurlpath:string;
    checkurl = false;

    @Input('reportname') reportname: string;
    @Input() reportMaster: IReport = <IReport>{};
   
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,private arouter: ActivatedRoute,public dialogref:MdDialogRef<TrialBalance>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
        
       // this.activeurlpath= this.arouter.snapshot.url[0].path;

        //----------Default values on load
        this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
        this.changestartDate(this.ReportParameters.DATE1,'AD');
        this.ReportParameters.DATE2 = new Date().toJSON().split('T')[0];
        this.changeEndDate(this.ReportParameters.DATE2,'AD');

        this.ReportParameters.SHOWSUBLEDGER = "0";
        this.ReportParameters.SHOWDEBTORSCREDITORS = "0";
        this.ReportParameters.FX_ONLYOPENINGTRIAL = "0";
        this.ReportParameters.OPT_SHOWSUMMARY_REPORT = "0";
        this.ReportParameters.GroupLevel = "1";
        this.ReportParameters.OPT_LEDGERWISE = "0";
        this.ReportParameters.CHK_SHOWZEROBL = "0";
        this.ReportParameters.DIVISION = "%";

        //----------------------
        
        
        this.division=[];
        this.masterService.getAllDivisions()
          .subscribe(res => {
            this.division.push(<Division>res);                
          }, error => {
            this.masterService.resolveError(error, "divisions - getDivisions");
          });  
    }

    // onUrl(){
    //     if(this.activeurlpath = 'trialbalance'){
    //         return this.checkurl=true;
    //     }
    // }
    
    onload()
    {
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {
        this.ReportParameters.DIVISION =  (this.ReportParameters.DIVISION == null || this.ReportParameters.DIVISION == "")?"%":this.ReportParameters.DIVISION;
        this.ReportParameters.COSTCENTER = "%";

        this.reportdataEmit.emit({ status: res, data: {reportname:'Trial Balance', reportparam:this.ReportParameters}});

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

