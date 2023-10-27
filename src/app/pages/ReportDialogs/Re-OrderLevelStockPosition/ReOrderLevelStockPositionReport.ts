import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, Output, EventEmitter, ViewChild} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Observable } from "rxjs/Observable";
import { ModalDirective } from 'ngx-bootstrap';
import { MasterRepo } from '../../../common/repositories';
import { Warehouse, Division, Item, TrnProd } from '../../../common/interfaces';
import { MethodCall } from '@angular/compiler';
import { modalConfigDefaults } from 'ngx-bootstrap/modal/modal-options.class';
import { MdDialog} from "@angular/material";
import { Divisions } from '../../masters/components/divisions';
import { Product } from '../../masters/components/sales-terminal/sales-terminal.interface';
import { Subscriber } from 'rxjs';


@Component({
    selector:'reorder-level-stockposition',
    templateUrl:'./ReOrderLevelStockPositionReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    //styleUrls:['../MasterDialogReport/Report.css']
  
})
export class ReOrderLevelStock{
    ReOrderLevelStock:any=<any>{};
    //SelectedWarehouse:Object={};
    items:any[]=[];
    division:any[]=[];
    itemCode:any[]=[];
    itemName:any[]=[];

    SelectedDivision="";
    SelectedWarehouse="";

 @ViewChild('childModal') childModal: ModalDirective;
 
 @Output() reportdataEmit = new EventEmitter();
    iName: any;
    listFilterHolder: any;
    selectedProd: string;
    itemMcode:any;
   

    constructor(private masterService:MasterRepo,public dialogRef:MdDialog){
        this.items=[];
        this.division=[];
        this.itemName=[]=[];   
        this.ReOrderLevelStock.DATE1=new Date().toJSON().split('T')[0]; 
        this.changeEntryDate(this.ReOrderLevelStock.DATE1,"AD");
        this.ReOrderLevelStock.DATE=new Date().toJSON().split('T')[0]; 
        this.changeEndDate(this.ReOrderLevelStock.DATE,"AD");  
        
        this.masterService.getWarehouseList()
        .subscribe(res=>{
            // console.log("aayo"+res);
            this.items.push(<Warehouse>res);
        });
    
            
    }
 
    onload()
    {
       this.DialogClosedResult("ok");
    } 
    public DialogClosedResult(res) {
       
    this.reportdataEmit.emit({ status: res, data: {reportname:'Re-Order Level Stock Position',reportparam:{
        WARE:this.ReOrderLevelStock.SelectedWarehouse,
        DIV:'',
        DATE:this.ReOrderLevelStock.DATE
     } }});  
    }


    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.ReOrderLevelStock.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);  
            this.ReOrderLevelStock.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));          
        }
      
    }
    
    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);         
            this.ReOrderLevelStock.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);         
            this.ReOrderLevelStock.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }
      
    }   
    hide(){
        this.DialogClosedResult("Error");
    }
    
 

}