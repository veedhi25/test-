import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
//import { IDateRange } from 'ng-pick-daterange';


@Component({
    selector:'result-dialog2',
    template:`
        <div class="modal-dialog modal-md">
        <div class="modal-content">
        <div class="modal-footer">
       
       <div style="width:200px">
      
        <input type="text" style="height:25px;width:100%"   [(ngModel)]="ReportParameters.input3"/>
        <button class="btn btn-info confirm-btn" type="button"  (click)=onChange()>DATECHANGE</button>
        <button class="btn btn-info confirm-btn" type="button"  (click)=onload()>RUN</button>
        </div>
        </div>
        </div>
`
})
export class dailysalessummary2{
 ReportParameters:any=<any>{};
 dateleable1:string="Date1";
 dateleable2:string="Date2";
 @Output() reportdataEmit = new EventEmitter();
 
    constructor(){  
       
    }
    onload()
    {
        console.log(this.ReportParameters.DATE1,this.ReportParameters.DATE2);
       this.DialogClosedResult("ok");
    }
   public DialogClosedResult(res) {
    this.reportdataEmit.emit({ status: res, data: {reportname:'Vat Sales Register Report',reportparam: this.ReportParameters }});  
    }
    dateEmit(value)
    {
        console.log("dateEmitChange",value);
        this.ReportParameters.DATE1=value;  
    }
    dateEmit2(value)
    {
        console.log("dateEmitChange2",value);
        this.ReportParameters.DATE2=value;  
    }
    onChange()
    {
        this.ReportParameters.DATE1=new Date().toJSON().split('T')[0];
    }
    // public setReturnValue(dateRange: IDateRange): any {
    //   //  this.dateRange = dateRange;
    //     // Do whatever you want to the return object 'dateRange'
    // }
}