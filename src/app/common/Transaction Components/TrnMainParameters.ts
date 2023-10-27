import { Component, Inject, ViewChild } from "@angular/core";
import { TransactionService } from "./transaction.service";
import { MasterRepo } from "../repositories/masterRepo.service";
import { VoucherTypeEnum } from "../interfaces/TrnMain";
import * as moment from 'moment';
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "../services/alert/alert.service";
import { isNullOrUndefined } from "util";
import { SpinnerService } from "../services/spinner/spinner.service";
import { DOCUMENT } from '@angular/platform-browser';
import { UUID } from "angular2-uuid";
import { TrnMain } from "./../interfaces/TrnMain";
import { publicDecrypt } from "crypto";
import { __values } from "tslib";

@Component({
  selector: "trnmain-parameters-master",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"],
  templateUrl: "./TrnMainParameters.html"
})
export class TrnMainParametersComponent {
  @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
  @ViewChild("genericdsmgrid") genericdsmgrid: GenericPopUpComponent;
  @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
  @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;
  @ViewChild("genericGridItemPricesPopup1") genericGridItemPricesPopup1: GenericPopUpComponent;
  @ViewChild("genericGridDoctor") genericGridDoctor: GenericPopUpComponent;
  @ViewChild("genericGridForDeliveryBoy") genericGridForDeliveryBoy: GenericPopUpComponent;
  gridPopupSettingsForItemPrices: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForDoctor: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsFordsm: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForDeliveryBoy: GenericPopUpSettings = new GenericPopUpSettings();
  salesTransactionAccountList: any[] = [];
  public checkboxEl: boolean = true;
  ShowTransactionMode: boolean = false;

  // this.authservice.getSetting()

  settings: any;
  userwarehouse: any[] = [];
  gridPopupSettingsForVariant: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericvariantGrid") genericvariantGrid: GenericPopUpComponent;
  gridPopupSettingsForVariantAttr: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericvariantAttrGrid") genericvariantAttrGrid: GenericPopUpComponent;
  TrnMainObj: TrnMain = <TrnMain>{};

  constructor(@Inject(DOCUMENT) private document: any,
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    public activerouted: ActivatedRoute,
    public alertservice: AlertService,
    private loadingService: SpinnerService
  ) {


    let userProfile = this._trnMainService.userProfile;
    this.userwarehouse = userProfile.warehouses;
    this.gridPopupSettingsForVariant = {
      title: "Product Types",
      apiEndpoints: `/getproductvariantPagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "VARIANTNAME",
          title: "Category",
          hidden: false,
          noSearch: false
        },
        {
          key: "VARIANT",
          title: "VARIANT",
          hidden: true,
          noSearch: true
        }

      ]
    };
    this.gridPopupSettingsForVariantAttr = {
      title: `Types`,
      apiEndpoints: `/getvariantDetails`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "NAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "CODE",
          title: "CODE",
          hidden: true,
          noSearch: true
        }

      ]
    };
    this.gridPopupSettingsForDeliveryBoy = Object.assign(new GenericPopUpSettings, {
      title: "DeliveryBoy",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACID",
          title: "ACID",
          hidden: true,
          noSearch: true
        }
      ]
    });
    this.gridPopupSettingsForDoctor = {
      title: "Doctors",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: "ACID",
          title: "ACID",
          hidden: true,
          noSearch: true
        },
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "MOBILE",
          title: "MOBILE",
          hidden: false,
          noSearch: false
        },
        {
          key: "EMAIL",
          title: "EMAIL",
          hidden: false,
          noSearch: false
        }
      ]
    };
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
      this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan
    ) {
      this.ShowTransactionMode = true;
    }
    else {
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote
      ) {
        if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor"
          || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor") {
          this.ShowTransactionMode = true;
        }
      }
    }
    if ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" ||
      this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb" ||
      this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superstockist") && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
        this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice)) {
      this.gridPopupSettingsForRefBill = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings("SALESORDERFROMMOBILE"));
    }
    else {
      this.gridPopupSettingsForRefBill = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings("REFBILLOFSALESRETURN"));
    }

    this.gridPopupSettingsForCustomer = Object.assign(new GenericPopUpSettings, {
      title: "Customers",
      apiEndpoints: `/getAccountPagedListByPType/PA/C`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "customerID",
          title: "CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ADDRESS",
          title: "ADDRESS",
          hidden: false,
          noSearch: false
        },
        {
          key: "GEO",
          title: "TYPE",
          hidden: false,
          noSearch: false
        },
        {
          key: "MOBILE",
          title: "MOBILE",
          hidden: true,
          noSearch: false
        },
        {
          key: "PHONE",
          title: "Phone",
          hidden: this._trnMainService.AppSettings.allowPhoneInCustomerLOV ? false : true,
          noSearch: this._trnMainService.AppSettings.allowPhoneInCustomerLOV ? false : true
        }
      ]
    });



    this.gridPopupSettingsFordsm = {
      title: "DSM List",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "DsmName",
          title: "DSM",
          hidden: false,
          noSearch: false
        },
        {
          key: "BeatName",
          title: "BEAT",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.gridPopupSettingsForWarehouse = Object.assign(new GenericPopUpSettings, {
      title: "Warehouse",
      apiEndpoints: `/getAllWarehousePagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "NAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        }
      ]
    });
    this.gridPopupSettingsForItemPrices = Object.assign(new GenericPopUpSettings, {
      title: "Item Prices",
      apiEndpoints: `/getItemsPriceCategoryList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "plabel",
          title: "Category",
          hidden: false,
          noSearch: false
        },
        {
          key: "pid",
          title: "pid",
          hidden: true,
          noSearch: true
        }
      ]
    });



  }
  ngOnInit() {
    this.setDefaultValues();
    this._trnMainService.TrnMainObj.holdstock = true;
    //this._trnMainService.checkboxEl=true;

    // this.activerouted.url.subscribe(
    //   __values => {
    //     if (__values[0].path === "quotationinvoice") {
    //       console.log('quotationinvoice');
    //       this.activerouted.queryParams.subscribe(params => {
    //         if (params.FROMCOMPANY) {
    //           this.masterService.masterGetmethod(``).subscribe(
    //             res => {

    //             }
    //           );
    //         }
    //         this._trnMainService.TrnMainObj.BILLTO = 
    //     }

    //   }
    // )
    // if(this.activerouted.url == )

  }



  dsmCommand(e) {
    e.preventDefault();
    this.genericdsmgrid.show("", false, "getdsmpagedlist");

  }
  customerTabCommand(e) {
    e.preventDefault();
    let userProfile = this._trnMainService.userProfile;
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && (userProfile.CompanyInfo.ORG_TYPE == "ak" || userProfile.CompanyInfo.ORG_TYPE == "ck" || userProfile.CompanyInfo.ORG_TYPE == "pms" || userProfile.CompanyInfo.ORG_TYPE == "gak" || userProfile.CompanyInfo.ORG_TYPE == "retailer")) {
      this.masterService.focusAnyControl("barcodebilling0");
    } else {
      document.getElementById("customerselectid").blur();
      if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
      this.genericGridCustomer.show("", false, this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE);
    }
  }
  customerEnterCommand(e) {
    e.preventDefault();
    document.getElementById("customerselectid").blur();
    if (this._trnMainService.TrnMainObj.BILLTO == null || this._trnMainService.TrnMainObj.BILLTO == "" || this._trnMainService.TrnMainObj.BILLTO == undefined) {

      if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }

      this.genericGridCustomer.show("", false, this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE);
    } else {
      this.masterService.masterGetmethod(`/getcustomerFromMobile?mobile=${this._trnMainService.TrnMainObj.BILLTO}`).subscribe((res) => {
        if (res.status == "ok") {
          this.onCustomerSelected(res.result);
        } else {
          // alert(res.message);
          let param = {
            MOBILENUMBER: this._trnMainService.TrnMainObj.BILLTO,
            SHOWPOPUP: true
          }
          this.alertservice.error("Customer Not Found");
          this.masterService.customerPopUpSubject.next(param);
        }
      }, error => {

      })
    }
  }

  setDefaultValues() {

    if (this._trnMainService.TrnMainObj.TRNMODE == null || this._trnMainService.TrnMainObj.TRNMODE == "") {
      this._trnMainService.TrnMainObj.TRNMODE = 'credit';
    }
  }
  ngAfterViewInit() {
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
      document.getElementById("refbill").focus();
    }
    else {
      document.getElementById("customerselectid").focus();
    }
  }
  // getTRNDATE() {
  //   return moment(this._trnMainService.TrnMainObj.TRN_DATE).format("DD/MM/YYYY");

  // }
  // setTRNDATE(value) {
  //   if (this.masterService.ValidateDate(value)) {
  //     this._trnMainService.TrnMainObj.TRN_DATE = this.masterService.changeIMsDateToDate(value);
  //   } else {
  //     this.alertservice.error(`Invalid Invoice Date`);
  //   }
  // }
  showExpDate() {
    return moment(this._trnMainService.TrnMainObj.ExpDate).format("DD/MM/YYYY");
  }
  customerFieldChange() {
    if (this._trnMainService.TrnMainObj.PARAC != null) {
      this._trnMainService.TrnMainObj.BILLTO = null;
    }
    this._trnMainService.TrnMainObj.PARAC = null;
    this._trnMainService.TrnMainObj.TRNAC = null;
    this._trnMainService.TrnMainObj.BILLTOADD = null;
    this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = null;
    this._trnMainService.TrnMainObj.TRNMODE = "credit";
    this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = null;
    this._trnMainService.TrnMainObj.CREDITDAYS = 0;
    this._trnMainService.TrnMainObj.BILLTOMOB = null;
    this._trnMainService.TrnMainObj.CUSTOMERID = null;
  }

  onDSMselected(dsm) {
    this._trnMainService.TrnMainObj.AdditionalObj.DSMNAME = dsm.DsmName;
    this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE = dsm.DsmCode;
    this._trnMainService.TrnMainObj.AdditionalObj.BEAT = dsm.BeatName;
  }

  onCustomerSelected(customer) {
    console.log("cust details ", customer);
    this._trnMainService.TrnMainObj.partyDetail = customer;
    this._trnMainService.TrnMainObj.AdditionalObj.BILLTOPAN = customer.VATNO;
    this._trnMainService.TrnMainObj.PARTY_GSTNO = customer.GSTNO;
    this._trnMainService.TrnMainObj.BILLTO = customer.ACNAME;
    this._trnMainService.TrnMainObj.PARAC = customer.ACID;
    this._trnMainService.TrnMainObj.TRNAC = customer.ACID;
    this._trnMainService.TrnMainObj.DLNO1 = customer.DLNO1;
    this._trnMainService.TrnMainObj.DLNO2 = customer.DLNO2;
    this._trnMainService.TrnMainObj.DLNO3 = customer.DLNO3;
    this._trnMainService.TrnMainObj.DLNO4 = customer.DLNO4;
    this._trnMainService.TrnMainObj.BILLTOADD = customer.ADDRESS;
    this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = customer.PSTYPE == null ? "local" : customer.PSTYPE.toLowerCase();
    this._trnMainService.TrnMainObj.TRNMODE = (customer.PMODE == null || customer.PMODE == "") ? "credit" : customer.PMODE;
    this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = customer.GEO;
    this._trnMainService.TrnMainObj.CREDITDAYS =
      this._trnMainService.TrnMainObj.AdditionalObj.CREDITDAYS = customer.CRPERIOD;
    this._trnMainService.TrnMainObj.INVOICETYPE = customer.CTYPE;
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice) {
      this._trnMainService.TrnMainObj.CDRATE = customer.CDISCOUNT;
    }
    this._trnMainService.TrnMainObj.BILLTOTEL = customer.POSTALCODE;
    this._trnMainService.TrnMainObj.BILLTOMOB = customer.MOBILE;
    this._trnMainService.TrnMainObj.customerID = customer.customerID;
    console.log("set cust id ", this._trnMainService.TrnMainObj.customerID);
    var cusid = customer.customerID;
    this._trnMainService.TrnMainObj.CUSTOMERID = customer.customerID;

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      this._trnMainService.TrnMainObj.CUS_CATEGORY_NAME = null;
      this._trnMainService.TrnMainObj.CUS_CATEGORY_PRICELEVEL = null;
      this._trnMainService.TrnMainObj.CUS_CATEGORY_PRICELEVEL_LABEL = null;
      this.masterService.getCustomerCategoryByName(customer.GEO).subscribe((res) => {
        if (res && res.length) {
          this._trnMainService.TrnMainObj.CUS_CATEGORY_NAME = res[0].CATEGORY_NAME;
          this._trnMainService.TrnMainObj.CUS_CATEGORY_PRICELEVEL = res[0].PRICE_LEVEL;
          this._trnMainService.TrnMainObj.CUS_CATEGORY_PRICELEVEL_LABEL = res[0].PRICE_LEVEL_LABEL;
        }
      });
      if (this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
        this.masterService.getTopTransactionForSales('%', this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
          if (data.status == 'ok') {
            this._trnMainService.TrnMainObj.ProdList[0].TransactionHistory = data.result;
          }
        });
      }
      if (this._trnMainService.AppSettings.ENABLELOYALTY == true) {
        this.masterService.masterGetmethod_NEW("/getCustomerLoyalty?customerid=" + customer.customerID + "&isglobalparty=" + customer.ISGLOBALPARTY + "&acid=" + customer.ACID).subscribe((res) => {

          if (res.status == "ok") {
            this._trnMainService.TrnMainObj.CUS_PREVlOYALTY = this.masterService.nullToZeroConverter(res.result.loyaltyAmount);
          } else {
            this.alertservice.error("Error on getting loyality:" + res.result);
          }

        }, error => {
          this.alertservice.error("Error on getting loyality:" + error);
          console.log(error);
        })
      }





    }

    if (this._trnMainService.AppSettings.CompanyNature == 3) {
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice)
        this._trnMainService.TrnMainObj.OpticalEyeDetails = this.masterService.opticalEyeDetails;
      this.masterService.masterGetmethod_NEW("/getcustomereyedetail?customerid=" + customer.ACID).subscribe((res) => {
        if (res.status == "ok") {
          if (res.result != null && res.result.length) {
            this._trnMainService.TrnMainObj.OpticalEyeDetails = res.result;
          }
        }

      }, error => {

      })
    }
    let tmpitemDivision = customer.itemDivision ? customer.itemDivision.split(',') : [];
    let itemDivision = [];
    if (tmpitemDivision.length) {
      tmpitemDivision.forEach(x => {
        itemDivision.push(`'${x}'`)
      });
    }
    this._trnMainService.TrnMainObj.itemDivision = itemDivision.length ? itemDivision.join() : "all";
    this._trnMainService.TrnMainObj.itemDivisionList = customer.itemDivision ? customer.itemDivision.split(',') : [];
    if (isNullOrUndefined(customer.MCAT) || customer.MCAT == "") {
      this._trnMainService.TrnMainObj.customerMCAT = '%';
    } else {
      this._trnMainService.TrnMainObj.customerMCAT = customer.MCAT;
    }
    this.masterService.masterGetmethod("/getPartyTotalSalesValueCurrentYear?acid=" + customer.ACID)
      .subscribe(
        res => {
          if (res.status == "ok") {
            this._trnMainService.TrnMainObj.AdditionalObj.CUSTOMER_TOTALSALES = this._trnMainService.nullToZeroConverter(res.result);

          } else {
            alert(res.result);
          }
        },
        error => {
          alert(error);
        }
      );

    this.masterService.masterGetmethod("/getPartyBalanceAmount?acid=" + customer.ACID)
      .subscribe(
        res => {
          if (res.status == "ok") {
            this._trnMainService.TrnMainObj.BALANCE = this._trnMainService.nullToZeroConverter(res.result);
            if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer" || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ak" || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ck" || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "pms" || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "gak") {
              this.masterService.focusAnyControl('barcodebilling0');
            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote
            ) {
              this.masterService.focusAnyControl("refbill");
            }
            else {
              this.masterService.focusAnyControl('menucode0');
            }
          } else {
            alert(res.result);
          }
        },
        error => {
          alert(error);
        }
      );

    if (this._trnMainService.AppSettings.ENABLEBILLLOCKING && this._trnMainService.userProfile.username.toLowerCase() != "superadmin") {
      this.masterService.masterGetmethod_NEW("/getBillingStatus?acid=" + customer.ACID).subscribe((res) => {
        if (res.status == "ok" && res.result && res.result.length) {
          this._trnMainService.TrnMainObj.BILLINGSTATUS = res.result[0].STATUS;
          if (this._trnMainService.TrnMainObj.BILLINGSTATUS == "FALSE") {
            this.alertservice.error("BILLING HAS BEEN LOCKED FOR THIS CUSTOMER DUE TO DUE PAYMENTS.");
            return;
          }
        } else {
          this._trnMainService.TrnMainObj.BILLINGSTATUS = "TRUE";
        }
      }, error => {
        this._trnMainService.TrnMainObj.BILLINGSTATUS = "TRUE";
      })
    }

    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder
      && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superstockist")) {
      cusid = cusid.replace('&', '^');
      this.masterService.masterGetmethod(`/getdsminfoFromRetailer?retailerCode=${cusid}`).subscribe((res) => {
        if (res.status == "ok") {
          this._trnMainService.TrnMainObj.AdditionalObj.BEAT = res.result.BeatName;
          this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE = res.DsmCode;
          this._trnMainService.TrnMainObj.AdditionalObj.DSMNAME = res.result.DsmName;
        } else {
          alert(res.message);
        }
      }, error => {

      })
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
      this.masterService.focusAnyControl("menucode0");
    }
  }
  CustomerFieldDisabled(): boolean {
    if (this._trnMainService.TrnMainObj.ProdList != null) {
      if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
        return true;
      }
    }
    if (!isNullOrUndefined(this._trnMainService.TrnMainObj.RFQValidity)) {
      return true;
    }
    return false;
  }
  getQuotationDeliveryDate() {
    return moment(this._trnMainService.TrnMainObj.DeliveryDate).format("DD/MM/YYYY");
  }
  setQuotationDeliveryDate(value) {
    if (this.masterService.ValidateDate(value)) {
      this._trnMainService.TrnMainObj.DeliveryDate = this.masterService.changeIMsDateToDate(value);
      // if (this._trnMainService.TrnMainObj.REFBILL.startsWith("RFQ")) {
      //   this._trnMainService.TrnMainObj.DeliveryDate this._trnMainService.TrnMainObj.ExpectedDeliveryDate
      // }
    } else {
      this.alertservice.error(`Invalid Date`);
    }
  }

  RefBillEnterCommand(event) {
    event.preventDefault();
    document.getElementById("refbill").blur();
    this.genericGridRefBill.show(this._trnMainService.TrnMainObj.PARAC, false, "tivoucherlistforsalesreturn");
  }

  onRefBillSelected(event) {
    if ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor"
      || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb"
      || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == 'superstockist') && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice)) {
      // if(event.CREATION_TYPE=="MOBILE_SO")
      // {
      this._trnMainService.TrnMainObj.BILLTO = event.ACNAME;
      this._trnMainService.TrnMainObj.PARAC = event.TRNAC;
      this._trnMainService.TrnMainObj.TRNAC = event.TRNAC;
      this._trnMainService.TrnMainObj.BILLTOADD = event.ADDRESS;
      this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = event.PSTYPE == null ? "local" : event.PSTYPE.toLowerCase();
      this._trnMainService.TrnMainObj.TRNMODE = (event.PMODE == null || event.PMODE == "") ? "credit" : event.PMODE;
      this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = event.GEO;


      this._trnMainService.TrnMainObj.TRNAC = event.TRNAC;
      this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
      this._trnMainService.TrnMainObj.REFORDBILL = event.VCHRNO;
      if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
        this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
      }
      else {
        this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = event.CREATION_TYPE + "_TI";
        this._trnMainService.TrnMainObj.AdditionalObj.BEAT = event.BEAT;
        this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE = event.DSMCODE;
        this._trnMainService.TrnMainObj.AdditionalObj.DSMNAME = event.DSMNAME;
      }
      this.masterService.focusAnyControl('menucode0');
      //  }
    }
    else {
      if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
        if (event.TRNMODE && event.TRNMODE == "SamridhiCard") {
          this.alertservice.warning(`Sales return not available for invoice with ${event.TRNMODE} payment`);
          return;
        }
      }
      this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
      this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = event.TRNTYPE;
      this._trnMainService.TrnMainObj.PARAC = event.PARAC;
      this._trnMainService.TrnMainObj.BILLTO = event.BILLTO;
      this._trnMainService.TrnMainObj.TRNAC = event.TRNAC;
      this._trnMainService.TrnMainObj.BILLTOADD = event.BILLTOADD;
      this._trnMainService.TrnMainObj.TRNMODE = event.TRNMODE;
      this._trnMainService.TrnMainObj.DCRATE = 0;
      this._trnMainService.TrnMainObj.TOTALFLATDISCOUNT = 0;//added in ind prod inscount
      this._trnMainService.TrnMainObj.ISMANUALRETURN = false;
      this._trnMainService.TrnMainObj.REFBILLDATE = moment(event.TRNDATE).format("DD/MM/YYYY");
      this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = event.GEO;
      this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = event.CREATION_TYPE + "_CN";

      this.masterService.focusAnyControl('menucode0');
    }
  }

  RefBillFieldDisabled() {
    let activeRoute = this.activerouted.snapshot.url[0].path
    if (activeRoute == 'add-creditnote-itembase') {
      return false;
    }
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
      if ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb"
        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == 'superstockist')) { }
      else {
        return true;
      }
    }
    if (this._trnMainService.TrnMainObj.ProdList != null) {
      if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
        return true;
      }
    }
    return false;
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }

  preventInputInSalesInvoiceForSalesOrder($event) {
    if ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "wdb" || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superstockist") && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
      $event.preventDefault();
      return false;
    }
  }
  disableSalesType() {
    if (this._trnMainService.TrnMainObj.Mode == 'VIEW' && this._trnMainService.TrnMainObj.VoucherType == 61) { return true; }
    if (this._trnMainService.TrnMainObj.BILLTO == null || this._trnMainService.TrnMainObj.BILLTO == "") {

    }
    else {
      return true;
    }
    return false;
  }

  onwarehouseChangeinSales() {
    if (confirm("Are you sure to change current warehouse")) {
      this._trnMainService.TrnMainObj.ProdList = [];
      this._trnMainService.addRow();
      this.masterService.onWarehouseChangeEvent.next(this._trnMainService.TrnMainObj.MWAREHOUSE);
    }
  }

  fitindia3mmClick() {
    if (isNullOrUndefined(this._trnMainService.TrnMainObj.REFORDBILL)) { }
    else {
      this.document.location.href = 'http://103.231.42.140:7056/bposAddApi/api/download3mmsalesinvoicepdf?orderId=' + this._trnMainService.TrnMainObj.REFORDBILL;
    }
  }

  fitindiaA4Click() {
    if (isNullOrUndefined(this._trnMainService.TrnMainObj.REFORDBILL)) { }
    else {
      this.document.location.href = 'http://103.231.42.140:7056/bposAddApi/api/getfitIndiaInvoicePdf?orderId=' + this._trnMainService.TrnMainObj.REFORDBILL;
    }
  }

  fitindiaprint() {
    console.log(this._trnMainService.TrnMainObj.Mode, this._trnMainService.TrnMainObj.VoucherType, this._trnMainService.userProfile.CompanyInfo.ORG_TYPE);
    if (this._trnMainService.TrnMainObj.Mode == 'View'
      && this._trnMainService.TrnMainObj.VoucherType == 14
      && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'retailer' ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'ak' ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'ck' ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'pms' ||
        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'gak')) { return true; }
    else { return false; }
  }

  WarehouseEnterCommand(event) {
    this.genericGridWarehouse.show();
  }

  onWarehouseSelected(event) {
    this._trnMainService.TrnMainObj.MWAREHOUSE = event.NAME;
  }

  CUS_CATEGORY_PRICELEVELEnterCommand() {
    this.genericGridItemPricesPopup1.show();
  }

  dblClickPopupPartItemPrices(value) {
    if (value == null) return;

    this._trnMainService.TrnMainObj.CUS_CATEGORY_PRICELEVEL = value.pid;
    this._trnMainService.TrnMainObj.CUS_CATEGORY_PRICELEVEL_LABEL = value.plabel;
  }

  onDeliveryBoySelect() {
    this.genericGridForDeliveryBoy.show("", false, "deliveryBoyPagedList");
  }

  onDeliverySelected(value) {
    this._trnMainService.TrnMainObj.AdditionalObj.DELIVERYBOY = value.ACID;
    this._trnMainService.TrnMainObj.AdditionalObj.DELIVERYBOYNAME = value.ACNAME;
  }

  dblClickPopupDoctor(data) {

    this._trnMainService.TrnMainObj.AdditionalObj.DOCTOR = data.ACID;
    this._trnMainService.TrnMainObj.AdditionalObj.DOCTORNAME = data.ACNAME;
  }

  onDoctorEnter() {
    this.genericGridDoctor.show("", false, "doctorPagedList")
  }
  onVariantEnterClicked() {
    this.genericvariantGrid.show("", false, "")
  }

  dblClickPopupVariant(event) {
    this._trnMainService.TrnMainObj.VARIANTNAME = event.VARIANTNAME;
    this.genericvariantAttrGrid.show("", false, event.VARIANT, false, "", true);
  }

  dblClickPopupVariantAttr(event: any[] = []) {
    if (!event || !event.length) return;
    this._trnMainService.TrnMainObj.SELECTEDVARIANT = event.map(x => x.CODE).join(",");

  }

  customerLedgerData: any = <any>{};

  onBalanceKeySpace() {
    this.customerLedgerData.details = [];
    this.customerLedgerData.totals = [];

    this.masterService.masterGetmethod_NEW(`/getpartyLedgerReport?Date=${this._trnMainService.TrnMainObj.TRNDATE}&ACID=${this._trnMainService.TrnMainObj.TRNAC}`).subscribe((res) => {
      if (res.status == "ok") {
        this.customerLedgerData.details = res.result;
        this.customerLedgerData.totals = res.result2;
        ($('#myModal') as any).modal('show');
      } else {
        this.customerLedgerData.details = [];
        this.customerLedgerData.totals = [];
      }
    }, error => {
      this.customerLedgerData.details = [];
      this.customerLedgerData.totals = [];
      this.alertservice.error(error._body);
    })

  }


  onBalanceKeyEnter() {
    if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "" || this._trnMainService.TrnMainObj.PARAC == undefined) {
      this.alertservice.error('please select customer to receive payment.');
      return;
    }
    this.paymentamount = null;
    ($('#myPayment') as any).modal('show');
  }





  public imageUrl: any;
  imageshowFlag: boolean = false;

  onFileChange($event) {
    this._trnMainService.TrnMainObj.fileList = $event.target.files;
    let reader = new FileReader();
    let file = $event.target.files[0];
    if ($event.target.files && $event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this._trnMainService.TrnMainObj.AdditionalObj.IMAGEURL = reader.result;
      }
    }
  }

  paymentamount: number;
  paymentData: any = <any>{};
  @ViewChild("genericGridACListParty") genericGridACListParty: GenericPopUpComponent;
  gridACListPartyPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  onCashBankEnter() {
    this.gridACListPartyPopupSettings = {
      title: "Accounts",
      apiEndpoints: `/getAccountPagedListByMapId/Master/Party Receipt/0`,
      defaultFilterIndex: 1,
      columns: [
        {
          key: "ACID",
          title: "A/C CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ACNAME",
          title: "A/C NAME",
          hidden: false,
          noSearch: false
        }
      ]
    };

    this.genericGridACListParty.show('', false, '', this._trnMainService.userProfile.PhiscalYearInfo.PhiscalID, '');

  }

  oncashbankSelect(data) {
    const uuidV1 = require('uuid/v1');
    this.paymentData = {
      "AdditionalObj": {
        "CREATION_TYPE": "FROM_SALES_INVOICE_RV"
      },
      "TrntranList": [
        {
          "A_ACID": this._trnMainService.TrnMainObj.PARAC,
          "AccountItem": {
            "SERIAL": null,
            "ACID": this._trnMainService.TrnMainObj.PARAC
          },
          "CRAMNT": this.paymentamount,
          "acitem": data
        }
      ],
      "Mode": "NEW",
      "DIVISION": this._trnMainService.userProfile.userDivision,
      "PhiscalID": this._trnMainService.userProfile.PhiscalYearInfo.PhiscalID,
      "guid": uuidV1(),
      "VoucherPrefix": "RV",
      "TRNTYPE": "none",
      "VoucherType": VoucherTypeEnum.ReceiveVoucher,
      "TRNMODE": "Party Receipt",
      "TRNDATE": this._trnMainService.TrnMainObj.TRNDATE,
      "TRN_DATE": this._trnMainService.TrnMainObj.TRN_DATE,
      "TRNAC": data.ACID,
      "TRNACName": data.ACNAME,
      "IsAccountBase": true,
      "JournalGstList": []
    }




  }

  onsavePayment() {

    if (this._trnMainService.nullToZeroConverter(this.paymentamount) <= 0) {
      this.alertservice.error("Invalid Amount.");
      return;
    }
    let bodyData = { mode: "NEW", data: this.paymentData };

    this.masterService.masterPostmethod_NEW("/saveTransaction", bodyData).subscribe((res) => {
      if (res.status == "ok") {
        ($('#myPayment') as any).modal('hide');
        ($('#myModal') as any).modal('hide');

        this.paymentData = <any>{};

      } else {
        this.alertservice.error(res.result);

      }
    }, error => {
      this.alertservice.error(error._body);
    })
  }

  existingPrescription: any[] = [];

  loadExistingPrescription() {
    if ((this._trnMainService.TrnMainObj.PARAC != "" && this._trnMainService.TrnMainObj.PARAC != null && this._trnMainService.TrnMainObj.PARAC != undefined) || (this._trnMainService.TrnMainObj.AdditionalObj.DOCTOR != "" && this._trnMainService.TrnMainObj.AdditionalObj.DOCTOR != null && this._trnMainService.TrnMainObj.AdditionalObj.DOCTOR != undefined)) {
      let x = {
        PARAC: this._trnMainService.TrnMainObj.PARAC,
        DOCTOR: this._trnMainService.TrnMainObj.AdditionalObj.DOCTOR
      }
      this.masterService.masterPostmethod_NEW("/getsavedprescription", x).subscribe((res) => {
        if (res.status == "ok") {
          this.existingPrescription = res.result;

          ($('#myPrescription') as any).modal('show');

        }
      })
    }


  }


  downloadImage(filename: string) {
    // let url = this.masterService.imageServer + '/' + filename;
    // const a: any = document.createElement('a');
    // a.href = url;
    // a.download = filename;
    // document.body.appendChild(a);
    // a.click();

    this.masterService.downlaodImage(filename).subscribe((res) => {
      this.masterService.downloadFile(res);
    })
  }


}
