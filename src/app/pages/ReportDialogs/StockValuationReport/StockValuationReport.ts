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
    selector:'stock-valuation-report',
    templateUrl:'./StockValuationReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    //styleUrls:['../MasterDialogReport/Report.css']
  
})
export class StockValuation{
    StockValuation:any=<any>{};
    //SelectedWarehouse:Object={};
    items:any[]=[];
    division:any[]=[];
    itemCode:any[]=[];
    itemName:any[]=[];


    SelectedWarehouse="";

 @ViewChild('childModal') childModal: ModalDirective;
 
 @Output() reportdataEmit = new EventEmitter();
    iName: any;
    listFilterHolder: any;
    selectedProd: string;
    itemMcode:any;
   

    constructor(private masterService:MasterRepo,public dialogRef:MdDialog){
       
        this.division=[];
        this.itemName=[]=[]; 
        this.StockValuation.DATE2=new Date().toJSON().split('T')[0]; 
        this.changeEndDate(this.StockValuation.DATE2,"AD");
        this.StockValuation.OPT_FIFO="F";
        this.StockValuation.OPT_SHOWSUMMARY_REPORT="0";
   
        this.masterService.getAllDivisions()
        .subscribe(res=>{
            this.division.push(<Division>res);
        });
        this.masterService.getProductItemList()
        .subscribe(res=>{
            console.log("ItemList"+res);
            this.itemName=res;
                       
        })
           
    }
 
    onload()
    {
       this.DialogClosedResult("ok");
    } 
    public DialogClosedResult(res) {

        // console.log('yo chai MCODE '+MCODE);
        this.reportdataEmit.emit({ status: res, data: {reportname:'Stock Valuation Report',reportparam:{        
            DATE2:this.StockValuation.DATE2,
            PATH:'%',
            PHISCALID:'%',
            OPT_SHOWSUMMARY_REPORT:this.StockValuation.OPT_SHOWSUMMARY_REPORT,
            MCODE:(this.itemMcode==null|| this.itemMcode=="")?'%':this.itemMcode,
            DoValuation:1,
            OPT_FIFO:this.StockValuation.OPT_FIFO,
            DIVISION:this.StockValuation.selectedDivision,       
        } }});  
    }

    dropListItem = (keyword: any): Observable<Array<any>> => {
        return new Observable((observer: Subscriber<Array<any>>) => {
            if(keyword){
                this.masterService.getProductItemList().map(data=>{
                    return data.filter(ac => ac.DESCA.toUpperCase().indexOf(keyword.toUpperCase()) > -1);
                })
                .subscribe(res=>{
                    observer.next(res);                             
                })
            }
            else{
                this.masterService.getProductItemList()
                .subscribe(data=>{
                    observer.next(data);
                })
            }         
        }).share();
    }



    changeEntryDate(value, format: string) {
        try{
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.StockValuation.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);  
            this.StockValuation.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));          
        }
    }catch(e){}
    }

    changeEndDate(value, format: string) {
        try{
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);         
            this.StockValuation.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);         
            this.StockValuation.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }
    }
      catch(e){}
    }
    
   
    menucodeChanged(value: string) {
        var item = this.masterService.itemList.find(x => x.MENUCODE == value);
        //var itemMcod=this.masterService.itemList.find(x=>x.MCODE==value);
        console.log({ valueType: value, found: item, items: this.masterService.itemList });
        this.selectedProd = "";
        this.itemMcode="";
        if (item) {
            value = item.DESCA;
            // value=item.MCODE;
            console.log("menucode"+value);        
            this.selectedProd = value;
            this.itemMcode=item.MCODE;

        }
        else {
            value = undefined;
        }    
    }

    itemChanged(value: any) {
        console.log({ itemchangedValue: value });
        if (typeof (value) === 'object') {          
            this.itemCode=value.MENUCODE;
            this.itemMcode=value.MCODE;

        }

    }
    
    hide(){
        this.DialogClosedResult("Error");
    }
    
 

}