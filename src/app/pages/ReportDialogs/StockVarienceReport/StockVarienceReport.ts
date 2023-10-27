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
    selector:'stock-varience',
    templateUrl:'./StockVarienceReport.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
  
})
export class StockVarienceReport{

    StockVarience:any=<any>{};
    ReportType:any=<any>{};
    ReportOptions:any =<any>{};
    ReportFormat:any=<any>{};
    StockValuation:any=<any>{};

//  @ViewChild('lgModal') childModal: ModalDirective;
 @ViewChild('childModal') childModal: ModalDirective;
 
 @Output() reportdataEmit = new EventEmitter();
 division:any[]=[];
 items:any[]=[];//warehouse
 itemsGroup:any[]=[];
 itemsType:any[]=[];
 itemsCategory:any={};
 suppliersName:any[]=[];
 productGroupTree:any[]=[];

 supplierList='';

 selectedProd: string;
 itemMcode:any;
 itemCode:any[]=[];

 SelectedDivision="";
 SelectedWarehouse="";
 SelectedItemCategory="";
 SelectedItemType="";
 SelectedSupplierName="";
    
    constructor(private masterService:MasterRepo ){
        this.StockVarience.DATE1=new Date().toJSON().split('T')[0]; 
        //this.changeEntryDate(this.StockPosition.DATE1,"AD");
        this.StockVarience.DATE2=new Date().toJSON().split('T')[0]; 
       // this.changeEndDate(this.StockPosition.DATE2,"AD");
        this.division=[];
        this.items=[];//warehouse
        this.itemsType=[];
        this.itemsCategory=[];
        this.suppliersName=[];


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
            console.log("cat"+res);
            this.itemsCategory.push(res);
        })

        // this.masterService.getMCatList()
        // .subscribe(res=>{
            
        //      this.itemsCategory=res
        // })
        

        this.masterService.getSupplierList()
        .subscribe(res=>{

            console.log("supplierList"+res);
            this.suppliersName.push(res);
        })

        // this.masterService.getProductGroupTree()
        // .subscribe(res=>{
        //     this.productGroupTree.push(res);
        // })


    }
    onload()
    {
       this.DialogClosedResult("ok");
    }
   public DialogClosedResult(res) {
       let MENUCAT:any=this.SelectedItemCategory;
       let PTYPE:any=this.SelectedItemType;
       let SUPPLIER_ACID:any=this.SelectedSupplierName;


         this.reportdataEmit.emit({ status: res, data: {reportname:'Stock Variance Report',reportparam: {
                WAREHOUSE:(this.SelectedWarehouse==null || this.SelectedWarehouse=="")?"%":this.SelectedWarehouse,            
                DATE1:this.StockVarience.DATE1,
                MGROUP:'%',
                Batch:'ST1',
                OPT_FLAG:this.StockVarience.OPT_FLAG,
                DATE2:this.StockVarience.DATE2,
                CHK_BYBARCODE:0,
                OPT_STOCKCOUNTING:0             
        } }});  
    }

    // Close Method
    hide(){
        this.DialogClosedResult("Error");
    }
    //  Date change method
    changeEntryDate(value, format: string, dType) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);
            this.StockVarience.BSDATE1 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
            
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);  
            this.StockVarience.DATE1 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));          
        }
      
    }
    
    changeEndDate(value, format: string, dType) {
        var adbs = require("ad-bs-converter");
        if (format == "AD") {
            var adDate = (value.replace("-", "/")).replace("-", "/");
            var bsDate = adbs.ad2bs(adDate);         
            this.StockVarience.BSDATE2 = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
        }
        else if (format == "BS") {
            var bsDate = (value.replace("-", "/")).replace("-", "/");
            var adDate = adbs.bs2ad(bsDate);         
            this.StockVarience.DATE2 = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));

        }
      
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

    // method for Division selection
    onSelectDivision(value){
        this.SelectedDivision=value;
    }
    onSelectWarehouse(value){
        this.SelectedWarehouse=value;
    }
    onSelectItemCategory(value){
       // console.log("ayo Item Category"+value);
        this.SelectedItemCategory=value;
    }
    onSelectItemType(value){
        this.SelectedItemType=value;
    }
    onSelectSupplierName(value){
        this.SelectedSupplierName=value;
    }


}