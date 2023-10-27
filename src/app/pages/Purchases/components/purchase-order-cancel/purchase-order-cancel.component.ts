import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';


@Component({
    selector: "purchase-order-cancel",
    templateUrl: "./purchase-order-cancel.component.html",
    providers: [TransactionService],
   
})

export class PurchaseOrderCancelComponent {

  @ViewChild("genericGridPO") genericGridPO: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings(); 

    constructor(
      public masterService: MasterRepo, 
      public _trnMainService: TransactionService,
      private alertService : AlertService,
      private loadingSerive : SpinnerService 
    ) {
      this._trnMainService.initialFormLoad(58);

      this.gridPopupSettings = Object.assign(new GenericPopUpSettings,{
        title: "Purchase Order",
        apiEndpoints: `/getTrnMainPagedList/PO`,
        defaultFilterIndex : 0,
        columns: [
          {
            key: "VCHRNO",
            title: "Voucher No.",
            hidden: false,
            noSearch: false
          },
          {
            key: "DIVISION",
            title: "Division",
            hidden: false,
            noSearch: false
          },
          {
            key: "TRNAC",
            title: "Trn. A/c",
            hidden: false,
            noSearch: false
          },
          {
            key: "PhiscalId",
            title: "Fiscal Year",
            hidden: false,
            noSearch: false
          }
        ]
      });
    }
    ngOnInit() { 
      this._trnMainService.pageHeading = "PO Cancel"
    } 

    showPurchaseOrderPopup(){  
      if(!this._trnMainService.TrnMainObj.BILLTO || this._trnMainService.TrnMainObj.BILLTO == "" || this._trnMainService.TrnMainObj.BILLTO == null)
      {
        this._trnMainService.billTo = "";
      }
      this.genericGridPO.show(this._trnMainService.billTo, true)
    }

    onPurchaseOrderSelect(purchaseOrder : any){ 
      this.loadPurchaseOrderForPOCancel(purchaseOrder.VCHRNO);
    } 

    loadPurchaseOrderForPOCancel(voucharNo){
      this.loadingSerive.show("Getting data, Please wait...");
      this.masterService.loadPurchaseOrderForPOCancel(voucharNo).subscribe(
      result => { 
        this.loadingSerive.hide();
        if (result.status == "ok") { 
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.REFBILL = voucharNo;
          for(let i in this._trnMainService.TrnMainObj.ProdList){
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.getPricingOfItem(i,"",false);
         
            this._trnMainService.TrnMainObj.ProdList[i].inputMode= false; 
            this._trnMainService.TrnMainObj.ProdList[i].AltQty= this._trnMainService.TrnMainObj.ProdList[i].ALTQTY_IN; 
          } 
          this._trnMainService.TrnMainObj.VoucherType = 58; 
          this._trnMainService.TrnMainObj.VoucherPrefix = "PC";  
          this._trnMainService.TrnMainObj.Mode = "NEW";
         // this._trnMainService.ReCalculateBill();  
         this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }
}
