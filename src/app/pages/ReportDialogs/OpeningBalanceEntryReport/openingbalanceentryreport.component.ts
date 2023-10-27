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
    selector : 'result-openingbalanceentryreport-dialog',
    templateUrl : './openingbalanceentryreport.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class OpeningBalanceEntryReport{
 ReportParameters:any=<any>{};
 division: any[]=[];
 ledgerAc : any[]=[];
 
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,public dialogref:MdDialogRef<OpeningBalanceEntryReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
        //----------default value on load

        this.ReportParameters.DIVISION = "%";
        this.ReportParameters.ACID = "%";
        //-------------------------
        
        
        this.division=[];
        this.masterService.getAllDivisions()
          .subscribe(res => {
            this.division.push(<Division>res);                
          }, error => {
            this.masterService.resolveError(error, "divisions - getDivisions");
          });

        this.ledgerAc = [];
        this.masterService.getAcList()
        .subscribe(res =>{
            //console.log(res);

            this.ledgerAc.push(res);
        })
              
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
    this.ReportParameters.ACID = (this.ReportParameters.ACID == null || this.ReportParameters.ACID == "")?"%":this.ReportParameters.ACID;
    this.reportdataEmit.emit({ status: res, data: {reportname:'Opening Balance Entry Report', reportparam:this.ReportParameters}});
      
    }


}