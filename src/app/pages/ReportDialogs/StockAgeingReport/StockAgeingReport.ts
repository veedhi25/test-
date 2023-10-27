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
    selector:'stock-ageing',
    templateUrl:'./StockAgeingReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
  
})
export class StockAgeingReport{

    StockAgeing:any=<any>{};
  
    selectedDivision:string;


//  @ViewChild('lgModal') childModal: ModalDirective;
 @ViewChild('childModal') childModal: ModalDirective;
 
 @Output() reportdataEmit = new EventEmitter();
 division:any[]=[];
 items:any[]=[];//warehouse
 itemsGroup:any[]=[];
 itemsType:any[]=[];
 itemsCategory:any={};
 suppliersName:any[]=[];


 selectedProd: string;
 itemMcode:any;
 itemCode:any[]=[];

 
    
    constructor(private masterService:MasterRepo ){
        this.division=[];
        this.items=[];//warehouse
        this.itemsType=[];
        this.itemsCategory=[];

        this.StockAgeing.DATE2=new Date().toJSON().split('T')[0]; 
        this.changeEndDate(this.StockAgeing.DATE2,"AD");
        this.StockAgeing.WISE="ITEM";

        this.masterService.getAllDivisions()
        .subscribe(res=>{
            this.division.push(<Division>res);
        });
        this.masterService.getWarehouseList()
        .subscribe(res=>{
            // console.log("aayo"+res);
            this.items.push(<Warehouse>res);
        });
        this.masterService.getPTypeList()
        .subscribe(res=>{
            // console.log(res);
            this.itemsType.push(<ProductType>res);
        })
        this.masterService.getMCatList()
        .subscribe(res=>{
            // console.log("cat"+res);
            this.itemsCategory.push(res);
        })
        this.masterService.getSupplierList()
        .subscribe(res=>{
            // console.log("supplierList"+res);
            this.suppliersName.push(res);
        })

    

    }
    onload()
    {
       this.DialogClosedResult("ok");
    //    console.log("select DivisionItemList"+this.StockAgeing.selectedDivision);
    //    console.log("select Suppleir Id"+this.StockAgeing.selectedSupplier);
    }
   public DialogClosedResult(res) {
  
         this.reportdataEmit.emit({ status: res, data: {reportname:'Stock Ageing Report',reportparam: {
                // SUPPLIER_ACID:this.SelectedSupplierName,
                SUPPLIER_ACID:this.StockAgeing.selectedSupplier,
                DATE2:this.StockAgeing.DATE2,
                D1:this.StockAgeing.D1,
                D2:this.StockAgeing.D2,
                D3:this.StockAgeing.D3,
                D4:this.StockAgeing.D4,
                D5:this.StockAgeing.D5,
                D6:this.StockAgeing.D6,
                PRODUCT:this.itemMcode,
                // DIVISION:this.SelectedDivision,
                DIVISION:this.StockAgeing.selectedDivision,
                WISE:this.StockAgeing.WISE,
                ByCostRate:0,
                BYBARCODE:0,           
               
        } }});  
    }

    // Close Method
    hide(){
        this.DialogClosedResult("Error");
    }
    //  Date change method
    changeEntryDate(value, format: string) {
        try{
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.StockAgeing.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);  
            this.StockAgeing.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));          
        }
    }catch(e){}
      
    }
    
    changeEndDate(value, format: string) {
        try{
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);         
            this.StockAgeing.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);         
            this.StockAgeing.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }
    }catch(e){}
      
    }

    // method for autocomplete
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
    
    menucodeChanged(value: string) {
        var item = this.masterService.itemList.find(x => x.MENUCODE == value);
        // console.log({ valueType: value, found: item, items: this.masterService.itemList });
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




}