//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../../common/services/permission";
import { UserWiseTransactionFormConfigurationComponent } from "../../../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.component";
import { PREFIX } from "../../../../common/interfaces/Prefix.interface";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "addmr",
  templateUrl: "./addmr.html",
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
export class MRComponent {
  @ViewChild("genericHOSalesInvoiceGridTI")
  genericHOSalesInvoiceGridTI: GenericPopUpComponent;

  @ViewChild("genericsGridSAPPI")
  genericsGridSAPPI: GenericPopUpComponent;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

  gridHoSalesInvoicePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridSAPPIPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridPerformaInvoice") genericGridPerformaInvoice: GenericPopUpComponent;
  @ViewChild("genericRcvdDeliveryChalaaanGridSO") genericRcvdDeliveryChalaaanGridSO: GenericPopUpComponent;
  gridPopupSettingsForHOPerformaRequest: GenericPopUpSettings = new GenericPopUpSettings();
  gridRcvdDeliveryChallaanPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;

  @ViewChild("genericGridPO") genericGridPO: GenericPopUpComponent;
  gridPopupSettingsForPurchaseOrder: GenericPopUpSettings = new GenericPopUpSettings();
  invoiceType: string;
  purchaseWarehouse: string;
  @ViewChild("userwisetransactionformconfig") userwisetransactionformconfig: UserWiseTransactionFormConfigurationComponent;

  prefix: PREFIX = <PREFIX>{};
  argument: any;
  printInvoice: any;
  dataArriveSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  dataArrive$: Observable<boolean> = this.dataArriveSubject.asObservable();
  constructor(
    public masterService: MasterRepo,
    private _trnMainService: TransactionService,
    public dialog: MdDialog,
    private alertService: AlertService,
    private loadingSerive: SpinnerService,
    public route: ActivatedRoute,
    private _authService: AuthService
  ) {
    this._trnMainService.initialFormLoad(110);
    var userProfile = _authService.getUserProfile();
    this.purchaseWarehouse = userProfile.PurchaseWarehouse;
    //alert(this.purchaseWarehouse);
    masterService.Currencies = [];
    masterService.getCurrencies();
    this.masterService.ShowMore == true;
    this.route.queryParams
      .subscribe(params => {
        if (params.from == "Ledger") {
          if (params.voucherNumber) {
            let VCHR = params.voucherNumber;
            this._trnMainService.loadData(VCHR, this.masterService.userProfile.userDivision, params.phiscalId);
          }
        }
      });
      this.route.queryParams.subscribe(params => {
        if (params.voucher) {
          let voucherNo = params.voucher;
          this.loadRcvdDeliveryChallaan(params.voucher,params.FROMCOMPANY,this.masterService.userProfile.userDivision);
        }
      });  
      this.gridRcvdDeliveryChallaanPopupSettings = Object.assign(new GenericPopUpSettings, {
        title: "Delivery Challaan",
        apiEndpoints: `/getAllHODeliveryChalaanSUPPagedList`,
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
    this.gridHoSalesInvoicePopupSettings = {
      title: "Sales Invoices From Supplier",
      apiEndpoints: `/getAllHOTaxInvoicePagedList`,
      defaultFilterIndex: 0,
      showActionButton: true,
      actionKeys: [{
        icon: "fa fa-trash",
        text: "DELETE",
        title: "Click to hide invoice."
      }],
      columns: [
        {
          key: "VCHRNO",
          title: "Bill No",
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
          key: "FROMCOMPANYID",
          title: "From",
          hidden: false,
          noSearch: false
        },
        {
          key: "NETAMNT",
          title: "Amount",
          hidden: false,
          noSearch: false
        },

      ]
    };

    this.gridSAPPIPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Purchase Invoice From SAP",
      apiEndpoints: `/getAllSAPPurchaseInvoicePagedList`,
      defaultFilterIndex: 0,
      showActionButton: true,
      actionKeys: [{
        icon: "fa fa-trash",
        text: "DELETE",
        title: "Click to delete invoice."
      }],
      columns: [
        {
          key: "VCHRNO",
          title: "VOUCHER NO.",
          hidden: false,
          noSearch: false
        },
        {
          key: "PLANTDESC",
          title: "PLANT",
          hidden: false,
          noSearch: false
        },
        {
          key: "INVDATE",
          title: "INVOICE DATE",
          hidden: false,
          noSearch: false
        },
        {
          key: "companyId",
          title: "",
          hidden: true,
          noSearch: true
        }
      ]
    });

    this.gridPopupSettingsForHOPerformaRequest = Object.assign(new GenericPopUpSettings, {
      title: "Performa Requested Vouchers",
      apiEndpoints: `/getAllHOPerformaInvoicePagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'REFNO',
          title: 'PERFORMA NO.',
          hidden: false,
          noSearch: false
        },

        {
          key: 'FROMCOMPANY',
          title: 'From',
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

    this.gridPopupSettingsForPurchaseOrder = Object.assign(new GenericPopUpSettings, {
      title: "Purchase Orders",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      showActionButton: false,
      actionKeys: [{
        icon: "fa fa-trash",
        text: "delete",
        title: "Click to hide Order."
      }],
      columns: [
        {
          key: "VCHRNO",
          title: "PO No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNDATE",
          title: "DATE",
          hidden: false,
          noSearch: false
        },
        {
          key: "NETAMNT",
          title: "NETAMNT",
          hidden: false,
          noSearch: false
        }
      ]
    });
    this.route.queryParams
      .subscribe(params => {
        if (params.for == "PP") {
          if (params.voucher) {
            let voucherNo = params.voucher;
            let fromCompany = params.fromCompany
            this.getSelectedPerofrmaVoucher(voucherNo, fromCompany);
          }
        }
      });

  }

  ngOnInit() {
    this.masterService.refreshTransactionList();

    this._trnMainService.TrnMainObj.TRNMODE = "credit";
    this.masterService.getPurchaseAcList().subscribe(
      res => {
        this._trnMainService.PurchaseAcList.push(<TAcList>res);
      },
      error => {
        this.masterService.resolveError(
          error,
          "trnmain-purchase-getPurchaseList"
        );
      },
      () => {
        if (this._trnMainService.AppSettings.MultiplePurchaseAccount == 0) {
          this._trnMainService.TrnMainObj.RETTO = this._trnMainService.AppSettings.PurchaseAc;
        }
        // console.log("trnmainpurchaseac",this.TrnMainObj.RETTO,this.AppSettings.PurchaseAc);
      }
    );

    this.masterService.getCashList().subscribe(
      res => {
        this._trnMainService.CashList = res;
      },
      error => {
        this.masterService.resolveError(error, "trnmain-purchase-getCashList");
      }
    );

    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Purchase Invoice",
        sampleFileUrl: `/downloadSample/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        uploadEndpoints: `/importFileForTransaction/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        allowMultiple: false,
        acceptFormat: ".csv",
        filename: "MR_SampleFile"
        // note: this.note
      });
  }
 
  showPurchaseInvoicePopup() {
    if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
      this.alertService.warning("Please select the supplier...");
      return;
    }
    this.fileUploadPopup.show();
  }

  fileUploadSuccess(uploadResult) {

    if (uploadResult.status == 'ok') {
      this._trnMainService.TrnMainObj.ProdList = uploadResult.result;
      if (this.purchaseWarehouse != null) {
        this._trnMainService.TrnMainObj.MWAREHOUSE = this.purchaseWarehouse;
      }

      for (let i in this._trnMainService.TrnMainObj.ProdList) {

        this._trnMainService.setAltunitDropDownForView(i);
        let excelpurchaseprice = this._trnMainService.TrnMainObj.ProdList[i].REALRATE;
        this._trnMainService.assignPrices_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
        this._trnMainService.TrnMainObj.ProdList[i].PRATE =
          this._trnMainService.TrnMainObj.ProdList[i].REALRATE =
          this._trnMainService.TrnMainObj.ProdList[i].ALTRATE =
          this._trnMainService.TrnMainObj.ProdList[i].RATE = excelpurchaseprice;
        this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].OtherDiscount = this._trnMainService.TrnMainObj.ProdList[i].INDODAMT;
        if (this.purchaseWarehouse != null) {
          this._trnMainService.TrnMainObj.ProdList[i].WAREHOUSE = this.purchaseWarehouse;
        }


      }


      this._trnMainService.ReCalculateBillWithNormal();
      this.loadingSerive.hide();

    } else {
      this.loadingSerive.hide();
      this.alertService.error(uploadResult.result._body);

    }

  }


  showSupplierSalesInvoiceFromHOPopup() {
    this.genericHOSalesInvoiceGridTI.show();
  }

  onHoSalesInvoiceSelect(item) {
    this.getSalesInvoiceFromSupplier(item.VCHRNO, item.FROMCOMPANYID);
  }

  getSalesInvoiceFromSupplier(voucherNo: string, FROMCOMPANYID: string) {
    this.loadingSerive.show("Getting Data. Please Wait...");
    this.masterService.loadSalesInvoiceFromSupplierHO(voucherNo, FROMCOMPANYID).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );

          if (
            !this._trnMainService.TrnMainObj ||
            !this._trnMainService.TrnMainObj.ProdList ||
            this._trnMainService.TrnMainObj.ProdList == undefined
          )
            return;
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
            this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
          }
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.TrnMainObj.VoucherType = 110;
          this._trnMainService.TrnMainObj.VoucherPrefix = "MR";
          this._trnMainService.TrnMainObj.VoucherAbbName = "MR";
          this._trnMainService.TrnMainObj.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
          this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "MR";
          this._trnMainService.TrnMainObj.REFORDBILL = this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILL;
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.REFBILL = voucherNo;
          this._trnMainService.TrnMainObj.VCHRNO = "";
          this._trnMainService.TrnMainObj.CHALANNO = "";
          this._trnMainService.TrnMainObj.tag = "fromsidomain";
          this._trnMainService.TrnMainObj.JOBNO = FROMCOMPANYID;
          if (this._trnMainService.TrnMainObj.MWAREHOUSE != null) {
            this._trnMainService.TrnMainObj.MWAREHOUSE = this.purchaseWarehouse;
          }


          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.setAltunitDropDownForView(i);
            let editPrice = this._trnMainService.TrnMainObj.ProdList[i].REALRATE;
            // this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);

            this._trnMainService.TrnMainObj.ProdList[i].PRATE =
              this._trnMainService.TrnMainObj.ProdList[i].REALRATE =
              this._trnMainService.TrnMainObj.ProdList[i].ALTRATE =
              this._trnMainService.TrnMainObj.ProdList[i].RATE = editPrice;
            if (this._trnMainService.TrnMainObj.MWAREHOUSE != null) {
              this._trnMainService.TrnMainObj.ProdList[i].WAREHOUSE = this.purchaseWarehouse;
            }

            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].SPRICE, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            // this._trnMainService.CalculateNormalNew(i);

            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));

          }
          // this._trnMainService.ReCalculateBill();
          this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          let invoiceDate = result.result.TRN_DATE;
          this._trnMainService.TrnMainObj.TRN_DATE = invoiceDate == null ? this._trnMainService.TrnMainObj.TRNDATE : invoiceDate.toString().substring(0, 10);

        }
        else {
          this.alertService.error(result.result._body);
        }
      },
      error => {
        this.loadingSerive.hide();
        this.alertService.error(error);
      }
    );
  }

  showSAPPurchaseInvoice() {
    this.genericsGridSAPPI.show();
  }

  onSAPPurchaseInvoiceSelect(item) {
    this.loadSAPPurchaseInvoice(item.VCHRNO);
  }

  loadSAPPurchaseInvoice(voucherNo: string) {
    this.loadingSerive.show("Getting Data. Please Wait...");
    this.masterService.loadSAPPurchaseInvoiceDetail(voucherNo).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          if (
            !this._trnMainService.TrnMainObj ||
            !this._trnMainService.TrnMainObj.ProdList ||
            this._trnMainService.TrnMainObj.ProdList == undefined
          )
            return;
            const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.TrnMainObj.VoucherType = 110;
          this._trnMainService.TrnMainObj.VoucherPrefix = "MR";
          this._trnMainService.TrnMainObj.VoucherAbbName = "MR";
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.REFBILL = voucherNo;
          this._trnMainService.TrnMainObj.VCHRNO = "";
          this._trnMainService.TrnMainObj.CHALANNO = "";
          this._trnMainService.TrnMainObj.tag = "FTP";
          if (this._trnMainService.TrnMainObj.MWAREHOUSE != null) {
            this._trnMainService.TrnMainObj.MWAREHOUSE = this.purchaseWarehouse;
          }
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, "", 0, this._trnMainService.TrnMainObj.ProdList[i].RATE);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].SPRICE, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            if (this._trnMainService.TrnMainObj.MWAREHOUSE != null) {
              this._trnMainService.TrnMainObj.ProdList[i].WAREHOUSE = this.purchaseWarehouse;
            }
          }


          this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          let invoiceDate = result.result.TRN_DATE;
          this._trnMainService.TrnMainObj.TRN_DATE = invoiceDate == null ? this._trnMainService.TrnMainObj.TRNDATE : invoiceDate.toString().substring(0, 10);

        }
        else {
          this.loadingSerive.hide();
          this.alertService.error(result.result._body);
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }



  saveTaxInvoice() {
    this._trnMainService.TrnMainObj.Mode = 'NEW';
    this._trnMainService.TrnMainObj.tag = "shipto";
    this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj)
      .subscribe((data) => {
        if (data.status == "ok") {
          this.alertService.hide();
          this.popupClose()
        }
        else {
          console.log("errors on shipto", data.result);
          this.alertService.error(data.result._body);
        }
      }, error => {
        console.log("error on shipto", error);

        this.alertService.error(error)
      })
  }


  popupClose() {
    this._trnMainService.initialFormLoad(110)
  }



  showLoadFromPerformaInvoiceRequestPopup($event) {
    this.genericGridPerformaInvoice.show();
  }

  showLoadFromSOPopup($event) {
    this.genericGridSO.show();
  }
  showRcvdDeliveryChallaanPopup($event) {
 
    this.genericRcvdDeliveryChalaaanGridSO.show();
  }
  onDeliveryChallaanSelect(performaInvoice) {
    this.getSelectedRcvdDeliveryChallaan(performaInvoice.VCHRNO,performaInvoice.DIVISION,performaInvoice.PhiscalID);
  }
  getSelectedRcvdDeliveryChallaan(VCHR, division, phiscalid) {
  
    this.loadingSerive.show("Getting data, Please wait...");
     this.masterService.loadHoDeliveryChallaan(VCHR, division, phiscalid).subscribe(
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
  loadDeliveryChallaanSelect(performaInvoice) {
    this.loadRcvdDeliveryChallaan(performaInvoice.voucherNo,performaInvoice.FROMCOMPANYID,performaInvoice.division);
  }
  loadRcvdDeliveryChallaan(voucherNo: string, FROMCOMPANYID: string,division:string) {
  
    this.loadingSerive.show("Getting data, Please wait...");
     this.masterService.SelectedDeliveryChallaan(voucherNo, FROMCOMPANYID,division).subscribe(
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
          if (this.purchaseWarehouse != null) {
            this._trnMainService.TrnMainObj.MWAREHOUSE = this.purchaseWarehouse;
          }
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.Mode = "VIEW"
            this._trnMainService.TrnMainObj.VoucherType = 110;
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
            let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
            this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
            if (this.purchaseWarehouse != null) {
              this._trnMainService.TrnMainObj.ProdList[i].WAREHOUSE = this.purchaseWarehouse;
            }
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].RATE;

            this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            // this._trnMainService.CalculateNormalNew(i);

          }
          // this._trnMainService.ReCalculateBill();
          this._trnMainService.ReCalculateBillWithNormal();
        }
      },
      error => {
        this.loadingSerive.hide();
      }
    );
  }


  DeleteSapInvoice(invoiceDetail: any) {
    this.loadingSerive.show(`Deleting Invoice ${invoiceDetail.VCHRNO}.Please Wait.`)
    this.masterService.masterPostmethod("/deleteSapInvoice", invoiceDetail).subscribe((res) => {
      if (res.status == "ok") {
        this.genericsGridSAPPI.refresh();
        this.loadingSerive.hide();

      } else {
        this.loadingSerive.hide();
        this.alertService.error(res.result)
      }
    }, error => {
      this.loadingSerive.hide();
      this.alertService.error(error);
    })
  }
  DeleteEDISalesInvoice(invoiceDetail: any) {
    this.loadingSerive.show(`Deleting Invoice ${invoiceDetail.VCHRNO}.Please Wait.`)
    this.masterService.masterPostmethod("/deleteediInvoice", invoiceDetail).subscribe((res) => {
      if (res.status == "ok") {
        this.genericHOSalesInvoiceGridTI.refresh();
        this.loadingSerive.hide();

      } else {
        this.loadingSerive.hide();
        this.alertService.error(res.result)
      }
    }, error => {
      this.loadingSerive.hide();
      this.alertService.error(error);
    })
  }





  onCancelClicked() {
    this.loadingSerive.show(`Please wait while cancelling purchase invoice ${this._trnMainService.TrnMainObj.VCHRNO}`);
    this.masterService.cancelPurchaseInvoice("CANCELPURCHASEINVOICE", this._trnMainService.TrnMainObj).subscribe((res) => {
      if (res.status == "ok") {
        this.loadingSerive.hide();
        this._trnMainService.initialFormLoad(3);
      } else {
        this.loadingSerive.hide();
        this.alertService.error(res.result._body);

      }
    }, error => {
      this.alertService.error(error.Message);
      this.loadingSerive.hide();
    })
  }

  showLoadFromPOPopup($event) {
    this.genericGridPO.show("", false, "editForPurchaseOrderMR");
  }

  onHoPurchaseOrderClicked(purchaseOrder) {
    this.getSelectedPurchaseOrder(purchaseOrder);
  }
  getSelectedPurchaseOrder(purchaseOrder) {
    let mode = "LoadingPOinPI";
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.LoadTransaction(purchaseOrder.VCHRNO, purchaseOrder.DIVISION, purchaseOrder.PhiscalID,mode).subscribe(
      result => {
        
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.REFBILL = purchaseOrder.VCHRNO;
          this._trnMainService.TrnMainObj.VoucherType = 110;
          this._trnMainService.TrnMainObj.VoucherPrefix = "MR";
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.tag = "frompo";
          this._trnMainService.TrnMainObj.POST = 0;
          if(this._trnMainService.TrnMainObj.VoucherType == 110 && this._trnMainService.TrnMainObj.VoucherPrefix == "MR"){
            this._trnMainService.TrnMainObj.REFORDBILL=purchaseOrder.VCHRNO;
            this._trnMainService.TrnMainObj.TRN_DATE = purchaseOrder.TRNDATE;
          }
          if (this._trnMainService.TrnMainObj.AdditionalObj != null) {
            this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILL = purchaseOrder.VCHRNO;
            this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_PI";
           //  this._trnMainService.TrnMainObj.Mode="EDIT"
          }
          if (this._trnMainService.TrnMainObj.TRNAC != null && this._trnMainService.TrnMainObj.TRNAC != "") {
            this._trnMainService.TrnMainObj.PARAC = this._trnMainService.TrnMainObj.TRNAC;
          }
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
            let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
            this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2;

            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);

          }

          this._trnMainService.ReCalculateBillWithNormal();

        }
        else {

          this.loadingSerive.hide();
          this.alertService.error(result.result._body);
        }
      },
      error => {

        this.loadingSerive.hide();
        console.log('error',error);
        this.alertService.error(error);
      }
    );
  }


  
  onTransactionConfigureClick() {
    this.userwisetransactionformconfig.show(VoucherTypeEnum.Purchase)
  }

  
  updateGridConfig(gridsetting){
    this._trnMainService.userwiseTransactionFormConf =gridsetting;
  }
}





