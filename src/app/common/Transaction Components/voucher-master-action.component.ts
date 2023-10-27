import { TransactionService } from "./transaction.service";
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, ElementRef, Pipe, PipeTransform } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TrnMain, VoucherTypeEnum, TrnProd, SHIPTODETAIL } from "../interfaces/TrnMain";
import { FormGroup, FormControl } from "@angular/forms";
import { MasterRepo } from "../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";
import { SettingService, AppSettings } from "../services";
import { AuthService } from "../services/permission/authService.service";
import { MdDialog } from "@angular/material";
import { GenericPopUpComponent, GenericPopUpSettings } from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { GenericPopUpTenderComponent } from "../../pages/Sales/components/salesinvoice/generic-popup-Tender.component";
import { AddNewCustomerPopUpComponent } from "../../pages/Sales/components/salesinvoice/AddCustomerPopup";
import { TransportPopupComponent } from "../../pages/Sales/components/salesinvoice/Transport-popup.component";
import { PrintInvoiceComponent } from "../Invoice/print-invoice/print-invoice.component";
import * as moment from 'moment';
import * as _ from "lodash";
import { LoginDialog } from "../../pages/modaldialogs/logindialog/logindialog.component";
import { WindowRef } from "../repositories/windows.service";
import { DeviceSetting } from "../../pages/configuration/components/device-setting/devicesetting.interface";
import { PopBatchComponent } from "../popupLists/PopBatchList/PopBatch.component";
import { BarCodeComponent } from "../../pages/settings/components/BarCodeSetting/bar-code.component";

import { Loyalty, Range } from "../interfaces/loyalty.interface";
import { timer } from "rxjs/observable/timer";
import { DatePipe } from "@angular/common";
import { FileUploaderService } from "../popupLists/file-uploader/file-uploader-popup.service";

import { isNullOrUndefined } from "util";
import { relative } from "path";
@Component({
  selector: "voucher-master-action",
  templateUrl: "./voucher-master-action.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"],
  providers: [PrintInvoiceComponent, BarCodeComponent]
})
export class VoucherMasterActionComponent implements OnInit {
  @Input() isSales;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  modeTitle: string = "";

  form: FormGroup;
  AppSettings: AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};
  McodeList: any[] = [];
  itemDetailsWithImage: any[] = [];
  // additonalCost is 99 sends from AdditionalCost component
  @ViewChild("genericGridItem") genericGridItem: GenericPopUpComponent;
  gridPopupSettingsForItem: GenericPopUpSettings = new GenericPopUpSettings();
  @Input() additionCost: number;
  @Output() onIndentForRFQEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onVoucherDoubleClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() ViewRfqSupplierHistry: EventEmitter<any> = new EventEmitter<any>();
  @Output() onResetClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() additionalcostEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromSOClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromPOClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromHOPerformaInvoiceClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromPerformaInvoiceClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromDeliveryChallaanClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadRcvdDeliveryChallaanClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromHoTaxInvoiceClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromMREmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromSAPFTPClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowFileUploadPopupEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowMatrixFileUploadPopupEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadFromStockSettlementApproval: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSettlementStockApprove: EventEmitter<any> = new EventEmitter<any>();
  @Output() onApproveStockSettlementList: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPInvoieFileUploadPopupEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAICODPInvoieFileUploadPopupEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPRnvoieFileUploadPopupEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowSalesOrderfromMobileEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancelEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSalesReturnCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPurchaseReturnCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPurchaseReturnCancelSave: EventEmitter<any> = new EventEmitter<any>();

  @Output() onInterCompanyTransferInCancelSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onInterCompanyTransferOutCancelSave: EventEmitter<any> = new EventEmitter<any>();

  @Output() onTransferOutClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onImportFromSOInPO: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSaveClickedEmitted: EventEmitter<any> = new EventEmitter<any>();
  // @Output() onPOCancelPurchaseOrderLoadEmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  @ViewChild("genericGridForFromQuotations") genericGridForFromQuotations: GenericPopUpComponent;
  genericPopupSettingsForFromQuotations: GenericPopUpSettings = new GenericPopUpSettings();
  @Output() onLoadCancelSalesEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadCancelInterCompanyTransferInEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadCancelInterCompanyTransferOutEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadCancelRNEmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("genericTender") genericTender: GenericPopUpTenderComponent;
  @ViewChild("genericGridHoldBill") genericGridHoldBill: GenericPopUpComponent;
  @ViewChild("Transport") Transport: TransportPopupComponent;
  @ViewChild("AddNewCustomerPopup") AddNewCustomerPopup: AddNewCustomerPopUpComponent;
  @ViewChild("genericGridIntend") genericGridIntend: GenericPopUpComponent;
  @ViewChild('printSetupModal') printSetupModal: ElementRef

  @Output() onAddNewCustomerClickEmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("genericGridEdit") genericGridEdit: GenericPopUpComponent;
  gridPopupSettingsForEdit: GenericPopUpSettings = new GenericPopUpSettings();
  returnUrl: string;
  checkstatus = true;
  viewSubscription: Subscription = new Subscription();
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  showSecondaryButtons: boolean;
  gridPopupSettingsForHoldBill: GenericPopUpSettings = new GenericPopUpSettings();
  trialUrl: boolean = false;
  showUnApprove: boolean = false;
  activeurlpath: string;
  customerTypeList: any;
  stateCodeList: any;
  gridPopupSettingsForIntend: GenericPopUpSettings = new GenericPopUpSettings();
  public showPosPrinterPreview: boolean = false;
  public promptPrintDevice: boolean = false;
  public showShippingAddress: boolean = false;
  public printControl = new FormControl(0);
  showAdvanceAdjustmentPopUp: boolean = false;
  @Output() onFromDebitNoteClickedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFromCreditNoteClickedEvent: EventEmitter<any> = new EventEmitter<any>();
  showItemImage: boolean = false;
  showProducts: boolean = false;
  showSupplier: boolean = false;
  SupplierName: any;
  SupplierAddress: any;
  SupplierArea: any;
  SupplierCity: any;
  SupplierEmail: any;
  SupplierGST: any;
  SupplierLandmark: any;
  SupplierMobile: any;
  SupplierPan: any;
  SupplierInvoiceType: any;
  SupplierState: any;
  productPurchaseRate: any;
  productName: any;
  productGST: any;
  productMRP: any;
  productSellRate: any;
  product: any;
  StateList: any[] = [];
  formName: string = '';
  deviceSetting: Array<DeviceSetting> = [];
  showInvoiceDetails: boolean = false;
  showBillDetails: boolean = false;
  invoiceDetails: any[] = [];
  dateFrom: any;
  dateTo: any;
  public employeeList: any[] = [];
  public doctorList: any[] = [];
  enableBarcodePrintOption: boolean;
  activerowIndex: number = 0;

  public caretDate: string = "";
  public assignCaret: string = "0";
  public returnCaret: string = "0";
  public saveCaretStatus: boolean = false;
  public crateBalance: string = "0";
  UsingLoyalty: Loyalty;
  formWisePrintProfile: DeviceSetting[];
  UsingRange: Range;
  cust_id: string = null;
  showAdvancePopUpForSalesOrder: boolean;
  constructor(

    private winRef: WindowRef,
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private setting: SettingService,
    authservice: AuthService,
    public dialog: MdDialog,
    private router: Router,
    private arouter: ActivatedRoute,
    private alertService: AlertService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private loadingService: SpinnerService,
    public invoicePrint: PrintInvoiceComponent,
    private fileImportService: FileUploaderService
  ) {




    this.masterService.masterGetmethod_NEW("/getEmployeeList").subscribe((res) => {
      if (res.status == "ok") {
        this.employeeList = res.result;
      } else {
      }
    })
    this.masterService.masterGetmethod_NEW("/getDoctorList").subscribe((res) => {
      if (res.status == "ok") {
        this.doctorList = res.result;
      } else {
      }
    })




    this.masterService.ShowMore = false;
    this.AppSettings = this.setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    this.voucherType = this._trnMainService.TrnMainObj.VoucherType;
    this.formName = this._trnMainService.formName;
    this._trnMainService.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this._trnMainService.TrnMainObj.DIVISION = this.userProfile.userDivision;
    this.showSecondaryButtons = false;
    this.masterService.refreshTransactionList();
    if (
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn
    ) {
      this.transactionType = "creditnote";
    }
    this.gridPopupSettings = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings(this._trnMainService.TrnMainObj.VoucherAbbName));
    this.gridPopupSettingsForHoldBill = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings("HOLDBILLLIST"));
    this.gridPopupSettingsForIntend = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings("INDENTLIST"));
    this.genericPopupSettingsForFromQuotations = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings("PODataFromQuotations"));
    this.activeurlpath = arouter.snapshot.url[0].path;
    this.deviceSetting = this.userProfile.printDeviceSetting ? this.userProfile.printDeviceSetting : [];
    this.formWisePrintProfile = this.deviceSetting.filter(x => x.profileTypeLabel == this._trnMainService.formName);
  }


  onProductOutDoubleClick(value) {
    console.log("my cust id ", this._trnMainService.TrnMainObj.customerID);
    console.log("my app setting ", this.AppSettings);
    console.log(value);
    console.log("length pf prolist ", this._trnMainService.TrnMainObj.ProdList.length);
    console.log("mcode ", this._trnMainService.TrnMainObj.ProdList[0].MENUCODE);

    if (this._trnMainService.TrnMainObj.ProdList.length == 1 && this._trnMainService.TrnMainObj.ProdList[0].MENUCODE == undefined) {
      this.activerowIndex = 0;
    } else {
      this.activerowIndex = this.activerowIndex + 1;
    }
    console.log("act index ", this.activerowIndex);

    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex] = <TrnProd>{};
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SELECTEDITEM = value;
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE = value.MCODE;
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MRP = this.nullToZeroConverter(value.MRP);
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ORIGINALTRANRATE = this.nullToZeroConverter(value.MRP);
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ORIGINALTRANRATE = this.nullToZeroConverter(value.MRP);
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALT_ORIGINALTRANRATE = this.nullToZeroConverter(value.MRP);

    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GSTRATE = this.nullToZeroConverter(value.GSTRATE);
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Mcat = value.Mcat;

    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR = 1;
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CARTONCONFACTOR = 1;
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MENUCODE = value.MCODE;
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ITEMDESC = value.DESCA;
    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Quantity = this.nullToZeroConverter(value.Qty);

    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].inputMode = true;


    //this.getPricingOfItem(this.activerowIndex);
    this._trnMainService.getPricingOfItem(this.activerowIndex);


    console.log("checkrate8", this._trnMainService.TrnMainObj.ProdList)
    timer(2000).subscribe(x => {
      this._trnMainService.ReCalculateBillWithNormal();
      this._trnMainService.QuantityChangeEvent(this.activerowIndex);
      console.log("prod list update ", this._trnMainService.TrnMainObj.ProdList);
    });

  }

  ngOnInit() {
    this.masterService.customerPopUpSubject.subscribe((res) => {
      if (res && res.hasOwnProperty('SHOWPOPUP')) {
        this.AddNewCustomerPopup.show();
        this.masterService.customerMobileSubject.next(res['MOBILENUMBER']);
      }
    })
    this.product = <any>{};
    this.masterService.getState().subscribe((res) => {
      this.stateCodeList = res.result;
      if (this._trnMainService.TrnMainObj.VoucherType == 3) {
        this.StateList = res.result;
      }
    })
    this.masterService.getAllHierachy().subscribe((res) => {
      this.customerTypeList = res.result.GEO;
    })



    if (!!this.arouter.snapshot.params["returnUrl"]) {
      this.returnUrl = this.arouter.snapshot.params["returnUrl"];
    }
    if (this.activeurlpath == 'StockSettlementEntryApproval') {
      return this.trialUrl = true;
    }
    if (this.activeurlpath == 'StockSettlementEntry') {
      return this.showUnApprove = true;
    }
    if (this.activeurlpath.startsWith('quotationinvoice')) {
      this.masterService.ShowMore = true;
    }
    if (this.activeurlpath.startsWith('add-RFQ-order')) {
      this.masterService.ShowMore = true;
    }


  }

  supplierPostalCode: any;
  SupplierGSTTYPE: any;

  ngOnDestroy() {
    try {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  generateItemBarCode() {
    if (confirm("Are you sure you want to generate bar code")) {
      if (this._trnMainService.TrnMainObj.ProdList.length <= 0) {
        this.alertService.warning("Select at least one product");
        return;
      }
    }

  }
  saveSupplier() {
    if (!this.SupplierName || this.SupplierName == "" || this.SupplierName == undefined || this.SupplierName == null) {
      this.alertService.warning("Name is required");
      return;
    }
    else if (!this.SupplierCity || this.SupplierCity == "" || this.SupplierCity == undefined || this.SupplierCity == null) {
      this.alertService.warning("City is required");
      return;
    }
    else if (!this.SupplierAddress || this.SupplierAddress == "" || this.SupplierAddress == undefined || this.SupplierAddress == null) {
      this.alertService.warning("Address is required");
      return;
    }

    else if (!this.SupplierState || this.SupplierState == "" || this.SupplierState == undefined || this.SupplierState == null) {
      this.alertService.warning("State is required");
      return;
    }
    else if (!this.SupplierMobile || this.SupplierMobile == "" || this.SupplierMobile == undefined || this.SupplierMobile == null) {
      this.alertService.warning("Mobile Number  is required");
      return;
    }
    else if (!this.supplierPostalCode || this.supplierPostalCode == "" || this.supplierPostalCode == undefined || this.supplierPostalCode == null) {
      this.alertService.warning("Pin code is required.");
      return;
    }
    else if (!this.SupplierGSTTYPE || this.SupplierGSTTYPE == "" || this.SupplierGSTTYPE == undefined || this.SupplierGSTTYPE == null) {
      this.alertService.warning("GST type is required.");
      return;
    }
    else if (this.SupplierMobile.toString().length < 10) {
      this.alertService.warning("Mobile number must be of length 10.");
      return;
    }
    else {
      // this.loadingService.show("Please wait.... Saving your data.");
      const newArray = [];
      const data = {
        "ACNAME": this.SupplierName,
        "ADDRESS": this.SupplierAddress,
        "AREA": this.SupplierArea,
        "CITY": this.SupplierCity,
        "EMAIL": this.SupplierEmail,
        "GSTNO": this.SupplierGST,
        "LANDMARK": this.SupplierLandmark,
        "MOBILE": this.SupplierMobile.toString(),
        "VATNO": this.SupplierPan,
        "PARENT": "PA",
        "STATE": this.SupplierState,
        "CTYPE": this.SupplierInvoiceType,
        "PType": "V",
        "MAPID": "N",
        GSTTYPE: this.SupplierGSTTYPE,
        POSTALCODE: this.supplierPostalCode,
      };
      this.masterService.saveAccount_new(data).subscribe(res => {
        if (res.status == "ok") {
          this.alertService.success("Data Saved Successfully");
          this.resetSupplierForm();
          this.loadingService.hide();
          this.showSupplier = false;
        }
        else {
          this.loadingService.hide();
          this.alertService.error(res.result);

        }
      }, error => {
        this.alertService.error(error._body);
      })
    }
  }
  resetSupplierForm() {
    this.SupplierName = null;
    this.SupplierAddress = null;
    this.SupplierArea = null;
    this.SupplierCity = null;
    this.SupplierEmail = null;
    this.SupplierGST = null;
    this.SupplierLandmark = null;
    this.SupplierMobile = null;
    this.SupplierPan = null;
    this.SupplierState = null;
    this.SupplierInvoiceType = null;
    this.supplierPostalCode = null;
    this.SupplierGSTTYPE = null;


  }

  stockSettlementApprovalLoad() {
    this.onLoadFromStockSettlementApproval.emit(true);
  }

  stockSettlementOnApproveList() {
    this.onApproveStockSettlementList.emit(true);
  }

  cancelProducts() {
    this.product = <any>{};
    this.showProducts = false;
  }

  cancelItemImage() {
    this.itemDetailsWithImage = [];
    this.showItemImage = false;
  }

  cancelSupplier() {
    this.showSupplier = false;
    this.resetSupplierForm();
  }



  stockSettlementApprove() {
    this._trnMainService.TrnMainObj.Mode = "NEW";
    this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj)
      .subscribe(data => {
        if (data.status == 'ok') {
          this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
          this._trnMainService.pageHeading = "Stock Settlement Approval"
        } else {
          this.alertService.error(data.result._body);
        }
        error => {
          this.alertService.error(error);
        }
      });

  }
  onLoadFromSalesOrder() {
    this.onLoadFromSOClickEmit.emit(true);
  }

  onReadWeight() {
    this._trnMainService.updateWeightFromWeighingMachine();
  }

  onLoadInterCompanyTransferInCancel() {
    let user = this._trnMainService.userProfile;
    if (user.username != "Admin" && user.username != "patanjali_user") {
      if (!(this.authService.checkMenuRight(this.activeurlpath, "edit"))) {
        this.alertService.error("You are not authorized for this operation.");
        return;
      }
    }
    this.onLoadCancelInterCompanyTransferInEmit.emit(true)
  }

  onLoadInterCompanyTransferOutCancel() {
    let user = this._trnMainService.userProfile;
    if (user.username != "Admin" && user.username != "patanjali_user") {
      if (!(this.authService.checkMenuRight(this.activeurlpath, "edit"))) {
        this.alertService.error("You are not authorized for this operation.");
        return;
      }
    }
    this.onLoadCancelInterCompanyTransferOutEmit.emit(true)
  }

  onLoadSalesCancel() {
    let user = this._trnMainService.userProfile;
    if (user.username != "Admin" && user.username != "patanjali_user") {
      if (!(this.authService.checkMenuRight(this.activeurlpath, "edit"))) {
        this.alertService.error("You are not authorized for this operation.");
        return;
      }
    }
    this.onLoadCancelSalesEmit.emit(true)
  }

  onLoadRNCancel() {
    let user = this._trnMainService.userProfile;
    if (user.username != "Admin" && user.username != "patanjali_user") {
      if (!(this.authService.checkMenuRight(this.activeurlpath, "edit"))) {
        this.alertService.error("You are not authorized for this operation.");
        return;
      }
    }
    this.onLoadCancelRNEmit.emit(true)
  }

  onLoadFromPurchaseOrder() {
    this.onLoadFromPOClickEmit.emit(true);
  }

  onLoadFromHOPerformaInvoiceClick() {
    this.onLoadFromHOPerformaInvoiceClickEmit.emit(true)
  }

  onLoadFromHoTaxInvoiceClick() {
    this.onLoadFromHoTaxInvoiceClickEmit.emit(true)
  }
  onLoadFromMR() {
    this.onLoadFromMREmit.emit(true)
  }

  onLoadFromSAPFTPClick() {
    this.onLoadFromSAPFTPClickEmit.emit(true)
  }


  loadcustinvoices() {
    this.showSalesBillPopUp = !this.showSalesBillPopUp;
    this.calculateDateForSI();

  }

  // onLoadPOForPOCancel(){
  //   this.onPOCancelPurchaseOrderLoadEmit.emit(true);
  // }

  onCloseClicked() {
    this.router.navigate(["/pages/dashboard"]);
  }

  saveProducts() {
    this.product.creationsource = "shortcut";
    const data = {
      product: this.product
    }

    this.masterService.saveProducts(data).subscribe(res => {
      if (res.status == "ok") {
        this.product = <any>{};
        this.alertService.success("product saved successfull...");
        this.showProducts = false;
        this.masterService.getMcodeWiseStockList().subscribe(x => {
          this.masterService.MCODEWISE_ITEMSTOCKLIST = x;
        })
      }
      else {
        this.alertService.error(res.result._body);
      }
    });
  }
  GetUnbilledItem() {
    if (this._trnMainService.TrnMainObj.customerID == undefined || this._trnMainService.TrnMainObj.customerID.length == 0) {
      this.alertService.warning("Choose Customer First");
      return;
    }
    this.cust_id = this._trnMainService.TrnMainObj.customerID;
    console.log("cust id --", this.cust_id);
    this.userProfile = this.authService.getUserProfile();
    console.log("userprofile array ", this.userProfile);
    this.gridPopupSettingsForItem = Object.assign(new GenericPopUpSettings, {
      title: "UnBill Item List",
      apiEndpoints: `/GetUnbilledItemFromHMSByUser/` + this.cust_id + `/` + this.userProfile.CompanyInfo.COMPANYID,
      defaultFilterIndex: 0,
      showActionButton: true,
      actionKeys: [{
        icon: "fa fa-trash",
        text: "delete",
        title: "Click to hide Order."
      }],
      columns: [
        {
          key: "MCODE",
          title: "Item Code",
          hidden: false,
          noSearch: false
        },
        {
          key: "DESCA",
          title: "Item Description",
          hidden: false,
          noSearch: false
        },
        {
          key: "MRP",
          title: "MRP",
          hidden: false,
          noSearch: false
        },
        {
          key: "UOMS",
          title: "Unit",
          hidden: false,
          noSearch: false
        },
        {
          key: "Qty",
          title: "Purchase Qty",
          hidden: false,
          noSearch: false
        },
        {
          key: "PurchaseDate",
          title: "Purchase Date",
          hidden: false,
          noSearch: false
        }
      ]
    });
    // this.transactionMode = "VIEW";
    // this.gridPopupSettings = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings(this._trnMainService.TrnMainObj.VoucherAbbName));
    // this.genericGrid.show();

    this.genericGridItem.show();
  }
  onViewClicked() {

    this.transactionMode = "VIEW";
    this.gridPopupSettings = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings(this._trnMainService.TrnMainObj.VoucherAbbName));
    if (this.activeurlpath == "StockSettlementEntry") {
      this.stockSettlementOnApproveList();
    } else if (this._trnMainService.TrnMainObj.VoucherPrefix == "CN") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "cnlistforview");
      return;
    } else if (this._trnMainService.TrnMainObj.VoucherPrefix == "DN") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "dnlistforview");
    } else if (this._trnMainService.TrnMainObj.VoucherPrefix == "SO") {
      this.genericGrid.show("", false, "salesorderview");
      return;
    } else if (this._trnMainService.TrnMainObj.VoucherPrefix == "PP") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewforproformainvoice");
      return;
    }
    else if (this._trnMainService.TrnMainObj.VoucherPrefix == "DY") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewfordeliverychallaan");
      return;
    } else if (this._trnMainService.TrnMainObj.VoucherAbbName == "TI") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewforsalesinvoice");
      return;
    } else if (this._trnMainService.TrnMainObj.VoucherAbbName == "IR") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewforintercompanytranferin");
      return;
    } else if (this._trnMainService.TrnMainObj.VoucherAbbName == "IC") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewforintercompanytranferout");
      return;
    }
    else if (this._trnMainService.TrnMainObj.VoucherPrefix == "PO") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewForPurchaseOrder");
      return;
    } else if (this._trnMainService.TrnMainObj.VoucherPrefix == "PI") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewForPurchaseInvoice");
      return;
    } else if (this._trnMainService.TrnMainObj.VoucherPrefix == "MR") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewForMaterialReceipt");
      return;
    }
    else if (this._trnMainService.TrnMainObj.VoucherPrefix == "RN") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewForReceiptNote");
      return;
    } else if (this._trnMainService.TrnMainObj.VoucherPrefix == "OP") {
      this.genericGrid.show(this._trnMainService.TrnMainObj.PARAC, false, "viewForOpeningStock");
      return;
    }
    else if (this._trnMainService.TrnMainObj.VoucherPrefix == "QT") {
      let customer = '';
      if (!isNullOrUndefined(this._trnMainService.TrnMainObj.PARAC) && this._trnMainService.TrnMainObj.PARAC != '') {
        customer = this._trnMainService.TrnMainObj.PARAC;
      }
      else {
        this.alertService.info("Please Select Customer First");
        return;
      }
      this.genericGrid.show(customer, false, "ViewQuotation");
      return;
    }
    else if (this._trnMainService.TrnMainObj.VoucherPrefix == "RFQ") {
      this.genericGrid.show('', false, "ViewRFQ");
      return;
    }
    else {
      this.genericGrid.show();
      return;
    }
  }

  onViewQuotationClicked() {
    let currentUrl = this.router.url;
    let currentUrlList = currentUrl.split("/");
    this.activeurlpath = currentUrlList[currentUrlList.length - 1];
    let rfqno = this._trnMainService.TrnMainObj.VCHRNO;
    if (rfqno == null || rfqno == "") {
      return;
    }
    this.router.navigate([`../supplier-response-detail/${rfqno}`], { relativeTo: this.arouter })
  }
  setPrinterAndprint() {
    this.promptPrintDevice = false;
    // this.printControl.value;
    if (this.defaultPrinter !== null && this.defaultPrinter !== undefined) {
      this.userProfile.PrintMode = this.defaultPrinter;
    }
    else {
      this.userProfile.PrintMode = this.printControl.value;
    }

    let isCustomizedPrintDesignerPrint = false;
    if (this.formWisePrintProfile != null && this.formWisePrintProfile.length > 0) {
      let printfor = this.formWisePrintProfile.find(x => x.controlValue == this.printControl.value);
      if (printfor != null) {
        isCustomizedPrintDesignerPrint = printfor.isCustomizedPrintDesignerPrint;
      }
    }
    //for customized print designers
    if (isCustomizedPrintDesignerPrint == true) {

      this.loadingService.show("Downloading Sample. Please Wait...");

      this.masterService.downloadRdlcPdf([{
        printControlValue: this.userProfile.PrintMode,
        vchrno: this._trnMainService.TrnMainObj.VCHRNO,
        companyId: this._trnMainService.TrnMainObj.COMPANYID

      }], '/webHtmlDesignerPdf', this._trnMainService.pageHeading)
        .subscribe(
          (data: any) => {
            this.loadingService.hide();
            // this.masterService.downloadFile(data);
            const blobUrl = URL.createObjectURL(data.content);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
              if (!this.masterService.ShowMore) {
                this.masterService.ShowMore = true;
              }
              // setTimeout(()=>{this.masterService.focusAnyControl("customerselectid")},100)
              this.masterService.focusAnyControl("customerselectid");

            }
          },
          (error) => {
            this.alertService.error(error._body);
            this.loadingService.hide();
          }
        );
      return;

    }
    else if (this.userProfile.PrintMode == 10) {
      //rdlc report format
      this.loadingService.show("Downloading Sample. Please Wait...");

      this.masterService.downloadRdlcPdf([{
        filename: "taxinvoicesample.rdlc", parameter:
        {
          vchrno: this._trnMainService.TrnMainObj.VCHRNO,
          division: this._trnMainService.TrnMainObj.DIVISION,
          physicalid: this._trnMainService.TrnMainObj.PhiscalID,
          Title: "TAX INVOICE",
          printType: "kw"
        }
      }], '/PDF', 'TaxInvoice')
        .subscribe(
          (data: any) => {
            this.loadingService.hide();
            // this.masterService.downloadFile(data);
            const blobUrl = URL.createObjectURL(data.content);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
              if (!this.masterService.ShowMore) {
                this.masterService.ShowMore = true;
              }
              // setTimeout(()=>{this.masterService.focusAnyControl("customerselectid")},100)
              this.masterService.focusAnyControl("customerselectid");

            }
          },
          (error) => {
            this.alertService.error(error._body);
            this.loadingService.hide();
          }
        );
      return;
    }
    else if (this.userProfile.PrintMode == 11) {
      //rdlc report format
      this.loadingService.show("Downloading Sample. Please Wait...");

      this.masterService.downloadRdlcPdf([{
        filename: "taxinvoicesample.rdlc", parameter:
        {
          vchrno: this._trnMainService.TrnMainObj.VCHRNO,
          division: this._trnMainService.TrnMainObj.DIVISION,
          physicalid: this._trnMainService.TrnMainObj.PhiscalID,
          Title: "TAX INVOICE",
          printType: "itc"
        }
      }], '/PDF', 'TaxInvoice')
        .subscribe(
          (data: any) => {
            this.loadingService.hide();
            // this.masterService.downloadFile(data);
            const blobUrl = URL.createObjectURL(data.content);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
              if (!this.masterService.ShowMore) {
                this.masterService.ShowMore = true;
              }
              // setTimeout(()=>{this.masterService.focusAnyControl("customerselectid")},100)
              this.masterService.focusAnyControl("customerselectid");

            }
          },
          (error) => {
            this.alertService.error(error._body);
            this.loadingService.hide();
          }
        );
      return;
    }
    else if (this.userProfile.PrintMode == 21) {
      //rdlc report format
      this.loadingService.show("Downloading Sample. Please Wait...");

      this.masterService.downloadRdlcPdf([{
        filename: "taxinvoicesample.rdlc", parameter:
        {
          vchrno: this._trnMainService.TrnMainObj.VCHRNO,
          division: this._trnMainService.TrnMainObj.DIVISION,
          physicalid: this._trnMainService.TrnMainObj.PhiscalID,
          Title: "TAX INVOICE",
          printType: "gt"
        }
      }], '/PDF', 'TaxInvoice')
        .subscribe(
          (data: any) => {
            this.loadingService.hide();
            // this.masterService.downloadFile(data);
            const blobUrl = URL.createObjectURL(data.content);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
              if (!this.masterService.ShowMore) {
                this.masterService.ShowMore = true;
              }
              // setTimeout(()=>{this.masterService.focusAnyControl("customerselectid")},100)
              this.masterService.focusAnyControl("customerselectid");

            }
          },
          (error) => {
            this.alertService.error(error._body);
            this.loadingService.hide();
          }
        );
      return;
    }
    else if (this.userProfile.PrintMode == 1 || this.userProfile.PrintMode == 2 || this.userProfile.PrintMode == 3 || this.userProfile.PrintMode == 100) {
      this.loadingService.show("please wait. Getting invoice data ready for printing.")
      try {

        this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC, "", "", this._trnMainService.TrnMainObj.TRNMODE).subscribe((res) => {
          this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherType, this.activeurlpath, this.userProfile.PrintMode)
          this.loadingService.hide();
          if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            if (!this.masterService.ShowMore) {
              this.masterService.ShowMore = true;
            }
            this.masterService.focusAnyControl("customerselectid");
          }
        }, err => {
          this.alertService.error(err)

        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    }
    else if (this.userProfile.PrintMode == 13) {
      this.loadingService.show("please wait. Getting invoice data ready for printing.")
      try {

        this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC, "", "", this._trnMainService.TrnMainObj.TRNMODE).subscribe((res) => {
          this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherType, this.activeurlpath, this.userProfile.PrintMode)
          this.loadingService.hide();
          if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            if (!this.masterService.ShowMore) {
              this.masterService.ShowMore = true;
            }
            this.masterService.focusAnyControl("customerselectid");
          }
        }, err => {
          this.alertService.error(err)

        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    }
    else if (this.userProfile.PrintMode == 14) {
      this.loadingService.show("please wait. Getting invoice data ready for printing.")
      try {

        this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC, "", "", this._trnMainService.TrnMainObj.TRNMODE).subscribe((res) => {
          this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherType, this.activeurlpath, this.userProfile.PrintMode)
          this.loadingService.hide();
          if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            if (!this.masterService.ShowMore) {
              this.masterService.ShowMore = true;
            }
            this.masterService.focusAnyControl("customerselectid");
          }
        }, err => {
          this.alertService.error(err)

        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    }
    else if (this.userProfile.PrintMode == 12) {
      this.loadingService.show("please wait. Getting invoice data ready for printing.")
      try {

        this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC, "", "", this._trnMainService.TrnMainObj.TRNMODE).subscribe((res) => {
          this.invoicePrint.printInvoice(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherType, this.activeurlpath, this.userProfile.PrintMode)
          this.loadingService.hide();
          if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            if (!this.masterService.ShowMore) {
              this.masterService.ShowMore = true;
            }
            this.masterService.focusAnyControl("customerselectid");
          }
        }, err => {
          this.alertService.error(err)

        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    }
    else if (this.userProfile.PrintMode == 20) {
      this.loadingService.show("please wait. Getting invoice data ready for printing.")
      try {

        this.masterService.download3mmsalesinvoicepdf(this._trnMainService.TrnMainObj.VCHRNO).subscribe((res) => {

          this.invoicePrint.printInvoice(res.result, null, this._trnMainService.TrnMainObj.VoucherType, this.activeurlpath, this.userProfile.PrintMode)
          this.loadingService.hide();

        }, err => {
          this.alertService.error(err)

        })
      } catch (ex) {
        this.alertService.error(ex)
      }
    }
    //for 3 inch printer
    else {
      try {

        this.masterService.getReprintData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.TRNUSER, this._trnMainService.TrnMainObj.VoucherAbbName, this._trnMainService.posPrintCount, this.userProfile.PrintMode).subscribe((res) => {
          this._trnMainService.TrnMainObj.printStringForPos = res.result
          this.userProfile.TotalPrint = this._trnMainService.posPrintCount;
          this.authService.setSessionVariable('USER_PROFILE', this.userProfile);
          if (this.AppSettings.ShowPrintPreview) {
            this.showPosPrinterPreview = true;
          } else {
            this.printPosBill();
          }
          if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            if (!this.masterService.ShowMore) {
              this.masterService.ShowMore = true;
            }
            this.masterService.focusAnyControl("customerselectid");
          }

        }, error => {
          this.alertService.error(error._body);
        })
      } catch (ex) {
        this.alertService.error(ex)
      }


    }

  }
  printerConfirm: boolean = false;
  checkDefaultPrinterAndConfirm() {
    try {
      let printerCode: number = null;
      let formPrinter: DeviceSetting = this.deviceSetting.filter(x => x.profileTypeLabel == this._trnMainService.formName && x.DefaultPrint == true)[0];
      if (formPrinter !== null) {
        this.printerConfirm = formPrinter.confirmShow;
        printerCode = this.initialisePrinter(formPrinter.profileNameValue);
      }
      else {
        printerCode = null;

      }
      return printerCode;
    }
    catch (error) {
    }
  }
  initialisePrinter(printName: string) {
    let printerValue: number;
    switch (printName) {
      case "[ALT+1]POS Printer [3mm]":
        printerValue = 0;
        break;
      case "POS Printer without GST [3mm]":
        printerValue = 5;
        break;
      case "POS Printer [2mm]":
        printerValue = 6;
        break;
      case "[ALT+2]Laser printer[A4]":
        printerValue = 1;
        break;
      case "[ALT+3]A5 print":
        printerValue = 2;
        break;
      case "[ALT+3]A5 print":
        printerValue = 2;
        break;
      case "Customized print":
        printerValue = 10;
        break;
      default:
        printerValue = null;
        break;
    }
    return printerValue;

  }
  defaultPrinter: number;
  onPrintClicked() {
    this.defaultPrinter = this.checkDefaultPrinterAndConfirm();
    let printermode = this.AppSettings.printerMode;
    this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(x => x.MENUCODE != null && x.MENUCODE != "")
    if (this._trnMainService.TrnMainObj.ProdList.length > 0) {
      if (this._trnMainService.TrnMainObj.VoucherType == 14 && this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" && printermode == 1) {
        // this.setPrinterAndprint();
        this.sendToPrint();
      } else {
        if (this.defaultPrinter == null || this.defaultPrinter == undefined) {
          this.promptPrintDevice = true;
          return;
        }
        this.sendToPrint();
      }
    } else {
      this.alertService.warning("No voucher Found for Printing")
      this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType)
    }
  }

  initiateandPrepareBarcodePrint() {

    if (this._trnMainService.AppSettings.BarcodePrinter == 1 && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance) {
      this._trnMainService.trnMainForBarcodePrint = <TrnMain>{};
      this._trnMainService.trnMainForBarcodePrint = _.cloneDeep(this._trnMainService.TrnMainObj);
      this.enableBarcodePrintOption = true;
    }
  }

  sendToPrint() {
    this.initiateandPrepareBarcodePrint();

    if (this.printerConfirm) {
      if (confirm("Are you sure you want to print ?")) {
        this.setPrinterAndprint();
      }
      else {
        this.onReset();
        return;
      }
    }
    else {
      this.setPrinterAndprint();
    }

  }
  onItemDoubleClickFromQuotations(event) {
    this.masterService.masterGetmethod(`/GetPODataForSelectedQuotation?rfqno=${event.RFQNO}&supplieracid=${event.Supplieracid}`).subscribe(
      res => {
        if (res.status == "ok") {
          this._trnMainService.TrnMainObj.REFBILL = event.RFQNO
          this._trnMainService.TrnMainObj.ProdList = []
          var supplier = res.result.supplier
          this._trnMainService.TrnMainObj.BILLTO = supplier.ACNAME;
          this._trnMainService.TrnMainObj.PARAC = supplier.ACID
          this._trnMainService.TrnMainObj.TRNAC = supplier.ACID;
          this._trnMainService.TrnMainObj.BILLTOADD = supplier.ADDRESS;
          this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = supplier.PSTYPE == null ? null : supplier.PSTYPE.toLowerCase();
          this._trnMainService.TrnMainObj.TRNMODE = supplier.PMODE;
          this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = supplier.GEO;
          this._trnMainService.TrnMainObj.PARTY_GSTTYPE = supplier.GSTTYPE;
          if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder && this._trnMainService.AppSettings.enableSupplierWiseTermsAndConditionInPO) {
            this._trnMainService.TrnMainObj.AdditionalObj.T_AND_C = supplier.REMARKS;
          }
          this._trnMainService.TrnMainObj.CREDITDAYS = supplier.CRPERIOD;
          this._trnMainService.TrnMainObj.AdditionalObj.CREDITDAYS = supplier.CRPERIOD;
          if (res.result.PoFromQuotation.length > 0) {
            var i = 0, j = 0, k = 0, l = 0;
            for (var q of res.result.PoFromQuotation) {
              var p = q.ProductDetailsQ
              this._trnMainService.TrnMainObj.ProdList.push(<TrnProd>{});
              this._trnMainService.TrnMainObj.ProdList[i].MENUCODE = p.Mcode
              this._trnMainService.TrnMainObj.ProdList[i].MCODE = p.Mcode
              this._trnMainService.TrnMainObj.ProdList[i].ITEMDESC = p.ItemName
              this._trnMainService.TrnMainObj.ProdList[i].Quantity = p.Quantity
              this._trnMainService.TrnMainObj.ProdList[i].RATE = p.ItemRate
              this._trnMainService.TrnMainObj.ProdList[i].PRATE = p.ItemRate
              this._trnMainService.TrnMainObj.ProdList[i].ALTRATE = p.ItemRate
              this._trnMainService.TrnMainObj.ProdList[i].ALTUNIT = p.AltUnit
              this._trnMainService.TrnMainObj.ProdList[i].Product = <any>{};
              this._trnMainService.TrnMainObj.ProdList[i].Product.MCODE = p.Mcode
              this._trnMainService.TrnMainObj.ProdList[i].Product.AlternateUnits = q.AlternamteUnits
              this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj = q.AlternamteUnits.filter(x => x.ALTUNIT == p.AltUnit)[0];
              this._trnMainService.TrnMainObj.ProdList[i].NETAMOUNT = p.NetAmount
              this._trnMainService.TrnMainObj.ProdList[i].AMOUNT = p.NetAmount
              this._trnMainService.TrnMainObj.ProdList[i].MRP = q.ProductDetails.MRP
              this._trnMainService.TrnMainObj.ProdList[i].ALTMRP = q.ProductDetails.MRP
              this._trnMainService.TrnMainObj.ProdList[i].GSTRATE = q.ProductDetails.GST
              this._trnMainService.TrnMainObj.ProdList[i].VAT = (this._trnMainService.TrnMainObj.ProdList[i].GSTRATE) * (p.ItemRate * p.Quantity) / 100

              // if (p.CONFACTOR.toLowerCase() == 'carton') {
              //   this._trnMainService.TrnMainObj.ProdList[i].CARTONCONFACTOR = .CONFACTOR
              // }
              // else {
              this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR = q.ProductDetails.CONFACTOR
              //}
              i += 1;
            }
          }
          else {
            this.alertService.error("NO Item")
          }
        }
        else {
          this.alertService.error(res.message)
        }
      }
    );

  }

  DATE: DatePipe;


  // printBarcode() {
  //   let bc = new BarCodeComponent(this.masterService, this._trnMainService, this.alertService, this.authService, this.loadingService);
  //   let bcList = [];
  //   let itemDetails = []
  //   this._trnMainService.trnMainForBarcodePrint.ProdList.forEach(x => {
  //     bcList.push(x.BC);
  //     itemDetails.push({
  //       Code: x.MCODE,
  //       Item: x.ITEMDESC,
  //       Batch: x.BATCH,
  //       Rate: x.REALRATE,
  //       PrintedQTY: this.masterService.nullToZeroConverter(x.REALQTY_IN) * this.masterService.nullToZeroConverter(this._trnMainService.trnMainForBarcodePrint.BARCODEPRINTMULTIPLIER),
  //       ExpDate: x.EXPDATE,
  //       MRP: x.MRP
  //     })
  //   });

  //   bc.print(bcList, itemDetails, 1);
  //   return;
  // }


  printPosBill() {
    this.showPosPrinterPreview = false
    var ws;
    ws = new WebSocket('ws://127.0.0.1:1660');
    ws.addEventListener('message', ws_recv, false);
    ws.addEventListener('open', ws_open(this._trnMainService.TrnMainObj.printStringForPos), false);
    function ws_open(text) {
      ws.onopen = () => ws.send(text)
    }

    function ws_recv(e) {

    }
    this._trnMainService.TrnMainObj.VoucherType = this._trnMainService.TrnMainObj.VoucherType == 61 ? 14 : this._trnMainService.TrnMainObj.VoucherType
    this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
  }


  loyalty() {
    // this.UsingRange =null;
    // let currentBill = this._trnMainService.TrnMainObj.NETAMNT;

    // this.masterService.masterGetmethod('/getAllLoyalty').subscribe(
    //   (res) => {
    //     this.loadingService.hide();
    //     if (res.result != null) {
    //       this.UsingLoyalty = res.result.filter(
    //         x => x.STATUS == true)[0];
    //     }
    //     if (this.UsingLoyalty != null && this.UsingLoyalty.RANGE != null) {
    //       this.UsingLoyalty.RANGE.forEach(x => {
    //         if (x.MINAMNT <= currentBill && x.MAXAMNT >= currentBill) {
    //           this.UsingRange = x;
    //           
    //         }
    //       });
    //     }
    //     if (this.UsingLoyalty == null) {
    //       
    //       return;
    //     }
    //     if(this.UsingRange == null){
    //       this.alertService.error("Bill amount is out of range of loyalty. Please update your loyalty so as to include this bill amount also.")
    //       return;
    //     }
    //     this._trnMainService.TrnMainObj.LCODE = this.UsingLoyalty.LCODE;
    //     this._trnMainService.TrnMainObj.CurrentBillLoyatly = (currentBill / this.UsingRange.INCREMENTALVALUE) * this.UsingRange.EARNPOINTS;
    //     this._trnMainService.TrnMainObj.CustomerLoyalty = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY) + this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CurrentBillLoyatly);
    //     if(this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY)< this.UsingLoyalty.MINREDEEMAMNT){
    //       this._trnMainService.TrnMainObj.loyaltyunredeemable = true;
    //     } else {
    //       this._trnMainService.TrnMainObj.loyaltyunredeemable = false;
    //     }

    //   },
    //   (error) => {
    //   }
    // );




    this.masterService.masterGetmethod_NEW("/getLoyalityInfoForCurrentBill?parac=" + this._trnMainService.TrnMainObj.PARAC + "&billamount=" + this._trnMainService.TrnMainObj.NETAMNT).subscribe((res) => {
      if (res.status == "ok") {
        this._trnMainService.TrnMainObj.CurrentBillLoyatly = res.result.currentBillLoyalty;
        let MINREDEEMAMNT = this.masterService.nullToZeroConverter(res.result.minRedeemAmnt);
        this._trnMainService.TrnMainObj.loyaltyunredeemable = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY) < MINREDEEMAMNT;
      } else {
        this.alertService.error("Error on getting current bill loyality:" + res.result);
      }



      // this.UsingRange = null;
      // let currentBill = this._trnMainService.TrnMainObj.NETAMNT;
      // this.masterService.masterGetmethod('/getAllLoyalty').subscribe(
      //   (res) => {
      //     this.loadingService.hide();
      //     if (res.result != null) {
      //       this.UsingLoyalty = res.result.filter(
      //         x => x.STATUS == true)[0];
      //     }
      //     if (this.UsingLoyalty != null && this.UsingLoyalty.RANGE != null) {
      //       this.UsingLoyalty.RANGE.forEach(x => {
      //         if (x.MINAMNT <= currentBill && x.MAXAMNT >= currentBill) {
      //           this.UsingRange = x;
      //         }
      //       });
      //     }
      //     if (this.UsingLoyalty == null) {
      //       this.alertService.error("NO Loyalty Calculation Information Available.")
      //       return;
      //     }
      //     if (this.UsingRange == null) {
      //       this.alertService.error("Bill amount is out of range of loyalty. Please update your loyalty so as to include this bill amount also.")
      //       return;
      //     }
      //     this._trnMainService.TrnMainObj.LCODE = this.UsingLoyalty.LCODE;
      //     this._trnMainService.TrnMainObj.CurrentBillLoyatly = (currentBill / this.UsingRange.INCREMENTALVALUE) * this.UsingRange.EARNPOINTS;
      //     this._trnMainService.TrnMainObj.CustomerLoyalty = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY) + this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CurrentBillLoyatly);
      //     if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY) < this.UsingLoyalty.MINREDEEMAMNT) {
      //       this._trnMainService.TrnMainObj.loyaltyunredeemable = true;
      //     } else {
      //       this._trnMainService.TrnMainObj.loyaltyunredeemable = false;
      //     }
      //     //  
      //     //    
      //   },
      //   (error) => {

    }, error => {
      this.alertService.error("Error on getting loyality:" + error);
    })
  }

  onSaveClicked() {
    try {
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {

      }
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        this.loyalty();
      }

      //if(this._trnMainService.getVoucherNumber()==)
      if (this.validationOnSaveBeforeTender() == false) {
        //  if (this._trnMainService.TrnMainObj.PARAC != null)
        return;
      }
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.RFQ) {
        this.onSaveClickedEmitted.emit();
        return;
      }
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice) {
        this.onSaveClickedEmitted.emit();
        return;
      }

      if (this._trnMainService.TrnMainObj.Mode == "CANCEL" && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferInCancel)) {
        this.onInterCompanyTransferInCancelSave.emit();
        return;
      }
      if (this._trnMainService.TrnMainObj.Mode == "CANCEL" && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOutCancel)) {
        this.onInterCompanyTransferOutCancelSave.emit();
        return;
      }


      if (this.validationOnSaveBeforeTender() == false) {
        return;
      }

      //for customer category wise item discount tracking
      this._trnMainService.TrnMainObj.TRNSCHEMEAPPLIED = [];
      this._trnMainService.TrnMainObj.ProdList.forEach(prod => {
        if (prod.TRNSCHEMEAPPLIED && prod.TRNSCHEMEAPPLIED.length) {
          for (var x of prod.TRNSCHEMEAPPLIED) {
            this._trnMainService.TrnMainObj.TRNSCHEMEAPPLIED.push(x);

          }
        }
      });
      //Offer calculation check
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        let itemCodeList = [];
        this._trnMainService.TrnMainObj.ProdList.forEach(x => { itemCodeList.push(x.MCODE) });
        this.masterService.getListOfAnyFromPostmethod("/getSchemeAppliedOnItemOnBilling", { customerID: this._trnMainService.TrnMainObj.PARAC, mcodes: itemCodeList, billamount: this._trnMainService.TrnMainObj.NETAMNT }).
          subscribe(res => {
            this._trnMainService.TrnMainObj.offerList = res ? res.schemeList : [];
            if (this._trnMainService.TrnMainObj.offerList != null && this._trnMainService.TrnMainObj.offerList.length > 0) {
              //populating category for categoruwsie scheme only of non matrix item
              if (res.itemscategory != null && res.itemscategory.length > 0) {
                for (var p of this._trnMainService.TrnMainObj.ProdList) {
                  p.categorys = res.itemscategory.filter(b => b.mcode == p.MCODE);
                }
              }
              if (this.AppSettings.AUTOSCHEME == false) {
                this._trnMainService.showSchemeOffer = true;
              }
              else {
                //billOffercheck
                this._trnMainService.TrnMainObj.billOfferOnlyForHold = null;
                let billOff = this._trnMainService.TrnMainObj.offerList.filter(x => x.schemeType == 'byslabbilldiscount' && x.isSelected == true);
                if (billOff != null && billOff.length > 0) {
                  for (var s of billOff) {
                    if (this._trnMainService.TrnMainObj.NETAMNT >= s.greaterThan && this._trnMainService.TrnMainObj.NETAMNT <= s.lessThan) {
                      this._trnMainService.TrnMainObj.billOfferOnlyForHold = s;
                    }
                  }
                }

                for (var p of this._trnMainService.TrnMainObj.ProdList) {
                  p.AllSchemeOffer = null;//removing previous scheme
                  p.AllSchemeOffer = this._trnMainService.TrnMainObj.offerList.filter(x => (x.mcode == p.MCODE && (x.disItemCode == '' || x.disItemCode == null)) && x.isSelected == true);
                }
                //looping for discount on another item check
                for (var p of this._trnMainService.TrnMainObj.ProdList) {
                  let anotherItemOffers = this._trnMainService.TrnMainObj.offerList.filter(x => x.disItemCode == p.MCODE && x.disItemCode != '' && x.disItemCode != null && x.isSelected == true);
                  for (var o of anotherItemOffers) {
                    if (p.AllSchemeOffer == null) { p.AllSchemeOffer = [] }
                    p.AllSchemeOffer.push(o);
                  }
                }
                this._trnMainService.ReCalculateBillWithNormal();
                this.validationAndSubmitAfterCalculation();

              }
            } else {
              this.validationAndSubmitAfterCalculation();

            }
          }, error => {
            this.alertService.error(error);
            return;
          });
      }
      else {

        this.validationAndSubmitAfterCalculation();
      }




      if (this._trnMainService.TrnMainObj.PARAC != null || this._trnMainService.TrnMainObj.PARAC != undefined) {
        this.getUnuseCouponListbyACID();

      }
    }
    catch (err) {
    }
  }

  getUnuseCouponListbyACID() {
    this._trnMainService.UserCouponList = null;
    this.masterService.masterGetmethod(`/getUnuseCouponListbyACID?userID=${this._trnMainService.TrnMainObj.PARAC}`).subscribe(res => {
      if (res.status == "ok") {
        this._trnMainService.UserCouponList = res.result;
      }
    });
  }

  onSchemeApplyEmitted(event) {
    if (event == "apply") {
      //billOffercheck
      this._trnMainService.TrnMainObj.billOfferOnlyForHold = null;
      let billOff = this._trnMainService.TrnMainObj.offerList.filter(x => x.schemeType == 'byslabbilldiscount' && x.isSelected == true);
      if (billOff != null && billOff.length > 0) {
        for (var s of billOff) {
          if (this._trnMainService.TrnMainObj.NETAMNT >= s.greaterThan && this._trnMainService.TrnMainObj.NETAMNT <= s.lessThan) {
            this._trnMainService.TrnMainObj.billOfferOnlyForHold = s;
          }
        }
      }

      for (var p of this._trnMainService.TrnMainObj.ProdList) {
        p.AllSchemeOffer = null;//removing previous scheme
        p.AllSchemeOffer = this._trnMainService.TrnMainObj.offerList.filter(x => (x.mcode == p.MCODE && (x.disItemCode == '' || x.disItemCode == null)) && x.isSelected == true);
      }
      //looping for discount on another item check
      for (var p of this._trnMainService.TrnMainObj.ProdList) {
        let anotherItemOffers = this._trnMainService.TrnMainObj.offerList.filter(x => x.disItemCode == p.MCODE && x.disItemCode != '' && x.disItemCode != null && x.isSelected == true);
        for (var o of anotherItemOffers) {
          if (p.AllSchemeOffer == null) { p.AllSchemeOffer = [] }
          p.AllSchemeOffer.push(o);
        }
      }
      this._trnMainService.ReCalculateBillWithNormal();
    }
    this.validationAndSubmitAfterCalculation();
  }

  validationOnSaveBeforeTender() {
    let user = this._trnMainService.userProfile;
    if (user.username != "Admin" && user.username != "patanjali_user") {
      if (!(this.authService.checkMenuRight(this.activeurlpath, "add"))) {
        this.alertService.error("You are not authorized for this operation.");
        return false;
      }
    }


    /**
     * Billing Lock Implementations
     * First Check Whether to Implement this validation from setting. Block Billing for all users except SUPERADMIN
     */

    if (this._trnMainService.AppSettings.ENABLEBILLLOCKING) {
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        if (this._trnMainService.TrnMainObj.BILLINGSTATUS && this._trnMainService.TrnMainObj.BILLINGSTATUS.toUpperCase() == "FALSE") {
          // this.alertService.error(`BILLING HAS BEEN LOCKED FOR THIS CUSTOMER ${this._trnMainService.TrnMainObj.BILLTO}`);
          if (confirm("Billing Has Been locked.Do You wish To Proceed?")) {
            this._trnMainService.TrnMainObj.ISREMARKSCOMPULSORY = true;
          } else {
            this._trnMainService.TrnMainObj.ISREMARKSCOMPULSORY = false;
            return false;
          }
        }
      }
    }

    //emit event for saving when clicked on save in Repacking Form

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Repack) {
      this.onSaveClickedEmitted.emit(true);
      return false;
    }

    if (this._trnMainService.TrnMainObj.TRNMODE != null && this._trnMainService.TrnMainObj.TRNMODE != undefined) {
      if ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms" ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck")
        && this._trnMainService.TrnMainObj.TRNMODE.toLowerCase() == "samridhicard" &&
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.userProfile.username.toLowerCase() != "patanjali_user") {
        this.alertService.warning("You cannot cancel this bill.Payment is made through Samridhi Card");
        return false;
      }
    }

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel) {
      if (!confirm(`Are You sure to cancel this voucher?`)) {
        return false;
      }
    }

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNoteCancel) {
      if (!confirm(`Are You sure to cancel this voucher?`)) {
        return false;
      }
    }

    if (this._trnMainService.TrnMainObj.Mode == "CANCEL" && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseReturnCancel) {
      this.onPurchaseReturnCancelSave.emit();
      return false;
    }



    this._trnMainService.MergeSameItemWithSameBatchOfProd();

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
      if (moment(this._trnMainService.TrnMainObj.TRN_DATE).isAfter(moment(), 'day')) {
        this.alertService.error("Future Invoice date detected.");
        return false;
      }
    }

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel) {
      if (this._trnMainService.TrnMainObj.REMARKS == null || this._trnMainService.TrnMainObj.REMARKS == "" || this._trnMainService.TrnMainObj.REMARKS == undefined) {
        this.alertService.info("Remarks is required...");
        return false;
      }
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
      if (this._trnMainService.TrnMainObj.TRNMODE == "cash") {
        let cashac = this.AppSettings.CashAc;
        if (cashac == null || cashac == "") { }
        else {
          this._trnMainService.TrnMainObj.TRNAC = this.AppSettings.CashAc;
        }
      }
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
      let party = "";
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
        party = "Supplier";
      }
      else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
        party = "Customer";
      }
      else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice) {
        party = "Customer";
      }
      if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
        this.alertService.info("Please Choose " + party + " to proceed...");
        return false;
      }
    }

    return true;
  }

  validationAndSubmitAfterCalculation() {
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      if (this.AppSettings.CompanyNature == 1 && this.AppSettings.enableTranOfScheduledNarcoticDrugWithLicenseOnly == 0) {


        for (var x of this._trnMainService.TrnMainObj.ProdList) {
          if (((x.GENERIC == null ? "" : x.GENERIC).toLowerCase() == "h1drug" ||
            (x.GENERIC == null ? "" : x.GENERIC).toLowerCase() == "hdrug" ||
            (x.GENERIC == null ? "" : x.GENERIC).toLowerCase() == "narcotic")) {
            if (this.masterService.isValidString(this._trnMainService.userProfile.CompanyInfo.DLNO1) == false &&
              this.masterService.isValidString(this._trnMainService.userProfile.CompanyInfo.DLNO2) == false &&
              this.masterService.isValidString(this._trnMainService.userProfile.CompanyInfo.DLNO3) == false &&
              this.masterService.isValidString(this._trnMainService.userProfile.CompanyInfo.DLNO4) == false) {
              this.alertService.error(`You are not authorised to ${this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ? 'Purchase' : 'Sell'} ${x.ITEMDESC}/ (${x.MENUCODE}) without Drug license number.`);
              return;
            }

            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
              if (
                this.masterService.isValidString(this._trnMainService.TrnMainObj.DLNO1) == false &&
                this.masterService.isValidString(this._trnMainService.TrnMainObj.DLNO2) == false &&
                this.masterService.isValidString(this._trnMainService.TrnMainObj.DLNO3) == false &&
                this.masterService.isValidString(this._trnMainService.TrnMainObj.DLNO4) == false
              ) {
                this.alertService.error(`You cannot sell ${x.ITEMDESC}/ (${x.MENUCODE}) to customer ${this._trnMainService.TrnMainObj.BILLTO} without Drug license number.`);
                return;
              }
            }



          }
        }

      }
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superstockist"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "substockist"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ssa"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "zcp") {

      }
      else {
        if (this.AppSettings.CompanyNature == 1) {
          if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            let h1Drug = this._trnMainService.TrnMainObj.ProdList.filter(prod => prod.MENUCODE).some(x => ((x.GENERIC == null ? "" : x.GENERIC).toLowerCase() == "h1drug" || (x.GENERIC == null ? "" : x.GENERIC).toLowerCase() == "hdrug" || (x.GENERIC == null ? "" : x.GENERIC).toLowerCase() == "narcotic"));
            if (h1Drug && (this._trnMainService.TrnMainObj.AdditionalObj.DOCTOR == null || this._trnMainService.TrnMainObj.AdditionalObj.DOCTOR == "" || this._trnMainService.TrnMainObj.AdditionalObj.DOCTOR == undefined)) {
              this.alertService.error("Doctor is required For H1 Drug.");
              return;
            }
          }




        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.ENABLELOYALTY) {
          this.loyalty();
        }
        this.genericTender.show();
        setTimeout(() => {
          this.masterService.focusAnyControl("CASHTENDER");
        }, 500);

        return;
      }
    }
    if (this._trnMainService.TrnMainObj.TRNMODE != null && this._trnMainService.TrnMainObj.TRNMODE != undefined) {

      if (this._trnMainService.TrnMainObj.TRNMODE.toUpperCase() == "CREDIT") {

        this._trnMainService.TrnMainObj.TRNAC = this._trnMainService.TrnMainObj.PARAC
      }

    }
    if (!this.transactionValidator()) { return; }


    //for bill tracking
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
      if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.TrnMainObj.BALANCE < 0) || (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase && this._trnMainService.TrnMainObj.BALANCE > 0)) {
        this._trnMainService.TrnMainObj.AdvanceAdjustmentObj = <any>{};
        this._trnMainService.TrnMainObj.AdvanceAdjustmentObj.AdjustmentType = "full";
        this.showAdvanceAdjustmentPopUp = true;
        return;
      }
    }
    if (this._trnMainService.TrnMainObj.Mode == "NEW" && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder && this.authService.getSetting().enableAdvanceOptionInSalesOrder) {
      this.showAdvancePopUpForSalesOrder = true;
      return;
    }
    this.onSubmit()
  }
  onSaveReceiptNoteClicked() {
    let user = this._trnMainService.userProfile;
    if (user.username != "Admin" && user.username != "patanjali_user") {
      if (!(this.authService.checkMenuRight(this.activeurlpath, "add"))) {
        this.alertService.error("You are not authorized for this operation.");
        return;
      }
    }
    if (this._trnMainService.TrnMainObj.TRNMODE != null && this._trnMainService.TrnMainObj.TRNMODE != undefined) {
      if ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms" ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck")
        && this._trnMainService.TrnMainObj.TRNMODE.toLowerCase() == "samridhicard" &&
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.userProfile.username.toLowerCase() != "patanjali_user") {
        this.alertService.warning("You cannot cancel this bill.Payment is made through Samridhi Card");
        return;
      }
    }

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel) {
      if (!confirm(`Are You sure to cancel this voucher?`)) {
        return;
      }
    }





    if (this._trnMainService.TrnMainObj.Mode == "CANCEL" && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseReturnCancel) {
      this.onPurchaseReturnCancelSave.emit();
      return;
    }


    this._trnMainService.MergeSameItemWithSameBatchOfProd();

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
      if (moment(this._trnMainService.TrnMainObj.TRN_DATE).isAfter(moment(), 'day')) {
        this.alertService.error("Future Invoice date detected.");
        return;
      }
    }

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel) {
      if (this._trnMainService.TrnMainObj.REMARKS == null || this._trnMainService.TrnMainObj.REMARKS == "" || this._trnMainService.TrnMainObj.REMARKS == undefined) {
        this.alertService.info("Remarks is required...");
        return;
      }
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
      if (this._trnMainService.TrnMainObj.TRNMODE == "cash") {
        let cashac = this.AppSettings.CashAc;
        if (cashac == null || cashac == "") { }
        else {
          this._trnMainService.TrnMainObj.TRNAC = this.AppSettings.CashAc;
        }
      }
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
      let party = "";
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
        party = "Supplier";
      }
      else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
        party = "Customer";
      }
      if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
        this.alertService.info("Please Choose " + party + " to proceed...");
        return;
      }
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
    ) {
      if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superstockist"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "substockist"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ssa"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "zcp") {

      }
      else {

        this.genericTender.show();
        setTimeout(() => {
          this.masterService.focusAnyControl("CASHTENDER");
        }, 500);

        return;
      }
    }
    if (this._trnMainService.TrnMainObj.TRNMODE != null && this._trnMainService.TrnMainObj.TRNMODE != undefined) {

      if (this._trnMainService.TrnMainObj.TRNMODE.toUpperCase() == "CREDIT") {

        this._trnMainService.TrnMainObj.TRNAC = this._trnMainService.TrnMainObj.PARAC
      }

    }
    if (!this.transactionValidator()) { return; }
    // }

    //for bill tracking
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
      if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.TrnMainObj.BALANCE < 0) || (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase && this._trnMainService.TrnMainObj.BALANCE > 0)) {
        this._trnMainService.TrnMainObj.AdvanceAdjustmentObj = <any>{};
        this._trnMainService.TrnMainObj.AdvanceAdjustmentObj.AdjustmentType = "full";
        this.showAdvanceAdjustmentPopUp = true;
        return;
      }
    }
    this.onSubmit()
  }
  transactionValidator(): boolean {
    if (this._trnMainService.TrnMainObj.ProdList.length == 0) {
      this.alertService.warning("No Valid entries found for saving.Please pass valid entried");
      return false;
    }
    this.removeInvalidRowsFromprod();
    if (!this.emptyBatchValidation()) return false;

    if (!this._trnMainService.checkTransactionValidation()) {
      if (this.genericTender != null) { this.genericTender.hide(); } return false;
    }

    if (!this._trnMainService.setDefaultValueInTransaction()) { return false; }
    return true;
  }

  onSubmit() {

    if (this.activeurlpath == 'add-debitnote-itembase' || this.activeurlpath == 'add-creditnote-itembase') {
      if (this._trnMainService.TrnMainObj.REFBILL == null || this._trnMainService.TrnMainObj.REFBILL == "") {
        this.alertService.info("Please enter the ref bill for return");
        return
      }
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && (this._trnMainService.TrnMainObj.REFBILLDATE != null && this._trnMainService.TrnMainObj.REFBILLDATE != "" && this._trnMainService.TrnMainObj.REFBILLDATE != undefined)) {
      this._trnMainService.TrnMainObj.TRN_DATE = this.masterService.changeIMsDateToDate(this._trnMainService.TrnMainObj.REFBILLDATE);
    }


    if (this.activeurlpath == 'StockSettlementEntry') {
      if (this._trnMainService.TrnMainObj.Mode != "NEW") {
        this.alertService.warning("You are in View Mode can not be saved...");
        return;
      }
      this.masterService.saveStockSettlement(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj).subscribe(data => {
        if (data.status == 'ok') {

          this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
        } else {
          this.alertService.error(data.result._body);
        }
      })
    }
    else if (this.activeurlpath == "StockSettlementEntryApproval") {
      this.stockSettlementApprove();
      return;
    }
    else {
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        if (this._trnMainService.TrnMainObj.TransporterEway != null) {
          this._trnMainService.TrnMainObj.TransporterEway.TOTALWEIGHT = this._trnMainService.TrnMainObj.TOTALWEIGHT;
        }
      }
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel) {
        this._trnMainService.TrnMainObj.Mode = 'NEW';
      }
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNoteCancel) {
        this._trnMainService.TrnMainObj.Mode = 'NEW';
        this._trnMainService.TrnMainObj.VoucherPrefix = "RT";
      }
      let userProfile = this.authService.getUserProfile();

      if (this._trnMainService.TrnMainObj.VoucherType == 3) {
        if (this.AppSettings.PoNumberMandatoryFlag == 1) {
          if (this._trnMainService.TrnMainObj.REFORDBILL == "" || this._trnMainService.TrnMainObj.REFORDBILL == null || this._trnMainService.TrnMainObj.REFORDBILL == undefined) {
            this.alertService.warning("PO Number is required.")
            return;
          }
        }
      }

      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
        if (this._trnMainService.TrnMainObj.REFBILL == "" || this._trnMainService.TrnMainObj.REFBILL == null || this._trnMainService.TrnMainObj.REFBILL == undefined) {
          this.alertService.warning("Invoice Number is required.")
          return;
        } else if (this._trnMainService.TrnMainObj.InvAmount == null || this._trnMainService.TrnMainObj.InvAmount == undefined) {
          this.alertService.warning("Please enter invoice amount.");
          return;
        }
      }


      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
        if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.InvAmount) != this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.NETAMNT)) {
          if (confirm(`Invoice Amount doesn't match your bill amount.\nDo you want to proceed?`)) {

          } else {
            return;
          }
        }
      }
      this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj, null)
        .subscribe(data => {
          if (data.status == 'ok') {
            this._trnMainService.TrnMainObj.VCHRNO = data.savedvchrno;
            this._trnMainService.TrnMainObj.PhiscalID = userProfile.CompanyInfo.PhiscalID;
            this._trnMainService.TrnMainObj.TRNUSER = userProfile.username;
            if (data.savedvchrno != null) {
              this._trnMainService.TrnMainObj.VCHRNO = data.savedvchrno;
            }
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
              try {
                if (this.genericTender) {
                  this.genericTender.initialiseTenderMode();
                }
                let vchrno = "TI";
                let parac = this._trnMainService.TrnMainObj.PARAC;
                this.masterService.getInvoiceData(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.DIVISION, this._trnMainService.TrnMainObj.PhiscalID, this._trnMainService.TrnMainObj.PARAC)
                  .subscribe((res) => {

                    let printHtmlString = this.invoicePrint.getprintHtlmString(res.result, res.result2, this._trnMainService.TrnMainObj.VoucherType, this.activeurlpath)
                    this.masterService.sendmail(printHtmlString, vchrno, parac).subscribe(res => { })
                  });
              } catch (error) { this.alertService.error("Couldnot send Email,detail:" + error); }
            }
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {

              if (data != null && data.result2 != null && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME != null) {
                this._trnMainService.TrnMainObj = data.result2;
                this._trnMainService.TrnMainObj = this._trnMainService.TrnMainObj;
                this._trnMainService.TrnMainObj.VoucherType = VoucherTypeEnum.TaxInvoice;
                const uuidV1 = require('uuid/v1');
                this._trnMainService.TrnMainObj.guid = uuidV1();

                for (let p in this._trnMainService.TrnMainObj.ProdList) {

                  this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[p].ProductRates, p, this._trnMainService.TrnMainObj.PARTY_ORG_TYPE, 0, this._trnMainService.TrnMainObj.ProdList[p].PRATE);
                  let rate1 = this._trnMainService.TrnMainObj.ProdList[p].ORIGINALTRANRATE;
                  let rate2 = this._trnMainService.TrnMainObj.ProdList[p].PRATE;
                  this._trnMainService.TrnMainObj.ProdList[p].ORIGINALTRANRATE = rate1;
                  this._trnMainService.TrnMainObj.ProdList[p].ALT_ORIGINALTRANRATE = rate1;
                  this._trnMainService.setunit(rate1, rate2, p, this._trnMainService.TrnMainObj.ProdList[p].ALTUNITObj);

                }

                this._trnMainService.ReCalculateBillWithNormal();
                setTimeout(() => {
                  this._trnMainService.TrnMainObj.hasShipName = true;
                }, 1000);
              }
              else {
                let printermode = this.AppSettings.printerMode;
                // if (this._trnMainService.TrnMainObj.VoucherType == 14 && this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" && printermode == 1) {
                //   this.setPrinterAndprint();
                // } else {
                this.onPrintClicked();
                // }


              }
            }
            else {
              if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOutCancel
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferInCancel
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOut
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferIn
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Sales
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder
                || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseReturn) {


                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.CompanyNature == 1) {
                  if (this._trnMainService.TrnMainObj.fileList && this._trnMainService.TrnMainObj.fileList != null) {
                    let fileformData: FormData = new FormData();
                    let file: File = this._trnMainService.TrnMainObj.fileList[0];
                    let filename = this._trnMainService.TrnMainObj.VCHRNO + "_" + this._trnMainService.TrnMainObj.AdditionalObj.DOCTORNAME + "_" + file.name
                    fileformData.append(`file`, file, filename);
                    this.fileImportService.uploadPrescription('/updateBillPrescription', fileformData, this._trnMainService.TrnMainObj.VCHRNO)
                      .subscribe(
                        res => {

                        },
                        error => {

                        }
                      );
                  }
                }
                this.onPrintClicked();


              } else {


                this.initiateandPrepareBarcodePrint();



                this._trnMainService.TrnMainObj.VoucherType = this._trnMainService.TrnMainObj.VoucherType == 61 ? 14 : this._trnMainService.TrnMainObj.VoucherType
                this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
                if (this.activeurlpath == 'add-creditnote-itembase') {
                  this._trnMainService.pageHeading = "Sales Return"
                }
                if (this.activeurlpath == 'add-debitnote-itembase') {
                  this._trnMainService.pageHeading = "Purchase Return"

                }
                if (this.activeurlpath == 'add-receipt-note') {
                  this._trnMainService.pageHeading = "Receipt Note"

                }
                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
                  if (!this.masterService.ShowMore) {
                    this.masterService.ShowMore = true;
                  }
                  this.masterService.focusAnyControl("customerselectid");
                }

              }

            }

          }
          else {
            if (data.result.status == 401) {
              this.dialog.open(LoginDialog, { disableClose: true });
            } else {
              this.alertService.error(data.result._body);
            }
          }
        }, error => {
          this.alertService.error(error.Message);
        })
    }



  }
  TaxInvoice: any;

  removeInvalidRowsFromprod() {
    this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.filter(
      x =>
        x.MCODE != null && x.MCODE != ""
    );

  }

  nullToZeroConverter(value) {
    if (value == undefined || value == null || value == "") {
      return 0;
    }
    return parseFloat(value);
  }

  ViewRfqSupplierHistory(event) {
    if (this._trnMainService.TrnMainObj.VoucherType == 114) {
      this.mode = 'View'
      this.ViewRfqSupplierHistry.emit(event);
      return;
    }
  }

  onItemDoubleClick(event) {
    if (this._trnMainService.TrnMainObj.VoucherType == 65 || this._trnMainService.TrnMainObj.VoucherType == 114) {
      this.mode = 'View'
      this.onVoucherDoubleClicked.emit(event);
      return;
    }
    if (this._trnMainService.TrnMainObj.ProdList != null && this._trnMainService.TrnMainObj.ProdList.length > 0) {
      let p = this._trnMainService.TrnMainObj.ProdList[0];
      if (p != null) {
        if (p.MCODE != null) {
          if (confirm("You are about to load the bill.Do you want to continue?")) {
            if (this._trnMainService.TrnMainObj.VoucherPrefix == "CN" || this._trnMainService.TrnMainObj.VoucherPrefix == "DN") {
              if (event.CNDN_MODE == 0) {
                this.loadVoucher(event, "VIEW");
              } else {
                this.alertService.warning(`Cannot Load Voucher!! The Voucher is ${event.VOUCHERREMARKS} based.`);
                return;
              }
            } else {

              this.loadVoucher(event, "VIEW");
              return;
            }
          }
          else {
            return;
          }
        }
      }
    }
    if (this._trnMainService.TrnMainObj.VoucherPrefix == "CN" || this._trnMainService.TrnMainObj.VoucherPrefix == "DN") {
      if (event.CNDN_MODE == 0) {
        this.loadVoucher(event, "VIEW");
      } else {
        this.alertService.warning(`Cannot Load Voucher!! The Voucher is ${event.VOUCHERREMARKS} based.`);
        return;
      }
    } else {

      this.loadVoucher(event, "VIEW");
    }

  }

  onLoadFromPerformaInvoice() {
    this.onLoadFromPerformaInvoiceClickEmit.emit(true);
  }
  onLoadFromDeliveryChallaan() {
    this.onLoadFromDeliveryChallaanClickEmit.emit(true);
  }
  onLoadRcvdDeliveryChallaan() {

    this.onLoadRcvdDeliveryChallaanClickEmit.emit(true);
  }

  onShowImport() {
    if (this._trnMainService.TrnMainObj.BILLTO == "" || this._trnMainService.TrnMainObj.BILLTO == null || this._trnMainService.TrnMainObj.BILLTO == undefined) {
      this.alertService.error("Please Select Supplier to proceed");
      return;
    }
    this.onShowFileUploadPopupEmit.emit(true);
  }

  onImportPurchaseInvoice() {
    this.onPInvoieFileUploadPopupEmit.emit(true);
  }
  onImportMatrixinputPurchaseInvoice() {
    this.onShowMatrixFileUploadPopupEmit.emit(true);
  }

  onImportMatrixinputOpeningStockEnrty() {
    this.onShowMatrixFileUploadPopupEmit.emit(true);
  }

  onImportAICODPurchaseInvoice() {
    this.onAICODPInvoieFileUploadPopupEmit.emit(true);
  }

  onImportPurchaseInvoiceReturn() {
    this.onPRnvoieFileUploadPopupEmit.emit(true);
  }

  onShowImportSO() {
    if (this._trnMainService.TrnMainObj.BILLTO == null || this._trnMainService.TrnMainObj.BILLTO == undefined || this._trnMainService.TrnMainObj.BILLTO == "") {
      this.alertService.info("Select Customer");
      return;
    }
    this.onShowFileUploadPopupEmit.emit(true);
  }
  onShowImportFromMobile() {

    this.onShowSalesOrderfromMobileEmit.emit(true);
  }

  loadVoucher(selectedItem, mode: string = "VIEW") {
    this._trnMainService.loadData(selectedItem.VCHRNO, selectedItem.DIVISION, selectedItem.PhiscalID, mode);
    this._trnMainService.showPerformaApproveReject = false;
  }

  onNewClick() {
    if (confirm("Are you sure to Reset the transaction? ")) {
      if (this._trnMainService.TrnMainObj.VoucherType == 65) {
        this._trnMainService.formName = "Quotation Invoice";
        this.onResetClicked.emit();
        return;
      }
      if (this._trnMainService.TrnMainObj.VoucherType == 114) {
        this._trnMainService.formName = "RFQ";
        this.onResetClicked.emit();
        return;
      }
      this._trnMainService.TrnMainObj.VoucherType = this._trnMainService.TrnMainObj.VoucherType == 61 ? 14 : this._trnMainService.TrnMainObj.VoucherType;
      this._trnMainService.TrnMainObj.VoucherType = this._trnMainService.TrnMainObj.VoucherType == 63 ? 15 : this._trnMainService.TrnMainObj.VoucherType;
      this._trnMainService.TrnMainObj.VoucherType = (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferInCancel) ? VoucherTypeEnum.InterCompanyTransferIn : this._trnMainService.TrnMainObj.VoucherType;
      this._trnMainService.TrnMainObj.VoucherType = (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOutCancel) ? VoucherTypeEnum.InterCompanyTransferOut : this._trnMainService.TrnMainObj.VoucherType;
      this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
      this._trnMainService.showPerformaApproveReject = false;

      if (this.showSupplier) {
        this.showSupplier = false;
      }
      if (this.activeurlpath == 'add-creditnote-itembase') {
        this._trnMainService.initialFormLoad(15);
        this._trnMainService.pageHeading = "Sales Return";
        this._trnMainService.TrnMainObj.VoucherPrefix = "CN";
        this._trnMainService.TrnMainObj.VoucherType = 15;
      } else if (this.activeurlpath == "add-debitnote-itembase") {
        this._trnMainService.pageHeading = "Purchase Return";
      }
      else if (this.activeurlpath == "add-receipt-note") {
        this._trnMainService.pageHeading = "Receipt Note";
        this._trnMainService.initialFormLoad(11);
      }
    }
    let userProfile = this._trnMainService.userProfile;
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && (userProfile.CompanyInfo.ORG_TYPE == "ak" || userProfile.CompanyInfo.ORG_TYPE == "ck" || userProfile.CompanyInfo.ORG_TYPE == "pms" || userProfile.CompanyInfo.ORG_TYPE == "gak" || userProfile.CompanyInfo.ORG_TYPE == "retailer")) {
      setTimeout(() => {
        this.masterService.focusAnyControl("customerselectid");
      }, 1500);
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      if (!this.masterService.ShowMore) {
        this.masterService.ShowMore = true;
      }
      this.masterService.focusAnyControl("customerselectid");
    }


  }

  ShowQuotations() {
    this.genericGridForFromQuotations.show()
  }

  onLoadSalesReturnCancel() {
    this.onSalesReturnCancel.emit(true);


  }

  onReset() {
    this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
    this._trnMainService.showPerformaApproveReject = false;
  }

  cancel() {

    if (this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP") {
      this.alertService.error("Cannot cancel Order Performa");
      return;
    }
    let user = this._trnMainService.userProfile;
    if (user.username != "Admin" && user.username != "patanjali_user") {
      if (!(this.authService.checkMenuRight(this.activeurlpath, "delete"))) {
        this.alertService.error("You are not authorized for this operation.");
        return;
      }
    }
    if (confirm(`Are you sure to cancel this invoice?`)) {
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturnCancel || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
        this.onCancelEmit.emit(true);
        return;
      }

      this.spinnerService.show("Processing Invoice Cancellation")
      this.masterService.cancelInvoice(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.VoucherPrefix).subscribe((res) => {
        if (res.status == "ok") {
          this.spinnerService.hide();
          this.alertService.success(res.result);
          this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
        }
      }, error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      })
    } else {
      return false;
    }
  }

  okClicked(value) {
    this._trnMainService.TrnMainObj.TenderList = value;
    let TB = this._trnMainService.TrnMainObj.TenderList[0];
    if (TB == null) { this.alertService.error("Tender Amount not detected"); return; }
    this._trnMainService.TrnMainObj.TRNAC = TB.ACCOUNT;
    if (this._trnMainService.TrnMainObj.TRNMODE.toUpperCase() == "CREDIT") {
      this._trnMainService.TrnMainObj.TRNAC = this._trnMainService.TrnMainObj.PARAC
    }
    if (!this.transactionValidator()) { return; }
    this.onSubmit();
    this.genericTender.hide();
  }

  approvePerformInvoice() {
    var voucherNumber = this._trnMainService.TrnMainObj.VCHRNO;

    this.masterService.approvePerformaInvoice(voucherNumber)
      .subscribe(result => {
        this.alertService.success("Performa invoice successfully approved");
      },
        error => {
          this.alertService.error(error);
        });
  }

  stockSettlementApproval() {

  }


  onShippingCancel() {
    if (this._trnMainService.TrnMainObj.Mode.toUpperCase() == "NEW") {
      this._trnMainService.TrnMainObj.shipToDetail = <SHIPTODETAIL>{};
    }
  }




  onShippingOk() {
    if (this._trnMainService.TrnMainObj.shipToDetail.ACNAME == "" || this._trnMainService.TrnMainObj.shipToDetail.ACNAME == null || this._trnMainService.TrnMainObj.shipToDetail.ACNAME == undefined) {
      this.alertService.error("Please add shipping name");
      return;
    }
    let mob = this._trnMainService.TrnMainObj.shipToDetail.MOBILE;
    if (mob == null || mob == undefined || mob == "") {
      this.alertService.error("Please add mobile number");
      return;
    }
    if ((mob).toString().length > 10 || (mob).toString().length < 10) {
      this.alertService.error("Mobile number must be 10 digit.");
      return;
    }
    this.showShippingAddress = !this.showShippingAddress

  }


  rejectPerformInvoice() {
    var voucherNumber = this._trnMainService.TrnMainObj.VCHRNO;
    this.masterService.rejectPerformaInvoice(voucherNumber)
      .subscribe(result => {
        this.alertService.success("Performa invoice successfully rejected");
      },
        error => {
          this.alertService.error(error);
        });
  }

  onNewCustomerClick() {
    this.AddNewCustomerPopup.show();
  }

  okAddNewClicked(value) {
    let CustObj = value;
    CustObj.TYPE = "A";
    CustObj.ISACTIVE = 1;
    CustObj.PRICELEVEL = value.GEO;
    CustObj.PARENT = "LB1199";
    CustObj.PType = "C";
    CustObj.COMPANYID = this._trnMainService.userProfile.CompanyInfo.COMPANYID;
    let sub = this.masterService.saveAccount_new(CustObj).subscribe(
      data => {

        if (data.status == "ok") {
          let customer = data.result;

          this._trnMainService.TrnMainObj.BILLTO = customer.ACNAME;
          this._trnMainService.TrnMainObj.PARAC = customer.ACID;
          this._trnMainService.TrnMainObj.TRNAC = customer.ACID;
          this._trnMainService.TrnMainObj.BILLTOADD = customer.ADDRESS;
          this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = customer.PSTYPE;
          this._trnMainService.TrnMainObj.TRNMODE = customer.PMODE;
          this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = customer.ORG_TYPE;
          this._trnMainService.TrnMainObj.CUSTOMERID = customer.customerID;
          this._trnMainService.TrnMainObj.BILLTOMOB = customer.MOBILE;
          this.AddNewCustomerPopup.hide();
          if (document.getElementById("barcodebilling0")) {
            this.masterService.focusAnyControl("barcodebilling0");
          } else {
            this.masterService.focusAnyControl("menucode0");
          }
        } else {
          if (
            data.result._body ==
            "The ConnectionString property has not been initialized."
          ) {
            this.router.navigate(["/login", this.router.url]);
            return;
          }
          this.alertService.error("Error in Saving Data:" + data.result._body);
        }
      },
      error => {

        this.alertService.error(error);
      }
    );


  }
  onRecallClick() {

    this.genericGridHoldBill.show();
  }
  onHoldClick() {
    if (confirm("Are you sure to You want to hold this bill? ")) {
      if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null && x.BATCH != null)[0] == null) {
        this.alertService.info("No Valid Products entries Detect...");
        return;
      }
      var dataHoldBill = this.HoldBillPreparationForSave();
      this.masterService
        .masterPostmethod("/saveholdbill", dataHoldBill)
        .subscribe(
          x => {
            if (x.status == "ok") {
              this._trnMainService.initialFormLoad(VoucherTypeEnum.TaxInvoice);
              if (!this.masterService.ShowMore) {
                this.masterService.ShowMore = true;
              }
              this.masterService.focusAnyControl('customerselectid');
            }
            else { this.alertService.error(x.result._body); }
          },
          error => {

            alert(error);
          }
        );
    }
  }
  HoldBillPreparationForSave() {
    let holdbillObj = <any>{};
    let holdbillProdList = [];
    for (let i of this._trnMainService.TrnMainObj.ProdList) {
      if (i.MCODE != null && i.BATCH != null) {
        holdbillProdList.push(
          {
            MCODE: i.MCODE,
            UNIT: i.ALTUNIT,
            Quantity: i.Quantity,
            BATCH: i.BATCH,
            BC: i.BC,
            REMARKS: i.REMARKS,
            INVDISRATE: i.INDDISCOUNTRATE,
            INVDISAMOUNT: i.ALTINDDISCOUNT,
            CONFACTOR: i.CONFACTOR,
            MFGDATE: i.MFGDATE,
            EXPDATE: i.EXPDATE,
            PRATE: i.PRATE,
            MRP: i.MRP,
            BATCHID: i.BATCHID,
            FLATDISCOUNT: i.FLATDISCOUNT,
            ORIGINALTRANRATE: i.ORIGINALTRANRATE,
            RATE: i.RATE,
          }
        );
      }

    }
    holdbillObj = {
      PARAC: this._trnMainService.TrnMainObj.PARAC,
      REMARKS: this._trnMainService.TrnMainObj.REMARKS,
      DATE: this._trnMainService.TrnMainObj.TRNDATE,
      NETAMNT: this._trnMainService.TrnMainObj.NETAMNT,
      FLATDISRATE: this._trnMainService.TrnMainObj.DCRATE,
      FLATDISAMOUNT: this._trnMainService.TrnMainObj.ALT_TOTFLATDISCOUNT,
      INVOICETYPE: 'retailinvoice',
      PAYMENTSTATUS: 'Hold',
      holdBillProdList: holdbillProdList,
      SNO: this._trnMainService.TrnMainObj.HOLDBILLID
    }
    return holdbillObj;

  }


  cancelHoldBill(holdBIllDetail: any) {
    this.loadingService.show(`Cancelling Invoice ${holdBIllDetail.SNO}.Please Wait....`)
    this.masterService.masterPostmethod("/cancelRecallbill", { SNO: holdBIllDetail.SNO, PhiscalID: holdBIllDetail.PhiscalID }).subscribe((res) => {
      if (res.status == "ok") {
        this.genericGridHoldBill.refresh();
        this.loadingService.hide();

      } else {
        this.loadingService.hide();
        this.alertService.error(res.result)
      }
    }, error => {
      this.loadingService.hide();
      this.alertService.error(error);
    })
  }



  onHoldBillDoubleClick(event) {
    this.loadingService.show("Recalling Bill.Please Wait...");
    this.masterService
      .masterPostmethod("/recallholdbill", event)
      .subscribe(
        x => {
          if (x.status == "ok") {
            this._trnMainService.initialFormLoad(VoucherTypeEnum.TaxInvoice);
            this.convertingRecallBillToMainBill(JSON.parse(x.result));
            this._trnMainService.TrnMainObj.HOLDBILLID = event.SNO;
            this.loadingService.hide();
            this._trnMainService.showRecallCancel = true;
          }
          else {
            this.loadingService.hide();
            this.alertService.error(x.result._body);
          }
        },
        error => {

          alert(error);
        }
      );
  }
  convertingRecallBillToMainBill(recalBill) {
    this._trnMainService.TrnMainObj.TRNAC =
      this._trnMainService.TrnMainObj.PARAC = recalBill.PARAC;
    if (recalBill.customer != null) {
      this._trnMainService.TrnMainObj.BILLTO = recalBill.customer.ACNAME;
      this._trnMainService.TrnMainObj.BILLTOADD = recalBill.customer.ADDRESS;
      this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = recalBill.customer.PSTYPE;
      this._trnMainService.TrnMainObj.TRNMODE = recalBill.customer.PMODE;
      this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = recalBill.customer.ORG_TYPE;
      this._trnMainService.TrnMainObj.PARTY_GSTTYPE = recalBill.customer.GSTTYPE;
    }
    this._trnMainService.TrnMainObj.REMARKS = recalBill.REMARKS;
    this._trnMainService.TrnMainObj.AdditionalObj.tag = "SALES_INVOICE_FROM_HOLDRECALL"
    this._trnMainService.TrnMainObj.PhiscalID = recalBill.PhiscalID;
    this._trnMainService.TrnMainObj.INVOICETYPE = recalBill.INVOICETYPE;
    this._trnMainService.TrnMainObj.DCRATE = this._trnMainService.nullToZeroConverter(recalBill.FLATDISRATE);
    this._trnMainService.TrnMainObj.ALT_TOTFLATDISCOUNT = this._trnMainService.nullToZeroConverter(recalBill.FLATDISAMOUNT);
    this._trnMainService.TrnMainObj.ProdList = [];
    let rowindex = 0;
    for (let r of recalBill.holdBillProdList) {

      if (r.MCODE == null || r.BATCH == null) continue;


      var TP = <TrnProd>{};
      TP.MCODE = r.MCODE;
      TP.SELECTEDITEM = r.SELECTEDITEM;
      TP.BC = r.BC;
      TP.ISVAT = r.SELECTEDITEM.ISVAT;
      TP.MENUCODE = r.SELECTEDITEM.MENUCODE;
      TP.ITEMDESC = r.SELECTEDITEM.DESCA;
      TP.GSTRATE_ONLYFORSHOWING = r.SELECTEDITEM.GST
      TP.GSTRATE = r.SELECTEDITEM.GST;
      TP.WEIGHT = r.SELECTEDITEM.GWEIGHT;

      TP.IsTaxInclusive = r.IsTaxInclusive;
      TP.RATE = r.RATE;
      TP.ORIGINALTRANRATE = r.ORIGINALTRANRATE;
      TP.Mcat = r.SELECTEDITEM.MCAT;
      TP.MRP = r.SELECTEDBATCH.MRP;
      TP.BATCH = r.BATCH;
      TP.BATCHID = r.SELECTEDBATCH.ID;
      TP.MFGDATE = ((r.SELECTEDBATCH.MFGDATE == null) ? "" : r.SELECTEDBATCH.MFGDATE.toString().substring(0, 10));
      TP.EXPDATE = ((r.SELECTEDBATCH.EXPIRY == null) ? "" : r.SELECTEDBATCH.EXPIRY.toString().substring(0, 10));
      TP.UNIT = r.SELECTEDBATCH.UNIT;
      TP.STOCK = r.SELECTEDBATCH.STOCK;
      TP.WAREHOUSE = r.SELECTEDBATCH.WAREHOUSE;
      TP.BATCHSCHEME = r.SELECTEDBATCH.SCHEMENAME;
      TP.Quantity = this._trnMainService.nullToZeroConverter(r.Quantity);
      TP.INDDISCOUNTRATE = this._trnMainService.nullToZeroConverter(r.INVDISRATE);
      TP.ALTINDDISCOUNT = this._trnMainService.nullToZeroConverter(r.INVDISAMOUNT);
      TP.inputMode = false;
      TP.Product = <any>{};
      TP.Product.MCODE = r.MCODE;
      TP.Product.AlternateUnits = r.ALTUNITLIST;
      TP.ALTUNITObj = TP.Product.AlternateUnits.filter(x => x.ALTUNIT == r.UNIT)[0];
      TP.NWEIGHT = r.SELECTEDITEM.NWEIGHT;
      TP.PRATE = r.PRATE;
      this._trnMainService.TrnMainObj.ProdList.push(TP);
      let rate1 = TP.RATE;
      let rate2 = 0;
      TP.inputMode = true;
      rate2 = TP.PRATE;
      this._trnMainService.setunit(rate1, rate2, rowindex, TP.ALTUNITObj);
      rowindex++;

    }

    this._trnMainService.ReCalculateBillWithNormal();

  }
  onTransportClick() {
    this.Transport.show();
  }

  showIssuesto: boolean = false;
  onIssueToClick() {
    this.showIssuesto = true;

  }



  onEmployeeChange() {
    let emp = this.employeeList.filter(x => x.ACID == this._trnMainService.TrnMainObj.RECEIVEBY)[0];

    this._trnMainService.TrnMainObj.BILLTOMOB = emp.MOBILE;
    this._trnMainService.TrnMainObj.BILLTOTEL = emp.EMAIL;
  }


  onFromDebitNoteClicked() {
    this.onFromDebitNoteClickedEvent.emit(true);
  }
  onFromCreditNoteClicked() {
    this.onFromCreditNoteClickedEvent.emit(true);
  }




  invoiceselectallchange(event) {
    if (event.target.checked) {
      this.billDetailsLList.forEach(x => x.isSelected = true)
    } else {
      this.billDetailsLList.forEach(x => x.isSelected = false)

    }
  }


  onInvoiceSelectedApply() {
    this.billDetailsLList.forEach((x, index) => {
      if (x.isSelected) {
        this.onInvoiceDetailsApply(x, index);

      }
    })
  }

  functionKeySetting: any[] = this.authService.getFunctionKeySetting();

  showEdit: boolean = true;
  showSalesBillPopUp: boolean = false;
  showCaretPopUp: boolean = false;
  showBillDetailsSelectedIndex: number = 0;
  @ViewChild(PopBatchComponent) batchlistChild: PopBatchComponent;

  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "ControlLeft" || $event.code == "ControlRight") {
      $event.preventDefault();
      this.showSecondaryButtons = true;
      this.showEdit = false;


      // this.checkButtonVisibility("edit",this._trnMainService.formName);
    }
    else if ($event.code == "F3") {
      $event.preventDefault();
      this.onNewClick();
    }
    else if ($event.code == "F6") {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.Mode != 'VIEW') {
        if (!this._trnMainService.showPerformaApproveReject) {
          this.onSaveClicked();
        }
      }
    }
    else if ($event.code == "F4") {
      $event.preventDefault();
      if (!this._trnMainService.showPerformaApproveReject && this._trnMainService.TrnMainObj.VoucherType != 58 && this._trnMainService.TrnMainObj.VoucherType != 61) {
        this.onViewClicked();
      }
    }
    else if ($event.code == "F8") {
      $event.preventDefault();
      // if (this._trnMainService.TrnMainObj.VoucherType == 14 || this._trnMainService.TrnMainObj.VoucherType == 20) {
      this.onPrintClicked();
      // }
    }
    else if ($event.code == "F5") {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 3 || this._trnMainService.TrnMainObj.VoucherType == 19 || this._trnMainService.TrnMainObj.VoucherType == 57 || this._trnMainService.TrnMainObj.VoucherType == 113 || this._trnMainService.TrnMainObj.VoucherType == 14 || this._trnMainService.TrnMainObj.VoucherType == 15) {
        this.onEditClicked();
      }
    }
    // else if ($event.code == "F12") {
    //   $event.preventDefault();
    //   if (this._trnMainService.TrnMainObj.VoucherType == 3) {
    //     this.onLoadFromSAPFTPClick();
    //   }
    // }

    else if ($event.code == "F2") {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 3) {
        this.onImportPurchaseInvoice();
      }
    }
    else if ($event.code == "F7") {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 3) {
        this.onLoadFromHoTaxInvoiceClick();
      }
    }
    else if ($event.code == "F9") {
      $event.preventDefault();
      this.showSalesBillPopUp = !this.showSalesBillPopUp;
      this.calculateDateForSI();
    }
    else if ($event.code == "Escape") {
      $event.preventDefault();
      if (this.promptPrintDevice || this.showPosPrinterPreview || this.showShippingAddress) {
        this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType)
      }
      this.promptPrintDevice = false;
      this.showPosPrinterPreview = false;
      this.showShippingAddress = false;
      if (this._trnMainService.TrnMainObj.VoucherType == 14) {
        if (this.AddNewCustomerPopup) {

          this.AddNewCustomerPopup.hide();
        }
        if (this.Transport) {
          this.Transport.hide()
        }
      }
      return;
    } else if ($event.code == "ArrowDown") {

      if (this.showBillDetails) {
        if (this.showBillDetailsSelectedIndex < this.invoiceDetailsList.length - 1) {
          this.showBillDetailsSelectedIndex++;
        }
        return;
      }
      if (this.showInvoiceDetails) {
        if (this.invoiceDetailSelectedIndex < this.billDetailsLList.length - 1) {
          this.invoiceDetailSelectedIndex++;
        }
        return;
      }
    } else if ($event.code == "ArrowUp") {
      if (this.showBillDetails) {
        if (this.showBillDetailsSelectedIndex > 0) {
          this.showBillDetailsSelectedIndex--;
        }
        return;
      }
      if (this.showInvoiceDetails) {
        if (this.invoiceDetailSelectedIndex > 0) {
          this.invoiceDetailSelectedIndex--;
        }
        return;
      }
    } else if ($event.code == "Enter") {
      // if (this.batchlistChild) return;
      // if (this.showInvoiceDetails) {
      //   this.onInvoiceDetailsApply(this.billDetailsLList[this.invoiceDetailSelectedIndex], this.invoiceDetailSelectedIndex)
      // }


      if (this.showBillDetails) {
        this.onShowInvoiceDetailsPopUp(this.invoiceDetailsList[this.showBillDetailsSelectedIndex]);
        this.showBillDetails = false;
        return;
      }

      // if (this.showInvoiceDetails) {
      //   this.onInvoiceDetailsApply(this.billDetailsLList[this.invoiceDetailSelectedIndex], this.invoiceDetailSelectedIndex);
      //   this.showInvoiceDetails = false;
      //   return;
      // }

    }
  }

  @HostListener("document : keyup", ["$event"])
  handleKeyUpboardEvent($event: KeyboardEvent) {
    if ($event.code == "ControlLeft" || $event.code == "ControlRight") {
      $event.preventDefault();
      this.showSecondaryButtons = false;

    }

  }
  @HostListener('document:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.altKey || $event.metaKey) && $event.keyCode == 49) {
      $event.preventDefault();
      if (this.promptPrintDevice) {
        this.printControl.patchValue("0");
        return;
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 84) {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 14) {
        if (this.Transport) {
          this.Transport.show();
        }
        return;
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 85) {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 9) {
        this.stockSettlementApprovalLoad();
        return;
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 50) {
      $event.preventDefault();
      if (this.promptPrintDevice) {
        this.printControl.patchValue("1");
        return;
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 72) {
      $event.preventDefault();
      if ((this._trnMainService.TrnMainObj.VoucherType == 14 || this._trnMainService.TrnMainObj.VoucherType == 16) && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'superdistributor' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'distributor')) {
        this.showShippingAddress = true;
        return;
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 77) {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherPrefix == "SO") {
        this.onShowImportFromMobile();
      }
      return;
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 51) {
      $event.preventDefault();
      if (this.promptPrintDevice) {
        this.printControl.patchValue("2");
        return;
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 80) {
      $event.preventDefault();
      if (this.promptPrintDevice) {
        this.setPrinterAndprint();
        return;
      }
      if (this._trnMainService.TrnMainObj.VoucherType == 14 && this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'retailer' && this.AppSettings.printerMode == 1) {
        if (this.showPosPrinterPreview) {
          this.printPosBill();
          return;
        }
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 78) {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 14) {
        if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE != "distributor" && this._trnMainService.userProfile.CompanyInfo.ORG_TYPE != "superdistributor" || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE != "superstockist") {
          this.onNewCustomerClick();
        }
        return;
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 67) {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 14) {
        this.onHoldClick();
      }
      return;
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 82) {
      $event.preventDefault();
      if (this._trnMainService.TrnMainObj.VoucherType == 14) {
        this.onRecallClick();
      }
      return;
    }
  }

  onShowIndentLoadForRFQ() {
    this.onIndentForRFQEmit.emit();
  }


  onShowIndentLoadForPO() {
    if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
      this.alertService.info("Please Choose supplier to proceed...");
      return;
    }
    this.genericGridIntend.show(this._trnMainService.TrnMainObj.PARAC, false, "activeIntent");
  }

  onIntendDoubleClick(event) {
    this.loadingService.show("Please Wait..");
    this.masterService.masterGetmethod(`/getIndentDetailForPo?INDENTNO=${event.INDENTNO}`).subscribe((res) => {
      this.loadingService.hide();
      if (res.status == "ok") {
        let productList = res.result.prodList;
        this._trnMainService.TrnMainObj.ProdList = productList;
        this._trnMainService.TrnMainObj.REFBILL = event.INDENTNO;
        if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }

        for (let i in this._trnMainService.TrnMainObj.ProdList) {
          this._trnMainService.setAltunitDropDownForView(i);
          this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
          let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
          this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
          this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
          let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
          let rate2 = 0;
          rate2 = this._trnMainService.TrnMainObj.ProdList[i].SPRICE;
          this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
        }
        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.addRow();
        setTimeout(() => {
          this.masterService.focusAnyControl("menucode" + (this._trnMainService.TrnMainObj.ProdList.length - 1));
        }, 100);
      }
      else {
        this.alertService.error(res.result._body);
      }
    }, err => {
      this.loadingService.hide();
      this.alertService.error(err._body)
    })
  }
  onIntendMultipleSelect(event) {
    this.loadingService.show("Please Wait..");
    let indentnos: string[] = [];
    event.forEach(e =>

      indentnos.push(e.INDENTNO)
    );

    this.masterService.masterPostmethod(`/getIndentDetailForPo`, indentnos).subscribe((res) => {
      this.loadingService.hide();
      if (res.status == "ok") {
        let productList = res.result.prodList;
        this._trnMainService.TrnMainObj.ProdList = productList;
        this._trnMainService.TrnMainObj.REFBILL = (res.result.IndentNos && res.result.IndentNos.length) ? res.result.IndentNos.join(',') : '';
        if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
        this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = "PO_INDENT";
        this._trnMainService.TrnMainObj.tag = "PO_INDENT";
        for (let i in this._trnMainService.TrnMainObj.ProdList) {
          this._trnMainService.setAltunitDropDownForView(i);
          this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
          let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
          this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
          this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
          let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
          let rate2 = 0;
          rate2 = this._trnMainService.TrnMainObj.ProdList[i].SPRICE;
          this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
        }
        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.addRow();
        setTimeout(() => {
          this.masterService.focusAnyControl("menucode" + (this._trnMainService.TrnMainObj.ProdList.length - 1));
        }, 100);
      }
      else {
        this.alertService.error(res.result._body);
      }
    }, err => {
      this.loadingService.hide();
      this.alertService.error(err._body)
    })
  }



  cancelprint() {
    this.promptPrintDevice = false;
    this.showPosPrinterPreview = false;

    this.initiateandPrepareBarcodePrint();


    this._trnMainService.TrnMainObj.VoucherType = this._trnMainService.TrnMainObj.VoucherType == 61 ? 14 : this._trnMainService.TrnMainObj.VoucherType
    this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      if (!this.masterService.ShowMore) {
        this.masterService.ShowMore = true;
      }
      this.masterService.focusAnyControl("customerselectid");
    }

  }

  onItemDoubleClickFroEdit(event) {
    if (event.TRNMODE == null) { event.TRNMODE = ""; }
    if (event.STATUS) {
      this.alertService.error(`Cannot Load Voucher For Edit.The Voucher ${event.VCHRNO} is ${event.TRNSTATUS}.`);
      this.onNewClick();
      return;
    }

    let p = this._trnMainService.TrnMainObj.ProdList[0];
    if (p != null) {
      if (p.MCODE != null) {
        if (this._trnMainService.TrnMainObj.VoucherPrefix == "CN" || this._trnMainService.TrnMainObj.VoucherPrefix == "DN") {
          if (event.CNDN_MODE != 0) {
            this.alertService.warning(`Cannot Load Voucher!! The Voucher is ${event.VOUCHERREMARKS} based.`);
            return;
          }
        } else if (confirm("You are about to load the bill.Do you want to continue?")) {
          this.loadVoucher(event, "EDIT");
          return;
        }

      }
    }

    this.loadVoucher(event, "EDIT");


  }

  public transactionMode: string = "";

  onEditClicked() {
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
      this.gridPopupSettingsForEdit = Object.assign(new GenericPopUpSettings, {
        title: "Purchase Orders",
        apiEndpoints: `/getordermainListForEdit/PO`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'VCHRNO',
            title: 'PONO.',
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

    } else {
      this.gridPopupSettingsForEdit = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings(this._trnMainService.TrnMainObj.VoucherAbbName));
    }

    let user = this._trnMainService.userProfile;
    if (user.username.toLowerCase() != "admin" && user.username.toLowerCase() != "patanjali_user" && user.username.toLowerCase() != "superadmin") {
      if (!(this.authService.checkMenuRight(this.activeurlpath, "edit"))) {
        this.alertService.error("You are not authorized for this operation.");
        return;
      }
    }
    this.transactionMode = "EDIT";
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show(this._trnMainService.TrnMainObj.PARAC, false, "editForPurchaseOrder");
    }
    else if (this._trnMainService.TrnMainObj.VoucherPrefix == "CN") {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show(this._trnMainService.TrnMainObj.PARAC, false, "cnlistforedit");
    }
    else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show("", false, "editforsalesinvoice");
    } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice) {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show("", false, "editforproformainvoice");
    }

    else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show("", false, "editfordeliverychallan");
    }
    else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show("", false, "editforpurchaseinvoice");
    } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show(this._trnMainService.TrnMainObj.PARAC, false, "editForSalesOrder");

    } else if (this._trnMainService.TrnMainObj.VoucherPrefix == "OP") {
      this.genericGridEdit.show(this._trnMainService.TrnMainObj.PARAC, false, "viewForOpeningStock");
      return;
    }
    else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferIn) {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show("", false, "editforintercompanytransferin");
    } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOut) {
      this.gridPopupSettingsForEdit.apiEndpoints = "/getMasterPagedListOfAny"
      this.genericGridEdit.show("", false, "editforintercompanytransferout");
    }
    else {
      this.genericGridEdit.show();
    }
  }


  OkAdvanceAdjustment() {
    this.showAdvanceAdjustmentPopUp = false;

    this.onSubmit();
  }
  cancelAdvanceAdjustment() {
    this.showAdvanceAdjustmentPopUp = false;
    this._trnMainService.TrnMainObj.AdvanceAdjustmentObj = null;
    this.onSubmit();
  }
  emptyBatchValidation(): boolean {
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance && this.masterService.userProfile.CompanyInfo.companyType != "retailer") {
      var batch = this._trnMainService.TrnMainObj.ProdList.filter(x => x.BATCH == "" || x.BATCH == null || x.BATCH == undefined)[0];
      if (batch != null) {
        this.alertService.error("Empty Batch Detected...On Item :" + batch.ITEMDESC);
        return false;
      }
    }
    return true;
  }
  showShippingAddressClick() {
    if (this._trnMainService.TrnMainObj.shipToDetail == null) {
      this._trnMainService.TrnMainObj.shipToDetail = <any>{};
    }
    this.showShippingAddress = true;
  }
  onLoadPurchaseReturnCancel() {
    this.onPurchaseReturnCancel.emit();
  }

  onClickProducts() {
    this.showProducts = true;
  }

  onClickItemImage() {
    this.McodeList = [];
    if (this._trnMainService.TrnMainObj.ProdList != []) {
      for (var item of this._trnMainService.TrnMainObj.ProdList) {
        let mcode = item.MCODE;
        if (mcode != "" && mcode != null) {
          this.McodeList.push(mcode);
        }
      }
      this.LoadItemImageWithDetails(this.McodeList);
    }
    this.showItemImage = true;
  }

  LoadItemImageWithDetails(filter) {

    try {
      this.loadingService.show("Item Image Loading please wait...");
      let sub = this.masterService.loadItemImageList(filter)
        .subscribe(data => {
          if (data.status == 'ok') {
            this.itemDetailsWithImage = data.result;
            // var response = data.result;
            //for(var item in response){
            //let imgData = 
            //}

            //this.itemDetailsWithImage.imageUrl="data:image/jpeg;base64," + this.itemDetailsWithImage.ItemImageBase64;  
            this.loadingService.hide();
          }
          else {
            this.itemDetailsWithImage = [];
            this.showItemImage = false;
            this.loadingService.hide();
            this.alertService.error(data.result);
          }
        },
          error => {
            this.itemDetailsWithImage = [];
            this.showItemImage = false;
            this.loadingService.hide();
            this.alertService.error(error)
          }
        );
    }
    catch (e) {
      this.itemDetailsWithImage = [];
      this.showItemImage = false;
      this.alertService.error(e);
    }
  }

  onClickSupplier() {
    this.showSupplier = true;
  }


  fromTransferOut() {
    this.onTransferOutClicked.emit(true);
  }


  onImportFromSalesOrderInPO() {
    this.onImportFromSOInPO.emit(true);

  }

  onLoadFromTransferOut() {

  }
  onCloseSalesBill() {
    this.showSalesBillPopUp = false;
  }
  onCloseCaret() {
    this.showCaretPopUp = false;
  }
  numberOnly(event): boolean {
    let regex = /^[0-9]+$/;
    if (!regex.test(event.key)) {
      return false;
    } else {
      return true;
    }
  }
  customerCrateBalance(billto, acidtype) {
    this.showCaretPopUp = false;
    this.loadingService.show("Loading Data please wait...");
    this.masterService.getCrateBalancebyCustomer(billto, acidtype).subscribe((data) => {
      if (data.status == "ok") {
        this.crateBalance = data.result[0].balance;
        this.loadingService.hide();
        this.showCaretPopUp = true;
      } else {
        this.loadingService.hide();
        this.alertService.error(data)
      }

    });
  }
  loadcustCaret(voucherType) {
    if (voucherType == 14 || voucherType == 3) {
      if (voucherType == 14) {
        var acidtype = "customer";
      } else if (voucherType == 3) {
        var acidtype = "supplier";
      } else { }
      if (this._trnMainService.TrnMainObj.BILLTO == undefined ||
        this._trnMainService.TrnMainObj.BILLTO == null ||
        this._trnMainService.TrnMainObj.BILLTO == '') {
        this.alertService.warning("Please select the " + acidtype + " first.");
        return;
      } else {
        this.customerCrateBalance(this._trnMainService.TrnMainObj.PARAC, acidtype);

      }
    } else { }
  }

  saveCaret(voucherType) {
    try {
      var acidtype = "";
      if (voucherType == 14 || voucherType == 3) {
        if (voucherType == 14) {
          acidtype = "customer";
        } else if (voucherType == 3) {
          acidtype = "supplier";
        } else {

        }
      } else {
        this.alertService.warning("Invalid voucher type");
        return;
      }

      if (this._trnMainService.TrnMainObj.BILLTO == undefined ||
        this._trnMainService.TrnMainObj.BILLTO == null ||
        this._trnMainService.TrnMainObj.BILLTO == '') {
        this.alertService.warning("Please select the customer first.");
        return;
      }
      if (this.caretDate == undefined ||
        this.caretDate == null ||
        this.caretDate == '') {
        this.alertService.warning("Please Enter Date.");
        return;
      }
      if (this.assignCaret == undefined ||
        this.assignCaret == null ||
        this.assignCaret == '') {
        this.alertService.warning("Please Enter Assigned Crate.");
        return;
      }
      if (this.returnCaret == undefined ||
        this.returnCaret == null ||
        this.returnCaret == '') {
        this.alertService.warning("Please Enter Return Crate .");
        return;
      }

      if (this.assignCaret == "0" && this.returnCaret == "0") {
        this.alertService.warning("Please Fill Atleast one in Assign or Return .");
        return;
      }

      var requestOject = {
        ACID: this._trnMainService.TrnMainObj.PARAC,
        ACIDTYPE: acidtype,
        AssignQuantity: this.assignCaret,
        CaretDate: this.caretDate,
        ReturnQuantity: this.returnCaret
      };
      this.saveCaretStatus = true;
      this.loadingService.show("Saving Data please wait...");
      let sub = this.masterService.addCaretDetails(JSON.stringify(requestOject))
        .subscribe(data => {
          if (data.status == 'ok') {
            this.alertService.success(data.result);
            if (data.result == "Crate Add Successfully") {
              this.assignCaret = "0";
              this.returnCaret = "0";
              this.caretDate = "";
            }

            this.masterService.getCrateBalancebyCustomer(this._trnMainService.TrnMainObj.PARAC, acidtype).subscribe((data) => {
              if (data.status == "ok") {
                this.crateBalance = data.result[0].balance;
                this.saveCaretStatus = false;
                this.loadingService.hide();
              }
            });
          }
          else {
            this.saveCaretStatus = false;
            this.loadingService.hide();
            this.alertService.error(data.result);

          }

        },
          error => {
            this.saveCaretStatus = false;
            this.loadingService.hide();
            this.alertService.error(error)
          }
        );
    }
    catch (e) {
      this.saveCaretStatus = false;
      this.alertService.error(e);
    }
  }

  showButton(btnName: string) {
    if (this.activeurlpath == "quotationinvoice") {
    }
    let v = this.functionKeySetting.filter(x => x.values == btnName && x.formName == this.formName)[0];
    if (v != null) {
      if (v.selected == true) {
        if (this.showSecondaryButtons == true) {
          return true;
        }
        else { return false };
      }
      else {
        if (this.showSecondaryButtons == true) {
          return false;
        }
        else { return true; }
      }

    }
    else { return false; }

  }
  showBillPopup() {
    if (this._trnMainService.TrnMainObj.BILLTO == undefined ||
      this._trnMainService.TrnMainObj.BILLTO == null ||
      this._trnMainService.TrnMainObj.BILLTO == '') {
      this.alertService.warning("Please select the customer first.");
      return;
    }
    else if (this.dateFrom == undefined ||
      this.dateFrom == null ||
      this.dateFrom == '') {
      this.alertService.warning("Please select From Date.");
      return;
    }
    else if (this.dateTo == undefined ||
      this.dateTo == null ||
      this.dateTo == '') {
      this.alertService.warning("Please select To Date.");
      return;
    }
    else {
      this.showInvoiceDetailsPopup();
    }
  }
  invoiceDetailsList: InvoiceDetail[];
  showInvoiceDetailsPopup() {
    this.masterService.getBillListCustomerwise(this._trnMainService.TrnMainObj.PARAC, this.dateFrom, this.dateTo).subscribe((data) => {
      if (data.status == "ok") {
        this.invoiceDetailsList = data.result;
        this.showBillDetails = true;
        this.showSalesBillPopUp = false;
      }

    });

  }
  hideBillsPopup() {
    this.showBillDetails = false;
    this.invoiceDetailsList = [];
  }
  billDetailsLList: BillDetail[];
  hideInvoicePopup() {
    this.showInvoiceDetails = false;
    // this.invoiceDetailsList = [];
  }

  onShowInvoiceDetailsPopUp(value: any) {
    this.masterService.getBillList(value.VCHRNO).subscribe((data: any) => {
      if (data.status == "ok") {
        this.billDetailsLList = data.result;
        this.showBillDetails = false;
        this.showSalesBillPopUp = false;
        this.showInvoiceDetails = true;
      }

    })

  }
  calculateDateForSI() {
    try {

      let FBDATE = (this.userProfile.CompanyInfo.FBDATE).substr(0, 10);
      let FEDATE = (this.userProfile.CompanyInfo.FEDATE).substr(0, 10);
      this.dateFrom = moment(new Date(FBDATE)).set('date', 1).set('month', 3).format("YYYY-MM-DD");
      this.dateTo = moment(new Date(FEDATE)).endOf('month').set('month', 2).format("YYYY-MM-DD");
      setTimeout(() => {
        this.masterService.focusAnyControl("billNo");
      }, 1000)
    }
    catch (ex) {
    }
  }


  onInvoiceDetailsApply = (item, index): void => {
    this.invoiceDetailSelectedIndex = index;
    this.masterService.invoiceDetailSubject.next(item);
    // this.showInvoiceDetails = false;

  }
  showItemPoup() {
    if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == '' || this._trnMainService.TrnMainObj.PARAC == undefined) {
      this.alertService.warning("Please select customer first.");
      return;
    }
    this.masterService.getBillList(null, this._trnMainService.TrnMainObj.PARAC).subscribe((data: any) => {
      if (data.status == "ok") {
        this.billDetailsLList = data.result ? data.result : [];
        this.showBillDetails = false;
        this.showSalesBillPopUp = false;
        this.showInvoiceDetails = true;
      }

    })

  }
  OkAdvanceFromSalesOrder() {
    this.showAdvancePopUpForSalesOrder = false;
    this.onSubmit();
  }



  public invoiceDetailSelectedIndex: number = 0;


}
@Pipe({
  name: 'buttonShow',
  pure: true
})
export class ButtonShowPipe implements PipeTransform {
  constructor(public _trnMainService: TransactionService, public authService: AuthService, private fileImportService: FileUploaderService) {

  }
  functionKeySetting: any[] = this.authService.getFunctionKeySetting();
  transform(rowName: any, i?: any): boolean {
    let active: boolean = this.showButton(rowName, i)
    return active;
  }


  showButton(btnValue, i): boolean {
    const VT = this._trnMainService.TrnMainObj.VoucherType;
    let buttonShow = false;
    switch (btnValue) {
      case "EDIT":
        if (VT == VoucherTypeEnum.SalesOrder || VT == VoucherTypeEnum.PerformaSalesInvoice || VT == VoucherTypeEnum.DeliveryChallaan || VT == VoucherTypeEnum.TaxInvoice || VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.PurchaseOrder || VT == VoucherTypeEnum.Purchase || VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.OpeningStockBalance
          || VT == VoucherTypeEnum.BranchTransferOut || VT == VoucherTypeEnum.InterCompanyTransferOut || VT == VoucherTypeEnum.RFQ || VT == VoucherTypeEnum.InterCompanyTransferIn

        ) {
          buttonShow = true;

        }
        break;
      case "RESET":
        // if (VT == VoucherTypeEnum.QuotationInvoice || VT == VoucherTypeEnum.SalesOrder || VT == VoucherTypeEnum.PerformaSalesInvoice || VT == VoucherTypeEnum.DeliveryChallaan || VT == VoucherTypeEnum.TaxInvoice
        //   || VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.PurchaseOrder || VT == VoucherTypeEnum.Purchase || VT == VoucherTypeEnum.MaterialReceipt
        //   || VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.OpeningStockBalance || VT == VoucherTypeEnum.RFQ
        //   || VT == VoucherTypeEnum.StockIssue || VT == VoucherTypeEnum.StockSettlement || VT == VoucherTypeEnum.StockSettlementEntryApproval || VT == VoucherTypeEnum.Repack) {
        buttonShow = true;
        // }
        break;
      case "VIEW":
        if (VT == VoucherTypeEnum.QuotationInvoice || VT == VoucherTypeEnum.SalesOrder || VT == VoucherTypeEnum.PerformaSalesInvoice || VT == VoucherTypeEnum.DeliveryChallaan || VT == VoucherTypeEnum.TaxInvoice
          || VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.PurchaseOrder || VT == VoucherTypeEnum.Purchase || VT == VoucherTypeEnum.MaterialReceipt
          || VT == VoucherTypeEnum.BranchTransferIn || VT == VoucherTypeEnum.BranchTransferOut || VT == VoucherTypeEnum.InterCompanyTransferIn || VT == VoucherTypeEnum.InterCompanyTransferOut
          || VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.OpeningStockBalance || VT == VoucherTypeEnum.RFQ
          || VT == VoucherTypeEnum.StockIssue || VT == VoucherTypeEnum.StockSettlement || VT == VoucherTypeEnum.StockSettlementEntryApproval || VT == VoucherTypeEnum.Repack) {
          buttonShow = true;
        }
        break;
      case "SAVE":

        if (VT == VoucherTypeEnum.QuotationInvoice || VT == VoucherTypeEnum.SalesOrder || VT == VoucherTypeEnum.PerformaSalesInvoice ||
          VT == VoucherTypeEnum.DeliveryChallaan || VT == VoucherTypeEnum.TaxInvoice
          || VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.PurchaseOrder || VT == VoucherTypeEnum.Purchase || VT == VoucherTypeEnum.MaterialReceipt
          || VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.OpeningStockBalance || VT == VoucherTypeEnum.RFQ
          || VT == VoucherTypeEnum.BranchTransferIn || VT == VoucherTypeEnum.BranchTransferOut || VT == VoucherTypeEnum.InterCompanyTransferIn || VT == VoucherTypeEnum.InterCompanyTransferOut
          || VT == VoucherTypeEnum.StockIssue || VT == VoucherTypeEnum.StockSettlement || VT == VoucherTypeEnum.StockSettlementEntryApproval || VT == VoucherTypeEnum.Repack) {
          buttonShow = true;
        }
        break;
      case "PRODUCTS":
        if (VT == VoucherTypeEnum.SalesOrder || VT == VoucherTypeEnum.PerformaSalesInvoice || VT == VoucherTypeEnum.DeliveryChallaan || VT == VoucherTypeEnum.TaxInvoice
          || VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.PurchaseOrder || VT == VoucherTypeEnum.Purchase
          || VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.OpeningStockBalance
          || VT == VoucherTypeEnum.StockIssue || VT == VoucherTypeEnum.StockSettlement || VT == VoucherTypeEnum.StockSettlementEntryApproval || VT == VoucherTypeEnum.Repack) {
          buttonShow = true;
        }
        break;
      case "FROM PO":
        if (VT == VoucherTypeEnum.SalesOrder) {
          buttonShow = true;
        }
        break;
      case "IMPORT SO":
        if (VT == VoucherTypeEnum.SalesOrder) {
          buttonShow = true;
        }
        break;
      case "FROM SO":
        if (VT == VoucherTypeEnum.PerformaSalesInvoice || VT == VoucherTypeEnum.DeliveryChallaan || VT == VoucherTypeEnum.TaxInvoice) {
          buttonShow = true;
        }
        break;
      case "CANCEL SI":
        if (VT == VoucherTypeEnum.TaxInvoice) {
          buttonShow = true;
        }
        break;
      case "FROM PROFORMA":
        if (VT == VoucherTypeEnum.TaxInvoice) {
          buttonShow = true;
        }
        break;
      case "FROM DN":
        if (VT == VoucherTypeEnum.CreditNote) {
          buttonShow = true;
        }
        break;
      case "CN TO CANCEL":
        if (VT == VoucherTypeEnum.CreditNote) {
          buttonShow = true;
        }
        break;
      case "IMPORT PO":
        if (VT == VoucherTypeEnum.PurchaseOrder) {
          buttonShow = true;
        }
        break;


      case "INTEND":
        if (VT == VoucherTypeEnum.PurchaseOrder || VT == VoucherTypeEnum.RFQ) {
          buttonShow = true;
        }
        break;

      case "IMPORT FROM SO":
        if (VT == VoucherTypeEnum.PurchaseOrder) {
          buttonShow = true;
        }
        break;
      case "Read Weight":
        if (VT == VoucherTypeEnum.TaxInvoice) {
          buttonShow = true;
        }
        break;
      case "SUPPLIER":
        if (VT == VoucherTypeEnum.Purchase) {
          buttonShow = true;
        }
        break;
      case "LOAD SAP":
        if (VT == VoucherTypeEnum.Purchase) {
          buttonShow = true;
        }
        break;
      case "IMPORT PI":
        if (VT == VoucherTypeEnum.Purchase) {
          buttonShow = true;
        }
      case "IMPORT PR":
        if (VT == VoucherTypeEnum.DebitNote) {
          buttonShow = true;
        }
        break;
      case "FROM SI":
        if (VT == VoucherTypeEnum.Purchase) {
          buttonShow = true;
        }
        break;
      case "PROFORMA REQUEST":
        if (VT == VoucherTypeEnum.Purchase) {
          buttonShow = true;
        }
        break;
      case "PR CANCEL":
        if (VT == VoucherTypeEnum.DebitNote) {
          buttonShow = true;
        }
        break;
      case "ALT TRANSPORT":
        if (VT == VoucherTypeEnum.StockIssue) {
          buttonShow = true;
        }
        break;
      default:
        buttonShow = true;
        break;

    }

    return buttonShow;
  }


}
export interface InvoiceDetail {
  BILLTO: string;
  NETAMNT: string;
  TRNDATE: string;
  TRNUSER: string;
  VCHRNO: string;
}
export interface BillDetail {
  isSelected: boolean;
  checked?: boolean;
  ITEMDESC: string;
  MCODE: string;
  QTY: number;
  STOCK: number;
}
