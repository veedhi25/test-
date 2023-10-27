import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MasterRepo } from '../../repositories';
import { TransactionService } from '../../Transaction Components/transaction.service';
import { BatchStock, Product } from '../../interfaces';
import { resolve } from 'dns';

@Component(
    {
        selector: 'PItemList',
        templateUrl: './PopItems.html',
        styleUrls: ["../../../pages/Style.css", "../pStyle.css"],

    }
)
export class PoplistComponent {
  @Input("selectedRowIndex") selectedRowIndex:number=0;
  @Input("opened") opened:any;;

  selectedItemRow:number=0;
    summary:string;
    constructor(private masterService: MasterRepo,public _trnMainService: TransactionService) {
      
      
    }
    ngAfterViewInit(){
        // this.setFocus();
    }

    ngOnInit() {
      
      
        // this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus');
    }
    hide()
    {
      this.opened = false;
       this.masterService.PlistTitle="";
    }
    doubleClick(item)
    {
      item.voucherPrefix=this._trnMainService.TrnMainObj.VoucherAbbName;
item.partyacid=this._trnMainService.TrnMainObj.PARAC==""?null:this._trnMainService.TrnMainObj.PARAC;
        this.masterService
        .masterPostmethod("/getbatchWithAlternateUnitList", item)
        .subscribe(
            res => {
                if (res.status == "ok") {
                  
             
                         let item=JSON.parse(res.result); 
                         let index=this._trnMainService.TrnMainObj.ProdList.findIndex(x=>x.MCODE==item.MCODE);
                       
                      if(index<0)
                      {
                       
                        this._trnMainService.addRow();
                        

                        if(item.BatchObj!=null && item.BatchObj.MCODE!=null)
                        {
                          var ind=this._trnMainService.TrnMainObj.ProdList.findIndex(x=>x.MCODE==null);
                        this._trnMainService.assignValueToProdFromBarcode(item,ind);
                        this.masterService.PlistTitle="";

                       }else
                       {
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].MCODE=
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].MENUCODE=item.MCODE;
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].ITEMDESC=item.DESCA;
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].SELECTEDITEM = item;                                   
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].ISVAT = item.ISVAT;                                    
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].GSTRATE_ONLYFORSHOWING = item.GST;
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].GSTRATE = item.GST;
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].WEIGHT = item.GWEIGHT;
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].Mcat = item.MCAT;
                        this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].NWEIGHT = item.NWEIGHT;
                        this.masterService
                        .masterGetmethod(
                            "/getAltUnitsOfItem/" +
                            this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].MCODE
                        )
                        .subscribe(
                            res => {
                                if (res.status == "ok") {
                                  this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].Product=<Product>{};
                                  this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].Product.MCODE= this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].MCODE;
                                    this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].Product.AlternateUnits = JSON.parse(res.result);
                                    this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[this.selectedRowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT.toUpperCase() == item.UNIT.toUpperCase())[0];
                                    this.masterService.focusAnyControl("quantity" + this.selectedRowIndex);
                                }
                            },
                            error => {
                            }
                        );
                          this._trnMainService.batchlist=item.batchList;
                          this.masterService.PlistTitle = "batchList";
                        
                       }
                       }
                      else
                      {
                        let alreadyExistingitem= this._trnMainService.TrnMainObj.ProdList[index];
                        this._trnMainService.TrnMainObj.ProdList[index].Quantity+=1;
                        this._trnMainService.RealQuantitySet(index, alreadyExistingitem.CONFACTOR);
                       // this._trnMainService.CalculateNormalNew(index);
                       // this._trnMainService.ReCalculateBill();
                       this._trnMainService.ReCalculateBillWithNormal();
                       this.masterService.PlistTitle="";
                      }
                     // this._trnMainService.BarcodeFromScan="";
                     
                  
                    }
    
                                       
                 else {
                  alert(res.result);
                }
            },
            error => {
            }
        );
    }
    singleClick(index)
    {
        this.selectedItemRow = index;
        this.summary=this._trnMainService.ItemsListForMultiItemBarcode[index].itemSummary;
    }

    
  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) { 
    if (
      $event.code == "ArrowDown" &&
      this.selectedItemRow < this._trnMainService.ItemsListForMultiItemBarcode.length -1
    ) {
      $event.preventDefault();
      this.selectedItemRow++;
      if(this._trnMainService.ItemsListForMultiItemBarcode[this.selectedItemRow]!=null){
      this.summary=this._trnMainService.ItemsListForMultiItemBarcode[this.selectedItemRow].itemSummary;
      }
    } else if ($event.code == "ArrowUp" && this.selectedItemRow-1 > -1) {
      $event.preventDefault();
      this.selectedItemRow--; 
      if(this._trnMainService.ItemsListForMultiItemBarcode[this.selectedItemRow]!=null){
      this.summary=this._trnMainService.ItemsListForMultiItemBarcode[this.selectedItemRow].itemSummary;
      }
    } else if ( 
      $event.code == "Enter" &&
      this.selectedItemRow >= 0 &&
      this.selectedItemRow < this._trnMainService.ItemsListForMultiItemBarcode.length 
    ) { 
      $event.preventDefault();
      this.doubleClick(this._trnMainService.ItemsListForMultiItemBarcode[this.selectedItemRow]);
      this.hide();
      
    }
     else if ($event.code == "Escape") { 
      $event.preventDefault(); 
      this.hide();
     
    }

  }
}