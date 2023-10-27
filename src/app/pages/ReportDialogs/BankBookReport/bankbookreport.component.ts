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
    selector : 'result-bankbookreport-dialog',
    templateUrl : './bankbookreport.component.html',

})

export class BankBookReport{
 ReportParameters:any=<any>{};
 
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,public dialogref:MdDialogRef<BankBookReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){
                              
              
    }

    onload()
    {
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("error");
    }

   public DialogClosedResult(res) {


    //console.log(selDiv + "~~"+ divAcid[0]);        

    //console.log(selDiv + "~~~" + this.ReportParameters.DATE1+ "~~~" + this.ReportParameters.DATE2);
    this.reportdataEmit.emit({ status: res, data: {reportname:'Account Ledger', reportparam:{
        
    }}});
      
    }
}