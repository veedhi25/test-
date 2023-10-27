import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { Division } from '../../masters/components/sales-terminal/sales-terminal.interface';
import { Subscriber } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';


export interface DialogInfo{
    header: string;
    message: Observable<string>;
}

@Component({
    selector:'result-salesbookreport-dialog',
//     template:`
//         <div class="modal-dialog modal-md">
//         <div class="modal-content">
//         <div class="modal-footer">
//         <input type="text" style="height:25px;width:100%"   [(ngModel)]="ReportParameters.input1"/>
//         <input type="text" style="height:25px;width:100%"  [(ngModel)]="ReportParameters.input2"/>
//         <input type="text" style="height:25px;width:100%"   [(ngModel)]="ReportParameters.input3"/>
//         <input type="text" style="height:25px;width:100%"   [(ngModel)]="ReportParameters.input1"/>
//         <input type="text" style="height:25px;width:100%"  [(ngModel)]="ReportParameters.input2"/>
//         <input type="text" style="height:25px;width:100%"   [(ngModel)]="ReportParameters.input3"/>
//         <button class="btn btn-info confirm-btn" type="button"  (click)=onload()>RUN</button>
//         </div>
//         </div>
//         </div>
// `

  templateUrl:'./salesbookreport.component.html',
  styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"],
})
export class SalesBookReport{
 ReportParameters:any=<any>{};
 division: any[]=[];   
 customeraclist : any[]=[];

 @Output() reportdataEmit = new EventEmitter();

    constructor(private masterService:MasterRepo,public dialogref:MdDialogRef<SalesBookReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){

        //----------Default values on load
        this.ReportParameters.DATE1 = new Date().toJSON().split('T')[0];
        this.changestartDate(this.ReportParameters.DATE1,'AD');
        this.ReportParameters.DATE2 = new Date().toJSON().split('T')[0];
        this.changeEndDate(this.ReportParameters.DATE2,'AD');

        this.ReportParameters.OPT_REPORT_TYPE = "1";
        this.ReportParameters.OPT_SHOWDETAL_REPORT = "0";
        this.ReportParameters.OPT_COUNTERSALES = "0";
        this.ReportParameters.OPT_INAD = "0";
        this.ReportParameters.DISRATE = "0";
        this.ReportParameters.CHK_SALESMANWISESUMMARY = "0";
        this.ReportParameters.OPT_DISCOUNTEDSALES = "0";
        this.ReportParameters.CHK_INCLUDE_RETURN = "0";
        this.ReportParameters.DIVISION = "%";
        //-------------------------------


        this.division=[];
        this.masterService.getAllDivisions()
          .subscribe(res => {
            this.division.push(<Division>res);                
          }, error => {
            this.masterService.resolveError(error, "divisions - getDivisions");
          });

        // this.customeraclist = [];
        // this.masterService.getCustomers()
        // .subscribe(res => {
        //     console.log("customer" + JSON.stringify(res));
        //     //this.customeraclist.push(res);
        // },error => {
        //     this.masterService.resolveError(error, "customer - customerlist");        
        // });
    }
    onload()
    {
        this.DialogClosedResult("ok");
    }

    closeReportBox(){
        this.DialogClosedResult("Error!!");
    }
   public DialogClosedResult(res) {

    this.ReportParameters.DIVISION =  (this.ReportParameters.DIVISION == null || this.ReportParameters.DIVISION == "")?"%":this.ReportParameters.DIVISION;
    this.ReportParameters.ACID =  (this.ACID == null || this.ACID == "")?"%":this.ACID;
    this.ReportParameters.SALESMAN = "%";
    this.ReportParameters.VCHR = "A";
    this.ReportParameters.FX_VOUCHER_TYPE = "SI";

    //alert("chksalesmanwise"+this.ReportParameters.CHK_SALESMANWISESUMMARY+"--salesman"+this.ReportParameters.SALESMAN+"--acid"+this.ReportParameters.ACID+ "--div" +this.ReportParameters.DIVISION+ "--disrate" + this.ReportParameters.DISRATE + "--rep type" + this.ReportParameters.OPT_REPORT_TYPE + "--show detail--" + this.ReportParameters.OPT_SHOWDETAL_REPORT + "--countersales--" + this.ReportParameters.OPT_COUNTERSALES+ "-inad--" + this.ReportParameters.OPT_INAD +"~"+ this.ReportParameters.DATE1 +"~"+ this.ReportParameters.DATE2 );
    
    this.reportdataEmit.emit({ status: res, data: {reportname:'Sales Book Report', reportparam:this.ReportParameters}});
      
    }


    //Autocomplete begins
    dropListItem = (keyword: any): Observable<Array<any>> => {

        return new Observable((observer: Subscriber<Array<any>>) => {
            this.masterService.getCustomers().map(data=>{
                return data.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
            }
            ).subscribe(res =>{observer.next(res);})
        }).share();
    }

    ACCNAME : string = '';
    ACCODE : string = '';
    ACID: string = '';

    accodeChanged(value :string){
        var item = this.masterService.accountList.find(x => x.ACCODE == value);
        console.log({valueType: value,found : item ,items : this.masterService.accountList});
        this.ACCNAME = '';
        if (item){
            value = item.ACNAME;
            console.log(value + "****");
            this.ACCNAME = value;
        }

    }

    itemChanged(value : any){
        console.log({itemChangedValue: value});
        if (typeof(value) === "object"){
            this.ACCNAME = value.ACNAME;
            this.ACCODE = value.ACCODE;
            this.ACID = value.ACID;
        }
    }

    //end autocomplete

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

    dateString: any = '';
    date1: any = '';
    daysPrior: any = '';
    dateId: any = '';
    finalDate: any= '';
    changeDateByRange(value:any){

        if (value == "1"){
            //alert("week selected!!"); yy-mm-dd
            
            this.dateId = 7;
            this.dateString = ""+ this.getCurrentDate() +"";
            this.date1 = new Date(this.dateString);
            this.daysPrior = parseInt(this.dateId);
            this.date1.setDate(this.date1.getDate() - this.daysPrior);
            this.finalDate =  (this.date1.toISOString().slice(0, 11).replace('T', ' '));

            //alert(this.finalDate);
            this.ReportParameters.DATE1 = (this.finalDate).trim();
            this.changestartDate(this.ReportParameters.DATE1,'AD');
 
        }
         else if (value == "2"){
        //     //alert("month selected!!");
            this.dateId = 30;
            this.dateString = ""+ this.getCurrentDate() +"";
            this.date1 = new Date(this.dateString);
            this.daysPrior = parseInt(this.dateId);
            this.date1.setDate(this.date1.getDate() - this.daysPrior);
            this.finalDate =  (this.date1.toISOString().slice(0, 11).replace('T', ' '));

            //alert(this.finalDate);
            this.ReportParameters.DATE1 = (this.finalDate).trim();
            this.changestartDate(this.ReportParameters.DATE1,'AD');
         }
        else{
        // alert("year selected");
        this.dateId = 365;
        this.dateString = ""+ this.getCurrentDate() +"";
        this.date1 = new Date(this.dateString);
        this.daysPrior = parseInt(this.dateId);
        this.date1.setDate(this.date1.getDate() - this.daysPrior);
        this.finalDate =  (this.date1.toISOString().slice(0, 11).replace('T', ' '));

        //alert(this.finalDate);
        this.ReportParameters.DATE1 = (this.finalDate).trim();
        this.changestartDate(this.ReportParameters.DATE1,'AD');
         }
    }


    dd: any;
    mm: any;
    yyyy: any;
    today: any;
    getCurrentDate(){
        this.today = new Date();
        this.dd = this.today.getDate();
        this.mm = this.today.getMonth() + 1; //January is 0!
    
        this.yyyy = this.today.getFullYear();
        if (this.dd < 10) {
            this.dd = '0' + this.dd;
        }
        if (this.mm < 10) {
            this.mm = '0' + this.mm;
        }
        this.today = this.mm + '/' + this.dd + '/' + this.yyyy;
               
        return this.today;
    }

}