//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { Component, ViewChild } from "@angular/core";
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";

import * as moment from 'moment'
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { ActivatedRoute } from "@angular/router";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { ITEMTYPE, TrnMain_AdditionalInfo, VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { UserWiseTransactionFormConfigurationComponent } from "../../../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.component";

@Component({
  selector: "addpurchaseinvoice",
  templateUrl: "./addpurchaseinvoice.html",
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
export class AddPurchaseInvoiceComponent {
  @ViewChild("genericHOSalesInvoiceGridTI") genericHOSalesInvoiceGridTI: GenericPopUpComponent;



  @ViewChild("genericsGridSAPPI") genericsGridSAPPI: GenericPopUpComponent;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  @ViewChild('fileMatrixUploadPopup') fileMatrixUploadPopup: FileUploaderPopupComponent;
  @ViewChild("fileUploadPopupAICOD") fileUploadPopupAICOD: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
  fileMatrixUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
  fileUploadPopupAICODSetting: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

  gridHoSalesInvoicePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridSAPPIPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridPerformaInvoice") genericGridPerformaInvoice: GenericPopUpComponent;
  gridPopupSettingsForHOPerformaRequest: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;
  @ViewChild("genericGridPO") genericGridPO: GenericPopUpComponent;
  gridPopupSettingsForPurchaseOrder: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("showMRListGrid") showMRListGrid: GenericPopUpComponent;
  showMRListGridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  invoiceType: string;
  configCodeParams: any = [];
  itemVariantDetails: any = [];
  prefix: PREFIX = <PREFIX>{};
  argument: any;
  printInvoice: any;
  dataArriveSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  dataArrive$: Observable<boolean> = this.dataArriveSubject.asObservable();


  @ViewChild("userwisetransactionformconfig") userwisetransactionformconfig: UserWiseTransactionFormConfigurationComponent;


  constructor(
    public masterService: MasterRepo,
    private _trnMainService: TransactionService,
    public dialog: MdDialog,
    private alertService: AlertService,
    private loadingSerive: SpinnerService,
    public route: ActivatedRoute
  ) {
    this._trnMainService.formName = "Purchase Invoice";
    this._trnMainService.initialFormLoad(3);
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
    this.showMRListGridPopupSettings = {
      title: "Sales Invoices From Supplier",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      showActionButton: false,
      actionKeys: [],
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
          key: "BILLTO",
          title: "Supplier",
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
          key: "TRNSTATUS",
          title: "Status",
          hidden: false,
          noSearch: false
        }


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
    this.getconfigParameter();
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

    this.fileUploadPopupAICODSetting = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import AICOD Purchase Invoice",
        uploadEndpoints: `/importExcelCsvFileForTransaction/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        allowMultiple: false,
        acceptFormat: ".csv",
        filename: "AICODPI_SampleFile"

      });
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Purchase Invoice",
        sampleFileUrl: `/downloadCSV/Supplier Master?tag=${this._trnMainService.TrnMainObj.PARAC}`,
        uploadEndpoints: `/importFileForTransaction/${this._trnMainService.TrnMainObj.VoucherPrefix}?parac=${this._trnMainService.TrnMainObj.PARAC}`,
        allowMultiple: false,
        acceptFormat: ".csv",
        filename: "PI_SampleFile"

      });
    this.fileMatrixUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Purchase Invoice From Matrix Input",
        sampleFileUrl: `/downloadSample/${this._trnMainService.TrnMainObj.VoucherPrefix}matrix`,
        uploadEndpoints: `/pifrominputmatrix/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        allowMultiple: false,
        acceptFormat: ".csv",
        filename: "PI_SampleFile"

      });

  }
  showPurchaseInvoicePopup() {
    // if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
    //   this.alertService.warning("Please select the supplier...");
    //   return;
    // }
    this.fileUploadPopupSettings.sampleFileUrl = `/downloadCSV/PURCHASE INVOICE?tag=${this._trnMainService.TrnMainObj.PARAC}`;
    this.fileUploadPopupSettings.uploadEndpoints = `/v2/importFileForTransaction/${this._trnMainService.TrnMainObj.VoucherPrefix}?parac=${this._trnMainService.TrnMainObj.PARAC}`;
    this.fileUploadPopup.show();
  }
  onImportMatrixinputPurchaseInvoice() {
    if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
      this.alertService.warning("Please select the supplier...");
      return;
    }
    this.fileMatrixUploadPopup.show();
  }
  onAICODPInvoieFileUploadPopupEmit() {
    if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
      this.alertService.warning("Please select the supplier...");
      return;
    }
    this.fileUploadPopupAICOD.show();
  }

  fileUploadSuccess(uploadResult) {

    if (uploadResult.status == 'ok') {


      if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
        this._trnMainService.TrnMainObj.AdditionalObj = <TrnMain_AdditionalInfo>{};
      }
      if (uploadResult.result.INVAMOUNT > 0) {
        this._trnMainService.TrnMainObj.AdditionalObj.INVAMOUNT = uploadResult.result.INVAMOUNT;
      }
      if (uploadResult.result.INVNO != null && uploadResult.result.INVNO != "") {
        this._trnMainService.TrnMainObj.AdditionalObj.INVNO = uploadResult.result.INVNO;
      }
      if (uploadResult.result.SHIPNAME != null && uploadResult.result.SHIPNAME != "") {
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME = uploadResult.result.SHIPNAME;
      }
      if (uploadResult.result.SHIPNAMEVIEW != null && uploadResult.result.SHIPNAMEVIEW != "") {
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAMEVIEW = uploadResult.result.SHIPNAMEVIEW;
      }
      if (uploadResult.result.DeliveryAddress != null && uploadResult.result.DeliveryAddress != "") {
        this._trnMainService.TrnMainObj.DeliveryAddress = uploadResult.result.DeliveryAddress;
      }

      this._trnMainService.TrnMainObj.InvAmount = uploadResult.result.InvAmount;
      this._trnMainService.TrnMainObj.REFBILL = uploadResult.result.REFBILL;
      this._trnMainService.TrnMainObj.DIVISION = this._trnMainService.userProfile.userDivision;
      this._trnMainService.TrnMainObj.MWAREHOUSE = this._trnMainService.userProfile.userWarehouse;
      this._trnMainService.TrnMainObj.PhiscalID = this._trnMainService.userProfile.CompanyInfo.PhiscalID;
      //supplierSection
      if (this._trnMainService.TrnMainObj.PARAC == null) {
        this._trnMainService.TrnMainObj.BILLTO = uploadResult.result.ACNAME;
        this._trnMainService.TrnMainObj.PARAC = uploadResult.result.ACID;
        this._trnMainService.TrnMainObj.TRNAC = uploadResult.result.ACID;
        this._trnMainService.TrnMainObj.BILLTOADD = uploadResult.result.ADDRESS;
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = uploadResult.result.AdditionalObj.TRNTYPE;
        this._trnMainService.TrnMainObj.TRNMODE = uploadResult.result.TRNMODE;
        this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = uploadResult.result.PARTY_ORG_TYPE;
        this._trnMainService.TrnMainObj.PARTY_GSTTYPE = uploadResult.result.PARTY_GSTTYPE;
        this._trnMainService.TrnMainObj.CREDITDAYS = uploadResult.result.CREDITDAYS;
        this._trnMainService.TrnMainObj.AdditionalObj.CREDITDAYS = uploadResult.result.AdditionalObj.CREDITDAYS;
        this._trnMainService.TrnMainObj.BALANCE = uploadResult.result.BALANCE;
      }

      this._trnMainService.TrnMainObj.ProdList = uploadResult.result.ProdList;
      const uuidV1 = require('uuid/v1');
      this._trnMainService.TrnMainObj.guid = uuidV1();
      this._trnMainService.TrnMainObj.tag = "FROMEXCEL";
      for (let i in this._trnMainService.TrnMainObj.ProdList) {

        this._trnMainService.setAltunitDropDownForView(i);
        let excelpurchaseprice = this._trnMainService.TrnMainObj.ProdList[i].REALRATE;
        this._trnMainService.TrnMainObj.ProdList[i].PRATE =
          this._trnMainService.TrnMainObj.ProdList[i].REALRATE =
          this._trnMainService.TrnMainObj.ProdList[i].ALTRATE =
          this._trnMainService.TrnMainObj.ProdList[i].RATE = excelpurchaseprice;
        this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].OtherDiscount = this._trnMainService.TrnMainObj.ProdList[i].INDODAMT;



      }


      this._trnMainService.ReCalculateBillWithNormal();
      this.loadingSerive.hide();

    } else {
      this.loadingSerive.hide();
      this.alertService.error(uploadResult.result._body);

    }

  }

  fileMatrixUploadSuccess(uploadResult) {
    if (uploadResult.status == 'ok') {
      this._trnMainService.TrnMainObj.ProdList = uploadResult.result;
      this._trnMainService.TrnMainObj.tag = "FROMEXCEL";
      for (let i in this._trnMainService.TrnMainObj.ProdList) {

        this._trnMainService.setAltunitDropDownForView(i);
        let excelpurchaseprice = this._trnMainService.TrnMainObj.ProdList[i].REALRATE;
        this._trnMainService.TrnMainObj.ProdList[i].PRATE =
          this._trnMainService.TrnMainObj.ProdList[i].REALRATE =
          this._trnMainService.TrnMainObj.ProdList[i].ALTRATE =
          this._trnMainService.TrnMainObj.ProdList[i].RATE = excelpurchaseprice;
        this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].OtherDiscount = this._trnMainService.TrnMainObj.ProdList[i].INDODAMT;
        this._trnMainService.TrnMainObj.ProdList[i].CHALANNO = this._trnMainService.TrnMainObj.CHALANNO;
        if (this._trnMainService.TrnMainObj.ProdList[i].BC == null || this._trnMainService.TrnMainObj.ProdList[i].BC == "") {
          this.generateString(this._trnMainService.TrnMainObj.ProdList[i], i);
          this._trnMainService.TrnMainObj.ProdList[i].BCODEID = this._trnMainService.TrnMainObj.ProdList[i].BC;
        }
      }


      this._trnMainService.ReCalculateBillWithNormal();
      this.loadingSerive.hide();

    } else {
      this.loadingSerive.hide();
      this.alertService.error(uploadResult.result._body);

    }


  }

  generateString(val, ind) {

    val['Sno'] = (parseInt(ind) + 1).toString();
    var valKey;
    var variantKey = [];
    var barcodeString = [];
    valKey = Object.keys(val);
    if (!valKey.includes('VARIANTLIST')) {
      if (valKey.includes('VARIANTDETAIL')) {
        val.VARIANTLIST = val.VARIANTDETAIL;
      }
    }

    if ((val.VARIANTLIST == null || val.VARIANTLIST == undefined)) {
      // this.alertService.warning("Bar code not generated. Due to variant not available");
      // return;
    } else {
      this.itemVariantDetails = val.VARIANTLIST;
      variantKey = Object.keys(val.VARIANTLIST);
    }
    this.configCodeParams.forEach((cp) => {

      if (cp.VARIANTNAME == null || cp.VARIANTNAME == "" || cp.VARIANTNAME == undefined) {
        if (valKey == null) valKey = "";
        for (let a = 0; a < valKey.length; a++) {
          if (cp.DbColumn.includes(valKey[a])) {
            var bcodeval;
            if (val[valKey[a]] == "" || val[valKey[a]] == null) { } else {
              if (val[valKey[a]].length < cp.ParaMaxLength) {
                bcodeval = this.zeroPad(val[valKey[a]], cp.ParaMaxLength);
              } else {
                bcodeval = val[valKey[a]].toString().slice(-parseInt(cp.ParaMaxLength));
              }
              barcodeString.push(bcodeval.replace(/[^A-Z0-9]/ig, ""));
            }
          } else { }
        }

      } else {
        if (variantKey == null) variantKey = [];

        for (let a = 0; a < variantKey.length; a++) {
          if (cp.ParameterTitle == variantKey[a]) {

            let bcodeval = val.VARIANTLIST[variantKey[a]].VARIANTBARCODE.toString().replace(/[^A-Z0-9]/ig, "").slice(-parseInt(cp.ParaMaxLength));
            barcodeString.push(this.zeroPad(bcodeval, cp.ParaMaxLength).replace(/[^A-Z0-9]/ig, ""));
          }
        }
      }

      if (barcodeString != null && barcodeString.length > 0) {
        this._trnMainService.TrnMainObj.ProdList[ind].BC = barcodeString.join('');
        //this._trnMainService.TrnMainObj.ProdList[ind].ConfigParaTitle = this.configCodeParams[0].ConfigParaTitle;
        //        this.loadingService.show("Code Generated Please Wait...");
        //        this.masterService.masterGetmethod(`/getGenerateConfigCode?barCodeString=${this.barcodeString.join('')}`).subscribe(res=>{
        //            if(res.status == 'ok'){
        //                this.loadingService.hide();
        //            }
        //        })

      } else {

      }

    });
    //}

  }

  zeroPad(num, len) {
    return num.toString().padStart(len, "0");
  }
  getconfigParameter() {
    try {
      this.masterService.masterGetmethod('/selectDetailsofCode').subscribe(res => {
        if (res.status == "ok") {
          this.configCodeParams = res.result;
        } else {
          this.alertService.warning("Config Code bar code for generate item bar code")
        }
      })
    }
    catch (e) {
    }
  }
  fileUploadPopupAICODSuccess(uploadResult) {

    if (uploadResult.status == 'ok') {
      this._trnMainService.TrnMainObj.ProdList = uploadResult.result;
      this._trnMainService.TrnMainObj.tag = "FROMEXCELAICOD";
      for (let i in this._trnMainService.TrnMainObj.ProdList) {

        this._trnMainService.setAltunitDropDownForView(i);
        let excelpurchaseprice = this._trnMainService.TrnMainObj.ProdList[i].REALRATE;
        this._trnMainService.TrnMainObj.ProdList[i].PRATE =
          this._trnMainService.TrnMainObj.ProdList[i].REALRATE =
          this._trnMainService.TrnMainObj.ProdList[i].ALTRATE =
          this._trnMainService.TrnMainObj.ProdList[i].RATE = excelpurchaseprice;
        this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].OtherDiscount = this._trnMainService.TrnMainObj.ProdList[i].INDODAMT;
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
  showMRList = (): void => {
    this.showMRListGrid.show("", false, "mrlist")
  }






  onHoSalesInvoiceSelect(item) {
    this.getSalesInvoiceFromSupplier(item.VCHRNO, item.FROMCOMPANYID);
  }


  onMRSelect(data: any) {
    this.loadingSerive.show("Getting Details.Please Wait.....")
    this.masterService.LoadTransaction(data.VCHRNO, data.DIVISION, data.PHISCALID, "view").subscribe(
      data => {
        this.loadingSerive.hide();
        if (data.status == "ok") {
          this._trnMainService.TrnMainObj = data.result;
          this._trnMainService.TrnMainObj.EditModeNetAMount = this._trnMainService.TrnMainObj.NETAMNT;
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.REFBILLDATE = data.result.TRN_DATE == null ? (moment(data.result.TRNDATE.substr(0, 10)).format("DD/MM/YYYY")) : (moment(data.result.TRN_DATE.substr(0, 10)).format("DD/MM/YYYY"));
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.TrnMainObj.VoucherType = VoucherTypeEnum.Purchase;
          this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
          this._trnMainService.TrnMainObj.VoucherAbbName = "PI";
          this._trnMainService.TrnMainObj.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
          this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_PI";
          this._trnMainService.TrnMainObj.REFORDBILL = this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILL;
          this._trnMainService.TrnMainObj.REFBILL = data.result.VCHRNO;
          this._trnMainService.TrnMainObj.VCHRNO = "";
          this._trnMainService.TrnMainObj.CHALANNO = "";
          this._trnMainService.TrnMainObj.tag = "FROM MR";
          if (this._trnMainService.TrnMainObj.TransporterEway == null) {
            this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          }
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
            this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
          }
          this._trnMainService.TrnMainObj.MWAREHOUSE = this._trnMainService.userProfile.userWarehouse;

          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.ProdList[i].OtherDiscount = this._trnMainService.TrnMainObj.ProdList[i].INDODAMT;
            if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].PrimaryDiscount) > 0) {
              this._trnMainService.TrnMainObj.ProdList[i].BasePrimaryDiscount =
                this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].PrimaryDiscount) / (this._trnMainService.TrnMainObj.ProdList[i].Quantity * this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);
            }
            if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].SecondaryDiscount) > 0) {
              this._trnMainService.TrnMainObj.ProdList[i].BaseSecondaryDiscount =
                this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].SecondaryDiscount) / (this._trnMainService.TrnMainObj.ProdList[i].Quantity * this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);

            }
            if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].LiquiditionDiscount) > 0) {
              this._trnMainService.TrnMainObj.ProdList[i].BaseLiquiditionDiscount =
                this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].LiquiditionDiscount) / (this._trnMainService.TrnMainObj.ProdList[i].Quantity * this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);
            }
            //  this._trnMainService.determineAutoSchemeAppliedinView(i, this._trnMainService.TrnMainObj.ProdList[i].SCHEMESAPPLIED);
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].WAREHOUSE = this._trnMainService.TrnMainObj.MWAREHOUSE;
          }

          this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          let invoiceDate = data.result.TRN_DATE;
          this._trnMainService.TrnMainObj.TRN_DATE = invoiceDate == null ? this._trnMainService.TrnMainObj.TRNDATE : invoiceDate.toString().substring(0, 10);

          // this._trnMainService.setAltunitDropDownForViewStock(0);

        }



      },
      error => {
        this.loadingSerive.hide();
        this.alertService.error(error._body);
      },
      () => {
        this.loadingSerive.hide();
      }
    );
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
          if (this._trnMainService.TrnMainObj.AdditionalObj != null) {
            this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME = null;
            this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAMEVIEW = null;
          }
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.TrnMainObj.VoucherType = 3;
          this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
          this._trnMainService.TrnMainObj.VoucherAbbName = "PI";
          this._trnMainService.TrnMainObj.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
          this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_PI";
          this._trnMainService.TrnMainObj.REFORDBILL = this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILL;
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.REFBILL = voucherNo;
          this._trnMainService.TrnMainObj.VCHRNO = "";
          this._trnMainService.TrnMainObj.CHALANNO = "";
          this._trnMainService.TrnMainObj.tag = "fromsidomain";
          this._trnMainService.TrnMainObj.JOBNO = FROMCOMPANYID;

          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.setAltunitDropDownForView(i);
            let editPrice = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].RATE);
            // this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
            this._trnMainService.TrnMainObj.ProdList[i].ORIGINALTRANRATE =
              this._trnMainService.TrnMainObj.ProdList[i].PRATE =
              this._trnMainService.TrnMainObj.ProdList[i].REALRATE =
              this._trnMainService.TrnMainObj.ProdList[i].ALTRATE =
              this._trnMainService.TrnMainObj.ProdList[i].RATE = editPrice;
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].SPRICE, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            // this._trnMainService.CalculateNormalNew(i);

            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].VARIANTDESCA = "";
            if (this._trnMainService.TrnMainObj.ProdList[i].Ptype == ITEMTYPE.MATRIXITEM) {
              for (var attribute in this._trnMainService.TrnMainObj.ProdList[i].VARIANTLIST) {
                if (['QTY', 'PRATE', 'MRP', 'SRATE', 'BARCODE', 'BATCH'].indexOf(attribute) == -1) {
                  let name = "";
                  if (this._trnMainService.TrnMainObj.ProdList[i].VARIANTLIST[attribute] != null) {
                    name = this._trnMainService.TrnMainObj.ProdList[i].VARIANTLIST[attribute].NAME;
                  }
                  this._trnMainService.TrnMainObj.ProdList[i].VARIANTDESCA = this._trnMainService.TrnMainObj.ProdList[i].VARIANTDESCA + `<b>${this._trnMainService.getVariantNameFromId(attribute)}</b>:${name} <br/>`

                }
              }
            }
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
          this._trnMainService.TrnMainObj.VoucherType = 3;
          this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
          this._trnMainService.TrnMainObj.VoucherAbbName = "PI";
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.REFBILL = voucherNo;
          this._trnMainService.TrnMainObj.VCHRNO = "";
          this._trnMainService.TrnMainObj.CHALANNO = "";
          this._trnMainService.TrnMainObj.tag = "FTP";
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i, "", 0, this._trnMainService.TrnMainObj.ProdList[i].RATE);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].SPRICE, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
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
          this.alertService.error(data.result._body);
        }
      }, error => {

        this.alertService.error(error)
      })
  }


  popupClose() {
    this._trnMainService.initialFormLoad(3)
  }



  showLoadFromPerformaInvoiceRequestPopup($event) {
    this.genericGridPerformaInvoice.show();
  }

  showLoadFromSOPopup($event) {
    this.genericGridSO.show();
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
            this._trnMainService.TrnMainObj.Mode = "VIEW"
            this._trnMainService.TrnMainObj.VoucherType = 3;
            const uuidV1 = require('uuid/v1');
            this._trnMainService.TrnMainObj.guid = uuidV1();
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
            let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
            this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
            this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
          }
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
    this.genericGridPO.show("", false, "editForPurchaseOrder");
  }

  onHoPurchaseOrderClicked(purchaseOrder) {
    this.getSelectedPurchaseOrder(purchaseOrder);
  }

  getSelectedPurchaseOrder(purchaseOrder) {
    let mode = "LoadingPOinPI";
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.LoadTransaction(purchaseOrder.VCHRNO, purchaseOrder.DIVISION, purchaseOrder.PhiscalID, mode).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.REFBILL = null;
          this._trnMainService.TrnMainObj.REFORDBILL = purchaseOrder.VCHRNO;

          this._trnMainService.TrnMainObj.VoucherType = 3;
          this._trnMainService.TrnMainObj.VoucherPrefix = "PI";
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.tag = "frompo";
          this._trnMainService.TrnMainObj.POST = 0;
          if (this._trnMainService.TrnMainObj.AdditionalObj != null) {
            this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILL = purchaseOrder.VCHRNO;
            this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILLDATE = purchaseOrder.TRNDATE;
            this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_PI";
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
        this.alertService.error(error);
      }
    );
  }


  onTransactionConfigureClick() {
    this.userwisetransactionformconfig.show(VoucherTypeEnum.Purchase)
  }


  updateGridConfig(gridsetting) {
    this._trnMainService.userwiseTransactionFormConf = gridsetting;
  }

}





