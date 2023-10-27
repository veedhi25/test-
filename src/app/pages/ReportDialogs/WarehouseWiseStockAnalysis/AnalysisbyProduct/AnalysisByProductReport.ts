import {Component, Output, EventEmitter, ViewChild, Input} from '@angular/core';
import { Observable } from "rxjs/Observable";
import { ModalDirective } from 'ngx-bootstrap';
import { MasterRepo } from '../../../../common/repositories';
import { MdDialog} from "@angular/material";
import { Subscriber } from 'rxjs';


@Component({
    selector:'analysis-by-product',
    templateUrl:'./AnalysisByProductReport.html',
    styleUrls: ["../../../modal-style.css", "../../../Reports/reportStyle.css"],
    //styleUrls:['../MasterDialogReport/Report.css']
  
})
export class AnalysisbyProduct{
    AnalysisProduct:any=<any>{};
    //SelectedWarehouse:Object={};
    items:any[]=[];
    division:any[]=[];
    itemCode:any[]=[];
    itemName:any[]=[];

@Input()MODE:number;

 @ViewChild('childModal') childModal: ModalDirective;
 
 @Output() reportdataEmit = new EventEmitter();
    iName: any;
    listFilterHolder: any;
    selectedProd: any;
    selectedItem: any=<any>{};
    itemMcode:any;
    suppliersName:any[]=[];

    constructor(private masterService:MasterRepo,public dialogRef:MdDialog){
        this.items=[];
        this.division=[];
        this.itemName=[]=[];
        this.itemListobj=[];
        this.AnalysisProduct.DATE=new Date().toJSON().split('T')[0]; 
        this.changeEntryDate(this.AnalysisProduct.DATE,"AD");
     
        // this.masterService.getProductItemList()
        // .subscribe(res=>{
        //     this.itemName=res;
        //     // console.log("ItemList" );

            
        // })
        this.masterService.getSupplierList()
        .subscribe(res=>{

            console.log("supplierList"+res);
            this.suppliersName.push(res);
        })
           
    }
 
    onload()
    {
       this.DialogClosedResult("ok");
    } 
    public DialogClosedResult(res) {

        let a:any=this.AnalysisProduct.selectedSupplier;
      
    this.reportdataEmit.emit({ status: res, data: {reportname:'Analysis by Product Wise',reportparam:{
       // MAJORGROUP:'',
        MCODES:this.itemMcode,
        DATE:this.AnalysisProduct.DATE,
        PARTY:this.AnalysisProduct.selectedSupplier,
            if(MODE='0')
            {
                
            }    
            } }});  
    }

    changeEntryDate(value, format: string) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.AnalysisProduct.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);  
            this.AnalysisProduct.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));          
        }
      
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
   
    menucodeChanged(value: string) {
        var item = this.masterService.itemList.find(x => x.MENUCODE == value);
        //var itemMcod=this.masterService.itemList.find(x=>x.MCODE==value);
        console.log({ valueType: value, found: item, items: this.masterService.itemList });
        this.selectedProd = "";
        this.itemMcode="";
        if (item) {
            value = item.DESCA;
            // value=item.MCODE;
            console.log("Display Item Name"+value);        
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
    itemListobj:any=<any>{};
    OnClick(){
        this.selectedProd
        this.itemListobj = this.selectedProd.DESCA;
        console.log(this.selectedProd);
      
       
    }
  
 

}