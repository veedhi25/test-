import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter, ViewChild} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { ModalDirective } from 'ngx-bootstrap';
import { MasterRepo } from '../../../common/repositories';
import { Warehouse, Division, ProductType } from '../../../common/interfaces';
import { Subscriber } from 'rxjs';
// import { Division } from '../../masters/components/sales-terminal/sales-terminal.interface';


@Component({
    selector:'settlement-stock-register',
    templateUrl:'./SettlementStockRegisterReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
  
})
export class SettlementStockRegister{
    SettlementRegister:any=<any>{};
   
//  @ViewChild('lgModal') childModal: ModalDirective;
 @ViewChild('childModal') childModal: ModalDirective;
 
 @Output() reportdataEmit = new EventEmitter();
 division:any[]=[];
 settlementModeList:any[]=[];

 selectedProd: string;
 itemMcode:any;
 itemCode:any[]=[];

    constructor(private masterService:MasterRepo ){
        this.division=[];
        this.settlementModeList=[];
      
        

        this.SettlementRegister.DATE1=new Date().toJSON().split('T')[0]; 
        this.changeEntryDate(this.SettlementRegister.DATE1,"AD");
        this.SettlementRegister.DATE2=new Date().toJSON().split('T')[0]; 
        this.changeEndDate(this.SettlementRegister.DATE2,"AD");

        this.masterService.getAllDivisions()
        .subscribe(res=>{
            this.division.push(<Division>res);
        });
        this.masterService.getSettlementMode()
        .subscribe(res=>{
            console.log("settlement list"+res);
            this.settlementModeList.push(res);

        })

    }
    onload()
    {
       this.DialogClosedResult("ok");
    }
   public DialogClosedResult(res) {
      


         this.reportdataEmit.emit({ status: res, data: {reportname:'Stock Settlement Register',reportparam: {
                DATE1:this.SettlementRegister.DATE1,
                DATE2:this.SettlementRegister.DATE2,
                MODE:this.SettlementRegister.selectedMode,
                DIV:this.SettlementRegister.selectedDivision,
            
        } }});  
    }

    // Close Method
    hide(){
        this.DialogClosedResult("Error");
    }
    //  Date change method
    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.SettlementRegister.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);  
            this.SettlementRegister.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));          
        }
      
    }
    
    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);         
            this.SettlementRegister.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);         
            this.SettlementRegister.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }
      
    }
  
   
}