import { TransactionService } from "./transaction.service";
import { Component, ViewChild } from "@angular/core";
import { MasterRepo } from "./../repositories/masterRepo.service";
import {
    GenericPopUpComponent,
    GenericPopUpSettings
} from "../popupLists/generic-grid/generic-popup-grid.component";
import { AlertService } from "../services/alert/alert.service";
import * as moment from 'moment';
import { isNullOrUndefined } from "util";
import { VoucherTypeEnum } from "../interfaces/TrnMain";
import { SettingService } from "../services";
@Component({
    selector: "trnmain-purchase-entry",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"],
    templateUrl: "./trnmain-purchase.component.html"
})
export class TrnMainPurchaseComponent {
    @ViewChild("genericGridSupplierForRFQ") genericGridSupplierForRFQ: GenericPopUpComponent;
    @ViewChild("genericGridShipName") genericGridShipName: GenericPopUpComponent;
    @ViewChild("genericGridBillName") genericGridBillName: GenericPopUpComponent;
    @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
    @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;
    @ViewChild("genericGridPOno") genericGridPOno: GenericPopUpComponent;
    gridPOpupSettingsForSupplierForRFQ: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
    gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForShipName: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForBillName: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForPOno: GenericPopUpSettings = new GenericPopUpSettings();

    billLabel: string = "Bill No"
    forMrPonoStatus: boolean = false;
    supplierInputStatus: boolean = true;
    AppSettings: any = <any>{};
    selectedSuppliers: string = "";
    supplierDropdownSettings: any = {
        singleSelection: false,
        text: 'Select',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'ACNAME',
        primaryKey: 'ACID',
        position: 'bottom'

    };
    constructor(
        public masterService: MasterRepo,
        public _trnMainService: TransactionService,
        private alertService: AlertService,
        public setting: SettingService
    ) {
        this.AppSettings = setting.appSetting;
        this.gridPopupSettingsForSupplier = Object.assign(new GenericPopUpSettings, {
            title: "Supplier",
            apiEndpoints: `/getAccountPagedListByPType/PA/V`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACNAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ERPPLANTCODE",
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
                    key: "PRICELEVEL",
                    title: "TYPE",
                    hidden: false,
                    noSearch: false
                }
            ]
        });
        this.gridPOpupSettingsForSupplierForRFQ = Object.assign(new GenericPopUpSettings, {
            title: "Suppliers List For RFQ",
            apiEndpoints: `/getAccountPagedListByPType/PA/V`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ACNAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ERPPLANTCODE",
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
                    key: "PRICELEVEL",
                    title: "TYPE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "ACID",
                    title: "ACID",
                    hidden: false,
                    noSearch: false
                }
            ]
        });

        this.gridPopupSettingsForShipName = Object.assign(new GenericPopUpSettings, {
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
                    key: "PRICELEVEL",
                    title: "TYPE",
                    hidden: false,
                    noSearch: false
                }
            ]

        });


        this.gridPopupSettingsForPOno = Object.assign(new GenericPopUpSettings, {
            title: "Purchase Orders",
            apiEndpoints: `/getMasterPagedListOfAny`,
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
                    key: 'RFQVALIDITY',
                    title: 'DATE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'EXPDELIVERYDATE',
                    title: 'DATE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'NETAMNT',
                    title: 'AMOUNT',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'TRNSTATUS',
                    title: 'STATUS',
                    hidden: false,
                    noSearch: true
                }
            ]
        });
        this.gridPopupSettingsForBillName = Object.assign(new GenericPopUpSettings, {
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
                    key: "PRICELEVEL",
                    title: "TYPE",
                    hidden: false,
                    noSearch: false
                }
            ]

        });

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
        this.gridPopupSettingsForRefBill = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings("REFBILLOFPURCHASERETURN"));
        this.getSupplier();
    }
    ngAfterViewInit() {
        if (this._trnMainService.TrnMainObj.VoucherType == 16) {
            this.masterService.focusAnyControl("refbill");
        }
        else {
            //document.getElementById("supplierid").focus();
        }
    }
    ngOnInit() {

        if (this._trnMainService.TrnMainObj.VoucherType == 19) {
            this.billLabel = "PO NO.";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 3) {
            this.billLabel = "PI NO.";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 110) {
            this.billLabel = "MR NO.";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 16) {
            this.billLabel = "RETURN NO.";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 114) {
            this.getSupplier();
        }
        else {
            this.billLabel = "BILL NO.";
        }
    }
    supplierList: any = [];
    getSupplier() {
        this.masterService.masterGetmethod_NEW("/getAccountPagedListByPType/PA/V?currentPage=1&maxResultCount=100").subscribe(data => {
            this.supplierList = data.data;
        })
    }
    ChooseSupplierForRFQ() {
        this.genericGridSupplierForRFQ.show('', false, this._trnMainService.TrnMainObj.VoucherAbbName);
    }
    onSupplierMultiSelectForRFQ(event) {
        
        let supplierList: any[] = [];
        this._trnMainService.TrnMainObj.BILLTO = '';
        event.forEach(x => {
            console.log(x.ERPPLANTCODE, x.ACID)
            supplierList.push({ supplierid: x.ERPPLANTCODE, supplieracid: x.ACID });
            this._trnMainService.TrnMainObj.BILLTO += x.ACNAME + ' ,'
        });
        console.log(supplierList, 'supplierList')
        this._trnMainService.TrnMainObj.SupplierListForRfq = supplierList
    }

    onSupplierDoubleClickForRFQ(event) {
        
        this._trnMainService.TrnMainObj.SupplierListForRfq[0] = event.ACID;
        this._trnMainService.TrnMainObj.SupplierListForRfq[0] = { supplierid: event.ERPPLANTCODE, supplieracid: event.ACID }
        this._trnMainService.TrnMainObj.BILLTO = event.ACNAME

    }
    undo() {
        this._trnMainService.TrnMainObj.TRNMODE = "credit";
    }

    ngOnDestroy() {
        try {
        } catch (ex) {
            console.log({ ondestroy: ex });
        }
    }


    SupplierEnterCommand(e) {
        e.preventDefault();
        this.genericGridSupplier.show("", false, this._trnMainService.TrnMainObj.VoucherAbbName);
        document.getElementById("supplierid").blur();
        //    if(this._trnMainService.TrnMainObj.VoucherPrefix=="MR" &&
        //      (this._trnMainService.TrnMainObj.REFORDBILL == undefined ||
        //     this._trnMainService.TrnMainObj.REFORDBILL == null ||
        //     this._trnMainService.TrnMainObj.REFORDBILL == '') && this.AppSettings.EnableSupplierwithoutPO == 1){
        //         this.checkSupplierForMR();
        //        // console.log('condition true');
        //     }else{
        //         this.genericGridSupplier.show("",false,this._trnMainService.TrnMainObj.VoucherAbbName);
        //     document.getElementById("supplierid").blur();
        //     }

    }

    checkSupplierForMR() {
        this.alertService.warning("Select PO no. First");
        this.supplierInputStatus = false;
        this.forMrPonoStatus = true;
        this.genericGridPOno.show(this._trnMainService.TrnMainObj.PARAC, false, "viewForPurchaseOrder");
    }


    onPoInvoiceEntered() {
        this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILL = this._trnMainService.TrnMainObj.REFBILL
    }


    supplierFieldChange() {

        this._trnMainService.TrnMainObj.PARAC = null;
        this._trnMainService.TrnMainObj.TRNAC = null;
        this._trnMainService.TrnMainObj.BILLTOADD = null;
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = null;
        this._trnMainService.TrnMainObj.TRNMODE = null;
        this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = null;
        this._trnMainService.TrnMainObj.CREDITDAYS = 0;

    }
    shiptoFieldChange() {
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME = null;
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAMEVIEW = null;
        this._trnMainService.TrnMainObj.DeliveryAddress = null;
        this._trnMainService.TrnMainObj.SHIPNAMEOBj = <any>{};
    }

    billtoFieldChange() {
        this._trnMainService.TrnMainObj.AdditionalObj.BILLNAME = null;
        this._trnMainService.TrnMainObj.AdditionalObj.BILLNAMEVIEW = null;
        this._trnMainService.TrnMainObj.DeliveryAddress = null;
        this._trnMainService.TrnMainObj.BILLNAMEOBj = <any>{};
    }

    onMrPoOption(event) {
        this.loadVoucher(event, "VIEW");
    }

    loadVoucher(selectedItem, mode: string = "VIEW") {
        let voucherType = this._trnMainService.TrnMainObj.VoucherType;
        this._trnMainService.loadData(selectedItem.VCHRNO, selectedItem.DIVISION, selectedItem.PhiscalID, mode);
        this._trnMainService.showPerformaApproveReject = false;
    }

    onSupplierSelected(supplier) {
        this._trnMainService.TrnMainObj.BILLTO = supplier.ACNAME;
        this._trnMainService.TrnMainObj.PARAC = supplier.ACID
        this._trnMainService.TrnMainObj.TRNAC = supplier.ACID;
        this._trnMainService.TrnMainObj.DLNO1 = supplier.DLNO1;
        this._trnMainService.TrnMainObj.DLNO2 = supplier.DLNO2;
        this._trnMainService.TrnMainObj.DLNO3 = supplier.DLNO3;
        this._trnMainService.TrnMainObj.DLNO4 = supplier.DLNO4;
        this._trnMainService.TrnMainObj.BILLTOADD = supplier.ADDRESS;
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = supplier.PSTYPE == null ? null : supplier.PSTYPE.toLowerCase();
        this._trnMainService.TrnMainObj.TRNMODE = supplier.PMODE;
        this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = supplier.GEO;
        this._trnMainService.TrnMainObj.PARTY_GSTTYPE = supplier.GSTTYPE;
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder && this._trnMainService.AppSettings.enableSupplierWiseTermsAndConditionInPO) {
            this._trnMainService.TrnMainObj.AdditionalObj.T_AND_C = supplier.REMARKS;
        }
        this._trnMainService.TrnMainObj.CREDITDAYS =
            this._trnMainService.TrnMainObj.AdditionalObj.CREDITDAYS = supplier.CRPERIOD;
        this.masterService.masterGetmethod("/getPartyBalanceAmount?acid=" + supplier.ACID)
            .subscribe(
                res => {
                    if (res.status == "ok") {
                        this._trnMainService.TrnMainObj.BALANCE = this._trnMainService.nullToZeroConverter(res.result);
                        this.masterService.focusAnyControl("invNo");
                    } else {
                        //console.log(res.result);
                    }
                },
                error => {
                    //console.log(error);
                }
            );

        if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) && this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
            this.masterService.getTopTransactionForPurchase('%', this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
                if (data.status == 'ok') {
                    this._trnMainService.TrnMainObj.ProdList[0].TransactionHistory = data.result;
                }
            })
        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
            this.masterService.getTopTransactionForDebitNote('%', this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
                if (data.status == 'ok') {
                    this._trnMainService.TrnMainObj.ProdList[0].TransactionHistory = data.result;
                }
            })
        }


    }

    shipNameEnterCommand(e) {
        e.preventDefault();
        document.getElementById("shipname").blur();
        this.genericGridShipName.show();
    }

    billNameEnterCommand(e) {
        e.preventDefault();
        document.getElementById("billname").blur();
        this.genericGridBillName.show();
    }

    supplierFieldDisabled(): boolean {
        let voucherPrefix = this._trnMainService.TrnMainObj.VoucherPrefix;
        let voucherType = this._trnMainService.TrnMainObj.VoucherType;
        if (voucherPrefix == "MR" && voucherType == 110) {

        } else {
            if (this._trnMainService.TrnMainObj.ProdList != null && (!isNullOrUndefined(this._trnMainService.TrnMainObj.TRNAC))) {
                if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
                    return true;
                }
            }
        }

        return false;
    }
    onShipNameSelected(customer) {
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME = customer.ACID;
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAMEVIEW = customer.ACNAME;
        this._trnMainService.TrnMainObj.DeliveryAddress = customer.ADDRESS;
        this._trnMainService.TrnMainObj.SHIPNAMEOBj = customer;
        //this._trnMainService.TrnMainObj.TRNMODE = customer.PMODE;

    }

    onBillNameSelected(customer) {
        this._trnMainService.TrnMainObj.AdditionalObj.BILLNAME = customer.ACID;
        this._trnMainService.TrnMainObj.AdditionalObj.BILLNAMEVIEW = customer.ACNAME;
        this._trnMainService.TrnMainObj.DeliveryAddress = customer.ADDRESS;
        this._trnMainService.TrnMainObj.BILLNAMEOBj = customer;
        //this._trnMainService.TrnMainObj.TRNMODE = customer.PMODE;
    }

    paymentTermsChange() {
        // console.log("paymentchange", this._trnMainService.TrnMainObj.TRNMODE);
    }
    RefBillEnterCommand(event) {
        event.preventDefault();
        document.getElementById("refbill").blur();
        this.genericGridRefBill.show(this._trnMainService.TrnMainObj.PARAC, false, "pivoucherlistforpurchasereturn");
    }
    onRefBillSelected(event) {
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = event.TRNTYPE;
        this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
        this._trnMainService.TrnMainObj.PARAC = event.PARAC;
        this._trnMainService.TrnMainObj.BILLTO = event.BILLTO;
        this._trnMainService.TrnMainObj.TRNAC = event.TRNAC;
        this._trnMainService.TrnMainObj.BILLTOADD = event.BILLTOADD;
        this._trnMainService.TrnMainObj.TRNMODE = event.TRNMODE;
        this._trnMainService.TrnMainObj.DCRATE = event.DCRATE;
        this._trnMainService.TrnMainObj.TOTALFLATDISCOUNT = event.TOTALFLATDISCOUNT;
        this._trnMainService.TrnMainObj.ISMANUALRETURN = false;
        this._trnMainService.TrnMainObj.REFORDBILL = event.REFBILL;
    }
    RefBillFieldDisabled() {
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
    WarehouseEnterCommand(event) {
        this.genericGridWarehouse.show();
    }
    onWarehouseSelected(event) {
        this._trnMainService.TrnMainObj.MWAREHOUSE = event.NAME;
    }



    disableAutoSupplierFiled() {

        if (this._trnMainService.TrnMainObj.BILLTO == null || this._trnMainService.TrnMainObj.BILLTO == "") {

        }
        else {
            return true;
        }
        return false;
    }


    setTRNDATE(value) {
        if (this.masterService.ValidateDate(value)) {
            this._trnMainService.TrnMainObj.TRN_DATE = this.masterService.changeIMsDateToDate(value);
        } else {
            this.alertService.error(`Invalid Invoice Date`);
        }
    }
    setRFQValidity(value) {
        if (this.masterService.ValidateDate(value)) {
            this._trnMainService.TrnMainObj.RFQValidity = this.masterService.changeIMsDateToDate(value);
        } else {
            this.alertService.error(`Invalid Invoice Date`);
        }
    }

    setExpDate(value) {
        if (this.masterService.ValidateDate(value)) {
            this._trnMainService.TrnMainObj.ExpDate = this.masterService.changeIMsDateToDate(value);
        } else {
            this.alertService.error(`Invalid Invoice Date`);
        }
    }

    getTRNDATE() {
        return moment(this._trnMainService.TrnMainObj.TRN_DATE).format("DD/MM/YYYY");

    }

    getRFQValidity() {
        return moment(this._trnMainService.TrnMainObj.RFQValidity).format("DD/MM/YYYY");
    }
    getExpDate() {
        return moment(this._trnMainService.TrnMainObj.ExpDate).format("DD/MM/YYYY");
    }
}
