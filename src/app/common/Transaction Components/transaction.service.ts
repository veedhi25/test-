import { Injectable } from "@angular/core";
import { PREFIX } from "./../interfaces/Prefix.interface";
import { MasterRepo } from "./../repositories/masterRepo.service";
import {
  TrnProd,
  VoucherTypeEnum,
  TrnMain_AdditionalInfo,
  Transporter_Eway,
  Trntran,
  SHIPTODETAIL,
  BULKITEM,
  ITEMTYPE,
  TRNSCHEMEAPPLIED,
  BarcodeDifferentiatorModel,
  schemeForCalculationClass,
} from "./../interfaces/TrnMain";
import { TrnMain } from "./../interfaces/TrnMain";
import { IDivision, UserCouponList } from "./../interfaces/commonInterface.interface";
import { AuthService } from "./../services/permission/index";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TAcList } from "../interfaces/Account.interface";
import { SettingService } from "../services/setting.service";
import { AlertService } from "../services/alert/alert.service";
import { SpinnerService } from "../services/spinner/spinner.service";
import { Filter } from "../interfaces/filter.interface";
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment'
import { AppSettings } from "../services/AppSettings";
import { UserWiseTransactionFormConfigurationService } from "../popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.service";
import { Product } from "../interfaces/ProductItem";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { RFQMain, RFQPROD } from "../interfaces/rfq.interface";

@Injectable()
export class TransactionService {
  pricingItem = new Observable();

  TrnMainObj: TrnMain = <TrnMain>{};
  UserCouponList: UserCouponList = <UserCouponList>{};
  RfqObj: RFQMain = <RFQMain>{};
  QuotationObj: any = {};
  prodActiveRowIndex: number = 0;
  FilterObj: Filter = <Filter>{}
  Warehouse: string;
  pageHeading: string;
  prefix: PREFIX = <PREFIX>{};
  division: IDivision = <IDivision>{};
  saveDisable: boolean;
  differenceAmount: number = 0;
  trntranTotal: number = 0;
  showRecallCancel: boolean = false;
  posPrintCount: number = 1;
  crTotal: number = 0;
  drTotal: number = 0;
  salesMode: string;
  cnMode: string;
  warrentyUpToDate: Date;
  warrentyVchrList: any[];
  buttonHeading: string = "Reference No";
  accountListSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<
    TAcList[]
  >([]);
  accountListObersver$: Observable<
    TAcList[]
  > = this.accountListSubject.asObservable();
  TableAcHeader: string = "Description";
  prodListMode: ProdListMode;
  prodDisableSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  prodDisable$: Observable<boolean> = this.prodDisableSubject.asObservable();
  cnReturnedProdList: TrnProd[];
  referenceNoSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  referenceNo$: Observable<string> = this.referenceNoSubject.asObservable();
  public PrintStuffSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public PrintStuff$: Observable<any> = this.PrintStuffSubject.asObservable();

  supplierwiseItem: any = 0;
  returnVoucherMain: any = <any>{};
  DefaultSellableWarehouse: string;
  partyList: any[] = [];
  userProfile: any = <any>{};

  //extra settings for performa invoice
  showPerformaApproveReject: boolean = false; // initially false

  billTo: string;
  // BarcodeFromScan: string;
  ItemsListForMultiItemBarcode: any[] = [];

  voucherNoHeader: string = "Bill No";
  activeurlpath: any;
  batchlist: any[] = [];
  showItemStockRouteModal: boolean = false;
  voucherSeries: any[];
  customerEvent: boolean;
  showSchemeOffer: boolean;
  trnMainForBarcodePrint: TrnMain;
  userwiseTransactionFormConf: any[] = [];
  constructor(
    private masterService: MasterRepo,
    private setting: SettingService,
    private authservice: AuthService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    private arouter: ActivatedRoute,
    public AppSettings: AppSettings,
    private _userwisegridconf: UserWiseTransactionFormConfigurationService
  ) {
    this.AppSettings = setting.appSetting;
    this.userProfile = authservice.getUserProfile();
    if (this.arouter.snapshot.url[0] != null) {
      this.activeurlpath = this.arouter.snapshot.url[0].path;
    }
  }

  trnmainBehavior: BehaviorSubject<TrnMain> = new BehaviorSubject(<TrnMain>{});
  loadDataObservable: Observable<TrnMain> = this.trnmainBehavior.asObservable();
  PMode: string; //p for party mode and c for customer mode
  MaxTotalAmountLimit: number = 5000;
  DefaultCustomerAc: string = "";
  SettlementNo: any;
  INVMAIN: any;

  CashList: any[] = [];
  PurchaseAcList: any[] = [];
  paymentmodelist: any[] = [];
  paymentAccountList: any[] = [];
  settlementList: any[] = [];
  formName: string = "";
  formButtonSelected: boolean = true;
  public checkboxEl: boolean;


  loadData(VCHR, division, phiscalid, transactionMode: string = "NEW", voucherType: string = "") {
    if (transactionMode == null || transactionMode == "") { transactionMode = "VIEW"; }
    this.loadingService.show("Getting Details, Please Wait...");
    this.masterService.LoadTransaction(VCHR, division, phiscalid, transactionMode).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status == "ok") {
          this.setTrnMainObData(data, transactionMode);
        }
      },
      error => {
        this.loadingService.hide();
        this.alertService.error(error._body);
        this.trnmainBehavior.complete();
      },
      () => {
        this.loadingService.hide();
        this.trnmainBehavior.complete();
      }
    );
  }


  setTrnMainObData(data: any, transactionMode: string = "NEW") {
    this.TrnMainObj = data.result;
    this.TrnMainObj.EditModeNetAMount = this.TrnMainObj.NETAMNT;
    this.TrnMainObj.Mode = transactionMode;

    if (this.TrnMainObj.guid == null || this.TrnMainObj.guid == undefined || this.TrnMainObj.guid == '') {
      const uuidV1 = require('uuid/v1');
      this.TrnMainObj.guid = uuidV1();
    }

    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Repack) {
      this.TrnMainObj.TRNMODE = transactionMode;
      if (this.activeurlpath == "repackentry") {
        this.TrnMainObj.ProdList = this.TrnMainObj.ProdList.filter(x => x.RealQty == 0);
      }
    }

    this.TrnMainObj.REFBILLDATE = data.result.TRN_DATE == null ? (moment(data.result.TRNDATE.substr(0, 10)).format("DD/MM/YYYY")) : (moment(data.result.TRN_DATE.substr(0, 10)).format("DD/MM/YYYY"));
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
      if (this.TrnMainObj.TRNAC != null && this.TrnMainObj.TRNAC != "") {
        this.TrnMainObj.PARAC = this.TrnMainObj.TRNAC;
      }
    }

    this.TrnMainObj.REFBILLDATE = data.result.TRN_DATE == null ? (moment(data.result.TRNDATE.substr(0, 10)).format("DD/MM/YYYY")) : (moment(data.result.TRN_DATE.substr(0, 10)).format("DD/MM/YYYY"));
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.RFQ) {
      if (this.TrnMainObj.TRNAC != null && this.TrnMainObj.TRNAC != "") {
        this.TrnMainObj.PARAC = this.TrnMainObj.TRNAC;
      }
    }
    if (this.TrnMainObj.TransporterEway == null) {
      this.TrnMainObj.TransporterEway = <any>{};
    }
    if (this.TrnMainObj.AdditionalObj == null) {
      this.TrnMainObj.AdditionalObj = <any>{};
    }

    for (let i in this.TrnMainObj.ProdList) {
      if (this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
        //this.TrnMainObj.ProdList[i].AltQty=this.TrnMainObj.ProdList[i].RealQty;
        this.TrnMainObj.ProdList[i].ReceivedQuantityMR = this.TrnMainObj.ProdList[i].REALQTY_IN;
      }
      this.TrnMainObj.ProdList[i].VARIANTDESCA = "";
      if (this.TrnMainObj.ProdList[i].Ptype == ITEMTYPE.MATRIXITEM) {
        for (var attribute in this.TrnMainObj.ProdList[i].VARIANTLIST) {
          if (['QTY', 'PRATE', 'MRP', 'SRATE', 'BARCODE', 'BATCH'].indexOf(attribute) == -1 && this.TrnMainObj.ProdList[i].VARIANTLIST[attribute] != null) {
            this.TrnMainObj.ProdList[i].VARIANTDESCA = this.TrnMainObj.ProdList[i].VARIANTDESCA + `<b>${this.getVariantNameFromId(attribute)}</b>:${this.TrnMainObj.ProdList[i].VARIANTLIST[attribute].NAME} <br/>`

          }
        }
      }


      if (this.TrnMainObj.Mode != null && this.TrnMainObj.Mode.toLowerCase() == "edit" && this.TrnMainObj.VoucherPrefix == "TI") {
        this.TrnMainObj.ProdList[i].STOCK = 0;
        //offer json parse
        try {

          this.TrnMainObj.ProdList[i].AllSchemeOffer = JSON.parse(this.TrnMainObj.ProdList[i].SCHEMESAPPLIED);
        } catch (e) { console.log("scheme parse error", e); }
      }
      if (this.TrnMainObj.VoucherPrefix == "TI" || this.TrnMainObj.VoucherPrefix == "PP") {
        this.TrnMainObj.ProdList[i].EDITEDBILLQUANTITY = this.TrnMainObj.ProdList[i].RealQty;

      }
      if (this.TrnMainObj.VoucherPrefix == "PI") {
        let p = this.TrnMainObj.ProdList[i];
        this.TrnMainObj.ProdList[i].OtherDiscount = this.TrnMainObj.ProdList[i].INDODAMT;
        let landingCostAfterFreeItem = (this.nullToZeroConverter(p.Quantity) * this.nullToZeroConverter(p.CONFACTOR) * this.nullToZeroConverter(p.RATE)) / ((this.nullToZeroConverter(p.Quantity) + this.nullToZeroConverter(p.FreeQuantity)) * this.nullToZeroConverter(p.CONFACTOR))
      }



      if (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].PrimaryDiscount) > 0) {
        this.TrnMainObj.ProdList[i].BasePrimaryDiscount =
          this.nullToZeroConverter(this.TrnMainObj.ProdList[i].PrimaryDiscount) / (this.TrnMainObj.ProdList[i].Quantity * this.TrnMainObj.ProdList[i].CONFACTOR);
      }
      if (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].SecondaryDiscount) > 0) {
        this.TrnMainObj.ProdList[i].BaseSecondaryDiscount =
          this.nullToZeroConverter(this.TrnMainObj.ProdList[i].SecondaryDiscount) / (this.TrnMainObj.ProdList[i].Quantity * this.TrnMainObj.ProdList[i].CONFACTOR);

      }
      if (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].LiquiditionDiscount) > 0) {
        this.TrnMainObj.ProdList[i].BaseLiquiditionDiscount =
          this.nullToZeroConverter(this.TrnMainObj.ProdList[i].LiquiditionDiscount) / (this.TrnMainObj.ProdList[i].Quantity * this.TrnMainObj.ProdList[i].CONFACTOR);

      }
      // this.determineAutoSchemeAppliedinView(i, this.TrnMainObj.ProdList[i].SCHEMESAPPLIED);

      this.setAltunitDropDownForView(i);
      if (this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn || this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferOut) {
        this.setunit(this.TrnMainObj.ProdList[i].RATE, this.TrnMainObj.ProdList[i].ALTRATE, i, this.TrnMainObj.ProdList[i].ALTUNITObj);
      } else {
        this.setunit(this.TrnMainObj.ProdList[i].RATE, this.TrnMainObj.ProdList[i].ALTRATE2, i, this.TrnMainObj.ProdList[i].ALTUNITObj);
      }

      this.TrnMainObj.ProdList[i].MFGDATE = ((this.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
      this.TrnMainObj.ProdList[i].EXPDATE = ((this.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));

      if (this.activeurlpath = "StockSettlementEntryApproval") {
        this.TrnMainObj.ProdList[i].IsApproveStockSettlement = true;
      }
    }

    this.TrnMainObj.AdditionalObj.IMAGEURL = "data:image/jpeg;base64," + this.TrnMainObj.AdditionalObj.IMAGEBASE64;


    // this.ReCalculateBill();
    if (transactionMode == "VIEW") {
      this.calculateTotalsSum();

    }
    else {
      this.ReCalculateBillWithNormal();
    }
    this.Warehouse = this.TrnMainObj.MWAREHOUSE;
    if (
      !this.Warehouse &&
      this.TrnMainObj.ProdList &&
      this.TrnMainObj.ProdList != null &&
      this.TrnMainObj.ProdList.length > 0
    ) {
      this.Warehouse = this.TrnMainObj.ProdList[0].WAREHOUSE;
    }

    this.TrnMainObj.TRNDATE =
      this.TrnMainObj.TRNDATE == null
        ? ""
        : this.TrnMainObj.TRNDATE.toString().substring(0, 10);
    this.TrnMainObj.TRN_DATE =
      this.TrnMainObj.TRN_DATE == null
        ? ""
        : this.TrnMainObj.TRN_DATE.toString().substring(0, 10);
    this.TrnMainObj.CHEQUEDATE =
      this.TrnMainObj.CHEQUEDATE == null
        ? ""
        : this.TrnMainObj.CHEQUEDATE.toString().substring(0, 10);
    this.TrnMainObj.DeliveryDate =
      this.TrnMainObj.DeliveryDate == null
        ? ""
        : this.TrnMainObj.DeliveryDate.toString().substring(0, 10);

    this.TrnMainObj.TrntranList.forEach(trntran => {
      if (trntran.A_ACID) {
        trntran.acitem = trntran.AccountItem;
        trntran.ROWMODE == "save";
      } else {
        trntran.acitem = <any>{};
        trntran.ROWMODE == "save";
      }
    });
    if (this.TrnMainObj.Mode.toUpperCase() == "EDIT" && this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
      this.TrnMainObj.PARAC = this.TrnMainObj.TRNAC
    }
    else if (this.TrnMainObj.Mode.toUpperCase() == "EDIT" && this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      try {
        this.TrnMainObj.billOfferOnlyForHold = JSON.parse(this.TrnMainObj.billoffer);
      } catch (e) { }
    }
    let acid = this.TrnMainObj.TRNAC;

    this.masterService.accountList$.subscribe(aclist => {
      if (aclist) {
        let ac = aclist.find(x => x.ACID == acid);
        if (ac && ac != null && ac != undefined)
          this.TrnMainObj.TRNACName = ac.ACNAME;
      }
      this.trnmainBehavior.next(this.TrnMainObj);
    });
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this.voucherSeries && this.voucherSeries.length && this.AppSettings.enableMultiSeriesInSales == 1) {
      this.TrnMainObj.VoucherPrefix = this.voucherSeries.filter(x => this.TrnMainObj.VCHRNO.includes(x.vseries_id)).map(function (item) { return item.vseries_id })[0];
    }
  }

  loadStockSettlement(VCHR, apiUrl) {
    this.masterService.LoadStockSettlement(VCHR, apiUrl).subscribe(
      data => {
        if (data.status == "ok") {
          this.TrnMainObj = data.result;
          this.TrnMainObj.Mode = "VIEW";
          // if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
          //   this.TrnMainObj.Mode = "EDIT";
          //   this.TrnMainObj.ProdList.forEach(element => {
          //     element.inputMode = true;
          //   });
          // }

          for (let i in this.TrnMainObj.ProdList) {
            this.setAltunitDropDownForView(i);
            this.setunit(this.TrnMainObj.ProdList[i].RATE, this.TrnMainObj.ProdList[i].ALTRATE2, i, this.TrnMainObj.ProdList[i].ALTUNITObj);

            //  this.CalculateNormalNew(i);
            this.TrnMainObj.ProdList[i].MFGDATE =
              this.TrnMainObj.ProdList[i].MFGDATE == null
                ? ""
                : this.TrnMainObj.ProdList[i].MFGDATE.toString().substring(
                  0,
                  10
                );
            this.TrnMainObj.ProdList[i].EXPDATE =
              this.TrnMainObj.ProdList[i].EXPDATE == null
                ? ""
                : this.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10);
          }

          this.ReCalculateBillWithNormal();
          this.getCurrentDate();
          this.Warehouse = this.TrnMainObj.MWAREHOUSE;
          if (
            !this.Warehouse &&
            this.TrnMainObj.ProdList &&
            this.TrnMainObj.ProdList != null &&
            this.TrnMainObj.ProdList.length > 0
          ) {
            this.Warehouse = this.TrnMainObj.ProdList[0].WAREHOUSE;
          }



          this.trnmainBehavior.next(this.TrnMainObj);
        }
      },
      error => {
        this.alertService.error(error);
        this.trnmainBehavior.complete();
      },
      () => this.trnmainBehavior.complete()
    );
    //});
  }

  getItemType() {
    return [
      { label: "FOC", value: "FOC" },
      { label: "FAULTY", value: "FALUTY" }
    ];
  }

  getReceivedType() {
    return [
      { label: "DAMAGED", value: "DAMAGED" },
      { label: "MISSING", value: "MISSING" }
    ];
  }

  nullToZeroConverter(value) {
    if (
      value == undefined ||
      value == null ||
      value == "" ||
      value == "Infinity" ||
      value == "NaN" ||
      isNaN(parseFloat(value))
    ) {
      return 0;
    }
    return parseFloat(value);
  }
  CalculateNormalNew(i) {
    this.prodActiveRowIndex = i;
    let POBJ = this.TrnMainObj.ProdList[i];

    try {
      if (
        this.TrnMainObj.ProdList[i].Quantity == null ||
        this.TrnMainObj.ProdList[i].RATE == null
      )
        return;

      this.TrnMainObj.ProdList[i].AMOUNT =
        this.TrnMainObj.ProdList[i].Quantity *
        this.TrnMainObj.ProdList[i].ALTRATE;
      this.TrnMainObj.ProdList[i].WEIGHT =
        this.TrnMainObj.ProdList[i].CONFACTOR *
        this.TrnMainObj.ProdList[i].Quantity *
        this.nullToZeroConverter(
          this.TrnMainObj.ProdList[i].SELECTEDITEM.GWEIGHT
        );
      if (POBJ.BATCHSCHEME != null) {
        if (POBJ.BATCHSCHEME.discountRateType == 0) {
          this.TrnMainObj.ProdList[i].PROMOTION =
            (POBJ.BATCHSCHEME.schemeDisRate *
              this.TrnMainObj.ProdList[i].AMOUNT) /
            100;
        } else if (POBJ.BATCHSCHEME.discountRateType == 1) {
          this.TrnMainObj.ProdList[i].PROMOTION =
            this.TrnMainObj.ProdList[i].Quantity *
            POBJ.BATCHSCHEME.schemeDisRate;
        } else if (POBJ.BATCHSCHEME.discountRateType == 2) {
          var factor =
            this.TrnMainObj.ProdList[i].Quantity /
            (POBJ.BATCHSCHEME.minQty + POBJ.BATCHSCHEME.schemeDisRate);
          this.TrnMainObj.ProdList[i].PROMOTION =
            Math.floor(factor) *
            this.TrnMainObj.ProdList[i].RATE *
            POBJ.BATCHSCHEME.schemeDisRate;
        }
      }
      if (
        this.TrnMainObj.ProdList[i].INDDISCOUNTRATE != null &&
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].INDDISCOUNTRATE) > 0
      ) {
        this.TrnMainObj.ProdList[i].INDDISCOUNT = (this.TrnMainObj.ProdList[i].AMOUNT *
          this.nullToZeroConverter(this.TrnMainObj.ProdList[i].INDDISCOUNTRATE)) / 100;
        if (this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms") {
          this.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT =
            Math.round(
              ((this.TrnMainObj.ProdList[i].Quantity *
                this.TrnMainObj.ProdList[i].CONFACTOR *
                this.TrnMainObj.ProdList[i].MRP *
                this.nullToZeroConverter(this.TrnMainObj.ProdList[i].INDDISCOUNTRATE)) /
                100) *
              100
            ) / 100;
        }
      } else {
        if (this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
          this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms") {
          if (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT) > 0) {
            this.TrnMainObj.ProdList[i].INDDISCOUNT =
              this.nullToZeroConverter(this.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT) /
              (1 + this.TrnMainObj.ProdList[i].GSTRATE / 100);
          }
        }
      }

      //primary,secondary,liquidition discount calculate
      this.TrnMainObj.ProdList[i].PrimaryDiscount =
        this.TrnMainObj.ProdList[i].BasePrimaryDiscount *
        this.TrnMainObj.ProdList[i].Quantity *
        this.TrnMainObj.ProdList[i].CONFACTOR;
      this.TrnMainObj.ProdList[i].SecondaryDiscount =
        this.TrnMainObj.ProdList[i].BaseSecondaryDiscount *
        this.TrnMainObj.ProdList[i].Quantity *
        this.TrnMainObj.ProdList[i].CONFACTOR;
      this.TrnMainObj.ProdList[i].LiquiditionDiscount =
        this.TrnMainObj.ProdList[i].BaseLiquiditionDiscount *
        this.TrnMainObj.ProdList[i].Quantity *
        this.TrnMainObj.ProdList[i].CONFACTOR;
      this.TrnMainObj.ProdList[i].DISCOUNT =
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].INDDISCOUNT) +
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].PROMOTION) +
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].LOYALTY) +
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].PrimaryDiscount) +
        this.nullToZeroConverter(
          this.TrnMainObj.ProdList[i].SecondaryDiscount
        ) +
        this.nullToZeroConverter(
          this.TrnMainObj.ProdList[i].LiquiditionDiscount
        );

      if (this.TrnMainObj.ProdList[i].ISVAT == 1) {

        this.TrnMainObj.ProdList[i].TAXABLE =
          this.TrnMainObj.ProdList[i].AMOUNT -
          this.TrnMainObj.ProdList[i].DISCOUNT;
        this.TrnMainObj.ProdList[i].NONTAXABLE = 0;
        this.TrnMainObj.ProdList[i].VAT =
          (this.TrnMainObj.ProdList[i].TAXABLE *
            this.TrnMainObj.ProdList[i].GSTRATE) /
          100;

        this.TrnMainObj.ProdList[i].VAT_ONLYFORSHOWING =
          this.TrnMainObj.ProdList[i].TAXABLE -
          this.TrnMainObj.ProdList[i].TAXABLE /
          (1 + this.TrnMainObj.ProdList[i].GSTRATE_ONLYFORSHOWING / 100);
      } else {
        this.TrnMainObj.ProdList[i].TAXABLE = 0;
        this.TrnMainObj.ProdList[i].NONTAXABLE =
          this.TrnMainObj.ProdList[i].AMOUNT -
          this.TrnMainObj.ProdList[i].DISCOUNT;
      }

      //for imported netamount adjustment
      if (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].UPLOADEDNETAMOUNT) > 0 && this.nullToZeroConverter(this.TrnMainObj.ProdList[i].ADJUSTEDAMNT) == 0) {
        this.TrnMainObj.ProdList[i].ADJUSTEDAMNT =
          this.nullToZeroConverter(this.TrnMainObj.ProdList[i].UPLOADEDNETAMOUNT) - (
            this.TrnMainObj.ProdList[i].TAXABLE +
            this.TrnMainObj.ProdList[i].NONTAXABLE +
            this.TrnMainObj.ProdList[i].VAT);
      }
      this.TrnMainObj.ProdList[i].NETAMOUNT =
        this.TrnMainObj.ProdList[i].TAXABLE +
        this.TrnMainObj.ProdList[i].NONTAXABLE +
        this.TrnMainObj.ProdList[i].VAT +
        this.nullToZeroConverter(this.TrnMainObj.ProdList[i].ADJUSTEDAMNT);

    } catch (ex) {
      this.alertService.error("Bill calculation :" + ex);
    }
  }
  CalculateNormal(
    TrnProdObj: TrnProd,
    ServiceTaxRate = this.setting.appSetting.ServiceTaxRate,
    VatRate = this.setting.appSetting.VATRate,
    calcuteDiscount = 0
  ) {
    TrnProdObj.AMOUNT = TrnProdObj.Quantity * TrnProdObj.RATE;
    if (this.setting.appSetting.ENABLEMULTICURRENCY == 1) {
      TrnProdObj.NCRATE = this.curencyConvert(TrnProdObj.RATE);
      TrnProdObj.EXRATE = this.TrnMainObj.EXRATE;
      TrnProdObj.AMOUNT = TrnProdObj.Quantity * TrnProdObj.NCRATE;
    }
    if (calcuteDiscount == 1) {
      if (TrnProdObj.IDIS != null) {
        if (TrnProdObj.IDIS.indexOf("%") < 0) {
          TrnProdObj.INDDISCOUNT = parseFloat(TrnProdObj.IDIS);
        } else {
          var dis = parseFloat(TrnProdObj.IDIS.replace("%", "").trim());
          dis = dis / 100;
          TrnProdObj.INDDISCOUNT = TrnProdObj.AMOUNT * dis;
        }
      }
    }
    TrnProdObj.DISCOUNT =
      this.nullToZeroConverter(TrnProdObj.INDDISCOUNT) +
      this.nullToZeroConverter(TrnProdObj.PROMOTION) +
      this.nullToZeroConverter(TrnProdObj.LOYALTY);
    if (this.nullToZeroConverter(TrnProdObj.ISSERVICECHARGE) == 1) {
      TrnProdObj.SERVICETAX =
        (TrnProdObj.AMOUNT - TrnProdObj.DISCOUNT) * ServiceTaxRate;
    }
    if (TrnProdObj.ISVAT == 1) {
      TrnProdObj.TAXABLE =
        TrnProdObj.AMOUNT -
        TrnProdObj.DISCOUNT +
        this.nullToZeroConverter(TrnProdObj.SERVICETAX);
      TrnProdObj.NONTAXABLE = 0;
      TrnProdObj.VAT = TrnProdObj.TAXABLE * VatRate;
    } else {
      TrnProdObj.TAXABLE = 0;
      TrnProdObj.NONTAXABLE =
        TrnProdObj.AMOUNT -
        TrnProdObj.DISCOUNT +
        this.nullToZeroConverter(TrnProdObj.SERVICETAX);
    }
    TrnProdObj.NETAMOUNT =
      TrnProdObj.TAXABLE + TrnProdObj.NONTAXABLE + TrnProdObj.VAT;
    return TrnProdObj;
  }
  FlatDiscountPercentChange() {

    this.flatDiscountAssign("percent");

  }
  FlatDiscountAmountChange() {

    this.flatDiscountAssign("amount");

  }
  flatDiscountAssign(changeType) {
    if (
      changeType == "percent" &&
      (this.TrnMainObj.DCRATE <= 0 || this.TrnMainObj.DCRATE > 100)
    ) {
      this.TrnMainObj.DCRATE = 0;
    }
    if (changeType == "amount") {
      this.TrnMainObj.DCRATE = 0;
    } else {

    }
    this.ReCalculateBillWithNormal();
  }

  curencyConvert(rate) {
    var C = this.masterService.Currencies.find(
      x => x.CURNAME == this.TrnMainObj.FCurrency
    );
    if (C != null) {
      return C.EXRATE * rate;
    } else return rate;
  }

  ischeckReturnQuantityError(prod: TrnProd): boolean {
    try {
      var pr = this.cnReturnedProdList.find(itm => itm.MCODE == prod.MCODE);
      if (!pr) {
        //there is no such product in return list
        return true;
      }
      let prodarray: TrnProd[] = [];
      this.cnReturnedProdList.forEach(prd => {
        var p: TrnProd;

        if (prodarray != null && prodarray.length > 0) {
          p = prodarray.find(res => res.MCODE == prd.MCODE);
        }
        if (p) {
          p.Quantity += prd.Quantity;
          p.REALQTY_IN += prd.REALQTY_IN;
          if (prd.RATE > p.RATE) {
            p.RATE = prd.RATE;
          }
        } else {
          prodarray.push(prd);
        }
      });
      var tProd = prodarray.find(prd => prd.MCODE == prod.MCODE);
      if (tProd) {
        if (prod.Quantity > tProd.Quantity) {
          return true;
        }
        if (prod.RATE > tProd.RATE) {
          return true;
        }
      }

      return false;
    } catch (ex) {
    }
  }

  resetData() {
    this.TrnMainObj.TRNAC = null;
    this.TrnMainObj.PARAC = null;
    this.TrnMainObj.BILLTO = "";
    this.TrnMainObj.BILLTOADD = "";
    this.TrnMainObj.BILLTOMOB = "";
    this.TrnMainObj.BILLTOTEL = "";
    //  this.TrnMainObj.ProdList = [];
  }
  a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen "
  ];
  b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"
  ];

  decimalToWord(frac) {
    if (parseInt(frac[1]) != 0) {
      return (
        (this.a[Number(frac[1])] ||
          this.b[frac[1][0]] + " " + this.a[frac[1][1]]) + "Paisa Only "
      );
    } else {
      return "";
    }
  }

  digitToWord(num) {
    if (num != null && num != "" && num != undefined) {
      var nums = num.toString().split(".");
      var whole = nums[0];
      let w = ("000000000" + whole)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if ((whole = whole.toString()) != null && (whole = whole.toString()).length > 9) return "Overflow";
      if (nums != null && nums.length == 2) {
        var wholeFraction = nums[1];
        var fraction = wholeFraction.substring(0, 2);
        if (
          fraction == "1" ||
          fraction == "2" ||
          fraction == "3" ||
          fraction == "4" ||
          fraction == "5" ||
          fraction == "6" ||
          fraction == "7" ||
          fraction == "8" ||
          fraction == "9"
        ) {
          fraction = fraction + "0";
        } else if (
          fraction == "01" ||
          fraction == "02" ||
          fraction == "03" ||
          fraction == "04" ||
          fraction == "05" ||
          fraction == "06" ||
          fraction == "07" ||
          fraction == "08" ||
          fraction == "09"
        ) {
          fraction = "09";
          fraction = fraction.substring(1, 2);
        }
        let f = ("00" + fraction).substr(-2).match(/^(\d{2})$/);

        if (!w || !f) return;
        var str = "";
        str +=
          parseInt(w[1]) != 0
            ? (this.a[Number(w[1])] ||
              this.b[w[1][0]] + " " + this.a[w[1][1]]) + "Crore "
            : "";
        str +=
          parseInt(w[2]) != 0
            ? (this.a[Number(w[2])] ||
              this.b[w[2][0]] + " " + this.a[w[2][1]]) + "Lakh "
            : "";
        str +=
          parseInt(w[3]) != 0
            ? (this.a[Number(w[3])] ||
              this.b[w[3][0]] + " " + this.a[w[3][1]]) + "Thousand "
            : "";
        str +=
          parseInt(w[4]) != 0
            ? (this.a[Number(w[4])] ||
              this.b[w[4][0]] + " " + this.a[w[4][1]]) + "Hundred "
            : "";
        str +=
          parseInt(w[5]) != 0
            ? (this.a[Number(w[5])] ||
              this.b[w[5][0]] + " " + this.a[w[5][1]]) +
            "and " +
            this.decimalToWord(f)
            : "";
        return str;
      } else {
        if (!w) return;
        var str = "";
        str +=
          parseInt(w[1]) != 0
            ? (this.a[Number(w[1])] ||
              this.b[w[1][0]] + " " + this.a[w[1][1]]) + "Crore "
            : "";
        str +=
          parseInt(w[2]) != 0
            ? (this.a[Number(w[2])] ||
              this.b[w[2][0]] + " " + this.a[w[2][1]]) + "Lakh "
            : "";
        str +=
          parseInt(w[3]) != 0
            ? (this.a[Number(w[3])] ||
              this.b[w[3][0]] + " " + this.a[w[3][1]]) + "Thousand "
            : "";
        str +=
          parseInt(w[4]) != 0
            ? (this.a[Number(w[4])] ||
              this.b[w[4][0]] + " " + this.a[w[4][1]]) + "Hundred "
            : "";
        str +=
          parseInt(w[5]) != 0
            ? (this.a[Number(w[5])] ||
              this.b[w[5][0]] + " " + this.a[w[5][1]]) + "Only "
            : "";
        return str;
      }
    }
  }

  setDefaultValueInTransaction() {
    if (this.TrnMainObj.MWAREHOUSE == null || this.TrnMainObj.MWAREHOUSE == "") { this.TrnMainObj.MWAREHOUSE = this.userProfile.userWarehouse; }

    this.TrnMainObj.BRANCH = this.userProfile.userBranch;
    this.TrnMainObj.DIVISION = this.userProfile.userDivision;

    this.TrnMainObj.ProdList.forEach(prod => {
      prod.WAREHOUSE = this.TrnMainObj.MWAREHOUSE;
      prod.BRANCH = this.TrnMainObj.BRANCH;
      //   prod.Supplier=this.TrnMainObj.PARAC;
    });
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
      var settlementmode = this.settlementList.filter(
        x => x.DESCRIPTION == this.TrnMainObj.TRNMODE
      )[0];
      if (settlementmode == null) {
        this.alertService.warning("Settlement Mode not found.");
        return false;
      }
      for (let i of this.TrnMainObj.ProdList) {
        if (settlementmode.DECREASE == 0) {
          i.REALQTY_IN = i.RealQty;
          i.ALTQTY_IN = i.AltQty;
          i.RealQty = 0;
          i.AltQty = 0;
        } else if (settlementmode.DECREASE == 1) {
          i.REALQTY_IN = 0;
          i.ALTQTY_IN = 0;
          // i.RealQty = i.Quantity;
          // i.AltQty = i.Quantity;
        }
        // if (settlementmode.DECREASE == 0) {
        //   i.REALQTY_IN = i.Quantity;
        //   i.ALTQTY_IN = i.Quantity;
        //   i.RealQty = 0;
        //   i.AltQty = 0;
        // } else if (settlementmode.DECREASE == 1) {
        //   i.REALQTY_IN = 0;
        //   i.ALTQTY_IN = 0;
        //   i.RealQty = i.Quantity;
        //   i.AltQty = i.Quantity;
        // }
      }

    } else if (
      (this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn && this.TrnMainObj.tag != "FROMTRANSFERRED") ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferOut
    ) {
      this.TrnMainObj.BILLTO = this.TrnMainObj.DIVISION;
    }

    if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice)) {
      var StockVAlidateItem = this.TrnMainObj.ProdList.filter(x => x.RealQty == 0 ? x.REALQTY_IN : x.RealQty > x.STOCK && x.STOCK > 0 && (x.SELECTEDITEM == null ? 0 : x.SELECTEDITEM.ALLOWNEGATIVE) != 1)[0];
      if (StockVAlidateItem != null) {

        this.alertService.error("Inserted Quantity is greater than its Stock on item :" + StockVAlidateItem.ITEMDESC);
        return false;
      }
    }

    return true;
  }
  checkTransactionValidation() {
    if (this.AppSettings.ENABLEBILLLOCKING && this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      if (this.TrnMainObj.BILLINGSTATUS == null) {
        this.TrnMainObj.BILLINGSTATUS = 'TRUE';
      }
      if (this.TrnMainObj.BILLINGSTATUS.toUpperCase() == "FALSE" && (this.TrnMainObj.REMARKS == null || this.TrnMainObj.REMARKS == undefined || this.TrnMainObj.REMARKS == "")) {
        this.alertService.error(`Remarks is required`);
        return;
      }
    }


    if (this.TrnMainObj.Mode == "VIEW" && this.TrnMainObj.VoucherType != VoucherTypeEnum.TaxInvoiceCancel) {
      if (this.TrnMainObj.VoucherType != VoucherTypeEnum.ReceiptNoteCancel) {
        this.alertService.warning("Can Not save View Voucher");
        return false;
      }

    }

    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
      if (this.TrnMainObj.TRNMODE == null) {
        this.alertService.error("Return Mode not detected...");
        return false;
      }

      if (this.TrnMainObj.TRNMODE.toLowerCase() == "credit") {
        if (this.TrnMainObj.PARAC == null) {
          this.alertService.error("Party not detected on credit return mode...");
          return false;
        }
        this.TrnMainObj.TRNAC = this.TrnMainObj.PARAC;
      }
      else if (this.TrnMainObj.TRNMODE.toLowerCase() == "cash") {

        this.TrnMainObj.TRNAC = this.AppSettings.CashAc;
      } else if (this.TrnMainObj.TRNMODE.toLowerCase() == "return_note") {
        this.TrnMainObj.TRNAC = this.AppSettings.RETURN_NOTE;
      }
      else {
        this.alertService.error("Invalid Return Mode...");
        return false;
      }
    }

    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) {
      if (
        this.TrnMainObj.BILLTO == null ||
        this.TrnMainObj.BILLTO == undefined ||
        this.TrnMainObj.BILLTO == ""
      ) {
        this.alertService.warning("Warehouse From field is not detected.");
        return false;
      }
      if (
        this.TrnMainObj.BILLTOADD == null ||
        this.TrnMainObj.BILLTOADD == undefined ||
        this.TrnMainObj.BILLTOADD == ""
      ) {
        this.alertService.warning("Warehouse To field is not detected.");
        return false;
      }
      if (this.TrnMainObj.BILLTOADD == this.TrnMainObj.BILLTO) {
        this.alertService.warning("You cannot transfer to same Warehouse");
        return false;
      }
    } else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
    ) {
      if (this.TrnMainObj.TRNAC == null || this.TrnMainObj.TRNAC == "") {
        this.alertService.warning("Please select Transaction account");
        return false;
      }
    }

    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {

      if (this.TrnMainObj.AdditionalObj.tag == "SALES_INVOICE_FROM_HOLDRECALL" && this.TrnMainObj.PhiscalID != this.masterService.userProfile.CompanyInfo.PhiscalID) {
        this.alertService.error("Bill cannot be saved.Bill is being recalled of different Phiscal Year.");
        return false;
      }
    }


    if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote
    ) {
      let expitem = this.TrnMainObj.ProdList.filter(x => new Date(x.EXPDATE) < new Date(new Date().setDate(new Date().getDate() - 1)) && x.MCODE != null && x.EXPDATE != null)[0];

      if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && this.AppSettings.ENABLEEXPIREDRETURNINSALES == true) || (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && this.AppSettings.ENABLEEXPIREDRETURNINPURCHASE == true)) {

      } else {
        if (expitem != null) {
          this.alertService.warning("Expired Item Detected with code : " + expitem.MCODE + "..Please Review the list...");
          return false;
        }
      }





      let c2 = this.TrnMainObj.ProdList.filter(x => new Date(x.MFGDATE) > new Date() && x.MCODE != null && x.MFGDATE != null)[0];
      if (c2 != null) {
        this.alertService.warning(
          "Invalid Manufacture Date Item Detected with code:" + c2.MCODE + "..Please Review the list..."
        );
        return false;
      }
      try {

        if (this.AppSettings.ALLOWDECIMALINQUANTITY) {
          let InvalidQuantity = this.TrnMainObj.ProdList.filter(x => x.Quantity < 0)[0];
          if (InvalidQuantity != null) {
            this.alertService.error("Invalid Quantity Detected in Item:" + InvalidQuantity.MCODE);
            return false;
          }
        } else {
          let InvalidQuantity = this.TrnMainObj.ProdList.filter(x => x.Quantity < 1 || x.Quantity.toString().indexOf(".") !== -1)[0];
          if (InvalidQuantity != null) {
            this.alertService.error("Invalid Quantity Detected in Item:" + InvalidQuantity.MCODE);
            return false;
          }
        }


      } catch (error) {
      }


      if (this.AppSettings.ALLOWDECIMALINQUANTITY) {
        if (
          this.TrnMainObj.ProdList.some(
            x => x.MCODE != null && this.nullToZeroConverter(x.Quantity) < 0
          )
        ) {
          this.alertService.warning(
            "Invalid Entry With Invalid Quantity Detected.Please Check the Item Entry. "
          );
          return false;
        }
      } else {
        if (
          this.TrnMainObj.ProdList.some(
            x => x.MCODE != null && this.nullToZeroConverter(x.Quantity) < 1
          )
        ) {
          this.alertService.warning(
            "Invalid Entry With Invalid Quantity Detected.Please Check the Item Entry. "
          );
          return false;
        }
      }


    }
    if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) && this.TrnMainObj.Mode.toUpperCase() == "NEW") {
      var StockVAlidateItem = this.TrnMainObj.ProdList.filter(x => x.RealQty > x.STOCK && x.STOCK > 0 && (x.SELECTEDITEM == null ? 0 : x.SELECTEDITEM.ALLOWNEGATIVE) != 1)[0];

      if (StockVAlidateItem != null) {
        for (let i of this.TrnMainObj.ProdList) {
          if (i.RealQty > i.STOCK && i.STOCK > 0) {
            i.backgroundcolor = "red";
          }
          else {
            i.backgroundcolor = "white";
          }
        }
        this.alertService.error("Inserted Quantity is greater than its Stock on item :" + StockVAlidateItem.ITEMDESC);
        return false;
      }
      if (this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        for (let x of this.TrnMainObj.ProdList) {
          if (x.Ptype == 10 || x.Ptype == 15 || x.Ptype == 8 || (x.SELECTEDITEM == null ? 0 : x.SELECTEDITEM.ALLOWNEGATIVE) == 1) continue;
          //while edit stock doesnot load it will be backend validation
          if ((this.nullToZeroConverter(x.STOCK) - this.nullToZeroConverter(x.HOLDINGSTOCK)) > 0) {
            if (this.nullToZeroConverter(x.RealQty) > (this.nullToZeroConverter(x.STOCK) - this.nullToZeroConverter(x.HOLDINGSTOCK))) {
              this.alertService.warning(`Stock is not avilable for item ${x.ITEMDESC}::${x.MCODE}.Holding Stock:${x.HOLDINGSTOCK}.Available Stock:` + x.STOCK);
              return false;
            }
          }
        }

      }
    }
    return true;
  }

  initialFormLoad(voucherType) {


    // if (voucherType == VoucherTypeEnum.TaxInvoice || voucherType == VoucherTypeEnum.CreditNote || voucherType == VoucherTypeEnum.DebitNote || voucherType == VoucherTypeEnum.Purchase || voucherType == VoucherTypeEnum.MaterialReceipt) {
    if (this._userwisegridconf.resolveAndLoadConfiguration(voucherType)) {
      this.userwiseTransactionFormConf = this._userwisegridconf.resolveAndLoadConfiguration(voucherType).columns;
    }
    this.masterService.masterGetmethod_NEW(`/getGridConfiguration?voucherType=${voucherType}`).subscribe((res) => {
      if (res.status == "ok") {
        this.userwiseTransactionFormConf = res.result.columns;
      }
    }, error => {

    })

    if (this.AppSettings.SERVERSIDEITEMFETCHINSALES == 1) {

    }
    else {
      this.masterService.getMcodeWiseStockList().subscribe(x => {
        this.masterService.MCODEWISE_ITEMSTOCKLIST = x;
      })
    }
    this.TrnMainObj = <TrnMain>{};
    this.TrnMainObj.TRNSCHEMEAPPLIED = [];
    this.showPerformaApproveReject = false;
    this.showRecallCancel = false;
    this.TrnMainObj.AdditionalObj = <TrnMain_AdditionalInfo>{};
    this.TrnMainObj.TransporterEway = <Transporter_Eway>{};
    this.TrnMainObj.shipToDetail = <SHIPTODETAIL>{};
    this.TrnMainObj.TrntranList = [];
    this.TrnMainObj.Mode = "NEW";
    this.TrnMainObj.DIVISION = this.userProfile.userDivision;
    this.TrnMainObj.MWAREHOUSE = this.userProfile.userWarehouse;
    this.TrnMainObj.PhiscalID = this.userProfile.CompanyInfo.PhiscalID;
    const uuidV1 = require('uuid/v1');
    this.TrnMainObj.guid = uuidV1();
    switch (voucherType) {
      case VoucherTypeEnum.PurchaseOrder:
        this.TrnMainObj.VoucherPrefix = "PO";
        this.TrnMainObj.VoucherAbbName = "PO";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PurchaseOrder;
        this.pageHeading = "Purchase Order";
        break;
      case VoucherTypeEnum.RFQ:
        this.TrnMainObj.VoucherPrefix = "RFQ";
        this.TrnMainObj.VoucherAbbName = "RFQ";
        this.TrnMainObj.VoucherName = "RequestForQuotation"
        this.TrnMainObj.VoucherType = VoucherTypeEnum.RFQ;
        this.pageHeading = "RFQ";
        this.TrnMainObj.SupplierListForRfq = [];
        break;
      case VoucherTypeEnum.Purchase:
        this.TrnMainObj.VoucherPrefix = "PI";
        this.TrnMainObj.VoucherAbbName = "PI";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Purchase;
        this.TrnMainObj.AdditionalObj.TRNTYPE = "local";
        this.pageHeading = "Purchase Invoice";
        break;
      case VoucherTypeEnum.SalesOrder:
        this.TrnMainObj.VoucherPrefix = "SO";
        this.TrnMainObj.VoucherAbbName = "SO";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.SalesOrder;
        this.voucherNoHeader = "SO No";
        this.pageHeading = "Sales Order";
        this.TrnMainObj.INVOICETYPE = "TAX INVOICE";
        break;
      case VoucherTypeEnum.Sales:
        this.TrnMainObj.VoucherPrefix = "SI";
        this.TrnMainObj.VoucherAbbName = "SI";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Sales;
        this.pageHeading = "Sales Invoice";
        break;
      case VoucherTypeEnum.TaxInvoice:
        this.userProfile = this.authservice.getUserProfile();
        if (this.AppSettings.enableMultiSeriesInSales != 1) {
          this.TrnMainObj.VoucherPrefix = "TI";
        }
        this.TrnMainObj.VoucherAbbName = "TI";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.TaxInvoice;
        this.pageHeading = "Tax Invoice";
        this.TrnMainObj.AdditionalObj.TRNTYPE = "local";
        this.TrnMainObj.INVOICETYPE = "TAX INVOICE";
        this.posPrintCount = this.nullToZeroConverter(this.userProfile.TotalPrint);
        break;
      case VoucherTypeEnum.StockIssue:
        this.TrnMainObj.VoucherPrefix = "IS";
        this.TrnMainObj.VoucherAbbName = "IS";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.StockIssue;
        this.pageHeading = "Stock Issue";
        break;
      case VoucherTypeEnum.StockSettlement:
        this.TrnMainObj.VoucherPrefix = "DM";
        this.TrnMainObj.VoucherAbbName = "DM";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.StockSettlement;
        this.pageHeading = "Stock Settlement";
        break;
      case VoucherTypeEnum.OpeningStockBalance:
        this.TrnMainObj.VoucherPrefix = "OP";
        this.TrnMainObj.VoucherAbbName = "OP";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.OpeningStockBalance;
        this.pageHeading = "Opening Stock Entry";
        break;
      case VoucherTypeEnum.BranchTransferIn:
        this.TrnMainObj.VoucherPrefix = "TR";
        this.TrnMainObj.VoucherAbbName = "TR";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.BranchTransferIn;
        this.pageHeading = "Transfer In";
        this.formName = "Transfer In";
        break;
      case VoucherTypeEnum.BranchTransferOut:
        this.TrnMainObj.VoucherPrefix = "TO";
        this.TrnMainObj.VoucherAbbName = "TO";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.BranchTransferOut;
        this.pageHeading = "Transfer Out";
        this.formName = "Transfer Out";
        break;
      case VoucherTypeEnum.PerformaSalesInvoice:
        this.TrnMainObj.VoucherPrefix = "PP";
        this.TrnMainObj.VoucherAbbName = "PP";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PerformaSalesInvoice;
        this.pageHeading = "Proforma Invoice";
        this.TrnMainObj.INVOICETYPE = "TAX INVOICE";
        break;
      case VoucherTypeEnum.DeliveryChallaan:
        this.TrnMainObj.VoucherPrefix = "DY";
        this.TrnMainObj.VoucherAbbName = "DY";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.DeliveryChallaan;
        this.pageHeading = "Delivery Challaan";
        this.TrnMainObj.INVOICETYPE = "TAX INVOICE";
        break;
      case VoucherTypeEnum.QuotationInvoice:
        this.TrnMainObj.VoucherPrefix = "QT";
        this.TrnMainObj.VoucherAbbName = "QT";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.QuotationInvoice;
        this.pageHeading = "Quotation Invoice";
        break;
      case VoucherTypeEnum.PurchaseOrderCancel:
        this.TrnMainObj.VoucherPrefix = "PC";
        this.TrnMainObj.VoucherAbbName = "PC";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PurchaseOrderCancel;
        this.pageHeading = "PO Cancel";
        break;
      case VoucherTypeEnum.RequestIndent:
        this.TrnMainObj.VoucherPrefix = "IN";
        this.TrnMainObj.VoucherAbbName = "IN";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.RequestIndent;
        this.pageHeading = " Request";
        break;

      case VoucherTypeEnum.InterCompanyTransferIn:
        this.TrnMainObj.VoucherPrefix = "IR";
        this.TrnMainObj.VoucherAbbName = "IR";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.InterCompanyTransferIn;
        this.pageHeading = "Inter Company Transfer In";
        this.formName = "Inter Company Transfer In";

        break;

      case VoucherTypeEnum.InterCompanyTransferOut:
        this.TrnMainObj.VoucherPrefix = "IC";
        this.TrnMainObj.VoucherAbbName = "IC";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.InterCompanyTransferOut;
        this.pageHeading = "Inter Company Transfer Out";
        this.formName = "Inter Company Transfer Out";
        break;


      case VoucherTypeEnum.DebitNote:
        this.TrnMainObj.VoucherPrefix = "DN";
        this.TrnMainObj.VoucherAbbName = "DN";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.DebitNote;
        this.pageHeading = "Debit Note";
        this.TrnMainObj.TrntranList = [];
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.CreditNote:
        this.TrnMainObj.VoucherPrefix = "CN";
        this.TrnMainObj.VoucherAbbName = "CN";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.CreditNote;
        this.pageHeading = "Sales Return";
        this.TrnMainObj.INVOICETYPE = "TAX INVOICE";
        this.voucherNoHeader = "Return No";
        this.TrnMainObj.TrntranList = [];
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.ContraVoucher:
        this.TrnMainObj.VoucherPrefix = "CE";
        this.TrnMainObj.VoucherAbbName = "CE";
        this.TrnMainObj.VoucherType = VoucherTypeEnum.ContraVoucher;
        this.pageHeading = "Contra Voucher";
        this.TrnMainObj.TrntranList = [];
        this.addRowForTransaction(-1);
        break;

      //configuration
      case VoucherTypeEnum.AccountOpeningBalance:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.AccountOpeningBalance;
        this.pageHeading = "Account Opening Balance";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "OB";
        this.TrnMainObj.VoucherAbbName = "OB";
        this.TrnMainObj.VoucherName = "OBBILL";
        this.addRowForTransaction(-1);
        break;

      case VoucherTypeEnum.PartyOpeningBalance:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.PartyOpeningBalance;
        this.pageHeading = "Party Opening Balance";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "AO";
        this.TrnMainObj.VoucherAbbName = "AO";
        this.TrnMainObj.VoucherName = "OPPARTYBILL";
        this.addRowForTransaction(-1);
        break;
      case VoucherTypeEnum.ReceiptNote:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.ReceiptNote;
        this.pageHeading = "Receipt Note";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "RN";
        this.TrnMainObj.VoucherAbbName = "RN";
        this.TrnMainObj.VoucherName = "RECEIPTNOTE";
        this.TrnMainObj.MWAREHOUSE = "Temp Warehouse"
        break;
      case VoucherTypeEnum.Repack:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Repack;
        this.pageHeading = "Repack Entry";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "PK";
        this.TrnMainObj.VoucherAbbName = "PK";
        this.TrnMainObj.TRNMODE = "NEW";
        this.TrnMainObj.VoucherName = "REPACK";
        this.TrnMainObj.MWAREHOUSE = this.userProfile.userWarehouse
        break;
      case VoucherTypeEnum.Production:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.Production;
        this.pageHeading = "Production Entry";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "PD";
        this.TrnMainObj.VoucherAbbName = "PD";
        this.TrnMainObj.TRNMODE = "NEW";
        this.TrnMainObj.VoucherName = "Production";
        this.TrnMainObj.MWAREHOUSE = this.userProfile.userWarehouse
        break;
      case VoucherTypeEnum.MaterialReceipt:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.MaterialReceipt;
        this.pageHeading = "Material Receipt";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "MR";
        this.TrnMainObj.VoucherAbbName = "MR";
        this.TrnMainObj.VoucherName = "MATERIAL RECEIPT";
        this.TrnMainObj.MWAREHOUSE = "Quality Warehouse"
        this.formName = "Material Receipt";
        break;
      case VoucherTypeEnum.ReceipeEstimate:
        this.TrnMainObj.VoucherType = VoucherTypeEnum.ReceipeEstimate;
        this.pageHeading = "Production Target";
        this.TrnMainObj.TrntranList = [];
        this.TrnMainObj.VoucherPrefix = "ES";
        this.TrnMainObj.VoucherAbbName = "ES";
        this.TrnMainObj.VoucherName = "Production Target";
        this.TrnMainObj.MWAREHOUSE = this.userProfile.userWarehouse;
        break;
    }
    this.getCurrentDate();
    if (this.TrnMainObj.VoucherPrefix == "" || this.TrnMainObj.VoucherPrefix == null) { } else {
      this.getVoucherNumber();
    }
    this.TrnMainObj.AdditionalObj.CREATION_TYPE = "MANUAL_" + this.TrnMainObj.VoucherPrefix;
    if (this.TrnMainObj.VoucherType == 58)
      return;
    this.addRow();
  }

  getVoucherNumber() {
    this.masterService.getVoucherNo(this.TrnMainObj).subscribe(res => {
      if (res.status == "ok") {
        let TMain = <TrnMain>res.result;
        this.TrnMainObj.VCHRNO = TMain.VCHRNO;
        this.TrnMainObj.CHALANNO = TMain.CHALANNO;
        this.TrnMainObj.PhiscalID = this.userProfile.CompanyInfo.PhiscalID;
        this.TrnMainObj.VoucherPrefix = TMain.VoucherPrefix;
      } else {
        alert("Failed to retrieve VoucherNo");
      }
    });
  }
  getVoucherNumberForReceiptnote() {
    this.TrnMainObj.MWAREHOUSE = "Temp Warehouse";
    this.masterService.getVoucherNo(this.TrnMainObj).subscribe(res => {
      if (res.status == "ok") {
        let TMain = <TrnMain>res.result;
        this.TrnMainObj.VCHRNO = TMain.VCHRNO;
        this.TrnMainObj.CHALANNO = TMain.CHALANNO;
        this.TrnMainObj.CHALANNO = TMain.CHALANNO;
        this.TrnMainObj.MWAREHOUSE = "Temp Warehouse";
        TMain.MWAREHOUSE = "Temp Warehouse";
      } else {
        alert("Failed to retrieve VoucherNo");
      }
    });
  }
  getCurrentDate() {
    this.masterService.getCurrentDate().subscribe(
      date => {
        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
          if (this.userProfile.CompanyInfo.ORG_TYPE == 'retailer' ||
            this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
            this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
            this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms") {
            this.TrnMainObj.DeliveryDate = date.Date.substring(0, 10);
          }
        }
        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.RFQ) {
          this.TrnMainObj.RFQValidity = date.Date.substring(0, 10);
          this.TrnMainObj.ExpDate = date.Date.substring(0, 10);

        }
        if (this.masterService.isInventryYearEnd == 2) {
          if (this.userProfile.PreviousFiscalYearInfo != null && this.userProfile.PreviousFiscalYearInfo != undefined) {
            this.TrnMainObj.PhiscalID = this.userProfile.PreviousFiscalYearInfo.PhiscalID;
            this.TrnMainObj.TRNDATE = this.userProfile.PreviousFiscalYearInfo.EndDate.substring(0, 10);
            this.TrnMainObj.TRN_DATE = this.userProfile.PreviousFiscalYearInfo.EndDate.substring(0, 10);
          }
        } else {
          this.TrnMainObj.TRNDATE = date.Date.substring(0, 10);
          this.TrnMainObj.TRN_DATE = this.TrnMainObj.TRN_DATE == null ? date.Date.substring(0, 10) : this.TrnMainObj.TRN_DATE.toString().substring(0, 10);

        }
      },
      error => {
        this.masterService.resolveError(error, "voucher-date - getCurrentDate");
      }
    );
  }



  addRow() {

    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement && this.activeurlpath == 'StockSettlementEntryApproval') {
      return false;
    }
    try {
      if (this.TrnMainObj.ProdList == null) {
        this.TrnMainObj.ProdList = [];
      }
      if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
        if (
          this.TrnMainObj.ProdList.some(
            x => new Date(x.MFGDATE) > new Date() && x.MCODE != null
          )
        ) {
          this.alertService.warning(
            "Invalid Manufacture Date Item Detected..Please Review the list..."
          );
          return false;
        }
      }
      if (
        this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
      ) {

        let expitem = this.TrnMainObj.ProdList.filter(x => new Date(x.EXPDATE) < new Date(new Date().setDate(new Date().getDate() - 1)) && x.MCODE != null && x.EXPDATE != null)[0];


        if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && this.AppSettings.ENABLEEXPIREDRETURNINSALES == true) || (this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && this.AppSettings.ENABLEEXPIREDRETURNINPURCHASE == true)) {

        } else {
          if (expitem != null) {
            this.alertService.warning("Expired Item Detected with code : " + expitem.MCODE + "..Please Review the list...");
            return false;
          }
        }


        if (
          this.TrnMainObj.ProdList.some(
            x => new Date(x.MFGDATE) > new Date() && x.MCODE != null && x.MFGDATE != null
          )
        ) {
          this.alertService.warning(
            "Invalid Manufacture Date Item Detected..Please Review the list..."
          );
          return false;
        }
        if (
          this.TrnMainObj.ProdList.some(
            x => x.MCODE != null && this.nullToZeroConverter(x.Quantity) < 0
          )
        ) {
          this.alertService.warning(
            "Invalid Entry With Invalid Quantity Detected.Please Check the Item Entry. "
          );
          return false;
        }
      }



      //HOLDING STOCK VALIDATION BLOCK
      if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
        if (this.TrnMainObj.TRNMODE != null && this.TrnMainObj.TRNMODE != undefined && this.TrnMainObj.TRNMODE != "" && this.TrnMainObj.TRNMODE.toUpperCase() != "EXCESS") {
          for (let x of this.TrnMainObj.ProdList) {
            if (this.nullToZeroConverter(x.RealQty) > (this.nullToZeroConverter(x.STOCK) - this.nullToZeroConverter(x.HOLDINGSTOCK))) {
              this.alertService.warning(`Stock is not avilable for item ${x.ITEMDESC}::${x.MCODE}.Holding Stock:${x.HOLDINGSTOCK}.Available Stock:` + x.STOCK);
              return false;
            }
          }
        }

      } else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
        for (let x of this.TrnMainObj.ProdList) {
          if (this.TrnMainObj.Mode.toUpperCase() == "NEW") {
            if (x.Ptype == 10 || x.Ptype == 15 || x.Ptype == 8 || (x.SELECTEDITEM == null ? 0 : x.SELECTEDITEM.ALLOWNEGATIVE) == 1) continue;
            if (this.nullToZeroConverter(x.RealQty) > (this.nullToZeroConverter(x.STOCK) - this.nullToZeroConverter(x.HOLDINGSTOCK))) {
              this.alertService.warning(`Stock is not avilable for item ${x.ITEMDESC}::${x.MCODE}.Holding Stock:${x.HOLDINGSTOCK}.Available Stock:` + x.STOCK);
              return false;
            }
          }
          else {
            //while edit stock doesnot load it will be backend validation
            if ((this.nullToZeroConverter(x.STOCK) - this.nullToZeroConverter(x.HOLDINGSTOCK)) > 0) {
              if (this.nullToZeroConverter(x.RealQty) > (this.nullToZeroConverter(x.STOCK) - this.nullToZeroConverter(x.HOLDINGSTOCK))) {
                this.alertService.warning(`Stock is not avilable for item ${x.ITEMDESC}::${x.MCODE}.Holding Stock:${x.HOLDINGSTOCK}.Available Stock:` + x.STOCK);
                return false;
              }
            }
          }
        }
      }
      //END OF HOLDING STOCK VALIDATION BLOCK

      if (this.TrnMainObj.ProdList.some(x => x.MCODE == null && x.MENUCODE == null)) { return true; }

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
      newRow.BULKITEM = <BULKITEM>{};
      newRow.TransactionHistory = [];
      this.TrnMainObj.ProdList.push(newRow);
      return true;
    } catch (ex) {
      //this.alertService.error(ex);
      return false;
    }
  }

  loadSODataToSales(VCHR) {
    this.masterService
      .masterPostmethod("/getSalesBillFromSO", { REFBILL: VCHR })
      .subscribe(
        data => {
          if (data.status == "ok") {
            this.TrnMainObj = data.result;
            // this.TrnMainObj.Mode = "VIEW";
            // this.ReCalculateBill();

            this.trnmainBehavior.next(this.TrnMainObj);
          }
        },
        error => {
          this.trnmainBehavior.complete();
        },
        () => this.trnmainBehavior.complete()
      );
    //});
  }

  RealQuantitySet(i, CONFACTOR: number) {
    this.prodActiveRowIndex = i;
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoiceCancel) {
      return;
    }
    if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryReturn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.GoodsReceived ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.RFQ ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferIn
    ) {
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].REALQTY_IN = (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity)) * CONFACTOR;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity);
      this.TrnMainObj.ProdList[i].RealQty = 0;
      this.TrnMainObj.ProdList[i].AltQty = 0;
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
    }
    else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
      this.TrnMainObj.ProdList[i].REALQTY_IN = (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity)) * CONFACTOR;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity);

      this.TrnMainObj.ProdList[i].RealQty = (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].AltQty)) * CONFACTOR;
      this.TrnMainObj.ProdList[i].AltQty = this.nullToZeroConverter(this.TrnMainObj.ProdList[i].AltQty);

      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
    }
    else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Sales ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseReturn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Delivery ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferOut ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOut
    ) {
      //alert("DispatchOut")
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].RealQty = (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity)) * CONFACTOR;
      this.TrnMainObj.ProdList[i].AltQty = (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity));
      this.TrnMainObj.ProdList[i].REALQTY_IN = 0;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = 0;
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
    }
    else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance
    ) {
      if (this.TrnMainObj.ProdList[i].Quantity > 0) {
        //.CONFACTOR *
        this.TrnMainObj.ProdList[i].REALQTY_IN = (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity)) * CONFACTOR;
        this.TrnMainObj.ProdList[i].ALTQTY_IN = this.TrnMainObj.ProdList[i].Quantity;
        this.TrnMainObj.ProdList[i].RealQty = 0;
        this.TrnMainObj.ProdList[i].AltQty = 0;
        this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
      }
      else if (this.TrnMainObj.ProdList[i].Quantity < 0) {
        // .CONFACTOR *
        this.TrnMainObj.ProdList[i].RealQty =
          -1 * (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity)) * CONFACTOR;
        this.TrnMainObj.ProdList[i].AltQty =
          -1 * (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity));
        this.TrnMainObj.ProdList[i].REALQTY_IN = 0;
        this.TrnMainObj.ProdList[i].ALTQTY_IN = 0;
        this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
      }
    }
    else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
      this.TrnMainObj.ProdList[i].REALQTY_IN =
        this.nullToZeroConverter((this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity))) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = this.TrnMainObj.ProdList[
        i
      ].Quantity;
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].RealQty =
        this.nullToZeroConverter((this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity))) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].AltQty = (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity));
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;

    }
    else if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrderCancel
    ) {

      this.TrnMainObj.ProdList[i].REALQTY_IN =
        (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity)) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = this.TrnMainObj.ProdList[
        i
      ].Quantity;
      //.CONFACTOR *
      this.TrnMainObj.ProdList[i].RealQty =
        (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) + this.nullToZeroConverter(this.TrnMainObj.ProdList[i].FreeQuantity)) *
        CONFACTOR;
      this.TrnMainObj.ProdList[i].AltQty = this.TrnMainObj.ProdList[i].Quantity;
      this.TrnMainObj.ProdList[i].VoucherType = this.TrnMainObj.VoucherType;
      this.TrnMainObj.ProdList[i].REALQTY_IN = 0;
      this.TrnMainObj.ProdList[i].ALTQTY_IN = 0;
    } else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Repack) {

    }
    else {
      alert("Vouchertype not found please contact admin.");
    }
  }

  setunit(baseRate: number, baseRate2: number, activerowIndex, altunitObj) {

    if (altunitObj == null) {
      altunitObj = <any>{};
      altunitObj.CONFACTOR = 1;
    }
    this.prodActiveRowIndex = activerowIndex;
    this.TrnMainObj.ProdList[activerowIndex].CONFACTOR = altunitObj.CONFACTOR;
    this.TrnMainObj.ProdList[activerowIndex].ALTUNIT = altunitObj.ALTUNIT;
    this.TrnMainObj.ProdList[activerowIndex].UNIT = altunitObj.BASEUOM;
    this.TrnMainObj.ProdList[activerowIndex].RATE = baseRate;
    this.TrnMainObj.ProdList[activerowIndex].REALRATE = baseRate;
    this.TrnMainObj.ProdList[activerowIndex].ALTRATE = baseRate * altunitObj.CONFACTOR;
    this.TrnMainObj.ProdList[activerowIndex].ALTRATE2 = baseRate2 * altunitObj.CONFACTOR;
    this.TrnMainObj.ProdList[activerowIndex].ALT_ORIGINALTRANRATE = this.TrnMainObj.ProdList[activerowIndex].ORIGINALTRANRATE * altunitObj.CONFACTOR;
    this.TrnMainObj.ProdList[activerowIndex].ALTMRP = this.TrnMainObj.ProdList[activerowIndex].MRP * altunitObj.CONFACTOR;


    this.RealQuantitySet(activerowIndex, altunitObj.CONFACTOR);
  }
  setAltunitDropDownForView(activerowIndex) {
    this.prodActiveRowIndex = activerowIndex;
    if (this.TrnMainObj.ProdList[activerowIndex].Ptype == 10) {
      //service item like delivery charges
    }
    else {
      if (this.TrnMainObj.ProdList[activerowIndex].ALTUNIT == null) { }
      this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj =
        this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(
          x => (x.ALTUNIT == null ? '' : x.ALTUNIT).toLowerCase() == (this.TrnMainObj.ProdList[activerowIndex].ALTUNIT == null ? '' : this.TrnMainObj.ProdList[activerowIndex].ALTUNIT).toLowerCase()
        )[0];
    }
  }

  setAltunitDropDownForViewStock(activerowIndex) {
    this.prodActiveRowIndex = activerowIndex;
    this.masterService.masterGetmethod(
      "/getAltUnitsOfItem/" + this.TrnMainObj.ProdList[activerowIndex].MCODE
    );
    // .subscribe(res => {
    //   if(res.status = "ok"){
    //     this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits = JSON.parse(res.result);

    //   }
    // })

    this.TrnMainObj.ProdList[
      activerowIndex
    ].ALTUNITObj = this.TrnMainObj.ProdList[
      activerowIndex
    ].Product.AlternateUnits.filter(
      x => x.ALTUNIT.toLowerCase() == this.TrnMainObj.ProdList[activerowIndex].ALTUNIT.toLowerCase()
    );
  }

  // getStockSettlementItemUnit(activerowIndex){
  //   this.masterService.masterGetmethod("getAluUnitsOfItem/")
  //   .subscribe(res => {
  //     if(res.status = "ok"){
  //       this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits = JSON.parse(res.result);
  //     }
  //   })
  // }

  getPricingOfItem(
    activerowIndex,
    batchcode = "",
    getAltunitListFromApi = true,
    prate = 0
  ) {
    this.prodActiveRowIndex = activerowIndex;
    var getpricingObj = {
      mcode: this.TrnMainObj.ProdList[activerowIndex].MCODE,
      batchcode: batchcode,
      MRP: this.TrnMainObj.ProdList[activerowIndex].MRP,
      GST: this.TrnMainObj.ProdList[activerowIndex].GSTRATE
        ? this.TrnMainObj.ProdList[activerowIndex].GSTRATE / 100
        : 0,
      SRate: 0,
      PRate: 0,
      Party: this.TrnMainObj.PARAC,
      rateType: this.TrnMainObj.ProdList[activerowIndex].Mcat
    };

    this.masterService
      .masterPostmethod("/getBatchwiseItemPriceanddiscounts", getpricingObj)
      .subscribe(res => {
        if (res.status == "ok") {

          // this.AssignSellingPriceAndDiscounts(
          //   JSON.parse(res.result),
          //   activerowIndex,
          //   this.TrnMainObj.PARTY_ORG_TYPE
          // );
          this.AssignSellingPriceAndDiscounts_New(JSON.parse(res.result), activerowIndex, "", 0, prate);
          if (getAltunitListFromApi) {
            this.masterService
              .masterGetmethod(
                "/getAltUnitsOfItem/" +
                this.TrnMainObj.ProdList[activerowIndex].MCODE
              )
              .subscribe(
                res => {
                  if (res.status == "ok") {
                    if (
                      this.TrnMainObj.ProdList[activerowIndex].Product == null
                    ) {
                      this.TrnMainObj.ProdList[activerowIndex].Product = <Product>{};
                    }
                    this.TrnMainObj.ProdList[activerowIndex].Product.MCODE = this.TrnMainObj.ProdList[activerowIndex].MCODE;
                    this.TrnMainObj.ProdList[
                      activerowIndex
                    ].Product.AlternateUnits = JSON.parse(res.result);

                    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder && this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor") {
                      this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj = this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 0)[0];
                    } else {
                      this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj = this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
                    }
                    let rate1 = this.TrnMainObj.ProdList[activerowIndex].RATE;


                    let rate2 = 0;
                    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance || this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this.activeurlpath == "add-debitnote-itembase") {
                      rate2 = this.TrnMainObj.ProdList[activerowIndex].SPRICE;
                    } else {
                      rate2 = this.TrnMainObj.ProdList[activerowIndex].PRATE;
                    }
                    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
                      if (this.TrnMainObj.ProdList[activerowIndex].DefaultPurchaseUnit) {
                        let altunit = this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT.toLowerCase() == this.TrnMainObj.ProdList[activerowIndex].DefaultPurchaseUnit.toLowerCase())[0];
                        if (altunit != null) {
                          this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj = altunit;
                        }
                      }
                    }
                    this.setunit(
                      rate1,
                      rate2,
                      activerowIndex,
                      this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj
                    );
                  } else {
                  }
                },
                error => {
                }
              );
          } else {
            let rate1 = this.TrnMainObj.ProdList[activerowIndex].RATE;
            let rate2 = 0;
            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
              rate2 = this.TrnMainObj.ProdList[activerowIndex].SPRICE;
            } else {
              rate2 = this.TrnMainObj.ProdList[activerowIndex].PRATE;
            }
            this.setunit(
              rate1,
              rate2,
              activerowIndex,
              this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj
            );
            //  this.CalculateNormalNew(activerowIndex);
            //  this.ReCalculateBill();
            this.ReCalculateBillWithNormal();
          }
        } else {
          alert(res.result);
        }
      });
  }

  updateWeightFromWeighingMachine() {
    this.masterService.getWeight().subscribe(data => {
      this.TrnMainObj.ProdList[this.prodActiveRowIndex].Quantity = data.value;
    });
  }

  AssignSellingPriceAndDiscounts_New(prices, activerowIndex, partyType = "", changemanualscheme = 0, prate = 0, schemeMode: string = "AUTO") {
    this.prodActiveRowIndex = activerowIndex;
    if (prices == null) return;
    if (this.TrnMainObj.ProdList[activerowIndex].MCODE != prices.mcode) { return; }
    this.TrnMainObj.ProdList[activerowIndex].ProductRates = prices;

    if (partyType == "" || partyType == null) {
      partyType = this.TrnMainObj.PARTY_ORG_TYPE;
    }
    if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) && this.TrnMainObj.ISMANUALRETURN) {

      prices.PrimaryDiscount = 0;
      prices.SecondaryDiscount = 0;
      prices.LiquidationDiscount = 0;
      prices.primaryDiscountAmount = 0;
      prices.secondaryDiscountAmount = 0;
      prices.liquidationDiscountAmount = 0;
    }


    this.TrnMainObj.ProdList[activerowIndex].PrimaryDiscountPercent = prices.PrimaryDiscount * 100;
    this.TrnMainObj.ProdList[activerowIndex].SecondaryDiscountPercent = prices.SecondaryDiscount * 100;
    this.TrnMainObj.ProdList[activerowIndex].LiquiditionDiscountPercent = prices.LiquidationDiscount * 100;
    this.TrnMainObj.ProdList[activerowIndex].BasePrimaryDiscount = prices.primaryDiscountAmount;
    this.TrnMainObj.ProdList[activerowIndex].BaseSecondaryDiscount = prices.secondaryDiscountAmount;
    this.TrnMainObj.ProdList[activerowIndex].BaseLiquiditionDiscount = prices.liquidationDiscountAmount;
    this.assignPrices_New(prices, activerowIndex, partyType, changemanualscheme, prate);

    if (schemeMode == "AUTO") {
      this.TrnMainObj.ProdList[activerowIndex].ISAUTOPRIMARYSCHEME = prices.PrimaryDiscount * 100 > 0 ? true : false;
      this.TrnMainObj.ProdList[activerowIndex].ISAUTOSECONDARYSCHEME = prices.SecondaryDiscount * 100 > 0 ? true : false;
      this.TrnMainObj.ProdList[activerowIndex].ISAUTOLIQUIDATIONSCHEME = prices.LiquidationDiscount * 100 > 0 ? true : false;
      //this.determineAutoSchemeApplied(activerowIndex);
    }

  }
  assignPrices_New(prices, activerowIndex, partyType = "", changemanualscheme = 0, prate = 0) {
    this.prodActiveRowIndex = activerowIndex;
    if (partyType == "" || partyType == null) {
      partyType = this.TrnMainObj.PARTY_ORG_TYPE;
    }
    let orgtype = this.userProfile.CompanyInfo.ORG_TYPE;
    if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.RFQ ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferOut ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlementEntryApproval ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Stockadjustment ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferIn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOut ||
      this.activeurlpath == "add-debitnote-itembase"
    ) {
      this.TrnMainObj.ProdList[activerowIndex].PRATE =
        this.TrnMainObj.ProdList[activerowIndex].REALRATE =
        this.TrnMainObj.ProdList[activerowIndex].ALTRATE =
        this.TrnMainObj.ProdList[activerowIndex].RATE = this.getPrateOrgType(orgtype, prices, prate);
      let frompurchaseIsInclusiv = 0;//condition for setting incluse exclusice  selling price in purchase screen
      if (this.TrnMainObj.ProdList[activerowIndex].IsTaxInclusive == 1) {
        frompurchaseIsInclusiv = 1;
      }
      this.TrnMainObj.ProdList[activerowIndex].SPRICE =
        this.TrnMainObj.ProdList[activerowIndex].ALTRATE2 = this.getSrateOrgType(orgtype, prices, partyType, frompurchaseIsInclusiv);
      this.TrnMainObj.ProdList[activerowIndex].SellingPrice = this.getInitialPrate(orgtype, prices, prate);
    } else {
      this.TrnMainObj.ProdList[activerowIndex].REALRATE =
        this.TrnMainObj.ProdList[activerowIndex].ALTRATE =
        this.TrnMainObj.ProdList[activerowIndex].SPRICE =
        this.TrnMainObj.ProdList[activerowIndex].RATE = this.getSrateOrgType(orgtype, prices, partyType, 0);

      if (changemanualscheme != 1) {
        this.TrnMainObj.ProdList[activerowIndex].PRATE = this.TrnMainObj.ProdList[activerowIndex].ALTRATE2 = this.getPrateOrgType(orgtype, prices, prate);
        this.TrnMainObj.ProdList[activerowIndex].SellingPrice = this.getInitialSrate(orgtype, prices, partyType, 0);
      }
    }

  }
  getInitialPrate(orgtype, prices, prate = 0) {
    if (prices.PRATE > 0) { prate = prices.PRATE };
    if (prate == 0) {
      if (orgtype.toLowerCase() == "superdistributor") {
        prate = this.nullToZeroConverter(prices.SuperDistributorLandingRate);
      }
      else if (orgtype.toLowerCase() == "asd") {
        prate = this.nullToZeroConverter(prices.SuperDistributorLandingRate);
      }
      else if (orgtype.toLowerCase() == "distributor") {
        prate = this.nullToZeroConverter(prices.SuperDistributorSellingRate);
      }
      else if (orgtype.toLowerCase() == "ak") {
        prate = this.nullToZeroConverter(prices.akckLandingRate);

      }
      else if (orgtype.toLowerCase() == "gak") {
        prate = this.nullToZeroConverter(prices.akckLandingRate);

      }
      else if (orgtype.toLowerCase() == "ck") {
        prate = this.nullToZeroConverter(prices.akckLandingRate);
      }
      else if (orgtype.toLowerCase() == "pms") {
        prate = this.nullToZeroConverter(prices.pmsLandingRate);
      }
      else if (orgtype.toLowerCase() == "superstockist") {
        prate = this.nullToZeroConverter(prices.superStockistLandingPrice);
      }
      else if (orgtype.toLowerCase() == "substockist") {
        prate = this.nullToZeroConverter(prices.subStockistlandingPrice);
      }
      else if (orgtype.toLowerCase() == "wdb") {
        prate = this.nullToZeroConverter(prices.WDBLandingRate);
      }
      else if (orgtype.toLowerCase() == "ssa") {
        prate = this.nullToZeroConverter(prices.SSALandingRate);
      }
      else if (orgtype.toLowerCase() == "zcp") {
        prate = this.nullToZeroConverter(prices.ZCPLandingRate);
      }
      else if (orgtype.toLowerCase() == "fitindia") {
        prate = this.nullToZeroConverter(prices.FitIndiaLandingRate);
      }
      else {
        prate = this.nullToZeroConverter(prices.DistributorSellingRate);
      }
    }
    return prate;
  }
  getPrateOrgType(orgtype, prices, prate = 0) {

    if (prate == 0) {
      prate = this.getInitialPrate(orgtype, prices);
      if (orgtype.toLowerCase() == "ak" || orgtype.toLowerCase() == "ck" || orgtype.toLowerCase() == "gak" || orgtype.toLowerCase() == "retailer" || orgtype.toLowerCase() == "pms" ||
        orgtype.toLowerCase() == "superdistributor" || orgtype.toLowerCase() == "distributor" ||
        orgtype.toLowerCase() == "substockist" || orgtype.toLowerCase() == "superstockist" ||
        orgtype.toLowerCase() == "wdb" || orgtype.toLowerCase() == "ssa" || orgtype.toLowerCase() == "zcp" || orgtype.toLowerCase() == "asd") {
        if (this.TrnMainObj.VoucherType != VoucherTypeEnum.OpeningStockBalance && this.TrnMainObj.VoucherType != VoucherTypeEnum.CreditNote) {
          prate = prate - (prices.primaryDiscountAmount + prices.secondaryDiscountAmount + prices.liquidationDiscountAmount);
        }
      }
    }
    return this.nullToZeroConverter(prate);
  }
  getInitialSrate(orgtype, prices, partytype, frompurchaseIsInclusiv) {
    if (frompurchaseIsInclusiv == 1) {
      if (this.nullToZeroConverter(prices.IN_SRATE) > 0) {
        return this.nullToZeroConverter(prices.IN_SRATE);
      }
      else {
        return prices.SRATE;
      }

    }
    else {
      if (prices.SRATE > 0) {
        return prices.SRATE;
      }
    }
    if (partytype == null || partytype == undefined) {
      partytype = "walkin";
    }
    let srate = 0;
    if (partytype == null) { partytype = "customer"; }
    if (partytype.toLowerCase() == "ak" || partytype.toLowerCase() == "ck" || partytype.toLowerCase() == "gak") {
      srate = this.nullToZeroConverter(prices.akckLandingRate);
    }
    else if (orgtype.toLowerCase() == "superdistributor") {
      if (partytype.toLowerCase() == "pms") {
        srate = this.nullToZeroConverter(prices.pmsLandingRate);
      }
      else if (partytype.toLowerCase() == "wdb") {
        srate = this.nullToZeroConverter(prices.WDBLandingRate);
      } else if (partytype.toLowerCase() == "ssa") {
        srate = this.nullToZeroConverter(prices.SSALandingRate);
      } else if (partytype.toLowerCase() == "zcp") {
        srate = this.nullToZeroConverter(prices.ZCPLandingRate);
      }
      else if (partytype.toLowerCase() == "superstockist") {
        srate = this.nullToZeroConverter(prices.superStockistLandingPrice);
      }
      else if (partytype.toLowerCase() == "retailer") {
        srate = this.nullToZeroConverter(prices.DistributorSellingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.SuperDistributorSellingRate);
      }
    }
    else if (orgtype.toLowerCase() == "asd") {
      if (partytype.toLowerCase() == "pms") {
        srate = this.nullToZeroConverter(prices.pmsLandingRate);
      }
      else if (partytype.toLowerCase() == "wdb") {
        srate = this.nullToZeroConverter(prices.WDBLandingRate);
      } else if (partytype.toLowerCase() == "ssa") {
        srate = this.nullToZeroConverter(prices.SSALandingRate);
      } else if (partytype.toLowerCase() == "zcp") {
        srate = this.nullToZeroConverter(prices.ZCPLandingRate);
      }
      else if (partytype.toLowerCase() == "superstockist") {
        srate = this.nullToZeroConverter(prices.superStockistLandingPrice);
      }
      else if (partytype.toLowerCase() == "retailer") {
        srate = this.nullToZeroConverter(prices.DistributorSellingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.SuperDistributorSellingRate);
      }
    }
    else if (orgtype.toLowerCase() == "distributor") {
      srate = this.nullToZeroConverter(prices.DistributorSellingRate);
    }
    else if (orgtype.toLowerCase() == "ak") {
      if (partytype.toLowerCase() == "fitindia") {
        srate = this.nullToZeroConverter(prices.FitIndiaLandingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.RetailSellingRate);
      }
    }
    else if (orgtype.toLowerCase() == "ck") {
      if (partytype.toLowerCase() == "fitindia") {
        srate = this.nullToZeroConverter(prices.FitIndiaLandingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.RetailSellingRate);
      }
    }
    else if (orgtype.toLowerCase() == "gak") {
      if (partytype.toLowerCase() == "fitindia") {
        srate = this.nullToZeroConverter(prices.FitIndiaLandingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.RetailSellingRate);
      }
    }
    else if (orgtype.toLowerCase() == "pms") {

      if (partytype.toLowerCase() == "fitindia") {
        srate = this.nullToZeroConverter(prices.FitIndiaLandingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.RetailSellingRate);
      }
    }
    else if (orgtype.toLowerCase() == "wdb") {
      srate = this.nullToZeroConverter(prices.WDBSellingRate);
    }
    else if (orgtype.toLowerCase() == "ssa") {
      if (partytype.toLowerCase() == "pms") {
        srate = this.nullToZeroConverter(prices.pmsLandingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.SSASellingRate);
      }
    }
    else if (orgtype.toLowerCase() == "zcp") {
      if (partytype.toLowerCase() == "pms") {
        srate = this.nullToZeroConverter(prices.pmsLandingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.ZCPSellingRate);
      }
    }
    else if (orgtype.toLowerCase() == "superstockist") {
      srate = this.nullToZeroConverter(prices.subStockistlandingPrice);
    }
    else if (orgtype.toLowerCase() == "substockist") {
      srate = this.nullToZeroConverter(prices.DistributorSellingRate);
    }
    else if (orgtype.toLowerCase() == "patanjali" || orgtype.toLowerCase() == "pwh") {

      if (partytype.toLowerCase() == "fitindia") {
        srate = this.nullToZeroConverter(prices.FitIndiaLandingRate);
      }
      else {
        srate = this.nullToZeroConverter(prices.SuperDistributorLandingRate);
      }
    }
    else {
      srate = this.nullToZeroConverter(prices.RetailSellingRate);
    }

    return srate;
  }
  getSrateOrgType(orgtype, prices, partytype, frompurchaseIsInclusiv) {
    if (partytype == null || partytype == undefined) {
      partytype = "walkin";
    }
    let srate = 0;
    srate = this.getInitialSrate(orgtype, prices, partytype, frompurchaseIsInclusiv);
    if (partytype.toLowerCase() == "ak" || partytype.toLowerCase() == "ck" || partytype.toLowerCase() == "gak" || partytype.toLowerCase() == "retailer" || partytype.toLowerCase() == "pms" ||
      partytype.toLowerCase() == "superdistributor" || partytype.toLowerCase() == "distributor" ||
      partytype.toLowerCase() == "substockist" || partytype.toLowerCase() == "superstockist" ||
      partytype.toLowerCase() == "wdb" || partytype.toLowerCase() == "ssa" ||
      partytype.toLowerCase() == "zcp" || partytype.toLowerCase() == "asd") {
      if (this.TrnMainObj.VoucherType != VoucherTypeEnum.CreditNote) {

        srate = srate - (prices.primaryDiscountAmount + prices.secondaryDiscountAmount + prices.liquidationDiscountAmount);
      }
    } return srate;
  }
  MergeSameItemWithSameBatchOfProd() {
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder || this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
      let groupedProd: TrnProd[] = [];
      for (let p of this.TrnMainObj.ProdList) {
        let index = groupedProd.findIndex(x => x.MCODE == p.MCODE && x.PRATE == p.PRATE && x.ALTUNIT == p.ALTUNIT && x.RATE == p.RATE && x.MRP == p.MRP && x.BC == p.BC);
        if (index < 0) {
          groupedProd.push(p);
        }
        else {
          groupedProd[index].Quantity = this.nullToZeroConverter(groupedProd[index].Quantity) + this.nullToZeroConverter(p.Quantity);
          groupedProd[index].RealQty = this.nullToZeroConverter(groupedProd[index].RealQty) + this.nullToZeroConverter(p.RealQty);
        }
      }
      this.TrnMainObj.ProdList = groupedProd;
      this.ReCalculateBillWithNormal();
    }
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan || this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement) {
      let groupedProd: TrnProd[] = [];
      for (let p of this.TrnMainObj.ProdList) {
        let index = groupedProd.findIndex(x => x.BC == p.BC && x.MCODE == p.MCODE && x.BATCH == p.BATCH && x.EXPDATE == p.EXPDATE && x.MFGDATE == p.MFGDATE && x.PRATE == p.PRATE && x.ALTUNIT == p.ALTUNIT && this.nullToZeroConverter(x.INDDISCOUNT) == this.nullToZeroConverter(p.INDDISCOUNT) && x.RATE == p.RATE && x.MRP == p.MRP && p.Ptype != 6);
        if (index < 0) {
          groupedProd.push(p);
        }
        else {
          groupedProd[index].Quantity = this.nullToZeroConverter(groupedProd[index].Quantity) + this.nullToZeroConverter(p.Quantity);
          groupedProd[index].RealQty = this.nullToZeroConverter(groupedProd[index].RealQty) + this.nullToZeroConverter(p.RealQty);
        }
      }
      this.TrnMainObj.ProdList = groupedProd;
      this.ReCalculateBillWithNormal();
    }
  }

  addRowForTransaction(index) {
    this.prodActiveRowIndex = index;
    try {
      if (index == -1) {
        // this.TrnMainObj.TrntranList[0].ROWMODE =  "new";
        this.AddNewTrnTranRow(index);
        return;
      }

      if (this.TrnMainObj.TrntranList[index + 1]) return; //prevent to add row if selected at the item at somewhere except last

      var rm = this.TrnMainObj.TrntranList[index].ROWMODE;
      if (rm == "new") {
        this.TrnMainObj.TrntranList[index].ROWMODE = "new";
        this.AddNewTrnTranRow(index);
      } else if (rm == "edit") {
        this.TrnMainObj.TrntranList[index].ROWMODE = "edit";
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  AddNewTrnTranRow(index) {
    this.prodActiveRowIndex = index;
    try {
      if (!this.TrnMainObj.TrntranList) {
        this.TrnMainObj.TrntranList = [];
      }

      let currentObj = this.TrnMainObj.TrntranList[index];

      if (this.TrnMainObj.TrntranList[index + 1]) {
        return;
      }

      if (
        index != -1 &&
        (!currentObj.AccountItem ||
          currentObj.AccountItem.ACID == undefined ||
          currentObj.AccountItem.ACID == "")
      ) {
        // this.alertService.info("Please Select A/C");
        this.alertService.warning("Please Select A/C");
        return;
      }

      if (
        index != -1 &&
        ((currentObj.DRAMNT == 0 || currentObj.DRAMNT == null) &&
          (currentObj.CRAMNT == 0 || currentObj.CRAMNT == null))
      ) {
        this.alertService.warning("Debit Amount or Credit Amount is Required.");
        return;
      }

      var newRow = <Trntran>{};
      var newaclist: TAcList = <TAcList>{};
      newRow.AccountItem = newaclist;
      newRow.inputMode = true;
      newRow.editMode = true;

      newRow.ROWMODE = "new";
      newRow.PartyDetails = [];
      this.TrnMainObj.TrntranList.push(newRow);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  deleteAccountTrnRow(index) {
    try {

      if (this.TrnMainObj.TrntranList == null || this.TrnMainObj.TrntranList.length < 1) return;

      if (this.TrnMainObj.TrntranList.length == 1) {
        this.TrnMainObj.TrntranList.splice(index, 1);
        this.addRowForTransaction(-1);
        return;
      }
      var rm = this.TrnMainObj.TrntranList[index].ROWMODE;
      if (rm == "new") {
        this.TrnMainObj.TrntranList.splice(index, 1);
      } else if (rm == "save" || rm == "edit") {
        this.TrnMainObj.TrntranList.splice(index, 1);
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  calculateDrCrDifferences() {
    try {
      this.calculateCrDrTotal();
      this.differenceAmount = 0;
      if (
        this.TrnMainObj.VoucherType != VoucherTypeEnum.Journal &&
        this.TrnMainObj.VoucherType != VoucherTypeEnum.ContraVoucher
      ) {
        return;
      }
      let diffAmount: number = 0;
      this.TrnMainObj.TrntranList.forEach(tran => {
        diffAmount =
          diffAmount +
          ((this.masterService.nullToZeroConverter(tran.DRAMNT)) -
            (this.masterService.nullToZeroConverter(tran.CRAMNT)));
      });
      // this.differenceAmount = Math.abs(diffAmount);
      this.differenceAmount = diffAmount;
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  calculateCrDrTotal() {
    this.crTotal = 0;
    this.drTotal = 0;

    this.TrnMainObj.TrntranList.forEach(tran => {
      this.crTotal = this.crTotal + (this.masterService.nullToZeroConverter(tran.CRAMNT));
      this.drTotal = this.drTotal + (this.masterService.nullToZeroConverter(tran.DRAMNT));
    });
  }
  ItemOutOfStockMessage: string;
  barcodeEnterCommand(event, index) {
    this.prodActiveRowIndex = index;
    event.preventDefault();
    this.masterService.RemoveFocusFromAnyControl("barcodebilling" + index);
    let rowWithFirstSalesman = this.TrnMainObj.ProdList.filter(x => x.SALESMANID != null && x.SALESMANID != 0)[0];

    if (rowWithFirstSalesman != null) {
      this.TrnMainObj.ProdList[index].SALESMANID = rowWithFirstSalesman.SALESMANID;
      this.TrnMainObj.ProdList[index].SALESMANNAME = rowWithFirstSalesman.SALESMANNAME;
      this.TrnMainObj.ProdList[index].SALESMAN_COMMISION = rowWithFirstSalesman.SALESMAN_COMMISION;
    }

    this.masterService
      .masterPostmethod("/getItemDetailsFromBarcode", {
        barcode: this.TrnMainObj.ProdList[index].BC,
        voucherprefix: this.TrnMainObj.VoucherAbbName,
        partyacid: this.TrnMainObj.PARAC == "" ? null : this.TrnMainObj.PARAC,
        PARTY_TYPE: this.TrnMainObj.PARTY_ORG_TYPE,
        warehouse: this.TrnMainObj.MWAREHOUSE,
        refbill: this.TrnMainObj.REFBILL
      })
      .subscribe(
        res => {
          if (res.status == "ok") {
            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance) {
              let item = JSON.parse(res.result);
              this.assignValueFromBarcodeInPurchase(item, index);
            }
            else {
              if (res.message == "multiItem") {
                this.ItemsListForMultiItemBarcode = JSON.parse(res.result);
                this.masterService.PlistTitle = "itemList";
              } else {
                let item = JSON.parse(res.result);
                if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
                  this.TrnMainObj.ISMANUALRETURN = item.ISMANUALRETURN;
                }
                if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice &&
                  this.AppSettings.disableRepeatProductInsale == 1) {
                  if (this.checkMcodePresentInProd(item.MCODE) == true) {
                    this.alertService.warning("Item is already present in current bill.");
                    return;
                  }
                }

                if (item.BatchObj != null && item.BatchObj.MCODE != null) {
                  this.assignValueToProdFromBarcode(item, index);

                  if (this.TrnMainObj.ProdList[index].Quantity > 0) {
                    if (this.addRow() == false) {
                      this.masterService.focusAnyControl("quantity" + index);
                      return;
                    }
                    setTimeout(() => {
                      let nextInd = ((this.nullToZeroConverter(index)) + 1);
                      this.masterService.focusAnyControl("barcodebilling" + nextInd);

                    }, 100);

                  }
                  else {
                    this.masterService.focusAnyControl("quantity" + index);
                  }

                }
                else {

                  this.TrnMainObj.ProdList[index].SELECTEDITEM = item;
                  this.TrnMainObj.ProdList[index].BC = item.BARCODE;
                  this.TrnMainObj.ProdList[index].Ptype = item.PTYPE;
                  this.TrnMainObj.ProdList[index].PROMOTION = 0;
                  this.TrnMainObj.ProdList[index].BATCHSCHEME = null;
                  this.TrnMainObj.ProdList[index].ALLSCHEME = null;

                  this.TrnMainObj.ProdList[index].ISVAT = item.ISVAT;
                  this.TrnMainObj.ProdList[index].MENUCODE = item.MENUCODE;
                  this.TrnMainObj.ProdList[index].ITEMDESC = item.DESCA;
                  this.TrnMainObj.ProdList[index].MCODE = item.MCODE;
                  this.TrnMainObj.ProdList[index].GSTRATE_ONLYFORSHOWING = item.GST;
                  this.TrnMainObj.ProdList[index].GSTRATE = item.GST;
                  this.TrnMainObj.ProdList[index].WEIGHT = this.nullToZeroConverter(item.GWEIGHT);
                  this.TrnMainObj.ProdList[index].Mcat = item.MCAT;
                  this.TrnMainObj.ProdList[index].Product = item.Product;
                  this.TrnMainObj.ProdList[index].NWEIGHT = this.nullToZeroConverter(item.NWEIGHT);
                  this.TrnMainObj.ProdList[index].INDCESS_PER = item.CESS;


                  this.batchlist = item.batchList;
                  this.masterService.PlistTitle = "batchList";
                  this.masterService.masterGetmethod("/getAltUnitsOfItem/" + this.TrnMainObj.ProdList[index].MCODE)
                    .subscribe(
                      res => {
                        if (res.status == "ok") {
                          this.TrnMainObj.ProdList[index].Product = <Product>{};
                          this.TrnMainObj.ProdList[index].Product.MCODE = this.TrnMainObj.ProdList[index].MCODE;
                          this.TrnMainObj.ProdList[index].Product.AlternateUnits = JSON.parse(res.result);
                          this.TrnMainObj.ProdList[index].ALTUNITObj = this.TrnMainObj.ProdList[index].Product.AlternateUnits.filter(x => x.ALTUNIT.toUpperCase() == 'PCS')[0];

                        }
                      },
                      error => {
                      }
                    );
                }
              }
            }
          } else {
            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && res.result == "Item Stock is not available..") {
              // this.alertService.info(res.result);
              this.ItemOutOfStockMessage = res.result;
              this.showItemStockRouteModal = true;
              // this.alertService.hide();
            }
            else {
              this.alertService.error(res.result);
              setTimeout(() => {
                this.alertService.hide();
                this.masterService.focusAnyControl("barcodebilling" + (this.nullToZeroConverter(index)));
              }, 3000);
            }


          }
        },
        error => {

          this.alertService.error(error);
        }
      );
  }


  assignValueFromBarcodeInPurchase(value, activerowIndex) {
    this.prodActiveRowIndex = activerowIndex;
    let userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
    if (this.TrnMainObj.ProdList[activerowIndex] != null) {
      this.TrnMainObj.ProdList[activerowIndex].SELECTEDITEM = value;
      this.TrnMainObj.ProdList[activerowIndex].BC = value.BARCODE;
      this.TrnMainObj.ProdList[activerowIndex].PROMOTION = 0;
      this.TrnMainObj.ProdList[activerowIndex].BATCHSCHEME = null;
      this.TrnMainObj.ProdList[activerowIndex].ALLSCHEME = null;
      this.TrnMainObj.ProdList[activerowIndex].MRP = value.MRP;
      this.TrnMainObj.ProdList[activerowIndex].ALTMRP = value.MRP;
      this.TrnMainObj.ProdList[activerowIndex].ISVAT = value.ISVAT;
      this.TrnMainObj.ProdList[activerowIndex].MENUCODE = value.MENUCODE;
      this.TrnMainObj.ProdList[activerowIndex].ITEMDESC = value.DESCA;
      this.TrnMainObj.ProdList[activerowIndex].MCODE = value.MCODE;
      this.TrnMainObj.ProdList[activerowIndex].GSTRATE_ONLYFORSHOWING = value.GST;
      this.TrnMainObj.ProdList[activerowIndex].GSTRATE = value.GST;
      this.TrnMainObj.ProdList[activerowIndex].WEIGHT = this.nullToZeroConverter(value.GWEIGHT);
      this.TrnMainObj.ProdList[activerowIndex].Product = value.Product;
      this.TrnMainObj.ProdList[activerowIndex].NWEIGHT = this.nullToZeroConverter(value.NWEIGHT);
      if (value.InclusiveOfTax == 1) {
        this.TrnMainObj.ProdList[activerowIndex].SPRICE = value.IN_RATE_A;
      }
      else {
        this.TrnMainObj.ProdList[activerowIndex].SPRICE = value.RATE;

      }

      this.TrnMainObj.ProdList[activerowIndex].RATE = value.PRATE;
      this.TrnMainObj.ProdList[activerowIndex].PRATE = value.PRATE;
      this.TrnMainObj.ProdList[activerowIndex].REALRATE = value.PRATE;
      this.TrnMainObj.ProdList[activerowIndex].ALTRATE = value.PRATE;
      this.TrnMainObj.ProdList[activerowIndex].DefaultPurchaseUnit = value.DefaultPurchaseUnit;
      this.TrnMainObj.ProdList[activerowIndex].DefaultSellUnit = userProfile.DEFAULTBILLUNIT ? userProfile.DEFAULTBILLUNIT : value.DefaultSellUnit;
      this.TrnMainObj.ProdList[activerowIndex].Product = <Product>{};
      this.TrnMainObj.ProdList[activerowIndex].Product.MCODE = value.MCODE;
      this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits = value.altUnits;
      this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj = this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
      this.TrnMainObj.ProdList[activerowIndex].INDCESS_PER = value.CESS;



      if (this.TrnMainObj.ProdList[activerowIndex].DefaultPurchaseUnit) {
        let altunit = this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT.toLowerCase() == this.TrnMainObj.ProdList[activerowIndex].DefaultPurchaseUnit.toLowerCase())[0];
        if (altunit != null) {
          this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj = altunit;
        }
      }

      this.TrnMainObj.ProdList[activerowIndex].CONFACTOR = 1;
      this.TrnMainObj.ProdList[activerowIndex].ALTUNIT = value.UNIT;
      this.TrnMainObj.ProdList[activerowIndex].UNIT = value.UNIT;

      let rate1 = this.TrnMainObj.ProdList[activerowIndex].RATE;
      let rate2 = this.TrnMainObj.ProdList[activerowIndex].SPRICE;

      this.setunit(
        rate1,
        rate2,
        activerowIndex,
        this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj
      );
      this.RealQuantitySet(activerowIndex, this.TrnMainObj.ProdList[activerowIndex].CONFACTOR);
      this.masterService.focusAnyControl("quantity" + activerowIndex);

      // this.ReCalculateBillWithNormal();

    }
  }

  assignValueToProdFromBarcode(value, activerowIndex) {
    this.prodActiveRowIndex = activerowIndex;
    let userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
    if (this.TrnMainObj.ProdList[activerowIndex] != null) {

      this.TrnMainObj.ProdList[activerowIndex].SELECTEDITEM = value;
      this.TrnMainObj.ProdList[activerowIndex].BC = value.BARCODE;
      this.TrnMainObj.ProdList[activerowIndex].Ptype = value.PTYPE;
      this.TrnMainObj.ProdList[activerowIndex].DefaultPurchaseUnit = value.DefaultPurchaseUnit;
      this.TrnMainObj.ProdList[activerowIndex].DefaultSellUnit = userProfile.DEFAULTBILLUNIT ? userProfile.DEFAULTBILLUNIT : value.DefaultSellUnit;
      this.TrnMainObj.ProdList[activerowIndex].BCODEID = value.BatchObj.BCODEID;
      //variant attribute for matrix items. generating decription and barcode from variant attributes
      if (this.TrnMainObj.ProdList[activerowIndex].Ptype == ITEMTYPE.MATRIXITEM) {
        this.TrnMainObj.ProdList[activerowIndex].VARIANTLIST = JSON.parse(value.BatchObj.VARIANTDETAIL);
        this.TrnMainObj.ProdList[activerowIndex].VARIANTDESCA = "";
        this.TrnMainObj.ProdList[activerowIndex].BC = value.BatchObj.BCODE;

        this.TrnMainObj.ProdList[activerowIndex].SELECTEDITEM.BARCODE = value.BatchObj.BCODE;
        for (var attribute in this.TrnMainObj.ProdList[activerowIndex].VARIANTLIST) {

          if (['QTY', 'PRATE', 'MRP', 'SRATE', 'BARCODE', 'BATCH'].indexOf(attribute) == -1 && this.TrnMainObj.ProdList[activerowIndex].VARIANTLIST[attribute] != null) {
            this.TrnMainObj.ProdList[activerowIndex].VARIANTDESCA = this.TrnMainObj.ProdList[activerowIndex].VARIANTDESCA + `<b>${this.getVariantNameFromId(attribute)}</b>:${this.TrnMainObj.ProdList[activerowIndex].VARIANTLIST[attribute].NAME} <br/>`
          }
        }
      }


      this.TrnMainObj.ProdList[activerowIndex].PROMOTION = 0;
      this.TrnMainObj.ProdList[activerowIndex].BATCHSCHEME = null;
      this.TrnMainObj.ProdList[activerowIndex].ALLSCHEME = null;
      this.TrnMainObj.ProdList[activerowIndex].MRP = value.BatchObj.MRP;
      this.TrnMainObj.ProdList[activerowIndex].ISVAT = value.ISVAT;
      this.TrnMainObj.ProdList[activerowIndex].MENUCODE = value.MENUCODE;
      this.TrnMainObj.ProdList[activerowIndex].ITEMDESC = value.DESCA;
      this.TrnMainObj.ProdList[activerowIndex].MCODE = value.MCODE;
      this.TrnMainObj.ProdList[activerowIndex].GSTRATE_ONLYFORSHOWING =
        value.GST;
      this.TrnMainObj.ProdList[activerowIndex].GSTRATE = value.GST;
      this.TrnMainObj.ProdList[activerowIndex].WEIGHT = this.nullToZeroConverter(value.GWEIGHT);
      this.TrnMainObj.ProdList[activerowIndex].Mcat = value.MCAT;
      this.TrnMainObj.ProdList[activerowIndex].Product = value.Product;
      this.TrnMainObj.ProdList[activerowIndex].NWEIGHT = this.nullToZeroConverter(value.NWEIGHT);
      this.TrnMainObj.ProdList[activerowIndex].INDCESS_PER = value.CESS;
      this.TrnMainObj.ProdList[activerowIndex].TaxSLABRATEID = value.SLABRATEID;
      this.TrnMainObj.ProdList[activerowIndex].TaxSLABRATEDETAILS = value.TaxSLABRATEDETAILS;

      this.AssignSellingPriceAndDiscounts_New(
        value.ProductRates,
        activerowIndex

      );
      this.assignBatchToActiveProdRow(value.BatchObj, activerowIndex);
      this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj = this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];


      if (this.TrnMainObj.ProdList[activerowIndex].DefaultSellUnit) {
        let altunit = this.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT.toLowerCase() == this.TrnMainObj.ProdList[activerowIndex].DefaultSellUnit.toLowerCase())[0];
        if (altunit != null) {
          this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj = altunit;
        }
      }





      let rate1 = this.TrnMainObj.ProdList[activerowIndex].RATE;
      let rate2 = 0;
      if (
        this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
        this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt
      ) {
        rate2 = this.TrnMainObj.ProdList[activerowIndex].SPRICE;
      } else {
        rate2 = this.TrnMainObj.ProdList[activerowIndex].PRATE;
      }
      this.setunit(
        rate1,
        rate2,
        activerowIndex,
        this.TrnMainObj.ProdList[activerowIndex].ALTUNITObj
      );
      if (this.TrnMainObj.ProdList[activerowIndex].CONFACTOR == null) {
        this.TrnMainObj.ProdList[activerowIndex].CONFACTOR = 1;
      }
      if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
        this.TrnMainObj.ProdList[activerowIndex].Quantity = this.AppSettings.DefaulQtyForBarcodeBilling;
        if (this.TrnMainObj.ProdList[activerowIndex].CONFACTOR == null) {
          this.TrnMainObj.ProdList[activerowIndex].CONFACTOR = 1;
        }
      }
      this.RealQuantitySet(activerowIndex, this.TrnMainObj.ProdList[activerowIndex].CONFACTOR);
      // this.CalculateNormalNew(activerowIndex);
      // this.ReCalculateBill();

      this.ReCalculateBillWithNormal();

      this.masterService.focusAnyControl("quantity" + activerowIndex);
    }
  }

  assignBatchToActiveProdRow(value, activerowIndex) {
    this.prodActiveRowIndex = activerowIndex;
    if (this.TrnMainObj.ProdList[activerowIndex].MCODE != value.MCODE) { return; }
    this.TrnMainObj.ProdList[activerowIndex].BATCH = value.BATCH;
    this.TrnMainObj.ProdList[activerowIndex].HOLDINGSTOCK = value.HOLDINGSTOCK;
    this.TrnMainObj.ProdList[activerowIndex].BC = value.BCODE;
    this.TrnMainObj.ProdList[activerowIndex].MFGDATE = value.MFGDATE == null ? "" : value.MFGDATE.toString().substring(0, 10);
    this.TrnMainObj.ProdList[activerowIndex].EXPDATE = value.EXPIRY == null ? "" : value.EXPIRY.toString().substring(0, 10);
    this.TrnMainObj.ProdList[activerowIndex].UNIT = value.UNIT;
    this.TrnMainObj.ProdList[activerowIndex].BCODEID = value.BCODEID;
    // this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE = value.SRATE;

    this.TrnMainObj.ProdList[activerowIndex].STOCK = value.STOCK;
    this.TrnMainObj.ProdList[activerowIndex].WAREHOUSE = value.WAREHOUSE;
    this.TrnMainObj.ProdList[activerowIndex].BATCHSCHEME = value.SCHEME;
    this.TrnMainObj.ProdList[activerowIndex].BATCHID = value.ID;
    this.TrnMainObj.ProdList[activerowIndex].PRATE = value.PRATE;
    this.TrnMainObj.ProdList[activerowIndex].IsTaxInclusive = value.InclusiveOfTax;
    if (
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.RFQ ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferOut ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlementEntryApproval ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.Stockadjustment ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferIn ||
      this.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOut ||
      this.activeurlpath == "add-debitnote-itembase"
    ) {
      this.TrnMainObj.ProdList[activerowIndex].PRATE =
        this.TrnMainObj.ProdList[activerowIndex].REALRATE =
        this.TrnMainObj.ProdList[activerowIndex].ALTRATE =
        this.TrnMainObj.ProdList[activerowIndex].RATE = value.PRATE;
      this.TrnMainObj.ProdList[activerowIndex].SPRICE = value.SRATE;

    } else {

      this.TrnMainObj.ProdList[activerowIndex].REALRATE =
        this.TrnMainObj.ProdList[activerowIndex].ALTRATE =
        this.TrnMainObj.ProdList[activerowIndex].SPRICE =
        this.TrnMainObj.ProdList[activerowIndex].RATE = value.RATE_A;
      this.TrnMainObj.ProdList[activerowIndex].PRATE = value.PRATE;
      this.TrnMainObj.ProdList[activerowIndex].SellingPrice = value.IN_RATE_A;

      value.BATCHSELLARATE = this.nullToZeroConverter(value.BATCHSELLARATE);
      this.TrnMainObj.ProdList[activerowIndex].priceDropTag = value.priceDropTag;

      //if batch seelling rate is not enabled just set batch sellrate to 0
      if (this.AppSettings.ENABLEBATCHSRATE == false) {
        value.BATCHSELLARATE = 0;
      }
      if (value.InclusiveOfTax == 1) {
        this.TrnMainObj.ProdList[activerowIndex].ORIGINALTRANRATE = this.getCategoryWisePricelevelGstIncluded(value.BATCHSELLARATE > 0 ? value.BATCHSELLARATE : value.IN_RATE_A, value.IN_RATE_B, value.IN_RATE_C);
      }
      else {
        this.TrnMainObj.ProdList[activerowIndex].ORIGINALTRANRATE = this.getCategoryWisePricelevelGstIncluded(value.BATCHSELLARATE > 0 ? value.BATCHSELLARATE : value.RATE_A, value.RATE_B, value.RATE_C);;
      }


      let confactor = this.nullToZeroConverter(this.TrnMainObj.ProdList[activerowIndex].CONFACTOR);
      if (confactor == 0) { confactor = 1; }
      this.TrnMainObj.ProdList[activerowIndex].ALT_ORIGINALTRANRATE = this.TrnMainObj.ProdList[activerowIndex].ORIGINALTRANRATE * confactor;
    }

    if (this.TrnMainObj.Mode != null && this.TrnMainObj.Mode.toUpperCase() == 'EDIT' && (this.TrnMainObj.VoucherPrefix == "TI" || this.TrnMainObj.VoucherPrefix == "PP")) {
      this.TrnMainObj.ProdList[activerowIndex].STOCK = value.STOCK + this.nullToZeroConverter(this.TrnMainObj.ProdList[activerowIndex].EDITEDBILLQUANTITY);
    }
  }

  diffAmountItemForAccount: number = 0;
  diffAmountDrCrType: string = "";
  getAccountWiseTrnAmount(acid: string) {
    if (!acid || acid == null || acid == undefined) return;

    this.diffAmountItemForAccount = 0;
    this.diffAmountDrCrType = "";
    let companyId = this.authservice.getCurrentCompanyId();
    let requestType = 0;
    if (this.TrnMainObj.VoucherType == 22 || this.TrnMainObj.VoucherType == 23) {
      requestType = 1;
    }

    this.masterService
      .getAccountWiseTrnAmount(
        this.TrnMainObj.TRNDATE.toString(),
        companyId,
        acid,
        this.TrnMainObj.DIVISION
      )
      .subscribe(
        res => {
          if (res.status == "ok") {
            this.diffAmountDrCrType = res.result < 0 ? "Cr" : "Dr";
            this.diffAmountItemForAccount = Math.abs(res.result);
          } else {
            this.diffAmountItemForAccount = 0;
            this.diffAmountDrCrType = "";
          }
        },
        error => {
          this.diffAmountItemForAccount = 0;
          this.diffAmountDrCrType = "";
        }
      );
  }
  ReCalculateBillWithNormal() {
    //first calulate amount and other filed for offer
    this.ReCalculateBillWithNormal_internalLoop_withOutOfferCalculation();
    //reset offer to 0
    this.offerCalculation();
    // calculate offer
    this.offerCalculation_multiplebatch();
    //then recalculate bill after offer
    this.ReCalculateBillWithNormal_internalLoop_withOutOfferCalculation();

  }
  QuantityChangeEvent(i) {

    if (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) == 0) {
      this.TrnMainObj.ProdList[i].FreeQuantity = 0;
    }


    if (this.activeurlpath == "add-creditnote-itembase" && !this.TrnMainObj.ISMANUALRETURN) {
      if (this.nullToZeroConverter(this.TrnMainObj.ProdList[i].Quantity) > this.nullToZeroConverter(this.TrnMainObj.ProdList[i].STOCK)) {
        this.TrnMainObj.ProdList[i].Quantity = this.TrnMainObj.ProdList[i].STOCK;
        this.alertService.warning("Quantity exceeds than total billed quantity");

      }
    }
    if (this.TrnMainObj.ProdList[i].CONFACTOR == null) {
      this.TrnMainObj.ProdList[i].CONFACTOR = 1;
    }

    if (this.activeurlpath == "add-purchase-order" && this.TrnMainObj.REFBILL != null && this.TrnMainObj.REFBILL.startsWith("SO")) {



    }


    this.RealQuantitySet(i, this.TrnMainObj.ProdList[i].CONFACTOR);
    this.ReCalculateBillWithNormal();
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      this.getSchemeAndRecalcualte(i);

    }
  }
  ReCalculateBillWithNormal_internalLoop_withOutOfferCalculation() {
    try {
      if (this.TrnMainObj.AdditionalObj == null || this.TrnMainObj.AdditionalObj == undefined) {
        this.TrnMainObj.AdditionalObj = <TrnMain_AdditionalInfo>{};
      }
      let userSettings = JSON.parse(localStorage.getItem("setting"));

      let isB2BBilling = this.isB2BTransaction(this.TrnMainObj.PARTY_ORG_TYPE);
      let isQuantityIn = this.isStockIn(this.TrnMainObj.VoucherType);
      if (this.TrnMainObj.ProdList == null) this.TrnMainObj.ProdList = [];
      for (var p of this.TrnMainObj.ProdList) {
        if (p.hasOwnProperty("MCODE") == false || p.MCODE == null || p.SELECTEDITEM == null) { continue; } else {
          let conf = this.nullToZeroConverter(p.CONFACTOR);
          p.CONFACTOR = conf == 0 ? 1 : conf;
          let CC = this.nullToZeroConverter(p.CARTONCONFACTOR);
          p.CARTONCONFACTOR = CC == 0 ? 1 : CC;
          // if (p.CARTONCONFACTOR == 1) {

          if (p.Product != null && p.Product.AlternateUnits != null) {

            let unit = p.ALTUNIT;
            if (unit != null) {
              let altunit = p.Product.AlternateUnits.filter(x => x.ALTUNIT != null && x.ALTUNIT.toLocaleLowerCase() == p.ALTUNIT.toLowerCase())[0];
              if (altunit != null) {
                p.CARTONCONFACTOR = this.nullToZeroConverter(altunit.CONFACTOR);
              }
            }
          }
          // }
          //quantity section 

          p.Quantity = this.nullToZeroConverter(p.Quantity);
          p.CARTON = p.Quantity * p.CONFACTOR / p.CARTONCONFACTOR;
          if (isQuantityIn == true) {
            p.REALQTY_IN = (this.nullToZeroConverter(p.Quantity) + this.nullToZeroConverter(p.FreeQuantity)) * p.CONFACTOR;
            p.ALTQTY_IN = this.nullToZeroConverter(p.Quantity) + this.nullToZeroConverter(p.FreeQuantity);

            if (this.TrnMainObj.VoucherType != VoucherTypeEnum.MaterialReceipt) {
              p.RealQty = 0;
              p.AltQty = 0;
            }
            else {
              p.AltQty = this.nullToZeroConverter(p.AltQty);
              p.RealQty = (this.nullToZeroConverter(p.AltQty)) * p.CONFACTOR;

            }
          }
          else {
            p.REALQTY_IN = 0;
            p.ALTQTY_IN = 0;
            p.RealQty = (this.nullToZeroConverter(p.Quantity) + this.nullToZeroConverter(p.FreeQuantity)) * p.CONFACTOR;
            p.AltQty = this.nullToZeroConverter(p.Quantity) + this.nullToZeroConverter(p.FreeQuantity);
          }

          //gst tax slat section for chaing gstrate as net item price
          if (p.TaxSLABRATEID != null && p.TaxSLABRATEID != "" && p.TaxSLABRATEID != undefined && p.TaxSLABRATEDETAILS != null && p.TaxSLABRATEDETAILS.length > 0) {
            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan || this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
              for (let tax of p.TaxSLABRATEDETAILS) {
                // let prodSlatPrice = p.ALT_ORIGINALTRANRATE / p.CONFACTOR;
                let prodSlatPrice = p.NETAMOUNT / p.RealQty;

                if (tax.RateFrom <= prodSlatPrice && tax.RateTo >= prodSlatPrice) {
                  p.GSTRATE = tax.TAXAPPLY;
                  p.INDCESS_PER = tax.CESS;
                }
              }
            }
            else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
              for (let tax of p.TaxSLABRATEDETAILS) {
                //let prodSlatPrice = p.ALTRATE / p.CONFACTOR;
                let prodSlatPrice = p.NETAMOUNT / p.REALQTY_IN;

                if (tax.RateFrom <= prodSlatPrice && tax.RateTo >= prodSlatPrice) {

                  p.GSTRATE = tax.TAXAPPLY;
                  p.INDCESS_PER = tax.CESS;
                }
              }
            }
          }
          else {
            p.GSTRATE = p.SELECTEDITEM.GST > 0 ? p.SELECTEDITEM.GST : p.GSTRATE;
          }

          ///rate section


          if (p.Ptype == 10) {
            p.GSTRATE = Math.max.apply(Math, this.TrnMainObj.ProdList.filter(p => p.Ptype != 10 && p.MCODE != null && p.SELECTEDITEM != null && p.GSTRATE != undefined && p.GSTRATE != null).map(function (o) { return o.GSTRATE; }));
            p.RATE = p.MRP / (1 + (p.GSTRATE / 100));

          }

          if (this.userProfile.CompanyInfo.GSTTYPE != null &&
            (this.userProfile.CompanyInfo.GSTTYPE.toLowerCase() == "composite") &&
            (this.TrnMainObj.VoucherPrefix == "TI"
              || this.TrnMainObj.VoucherPrefix == "PP"
              || this.TrnMainObj.VoucherPrefix == "SO")) {

            p.GSTRATE = 0;
          }
          if (this.userProfile.CompanyInfo.GSTTYPE != null &&
            this.userProfile.CompanyInfo.GSTTYPE.toLowerCase() == "un-register") {
            p.GSTRATE = 0;
          }
          //if supplier is unregistered then gstrate is zero and rcm is raised
          if (this.TrnMainObj.PARTY_GSTTYPE != null && this.TrnMainObj.PARTY_GSTTYPE.toLowerCase() == "un-register" && (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt)) {
            p.GSTRATE = 0;
          }

          if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
            this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||

            this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan ||
            this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote)) {


            if (this.nullToZeroConverter(this.AppSettings.IsMRPBilling) != 1) {
              p.ORIGINALTRANRATE = p.ALT_ORIGINALTRANRATE / p.CONFACTOR;
              if (p.IsTaxInclusive == 1) {
                p.RATE = p.ORIGINALTRANRATE / (1 + (p.GSTRATE / 100));
                //cess percent is added with gstrate and calculate the taxable amount
                if (p.GSTRATE > 5 && this.nullToZeroConverter(p.INDCESS_PER) > 0) {
                  p.INDCESS_PER = this.nullToZeroConverter(p.INDCESS_PER);
                  p.RATE = p.ORIGINALTRANRATE / (1 + ((p.GSTRATE + p.INDCESS_PER) / 100));
                }
              }
              else {

                p.RATE = p.ORIGINALTRANRATE;
              }
            }
            else {
              p.RATE = p.MRP / (1 + (p.GSTRATE / 100));
              //cess percent is added with gstrate and calculate the taxable amount
              if (p.GSTRATE > 5 && this.nullToZeroConverter(p.INDCESS_PER) > 0) {
                p.INDCESS_PER = this.nullToZeroConverter(p.INDCESS_PER);
                p.RATE = p.MRP / (1 + ((p.GSTRATE + p.INDCESS_PER) / 100));
              }
            }



            let sellingRateAfterFreeItem = p.RATE;
            if (this.TrnMainObj.Mode != null && this.TrnMainObj.Mode.toLowerCase() == "edit"
              && this.nullToZeroConverter(this.AppSettings.IsMRPBilling) != 1) {


              if (p.IsTaxInclusive == 1) {
                sellingRateAfterFreeItem = (this.nullToZeroConverter(p.Quantity) * this.nullToZeroConverter(p.CONFACTOR) * (this.nullToZeroConverter(p.ORIGINALTRANRATE) / (1 + (p.GSTRATE / 100)))) / this.nullToZeroConverter(p.RealQty);
              }
              else {
                sellingRateAfterFreeItem = (this.nullToZeroConverter(p.Quantity) * this.nullToZeroConverter(p.CONFACTOR) * this.nullToZeroConverter(p.ORIGINALTRANRATE)) / this.nullToZeroConverter(p.RealQty);
              }
            } else {
              sellingRateAfterFreeItem = (this.nullToZeroConverter(p.Quantity) * this.nullToZeroConverter(p.CONFACTOR) * this.nullToZeroConverter(p.RATE)) / this.nullToZeroConverter(p.RealQty);
            }
            if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
              p.RATE = sellingRateAfterFreeItem;
            }
            p.ALTRATE = p.RATE * p.CONFACTOR;
          }

          else {
            if ((this.TrnMainObj.AdditionalObj != null && this.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") || this.TrnMainObj.PARTY_ORG_TYPE == "fitindia") {
              p.RATE = this.nullToZeroConverter(p.RATE);
            }
            else {
              let landingCostAfterFreeItem = p.RATE;
              if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
                if (this.nullToZeroConverter(p.ORIGINALTRANRATE) == 0)//value store as original rate before free qty or vat inclusive exclusive changes
                {
                  p.ORIGINALTRANRATE = p.RATE;
                }
                if (this.TrnMainObj.Mode != null && this.TrnMainObj.Mode.toLowerCase() == "edit") {

                  landingCostAfterFreeItem = (this.nullToZeroConverter(p.Quantity) * this.nullToZeroConverter(p.CONFACTOR) * this.nullToZeroConverter(p.ORIGINALTRANRATE)) / this.nullToZeroConverter(p.REALQTY_IN);
                  if (landingCostAfterFreeItem == 0) {
                    landingCostAfterFreeItem = p.RATE;
                  }

                } else {
                  landingCostAfterFreeItem = (this.nullToZeroConverter(p.Quantity) * this.nullToZeroConverter(p.CONFACTOR) * this.nullToZeroConverter(p.ORIGINALTRANRATE)) / this.nullToZeroConverter(p.REALQTY_IN);

                }
              }

              if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) && this.TrnMainObj.tag && this.TrnMainObj.tag == "FROMEXCEL") {
                p.RATE = this.nullToZeroConverter(p.RATE);
              } else {
                if (this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance) {
                  p.PRATE = landingCostAfterFreeItem;
                } else {
                  p.RATE = this.nullToZeroConverter(landingCostAfterFreeItem);
                  p.PRATE = landingCostAfterFreeItem;

                }


              }
            }
          }
          if (this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder && this.AppSettings.IsMRPBilling == 1) {
            if (p.IsTaxInclusive == 1) {
              p.RATE = p.MRP / (1 + (p.GSTRATE / 100));
            } else {
              p.RATE = p.MRP;
            }

          }

          p.ALTRATE = p.RATE * p.CONFACTOR;
          p.AMOUNT = p.RATE * p.CONFACTOR * (p.Quantity + this.nullToZeroConverter(p.FreeQuantity));

          ///customer fix percentdiscount use for fitindia discount given in profit amount
          if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan)) {
            this.TrnMainObj.CDRATE = this.nullToZeroConverter(this.TrnMainObj.CDRATE);
            p.INDCDAMT = 0;
            this.TrnMainObj.CDAMT = 0;
            if (this.TrnMainObj.CDRATE > 0) {
              // let profitamount = this.nullToZeroConverter(p.RATE) - this.nullToZeroConverter(p.PRATE);
              // if (profitamount > 0) {
              p.INDCDAMT = p.RATE * p.Quantity * p.CONFACTOR * (this.TrnMainObj.CDRATE / 100);
              // p.INDCDAMT = p.Quantity * p.CONFACTOR * this.TrnMainObj.CDRATE * profitamount / 100;
              // }
            }
          }

          p.INDCDAMT = this.nullToZeroConverter(p.INDCDAMT);
          ///individual discount section
          p.INDDISCOUNTRATE = this.nullToZeroConverter(p.INDDISCOUNTRATE);
          p.ALTINDDISCOUNT = this.nullToZeroConverter(p.ALTINDDISCOUNT);


          if (p.INDDISCOUNTRATE > 0) {
            if (isB2BBilling == false && (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice)) {
              p.INDDISCOUNT = p.AMOUNT * p.INDDISCOUNTRATE / 100;
              p.ALTINDDISCOUNT = ((p.AMOUNT) + (p.AMOUNT * (p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100)) * p.INDDISCOUNTRATE / 100;

            }

            else {
              if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && (this.TrnMainObj.Mode == null ? '' : this.TrnMainObj.Mode).toLowerCase() != "new") {
                //discount from load
              }
              else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
                if (userSettings.gstIncludedIndDiscountOnPurchase == 1) {
                  p.INDDISCOUNT = p.AMOUNT * p.INDDISCOUNTRATE / 100;
                  p.ALTINDDISCOUNT = ((p.AMOUNT) + (p.AMOUNT * (p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100)) * p.INDDISCOUNTRATE / 100;
                }
                else {
                  p.INDDISCOUNT = p.AMOUNT * p.INDDISCOUNTRATE / 100;
                  p.ALTINDDISCOUNT = p.INDDISCOUNT;

                }
              }
              else {
                p.INDDISCOUNT = p.AMOUNT * p.INDDISCOUNTRATE / 100;
                p.ALTINDDISCOUNT = p.AMOUNT * p.INDDISCOUNTRATE / 100;
              }

            }
          }
          else if (p.ALTINDDISCOUNT > 0) {
            if (isB2BBilling == false && (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice)) {
              p.INDDISCOUNT = p.ALTINDDISCOUNT / (1 + ((p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100));
            } else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
              if (userSettings.gstIncludedIndDiscountOnPurchase == 1) {
                p.INDDISCOUNT = p.ALTINDDISCOUNT / (1 + ((p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100));
              }
              else {
                p.INDDISCOUNT = p.ALTINDDISCOUNT;

              }
            } else {
              p.INDDISCOUNT = p.ALTINDDISCOUNT;
            }
          }
          else {
            p.INDDISCOUNT = 0;
          }


          //In sales return or purchase each item comes with total discount of the concerned bill
          if ((this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) && (this.TrnMainObj.Mode == null ? '' : this.TrnMainObj.Mode).toLowerCase() == "new") {
            p.INDCDAMT = 0;//removing scheme discount if any applying
            p.INDCDRATE = 0;//removing scheme discount if any applying
            p.INDDISCOUNT = (p.TOTALDISCOUNTINRETRUN / p.STOCK) * p.Quantity * p.CONFACTOR;
            p.ALTINDDISCOUNT = (p.TOTALDISCOUNTINRETRUN / p.STOCK) * p.Quantity * p.CONFACTOR;
          }



          p.DISCOUNT = this.nullToZeroConverter(p.INDDISCOUNT) + this.nullToZeroConverter(p.INDODAMT) + this.nullToZeroConverter(p.INDCDAMT) + this.nullToZeroConverter(p.SchemeDiscount) + this.nullToZeroConverter(p.PROMOTION);

          //primary discount or disocunt2 logic mainly for pharma
          if (p.PrimaryDiscountPercent > 0) {
            if (userSettings.gstIncludedPrimaryDiscountOnPurchase == 1) {

              let taxab = p.AMOUNT - p.DISCOUNT;
              let netam = taxab + this.nullToZeroConverter(taxab * p.GSTRATE / 100) + this.nullToZeroConverter(p.ADJUSTEDAMNT) + (this.nullToZeroConverter(p.INDCESS_PER) * taxab / 100);
              let pD = this.nullToZeroConverter(p.PrimaryDiscountPercent) * (netam) / 100;
              p.PrimaryDiscount = pD / (1 + ((p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100));
              p.AltPrimaryDiscount = pD;

            }
            else {
              // console.log("check2");

              p.PrimaryDiscount = this.nullToZeroConverter(p.PrimaryDiscountPercent) * (p.AMOUNT - p.DISCOUNT) / 100;
              p.AltPrimaryDiscount = p.PrimaryDiscount;
            }
          }
          else if (p.AltPrimaryDiscount > 0) {
            if (userSettings.gstIncludedPrimaryDiscountOnPurchase == 1) {
              p.PrimaryDiscount = p.AltPrimaryDiscount / (1 + ((p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100));
            }
            else {
              p.PrimaryDiscount = p.AltPrimaryDiscount;
            }
          }
          p.DISCOUNT = this.nullToZeroConverter(p.DISCOUNT) + this.nullToZeroConverter(p.PrimaryDiscount);

          //secondary discount or disocunt3 logic mainly for pharma
          if (p.SecondaryDiscountPercent > 0) {
            if (userSettings.gstIncludedSecondaryDiscountPurchase == 1) {
              let taxab2 = p.AMOUNT - p.DISCOUNT;
              let netam2 = taxab2 + this.nullToZeroConverter(taxab2 * p.GSTRATE / 100) + this.nullToZeroConverter(p.ADJUSTEDAMNT) + (this.nullToZeroConverter(p.INDCESS_PER) * taxab2 / 100);
              let pD2 = this.nullToZeroConverter(p.SecondaryDiscountPercent) * (netam2) / 100;
              p.SecondaryDiscount = pD2 / (1 + ((p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100));
              p.AltSecondaryDiscount = pD2;
            } else {
              p.SecondaryDiscount = this.nullToZeroConverter(p.SecondaryDiscountPercent) * (p.AMOUNT - p.DISCOUNT) / 100;
              p.AltSecondaryDiscount = p.SecondaryDiscount;
            }
          }
          else if (p.AltSecondaryDiscount > 0) {
            if (userSettings.gstIncludedSecondaryDiscountPurchase == 1) {
              p.SecondaryDiscount = p.AltSecondaryDiscount / (1 + ((p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100));
            }
            else {
              p.SecondaryDiscount = p.AltSecondaryDiscount;
            }
          }
          p.DISCOUNT = this.nullToZeroConverter(p.DISCOUNT) + this.nullToZeroConverter(p.SecondaryDiscount);

        }
        p.TAXABLE = p.AMOUNT - p.DISCOUNT;
        p.NONTAXABLE = 0;
        p.VAT = p.TAXABLE * p.GSTRATE / 100;

        if (p.GSTRATE > 0 && p.VAT < 0.01) { p.VAT = 0.01; }//minimun vat 0.01 check in case of discounted
        ///weight section
        p.WEIGHT = p.CONFACTOR * p.Quantity * this.nullToZeroConverter(p.SELECTEDITEM.GWEIGHT);
        p.NWEIGHT = p.CONFACTOR * p.Quantity * this.nullToZeroConverter(p.SELECTEDITEM.NWEIGHT);

        //  cess calculation section

        p.INDCESS_AMT = this.nullToZeroConverter(p.INDCESS_PER) * p.TAXABLE / 100;

        p.NETAMOUNT = p.TAXABLE + this.nullToZeroConverter(p.NONTAXABLE) + this.nullToZeroConverter(p.VAT) + this.nullToZeroConverter(p.ADJUSTEDAMNT) + this.nullToZeroConverter(p.INDCESS_AMT);

        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance || this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {

          p.SPRICE = p.ALTRATE2 / p.CONFACTOR;
          let sprofitPrice = this.nullToZeroConverter(p.SPRICE);
          if (p.IsTaxInclusive == 1) {
            sprofitPrice = this.nullToZeroConverter(p.SPRICE) / (1 + (p.GSTRATE / 100));
          }
          p.PROFIT = (sprofitPrice - this.nullToZeroConverter(p.RATE)) * p.CONFACTOR;
        }
        else {
          p.PROFIT = (this.nullToZeroConverter(p.SPRICE) - this.nullToZeroConverter(p.PRATE)) * p.CONFACTOR;

        }
      }



      //TCS Calculation
      if (this.TrnMainObj.VoucherType != VoucherTypeEnum.Purchase) {
        this.TrnMainObj.AdditionalObj.TCS_PER = 0;
        this.TrnMainObj.AdditionalObj.TCS_AMT = 0;
      }
      this.calculateTotalsSum(isB2BBilling);


      ///for flat discount
      ///flat discount section
      // let flatDisRate = 0;
      this.billDiscountFromOfferCheck();//flat discount from offer check
      let flatDisRate = 0;
      this.TrnMainObj.DCRATE = this.nullToZeroConverter(this.TrnMainObj.DCRATE);
      this.TrnMainObj.ALT_TOTFLATDISCOUNT = this.nullToZeroConverter(this.TrnMainObj.ALT_TOTFLATDISCOUNT);
      let flatamountgiven = 0;//for  tackling like if 56 is put then is became 55.9999999999

      if (this.TrnMainObj.ALT_TOTFLATDISCOUNT > 0) {
        flatamountgiven = this.TrnMainObj.ALT_TOTFLATDISCOUNT;
        if (isB2BBilling == true) {
          flatDisRate = this.TrnMainObj.ALT_TOTFLATDISCOUNT * 100 / this.TrnMainObj.TAXABLE;
        }
        else {
          flatDisRate = this.TrnMainObj.ALT_TOTFLATDISCOUNT * 100 / this.TrnMainObj.NETWITHOUTROUNDOFF;
        }
      }
      if (this.TrnMainObj.DCRATE > 0) {
        flatamountgiven = 0;
        flatDisRate = this.TrnMainObj.DCRATE;
      }


      this.TrnMainObj.ALT_TOTFLATDISCOUNT = 0;
      this.TrnMainObj.TOTALFLATDISCOUNT = 0;

      for (var p of this.TrnMainObj.ProdList) {
        if (p.MCODE == null || p.SELECTEDITEM == null) { } else {
          let disWithTax = flatDisRate * p.NETAMOUNT / 100;
          let disBeforeTax = disWithTax / (1 + ((p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)) / 100));

          let taxDis = disWithTax - disBeforeTax;
          let netTaxable = p.TAXABLE - disBeforeTax;
          let netTax = this.nullToZeroConverter(p.VAT - (taxDis * (p.GSTRATE / (p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)))));
          let netCess = this.nullToZeroConverter(p.INDCESS_AMT - (taxDis * (this.nullToZeroConverter(p.INDCESS_PER) / (p.GSTRATE + this.nullToZeroConverter(p.INDCESS_PER)))));

          let netTotal = netTax + netTaxable + netCess;
          p.FLATDISCOUNT = disBeforeTax;
          p.ALTFLATDISCOUNT = disWithTax;
          p.TAXABLE = netTaxable;
          p.VAT = netTax;
          p.INDCESS_AMT = netCess;
          p.NETAMOUNT = netTotal;

          this.TrnMainObj.TOTALFLATDISCOUNT += p.FLATDISCOUNT;
          if (isB2BBilling == false) {
            this.TrnMainObj.ALT_TOTFLATDISCOUNT += p.ALTFLATDISCOUNT;
          }
          else {
            if (flatamountgiven > 0) {
              this.TrnMainObj.ALT_TOTFLATDISCOUNT = this.TrnMainObj.TOTALFLATDISCOUNT = flatamountgiven;
            }
            else {
              this.TrnMainObj.ALT_TOTFLATDISCOUNT = this.TrnMainObj.TOTALFLATDISCOUNT;
            }
          }
        }
        p.DISCOUNT = this.nullToZeroConverter(p.INDDISCOUNT) + this.nullToZeroConverter(p.PrimaryDiscount) + this.nullToZeroConverter(p.SecondaryDiscount)
          + this.nullToZeroConverter(p.FLATDISCOUNT) + this.nullToZeroConverter(p.INDODAMT) + this.nullToZeroConverter(p.INDCDAMT) + this.nullToZeroConverter(p.PROMOTION);
      }

      //TCS Calculation
      if (this.TrnMainObj.VoucherType != VoucherTypeEnum.Purchase) {
        this.TrnMainObj.AdditionalObj.TCS_PER = 0;
        this.TrnMainObj.AdditionalObj.TCS_AMT = 0;
      }
      this.calculateTotalsSum(isB2BBilling);

    }

    catch (error) {
      this.alertService.error("Error On BillCalculation:" + error);
    }

  }


  calculateTotalsSum(isB2BBilling = false) {

    this.TrnMainObj.TOTAMNT = 0;
    this.TrnMainObj.TOTALINDDISCOUNT = 0;
    this.TrnMainObj.DCAMNT = 0;
    this.TrnMainObj.TAXABLE = 0;
    this.TrnMainObj.NONTAXABLE = 0;
    this.TrnMainObj.VATAMNT = 0;
    this.TrnMainObj.NETWITHOUTROUNDOFF = 0;
    this.TrnMainObj.TotalWithIndDiscount = 0;
    this.TrnMainObj.TOTALDISCOUNT = 0;
    this.TrnMainObj.TOTALQTY = 0;
    this.TrnMainObj.TOTALWEIGHT = 0;
    this.TrnMainObj.TOTALNETWEIGHT = 0;
    this.TrnMainObj.TOTALDISCOUNT_VATINCLUDED = 0;
    this.TrnMainObj.TOTALCLDQUANTITY = 0;
    this.TrnMainObj.AdditionalObj.TOTALEXTRACESS = 0;
    this.TrnMainObj.CDAMT = 0;
    this.TrnMainObj.TOTALPROMOTION = 0;
    for (var p of this.TrnMainObj.ProdList) {
      if (p.MCODE == null || p.SELECTEDITEM == null) { } else {
        ``
        this.TrnMainObj.TOTAMNT += this.nullToZeroConverter(p.AMOUNT);
        this.TrnMainObj.TOTALINDDISCOUNT += this.nullToZeroConverter(p.INDDISCOUNT);
        this.TrnMainObj.TAXABLE += this.nullToZeroConverter(p.TAXABLE);
        this.TrnMainObj.NETWITHOUTROUNDOFF += this.nullToZeroConverter(p.NETAMOUNT);
        this.TrnMainObj.DCAMNT += this.nullToZeroConverter(p.DISCOUNT);
        this.TrnMainObj.NONTAXABLE += this.nullToZeroConverter(p.NONTAXABLE);
        this.TrnMainObj.VATAMNT += this.nullToZeroConverter(p.VAT);
        this.TrnMainObj.TOTALDISCOUNT += this.nullToZeroConverter(p.DISCOUNT);
        this.TrnMainObj.TOTALQTY += this.nullToZeroConverter((p.Quantity * p.CONFACTOR));
        this.TrnMainObj.TOTALWEIGHT += this.nullToZeroConverter(p.WEIGHT);
        this.TrnMainObj.TOTALNETWEIGHT += this.nullToZeroConverter(p.NWEIGHT);
        this.TrnMainObj.AdditionalObj.TOTALEXTRACESS += this.nullToZeroConverter(p.INDCESS_AMT);;
        this.TrnMainObj.TOTALCLDQUANTITY += this.nullToZeroConverter(p.CARTON);
        this.TrnMainObj.CDAMT += this.nullToZeroConverter(p.INDCDAMT);
        this.TrnMainObj.TOTALPROMOTION += this.nullToZeroConverter(p.PROMOTION);

      }
    }


    //TCS Calculation
    if (isB2BBilling == true && this.nullToZeroConverter(this.setting.appSetting.EnableTSC) == 1 &&
      this.nullToZeroConverter(this.userProfile.CompanyInfo.LastYearTurnOver) < 5000000000 &&
      this.nullToZeroConverter(this.setting.appSetting.TCS_PreviousYearTurnOverLimit) < this.nullToZeroConverter(this.userProfile.CompanyInfo.LastYearTurnOver) &&
      (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice)) {
      let tscper = 0;
      if (this.TrnMainObj.AdditionalObj.BILLTOPAN == null || this.TrnMainObj.AdditionalObj.BILLTOPAN == undefined
        || this.TrnMainObj.AdditionalObj.BILLTOPAN == "" || this.TrnMainObj.AdditionalObj.BILLTOPAN.length < 2) {
        tscper = this.nullToZeroConverter(this.setting.appSetting.TCS_NONPANUSER_PER);
      }
      else {
        tscper = this.nullToZeroConverter(this.setting.appSetting.TCS_PANUSER_PER);
      }

      if (this.nullToZeroConverter(this.setting.appSetting.TCS_CustomerCurrentYearSalesLimit) <
        this.nullToZeroConverter(this.TrnMainObj.AdditionalObj.CUSTOMER_TOTALSALES)) {
        this.TrnMainObj.AdditionalObj.TCS_PER = tscper;
        this.TrnMainObj.AdditionalObj.TCS_AMT = tscper * this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF) / 100;
        this.TrnMainObj.NETWITHOUTROUNDOFF = this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF) + this.TrnMainObj.AdditionalObj.TCS_AMT;

      }
      else if (this.nullToZeroConverter(this.setting.appSetting.TCS_CustomerCurrentYearSalesLimit) <
        (this.nullToZeroConverter(this.TrnMainObj.AdditionalObj.CUSTOMER_TOTALSALES) + this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF))) {

        this.TrnMainObj.AdditionalObj.TCS_PER = tscper;
        this.TrnMainObj.AdditionalObj.TCS_AMT = tscper * (this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF) +
          this.nullToZeroConverter(this.TrnMainObj.AdditionalObj.CUSTOMER_TOTALSALES) -
          this.nullToZeroConverter(this.setting.appSetting.TCS_CustomerCurrentYearSalesLimit)) / 100;
        this.TrnMainObj.NETWITHOUTROUNDOFF = this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF) + this.TrnMainObj.AdditionalObj.TCS_AMT;
      }
    }
    else {
      //for view purpose and Pi
      if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice
        || this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
        this.TrnMainObj.NETWITHOUTROUNDOFF = this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF) + this.nullToZeroConverter(this.TrnMainObj.AdditionalObj.TCS_AMT);
      }
    }


    /**
     * Round Off Configuration
     */


    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
      if (this.AppSettings.ENABLEROUNDOFFINPURCHASE) {
        if (this.AppSettings.ROUNDOFFLIMITERINPURCHASE == 0) {
          this.TrnMainObj.NETAMNT = Math.floor(this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF));
          this.TrnMainObj.ROUNDOFF = this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
        } else {
          this.TrnMainObj.NETAMNT = Math.ceil(this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF));
          this.TrnMainObj.ROUNDOFF = this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
        }
      } else {
        this.TrnMainObj.NETAMNT = Math.round(this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF));
        this.TrnMainObj.ROUNDOFF = this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
      }
    } else if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      if (this.AppSettings.ENABLEROUNDOFFINSALES) {
        if (this.AppSettings.ROUNDOFFLIMITERINSALES == 0) {
          this.TrnMainObj.NETAMNT = Math.floor(this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF));
          this.TrnMainObj.ROUNDOFF = this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;

        } else {
          this.TrnMainObj.NETAMNT = Math.ceil(this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF));
          this.TrnMainObj.ROUNDOFF = this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
        }
      } else {
        this.TrnMainObj.NETAMNT = Math.round(this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF));
        this.TrnMainObj.ROUNDOFF = this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
      }
    } else {
      this.TrnMainObj.NETAMNT = Math.round(this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF));
      this.TrnMainObj.ROUNDOFF = this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
    }

  }
  isB2BTransaction(partyType: string) {

    partyType = partyType == null ? "" : partyType.toLowerCase();
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice || this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
      if (partyType == "walkin" || partyType == "walking" || partyType == "") { return false; }
      else { return true; }
    } else { return true; }
    // if (partyType == "superdistributor" ||
    //   partyType == "distributor" ||
    //   partyType == "substockist" ||
    //   partyType == "superstockist" ||
    //   partyType == "wdb" ||
    //   partyType == "ssa" ||
    //   partyType == "zcp" ||
    //   partyType == "ak" ||
    //   partyType == "ck" ||
    //   partyType == "gak" ||
    //   partyType == "retailer" ||
    //   partyType == "pms" ||
    //   partyType == "fitindia" ||
    //   this.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
    //   this.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
    //   this.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
    //   return true;
    // }
    // else {
    //   return false;
    // }
  }
  isStockIn(VT: VoucherTypeEnum) {
    if (
      VT == VoucherTypeEnum.Purchase ||
      VT == VoucherTypeEnum.MaterialReceipt ||
      VT == VoucherTypeEnum.SalesReturn ||
      VT == VoucherTypeEnum.CreditNote ||
      VT == VoucherTypeEnum.BranchTransferIn ||
      VT == VoucherTypeEnum.DeliveryReturn ||
      VT == VoucherTypeEnum.GoodsReceived ||
      VT == VoucherTypeEnum.PurchaseOrder ||
      VT == VoucherTypeEnum.RFQ ||
      VT == VoucherTypeEnum.TaxInvoiceCancel ||
      VT == VoucherTypeEnum.PurchaseReturnCancel ||
      VT == VoucherTypeEnum.OpeningStockBalance ||
      VT == VoucherTypeEnum.InterCompanyTransferIn
    ) {
      return true;
    }
    else { return false; }
  }
  rowBackGrounfColor(i) {
    let color = this.TrnMainObj.ProdList[i].backgroundcolor;
    if (color == null || color == "") {
      color = "white";
    }
    return color;
  }

  getRetailerLandingForSecondaryDiscount(ProductRates) {
    let retailerLandingrate = 0;
    if (
      this.TrnMainObj.PARTY_ORG_TYPE == "ak" ||
      this.TrnMainObj.PARTY_ORG_TYPE == "ck" ||
      this.TrnMainObj.PARTY_ORG_TYPE == "gak" ||
      (this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
        this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
        this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "gak")) { retailerLandingrate = ProductRates.akckLandingRate; }

    else {
      retailerLandingrate = ProductRates.DistributorSellingRate;
    }
    return retailerLandingrate;
  }
  getRateForPrimaryDiscount(ProductRates) {
    let primaryDisCalRate = 0;
    if (this.TrnMainObj.PARTY_ORG_TYPE == null) { this.TrnMainObj.PARTY_ORG_TYPE = ""; }
    if (this.TrnMainObj.PARTY_ORG_TYPE.toLowerCase() == "superstockist" || this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "substockist" ||
      this.TrnMainObj.PARTY_ORG_TYPE.toLowerCase() == "substockist" || this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superstockist") {
      primaryDisCalRate = ProductRates.superStockistLandingPrice;
    }
    else {
      primaryDisCalRate = ProductRates.SuperDistributorLandingRate;
    }
    return primaryDisCalRate;
  }

  TCSAmountChange() {
    this.calculateTotalsSum();
  }
  TCSPercentageChange() {
    this.calculateTotalsSum();
  }

  // determineAutoSchemeApplied(index: any) {
  //   let PrimaryDiscountpercent = this.TrnMainObj.ProdList[index].PrimaryDiscountPercent;
  //   let SecondaryDiscountPercent = this.TrnMainObj.ProdList[index].SecondaryDiscountPercent;
  //   let LiquiditionDiscountPercent = this.TrnMainObj.ProdList[index].LiquiditionDiscountPercent;
  //   if (PrimaryDiscountpercent == 0 && SecondaryDiscountPercent == 0 && LiquiditionDiscountPercent == 0) {
  //     // this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = false;
  //     // this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = false;
  //     // this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = false;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 0;
  //     return;
  //   }
  //   if (PrimaryDiscountpercent == 0 && SecondaryDiscountPercent == 0 && LiquiditionDiscountPercent > 0) {
  //     // this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = false;
  //     // this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = false;
  //     // this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = true;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 1;

  //     return;
  //   }
  //   if (PrimaryDiscountpercent == 0 && SecondaryDiscountPercent > 0 && LiquiditionDiscountPercent == 0) {
  //     // this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = false;
  //     // this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = true;
  //     // this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = false;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 2;

  //     return;
  //   }
  //   if (PrimaryDiscountpercent == 0 && SecondaryDiscountPercent > 0 && LiquiditionDiscountPercent > 0) {
  //     // this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = false;
  //     // this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = true;
  //     // this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = true;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 3;

  //     return;
  //   }
  //   if (PrimaryDiscountpercent > 0 && SecondaryDiscountPercent == 0 && LiquiditionDiscountPercent == 0) {
  //     // this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = true;
  //     // this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = false;
  //     // this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = false;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 4;

  //     return;
  //   }
  //   if (PrimaryDiscountpercent > 0 && SecondaryDiscountPercent == 0 && LiquiditionDiscountPercent > 0) {
  //     // this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = true;
  //     // this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = false;
  //     // this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = true;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 5;

  //     return;
  //   }
  //   if (PrimaryDiscountpercent > 0 && SecondaryDiscountPercent > 0 && LiquiditionDiscountPercent == 0) {
  //     // this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = true;
  //     // this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = true;
  //     // this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = false;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 6;

  //     return;
  //   }
  //   if (PrimaryDiscountpercent > 0 && SecondaryDiscountPercent > 0 && LiquiditionDiscountPercent > 0) {
  //     // this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = true;
  //     // this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = true;
  //     // this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = true;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 7;

  //     return;
  //   }
  // }



  // determineAutoSchemeAppliedinView(index: any, schemeapplied: string) {
  //   if (schemeapplied == 0) {
  //     this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = false;
  //     this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = false;
  //     this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = false;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 0;
  //     return;
  //   }
  //   if (schemeapplied == 1) {
  //     this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = false;
  //     this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = false;
  //     this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = true;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 1;

  //     return;
  //   }
  //   if (schemeapplied == 2) {
  //     this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = false;
  //     this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = true;
  //     this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = false;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 2;

  //     return;
  //   }
  //   if (schemeapplied == 3) {
  //     this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = false;
  //     this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = true;
  //     this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = true;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 3;

  //     return;
  //   }
  //   if (schemeapplied == 4) {
  //     this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = true;
  //     this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = false;
  //     this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = false;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 4;

  //     return;
  //   }
  //   if (schemeapplied == 5) {
  //     this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = true;
  //     this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = false;
  //     this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = true;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 5;

  //     return;
  //   }
  //   if (schemeapplied == 6) {
  //     this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = true;
  //     this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = true;
  //     this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = false;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 6;

  //     return;
  //   }
  //   if (schemeapplied == 7) {
  //     this.TrnMainObj.ProdList[index].ISAUTOPRIMARYSCHEME = true;
  //     this.TrnMainObj.ProdList[index].ISAUTOSECONDARYSCHEME = true;
  //     this.TrnMainObj.ProdList[index].ISAUTOLIQUIDATIONSCHEME = true;
  //     this.TrnMainObj.ProdList[index].SCHEMESAPPLIED = 7;

  //     return;
  //   }
  // }


  getCategoryWisePricelevelGstExcluded(RATE_A: number, RATE_B: number, RATE_C: number) {
    if (this.TrnMainObj.CUS_CATEGORY_PRICELEVEL == "Institutional Price") {
      return RATE_C;
    }
    else if (this.TrnMainObj.CUS_CATEGORY_PRICELEVEL == "Wholesale Price") {
      return RATE_B;
    }
    else {
      return RATE_A;
    }
  }

  getCategoryWisePricelevelGstIncluded(IN_RATE_A: number, IN_RATE_B: number, IN_RATE_C: number) {
    if (this.TrnMainObj.CUS_CATEGORY_PRICELEVEL == "institutionalPrice") {
      return IN_RATE_C;
    }
    else if (this.TrnMainObj.CUS_CATEGORY_PRICELEVEL == "wholesalePrice") {
      return IN_RATE_B;
    }
    else {
      return IN_RATE_A;
    }
  }

  checkMcodePresentInProd(mcode: string) {
    let mcodePresent = false;
    if (this.TrnMainObj.ProdList != null) {
      if (this.TrnMainObj.ProdList.find(x => x.MCODE == mcode) != undefined) {
        mcodePresent = true;
      }
    }
    return mcodePresent;
  }

  salesvoucherserieschange() {
    this.getVoucherNumber();
  }


  getVariantNameFromId = (variantID: string): string => {
    let variantdeail = this.masterService.variantmaster.filter(x => x.VARIANT == variantID);
    if (variantdeail != null && variantdeail.length) {
      return variantdeail[0].VARIANTNAME;
    } else {
      return ""
    }
  }
  getVariantCategoryNameFromId = (variantID: string): string => {
    let variantdeail = this.masterService.variantmaster.filter(x => x.VARIANT == variantID);
    if (variantdeail != null && variantdeail.length) {
      return variantdeail[0].NAME;
    } else {
      return ""
    }
  }
  getSchemeAndRecalcualte(activeRowIndex: number) {
    this.prodActiveRowIndex = activeRowIndex;
    if (this.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      if (this.TrnMainObj.ProdList[activeRowIndex].Quantity < 1) {
        return;
      }
      let schemeInput = [];
      schemeInput.push({ mcode: this.TrnMainObj.ProdList[activeRowIndex].MCODE, qty: this.TrnMainObj.ProdList[activeRowIndex].Quantity, retailer: this.TrnMainObj.PARAC, rate: this.TrnMainObj.ProdList[activeRowIndex].ALTRATE, WEIGHT: this.TrnMainObj.ProdList[activeRowIndex].WEIGHT });
      this.masterService.masterPostmethod("/dmsScheme/searchscheme", { data: schemeInput }).subscribe(response => {
        if (response.status == "ok" && response.result && response.result != null && response.result.length) {
          this.TrnMainObj.ProdList[activeRowIndex].TRNSCHEMEAPPLIED = [];
          this.TrnMainObj.ProdList[activeRowIndex].INDCDRATE = response.result[0].value;
          if (response.result[0].valuetype == "Percentage") {
            this.TrnMainObj.ProdList[activeRowIndex].INDCDAMT = response.result[0].discountamount;
          } else {
            this.TrnMainObj.ProdList[activeRowIndex].INDCDAMT = response.result[0].discountamount * response.result[0].totalQty;

          }

          this.ReCalculateBillWithNormal();
          let trnSchemeApplied: TRNSCHEMEAPPLIED = <TRNSCHEMEAPPLIED>{};
          trnSchemeApplied.VCHRNO = this.TrnMainObj.VCHRNO;
          trnSchemeApplied.MCODE = this.TrnMainObj.ProdList[activeRowIndex].MCODE;
          trnSchemeApplied.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
          trnSchemeApplied.DIVISION = this.masterService.userProfile.userDivision;
          trnSchemeApplied.PHISCALID = this.masterService.userProfile.CompanyInfo.PhiscalID;
          trnSchemeApplied.SCHEMENO = response.result[0].schemeno;
          trnSchemeApplied.SCHEMEPERCENT = response.result[0].value;

          if (response.result[0].valuetype == "Percentage") {
            trnSchemeApplied.SCHEMEAMOUNT = response.result[0].discountamount;
          } else {
            trnSchemeApplied.SCHEMEAMOUNT = response.result[0].discountamount * response.result[0].totalQty;

          }
          this.TrnMainObj.ProdList[activeRowIndex].TRNSCHEMEAPPLIED.push(trnSchemeApplied);

        }
      }

      );
    }

  }



  offerCalculation() {
    if (this.TrnMainObj.VoucherType != VoucherTypeEnum.TaxInvoice) return;
    for (let p of this.TrnMainObj.ProdList) {
      let appliedScheme = [];
      p.PROMOTION = 0;//initialized zero befor applying any discount .also for tackling any change on scheme applied item
      p.SCHEMESAPPLIED = null;
      if (p.categorys == null) { p.categorys = []; }

      //     let schemeAppliedRate=0;
      //     if(this.isB2BTransaction(this.TrnMainObj.PARTY_ORG_TYPE))
      //     {
      //       schemeAppliedRate=p.RATE;
      //     }
      //  else
      //  {
      //    schemeAppliedRate=p.RATE+(p.GSTRATE*p.RATE/100);
      //  }

      // if (p.AllSchemeOffer != null && p.AllSchemeOffer.length > 0) {
      //   for (let s of p.AllSchemeOffer) {

      //     if (s.isSelected == true) {
      //       // if (s.schemeType == "bybulk") {
      //       //   //buy 2 get one free or buy 3 get one free offer
      //       //   //commented beacuse it is later calculated seperatly for different batch
      //       //   // if (s.offerOn == "quantity" && this.nullToZeroConverter(s.discountedQty) > 0 && this.nullToZeroConverter(s.minQty) > 0 && s.mcode == p.MCODE) {


      //       //   //   s.discountedQty = this.nullToZeroConverter(s.discountedQty);
      //       //   //   s.minQty = this.nullToZeroConverter(s.minQty);
      //       //   //   if (p.RealQty >= s.minQty + s.discountedQty) {
      //       //   //     let qtyForscheme = p.RealQty;
      //       //   //     //getting divisible quanttity account to scheme qty like 1 free for 3 buy the if 5 buy only 1 free
      //       //   //     qtyForscheme = (s.minQty + s.discountedQty) * Math.floor(p.RealQty / (s.minQty + s.discountedQty));
      //       //   //     let promotionbybulkDis = p.RATE * qtyForscheme * s.discountedQty / (s.minQty + s.discountedQty);
      //       //   //     p.PROMOTION = p.PROMOTION + promotionbybulkDis;
      //       //   //     appliedScheme.push(s);
      //       //   //   }
      //       //   // }

      //       //   // buy 2 and get 10 percent discount or buy 5 and get  10 percent discount scheme
      //       //   if (s.offerOn == "rate" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.disrate) > 0 && s.mcode == p.MCODE) {
      //       //     s.disrate = this.nullToZeroConverter(s.disrate);
      //       //     s.minQty = this.nullToZeroConverter(s.minQty);
      //       //     if (p.RealQty >= s.minQty) {
      //       //       let qtyForscheme = p.RealQty;
      //       //       //getting divisible quanttity accourding to scheme qty like 10% free for 3 buy the if 5 buy only 10% free
      //       //       qtyForscheme = (s.minQty) * Math.floor(p.RealQty / s.minQty);
      //       //       let promotionbybulkDisRate = p.RATE * qtyForscheme * s.disrate / 100;
      //       //       p.PROMOTION = p.PROMOTION + promotionbybulkDisRate;
      //       //       appliedScheme.push(s);
      //       //     }
      //       //   }
      //       //   // buy 2 and get 10 Rupee discount or buy 5 and get  10 Rupee discount scheme
      //       //   if (s.offerOn == "amount" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.disamount) > 0 && s.mcode == p.MCODE) {
      //       //     s.disamount = this.nullToZeroConverter(s.disamount);
      //       //     s.minQty = this.nullToZeroConverter(s.minQty);
      //       //     if (p.RealQty >= s.minQty) {
      //       //       let qtyForscheme = p.RealQty;
      //       //       //getting divisible quanttity according to scheme qty like 10 rupee free for 3 buy the if 5 buy only 10 rupee free
      //       //       qtyForscheme = Math.floor(p.RealQty / s.minQty);
      //       //       let promotionbybulkDisAmount = s.disamount * qtyForscheme;
      //       //       if (s.vat == 1) {
      //       //         promotionbybulkDisAmount = (s.disamount / (1 + (p.GSTRATE / 100))) * qtyForscheme;
      //       //       }

      //       //       p.PROMOTION = p.PROMOTION + promotionbybulkDisAmount;
      //       //       appliedScheme.push(s);
      //       //     }
      //       //   }
      //       // }
      //       //  if (s.schemeType == "bydiscount") {
      //       //   //individual discount by percentage
      //       //   if (s.offerOn == "rate" && this.nullToZeroConverter(s.disrate) > 0 && s.mcode == p.MCODE) {

      //       //     let qtyForscheme = p.RealQty;
      //       //     p.PROMOTION = p.PROMOTION + (this.nullToZeroConverter(s.disrate) * p.AMOUNT / 100);
      //       //     appliedScheme.push(s);



      //       //   }
      //       //   //individual discount by amount like get 5 rupee discount on item buy
      //       //   if (s.offerOn == "amount" && this.nullToZeroConverter(s.disamount) > 0 && s.mcode == p.MCODE) {

      //       //     let qtyForscheme = p.RealQty;

      //       //     let promotionbyamtDisAmount = (this.nullToZeroConverter(s.disamount) * p.RealQty);
      //       //     if (s.vat == 1) {
      //       //       promotionbyamtDisAmount = (this.nullToZeroConverter(s.disamount) / (1 + (p.GSTRATE / 100))) * p.RealQty;
      //       //     }
      //       //     p.PROMOTION = p.PROMOTION + promotionbyamtDisAmount;
      //       //     appliedScheme.push(s);

      //       //   }

      //       // }
      //       //rangge discount like from 1 to 2
      //       // if (s.schemeType == "byslabdiscount") {
      //       //   s.greaterThan = this.nullToZeroConverter(s.greaterThan);
      //       //   s.lessThan = this.nullToZeroConverter(s.lessThan);
      //       //   //range on quantiy like buy 1 to 10 quantity
      //       //   if (s.slabDiscountType == "quantityRange") {


      //       //     if (p.RealQty >= s.greaterThan && p.RealQty <= s.lessThan) {
      //       //       //get centrain percent disocunt on that range
      //       //       if (s.offerOn == "rate" && this.nullToZeroConverter(s.disrate) > 0 && s.mcode == p.MCODE) {
      //       //         s.disrate = this.nullToZeroConverter(s.disrate);
      //       //         let qtyForscheme = p.RealQty;
      //       //         let promotionbyslabDisRate = p.RATE * qtyForscheme * s.disrate / 100;
      //       //         p.PROMOTION = p.PROMOTION + promotionbyslabDisRate;
      //       //         appliedScheme.push(s);
      //       //       }
      //       //       //centain amount discount
      //       //       else if (s.offerOn == "amount" && this.nullToZeroConverter(s.disamount) > 0 && s.mcode == p.MCODE) {
      //       //         s.disamount = this.nullToZeroConverter(s.disamount);
      //       //         let qtyForscheme = p.RealQty;

      //       //         let promotionbyamtDisAmount = (s.disamount * p.RealQty);

      //       //         if (s.vat == 1) {
      //       //           promotionbyamtDisAmount = (s.disamount / (1 + (p.GSTRATE / 100))) * p.RealQty;
      //       //         }
      //       //         p.PROMOTION = p.PROMOTION + promotionbyamtDisAmount;
      //       //         appliedScheme.push(s);

      //       //       }
      //       //       //priec of amount changes
      //       //       else if (s.offerOn == "fixprice" && this.nullToZeroConverter(s.rate_A) > 0 && s.mcode == p.MCODE) {
      //       //         s.rate_A = this.nullToZeroConverter(s.rate_A);
      //       //         let qtyForscheme = p.RealQty;

      //       //         let promotionbyamtDisAmount = (p.RATE - s.rate_A) * p.RealQty;

      //       //         if (p.IsTaxInclusive == 1) {
      //       //           promotionbyamtDisAmount = ((p.AMOUNT + (p.GSTRATE * p.AMOUNT / 100) - s.rate_A) / (1 + (p.GSTRATE / 100))) * p.RealQty;
      //       //         }
      //       //         p.PROMOTION = p.PROMOTION + promotionbyamtDisAmount;
      //       //         appliedScheme.push(s);

      //       //       }
      //       //     }
      //       //   }

      //       // }
      //       //buy x and discount on y
      //       //  if (s.schemeType == "bybulkonanotheritem") {

      //       //   //price of amount changes if minqty is 2 then on 2 buy one qty of other item in special price
      //       //   if (s.offerOn == "fixprice" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.rate_A) > 0 && s.disItemCode == p.MCODE) {
      //       //     s.rate_A = this.nullToZeroConverter(s.rate_A);
      //       //     s.minQty = this.nullToZeroConverter(s.minQty);
      //       //     let parentitemSellQty = 0;
      //       //     //calculating the sell quantity of scheme parent item
      //       //     this.TrnMainObj.ProdList.forEach(element => {
      //       //       if (element.MCODE == s.mcode) { parentitemSellQty += element.RealQty; }
      //       //     });
      //       //     if (parentitemSellQty >= s.minQty) {

      //       //       let qtyForOffer = Math.floor(parentitemSellQty / s.minQty);
      //       //       let offerCalculatingQty = qtyForOffer > p.RealQty ? p.RealQty : qtyForOffer;
      //       //       let promotionbyamtDisAmount = (p.RATE - s.rate_A) * offerCalculatingQty;

      //       //       if (p.IsTaxInclusive == 1) {
      //       //         promotionbyamtDisAmount = ((p.AMOUNT + (p.GSTRATE * p.AMOUNT / 100) - s.rate_A) / (1 + (p.GSTRATE / 100))) * offerCalculatingQty;
      //       //       }
      //       //       p.PROMOTION = p.PROMOTION + promotionbyamtDisAmount;
      //       //       appliedScheme.push(s);
      //       //     }

      //       //   }
      //       //   //buy 2 get other item one free or buy 3 get other item one free offer
      //       //   else if (s.offerOn == "quantity" && this.nullToZeroConverter(s.discountedQty) > 0 && this.nullToZeroConverter(s.minQty) > 0 && s.disItemCode == p.MCODE) {
      //       //     s.discountedQty = this.nullToZeroConverter(s.discountedQty);
      //       //     s.minQty = this.nullToZeroConverter(s.minQty);
      //       //     let parentitemSellQty = 0;
      //       //     //calculating the sell quantity of scheme parent item
      //       //     this.TrnMainObj.ProdList.forEach(element => {
      //       //       if (element.MCODE == s.mcode) { parentitemSellQty += element.RealQty; }
      //       //     });
      //       //     if (parentitemSellQty >= s.minQty) {
      //       //       let qtyForOffer = Math.floor(parentitemSellQty / s.minQty);
      //       //       let offerCalculatingQty = qtyForOffer > p.RealQty ? p.RealQty : qtyForOffer;

      //       //       let promotionbybulkDis = ((p.RATE * offerCalculatingQty) + (p.GSTRATE * p.RATE * offerCalculatingQty / 100) - 0.4) / (1 + (p.GSTRATE / 100));
      //       //       p.PROMOTION = p.PROMOTION + promotionbybulkDis;

      //       //       appliedScheme.push(s);
      //       //     }
      //       //   }

      //       //   // buy 2 and get 10 percent discount or buy 5 and get  10 percent discount scheme on another item
      //       //   else if (s.offerOn == "rate" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.disrate) > 0 && s.disItemCode == p.MCODE) {
      //       //     s.disrate = this.nullToZeroConverter(s.disrate);
      //       //     s.minQty = this.nullToZeroConverter(s.minQty);
      //       //     let parentitemSellQty = 0;
      //       //     //calculating the sell quantity of scheme parent item
      //       //     this.TrnMainObj.ProdList.forEach(element => {
      //       //       if (element.MCODE == s.mcode) { parentitemSellQty += element.RealQty; }
      //       //     });
      //       //     if (parentitemSellQty >= s.minQty) {

      //       //       let qtyForOffer = Math.floor(parentitemSellQty / s.minQty);
      //       //       let offerCalculatingQty = qtyForOffer > p.RealQty ? p.RealQty : qtyForOffer;


      //       //       let promotionbybulkDisRate = p.RATE * offerCalculatingQty * s.disrate / 100;
      //       //       p.PROMOTION = p.PROMOTION + promotionbybulkDisRate;
      //       //       appliedScheme.push(s);


      //       //     }
      //       //   }
      //       //   // buy 2 and get 10 Rupee discount or buy 5 and get  10 Rupee discount scheme
      //       //   else if (s.offerOn == "amount" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.disamount) > 0 && s.mcode == p.MCODE) {
      //       //     s.disamount = this.nullToZeroConverter(s.disamount);
      //       //     s.minQty = this.nullToZeroConverter(s.minQty);
      //       //     let parentitemSellQty = 0;
      //       //     //calculating the sell quantity of scheme parent item
      //       //     this.TrnMainObj.ProdList.forEach(element => {
      //       //       if (element.MCODE == s.mcode) { parentitemSellQty += element.RealQty; }
      //       //     });
      //       //     if (parentitemSellQty >= s.minQty) {

      //       //       let qtyForOffer = Math.floor(parentitemSellQty / s.minQty);
      //       //       let offerCalculatingQty = qtyForOffer > p.RealQty ? p.RealQty : qtyForOffer;

      //       //       let promotionbybulkDisAmount = s.disamount * offerCalculatingQty;
      //       //       if (s.vat == 1) {
      //       //         promotionbybulkDisAmount = (s.disamount / (1 + (p.GSTRATE / 100))) * offerCalculatingQty;
      //       //       }

      //       //       p.PROMOTION = p.PROMOTION + promotionbybulkDisAmount;
      //       //       appliedScheme.push(s);
      //       //     }
      //       //   }
      //       //   p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
      //       // }
      //     }
      //   }


      // }
    }

    /// offer logic for qunatiy wise scheme if multiple batch is choosen


  }
  offerCalculation_multiplebatch() {
    if (this.TrnMainObj.VoucherType != VoucherTypeEnum.TaxInvoice) return;
    if (this.TrnMainObj.offerList == null || this.TrnMainObj.offerList.length <= 0) return;
    let selectedOfferList = this.TrnMainObj.offerList.filter(x => x.isSelected == true);
    for (var s of selectedOfferList) {


      if (s.schemeType == "bybulk") {
        if (s.discountType == "MCAT") {
          if (s.offerOn == "quantity" && this.nullToZeroConverter(s.discountedQty) > 0 && this.nullToZeroConverter(s.minQty) > 0) {
            s.discountedQty = this.nullToZeroConverter(s.discountedQty);
            s.minQty = this.nullToZeroConverter(s.minQty);

            let tRealQty = this.getSum(this.TrnMainObj.ProdList.filter(x => ((x.categorys != null && x.categorys.find(w => w.category == s.mcat) != null) || (x.VARIANTLIST != null && x.VARIANTLIST[s.variantid] != null && x.VARIANTLIST[s.variantid].NAME == s.mcat))), 'RealQty');

            if (tRealQty >= s.minQty + s.discountedQty) {
              //getting divisible quantity account to scheme qty like 1 free for 3 buy the if 5 buy only 1 free
              let qtyForscheme = (s.minQty + s.discountedQty) * Math.floor(tRealQty / (s.minQty + s.discountedQty));
              let totalFreeQty = s.discountedQty * Math.floor(tRealQty / (s.minQty + s.discountedQty));

              for (var p of this.TrnMainObj.ProdList.filter(a => (a.categorys.find(w => w.category == s.mcat) != null || (a.VARIANTLIST != null && a.VARIANTLIST[s.variantid] != null && a.VARIANTLIST[s.variantid].NAME == s.mcat))).sort((x, y) => x.RATE - y.RATE)) {

                let offerminusQuantity = 0;

                if (totalFreeQty <= p.RealQty) {
                  let appliedScheme = [];
                  let promotionbybulkDis = ((p.RATE * totalFreeQty) + (p.GSTRATE * p.RATE * totalFreeQty / 100) - 0.4) / (1 + (p.GSTRATE / 100));
                  p.PROMOTION = promotionbybulkDis;
                  appliedScheme.push(s);
                  p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
                  break;
                }
                else {
                  let appliedScheme = [];
                  let promotionbybulkDis = ((p.RATE * p.RealQty) + (p.GSTRATE * p.RATE * p.RealQty / 100) - 0.4) / (1 + (p.GSTRATE / 100));
                  p.PROMOTION = promotionbybulkDis;
                  appliedScheme.push(s);
                  p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
                  totalFreeQty = totalFreeQty - p.RealQty;
                }
              }
            }
          }
          if (s.offerOn == "rate" && this.nullToZeroConverter(s.disrate) > 0 && this.nullToZeroConverter(s.minQty) > 0) {
            s.discountedQty = this.nullToZeroConverter(s.discountedQty);
            s.minQty = this.nullToZeroConverter(s.minQty);
            let tRealQty = this.getSum(this.TrnMainObj.ProdList.filter(x => ((x.categorys != null && x.categorys.find(w => w.category == s.mcat) != null) || (x.VARIANTLIST != null && x.VARIANTLIST[s.variantid] != null && x.VARIANTLIST[s.variantid].NAME == s.mcat))), 'RealQty');
            if (tRealQty >= s.minQty) {
              for (var p of this.TrnMainObj.ProdList.filter(a => (a.categorys.find(w => w.category == s.mcat) != null || (a.VARIANTLIST != null && a.VARIANTLIST[s.variantid] != null && a.VARIANTLIST[s.variantid].NAME == s.mcat)))) {

                let appliedScheme = [];

                let qtyForscheme = p.RealQty;
                p.PROMOTION = (this.nullToZeroConverter(s.disrate) * p.AMOUNT / 100);
                appliedScheme.push(s);

                p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
              }
            }
          }
        }
        else if (s.discountType == "Mcode") {
          let tRealQty = 0;
          if (s.mcat == null || s.mcat == '') {
            tRealQty = this.getSum(this.TrnMainObj.ProdList.filter(x => x.MCODE == s.mcode), 'RealQty');
          }
          else {
            //for matrxi and non matrix item category are differently treat
            tRealQty = this.getSum(this.TrnMainObj.ProdList.filter(x => x.MCODE == s.mcode && ((x.categorys != null && x.categorys.find(w => w.category == s.mcat) != null) || (x.VARIANTLIST != null && x.VARIANTLIST[s.variantid] != null && x.VARIANTLIST[s.variantid].NAME == s.mcat))), 'RealQty');

          }
          //free qty is calculated on less price batch and is on auto pick batch so calculated seperatedly
          this.bulkMcodeFreeItemOfferCalculation(s, tRealQty);
          if (s.mcat == null || s.mcat == '') //item may be save without category also
          {
            for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.mcode)) {
              this.bulkMcodeOfferCalculation(s, p, tRealQty);
            }
          }
          else {
            for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.mcode && (a.categorys.find(w => w.category == s.mcat) != null || (a.VARIANTLIST != null && a.VARIANTLIST[s.variantid] != null && a.VARIANTLIST[s.variantid].NAME == s.mcat)))) {
              this.bulkMcodeOfferCalculation(s, p, tRealQty);
            }
          }
        }

      }
      if (s.schemeType == "bydiscount") {
        if (s.discountType == "MCAT") {
          if (s.offerOn == "rate" && this.nullToZeroConverter(s.disrate) > 0) {
            s.discountedQty = this.nullToZeroConverter(s.discountedQty);
            s.minQty = this.nullToZeroConverter(s.minQty);

            for (var p of this.TrnMainObj.ProdList.filter(a => (a.categorys.find(w => w.category == s.mcat) != null || (a.VARIANTLIST != null && a.VARIANTLIST[s.variantid] != null && a.VARIANTLIST[s.variantid].NAME == s.mcat)))) {

              let appliedScheme = [];

              let qtyForscheme = p.RealQty;
              p.PROMOTION = (this.nullToZeroConverter(s.disrate) * p.AMOUNT / 100);
              appliedScheme.push(s);

              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);

            }
          }
        }
        else if (s.discountType == "Mcode") {

          if (s.mcat == null || s.mcat == '') //item may be save without category also
          {
            for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.mcode)) {
              this.bydiscountOfferCalculation(s, p);
            }

          }
          else {
            for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.mcode && (a.categorys.find(w => w.category == s.mcat) != null || (a.VARIANTLIST != null && a.VARIANTLIST[s.variantid] != null && a.VARIANTLIST[s.variantid].NAME == s.mcat)))) {

              this.bydiscountOfferCalculation(s, p);
            }
          }
        }

      }

      if (s.schemeType == "byslabdiscount") {
        s.greaterThan = this.nullToZeroConverter(s.greaterThan);
        s.lessThan = this.nullToZeroConverter(s.lessThan);
        //range on quantiy like buy 1 to 10 quantity
        if (s.slabDiscountType == "quantityRange") {

          let tRealQty = 0;
          if (s.mcat == null || s.mcat == '') {
            tRealQty = this.getSum(this.TrnMainObj.ProdList.filter(x => x.MCODE == s.mcode), 'RealQty');
          }
          else {
            //for matrxi and non matrix item category are differently treat
            tRealQty = this.getSum(this.TrnMainObj.ProdList.filter(x => x.MCODE == s.mcode && ((x.categorys != null && x.categorys.find(w => w.category == s.mcat) != null) || (x.VARIANTLIST != null && x.VARIANTLIST[s.variantid] != null && x.VARIANTLIST[s.variantid].NAME == s.mcat))), 'RealQty');
          }
          if (tRealQty >= s.greaterThan && tRealQty <= s.lessThan) {
            if (s.mcat == null || s.mcat == '') //item may be save without category also
            {
              for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.mcode)) {
                this.slabdiscountOfferCalculation(s, p);
              }
            }
            else {
              for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.mcode && (a.categorys.find(w => w.category == s.mcat) != null || (a.VARIANTLIST != null && a.VARIANTLIST[s.variantid] != null && a.VARIANTLIST[s.variantid].NAME == s.mcat)))) {
                this.slabdiscountOfferCalculation(s, p);
              }
            }

          }
        }

      }
      if (s.schemeType == "bybulkonanotheritem") {
        let parentitemSellQty = 0;
        if (s.mcat == null || s.mcat == '') {
          parentitemSellQty = this.getSum(this.TrnMainObj.ProdList.filter(x => x.MCODE == s.mcode), 'RealQty');
        }
        else {
          //for matrxi and non matrix item category are differently treat
          parentitemSellQty = this.getSum(this.TrnMainObj.ProdList.filter(x => x.MCODE == s.mcode && ((x.categorys != null && x.categorys.find(w => w.category == s.mcat) != null) || (x.VARIANTLIST != null && x.VARIANTLIST[s.variantid] != null && x.VARIANTLIST[s.variantid].NAME == s.mcat))), 'RealQty');

        }
        //price of amount changes if minqty is 2 then on 2 buy one qty of other item in special price
        if (s.offerOn == "fixprice" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.rate_A) > 0) {
          s.rate_A = this.nullToZeroConverter(s.rate_A);
          s.minQty = this.nullToZeroConverter(s.minQty);
          if (parentitemSellQty >= s.minQty) {
            for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.disItemCode)) {
              let appliedScheme = [];
              let qtyForOffer = Math.floor(parentitemSellQty / s.minQty);

              let offerCalculatingQty = qtyForOffer > p.RealQty ? p.RealQty : qtyForOffer;
              let promotionbyamtDisAmount = (p.RATE - s.rate_A) * offerCalculatingQty;

              if (p.IsTaxInclusive == 1) {
                promotionbyamtDisAmount = ((p.AMOUNT + (p.GSTRATE * p.AMOUNT / 100) - s.rate_A) / (1 + (p.GSTRATE / 100))) * offerCalculatingQty;
              }
              p.PROMOTION = promotionbyamtDisAmount;
              appliedScheme.push(s);
              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
            }
          }

        }
        //buy 2 get other item one free or buy 3 get other item one free offer
        else if (s.offerOn == "quantity" && this.nullToZeroConverter(s.discountedQty) > 0 && this.nullToZeroConverter(s.minQty) > 0) {
          s.discountedQty = this.nullToZeroConverter(s.discountedQty);
          s.minQty = this.nullToZeroConverter(s.minQty);

          if (parentitemSellQty >= s.minQty) {
            for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.disItemCode)) {
              let appliedScheme = [];

              let qtyForOffer = Math.floor(parentitemSellQty / s.minQty);

              let offerCalculatingQty = qtyForOffer > p.RealQty ? p.RealQty : qtyForOffer;

              let promotionbybulkDis = ((p.RATE * offerCalculatingQty) + (p.GSTRATE * p.RATE * offerCalculatingQty / 100) - 0.4) / (1 + (p.GSTRATE / 100));
              p.PROMOTION = p.PROMOTION + promotionbybulkDis;

              appliedScheme.push(s);
              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
            }
          }
        }

        // buy 2 and get 10 percent discount or buy 5 and get  10 percent discount scheme on another item
        else if (s.offerOn == "rate" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.disrate) > 0) {
          s.disrate = this.nullToZeroConverter(s.disrate);
          s.minQty = this.nullToZeroConverter(s.minQty);

          if (parentitemSellQty >= s.minQty) {
            for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.disItemCode)) {
              let appliedScheme = [];

              let qtyForOffer = Math.floor(parentitemSellQty / s.minQty);
              let offerCalculatingQty = qtyForOffer > p.RealQty ? p.RealQty : qtyForOffer;


              let promotionbybulkDisRate = p.RATE * offerCalculatingQty * s.disrate / 100;
              p.PROMOTION = p.PROMOTION + promotionbybulkDisRate;
              appliedScheme.push(s);
              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
            }

          }
        }
        // buy 2 and get 10 Rupee discount or buy 5 and get  10 Rupee discount scheme
        else if (s.offerOn == "amount" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.disamount) > 0) {
          s.disamount = this.nullToZeroConverter(s.disamount);
          s.minQty = this.nullToZeroConverter(s.minQty);
          let parentitemSellQty = 0;
          //calculating the sell quantity of scheme parent item
          this.TrnMainObj.ProdList.forEach(element => {
            if (element.MCODE == s.mcode) { parentitemSellQty += element.RealQty; }
          });
          if (parentitemSellQty >= s.minQty) {
            for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.disItemCode)) {

              let appliedScheme = [];
              let qtyForOffer = Math.floor(parentitemSellQty / s.minQty);
              let offerCalculatingQty = qtyForOffer > p.RealQty ? p.RealQty : qtyForOffer;

              let promotionbybulkDisAmount = s.disamount * offerCalculatingQty;
              if (s.vat == 1) {
                promotionbybulkDisAmount = (s.disamount / (1 + (p.GSTRATE / 100))) * offerCalculatingQty;
              }

              p.PROMOTION = p.PROMOTION + promotionbybulkDisAmount;
              appliedScheme.push(s);
              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
            }
          }
        }
      }
    }

  }
  getSum(list, columnName): number {
    if (list == null) return 0;
    let sum = 0;
    list.forEach(x => {
      sum = sum + this.nullToZeroConverter(x[columnName]);
    });
    return sum;
  }

  slabdiscountOfferCalculation(s: schemeForCalculationClass, p: TrnProd) {
    //get centrain percent disocunt on that range
    if (s.offerOn == "rate" && this.nullToZeroConverter(s.disrate) > 0) {
      let appliedScheme = [];

      s.disrate = this.nullToZeroConverter(s.disrate);
      let qtyForscheme = p.RealQty;
      let promotionbyslabDisRate = p.RATE * qtyForscheme * s.disrate / 100;
      p.PROMOTION = promotionbyslabDisRate;
      appliedScheme.push(s);
      p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
    }
    //centain amount discount
    else if (s.offerOn == "amount" && this.nullToZeroConverter(s.disamount) > 0 && s.mcode == p.MCODE) {
      let appliedScheme = [];

      s.disamount = this.nullToZeroConverter(s.disamount);
      let qtyForscheme = p.RealQty;

      let promotionbyamtDisAmount = (s.disamount * p.RealQty);

      if (s.vat == 1) {
        promotionbyamtDisAmount = (s.disamount / (1 + (p.GSTRATE / 100))) * p.RealQty;
      }
      p.PROMOTION = promotionbyamtDisAmount;
      appliedScheme.push(s);
      p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);

    }
    //priec of amount changes
    else if (s.offerOn == "fixprice" && this.nullToZeroConverter(s.rate_A) > 0 && s.mcode == p.MCODE) {
      let appliedScheme = [];

      s.rate_A = this.nullToZeroConverter(s.rate_A);
      let qtyForscheme = p.RealQty;

      let promotionbyamtDisAmount = (p.RATE - s.rate_A) * p.RealQty;

      if (p.IsTaxInclusive == 1) {
        promotionbyamtDisAmount = ((p.AMOUNT + (p.GSTRATE * p.AMOUNT / 100) - s.rate_A) / (1 + (p.GSTRATE / 100))) * p.RealQty;
      }
      p.PROMOTION = promotionbyamtDisAmount;
      appliedScheme.push(s);
      p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
    }
  }
  bydiscountOfferCalculation(s: schemeForCalculationClass, p: TrnProd) {
    if (s.offerOn == "rate" && this.nullToZeroConverter(s.disrate) > 0) {
      let appliedScheme = [];

      let qtyForscheme = p.RealQty;
      p.PROMOTION = (this.nullToZeroConverter(s.disrate) * p.AMOUNT / 100);
      appliedScheme.push(s);

      p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
    }
    //individual discount by amount like get 5 rupee discount on item buy
    if (s.offerOn == "amount" && this.nullToZeroConverter(s.disamount) > 0 && s.mcode == p.MCODE) {
      let appliedScheme = [];

      let qtyForscheme = p.RealQty;

      let promotionbyamtDisAmount = (this.nullToZeroConverter(s.disamount) * p.RealQty);
      if (s.vat == 1) {
        promotionbyamtDisAmount = (this.nullToZeroConverter(s.disamount) / (1 + (p.GSTRATE / 100))) * p.RealQty;
      }
      p.PROMOTION = promotionbyamtDisAmount;
      appliedScheme.push(s);
      p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
    }
  }
  bulkMcodeFreeItemOfferCalculation(s: schemeForCalculationClass, tRealQty: number) {
    //buy 2 get one free or buy 3 get one free offer
    if (s.offerOn == "quantity" && this.nullToZeroConverter(s.discountedQty) > 0 && this.nullToZeroConverter(s.minQty) > 0) {
      s.discountedQty = this.nullToZeroConverter(s.discountedQty);
      s.minQty = this.nullToZeroConverter(s.minQty);

      if (tRealQty >= s.minQty + s.discountedQty) {
        //getting divisible quanttity account to scheme qty like 1 free for 3 buy the if 5 buy only 1 free
        let qtyForscheme = (s.minQty + s.discountedQty) * Math.floor(tRealQty / (s.minQty + s.discountedQty));
        let totalFreeQty = s.discountedQty * Math.floor(tRealQty / (s.minQty + s.discountedQty));
        //login for different batch and different price but same item
        if (s.mcat == null || s.mcat == '') //item may be save without category also
        {
          for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.mcode).sort((x, y) => x.RATE - y.RATE)) {
            let offerminusQuantity = 0;
            if (totalFreeQty <= p.RealQty) {
              let appliedScheme = [];
              let promotionbybulkDis = ((p.RATE * totalFreeQty) + (p.GSTRATE * p.RATE * totalFreeQty / 100) - 0.4) / (1 + (p.GSTRATE / 100));
              p.PROMOTION = promotionbybulkDis;
              appliedScheme.push(s);
              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
              break;
            }
            else {
              let appliedScheme = [];
              let promotionbybulkDis = ((p.RATE * p.RealQty) + (p.GSTRATE * p.RATE * p.RealQty / 100) - 0.4) / (1 + (p.GSTRATE / 100));
              p.PROMOTION = promotionbybulkDis;
              appliedScheme.push(s);
              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
              totalFreeQty = totalFreeQty - p.RealQty;
            }
          }
        } else//for item with category
        {
          for (var p of this.TrnMainObj.ProdList.filter(a => a.MCODE == s.mcode && (a.categorys.find(w => w.category == s.mcat) != null || (a.VARIANTLIST != null && a.VARIANTLIST[s.variantid] != null && a.VARIANTLIST[s.variantid].NAME == s.mcat))).sort((x, y) => x.RATE - y.RATE)) {
            let offerminusQuantity = 0;

            if (totalFreeQty <= p.RealQty) {
              let appliedScheme = [];
              let promotionbybulkDis = ((p.RATE * totalFreeQty) + (p.GSTRATE * p.RATE * totalFreeQty / 100) - 0.4) / (1 + (p.GSTRATE / 100));
              p.PROMOTION = promotionbybulkDis;
              appliedScheme.push(s);
              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
              break;
            }
            else {
              let appliedScheme = [];
              let promotionbybulkDis = ((p.RATE * p.RealQty) + (p.GSTRATE * p.RATE * p.RealQty / 100) - 0.4) / (1 + (p.GSTRATE / 100));
              p.PROMOTION = promotionbybulkDis;
              appliedScheme.push(s);
              p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
              totalFreeQty = totalFreeQty - p.RealQty;
            }
          }
        }
      }

    }


  }
  bulkMcodeOfferCalculation(s: schemeForCalculationClass, p: TrnProd, tRealQty: number) {
    // buy 2 and get 10 percent discount or buy 5 and get  10 percent discount scheme
    if (s.offerOn == "rate" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.disrate) > 0) {
      s.disrate = this.nullToZeroConverter(s.disrate);
      s.minQty = this.nullToZeroConverter(s.minQty);

      if (tRealQty >= s.minQty) {
        let appliedScheme = [];
        let qtyForscheme = p.RealQty;
        //getting divisible quanttity accourding to scheme qty like 10% free for 3 buy the if 5 buy only 10% free
        let promotionbybulkDisRate = p.RATE * qtyForscheme * s.disrate / 100;
        p.PROMOTION = promotionbybulkDisRate;
        appliedScheme.push(s);
        p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
      }
    }
    // buy 2 and get 10 Rupee discount or buy 5 and get  10 Rupee discount scheme
    if (s.offerOn == "amount" && this.nullToZeroConverter(s.minQty) > 0 && this.nullToZeroConverter(s.disamount) > 0) {
      s.disamount = this.nullToZeroConverter(s.disamount);
      s.minQty = this.nullToZeroConverter(s.minQty);
      if (tRealQty >= s.minQty) {

        let appliedScheme = [];
        let qtyForscheme = p.RealQty;
        //getting divisible quanttity according to scheme qty like 10 rupee free for 3 buy the if 5 buy only 10 rupee free
        qtyForscheme = p.RealQty / s.minQty;
        let promotionbybulkDisAmount = s.disamount * qtyForscheme;
        if (s.vat == 1) {
          promotionbybulkDisAmount = ((s.disamount * qtyForscheme) / (1 + (p.GSTRATE / 100)));
        }

        p.PROMOTION = promotionbybulkDisAmount;
        appliedScheme.push(s);
        p.SCHEMESAPPLIED = JSON.stringify(appliedScheme);
      }
    }
  }
  assignSchemeIdInProd(p: TrnProd, schemeID: string) {
    if (p.SCHEMESAPPLIED == null || p.SCHEMESAPPLIED == "0" || p.SCHEMESAPPLIED == schemeID || p.SCHEMESAPPLIED.split(",").find(x => x == schemeID) == null) {
      p.SCHEMESAPPLIED = schemeID;
    }
    else {
      p.SCHEMESAPPLIED = p.SCHEMESAPPLIED + "," + schemeID;
    }
  }
  billDiscountFromOfferCheck() {
    if (this.TrnMainObj.VoucherType != VoucherTypeEnum.TaxInvoice) return;
    if (this.TrnMainObj.billoffer != null && this.TrnMainObj.billoffer != '') {
      this.TrnMainObj.DCRATE = 0;
      this.TrnMainObj.ALT_TOTFLATDISCOUNT = 0;
      this.TrnMainObj.billoffer = null;
    }
    if (this.TrnMainObj.billOfferOnlyForHold != null && this.TrnMainObj.billOfferOnlyForHold.isSelected && this.TrnMainObj.billOfferOnlyForHold.greaterThan <= this.TrnMainObj.NETAMNT && this.TrnMainObj.billOfferOnlyForHold.lessThan >= this.TrnMainObj.NETAMNT) {

      if (this.TrnMainObj.billOfferOnlyForHold.offerOn == "rate") {
        this.TrnMainObj.DCRATE = this.nullToZeroConverter(this.TrnMainObj.billOfferOnlyForHold.disrate);
      }
      else if (this.TrnMainObj.billOfferOnlyForHold.offerOn == "amount") {
        this.TrnMainObj.ALT_TOTFLATDISCOUNT = this.nullToZeroConverter(this.TrnMainObj.billOfferOnlyForHold.disamount);
      }
      this.TrnMainObj.billoffer = JSON.stringify(this.TrnMainObj.billOfferOnlyForHold);
    }
  }



}

export interface ProdListMode {
  mode: string;
  selectedRow: TrnMain;
}
