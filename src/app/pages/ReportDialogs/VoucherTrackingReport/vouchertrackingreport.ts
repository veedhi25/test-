import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { MasterRepo } from '../../../common/repositories';
import { TAcList } from '../../../common/interfaces/Account.interface';
import { Subscriber } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';


export interface DialogInfo{
    header: string;
    message: Observable<string>;

}
@Component({
    selector : 'result-vouchertrackingreport-dialog',
    templateUrl : './vouchertrackingreport.component.html',
    styleUrls: ["../../Reports/reportStyle.css","../../modal-style.css"]

})

export class VoucherTrackingReport{
    ReportParameters:any=<any>{};
    partyList : any[]=[];
    
   
    @Output() reportdataEmit = new EventEmitter();
    constructor(private masterService: MasterRepo,public dialogref:MdDialogRef<VoucherTrackingReport>, @Inject(MD_DIALOG_DATA) public data: DialogInfo){

        this.ReportParameters.VNO = "%";
        this.partyList = [];
        // this.reportService.getAcList().map(fdata=>{return fdata.filter(x=>x.ACID.substring(0,2).toUpperCase()=='PA')}).map(data => {
        //     this.listFilterHolder = data.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
        //     return data;
        // }).subscribe(res => { observer.next(res); })

        this.masterService.getAcList()
            .subscribe(res => {
                console.log("aclist0"+ JSON.stringify(res));
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
        
        this.ReportParameters.PARTY = (this.ACID == "" || this.ACID == null )?"%":this.ACID;
        this.reportdataEmit.emit({ status: res, data: {reportname:'Voucher Tracking Report', reportparam:this.ReportParameters}});

    }   

        //Autocomplete Functions

        results: Observable<TAcList[]>;
        subscriptions: Subscription[] = [];
        listFilterHolder: any[] = [];
    
        dropListItem = (keyword: any): Observable<Array<any>> => {
         return new Observable((observer: Subscriber<Array<any>>) => {
                this.masterService.getAccount("from partyreport").map(res=>{ 
                    return res.filter(x=>x.ACID.substring(0,2).toUpperCase()=='PA');}).map(data=>{
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
    
        //autocomplete ends
    


}

