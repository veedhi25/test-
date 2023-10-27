import { Component, ViewChild, OnInit } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { truncate } from "fs";
import { TrnProd, VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";

@Component({
  selector: "add-delivery-challaan",
  templateUrl: "./add-delivery-challaan.component.html",
  providers: [TransactionService],
  styles: [
    `
    .GRNPopUp tbody tr:hover {
      background-color: #e0e0e0;
    }
    .GRNPopUp tr.active td {
      background-color: #123456 !important;
      color: white;
    }
    .modal-dialog.modal-md {
      top: 45%;
      margin-top: 0px;
    }

    .modal-dialog.modal-sm {
      top: 45%;
      margin-top: 0px;
    }

    .table-summary > tbody > tr > td {
      font-size: 12px;
      font-weight: bold;
    }

    .table-summary > tbody > tr > td:first-child {
      text-align: left !important;
    }
    `
  ]
})
export class AddDeliveryChallaanComponent implements OnInit {
  @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;
  @ViewChild("genericGridPerformaInvoice") genericGridPerformaInvoice: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForHOPerformaRequest: GenericPopUpSettings = new GenericPopUpSettings();

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private loadingSerive: SpinnerService,

  ) {
    this._trnMainService.initialFormLoad(113);
    this._trnMainService.formName = "DeliveryChallaan";
    


    this.gridPopupSettings = Object.assign(new GenericPopUpSettings,{
      title: "Performa Vouchers",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'VCHRNO',
          title: 'SO NO.',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TRNDATE',
          title: 'DATE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'NETAMNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false
        }
      ]
    });  
    // this.route.queryParams.subscribe(params => {
    //   if (params.voucher) {
    //     
    //     let voucherNo = params.voucher;
    //     this.loadRcvdDeliveryChallaan(params.voucher,params.FROMCOMPANY);
    //   }
    // });  
  }

  ngOnInit() {
    this.masterService.masterGetmethod("/gettransactionmodes").subscribe(
      res => {
        if (res.status == "ok") {
          this._trnMainService.paymentmodelist = res.result;
        } else {
          this.alertService.error(res.result);
        }
      },
      error => {
        this.alertService.error(error);
       }
    );
  }
  loadRcvdDeliveryChallaan(voucherNo: string, FROMCOMPANYID: string,division:string) {
  
    this.loadingSerive.show("Getting data, Please wait...");
     this.masterService.SelectedDeliveryChallaan(voucherNo, FROMCOMPANYID,division ).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result;//JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.Mode = "NEW";
                   
            
          this._trnMainService.TrnMainObj.VoucherType = VoucherTypeEnum.MaterialReceipt; 
          this._trnMainService.TrnMainObj.VoucherPrefix = "MR";
          this._trnMainService.TrnMainObj.VoucherType = 110;

          this._trnMainService.TrnMainObj.tag = "fromDdeliveryChallan";
          this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
          
          
          this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
          else { this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_TI"; }
          this._trnMainService.TrnMainObj.AdditionalObj.tag = "fromDdeliveryChallan";
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            
            this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantityMR = this._trnMainService.TrnMainObj.ProdList[i].Quantity;
         
             this._trnMainService.TrnMainObj.ProdList[i].AltQty=0;        
            this._trnMainService.TrnMainObj.ProdList[i].RealQty=0;

           
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, this._trnMainService.TrnMainObj.PARTY_ORG_TYPE, 0, this._trnMainService.TrnMainObj.ProdList[i].PRATE);
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
           
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
           
          }

          
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          this._trnMainService.ReCalculateBillWithNormal();
          this.setSchemDiscountReadonly();
        }
        else {
          this.alertService.error(result.result._body);
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }
  getSelectedRcvdDeliveryChallaan(Voucher, division, phiscalid) {
  
    this.loadingSerive.show("Getting data, Please wait...");
     this.masterService.loadHoDeliveryChallaan(Voucher, division, phiscalid).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result;//JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.Mode = "NEW";
                   
            
          this._trnMainService.TrnMainObj.VoucherType = VoucherTypeEnum.MaterialReceipt; 
          this._trnMainService.TrnMainObj.VoucherPrefix = "MR";
          this._trnMainService.TrnMainObj.VoucherType = 110;

          this._trnMainService.TrnMainObj.tag = "fromDdeliveryChallan";
          this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
          
          
          this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
          else { this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_TI"; }
          this._trnMainService.TrnMainObj.AdditionalObj.tag = "fromDdeliveryChallan";
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            
            this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantityMR = this._trnMainService.TrnMainObj.ProdList[i].Quantity;
         
             this._trnMainService.TrnMainObj.ProdList[i].AltQty=0;        
            this._trnMainService.TrnMainObj.ProdList[i].RealQty=0;

           
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, this._trnMainService.TrnMainObj.PARTY_ORG_TYPE, 0, this._trnMainService.TrnMainObj.ProdList[i].PRATE);
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
           
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
           
          }
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          this._trnMainService.ReCalculateBillWithNormal();
          this.setSchemDiscountReadonly();
        }
        else {
          this.alertService.error(result.result._body);
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }
  setSchemDiscountReadonly() {
    this._trnMainService.TrnMainObj.ProdList.forEach(x => { x.ISAUTOPRIMARYSCHEME = true, x.ISAUTOSECONDARYSCHEME = true, x.ISAUTOLIQUIDATIONSCHEME = true });
  }
      

  showLoadFromSOPopup($event) {
    this.genericGridSO.show();
  }

  showLoadFromPerformaInvoiceRequestPopup($event) {
    this.genericGridPerformaInvoice.show();
  }

  onSalesOrderSelect(item) {
    this.loadingSerive.show("Please wait. Converting Sales order to Proforma Invoice.");
    this.masterService.loadSalesInvoiceFromSalesOrder(item.VCHRNO).subscribe(
      result => {
        if (result.status == "ok") {
          this.loadingSerive.hide();
          if (result.message != null && result.message != "" && result.message != " ") {
            this.alertService.warning(result.message);
          }
          this._trnMainService.TrnMainObj = JSON.parse(result.result);
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
            this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
          }
          else {
            this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_DC";
            this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE = this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE;
            this._trnMainService.TrnMainObj.AdditionalObj.DSMNAME = this._trnMainService.TrnMainObj.AdditionalObj.DSMNAME;
            this._trnMainService.TrnMainObj.AdditionalObj.BEAT = this._trnMainService.TrnMainObj.AdditionalObj.BEAT;
          }
          this._trnMainService.TrnMainObj.AdditionalObj.tag = item.tag == 'PURCHASEORDER_MOBILE' ? "MOBILE_ORDER_DC" : "MANUAL_SO";
          this._trnMainService.TrnMainObj.Mode = "NEW";
          if (this._trnMainService.TrnMainObj.ProdList == undefined ||
            this._trnMainService.TrnMainObj.ProdList.length==0 )
            {
              this._trnMainService.TrnMainObj.ProdList=[];
              var newRow = <TrnProd>{};
              newRow.inputMode = true;
              newRow.MENUCODE = null;
              newRow.ITEMDESC = null;
              newRow.RATE = null;
              newRow.RATE = null;
              newRow.NCRATE = null;
              newRow.AMOUNT = null;
              newRow.DISCOUNT = null;
              newRow.VAT = null;
              newRow.NETAMOUNT = null;
              newRow.ITEMTYPE = null;
              newRow.RECEIVEDTYPE = null;
              newRow.WAREHOUSE = null;
              newRow.BC = null;
              newRow.TRANSACTIONMODE = "NEW";
              this._trnMainService.TrnMainObj.ProdList.push(newRow);              
            }
        
          this._trnMainService.TrnMainObj.REFBILL = item.VCHRNO;
          this._trnMainService.TrnMainObj.REFORDBILL = item.VCHRNO;
          this._trnMainService.TrnMainObj.PARAC = this._trnMainService.TrnMainObj.TRNAC;
          this._trnMainService.TrnMainObj.VoucherType = 113;
          this._trnMainService.TrnMainObj.VoucherPrefix = "DY";
          this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.setAltunitDropDownForView(i);
            let prate = this._trnMainService.TrnMainObj.ProdList[i].SELECTEDBATCH == null ? 0 : this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].SELECTEDBATCH.COSTPRICE);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, "", 0, prate);
            let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
            this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
           
           
            this._trnMainService.TrnMainObj.ProdList[i].REALRATE =
            this._trnMainService.TrnMainObj.ProdList[i].ALTRATE =
            this._trnMainService.TrnMainObj.ProdList[i].SPRICE =
            this._trnMainService.TrnMainObj.ProdList[i].RATE = this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.RATE_A;
    
          if (this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.InclusiveOfTax == 1) {
    
            this._trnMainService.TrnMainObj.ProdList[i].ORIGINALTRANRATE = this._trnMainService.getCategoryWisePricelevelGstIncluded(this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.IN_RATE_A,
              this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.IN_RATE_B,this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.IN_RATE_C);
    
          }
          else {
            this._trnMainService.TrnMainObj.ProdList[i].ORIGINALTRANRATE = this._trnMainService.getCategoryWisePricelevelGstIncluded(
              this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.RATE_A,
              this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.RATE_B,this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.RATE_C);;
          }
          let confactor=this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);

          if(confactor==0){confactor=1;}
          this._trnMainService.TrnMainObj.ProdList[i].ALT_ORIGINALTRANRATE = 
          this._trnMainService.TrnMainObj.ProdList[i].ORIGINALTRANRATE *confactor;
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;
            this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
          }

          let ZeroStockedProduct = this._trnMainService.TrnMainObj.ProdList.filter(
            x => x.SELECTEDITEM.STOCK <= 0
          );
          this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(
            x => x.SELECTEDITEM.STOCK > 0
          );

          this._trnMainService.ReCalculateBillWithNormal();
          if (ZeroStockedProduct != null && ZeroStockedProduct.length > 0) {
            this.alertService.error(
              "Some Of the item have been excluded because of unavailable Stock"
            );
          }
        }
        else {
          this.loadingSerive.hide();
          this.alertService.error(result.result);
        }
      },
      error => {
        this.loadingSerive.hide();
        this.alertService.error(error);
      }
    );
  }

  onHoPerformaInvoiceClicked(performaInvoice) {
    this.getSelectedPerofrmaVoucher(performaInvoice.REFNO, performaInvoice.FROMCOMPANY);
  }

  getSelectedPerofrmaVoucher(voucherNO, fromCompany = null) {
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.loadHoPerformaInvoice(voucherNO, fromCompany).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          
          this._trnMainService.TrnMainObj = JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
            let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
            this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;

            this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
           // this._trnMainService.CalculateNormalNew(i);

          }

          this._trnMainService.TrnMainObj.VoucherType = 113;
          this._trnMainService.TrnMainObj.VoucherPrefix = "DC";
          this._trnMainService.TrnMainObj.Mode = "VIEW"
         // this._trnMainService.ReCalculateBill();
         this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.showPerformaApproveReject = true;
        }
        else
        {
          this.alertService.error(result.result);
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }

  onItemDoubleClick(event) {
    this._trnMainService.TrnMainObj.REFORDBILL = event.VCHRNO;
    this._trnMainService.loadSODataToSales(event.VCHRNO);
  }
}
