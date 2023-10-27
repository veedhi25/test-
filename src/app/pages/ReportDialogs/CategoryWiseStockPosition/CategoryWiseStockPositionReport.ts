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
    selector:'category-wise-stock-position',
    templateUrl:'./CategoryWiseStockPositionReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
  
})
export class CategoryWiseStockPosition{
    CategoryStockPosition:any=<any>{};
    ReportType:any=<any>{};
    ReportOptions:any =<any>{};
    ReportFormat:any=<any>{};
    StockValuation:any=<any>{};

//  @ViewChild('lgModal') childModal: ModalDirective;
 @ViewChild('childModal') childModal: ModalDirective;
 
 @Output() reportdataEmit = new EventEmitter();

 WarehouseList:any[]=[];

 division:any[]=[];
 settlementModeList:any[]=[];


 supplierList='';

 selectedProd: string;
 itemMcode:any;
 itemCode:any[]=[];


    
    constructor(private masterService:MasterRepo ){
        this.division=[];

      
        this.WarehouseList=[];

        this.CategoryStockPosition.DATE=new Date().toJSON().split('T')[0]; 
        this.changeEntryDate(this.CategoryStockPosition.DATE,"AD");
        this.CategoryStockPosition.DATE2=new Date().toJSON().split('T')[0]; 
        this.changeEndDate(this.CategoryStockPosition.DATE2,"AD");

     
        this.masterService.getWarehouseList()
        .subscribe(res=>{
            console.log("warehouse list"+res);
         this.WarehouseList.push(<Warehouse>res);
        }); 

    }
    onload()
    {
       this.DialogClosedResult("ok");
    }
   public DialogClosedResult(res) {
         this.reportdataEmit.emit({ status: res, data: {reportname:'Category Wise Stock Position',reportparam: {
            DATE:this.CategoryStockPosition.DATE,
            WARE:this.CategoryStockPosition.SelectedWarehouse
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
            this.CategoryStockPosition.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);  
            this.CategoryStockPosition.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));          
        }
      
    }
    
    changeEndDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);         
            this.CategoryStockPosition.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);         
            this.CategoryStockPosition.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }
      
    }

   
}