import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter, ViewChild} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { ModalDirective } from 'ngx-bootstrap';
import { MasterRepo } from '../../../common/repositories';
import { Warehouse } from '../../../common/interfaces';


@Component({
    selector:'max-stock-position',
    templateUrl:'./MaxStockPositionReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
  
})
export class MaxStockPosition{
    MaxStockPosition:any=<any>{};
    WarehouseList:any[]=[];


    SelectedDivision="";
    SelectedWarehouse="";
 @ViewChild('childModal') childModal: ModalDirective;
 
 @Output() reportdataEmit = new EventEmitter();
    constructor(public masterService:MasterRepo ){ 
        this.WarehouseList=[];
        this.MaxStockPosition.DATE1=new Date().toJSON().split('T')[0]; 
        this.changeEntryDate(this.MaxStockPosition.DATE1,"AD");
        this.MaxStockPosition.DATE=new Date().toJSON().split('T')[0]; 
        this.changeEndDate(this.MaxStockPosition.DATE,"AD");
        this.masterService.getWarehouseList()
           .subscribe(res=>{
            this.WarehouseList.push(<Warehouse>res);
           }); 
               
    }
    onload()
    {
       this.DialogClosedResult("ok");
    }
    public DialogClosedResult(res) {
        let DIVISION:string=this.SelectedDivision;
    this.reportdataEmit.emit({ status: res, data: {reportname:'Min Stock Position',reportparam: {
        WARE:this.MaxStockPosition.SelectedWarehouse,
        DIV:'',
        DATE:this.MaxStockPosition.DATE
    } }});  
    }

      // Close Method
    hide(){
        this.DialogClosedResult("Error");
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.MaxStockPosition.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);
            this.MaxStockPosition.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
           
        }
      
    }

    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);          
            this.MaxStockPosition.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);          
            this.MaxStockPosition.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }
      
    }
    onSelectWarehouse(value){
        console.log("Selected warehouse"+value);
        this.SelectedWarehouse=value;
    }
   

}