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
@Component({
    selector: "trnmain-receipt-note",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"],
    templateUrl: "./trnmain-receipt-note.component.html"
})
export class TrnMainReceiptNoteComponent {
    @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
    @ViewChild("genericGridShipName") genericGridShipName: GenericPopUpComponent;
    @ViewChild("genericGridRefBill") genericGridRefBill: GenericPopUpComponent;
    @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;
    gridPopupSettingsForRefBill: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForShipName: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();
    billLabel: string = "Bill No"
    constructor(
        public masterService: MasterRepo,
        public _trnMainService: TransactionService,
        private alertService: AlertService
    ) {
        this.gridPopupSettingsForSupplier = Object.assign(new GenericPopUpSettings,{
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

        this.gridPopupSettingsForShipName = Object.assign(new GenericPopUpSettings,{
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
        this.gridPopupSettingsForWarehouse = Object.assign(new GenericPopUpSettings,{
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
        this.gridPopupSettingsForRefBill = Object.assign(new GenericPopUpSettings,this.masterService.getGenericGridPopUpSettings("REFBILLOFPURCHASERETURN"));
    }
    ngAfterViewInit() {
        if (this._trnMainService.TrnMainObj.VoucherType == 16) {
            document.getElementById("refbill").focus();
        }
        else {
            document.getElementById("supplierid").focus();
        }

    }
    ngOnInit() {
        if (this._trnMainService.TrnMainObj.VoucherType == 19) {
            this.billLabel = "PO NO.";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 3) {
            this.billLabel = "PI NO.";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 16) {
            this.billLabel = "RETURN NO.";
        }
        else if (this._trnMainService.TrnMainObj.VoucherType == 65) {
            this.billLabel = "RN NO.";
        }
        else {
            this.billLabel = "BILL NO.";
        }

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
        this.genericGridSupplier.show();
        document.getElementById("supplierid").blur();
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
    shiptoFieldChange()
    {
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME =null;
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAMEVIEW = null;
        this._trnMainService.TrnMainObj.DeliveryAddress =null;
        this._trnMainService.TrnMainObj.SHIPNAMEOBj=<any>{};
    }
    onSupplierSelected(supplier) {

        this._trnMainService.TrnMainObj.BILLTO = supplier.ACNAME;
        this._trnMainService.TrnMainObj.PARAC = supplier.ACID
        this._trnMainService.TrnMainObj.TRNAC = supplier.ACID;
        this._trnMainService.TrnMainObj.BILLTOADD = supplier.ADDRESS;
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = supplier.PSTYPE == null ? null : supplier.PSTYPE.toLowerCase();
        this._trnMainService.TrnMainObj.TRNMODE = supplier.PMODE;
        this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = supplier.GEO;
        this._trnMainService.TrnMainObj.PARTY_GSTTYPE=supplier.GSTTYPE;
        this._trnMainService.TrnMainObj.CREDITDAYS =
            this._trnMainService.TrnMainObj.AdditionalObj.CREDITDAYS = supplier.CRPERIOD;
        this.masterService.masterGetmethod("/getPartyBalanceAmount?acid=" + supplier.ACID)
            .subscribe(
                res => {
                    if (res.status == "ok") {
                        this._trnMainService.TrnMainObj.BALANCE = this._trnMainService.nullToZeroConverter(res.result);
                        this.masterService.focusAnyControl("menucode0");
                    } else {
                        console.log(res.result);
                    }
                },
                error => {
                    console.log(error);
                }
            );
    }

    shipNameEnterCommand(e) {
        e.preventDefault();
        document.getElementById("shipname").blur();
        this.genericGridShipName.show();
    }
    supplierFieldDisabled(): boolean {
        if (this._trnMainService.TrnMainObj.ProdList != null && (!isNullOrUndefined(this._trnMainService.TrnMainObj.TRNAC))) {
            if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
                return true;
            }
        }
        return false;
    }
    onShipNameSelected(customer) {
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME = customer.ACID;
        this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAMEVIEW = customer.ACNAME;
        this._trnMainService.TrnMainObj.DeliveryAddress = customer.ADDRESS;
        this._trnMainService.TrnMainObj.SHIPNAMEOBj=customer;
        //this._trnMainService.TrnMainObj.TRNMODE = customer.PMODE;

    }

    paymentTermsChange() {
        console.log("paymentchange", this._trnMainService.TrnMainObj.TRNMODE);
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

    getTRNDATE() {
        return moment(this._trnMainService.TrnMainObj.TRN_DATE).format("DD/MM/YYYY");

    }
}
