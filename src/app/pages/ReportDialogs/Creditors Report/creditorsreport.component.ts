import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../../common/interfaces';


export interface DialogInfo{
    header: string;
    message: Observable<string>;

}
@Component({
    selector : 'result-creditorsreport-dialog',
    templateUrl : './creditorsreport.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class CreditorsReport{
    ReportParameters:any=<any>{};
    division: any[]=[];   

  
   
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,public dialogref:MdDialogRef<CreditorsReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
              //----------Default values on load
              this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
              this.changestartDate(this.ReportParameters.DATE1,'AD');
              this.ReportParameters.DATE2 = new Date().toJSON().split('T')[0];
              this.changeEndDate(this.ReportParameters.DATE2,'AD');

              this.ReportParameters.CostCenter = "%";
              this.ReportParameters.CHK_STATUS = 1;
              this.ReportParameters.CHK_SHOWDETAIL = 0;
              this.ReportParameters.CHK_OPNINGONLY = 0;
              this.ReportParameters.OPT_EXNEGETIVE = 0;
              this.ReportParameters.OPT_TREE = "0";
              this.ReportParameters.FX_DebtorOrCreditor = "C";
              this.ReportParameters.CHK_SHOWFALLOWUPRMK = 0;
              this.ReportParameters.D1 = "15";
              this.ReportParameters.D2 = "30";
              this.ReportParameters.D3 = "45";
              this.ReportParameters.D4 = "60";
              this.ReportParameters.CHK_AGEINGOFPARTYOPENING = 1;
              this.ReportParameters.CHK_SHOWAGEINGREPORT = 0;
              this.ReportParameters.DIVISION = "%";


            //   this.ReportParameters.CHK_STATUS = 0;
            //   this.ReportParameters.CHK_SHOWDETAIL = 0;
            //   this.ReportParameters.CHK_OPNINGONLY = 0;
            //   this.ReportParameters.OPT_EXNEGETIVE = 0;
            //   this.ReportParameters.OPT_TREE = 0;
            //   this.ReportParameters.FX_DebtorOrCreditor = "C";
            //   this.ReportParameters.CHK_SHOWFALLOWUPRMK = 0;
            //   this.ReportParameters.D1 = "15";
            //   this.ReportParameters.D2 = "30";
            //   this.ReportParameters.D3 = "45";
            //   this.ReportParameters.D4 = "60";
            //   this.ReportParameters.CHK_AGEINGOFPARTYOPENING = 1;
            //   this.ReportParameters.CHK_SHOWAGEINGREPORT = 0;


              this.ReportParameters.DIVISION = "%";
              //----------------
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
        this.DialogClosedResult("Error!");
    }

    public DialogClosedResult(res) {

        this.ReportParameters.DIVISION = (this.ReportParameters.DIVISION == null || this.ReportParameters.DIVISION == "")?"%":this.ReportParameters.DIVISION;
        this.ReportParameters.CostCenter = "%";

        console.log("Creditors Report Value"+JSON.stringify(this.ReportParameters));

        this.reportdataEmit.emit({ status: res, data: {reportname:'Creditors Report', reportparam:{
            DATE1: this.ReportParameters.DATE1,
            DATE2: this.ReportParameters.DATE2,
            DIVISION: this.ReportParameters.DIVISION,
            CHK_STATUS: this.ReportParameters.CHK_STATUS,
            CHK_SHOWDETAIL: this.ReportParameters.CHK_SHOWDETAIL,
            CHK_OPNINGONLY: this.ReportParameters.CHK_OPNINGONLY,
            OPT_EXNEGETIVE: this.ReportParameters.OPT_EXNEGETIVE,
            CostCenter: this.ReportParameters.CostCenter,
            OPT_TREE: this.ReportParameters.OPT_TREE,
            FX_DebtorOrCreditor: this.ReportParameters.FX_DebtorOrCreditor,
            CHK_SHOWFALLOWUPRMK: this.ReportParameters.CHK_SHOWFALLOWUPRMK,
            D1: this.ReportParameters.D1,
            D2: this.ReportParameters.D2,
            D3: this.ReportParameters.D3,
            D4: this.ReportParameters.D4,
            CHK_AGEINGOFPARTYOPENING: this.ReportParameters.CHK_AGEINGOFPARTYOPENING,
            CHK_SHOWAGEINGREPORT: this.ReportParameters.CHK_SHOWAGEINGREPORT

        }}});

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

