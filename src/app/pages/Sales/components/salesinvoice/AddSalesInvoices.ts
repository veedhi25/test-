import { Component, ViewChild, OnInit, AfterViewInit, HostListener } from "@angular/core";
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { TrnProd, VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { AppSettings } from "../../../../common/services";
import { ProductInsertComponent } from "../../../../common/Transaction Components/ProductInsert";
import { SalesHistoryComponent } from "../../../../common/Transaction Components/sales-history.component";
import { UserWiseTransactionFormConfigurationComponent } from "../../../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.component";
import { UserWiseTransactionFormConfigurationService } from "../../../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.service";
import { ignoreElements } from "rxjs/operator/ignoreElements";

@Component({
  selector: "addsales-invoice",
  templateUrl: "./AddSalesInvoice.html",
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
    `
  ]
})
export class AddSalesInvoiceComponent implements OnInit {
  public hideShow: boolean = false
  @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;
  @ViewChild("productinsert") productinsert: ProductInsertComponent;

  @ViewChild("genericPerformaInvoiceGridSO") genericPerformaInvoiceGridSO: GenericPopUpComponent;
  @ViewChild("genericDeliveryChalaaanGridSO") genericDeliveryChalaaanGridSO: GenericPopUpComponent;
  @ViewChild("genericCancelSales") genericCancelSales: GenericPopUpComponent
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridPerformaInvoicePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridDeliveryChallaanPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridcancelSalesPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("saleshistory") saleshistory: SalesHistoryComponent;
  @ViewChild("userwisetransactionformconfig") userwisetransactionformconfig: UserWiseTransactionFormConfigurationComponent;

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private loadingSerive: SpinnerService,
    public appSetting: AppSettings) {
    this._trnMainService.formName = "Sales Invoice";

    this._trnMainService.initialFormLoad(14);
   
    this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Sales Vouchers",
      apiEndpoints: `/VoucherListTranWise/SOINSALESINVOICE`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "VCHRNO",
          title: "Voucher No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "trndate",
          title: "Date",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACNAME",
          title: "Customer",
          hidden: false,
          noSearch: false
        },
        {
          key: "BEAT",
          title: "Beat",
          hidden: false,
          noSearch: false
        },
        {
          key: "DSMNAME",
          title: "DSM",
          hidden: false,
          noSearch: false
        },
        {
          key: "tag",
          title: "Type",
          hidden: false,
          noSearch: false
        }
      ]
    });


    this.gridPerformaInvoicePopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Approved Performa Vouchers",
      apiEndpoints: `/getApprovedHOPerformaInvoicePagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "VCHRNO",
          title: "Voucher No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNDATE",
          title: "Date",
          hidden: false,
          noSearch: false
        },
        {
          key: "BILLTO",
          title: "Customer",
          hidden: false,
          noSearch: false
        },
        {
          key: "NETAMNT",
          title: "Amount",
          hidden: false,
          noSearch: false
        },
        {
          key: "REMARKS",
          title: "Remarks",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNSTATUS",
          title: "Status",
          hidden: false,
          noSearch: false
        }
      ]
    });
    this.gridDeliveryChallaanPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Delivery Challaan",
      apiEndpoints: `/getApprovedDeliveryChallaanPagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "VCHRNO",
          title: "Voucher No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNDATE",
          title: "Date",
          hidden: false,
          noSearch: false
        },
        {
          key: "BILLTO",
          title: "Customer",
          hidden: false,
          noSearch: false
        },
        {
          key: "NETAMNT",
          title: "Amount",
          hidden: false,
          noSearch: false
        },
        {
          key: "REMARKS",
          title: "Remarks",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNSTATUS",
          title: "Status",
          hidden: false,
          noSearch: false
        }
      ]
    });


    this.gridcancelSalesPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Sales Invoice ",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'BILLTO',
          title: 'CUSTOMER',
          hidden: false,
          noSearch: false
        },
        {
          key: 'VCHRNO',
          title: 'BILL NO',
          hidden: this.appSetting.enableMultiSeriesInSales == 1 ? true : false,
          noSearch: this.appSetting.enableMultiSeriesInSales == 1 ? true : false
        },
        {
          key: 'CHALANNO',
          title: 'BILL NO',
          hidden: this.appSetting.enableMultiSeriesInSales == 1 ? false : true,
          noSearch: this.appSetting.enableMultiSeriesInSales == 1 ? false : true
        },
        {
          key: 'TRNDATE',
          title: 'DATE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TRNMODE',
          title: 'TYPE',
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
    //     this.getSelectedPerformaInvoice(voucherNo);
    //   }
    //   if (params.from == "Ledger") {
    //     if (params.voucherNumber) {
    //       let VCHR = params.voucherNumber;
    //       this._trnMainService.loadData(VCHR, this.masterService.userProfile.userDivision, params.phiscalId);
    //     }
    //   } else if (params.from == "INVENTORY") {
    //     let VCHR = params.voucherNumber;
    //     this._trnMainService.loadData(VCHR, this.masterService.userProfile.userDivision, params.phiscalId);
    //   }
    // });
    this.route.queryParams.subscribe(params => {
      if (params.voucher) {
        
        let voucherNo = params.voucher;
        // if(voucherNo.substring(1,3)=='MR'){
          this.loadRcvdMR(params.voucher,params.FROMCOMPANY);
        // }
        // else{
        //   return;
        // }
        
      }
    });  
  }

  ngOnInit() {
    //console.log('addsale voucher type'+this._trnMainService.TrnMainObj.VoucherType);
  }



  showLoadFromSOPopup($event) {
    this.genericGridSO.show();
  }

  showApprovedPreformaInvoicePopup($event) {
    this.genericPerformaInvoiceGridSO.show();
  }
  showApprovedDeliveryChallaanPopup($event) {
    this.genericDeliveryChalaaanGridSO.show();
  }


  showSalesDayWise($event) {
    this.genericCancelSales.show(this._trnMainService.TrnMainObj.PARAC, false, "tivoucherlistforSalescancel")
  }

  onPerformaInvoiceSelect(performaInvoice) {
    this.getSelectedPerformaInvoice(performaInvoice.VCHRNO);
  }
  onDeliveryChallaanSelect(performaInvoice) {
    this.getSelectedDeliveryChallaan(performaInvoice.VCHRNO,performaInvoice.DIVISION,performaInvoice.PhiscalID);
  }
  // loadRcvdDeliveryChallaan(voucherNo: string, FROMCOMPANYID: string) {
  
  //   this.loadingSerive.show("Getting data, Please wait...");
  //    this.masterService.SelectedMR(voucherNo, FROMCOMPANYID).subscribe(
  //     result => {
  //       this.loadingSerive.hide();
  //       if (result.status == "ok") {
  //         this._trnMainService.TrnMainObj = result.result;//JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
  //         this._trnMainService.TrnMainObj.Mode = "NEW";
                   
            
  //         this._trnMainService.TrnMainObj.VoucherType = VoucherTypeEnum.MaterialReceipt; 
  //         this._trnMainService.TrnMainObj.VoucherPrefix = "MR";
  //         this._trnMainService.TrnMainObj.VoucherType = 110;

  //         this._trnMainService.TrnMainObj.tag = "fromDdeliveryChallan";
  //         this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
          
          
  //         this._trnMainService.TrnMainObj.TransporterEway = <any>{};
  //         if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
  //         else { this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_TI"; }
  //         this._trnMainService.TrnMainObj.AdditionalObj.tag = "fromDdeliveryChallan";
  //         for (let i in this._trnMainService.TrnMainObj.ProdList) {
            
  //           this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantityMR = this._trnMainService.TrnMainObj.ProdList[i].Quantity;
         
  //            this._trnMainService.TrnMainObj.ProdList[i].AltQty=0;        
  //           this._trnMainService.TrnMainObj.ProdList[i].RealQty=0;

           
  //           this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, this._trnMainService.TrnMainObj.PARTY_ORG_TYPE, 0, this._trnMainService.TrnMainObj.ProdList[i].PRATE);
  //           this._trnMainService.setAltunitDropDownForView(i);
  //           this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
           
  //           this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
           
  //         }

          
  //         const uuidV1 = require('uuid/v1');
  //         this._trnMainService.TrnMainObj.guid = uuidV1();
  //         this._trnMainService.getVoucherNumber();
  //         this._trnMainService.getCurrentDate();
  //         this._trnMainService.ReCalculateBillWithNormal();
  //         this.setSchemDiscountReadonly();
  //       }
  //       else {
  //         this.alertService.error(result.result._body);
  //       }
  //     },
  //     error => {
  //       this.loadingSerive.hide();
  //     }
  //   );
  // }
  loadRcvdMR(voucherNo: string, FROMCOMPANYID: string) {
  
    this.loadingSerive.show("Getting data, Please wait...");
     this.masterService.SelectedMR(voucherNo, FROMCOMPANYID).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result;//JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.Mode = "NEW";
                   
            
          this._trnMainService.TrnMainObj.VoucherType = VoucherTypeEnum.TaxInvoice; 
          this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
          this._trnMainService.TrnMainObj.VoucherType = 14;

          this._trnMainService.TrnMainObj.tag = "FROMMR";
          this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
          
          
          this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
          else { this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_TI"; }
          this._trnMainService.TrnMainObj.AdditionalObj.tag = "FROMMR";
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            
            
            this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantityMR = this._trnMainService.TrnMainObj.ProdList[i].Quantity;
         
            //  this._trnMainService.TrnMainObj.ProdList[i].AltQty=0;        
            // this._trnMainService.TrnMainObj.ProdList[i].RealQty=0;

           
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

  oncancelSalesSelect(salesCancel) {
  }
  getSelectedPerformaInvoice(voucherNo) {
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.loadHoPerformaInvoice(voucherNo, null, true).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.tag = "fromProforma";
          this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;

          this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
          else { this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_TI"; }
          this._trnMainService.TrnMainObj.AdditionalObj.tag = "fromProforma";
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, this._trnMainService.TrnMainObj.PARTY_ORG_TYPE, 0, this._trnMainService.TrnMainObj.ProdList[i].PRATE);
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          }

          this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
          this._trnMainService.TrnMainObj.VoucherType = 14;
          this._trnMainService.pageHeading = "Tax Invoice";
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
  getSelectedDeliveryChallaan(VCHR, division, phiscalid) {
    
    this.loadingSerive.show("Getting data, Please wait...");
     this.masterService.loadHoDeliveryChallaan(VCHR, division, phiscalid).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          console.log(result.result,"FROMDCBUTTON");
          this._trnMainService.TrnMainObj = result.result;//JSON.parse(result.result); //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.tag = "fromDC";
          this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;

          this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
          else { this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_TI"; }
          this._trnMainService.TrnMainObj.AdditionalObj.tag = "fromDC";
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, this._trnMainService.TrnMainObj.PARTY_ORG_TYPE, 0, this._trnMainService.TrnMainObj.ProdList[i].PRATE);
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          }

          this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
          this._trnMainService.TrnMainObj.VoucherType = 14;
          this._trnMainService.pageHeading = "Tax Invoice";
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
  onSalesOrderSelect(item) {
    this.loadingSerive.show("Please wait. Converting Sales order to sales Invoice.");
    this.masterService.loadSalesInvoiceFromSalesOrder(item.VCHRNO).subscribe(
      result => {
        if (result.status == "ok") {



          if (result.message != null && result.message != "" && result.message != " ") {
            this.alertService.warning(result.message);
          }
          this._trnMainService.TrnMainObj = JSON.parse(result.result);

          this.masterService.masterGetmethod("/getPartyBalanceAmount?acid=" + this._trnMainService.TrnMainObj.TRNAC)
            .subscribe(
              res => {
                if (res.status == "ok") {
                  this._trnMainService.TrnMainObj.BALANCE = this._trnMainService.nullToZeroConverter(res.result);

                } else {
                  console.log(res.result);
                }
              },
              error => {
                console.log(error);
              }
            );

          if (this._trnMainService.AppSettings.ENABLEBILLLOCKING && this._trnMainService.userProfile.username.toLowerCase() != "superadmin") {
            this.masterService.masterGetmethod_NEW("/getBillingStatus?acid=" + this._trnMainService.TrnMainObj.TRNAC).subscribe((res) => {
              if (res.status == "ok" && res.result && res.result.length) {
                this._trnMainService.TrnMainObj.BILLINGSTATUS = res.result[0].STATUS;
                // if (this._trnMainService.TrnMainObj.BILLINGSTATUS == "FALSE") {
                //   this.alertservice.error("BILLING HAS BEEN LOCKED FOR THIS CUSTOMER DUE TO DUE PAYMENTS.");
                //   return;
                // }
              } else {
                this._trnMainService.TrnMainObj.BILLINGSTATUS = "TRUE";
              }
            }, error => {
              this._trnMainService.TrnMainObj.BILLINGSTATUS = "TRUE";
            })
          }
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
            this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
          }
          else {
            this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_TI";
            this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE = this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE;
            this._trnMainService.TrnMainObj.AdditionalObj.DSMNAME = this._trnMainService.TrnMainObj.AdditionalObj.DSMNAME;
            this._trnMainService.TrnMainObj.AdditionalObj.BEAT = this._trnMainService.TrnMainObj.AdditionalObj.BEAT;
          }
          this._trnMainService.TrnMainObj.AdditionalObj.tag = item.tag == 'PURCHASEORDER_MOBILE' ? "MOBILE_ORDER_TI" : "MANUAL_SO";
          this._trnMainService.TrnMainObj.Mode = "NEW";
          if (this._trnMainService.TrnMainObj.ProdList == undefined ||
            this._trnMainService.TrnMainObj.ProdList.length == 0) {
            this._trnMainService.TrnMainObj.ProdList = [];
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
          this._trnMainService.TrnMainObj.VoucherType = 14;
          if (this.appSetting.enableMultiSeriesInSales == 1) {

          } else {
            this._trnMainService.TrnMainObj.VoucherPrefix = "TI";
          }
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
                this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.IN_RATE_B, this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.IN_RATE_C);

            }
            else {
              this._trnMainService.TrnMainObj.ProdList[i].ORIGINALTRANRATE = this._trnMainService.getCategoryWisePricelevelGstIncluded(
                this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.RATE_A,
                this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.RATE_B, this._trnMainService.TrnMainObj.ProdList[i].SELECTEDITEM.RATE_C);;
            }
            let confactor = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);

            if (confactor == 0) { confactor = 1; }
            this._trnMainService.TrnMainObj.ProdList[i].ALT_ORIGINALTRANRATE =
              this._trnMainService.TrnMainObj.ProdList[i].ORIGINALTRANRATE * confactor;
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;
            this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.getSchemeAndRecalcualte(Number(i));

          }
          this.loadingSerive.hide();

          let ZeroStockedProduct = this._trnMainService.TrnMainObj.ProdList.filter(
            x => x.SELECTEDITEM.STOCK <= 0
          );
          if (this.appSetting.enableZeroStockItemLoadInSoToSI == 1) { } else {
            this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(
              x => x.SELECTEDITEM.STOCK > 0
            );
          }





          this._trnMainService.ReCalculateBillWithNormal();
          if (this.appSetting.enableZeroStockItemLoadInSoToSI == 1) { } else {
            if (ZeroStockedProduct != null && ZeroStockedProduct.length > 0) {
              this.alertService.error(
                "Some Of the item have been excluded because of unavailable Stock"
              );
            }
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

  onItemDoubleClick(event) {
    this._trnMainService.TrnMainObj.REFORDBILL = event.VCHRNO;
    this._trnMainService.loadSODataToSales(event.VCHRNO);
  }




  onSalesCancelSelect(selectedItem) {
    this.loadTaxInvoiceForCancel(selectedItem.VCHRNO, selectedItem.DIVISION, selectedItem.PhiscalID)
  }




  loadTaxInvoiceForCancel(VCHR, division, phiscalid) {
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.LoadTransaction(VCHR, division, phiscalid).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result;
          this._trnMainService.TrnMainObj.REFBILL = VCHR;
          this._trnMainService.TrnMainObj.VoucherType = 61;
          this._trnMainService.TrnMainObj.VoucherAbbName = "RE"
          this._trnMainService.pageHeading = "Tax Invoice [Cancel]";
          this._trnMainService.TrnMainObj.VoucherPrefix = "RE";
          this._trnMainService.TrnMainObj.Mode = "VIEW";
          // this._trnMainService.ReCalculateBill();
          // this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            //  this._trnMainService.CalculateNormalNew(i);
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));

          }
          //  this._trnMainService.ReCalculateBill();
          this._trnMainService.ReCalculateBillWithNormal();
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }


  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {


    if (($event.altKey || $event.metaKey)) {
      $event.preventDefault();
    }
    if (($event.altKey || $event.metaKey) && $event.key.toUpperCase() == "Z") {
      $event.preventDefault();
      if (this.saleshistory && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        this.saleshistory.OnMiniMizeClick();
        return;
      }
    }
  }


  onTransactionConfigureClick() {
    this.userwisetransactionformconfig.show(VoucherTypeEnum.TaxInvoice)
  }

  updateGridConfig(gridsetting){
    this._trnMainService.userwiseTransactionFormConf =gridsetting;
  }

}
