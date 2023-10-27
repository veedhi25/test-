import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    HostListener,
    ElementRef,
    Pipe,
    PipeTransform
} from "@angular/core";
import {
    VoucherTypeEnum,
    TrnMain_AdditionalInfo,
    TrnProd,
    TRNSCHEMEAPPLIED,
    ITEMTYPE,
    BarcodeDifferentiatorModel
} from "./../interfaces/TrnMain";
import { TransactionService } from "./transaction.service";
import { Item, Product } from "./../interfaces/ProductItem";
import { MasterRepo } from "./../repositories/masterRepo.service";
import { AppSettings } from "./../services";
import { SettingService } from "./../services";
import { Subscription } from "rxjs/Subscription";
import { MdDialog } from "@angular/material";
import { PoplistComponent } from "../popupLists/PopItemList/PopItems.component";
import { PopBatchComponent } from "../popupLists/PopBatchList/PopBatch.component";
import { AlertService } from "../services/alert/alert.service";
import { GenericPopUpSettings, GenericPopUpComponent } from '../popupLists/generic-grid/generic-popup-grid.component';
import { ActivatedRoute } from "@angular/router";
import { VoucherMasterTogglerComponent } from "./voucher-master-toggler.component";
import * as _ from 'lodash';
@Component({
    selector: "productentry",
    templateUrl: "./ProductInsert.html",
    styleUrls: ["../../pages/Style.css", "./halfcolumn.css", "./productinsert.scss"]
})




export class ProductInsertComponent implements OnInit {


    matrixItemAtrribute: any[] = [];
    @Output() TotalBill = new EventEmitter();
    @ViewChild(PoplistComponent) itemListChild: PoplistComponent;
    @ViewChild(PopBatchComponent) batchlistChild: PopBatchComponent;
    @ViewChild("genericGridSupplierPopup") genericGridSupplierPopup: GenericPopUpComponent;
    @ViewChild("voucher-toggler") masterToggler: VoucherMasterTogglerComponent;
    @ViewChild("genericGridSalesmanPopup") genericGridSalesmanPopup: GenericPopUpComponent;
    @ViewChild("genericGridItemPricesPopup") genericGridItemPricesPopup: GenericPopUpComponent;
    @ViewChild("matrixitemgrid") matrixitemgrid: MatrixItemGridComponent;
    @ViewChild("serialiseditemgrid") serialiseditemgrid: SerializedItemGridComponent;
    @ViewChild("batchfilterGrid") batchfilterGrid: GenericPopUpComponent;
    @ViewChild("voucherhistory") voucherhistory: VoucherHistoryComponent;
    gridPopupSettingsForbatchfilterGrid: GenericPopUpSettings = new GenericPopUpSettings();

    gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();

    gridPopupSettingsForSalesman: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForItemPrices: GenericPopUpSettings = new GenericPopUpSettings();

    ServiceTaxRate: number = 0;
    VatRate: number = 0;
    mappedMcode: string = "0";
    tableValidation = false;
    ItemList: Item[] = [];

    subscriptions: Subscription[] = [];
    @Input("voucherType") voucherType: any;
    flatDiscountValue: number;
    radioFlatDiscount: string;

    AppSettings: AppSettings;
    showDiscount: boolean = true;
    SupplierList: any[] = [];
    activerowIndex: number = 0;
    previousOpeningStockData: any[] = [];
    WarehouseWiseCounterMProduct: any[] = [];

    ItemObj: any = <any>{};
    itemListSearch: string;
    AlternateUnits: any[] = [];
    schemeList: any[] = [];
    flatdiscountpercent: number;
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    showStockedQuantityOnly: number = 0;
    supFilter: string = "all";
    activeurlpath: string;
    approvalFlag: boolean = false;
    configCodeParams: any = [];
    @ViewChild('prodlistTable') prodlistTable: ElementRef;
    @ViewChild("genericStaticGrid") genericStaticGrid: GenericStaticPopUpComponent;

    @HostListener("document : keydown", ["$event"])
    updown($event: KeyboardEvent) {

        if (!this.genericGrid.isActive && !this.genericStaticGrid.isActive) {
            return true;
        }
        if ($event.code == "ArrowRight") {
            $event.preventDefault()
        }
        if ($event.code == "ArrowLeft") {
            $event.preventDefault()
        }
        if ($event.code == "ArrowDown") {
            $event.preventDefault();
            if (this.genericStaticGrid.isActive || this.genericGrid.isActive) {
                return false;
            }
            this.prodlistTable.nativeElement.scrollTop = this.prodlistTable.nativeElement.scrollTop - 25;
            return;
        } else if ($event.code == "ArrowUp") {
            $event.preventDefault();
            if (this.genericStaticGrid.isActive || this.genericGrid.isActive) {
                return false;
            }
            if (this.prodlistTable.nativeElement.scrollTop > 0) {
                this.prodlistTable.nativeElement.scrollTop = this.prodlistTable.nativeElement.scrollTop - 25;
                return;
            }
        }
    }

    constructor(
        public masterService: MasterRepo,
        public _trnMainService: TransactionService,
        private setting: SettingService,
        public dialog: MdDialog,
        public arouter: ActivatedRoute,
        private alertService: AlertService,
        private _userwisegridconf: UserWiseTransactionFormConfigurationService) {
        try {
            this.AppSettings = setting.appSetting;
            this.ServiceTaxRate = this.setting.appSetting.ServiceTaxRate;
            this.VatRate = this.setting.appSetting.VATRate;

            //Constructor ended
            if (

                this._trnMainService.TrnMainObj.VoucherType ==
                VoucherTypeEnum.StockIssue
            ) {
                this.showDiscount = false;
            }
            this.radioFlatDiscount == "percent";
            masterService.ShowMore = true;
        } catch (ex) {
            this.alertService.error(ex)
        }
        this.activeurlpath = arouter.snapshot.url[0].path;
    }

    cancelShowItemRoute() {
        if (this._trnMainService.TrnMainObj.VoucherType == 14) {
            this._trnMainService.showItemStockRouteModal = false;
        }
    }
    onMCODEDown(event, index) {
        this.masterService.focusAnyControl("menucode" + (this._trnMainService.nullToZeroConverter(index) + 1));
    }
    onMCODEUp(event, index) {
        this.masterService.focusAnyControl("menucode" + (this._trnMainService.nullToZeroConverter(index) - 1));
    }
    onQuantityDown(event, index) {
        if (!this.batchlistChild) {

            this.masterService.focusAnyControl("quantity" + (this._trnMainService.nullToZeroConverter(index) + 1));
        }
    }

    onKeyDownInQuantity(event, index) {
        if (this._trnMainService.TrnMainObj.ProdList[index].Ptype == ITEMTYPE.SERIALIZEDITEM && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance)) {
            event.preventDefault();
            this.serialiseditemgrid.show(index);
            return;
        }
        return true;
    }

    onSerialisedItemApply(event) {
        this._trnMainService.TrnMainObj.ProdList[event.activeRowIndex].Quantity = this._trnMainService.TrnMainObj.ProdList[event.activeRowIndex].serialItemList.length;
        this._trnMainService.ReCalculateBillWithNormal();
    }

    onQuantityUp(event, index) {
        if (!this.batchlistChild) {

            this.masterService.focusAnyControl("quantity" + (this._trnMainService.nullToZeroConverter(index) - 1));
        }
    }

    ngAfterViewInit() { }


    model1Closed() {
        this.masterService.PlistTitle = "";
    }
    ngOnInit() {
        this.setItemPopupUrl();
        if (this.activeurlpath == 'StockSettlementEntryApproval') {
            return this.approvalFlag = true;
        }

        this.masterService.invoiceDetailSubject.subscribe((res) => {
            let params = {
                supcode: 'all',
                showstockqty: 1,
                warehouse: this._trnMainService.userProfile.userWarehouse,
                mcode: res.MCODE,
                prefix: this._trnMainService.TrnMainObj.VoucherAbbName,
                itemDivision: this._trnMainService.TrnMainObj.itemDivision,
                mcat: this._trnMainService.TrnMainObj.customerMCAT,

            }

            this.masterService.masterPostmethod("/getItemDetailFromCode", params).subscribe((res) => {
                if (res.status == "ok") {
                    this.dblClickPopupItem(res.result);
                } else if (res.status == "error") {
                    this.alertService.error(res.result);
                }
            });
        })



    }

    tabAcivateforQty = false;
    rowIndex: any;
    RowClick(index) {
        // this._trnMainService.TrnMainObj.ProdList[index].ReturnQuantity=0;
        this._trnMainService.prodActiveRowIndex = this.activerowIndex = this.rowIndex = index;
        this.masterService.ShowMore = false;

    }

    /** -------------------- Tab Section ------------------ */

    ItemkeyEvent(index) {


        this._trnMainService.prodActiveRowIndex = this.activerowIndex = index;

        if (this._trnMainService.TrnMainObj.VoucherPrefix == "" || this._trnMainService.TrnMainObj.VoucherPrefix == null) {
            this.alertService.warning("Please select the series"); return;
        }
        if (this._trnMainService.TrnMainObj.ProdList[index].MENUCODE == null || this._trnMainService.TrnMainObj.ProdList[index].MENUCODE == "" || this._trnMainService.TrnMainObj.ProdList[index].MENUCODE == undefined) {
            let activeRoute = this.arouter.snapshot.url[0].path;

            /**
             * Added By Bibek
             */
            let itemSelectedList = [];
            for (let x of this._trnMainService.TrnMainObj.ProdList) {
                if (x.SNO) {
                    itemSelectedList.push(`'${x.SNO}'`)
                }
            }
            let listofselecteditemStr = itemSelectedList.length > 0 ? itemSelectedList.join() : '';//added by bibek

            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNote ||
                ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == 'superdistributor' ||
                    this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == 'distributor') &&
                    this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice)
            ) {
                let party = "party";
                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
                    this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNote || this.activeurlpath == "add-debitnote-itembase") {
                    party = "Supplier";
                }
                else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder
                    || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
                    party = "Customer";
                }
                if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
                    this.alertService.info("Please Choose " + party + " to proceed...");
                    this.masterService.ShowMore = true;
                    return false;
                }
            }
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
                if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
                    this.alertService.info("Please Choose Customer to proceed...");
                    return false;
                }
            }
            document.getElementById('menucode' + this.activerowIndex).blur();

            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice ||

                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Sales ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOut) { this.showStockedQuantityOnly = 1; }
            else { this.showStockedQuantityOnly = 0; }

            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {

                this.gridPopupSettings.apiEndpoints = `/getMenuitemForSaleReturnPagedList`;

            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
                this.gridPopupSettings.apiEndpoints = `/getMenuitemForPurchaseReturnPagedList/${this._trnMainService.TrnMainObj.MWAREHOUSE}`;

            }
            else {
                let prefix = "11";
                if (this._trnMainService.TrnMainObj.VoucherPrefix != null) {
                    prefix = this._trnMainService.TrnMainObj.VoucherPrefix;
                }
                if (this._trnMainService.TrnMainObj.VoucherAbbName != null) {
                    prefix = this._trnMainService.TrnMainObj.VoucherAbbName;
                }

                let warehouse = (this._trnMainService.TrnMainObj.MWAREHOUSE == null || this._trnMainService.TrnMainObj.MWAREHOUSE == "" || this._trnMainService.TrnMainObj.MWAREHOUSE == undefined) ? this._trnMainService.userProfile.userWarehouse : this._trnMainService.TrnMainObj.MWAREHOUSE;
                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) {
                    warehouse = this._trnMainService.TrnMainObj.BILLTO;
                }
                else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferOut
                    || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferIn) {
                    warehouse = this._trnMainService.TrnMainObj.MWAREHOUSE;
                }
                this.gridPopupSettings.apiEndpoints = `/getMenuitemWithStockPagedList/${this.showStockedQuantityOnly}/${'all'}/${prefix}/${warehouse}`;
            }
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
                if (this.AppSettings.SERVERSIDEITEMFETCHINSALES == 1) {
                    if (this.AppSettings.CompanyNature == 1) {
                        this.genericGrid.show(this._trnMainService.TrnMainObj.REFBILL, false, "", true, "", false, this._trnMainService.TrnMainObj.SELECTEDVARIANT);

                    } else {
                        this.genericGrid.show(this._trnMainService.TrnMainObj.REFBILL);

                    }
                }
                else {
                    this.genericStaticGrid.show(this._trnMainService.TrnMainObj.REFBILL);
                }
            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
                this.genericGrid.show(this._trnMainService.TrnMainObj.REFBILL, false, listofselecteditemStr);
            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
                this.genericGrid.show(this._trnMainService.TrnMainObj.REFBILL, false, this._trnMainService.TrnMainObj.itemDivision, true, this._trnMainService.TrnMainObj.customerMCAT);
            }
            else {
                this.genericGrid.show(this._trnMainService.TrnMainObj.REFBILL);
            }
            return false;
        } else {
            let params: any = <any>{};
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
                return true;

            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {

                params = {
                    supcode: 'all',
                    showstockqty: 0,
                    warehouse: this._trnMainService.TrnMainObj.MWAREHOUSE,
                    refbill: this._trnMainService.TrnMainObj.REFBILL,
                    prefix: this._trnMainService.TrnMainObj.VoucherPrefix,
                    mcode: this._trnMainService.TrnMainObj.ProdList[index].MENUCODE
                }
            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {

                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice &&
                    this.AppSettings.disableRepeatProductInsale == 1) {
                    if (this._trnMainService.checkMcodePresentInProd(this._trnMainService.TrnMainObj.ProdList[index].MENUCODE) == true) {
                        this.alertService.warning("Item is already present in current bill.");
                        return;
                    }
                }
                params = {
                    supcode: 'all',
                    showstockqty: 1,
                    warehouse: this._trnMainService.TrnMainObj.MWAREHOUSE,
                    mcode: this._trnMainService.TrnMainObj.ProdList[index].MENUCODE,
                    prefix: this._trnMainService.TrnMainObj.VoucherAbbName,
                    itemDivision: this._trnMainService.TrnMainObj.itemDivision,
                    mcat: this._trnMainService.TrnMainObj.customerMCAT,

                }

                this.masterService.masterPostmethod("/getItemDetailFromCode", params).subscribe((res) => {
                    if (res.status == "ok") {
                        this.dblClickPopupItem(res.result);
                    } else {

                        if (this.AppSettings.SERVERSIDEITEMFETCHINSALES == 1) {
                            if (this.AppSettings.CompanyNature == 1) {
                                this.genericGrid.show(this._trnMainService.TrnMainObj.REFBILL, false, "", true, "", false, this._trnMainService.TrnMainObj.SELECTEDVARIANT);

                            } else {
                                this.genericGrid.show(this._trnMainService.TrnMainObj.REFBILL);

                            }
                        }
                        else {
                            this.genericStaticGrid.show(this._trnMainService.TrnMainObj.REFBILL, false, "", true, "DESCA", this._trnMainService.TrnMainObj.ProdList[index].MENUCODE);

                        }
                    }
                });
            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {

                if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
                    this.alertService.info("Please Choose supplier to proceed...");
                    this.masterService.ShowMore = true;
                    return false;
                }





                params = {
                    supcode: 'all',
                    showstockqty: 0,
                    warehouse: this._trnMainService.userProfile.userWarehouse,
                    mcode: this._trnMainService.TrnMainObj.ProdList[index].MENUCODE,
                    prefix: this._trnMainService.TrnMainObj.VoucherPrefix,
                    itemDivision: this._trnMainService.TrnMainObj.itemDivision,
                    mcat: this._trnMainService.TrnMainObj.customerMCAT
                }

                this.masterService.masterPostmethod("/getItemDetailFromCode", params).subscribe((res) => {
                    if (res.status == "ok") {
                        this.dblClickPopupItem(res.result);
                    }
                });
            }
            else {
                params = {
                    supcode: 'all',
                    showstockqty: 0,
                    warehouse: this._trnMainService.userProfile.userWarehouse,
                    mcode: this._trnMainService.TrnMainObj.ProdList[index].MENUCODE,
                    prefix: this._trnMainService.TrnMainObj.VoucherPrefix,
                    itemDivision: this._trnMainService.TrnMainObj.itemDivision,
                    mcat: this._trnMainService.TrnMainObj.customerMCAT
                }
            }

        }



    }

    /**Batch tab/Enter */
    BatchTabClick(index, header: string) {

        this.activerowIndex = index;
        this.masterService.RemoveFocusFromAnyControl("batch" + this.activerowIndex);



        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan) {
            if (this._trnMainService.TrnMainObj.ProdList[index].BATCH != null && this._trnMainService.TrnMainObj.ProdList[index].BATCH != "" && this._trnMainService.TrnMainObj.ProdList[index].BATCH != undefined && (this._trnMainService.TrnMainObj.Mode.toUpperCase() == "NEW" || this._trnMainService.TrnMainObj.Mode.toUpperCase() == "EDIT")) {

                this.batchfilterGrid.show(this._trnMainService.TrnMainObj.ProdList[index].BATCH, false, this._trnMainService.TrnMainObj.PARTY_ORG_TYPE, true, this._trnMainService.TrnMainObj.ProdList[index].MCODE, false, this._trnMainService.TrnMainObj.MWAREHOUSE);
                return;
            }
        }



        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn
            || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance
            || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferIn
        ) {
            if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCH == null) {
                this.masterService.focusAnyControl('batch' + this.activerowIndex);
                return false;
            }

            this.focusControlFromUserSetting(header, index)
            return;

        }

        if (
            this._trnMainService.TrnMainObj.ProdList[index] == null ||
            this._trnMainService.TrnMainObj.ProdList[index].MCODE == null ||
            this._trnMainService.TrnMainObj.ProdList[index].MCODE == ""
        ) {
            return false;
        }
        let warehouse = this._trnMainService.TrnMainObj.MWAREHOUSE;
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) {
            warehouse = this._trnMainService.TrnMainObj.BILLTO;
        }


        let allowonlynonexpireditem = 1;
        if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && this._trnMainService.AppSettings.ENABLEEXPIREDRETURNINSALES == true) || (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && this._trnMainService.AppSettings.ENABLEEXPIREDRETURNINPURCHASE == true)) {
            allowonlynonexpireditem = 0;
        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCH == undefined || this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCH == "" || this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCH == null) {
                this.masterService
                    .masterPostmethod("/getBatchListOfItem", {
                        mcode: this._trnMainService.TrnMainObj.ProdList[index].MCODE,
                        ptype: this._trnMainService.TrnMainObj.ProdList[index].Ptype,
                        onlynonexpireditem: allowonlynonexpireditem,
                        voucherprefix: this._trnMainService.TrnMainObj.VoucherPrefix,
                        warehouse: warehouse,
                        PARTY_TYPE: this._trnMainService.TrnMainObj.PARTY_ORG_TYPE
                    })
                    .subscribe(
                        res => {
                            if (res.status == "ok") {

                                this._trnMainService.batchlist = JSON.parse(res.result);


                                if (this._trnMainService.batchlist.length == 1 && this._trnMainService.AppSettings.ENABLEBATCHPREVIEW == "DISABLESINGLEBATCHPREVIEW") {
                                    this.returnBatch(this._trnMainService.batchlist[0]);
                                }
                                else {
                                    this.masterService.PlistTitle = "batchList";
                                }

                            } else {
                                this.alertService.error("Error on getting BatchList Of Item ")
                            }
                        },
                        error => {
                            this.alertService.error(error)
                        }
                    );
            } else {
                document.getElementById('mfgdate' + this.activerowIndex).focus();
            }
        } else {
            this.masterService
                .masterPostmethod("/getBatchListOfItem", {
                    mcode: this._trnMainService.TrnMainObj.ProdList[index].MCODE,
                    ptype: this._trnMainService.TrnMainObj.ProdList[index].Ptype,
                    onlynonexpireditem: allowonlynonexpireditem,
                    voucherprefix: this._trnMainService.TrnMainObj.VoucherAbbName,
                    warehouse: warehouse,
                    PARTY_TYPE: this._trnMainService.TrnMainObj.PARTY_ORG_TYPE,
                    partyacid: this._trnMainService.TrnMainObj.PARAC == "" ? null : this._trnMainService.TrnMainObj.PARAC
                })
                .subscribe(
                    res => {
                        if (res.status == "ok") {
                            this._trnMainService.batchlist = JSON.parse(res.result);


                            if (this._trnMainService.batchlist.length == 1 && this._trnMainService.AppSettings.ENABLEBATCHPREVIEW == "DISABLESINGLEBATCHPREVIEW") {
                                this.returnBatch(this._trnMainService.batchlist[0]);
                            }
                            else {
                                this.masterService.PlistTitle = "batchList";
                            }

                        } else {
                            this.alertService.error("Error on getting BatchList Of Item ")
                        }
                    },
                    error => {
                        this.alertService.error(error)
                    }
                );
        }

        return false;
    }
    onKeydownOnBatch(event) {
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNote || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance || this.activeurlpath == "add-creditnote-itembase") { }
        else {
            if (event.key === "Enter" || event.key === "Tab") { }
            else {
                // event.preventDefault();
            }
        }
    }










    assignedSchemeToBatch() {
        let scheme = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex]
            .ALLSCHEME;
        if (scheme != null) {
            if (scheme.batches == null || scheme.batches == "") {
                this._trnMainService.batchlist.forEach(b => {
                    b.SCHEME = scheme;
                    b.SCHEMERATE = scheme.schemeDisRate;
                    b.SCHEMENAME = scheme.schemeName;
                    b.SchemeRateType = scheme.discountRateType;
                });
            } else {
                var batches = scheme.batches.toString().split(",");
                this._trnMainService.batchlist.forEach(b => {
                    if (batches.find(x => x == b.BATCH) != null) {
                        b.SCHEME = scheme;
                        b.SCHEMERATE = scheme.schemeDisRate;
                        b.SCHEMENAME = scheme.schemeName;
                        b.SchemeRateType = scheme.discountRateType;
                    }
                });
            }
        }
    }
    ReturnedSchemeValue() { }
    BatchEnter(index, header: string) {
        this.activerowIndex = index;
        this.BatchTabClick(index, header);
        return false;
    }

    popupShowHideControl() {
        switch (this.masterService.PlistTitle) {
        }
    }

    dblClickPopupItem(value) {
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice &&
            this.AppSettings.disableRepeatProductInsale == 1) {
            if (this._trnMainService.checkMcodePresentInProd(value.MCODE) == true) {
                this.alertService.warning("Item is already present in current bill.");
                return;
            }
        }
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex] = <TrnProd>{};
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TRANSACTIONMODE = "NEW";
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].inputMode = true;
        let rowWithFirstSalesman = this._trnMainService.TrnMainObj.ProdList.filter(x => x.SALESMANID != null && x.SALESMANID != 0)[0];

        if (rowWithFirstSalesman != null) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMANID = rowWithFirstSalesman.SALESMANID;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMANNAME = rowWithFirstSalesman.SALESMANNAME;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMAN_COMMISION = rowWithFirstSalesman.SALESMAN_COMMISION;
        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && value.PTYPE == 13) {
            this.masterService.masterGetmethod(`/getcomboitemdetails?mcode=${value.MCODE}`).subscribe((res) => {
                if (res.status == "ok" && res.result && res.result.length) {
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].COMBOITEMLIST = [];
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].COMBOITEMLIST = res.result;

                }
            })
        }
        if (this._trnMainService.TrnMainObj.VoucherPrefix == "PO") {
            if (value.MCODE != value.MERGEPARENT) {
                this.masterService.masterGetmethod("/getMergedParentItem/" + value.MERGEPARENT).subscribe(res => {
                    if (res.status == "ok") {
                        this.dblClickItemSubMethod(res.result);
                    }

                }, error => { });
            }
            else {
                this.dblClickItemSubMethod(value);
            }
        }
        else {
            this.dblClickItemSubMethod(value);


        }
        if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) && this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
            this.masterService.getTopTransactionForPurchase(value.MCODE, this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
                if (data.status == 'ok') {
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TransactionHistory = data.result;
                }
            })
        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
            this.masterService.getTopTransactionForSales(value.MCODE, this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
                if (data.status == 'ok') {
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TransactionHistory = data.result;
                }
            })
        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
            this.masterService.getTopTransactionForDebitNote(value.MCODE, this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
                if (data.status == 'ok') {
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TransactionHistory = data.result;
                }
            })
        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
            this.masterService.getTopTransactionForCreditNote(value.MCODE, this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
                if (data.status == 'ok') {
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TransactionHistory = data.result;
                }
            })
        }




    }
    dblClickItemSubMethod(value) {

        let userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));



        this.masterService.PlistTitle = "";
        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex] != null) {
            this._trnMainService.batchlist = [];
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SELECTEDITEM = value;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BC = value.BARCODE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BCODEID = value.bcodeid;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PROMOTION = 0;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCHSCHEME = null;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALLSCHEME = null;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MRP = value.MRP;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTMRP = value.MRP;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ISVAT = value.ISVAT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MENUCODE = value.MENUCODE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ITEMDESC = value.DESCA;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE = value.MCODE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GSTRATE_ONLYFORSHOWING = value.GST;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GSTRATE = value.GST;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].WEIGHT = value.GWEIGHT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Mcat = value.MCAT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].NWEIGHT = value.NWEIGHT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype = value.PTYPE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultSellUnit = userProfile.DEFAULTBILLUNIT ? userProfile.DEFAULTBILLUNIT : value.DefaultSellUnit;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultPurchaseUnit = value.DefaultPurchaseUnit;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].NOOFSERIALITEMHAS = value.NOOFSERIALITEMHAS;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].INDDISCOUNTRATE = value.DISRATE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DigitsAfterDecimal = value.DigitsAfterDecimal;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GENERIC = value.GENERIC;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEID = value.SLABRATEID;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CARTONCONFACTOR = 1;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].IsTaxInclusive = value.InclusiveOfTax;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].INDCESS_PER = value.CESS;






            if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype == ITEMTYPE.MATRIXITEM && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance)) {
                this.masterService.masterGetmethod(`/getItemWiseVariantAttributes?mcode=${this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE}`).subscribe((res) => {
                    if (res.status == "ok" && res.result && res.result.length) {
                        this.matrixItemAtrribute = res.result;
                        this.matrixitemgrid.show();
                    }
                })
            }


            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote ||
                this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
                this._trnMainService.TrnMainObj.ISMANUALRETURN = value.ISMANUALRETURN

                if (value.ISMANUALRETURN) {
                    this._trnMainService.getPricingOfItem(this.activerowIndex);
                } else {
                    this.masterService
                        .masterGetmethod(
                            "/getAltUnitsOfItem/" +
                            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE
                        )
                        .subscribe(
                            res => {
                                if (res.status == "ok") {
                                    this.assignValueForReturnModeInProd(value);
                                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits = JSON.parse(res.result);
                                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT.toUpperCase() == value.UNIT.toUpperCase())[0];
                                    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
                                        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultSellUnit) {
                                            let altunit = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT.toLowerCase() == this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultSellUnit.toLowerCase())[0];
                                            if (altunit != null) {
                                                this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj = altunit;
                                            }
                                        }
                                    }
                                    this.masterService.focusAnyControl("quantity" + this.activerowIndex);
                                }
                            },
                            error => {
                            }
                        );
                }

            }
            else {
                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockSettlement || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue) {
                    this.masterService
                        .masterGetmethod(
                            "/getAltUnitsOfItem/" +
                            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE
                        )
                        .subscribe(
                            res => {
                                if (res.status == "ok") {
                                    if (
                                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product == null
                                    ) {
                                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product = <Product>{};
                                    }
                                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.MCODE = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE;
                                    this._trnMainService.TrnMainObj.ProdList[
                                        this.activerowIndex
                                    ].Product.AlternateUnits = JSON.parse(res.result);

                                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
                                    let rate1 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE;

                                    let rate2 = 0;
                                    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNote || this.activeurlpath == "add-debitnote-itembase") {
                                        rate2 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SPRICE;
                                    } else {
                                        rate2 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PRATE;
                                    }
                                    this._trnMainService.setunit(
                                        rate1,
                                        rate2,
                                        this.activerowIndex,
                                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj
                                    );
                                } else {
                                }
                            },
                            error => {
                            }
                        );
                } else {
                    this._trnMainService.getPricingOfItem(this.activerowIndex);

                }
            }
            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
                var elmnt = document.getElementById("quantity" + this.activerowIndex);
                elmnt.scrollIntoView();
                setTimeout(() => this.masterService.focusAnyControl("quantity" + this.activerowIndex));
            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNote || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn) {
                if (document.getElementById("batch" + this.activerowIndex) != null) {
                    setTimeout(() => {
                        this.masterService.focusAnyControl('batch' + this.activerowIndex);
                    }, 0);
                }
                else {
                    setTimeout(() => {
                        this.masterService.focusAnyControl("quantity" + this.activerowIndex)
                    }, 0);
                }
            }
            else {
                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
                    if (this._trnMainService.TrnMainObj.REFBILL == null || this._trnMainService.TrnMainObj.REFBILL == "" || this._trnMainService.TrnMainObj.REFBILL == undefined) {
                        this.BatchTabClick(this.activerowIndex, "BATCH_HEADER");
                    } else {
                        document.getElementById('quantity' + this.activerowIndex).focus();
                    }
                } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote) {
                    if (this._trnMainService.TrnMainObj.ISMANUALRETURN) {
                        this.BatchTabClick(this.activerowIndex, "BATCH_HEADER");
                    } else {
                        document.getElementById('quantity' + this.activerowIndex).focus();
                    }
                }
                else {
                    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder) {
                        setTimeout(() => {
                            this.masterService.focusAnyControl('quantity' + this.activerowIndex);
                        }, 10);
                    } else {
                        if (document.getElementById("batch" + this.activerowIndex) != null) {
                            this.masterService.focusAnyControl('batch' + this.activerowIndex);
                            this.BatchTabClick(this.activerowIndex, "BATCH_HEADER");
                        }
                        else {

                            this.BatchTabClick(this.activerowIndex, "BATCH_HEADER");
                            setTimeout(() => {
                                this.masterService.focusAnyControl('quantity' + this.activerowIndex);
                            }, 10);
                        }
                    }
                }
            }



            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.SalesOrder || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
                if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEID != null && this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEID != "" && this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEID != undefined) {
                    this.masterService.masterGetmethod_NEW(`/getSlabDetails?id=${this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEID}`).subscribe((res) => {
                        if (res.status == "ok") {
                            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEDETAILS = res.result.TaxSlabList;
                        } else {
                            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEDETAILS = [];
                        }
                    }, error => {
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEDETAILS = [];
                    })
                }
            }


        }
    }


    dblClickPopupScheme(scheme) {
        this.masterService.PlistTitle = "";
        this._trnMainService.TrnMainObj.ProdList[
            this.activerowIndex
        ].ALLSCHEME = scheme;
        this.assignedSchemeToBatch();
        this.masterService.PlistTitle = "batchlist";
        if (document.getElementById("batch" + this.activerowIndex) != null) {
            document.getElementById("batch" + this.activerowIndex).focus();
            this.BatchTabClick(this.activerowIndex, "BATCH_HEADER");
        }
        else {
            document.getElementById('quantity' + this.activerowIndex).focus();
        }
    }

    discEnterClicked(i, header: string) {
        this.focusControlFromUserSetting(header, i);
    }
    listObj: any = <any>{};

    discRateEnterClicked(i, header: string) {
        this.focusControlFromUserSetting(header, i);
    }

    checkValidation(i) {
        if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) && this._trnMainService.TrnMainObj.INVOICETYPE == "EDI") {
            return;
        }
        if (this._trnMainService.TrnMainObj.ProdList[i].Quantity <= 0) {
            alert("Please Provide valid Quantity");
            document.getElementById("quantity" + this.activerowIndex).focus();
            return;
        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Sales || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.StockIssue || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice
            || this.activeurlpath == 'add-creditnote-itembase') {
            if (
                ((this._trnMainService.TrnMainObj.ProdList[i].Quantity * this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR) == 0 ? 1 : this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR) >
                    this._trnMainService.TrnMainObj.ProdList[i].STOCK) && (this._trnMainService.TrnMainObj.ProdList[i].STOCK > 0)) {
                this.alertService.error("Quantity Exceed the available Stock.");
                document.getElementById("quantity" + this.activerowIndex).focus();
                return;
            }
        } else if (this.activeurlpath == 'add-debitnote-itembase') {
            if (
                (this._trnMainService.TrnMainObj.ProdList[i].RealQty >
                    this._trnMainService.TrnMainObj.ProdList[i].STOCK) && (this._trnMainService.TrnMainObj.ProdList[i].STOCK > 0)) {
                this.alertService.error("Quantity Exceed the available Stock.");
                document.getElementById("quantity" + this.activerowIndex).focus();
                return;
            }
        }

        this._trnMainService.ReCalculateBillWithNormal();

    }



    onDblClickBatchPopMUltipleSelection(batchdetail: any) {


        if (batchdetail.hasOwnProperty('type') && batchdetail.type == "MULTIPLE_BATCH_SELECTION" && this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype == 6) {
            let i: number = 0;
            let cloneProdDetail = Object.assign({}, this._trnMainService.TrnMainObj.ProdList[this.activerowIndex]);
            while (i < batchdetail.NOOFQTY) {
                if (i == 0) {
                    this.returnBatchForSerialItems(batchdetail.batchList[i]);
                } else {
                    this._trnMainService.addRow();
                    this.activerowIndex++;
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex] = Object.assign({}, cloneProdDetail);
                    this.returnBatchForSerialItems(batchdetail.batchList[i]);
                }
                i++;
            }
            this._trnMainService.addRow();
            this.activerowIndex++;
            setTimeout(() => {
                document.getElementById("menucode" + this.activerowIndex).focus();
            }, 10);
        } else {
            this.returnBatch(batchdetail)
        }
    }




    returnBatchForSerialItems(value) {

        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE == null ||
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE == undefined) {
            this.masterService.PlistTitle = "";
        }
        this.tableValidation = true;

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MRP = value.MRP;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTMRP = value.MRP;
        this._trnMainService.assignBatchToActiveProdRow(value, this.activerowIndex);
        this.masterService.PlistTitle = "";

        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product == null) { this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product = <any>{ MCODE: this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE }; }

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
        let rate1 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE;
        let rate2 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PRATE;


        this._trnMainService.setunit(rate1, rate2, this.activerowIndex, this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj);
        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR == null) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR = 1;
        }
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Quantity = 1
        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR == null) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR = 1;
        }
        this._trnMainService.RealQuantitySet(this.activerowIndex, this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR);
        this._trnMainService.ReCalculateBillWithNormal();




    }






    returnBatch(value) {

        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE == null ||
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE == undefined) {
            this.masterService.PlistTitle = "";
        }
        this.tableValidation = true;

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MRP = value.MRP;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTMRP = value.MRP;
        this._trnMainService.assignBatchToActiveProdRow(value, this.activerowIndex);
        this.masterService.PlistTitle = "";


        this._trnMainService.TrnMainObj.AdditionalObj.MARGIN_ACTION = value.MARGIN_ACTION;
        this._trnMainService.TrnMainObj.AdditionalObj.MARGIN_PERCENT = value.MARGIN_PERCENT;




        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype == ITEMTYPE.MATRIXITEM) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST = typeof value.VARIANTDETAIL === "object" ? value.VARIANTDETAIL : JSON.parse(value.VARIANTDETAIL);
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTDESCA = "";
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BC = value.BCODE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SELECTEDITEM.BARCODE = value.BCODE;;

            for (var attribute in this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST) {

                if (['QTY', 'PRATE', 'MRP', 'SRATE', 'BARCODE', 'BATCH'].indexOf(attribute) == -1) {
                    let name = "";
                    if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST[attribute] != null) {
                        name = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST[attribute].NAME;
                    }
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTDESCA = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTDESCA + `<b>${this._trnMainService.getVariantNameFromId(attribute)}</b>:${name} <br/>`
                }
            }
        }



        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product == null) { this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product = <any>{ MCODE: this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE }; }

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultSellUnit) {
                let altunit = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT.toLowerCase() == this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultSellUnit.toLowerCase())[0];
                if (altunit != null) {
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj = altunit;
                }
            }
        }
        let rate1 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE;
        let rate2 = 0;
        if (
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt ||
            this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance
        ) {
            rate2 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SPRICE;
        } else {
            rate2 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PRATE;
        }

        this._trnMainService.setunit(
            rate1,
            rate2,
            this.activerowIndex,
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj
        );
        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR == null) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR = 1;
        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Quantity = this.AppSettings.DefaulQtyForBarcodeBilling;
            if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR == null) {
                this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR = 1;
            }
        }
        this._trnMainService.RealQuantitySet(this.activerowIndex, this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR);
        this._trnMainService.ReCalculateBillWithNormal();

        //scheme 
        this._trnMainService.getSchemeAndRecalcualte(this.activerowIndex);





        var elmnt = document.getElementById("quantity" + this.activerowIndex);
        elmnt.scrollIntoView();
        document.getElementById("quantity" + this.activerowIndex).focus();


    }

    dblClickPopupBatch(value) {
        this.returnBatch(value);
    }

    ReturnQuantityChangeEvent(i) {
        let returnQty = this._trnMainService.TrnMainObj.ProdList[i].AltQty;
        if (this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR == null) {
            this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR = 1;
        }
        let qty = this._trnMainService.TrnMainObj.ProdList[i].Quantity;
        let recQty = this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantityMR;
        this._trnMainService.TrnMainObj.ProdList[i].Quantity = recQty - returnQty;

        this._trnMainService.RealQuantitySet(i, this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);
        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.TrnMainObj.ProdList[i].REALQTY_IN = (this.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantityMR) + this.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].FreeQuantity));
        this._trnMainService.TrnMainObj.ProdList[i].ALTQTY_IN = this.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantityMR) + this.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].FreeQuantity);

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
    ReceivedQuantityChangeEvent(i) {
        // this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantity=  this._trnMainService.TrnMainObj.ProdList[i].Quantity;
    }

    QuantityChangeEvent(i) {

        this.activerowIndex = i;

        if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].Quantity) == 0) {
            this._trnMainService.TrnMainObj.ProdList[i].FreeQuantity = 0;
        }


        if (this.activeurlpath == "add-creditnote-itembase" && !this._trnMainService.TrnMainObj.ISMANUALRETURN) {
            if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].Quantity) > this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].STOCK)) {
                this._trnMainService.TrnMainObj.ProdList[i].Quantity = this._trnMainService.TrnMainObj.ProdList[i].STOCK;
                this.alertService.warning("Quantity exceeds than total billed quantity");

            }
        }
        if (this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR == null) {
            this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR = 1;
        }
        this._trnMainService.RealQuantitySet(i, this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR);
        this._trnMainService.ReCalculateBillWithNormal();
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            this._trnMainService.getSchemeAndRecalcualte(i);

        }
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt) {
            // this._trnMainService.TrnMainObj.ProdList[i].ReturnQuantity=0;
            //     this._trnMainService.TrnMainObj.ProdList[i].Quantity=this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantity;
            //     this._trnMainService.TrnMainObj.ProdList[i].Quantity=this._trnMainService.TrnMainObj.ProdList[i].ReceivedQuantity-this._trnMainService.TrnMainObj.ProdList[i].ReturnQuantity;
            //     //this._trnMainService.TrnMainObj.ProdList[i].Quantity=this._trnMainService.TrnMainObj.ProdList[i].aQuantity+this._trnMainService.TrnMainObj.ProdList[i].rQuantity;
        }
    }


    IndDiscountRateChangeEvent(i) {

        if (this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS) {
            this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNT = 0;
            this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT = 0
            if (this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE < 0) {
                this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE = 0;
            } else if (this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE > 100) {
                this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE = 100;
            }


            this._trnMainService.ReCalculateBillWithNormal();
        } else {
            this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE = 0;
            this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT = 0;
            this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNT = 0;

            this.alertService.error("Discount rights has been disabled for this user;", true);
            this._trnMainService.ReCalculateBillWithNormal();

        }

    }
    IndDiscountAmountChangeEvent(i, event) {

        if (this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS) {

            this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT = this._trnMainService.nullToZeroConverter(event.target.value);
            this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE = 0;
            if (this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT < 0) {
                this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT = 0;
            } else {
                let org_type = this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase();
                if ((org_type == "retailer" || org_type == "ak" || org_type == "ck" || org_type == "pms" || org_type == "gak")
                    && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DeliveryChallaan || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice)) {
                    if (this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT > this._trnMainService.TrnMainObj.ProdList[i].NETAMOUNT) {
                        this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT = this._trnMainService.TrnMainObj.ProdList[i].NETAMOUNT;
                    }
                }
                else {
                    if (this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT > this._trnMainService.TrnMainObj.ProdList[i].AMOUNT) {
                        this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT = this._trnMainService.TrnMainObj.ProdList[i].AMOUNT;
                    }
                }
            }
            this._trnMainService.ReCalculateBillWithNormal();
        }
        else {
            this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE = 0;
            this._trnMainService.TrnMainObj.ProdList[i].ALTINDDISCOUNT = 0;
            this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNT = 0;

            this.alertService.error("Discount rights has been disabled for this user", true);
            this._trnMainService.ReCalculateBillWithNormal();

        }

    }
    IndDiscountAmountChangeOfRetailerVATINCEvent(i, event) {
        this._trnMainService.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT = this._trnMainService.nullToZeroConverter(event.target.value);
        this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE = 0;
        this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNT = 0;
        if (this._trnMainService.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT < 0) {
            this._trnMainService.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT = 0;
        } else if (
            this._trnMainService.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT > this._trnMainService.TrnMainObj.ProdList[i].AMOUNT
        ) {
            this._trnMainService.TrnMainObj.ProdList[i].INDIVIDUALDISCOUNT_WITHVAT = this._trnMainService.TrnMainObj.ProdList[i].AMOUNT;
        }

        this._trnMainService.ReCalculateBillWithNormal();
    }
    discountRateToAmnt() { }
    FocusAfterQuantity(i, header: string) {

        if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].Quantity) < 0) {

            this.masterService.focusAnyControl("quantity" + this.activerowIndex);
            return false;
        }


        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.TrnMainObj.ProdList[i].Quantity > 0) {
            this._trnMainService.getSchemeAndRecalcualte(i);
        }
        this.focusControlFromUserSetting(header, i);

    }
    FocusAfterFreeQuantity(i, header: string) {
        this.focusControlFromUserSetting(header, i);
    }
    QuantityEventClick(i, header: string) {
        this.activerowIndex = i;
        this.FocusAfterQuantity(i, header);

    }
    FreeQuantityEventClick(i, header: string) {
        this.activerowIndex = i;
        this.FocusAfterFreeQuantity(i, header);

    }
    canAddRow() {
        try {
            return { status: "ok" };
        } catch (ex) {
            return { status: "error", error: ex };
        }
    }
    isTableRowSelected(i) {
        return this.activerowIndex == i;
    }
    scroll(event: KeyboardEvent) {
        event.preventDefault();
        if (event.keyCode === 13) {
        } else if (event.keyCode === 38) {
        } else return;
    }
    deleteRow() {
        if (confirm("Are you sure u you want to delete the Row?")) {
            this._trnMainService.TrnMainObj.ProdList.splice(this.activerowIndex, 1);
            if (this._trnMainService.TrnMainObj.ProdList.length == 0) {
                this._trnMainService.addRow();
            }
            //  this._trnMainService.ReCalculateBill();
            this._trnMainService.ReCalculateBillWithNormal();
            //  let aa = this._trnMainService.TrnMainObj.ProdList.length - 1;
            let aa = this.activerowIndex;
            setTimeout(() => {
                if (document.getElementById("menucode" + aa) != null) {
                    document.getElementById("menucode" + aa).focus();
                }
                else {
                    if (document.getElementById("remarks" + aa) != null) {
                        document.getElementById("remarks" + aa).focus();
                    }
                }
            }, 500);


        }
    }
    restrictPercentageNumeric(value, i) {
        try {
            if (parseFloat(value) < 0 || isNaN(parseFloat(value))) {
                this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE = 0;
            } else if (parseFloat(value) > 100 || isNaN(parseFloat(value))) {
                this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNTRATE = 100;
            }
        } catch (e) {
        }
    }
    restrictDisAmntNumeric(value, i) {
        try {
            if (parseFloat(value) < 0 || isNaN(parseFloat(value))) {
                this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNT = 0;
            } else if (
                parseFloat(value) > this._trnMainService.TrnMainObj.ProdList[i].AMOUNT
            ) {
                this._trnMainService.TrnMainObj.ProdList[i].INDDISCOUNT = this._trnMainService.TrnMainObj.ProdList[i].AMOUNT;
            }

        } catch (e) {
        }
    }
    SelectUnit(i) {
        this.activerowIndex = i;
        let rate = this._trnMainService.TrnMainObj.ProdList[i].RATE;
        let rate2 = 0;
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNote || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder) {
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].SPRICE;
        }
        else {
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;
        }
        this._trnMainService.setunit(rate, rate2, this.activerowIndex, this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj);
        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.getSchemeAndRecalcualte(i);


    }


    schemepopupClosed() {
        this.schemeList = [];
        document.getElementById("showScheme").style.display = "none";
        if (document.getElementById("batch" + this.activerowIndex) != null) {
            document.getElementById("batch" + this.activerowIndex).focus();
            this.BatchTabClick(this.activerowIndex, "BATCH_HEADER");
        }
        else {
            document.getElementById('quantity' + this.activerowIndex).focus();
        }
    }

    returnMultiBatchScheme(listValue) {
        for (var v of listValue) {
            this._trnMainService.assignBatchToActiveProdRow(v, this.activerowIndex);
        }
    }
    flatDisChange(value) {
        this.flatDiscountValue = value;
        this.flatDiscountAssign();
    }
    flatDiscountUnitChange(value) {
        this.radioFlatDiscount = value;
        this.flatDiscountAssign();
    }
    flatDiscountAssign() {
        if (
            this.radioFlatDiscount == "percent" &&
            (this.flatDiscountValue < 0 || this.flatDiscountValue > 100)
        ) {
            alert("Invalid Flat Discount Percent");
            return;
        }
        if (this.radioFlatDiscount == "amount") {
            this._trnMainService.TrnMainObj.TOTALFLATDISCOUNT = this.flatDiscountValue;
        } else {
            let totalAmountWithIndDiscount = this._trnMainService.TrnMainObj.ProdList.reduce(
                (sum, x) =>
                    sum +
                    (this._trnMainService.nullToZeroConverter(x.AMOUNT) -
                        this._trnMainService.nullToZeroConverter(x.INDDISCOUNT)),
                0
            );
            this._trnMainService.TrnMainObj.TOTALFLATDISCOUNT =
                (this.flatDiscountValue * totalAmountWithIndDiscount) / 100;
        }
        // this._trnMainService.ReCalculateBill();
        this._trnMainService.ReCalculateBillWithNormal();
    }

    TotalClick() {
        this.TotalBill.emit();
    }
    RemarksEnterCommand(event, i, header: string) {
        event.preventDefault();
        this.checkValidation(i);
        this.focusControlFromUserSetting(header, i);
        return false;
    }
    dblClickPopupParty(value) {
        if (value == null) return;
        if (
            this._trnMainService.TrnMainObj.VoucherType ==
            VoucherTypeEnum.OpeningStockBalance
        ) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TRNAC =
                value.ACID;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ACNAME =
                value.ACNAME;
            document.getElementById("remarks" + this.activerowIndex).focus();
            // this._trnMainService.TrnMainObj.ProdList[this.activerowIndex]=value.ACID;
        } else {
            this._trnMainService.TrnMainObj.PARAC = value.ACID;
            this._trnMainService.TrnMainObj.BILLTO = value.ACNAME;
            this._trnMainService.TrnMainObj.BILLTOADD = value.ADDRESS;
            this._trnMainService.TrnMainObj.BILLTOTEL = value.VATNO;
            this._trnMainService.TrnMainObj.BILLTOMOB = value.MOBILE;
            if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
                this._trnMainService.TrnMainObj.AdditionalObj = <TrnMain_AdditionalInfo>{};
            }
            this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = value.PSTYPE;
        }
        this.partypopupClosed();
    }
    partypopupClosed() {
        this.masterService.PlistTitle = "";
        if (
            this._trnMainService.TrnMainObj.VoucherType ==
            VoucherTypeEnum.OpeningStockBalance
        ) {
            document.getElementById("remarks" + this.activerowIndex).focus();
        }
    }
    SupplierEnterClicked(event) {
        event.preventDefault();

        this.genericGridSupplierPopup.show();
        return false;
    }
    onKeydownPreventEdit(event) {
        if (event.key === "Enter" || event.key === "Tab") { }
        else {
            event.preventDefault();
        }
    }


    batchKeyDownEvent() {

        return false;
    }
    popUpBatchList() { }

    setMFGEXPDATE(tag, value, index) {




        if (tag == "MFGDATE") {
            if (this.masterService.ValidateDate(value)) {
                this._trnMainService.TrnMainObj.ProdList[index].MFGDATE = this.masterService.changeIMsDateToDate(value);
            } else {
                this.alertService.error(`Invalid MFG date for product ${this._trnMainService.TrnMainObj.ProdList[index].ITEMDESC}at row ${index}`);
            }
            if (this._trnMainService.TrnMainObj.ProdList.some(x => new Date(x.MFGDATE) > new Date() && x.MCODE != null && x.MFGDATE != null)) {
                this.alertService.warning("Invalid Manufacture Date Item Detected..Please Review the list...");
                return false;
            }



        } else if (tag == "EXPDATE") {
            if (this.masterService.ValidateDate(value)) {
                this._trnMainService.TrnMainObj.ProdList[index].EXPDATE = this.masterService.changeIMsDateToDate(value);
            } else {
                this.alertService.error(`Invalid MFG date for product ${this._trnMainService.TrnMainObj.ProdList[index].ITEMDESC}at row ${index}`);
            }
            let expitem = this._trnMainService.TrnMainObj.ProdList.filter(x => new Date(x.EXPDATE) < new Date(new Date().setDate(new Date().getDate() - 1)) && x.MCODE != null && x.EXPDATE != null)[0];

            if ((this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote && this._trnMainService.AppSettings.ENABLEEXPIREDRETURNINPURCHASE)) {

            } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote && this._trnMainService.AppSettings.ENABLEEXPIREDRETURNINSALES == true) {

            } else {
                if (expitem != null) {
                    this.alertService.warning("Expired Item Detected with code : " + expitem.MCODE + "..Please Review the list...");
                    return false;
                }
            }
        }
    }

    getMFGEXPDATE(tag, index) {

        if (tag == "MFGDATE") {
            if (this._trnMainService.TrnMainObj.ProdList[index].MFGDATE) {
                return this.masterService.customDateFormate(this._trnMainService.TrnMainObj.ProdList[index].MFGDATE.toString());
            }
        } else if (tag == "EXPDATE") {
            if (this._trnMainService.TrnMainObj.ProdList[index].EXPDATE) {
                return this.masterService.customDateFormate(this._trnMainService.TrnMainObj.ProdList[index].EXPDATE.toString());
            }
        }
    }

    MFGDateEnterEvent(index, header: string) {
        this.focusControlFromUserSetting(header, index);
    }

    expDateEnterEvent(index, header: string) {
        this.focusControlFromUserSetting(header, index);
    }
    UnitEnterEventClick(i, header: string) {
        this.focusControlFromUserSetting(header, i);

    }
    PrateEnterEvent(i, header: string) {
        this.focusControlFromUserSetting(header, i)
    }
    SrateEnterEvent(i, header: string) {
        this.focusControlFromUserSetting(header, i);
    }
    prateEnterEvent(i, header: string) {
        this.focusControlFromUserSetting(header, i);
    }
    mrpEnterEvent(i, header: string) {
        this.focusControlFromUserSetting(header, i)
    }
    setItemPopupUrl() {

        this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "ITEMS",
            apiEndpoints: `/getMenuitemWithStockPagedList/${this.showStockedQuantityOnly}/${'all'}/${'NO'}/${this._trnMainService.userProfile.userWarehouse}`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'DESCA',
                    title: 'DESCRIPTION',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'MENUCODE',
                    title: 'ITEM CODE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'STOCK',
                    title: 'STOCK',
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: 'MRP',
                    title: 'MRP',
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: 'BARCODE',
                    title: 'BARCODE',
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: 'Rack',
                    title: 'Rack',
                    hidden: this._trnMainService.AppSettings.CompanyNature == 1 ? false : true,
                    noSearch: this._trnMainService.AppSettings.CompanyNature == 1 ? false : true
                }
            ]
        });
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
                    key: "EMAIL",
                    title: "EMAIL",
                    hidden: false,
                    noSearch: false
                }
            ]
        });
        this.gridPopupSettingsForbatchfilterGrid = {
            title: "Batch List",
            apiEndpoints: `/getBatchPagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "MCODE",
                    title: "MCODE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "BATCH",
                    title: " BATCH",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "MFGDATE",
                    title: " MFGDATE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "EXPIRY",
                    title: " EXPIRY",
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
                    key: "PRATE",
                    title: "PRATE",
                    hidden: false,
                    noSearch: false
                }
            ]
        };






        this.gridPopupSettingsForSalesman = {
            title: "Salesman",
            apiEndpoints: `/getSalesmanPagedList/0`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "NAME",
                    title: "NAME",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "COMMISION",
                    title: "COMMISION %",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "MOBILE",
                    title: "MOBILE",
                    hidden: false,
                    noSearch: false
                }
            ]
        };

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
                    key: "rate",
                    title: "Price",
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

    assignValueForReturnModeInProd(prod) {
        let userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SNO = prod.SNO;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TOTALDISCOUNTINRETRUN = prod.INDDISCOUNT;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PRATE = prod.PRATE;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].REALRATE =
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTRATE =
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE = prod.RATE;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SPRICE = prod.SPRICE;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ORIGINALTRANRATE = prod.ORIGINALTRANRATE;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALT_ORIGINALTRANRATE = prod.ORIGINALTRANRATE;

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCH = prod.BATCH;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MFGDATE = prod.MFGDATE ? (prod.MFGDATE).toString().substring(0, 10) : '';
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].EXPDATE = prod.EXPDATE ? (prod.EXPDATE).toString().substring(0, 10) : '';
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].UNIT = prod.UNIT;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].STOCK = prod.STOCK;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Quantity = prod.STOCK;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTINDDISCOUNT = 0;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].WAREHOUSE = prod.WAREHOUSE;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].INDDISCOUNTRATE = 0;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].INDDISCOUNT = 0;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].INDDISCOUNTRATE = 0;

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PrimaryDiscount = prod.PrimaryDiscount;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SecondaryDiscount = prod.SecondaryDiscount;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].LiquiditionDiscount = prod.LiquiditionDiscount;
        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product == null) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product = <Product>{};
        }
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.MCODE = prod.MCODE;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR = 1;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNIT = prod.UNIT;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].UNIT = prod.UNIT;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype = prod.ptype;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultSellUnit = userProfile.DEFAULTBILLUNIT ? userProfile.DEFAULTBILLUNIT : prod.UNIT;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST = prod.VARIANTDETAIL == null ? prod.VARIANTDETAIL : JSON.parse(prod.VARIANTDETAIL);

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTDESCA = "";
        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype == ITEMTYPE.MATRIXITEM && this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST != null) {
            for (var attribute in this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST) {
                if (['QTY', 'PRATE', 'MRP', 'SRATE', 'BARCODE', 'BATCH'].indexOf(attribute) == -1 && this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST[attribute] != null) {
                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTDESCA = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTDESCA + `<b>${this._trnMainService.getVariantNameFromId(attribute)}</b>:${this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].VARIANTLIST[attribute].NAME} <br/>`

                }
            }
        }
        this._trnMainService.RealQuantitySet(this.activerowIndex, 1);
        this._trnMainService.ReCalculateBillWithNormal();
    }

    BarcodeClick(index) {
        this.activerowIndex = index;
        this._trnMainService.batchlist = [];

    }
    MRPChangeEvent(i) {
        this._trnMainService.TrnMainObj.ProdList[i].MRP = this._trnMainService.TrnMainObj.ProdList[i].ALTMRP / this._trnMainService.TrnMainObj.ProdList[i].CONFACTOR;
        this._trnMainService.getPricingOfItem(i, this._trnMainService.TrnMainObj.ProdList[i].BATCH, false);

    }
    BarcodeKeyDownEvent(event, index) {
    }
    rateChangeEvent(i) {
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTRATE / this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR;
        this._trnMainService.ReCalculateBillWithNormal();
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            this._trnMainService.getSchemeAndRecalcualte(i);


        }
    }
    tranrateChangeEvent(i) {

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTRATE / this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR;
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase) {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ORIGINALTRANRATE = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE;
        }
        this._trnMainService.ReCalculateBillWithNormal();
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            this._trnMainService.getSchemeAndRecalcualte(i);


        }

    }
    isPIAutoLoad(): boolean {
        if (this._trnMainService.TrnMainObj.REFBILL != null && this._trnMainService.TrnMainObj.REFBILL != '' && this._trnMainService.TrnMainObj.Mode == "EDIT" && this._trnMainService.TrnMainObj.VoucherPrefix == "PI") {
            return true;
        }
        return false;
    }

    BarcodekeyEvent(event, i) {
        this.activerowIndex = i;
        if (this._trnMainService.TrnMainObj.ProdList[i].BC == null || this._trnMainService.TrnMainObj.ProdList[i].BC == "" || this._trnMainService.TrnMainObj.ProdList[i].BC == undefined) {
            this.masterService.focusAnyControl("menucode" + i);
        } else if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote) {
            this._trnMainService.barcodeEnterCommand(event, i);
        } else {
            let barcodedetail: BarcodeDifferentiatorModel = this.generateDetailsFromBarcode(this._trnMainService.TrnMainObj.ProdList[i].BC)
            if (barcodedetail.BARCODETYE == 0) {
                this._trnMainService.barcodeEnterCommand(event, i);
            } else if (barcodedetail.BARCODETYE == 1) {
                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
                    this._trnMainService.TrnMainObj.ProdList[i].BC = barcodedetail.BARCODE;
                    this._trnMainService.TrnMainObj.ProdList[i].MENUCODE = barcodedetail.MCODE;
                    this._trnMainService.TrnMainObj.ProdList[i].MCODE = barcodedetail.MCODE;
                    this._trnMainService.TrnMainObj.ProdList[i].Quantity = barcodedetail.QTY;
                    this.WeighableItemDetailFromBarcode(i, this._trnMainService.nullToZeroConverter(barcodedetail.QTY));
                }
            }
        }
    }
    // configBarCodeEnterCommand(event,configArr,index){
    //     event.preventDefault();
    //     var barcodeString  = this._trnMainService.TrnMainObj.ProdList[index].BC;
    //     var dataArr= [];
    //     var countint = 0;
    //     configArr.forEach(cp => {
    //     if(cp.VARIANTNAME==null || cp.VARIANTNAME == "" || cp.VARIANTNAME == undefined){
    //       var columnname = cp.DbColumn;
    //       var jsDummy;
    //       var substrbar = barcodeString.substr(countint,cp.ParaMaxLength);
    //       if(columnname=="MCODE"){
    //        jsDummy = {
    //         "MCODE" : substrbar
    //       }
    //     }
    //     if(columnname == "BATCHCODE"){
    //       jsDummy = {
    //         "BATCHCODE" : substrbar
    //       }
    //     }
    //       countint = countint+cp.ParaMaxLength;
    //       dataArr.push(jsDummy);

    //      // cp.dbColumn = barcodeString.substring(0,cp.ParaMaxLength);
    //     }
    //    });
    //    var reqestObject = {
    //     "MCODE" : dataArr[0].MCODE,
    //     "BATCHCODE" : dataArr[1].BATCHCODE
    //    }
    //    try{
    //      //this.loadingService.show("Please wait...");
    //    this.masterService.masterPostmethod('/searchitemByBarCodeString',JSON.stringify(reqestObject)).subscribe(res=>{
    //     if(res.status == "ok"){
    //      // this.loadingService.hide();
    //       this._trnMainService.TrnMainObj.ProdList[index].MCODE = res.result[0].mcode;
    //            this.masterService.masterPostmethod("/getBatchListOfItem", {
    //                 mcode: this._trnMainService.TrnMainObj.ProdList[index].MCODE,
    //                 onlynonexpireditem: (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PerformaSalesInvoice ||
    //                     this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.QuotationInvoice) ? 1 : 0,
    //                 voucherprefix: this._trnMainService.TrnMainObj.VoucherAbbName,
    //                 warehouse: this._trnMainService.userProfile.userWarehouse,
    //                 PARTY_TYPE: this._trnMainService.TrnMainObj.PARTY_ORG_TYPE,
    //                 partyacid: this._trnMainService.TrnMainObj.PARAC == "" ? null : this._trnMainService.TrnMainObj.PARAC
    //             })
    //             .subscribe(
    //                 res => {
    //                     if (res.status == "ok") {
    //                         this._trnMainService.batchlist = JSON.parse(res.result);


    //                         if (this._trnMainService.batchlist.length == 1 && this._trnMainService.AppSettings.ENABLEBATCHPREVIEW == "DISABLESINGLEBATCHPREVIEW") {
    //                             this.returnBatch(this._trnMainService.batchlist[0]);
    //                         }
    //                         else {
    //                             this.masterService.PlistTitle = "batchList";
    //                         }

    //                     } else {
    //                         this.alertService.error("Error on getting BatchList Of Item ")
    //                     }
    //                 },
    //                 error => {
    //                     this.alertService.error(error)
    //                 }
    //             );
    //     }else{
    //       //this.loadingService.hide();
    //       this.alertService.error("Invalid Bar Code");
    //     }
    //    
    //    })
    //   }catch(e){
    //     //this.loadingService.hide();
    //   }
    // }


    adjustmentAmtChange() {
        this._trnMainService.ReCalculateBillWithNormal();
    }
    MFGHtmlFormat(date): string {
        try {

        }
        catch (error) {
            return "";
        }
    }

    enterKeyFocusShift(i, header: string, defaultFoucsId) {
        this.focusControlFromUserSetting(header, i, defaultFoucsId);
        this._trnMainService.ReCalculateBillWithNormal();
    }

    primarydiscountperClicked(i, header: string) {
        this.focusControlFromUserSetting(header, i);

    }
    secondarydiscountperClicked(i, header: string) {
        this.focusControlFromUserSetting(header, i);

    }

    liquiditiondiscountperClicked(i, header: string) {
        this.focusControlFromUserSetting(header, i);
    }
    adjustmentAmtrClicked(i, header: string) {
        this.focusControlFromUserSetting(header, i);
    }
    manulaSchemeDiscountChange(i) {
        let prices = this._trnMainService.TrnMainObj.ProdList[i].ProductRates;
        if (prices == null) { return; }
        prices.PrimaryDiscount = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].PrimaryDiscountPercent) / 100;
        prices.SecondaryDiscount = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].SecondaryDiscountPercent) / 100;
        prices.LiquidationDiscount = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[i].LiquiditionDiscountPercent) / 100;
        prices.primaryDiscountAmount =
            this._trnMainService.nullToZeroConverter((prices.PrimaryDiscount *
                this._trnMainService.getRateForPrimaryDiscount(prices)).toFixed(5));

        prices.secondaryDiscountAmount = this._trnMainService.nullToZeroConverter((prices.SecondaryDiscount *
            this._trnMainService.getRetailerLandingForSecondaryDiscount(prices)).toFixed(5));
        prices.liquidationDiscountAmount = this._trnMainService.nullToZeroConverter((prices.LiquidationDiscount *
            this._trnMainService.getRetailerLandingForSecondaryDiscount(prices)).toFixed(5));
        this._trnMainService.AssignSellingPriceAndDiscounts_New(prices, i, "", 1, 0, "MANUAL");
        this.SelectUnit(i);
        this._trnMainService.ReCalculateBillWithNormal();
    }

    numberOnly(event): boolean {

        if (event.charCode == 101 || event.charCode == 46 || event.charCode == 69) {
            return false;
        }
        return true;
    }
    getItemDetailsForSales(selectedItem, i) {

        let itemcode = selectedItem;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex] = <TrnProd>{};
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TRANSACTIONMODE = "NEW";
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].inputMode = true;

        this.masterService.masterGetmethod("/getItemDetailsForSaleBilling/" + itemcode).subscribe
            (x => {
                if (x.status == "ok") {
                    if (this._trnMainService.TrnMainObj.ProdList[i].Product == null) { this._trnMainService.TrnMainObj.ProdList[i].Product = <any>{}; }
                    this._trnMainService.TrnMainObj.ProdList[i].Product.AlternateUnits = x.result.altunits;
                    this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[i].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
                    this._trnMainService.batchlist = x.result.batches;
                    if (this._trnMainService.batchlist != null) {

                        if (this._trnMainService.batchlist.length == 1 && this._trnMainService.AppSettings.ENABLEBATCHPREVIEW == "DISABLESINGLEBATCHPREVIEW") {
                            let selectedBatch = this._trnMainService.batchlist[0];
                            let prices = x.result.prices;
                            if (prices == null || prices == undefined) {
                                this.returnBatch(selectedBatch);
                            }
                            else {
                                this._trnMainService.AssignSellingPriceAndDiscounts_New(prices, i, "", 0, this._trnMainService.nullToZeroConverter(selectedBatch.COSTPRICE));
                                this._trnMainService.assignBatchToActiveProdRow(selectedBatch, i);
                                this.masterService.PlistTitle = "";
                                var elmnt = document.getElementById("quantity" + i);
                                elmnt.scrollIntoView();
                                document.getElementById("quantity" + i).focus();
                                let org_type = this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase();
                                if ((org_type == "retailer" || org_type == "ak" || org_type == "ck" || org_type == "pms" || org_type == "gak")
                                    && this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
                                    this._trnMainService.TrnMainObj.ProdList[i].Quantity = this.AppSettings.DefaulQtyForBarcodeBilling;
                                    if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR == null) {
                                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR = 1;
                                    }
                                    this._trnMainService.RealQuantitySet(i, this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR);
                                    this._trnMainService.ReCalculateBillWithNormal();
                                    this._trnMainService.getSchemeAndRecalcualte(i);


                                }
                            }
                        }
                        else {
                            this.masterService.PlistTitle = "batchList";
                        }
                    }
                } else {
                    this.alertService.error(x.result);
                }
            }, error => {
                this.alertService.error(error);
            }
            );
    }


    dblClickPopupSalesman(value) {
        if (value == null) return;

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMANID = value.SALESMANID;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMANNAME = value.NAME;
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMAN_COMMISION = value.COMMISION;

        this.focusControlFromUserSetting("SALESMAN_EDITABLE", this.activerowIndex)

    }
    purchaseTableHeight(): string {
        if (this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
            return '48vh';
        }
        else {
            return '79vh';
        }
    }
    clearSalesman(i, event) {

        if (event.key === "Backspace") {
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMANID = 0;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMANNAME = null;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMAN_COMMISION = 0;
        }


    }
    SalesmanEnterClicked(event) {
        event.preventDefault();

        if (this._trnMainService.TrnMainObj.ProdList != null && this._trnMainService.TrnMainObj.ProdList != []) {
            this.mappedMcode = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.MCODE;
            if (this.masterService.userSetting.COMPANYNATURE == 1) {
                this.gridPopupSettingsForSalesman.apiEndpoints = `/getSalesmanPagedList/${this.mappedMcode}`
            }
        }
        this.genericGridSalesmanPopup.show();
    }





    //#region Scheme Calculation    

    schemeFilterList: any[] = [];


    SrateTabEvent(index) {
        this.activerowIndex = index;
        this.genericGridItemPricesPopup.show(this._trnMainService.TrnMainObj.ProdList[index].MCODE);
    }

    dblClickPopupPartItemPrices(value) {
        if (value == null) return;

        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ORIGINALTRANRATE = value.rate;
        let confactor = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CONFACTOR);
        if (confactor == 0) { confactor = 1; }
        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALT_ORIGINALTRANRATE = value.rate * confactor;

        document.getElementById("remarks" + this.activerowIndex).focus();
        this._trnMainService.ReCalculateBillWithNormal();
    }
    //#endregion
    spacebarcommand(i) {
        //if space bar click then selling price change into tax inclusive rate for passi distributor
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {

            let netamount = this._trnMainService.TrnMainObj.ProdList[i].ALT_ORIGINALTRANRATE;
            this._trnMainService.TrnMainObj.ProdList[i].ALT_ORIGINALTRANRATE = netamount / (1 + (this._trnMainService.TrnMainObj.ProdList[i].GSTRATE / 100));
            this._trnMainService.ReCalculateBillWithNormal();
        }
    }



    setVariantData = (variantData): void => {
        let prodDetail = Object.assign({}, this._trnMainService.TrnMainObj.ProdList[this.activerowIndex]);
        let tmpProdList = [];
        for (var variant of variantData) {
            if (this.masterService.nullToZeroConverter(variant["QTY"]) > 0) {
                let barcode = "";
                prodDetail.VARIANTDESCA = "";
                for (var attribute in variant) {
                    if (['QTY', 'PRATE', 'MRP', 'SRATE', 'BARCODE', 'BATCH'].indexOf(attribute) == -1) {
                        if (variant[attribute] != null) {
                            barcode = barcode + variant[attribute].VARIANTBARCODE;

                            prodDetail.VARIANTDESCA = prodDetail.VARIANTDESCA + `<b>${this._trnMainService.getVariantNameFromId(attribute)}</b>:${variant[attribute].NAME} <br/>`
                        }
                    }
                }
                prodDetail.VARIANTLIST = variant;
                prodDetail.BCODEID =
                    prodDetail.BC = variant['BARCODE'] ? variant['BARCODE'] : (prodDetail.MCODE + barcode);
                prodDetail.BATCH = variant['BATCH'] ? variant['BATCH'] : (prodDetail.BATCH);
                prodDetail.Quantity = variant["QTY"];
                prodDetail.MRP = variant["MRP"];
                prodDetail.ALTMRP = variant["MRP"];
                prodDetail.REALQTY_IN = variant["QTY"];
                prodDetail.ALTQTY_IN = variant["QTY"];
                prodDetail.PRATE = variant["PRATE"];
                prodDetail.RATE = variant["PRATE"];
                prodDetail.REALRATE = variant["PRATE"];
                prodDetail.ALTRATE = variant["PRATE"];
                prodDetail.SPRICE = variant["SRATE"];
                prodDetail.SellingPrice = variant["SRATE"];
                prodDetail.ALTRATE2 = variant["SRATE"];
                tmpProdList.push(Object.assign({}, prodDetail));
            }


        }

        let prodListBeforeActiveRowIndex = this._trnMainService.TrnMainObj.ProdList.slice(0, this.activerowIndex);
        let prodListAfterActiveRowIndex = this._trnMainService.TrnMainObj.ProdList.slice(this.activerowIndex + 1);
        this._trnMainService.TrnMainObj.ProdList.splice(this.activerowIndex);

        for (var x of tmpProdList) {
            prodListBeforeActiveRowIndex.push(x);
        }
        for (var y of prodListAfterActiveRowIndex) {
            prodListBeforeActiveRowIndex.push(y);
        }
        this._trnMainService.TrnMainObj.ProdList = prodListBeforeActiveRowIndex;
        this._trnMainService.ReCalculateBillWithNormal();

    }




    dblClickbatchItemFromFilter(data) {
        let userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));



        this.masterService.PlistTitle = "";
        if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex] != null) {
            this._trnMainService.batchlist = [];
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SELECTEDITEM = data;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BC = data.BCODE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PROMOTION = 0;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCHSCHEME = null;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALLSCHEME = null;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MRP = data.MRP;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTMRP = data.MRP;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ISVAT = data.ISVAT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE = data.MCODE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MENUCODE = data.MENUCODE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ITEMDESC = data.DESCA;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE = data.MCODE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GSTRATE_ONLYFORSHOWING = data.GST;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GSTRATE = data.GST;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].WEIGHT = data.GWEIGHT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Mcat = data.MCAT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].NWEIGHT = data.NWEIGHT;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype = data.PTYPE;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultSellUnit = userProfile.DEFAULTBILLUNIT ? userProfile.DEFAULTBILLUNIT : data.DefaultSellUnit;
            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultPurchaseUnit = data.DefaultPurchaseUnit;


            if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype == ITEMTYPE.MATRIXITEM && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.OpeningStockBalance)) {
                this.masterService.masterGetmethod(`/getItemWiseVariantAttributes?mcode=${this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE}`).subscribe((res) => {
                    if (res.status == "ok" && res.result && res.result.length) {
                        this.matrixItemAtrribute = res.result;
                        this.matrixitemgrid.show();
                    }
                })
            }



            if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
                this.masterService
                    .masterGetmethod(
                        "/getAltUnitsOfItem/" +
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE
                    )
                    .subscribe(
                        res => {
                            if (res.status == "ok") {
                                if (
                                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product == null
                                ) {
                                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product = <Product>{};
                                }
                                this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.MCODE = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE;
                                this._trnMainService.TrnMainObj.ProdList[
                                    this.activerowIndex
                                ].Product.AlternateUnits = JSON.parse(res.result);

                                this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
                                let rate1 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].RATE;

                                let rate2 = 0;
                                if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.PurchaseOrder || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.MaterialReceipt || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.ReceiptNote || this.activeurlpath == "add-debitnote-itembase") {
                                    rate2 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SPRICE;
                                } else {
                                    rate2 = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PRATE;
                                }
                                this._trnMainService.setunit(
                                    rate1,
                                    rate2,
                                    this.activerowIndex,
                                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj
                                );
                                this.returnBatch(data);
                                setTimeout(() => {
                                    this.masterService.focusAnyControl("quantity" + this.activerowIndex);
                                }, 0);
                                if (this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
                                    this.masterService.getTopTransactionForSales(data.MCODE, this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
                                        if (data.status == 'ok') {
                                            this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TransactionHistory = data.result;
                                        }
                                    })
                                }
                            } else {
                            }
                        },
                        error => {
                        }
                    );



            }



        }

    }

    generateDetailsFromBarcode(barcode: string) {
        const regExp = new RegExp("^[a-zA-Z]*$", "g");
        if (barcode == null || barcode == "" || barcode == undefined) {
            this.alertService.error("Invalid Barcode.");
            return;
        }

        let barcodeDifferentiator = barcode.substring(0, 1);
        if (regExp.test(barcodeDifferentiator)) {
            if (barcode.length != 11) {
                this.alertService.error("Invalid Barcode Length.Please review your barcode.");
                return <BarcodeDifferentiatorModel>{
                    BARCODETYE: 99, //99 for invalid barcode from other system
                    BARCODE: barcode,
                    MCODE: null,
                    QTY: null
                };
            }
            let mcodeBlock = barcode.substring(1, 6);
            let quantityBlock = barcode.substr(6, 11);
            let quantityBeforeDecimalPart = quantityBlock.substring(0, 2);
            let quantityAfterDecimalPart = quantityBlock.substring(2, 5);
            let actualQuantity = parseFloat(quantityBeforeDecimalPart + '.' + quantityAfterDecimalPart);
            return <BarcodeDifferentiatorModel>{
                BARCODETYE: 1,
                BARCODE: barcode,
                MCODE: mcodeBlock,
                QTY: actualQuantity
            }
        } else {
            return <BarcodeDifferentiatorModel>{
                BARCODETYE: 0,
                BARCODE: barcode,
                MCODE: null,
                QTY: null
            }
        }

    }



    WeighableItemDetailFromBarcode(index, minstockLevel: number = 0) {

        this._trnMainService.prodActiveRowIndex = this.activerowIndex = index;

        if (this._trnMainService.TrnMainObj.VoucherPrefix == "" || this._trnMainService.TrnMainObj.VoucherPrefix == null) {
            this.alertService.warning("Please select the series"); return;
        }

        let params: any = <any>{};
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
            params = {
                supcode: 'all',
                showstockqty: 1,
                warehouse: this._trnMainService.userProfile.userWarehouse,
                mcode: this._trnMainService.TrnMainObj.ProdList[index].MENUCODE,
                prefix: this._trnMainService.TrnMainObj.VoucherAbbName,
                itemDivision: this._trnMainService.TrnMainObj.itemDivision,
                mcat: this._trnMainService.TrnMainObj.customerMCAT,
                minstockLevel: minstockLevel

            }

            this.masterService.masterPostmethod("/getItemDetailFromCode", params).subscribe((res) => {
                if (res.status == "ok") {
                    let value = res.result;
                    let rowWithFirstSalesman = this._trnMainService.TrnMainObj.ProdList.filter(x => x.SALESMANID != null && x.SALESMANID != 0)[0];
                    if (rowWithFirstSalesman != null) {
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMANID = rowWithFirstSalesman.SALESMANID;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMANNAME = rowWithFirstSalesman.SALESMANNAME;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SALESMAN_COMMISION = rowWithFirstSalesman.SALESMAN_COMMISION;
                    }


                    let userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
                    this.masterService.PlistTitle = "";
                    if (this._trnMainService.TrnMainObj.ProdList[this.activerowIndex] != null) {
                        this._trnMainService.batchlist = [];
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].SELECTEDITEM = value;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].PROMOTION = 0;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].BATCHSCHEME = null;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALLSCHEME = null;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MRP = value.MRP;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTMRP = value.MRP;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ISVAT = value.ISVAT;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ITEMDESC = value.DESCA;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE = value.MCODE;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GSTRATE_ONLYFORSHOWING = value.GST;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GSTRATE = value.GST;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].WEIGHT = value.GWEIGHT;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Mcat = value.MCAT;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].NWEIGHT = value.NWEIGHT;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Ptype = value.PTYPE;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultSellUnit = userProfile.DEFAULTBILLUNIT ? userProfile.DEFAULTBILLUNIT : value.DefaultSellUnit;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DefaultPurchaseUnit = value.DefaultPurchaseUnit;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].NOOFSERIALITEMHAS = value.NOOFSERIALITEMHAS;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].INDDISCOUNTRATE = value.DISRATE;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].DigitsAfterDecimal = value.DigitsAfterDecimal;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].GENERIC = value.GENERIC;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TaxSLABRATEID = value.SLABRATEID;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].CARTONCONFACTOR = 1;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].IsTaxInclusive = value.InclusiveOfTax;
                        this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product = <Product>{};

                        this.masterService.masterGetmethod("/getAltUnitsOfItem/" + this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE).subscribe(res => {
                            if (res.status == "ok") {
                                this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.MCODE = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].MCODE;
                                this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits = JSON.parse(res.result);
                                this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];
                                this.masterService.masterPostmethod("/getBatchListOfItem", {
                                    mcode: this._trnMainService.TrnMainObj.ProdList[index].MCODE,
                                    ptype: this._trnMainService.TrnMainObj.ProdList[index].Ptype,
                                    onlynonexpireditem: 1,
                                    voucherprefix: this._trnMainService.TrnMainObj.VoucherAbbName,
                                    warehouse: this._trnMainService.userProfile.userWarehouse,
                                    PARTY_TYPE: this._trnMainService.TrnMainObj.PARTY_ORG_TYPE,
                                    partyacid: this._trnMainService.TrnMainObj.PARAC == "" ? null : this._trnMainService.TrnMainObj.PARAC
                                }).subscribe(res => {
                                    if (res.status == "ok") {
                                        this._trnMainService.batchlist = JSON.parse(res.result);
                                        let totalQuantityToAdjust = this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].Quantity;
                                        let cloneProdDetail = Object.assign({}, this._trnMainService.TrnMainObj.ProdList[this.activerowIndex]);
                                        for (let i of this._trnMainService.batchlist.sort((x, y) => x.STOCK - y.STOCK)) {

                                            let adjustableQuantity = 0;
                                            if (totalQuantityToAdjust > 0) {

                                                if (totalQuantityToAdjust <= i.STOCK - i.HOLDINGSTOCK) {
                                                    adjustableQuantity = totalQuantityToAdjust;
                                                    this.addProdAndBatchDetail(adjustableQuantity, cloneProdDetail, i, this.activerowIndex);
                                                    break;
                                                }
                                                else {
                                                    if ((i.STOCK - i.HOLDINGSTOCK) > 0) {
                                                        adjustableQuantity = i.STOCK - i.HOLDINGSTOCK;
                                                        totalQuantityToAdjust = totalQuantityToAdjust - (i.STOCK - i.HOLDINGSTOCK);
                                                        this.addProdAndBatchDetail(adjustableQuantity, cloneProdDetail, i, this.activerowIndex);

                                                    }
                                                }
                                            }
                                        }

                                        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.ShowPurchaseHistory == true) {
                                            this.masterService.getTopTransactionForSales(value.MCODE, this._trnMainService.TrnMainObj.BILLTO).subscribe((data: any) => {
                                                if (data.status == 'ok') {
                                                    this._trnMainService.TrnMainObj.ProdList[this.activerowIndex].TransactionHistory = data.result;
                                                }
                                            })
                                        }

                                        setTimeout(() => {
                                            var elmnt = document.getElementById("menucode" + this.activerowIndex);
                                            elmnt.scrollIntoView();
                                            document.getElementById("menucode" + this.activerowIndex).focus();
                                        }, 10);

                                    } else {
                                        this.alertService.error("Error on getting BatchList Of Item ")
                                    }
                                },
                                    error => {
                                        this.alertService.error(error)
                                    }
                                );

                            } else {
                            }
                        },
                            error => {
                            }
                        );
                    }



                }
            });
        }

    }


    addProdAndBatchDetail(adjustableQuantity, cloneProdDetail, batchdetail, activerowIndex) {
        this._trnMainService.TrnMainObj.ProdList[activerowIndex] = Object.assign({}, cloneProdDetail);
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].Quantity = adjustableQuantity;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].MRP = batchdetail.MRP;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].ALTMRP = batchdetail.MRP;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].BATCH = batchdetail.BATCH;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].HOLDINGSTOCK = batchdetail.HOLDINGSTOCK;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].MFGDATE = batchdetail.MFGDATE == null ? "" : batchdetail.MFGDATE.toString().substring(0, 10);
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].EXPDATE = batchdetail.EXPIRY == null ? "" : batchdetail.EXPIRY.toString().substring(0, 10);
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].UNIT = batchdetail.UNIT;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].STOCK = batchdetail.STOCK;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].WAREHOUSE = batchdetail.WAREHOUSE;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].BATCHSCHEME = batchdetail.SCHEME;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].BATCHID = batchdetail.ID;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].IsTaxInclusive = batchdetail.InclusiveOfTax;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].REALRATE = this._trnMainService.TrnMainObj.ProdList[activerowIndex].ALTRATE = this._trnMainService.TrnMainObj.ProdList[activerowIndex].SPRICE = this._trnMainService.TrnMainObj.ProdList[activerowIndex].RATE = batchdetail.RATE_A;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].PRATE = batchdetail.PRATE;
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].SellingPrice = batchdetail.IN_RATE_A;
        batchdetail.BATCHSELLARATE = this._trnMainService.nullToZeroConverter(batchdetail.BATCHSELLARATE);
        if (this.AppSettings.ENABLEBATCHSRATE == false) {
            batchdetail.BATCHSELLARATE = 0;
        }
        if (batchdetail.InclusiveOfTax == 1) {
            this._trnMainService.TrnMainObj.ProdList[activerowIndex].ORIGINALTRANRATE = this._trnMainService.getCategoryWisePricelevelGstIncluded(batchdetail.BATCHSELLARATE > 0 ? batchdetail.BATCHSELLARATE : batchdetail.IN_RATE_A, batchdetail.IN_RATE_B, batchdetail.IN_RATE_C);
        }
        else {
            this._trnMainService.TrnMainObj.ProdList[activerowIndex].ORIGINALTRANRATE = this._trnMainService.getCategoryWisePricelevelGstIncluded(batchdetail.BATCHSELLARATE > 0 ? batchdetail.BATCHSELLARATE : batchdetail.RATE_A, batchdetail.RATE_B, batchdetail.RATE_C);;
        }

        let confactor = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[activerowIndex].CONFACTOR);
        this._trnMainService.TrnMainObj.ProdList[activerowIndex].ALT_ORIGINALTRANRATE = this._trnMainService.TrnMainObj.ProdList[activerowIndex].ORIGINALTRANRATE * confactor;
        if (this._trnMainService.TrnMainObj.Mode != null && this._trnMainService.TrnMainObj.Mode.toUpperCase() == 'EDIT' && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice)) {
            this._trnMainService.TrnMainObj.ProdList[activerowIndex].STOCK = batchdetail.STOCK + this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[activerowIndex].EDITEDBILLQUANTITY);
        }
        this._trnMainService.TrnMainObj.AdditionalObj.MARGIN_ACTION = batchdetail.MARGIN_ACTION;
        this._trnMainService.TrnMainObj.AdditionalObj.MARGIN_PERCENT = batchdetail.MARGIN_PERCENT
        if (this._trnMainService.TrnMainObj.ProdList[activerowIndex].DefaultSellUnit) {
            let altunit = this._trnMainService.TrnMainObj.ProdList[activerowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT.toLowerCase() == this._trnMainService.TrnMainObj.ProdList[activerowIndex].DefaultSellUnit.toLowerCase())[0];
            if (altunit != null) {
                this._trnMainService.TrnMainObj.ProdList[activerowIndex].ALTUNITObj = altunit;
            }
        }
        let rate1 = this._trnMainService.TrnMainObj.ProdList[activerowIndex].RATE;
        let rate2 = this._trnMainService.TrnMainObj.ProdList[activerowIndex].PRATE;
        this._trnMainService.setunit(rate1, rate2, activerowIndex, this._trnMainService.TrnMainObj.ProdList[activerowIndex].ALTUNITObj);
        if (this._trnMainService.TrnMainObj.ProdList[activerowIndex].CONFACTOR == null) {
            this._trnMainService.TrnMainObj.ProdList[activerowIndex].CONFACTOR = 1;
        }
        this._trnMainService.RealQuantitySet(activerowIndex, this._trnMainService.TrnMainObj.ProdList[activerowIndex].CONFACTOR);
        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.addRow();
        this.activerowIndex++;

    }


    focusControlFromUserSetting(header: string, index: number, defaultFocusId = null) {
        let focusObj = this._trnMainService.userwiseTransactionFormConf.filter(x => x.HEADERKEY == header)[0];
        if (focusObj == null) { focusObj = <any>{}; focusObj.FOCUSTO = defaultFocusId; }
        let focusControl = focusObj.FOCUSTO

        if (focusControl == "BREAKROW" || header == "REMARKS_HEADER") {

            if (this._trnMainService.TrnMainObj.ProdList[index].MCODE == null || this._trnMainService.TrnMainObj.ProdList[index].MCODE == "" || this._trnMainService.TrnMainObj.ProdList[index].MCODE == undefined) {
                return;
            }

            if (this._trnMainService.addRow() == false) {
                return;
            }

            this._trnMainService.TrnMainObj.ProdList[index].inputMode = false;
            var nextindex = index + 1;
            var elmnt = document.getElementById("sno" + index);
            elmnt.scrollIntoView();
            setTimeout(() => {
                this.masterService.focusAnyControlById([`barcodebilling${nextindex}`, `menucode${nextindex}`])
            }, 500);
        } else {

            let id = focusControl + index;
            let control = document.getElementById(id);
            if (control != null) {
                control.focus();
                control.click();
            } else {
                this.masterService.focusAnyControl("remarks" + index);
            }
            return false;

        }
    }




    @HostListener("document : keydown", ["$event"])
    handleKeyDownboardEvent($event: KeyboardEvent) {

        if ($event.code == "Enter") {

            if (this._trnMainService.showSchemeOffer) {
                this._trnMainService.showSchemeOffer = false;
                this._trnMainService.ReCalculateBillWithNormal();
                this.FocusAfterQuantity(this.activerowIndex, "QUANTITY_HEADER");
            }
        }

        if (($event.altKey || $event.metaKey)) {
            $event.preventDefault();
        }
        if (($event.altKey || $event.metaKey) && $event.key.toUpperCase() == "Z") {
            $event.preventDefault();
            if (this.voucherhistory && (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.Purchase || this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.DebitNote)) {
                this.voucherhistory.OnMiniMizeClick();
                return;
            }

        }
    }
    // physicalStockChangeEvent(index)
    // {
    //     let qty=this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].physicalStock)
    //     this._trnMainService.TrnMainObj.ProdList[index].Quantity=
    // }

}












@Pipe({
    name: 'active',
    pure: true
})
export class ActivePipe implements PipeTransform {
    constructor(public _trnMainService: TransactionService, private _ms: MasterRepo) {
    }




    transform(rowName: any, i: any): boolean {
        let active: boolean = this.ShowProductInsertTableColumns(rowName, i)


        return active;
    }


    ShowProductInsertTableColumns(rowName, i): boolean {
        var VT = this._trnMainService.TrnMainObj.VoucherType;

        let PROD = <any>{};
        if (this._trnMainService.TrnMainObj.ProdList != null) {
            PROD = this._trnMainService.TrnMainObj.ProdList[i];
        }
        // get selected customer orgType whether it is B2B or B2c for PMS
        let isB2B = false;
        let cusOrgType = this._trnMainService.TrnMainObj.PARTY_ORG_TYPE;
        if (cusOrgType == null || cusOrgType == undefined) { cusOrgType = ""; }
        if (cusOrgType.toLowerCase() == "ak" ||
            cusOrgType.toLowerCase() == "ck" ||
            cusOrgType.toLowerCase() == "gak" ||
            cusOrgType.toLowerCase() == "retailer" ||
            cusOrgType.toLowerCase() == "pms" ||
            cusOrgType.toLowerCase() == "distributor" ||
            cusOrgType.toLowerCase() == "substockist" ||
            cusOrgType.toLowerCase() == "superstockist" ||
            cusOrgType.toLowerCase() == "wdb" ||
            cusOrgType.toLowerCase() == "ssa" ||
            cusOrgType.toLowerCase() == "zcp") {
            isB2B = true;
        }
        let showColumn = false;
        switch (rowName) {
            case "BARCODE_OPTION":
                if ((VT == VoucherTypeEnum.OpeningStockBalance || VT == VoucherTypeEnum.StockSettlement || VT == VoucherTypeEnum.StockIssue || VT == VoucherTypeEnum.InterCompanyTransferOut || VT == VoucherTypeEnum.TaxInvoice || VT == VoucherTypeEnum.TaxInvoiceCancel || VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.CreditNote) && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'retailer' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'ak' ||

                    this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'ck' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'gak' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'pms')) {
                    showColumn = true;
                }
                break;
            case "BARCODE_OPTION_EDITABLE":
                if ((VT == VoucherTypeEnum.OpeningStockBalance || VT == VoucherTypeEnum.StockSettlement || VT == VoucherTypeEnum.StockIssue || VT == VoucherTypeEnum.InterCompanyTransferOut || VT == VoucherTypeEnum.TaxInvoice || VT == VoucherTypeEnum.TaxInvoiceCancel || VT == VoucherTypeEnum.CreditNote)
                    && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'retailer' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'ak' ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'ck' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'gak' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'pms')) {
                    showColumn = true;
                }
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = false; }

                break;
            case "BARCODE_OPTION_NONEDITABLE":
                if ((VT == VoucherTypeEnum.TaxInvoice || VT == VoucherTypeEnum.TaxInvoiceCancel || VT == VoucherTypeEnum.DebitNote) && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'retailer' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'ak' ||
                    this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'ck' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'gak' || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == 'pms')) {
                    if ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia"
                        && this._trnMainService.TrnMainObj.AdditionalObj != null
                        && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") || VT == VoucherTypeEnum.DebitNote) { showColumn = true; }
                }

                break;
            case "MENUITEM_OPTION_EDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = false; }
                else { showColumn = true; }
                break;
            case "MENUITEM_OPTION_NONEDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = true; }
                break;
            case "BATCH_HEADER":
                if ((VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.SalesReturnCancel ||
                    VT == VoucherTypeEnum.DebitNote) && this._trnMainService.AppSettings.HideBatch == false

                )
                    showColumn = true;
                break;
            case "BATCH_EDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = false; }
                else {
                    if ((VT == VoucherTypeEnum.OpeningStockBalance ||
                        VT == VoucherTypeEnum.PerformaSalesInvoice ||
                        VT == VoucherTypeEnum.DeliveryChallaan ||
                        VT == VoucherTypeEnum.QuotationInvoice ||
                        VT == VoucherTypeEnum.Sales ||
                        VT == VoucherTypeEnum.StockIssue ||
                        VT == VoucherTypeEnum.BranchTransferOut ||
                        VT == VoucherTypeEnum.BranchTransferIn ||
                        VT == VoucherTypeEnum.StockSettlement ||
                        VT == VoucherTypeEnum.TaxInvoiceCancel ||
                        VT == VoucherTypeEnum.TaxInvoice ||
                        VT == VoucherTypeEnum.InterCompanyTransferIn ||
                        VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                        VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                        VT == VoucherTypeEnum.InterCompanyTransferOut ||
                        VT == VoucherTypeEnum.CreditNote ||
                        VT == VoucherTypeEnum.SalesReturnCancel ||
                        VT == VoucherTypeEnum.DebitNote ||
                        VT == VoucherTypeEnum.Purchase ||
                        VT == VoucherTypeEnum.MaterialReceipt ||
                        VT == VoucherTypeEnum.ReceiptNote
                    )
                        && PROD.inputMode == true && this._trnMainService.AppSettings.HideBatch == false
                    )
                        showColumn = true;
                }
                break;
            case "BATCH_NONEDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") {
                    showColumn = false;
                } else {
                    if (((VT == VoucherTypeEnum.OpeningStockBalance ||
                        VT == VoucherTypeEnum.PerformaSalesInvoice ||
                        VT == VoucherTypeEnum.DeliveryChallaan ||
                        VT == VoucherTypeEnum.QuotationInvoice ||
                        VT == VoucherTypeEnum.PurchaseReturn ||
                        VT == VoucherTypeEnum.Sales ||
                        VT == VoucherTypeEnum.SalesReturn ||
                        VT == VoucherTypeEnum.StockIssue ||
                        VT == VoucherTypeEnum.BranchTransferOut ||
                        VT == VoucherTypeEnum.BranchTransferIn ||
                        VT == VoucherTypeEnum.StockSettlement ||
                        VT == VoucherTypeEnum.TaxInvoiceCancel ||
                        VT == VoucherTypeEnum.TaxInvoice ||
                        VT == VoucherTypeEnum.InterCompanyTransferIn ||
                        VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                        VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                        VT == VoucherTypeEnum.InterCompanyTransferOut ||
                        VT == VoucherTypeEnum.CreditNote ||
                        VT == VoucherTypeEnum.DebitNote ||
                        (VT == VoucherTypeEnum.PurchaseReturnCancel) ||
                        VT == VoucherTypeEnum.SalesReturnCancel) &&
                        PROD.inputMode == false && this._trnMainService.AppSettings.HideBatch == false)
                    ) {

                        showColumn = true;
                    }


                    if ((VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.SalesReturnCancel
                    ) && PROD.inputMode == true) {
                        showColumn = false
                    }

                }
                break;

            case "BATCH_ONLYFORSHOW":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") {
                    showColumn = true;
                }
                else {
                    showColumn = false;
                }
                break;
            case "MFGDATE_HEADER":
                if ((VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    (VT == VoucherTypeEnum.Sales) ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.AppSettings.MFGDATERIGTS) ||
                    (VT == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.MFGDATERIGTS) ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.SalesReturnCancel ||
                    VT == VoucherTypeEnum.DebitNote) && this._trnMainService.AppSettings.HideMfgDate == false


                )
                    showColumn = true;
                break;
            case "MFGDATE_EDITABLE":

                if ((VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    (VT == VoucherTypeEnum.StockSettlement && this._trnMainService.activeurlpath != "StockSettlementEntryApproval") ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.SalesReturnCancel ||
                    (VT == VoucherTypeEnum.DebitNote))
                    && this._trnMainService.AppSettings.HideMfgDate == false
                )
                    showColumn = true;
                break;
            case "MFGDATE_NONEDITABLE":
                if ((VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.StockIssue ||
                    (VT == VoucherTypeEnum.StockSettlement && this._trnMainService.activeurlpath == "StockSettlementEntryApproval") ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut ||
                    (VT == VoucherTypeEnum.Sales) ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.AppSettings.MFGDATERIGTS) ||
                    (VT == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.MFGDATERIGTS) ||
                    (VT == VoucherTypeEnum.PurchaseReturnCancel))
                    && this._trnMainService.AppSettings.HideMfgDate == false
                )
                    showColumn = true;
                break;
            case "EXPDATE_HEADER":
                if ((VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    VT == VoucherTypeEnum.StockSettlement ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.AppSettings.EXPDATERIGHTS) ||
                    (VT == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.EXPDATERIGHTS) ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.SalesReturnCancel ||
                    VT == VoucherTypeEnum.DebitNote) && this._trnMainService.AppSettings.HideExpDate == false
                )
                    showColumn = true;
                break;
            case "FREEQUANTITY_HEADER":
                if (VT == VoucherTypeEnum.TaxInvoice)
                    showColumn = true;
                break;
            case "EXPDATE_EDITABLE":
                if ((VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    (VT == VoucherTypeEnum.StockSettlement && this._trnMainService.activeurlpath != "StockSettlementEntryApproval") ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.SalesReturnCancel ||
                    (VT == VoucherTypeEnum.DebitNote))
                    && this._trnMainService.AppSettings.HideExpDate == false)
                    showColumn = true;
                break;
            case "EXPDATE_NONEDITABLE":
                if ((
                    VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    (VT == VoucherTypeEnum.StockSettlement && this._trnMainService.activeurlpath == "StockSettlementEntryApproval") ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.AppSettings.EXPDATERIGHTS) ||
                    (VT == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.EXPDATERIGHTS) ||
                    (VT == VoucherTypeEnum.PurchaseReturnCancel)) && this._trnMainService.AppSettings.HideExpDate == false

                )
                    showColumn = true;
                break;

            case "QUANTITY_EDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = false; }
                else {
                    if (VT == VoucherTypeEnum.OpeningStockBalance ||
                        VT == VoucherTypeEnum.PerformaSalesInvoice ||
                        VT == VoucherTypeEnum.DeliveryChallaan ||
                        VT == VoucherTypeEnum.QuotationInvoice ||
                        VT == VoucherTypeEnum.Purchase ||
                        VT == VoucherTypeEnum.MaterialReceipt ||
                        VT == VoucherTypeEnum.ReceiptNote ||
                        VT == VoucherTypeEnum.InterCompanyTransferIn ||
                        VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                        VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                        VT == VoucherTypeEnum.InterCompanyTransferOut ||
                        VT == VoucherTypeEnum.PurchaseReturn ||
                        VT == VoucherTypeEnum.Sales ||
                        VT == VoucherTypeEnum.SalesReturn ||
                        VT == VoucherTypeEnum.StockIssue ||
                        VT == VoucherTypeEnum.BranchTransferOut ||
                        VT == VoucherTypeEnum.BranchTransferIn ||
                        VT == VoucherTypeEnum.StockSettlement ||
                        VT == VoucherTypeEnum.TaxInvoiceCancel ||
                        VT == VoucherTypeEnum.TaxInvoice ||

                        VT == VoucherTypeEnum.PurchaseOrder ||
                        VT == VoucherTypeEnum.SalesOrder ||
                        VT == VoucherTypeEnum.CreditNote ||
                        VT == VoucherTypeEnum.SalesReturnCancel ||
                        VT == VoucherTypeEnum.DebitNote ||
                        (VT == VoucherTypeEnum.PurchaseReturnCancel)

                    )
                        showColumn = true;

                    if (this.isPIAutoLoad()) {
                        showColumn = true;

                    }
                }
                break;

            case "QUANTITY_NONEDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") {
                    showColumn = true;
                } else {
                    let aa = this.ShowProductInsertTableColumns('QUANTITY_EDITABLE', i);
                    if (aa) {
                        showColumn = false;
                    }
                    if (this.isPIAutoLoad()) {
                        showColumn = false;
                    }
                }
                //quantity can be editable

                break;
            case "MRP_NONEDITABLE":

                if (VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.TaxInvoice
                    || VT == VoucherTypeEnum.Purchase
                    || VT == VoucherTypeEnum.MaterialReceipt
                    || VT == VoucherTypeEnum.ReceiptNote
                    || VT == VoucherTypeEnum.InterCompanyTransferIn
                    || VT == VoucherTypeEnum.InterCompanyTransferInCancel
                    || (VT == VoucherTypeEnum.CreditNote && this._trnMainService.TrnMainObj.ISMANUALRETURN) || VT == VoucherTypeEnum.SalesReturnCancel || VT == VoucherTypeEnum.DebitNote) {

                } else {
                    showColumn = true;
                }
                if (this.isPIAutoLoad()) {
                    showColumn = false;
                }
                break;
            case "MRP_EDITABLE":

                if (VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    (VT == VoucherTypeEnum.CreditNote && this._trnMainService.TrnMainObj.ISMANUALRETURN) || VT == VoucherTypeEnum.SalesReturnCancel || (VT == VoucherTypeEnum.DebitNote && this._trnMainService.TrnMainObj.ISMANUALRETURN)) {
                    showColumn = true;
                }
                if (this.isPIAutoLoad()) {
                    showColumn = true;
                }
                break;
            case "COSTPRICE_HEADER":

                if (
                    ((VT == VoucherTypeEnum.TaxInvoice || VT == VoucherTypeEnum.InterCompanyTransferOut)
                        && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "gak")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "gak"))
                    || VT == VoucherTypeEnum.CreditNote
                    || VT == VoucherTypeEnum.SalesReturnCancel ||
                    VT == VoucherTypeEnum.StockIssue
                ) {

                } else if (VT == VoucherTypeEnum.SalesOrder) {

                    showColumn = false;
                }
                else {
                    showColumn = true;
                }
                break;
            case "COSTPRICE2_EDITABLE":

                break;
            case "COSTPRICE2_NONEDITABLE":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Sales ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp")) ||
                    (VT == VoucherTypeEnum.TaxInvoice && (
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp")) ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.BranchTransferIn || VT == VoucherTypeEnum.BranchTransferOut
                ) {
                    showColumn = true;
                }

                break;

            case "ACTUAL_TRAN_PRICE_EDITABLE":
                if (VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.OpeningStockBalance ||
                    (VT == VoucherTypeEnum.StockSettlement && this._trnMainService.activeurlpath != "StockSettlementEntryApproval") ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    (VT == VoucherTypeEnum.DebitNote && this._trnMainService.TrnMainObj.ISMANUALRETURN == true)) {
                    showColumn = true;
                }
                if (this.isPIAutoLoad()) {
                    showColumn = true;
                }
                break;
            case "SELLING_PRICE_INCLUSIVE_EXCLUSIVE_EDITABLE":
                if ((VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.CreditNote) && (
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer"
                        || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor")) {
                    showColumn = true;
                }

                break;
            case "ACTUAL_TRAN_PRICE_NONEDITABLE":
                if (
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    (VT == VoucherTypeEnum.StockSettlement && this._trnMainService.activeurlpath == "StockSettlementEntryApproval") ||
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||

                    VT == VoucherTypeEnum.PurchaseReturn ||
                    (VT == VoucherTypeEnum.DebitNote && this._trnMainService.TrnMainObj.ISMANUALRETURN != true) ||
                    VT == VoucherTypeEnum.SalesReturnCancel ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp" ||
                        (this._trnMainService.userProfile.CompanyInfo.GSTTYPE != null &&
                            this._trnMainService.userProfile.CompanyInfo.GSTTYPE.toLowerCase() == "composite"))) ||

                    (VT == VoucherTypeEnum.PurchaseReturnCancel)
                ) {
                    showColumn = true;
                }
                if (this.isPIAutoLoad()) {
                    showColumn = false;
                }
                break;

            case "SELLINGPRICE2_EDITABLE":
                if (VT == VoucherTypeEnum.OpeningStockBalance) {
                    return true;
                }
                break;
            case "SELLINGPRICE2_NONEDITABLE":
                // if (VT == VoucherTypeEnum.PurchaseOrder ||
                //     VT == VoucherTypeEnum.Purchase) {
                //     showColumn = true;
                // }
                break;
            case "SELLING_HEADER":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.OpeningStockBalance ||

                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.SalesReturnCancel ||
                    (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer" ||
                        (this._trnMainService.userProfile.CompanyInfo.GSTTYPE != null &&
                            this._trnMainService.userProfile.CompanyInfo.GSTTYPE.toLowerCase() == "composite"))) ||


                    VT == VoucherTypeEnum.SalesOrder ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp" ||
                        (this._trnMainService.userProfile.CompanyInfo.GSTTYPE != null &&
                            this._trnMainService.userProfile.CompanyInfo.GSTTYPE.toLowerCase() == "composite")))) {
                    showColumn = true;
                }
                break;
            case "DISCOUNT_PER_HEADER":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    (VT == VoucherTypeEnum.Sales) ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS) ||
                    (VT == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS)
                ) {
                    showColumn = true;
                }

                break;
            case "DISCOUNT2_PER_HEADER":
                if (VT == VoucherTypeEnum.TaxInvoice) {
                    showColumn = true;
                }

                break;
            case "DISCOUNT_PER_EDITABLE":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    (VT == VoucherTypeEnum.Sales) ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS) ||
                    (VT == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS)
                )
                    showColumn = true;

                if (showColumn == true) {
                    if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = false; }

                }
                break;
            case "DISCOUNT_PER_NONEDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = true; }
                break;
            case "DISCOUNT_AMT_HEADER":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.DebitNote ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    (VT == VoucherTypeEnum.Sales) ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS) ||
                    (VT == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS)
                )
                    showColumn = true;

                break;
            case "DISCOUNT_AMT_EDITABLE":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    (VT == VoucherTypeEnum.Sales) ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    (VT == VoucherTypeEnum.TaxInvoice && this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && this._trnMainService.AppSettings.ITEMWISEDISCOUNTRIGTS)) {
                    showColumn = true;
                }
                if (showColumn == true) {
                    if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = false; }

                }
                break;
            case "DISCOUNT_AMT_NONEDITABLE":
                if (
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    VT == VoucherTypeEnum.DebitNote) {
                    showColumn = true;
                }

                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") { showColumn = true; }


                break;
            // case "DISCOUNT_AMT_EDITABLE_VATINCLU":
            //     if (this.ShowProductInsertTableColumns("DISCOUNT_AMT_EDITABLE", i) == false) {
            //         if (
            //             (VT == VoucherTypeEnum.TaxInvoice && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "retailer" ||
            //                 this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
            //                 this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
            //                 this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms" ||
            //                 this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "gak")) ||
            //             (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "retailer" ||
            //                 this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
            //                 this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck" ||
            //                 this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms" ||
            //                 this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "gak"))
            //             && isB2B == false
            //         )
            //             showColumn = true;
            //     }
            //     break;
            case "SUPPLIER_HEADER":
                if (
                    VT == VoucherTypeEnum.OpeningStockBalance
                )
                    showColumn = true;
                break;
            case "SUPPLIER_EDITABLE":
                if (
                    VT == VoucherTypeEnum.OpeningStockBalance
                )
                    showColumn = true;
                break;
            case "SALESMAN_EDITABLE":
                if (VT == VoucherTypeEnum.TaxInvoice || VT == VoucherTypeEnum.PerformaSalesInvoice || VT == VoucherTypeEnum.DeliveryChallaan) { showColumn = true; }
                break;
            case "PROMOTION":
                if (VT == VoucherTypeEnum.TaxInvoice) { showColumn = true; }
                break;
            case "GST_PER_HEADER":
                if (

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut || VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.CreditNote
                )
                    showColumn = true;
                break;
            case "GST_PER_NONEDITABLE":
                if (

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    VT == VoucherTypeEnum.OpeningStockBalance ||
                    VT == VoucherTypeEnum.CreditNote ||
                    VT == VoucherTypeEnum.SalesReturnCancel
                )
                    showColumn = true;
                break;
            case "GST_PER_NONEDITABLE_EXCLUSIVE_FOR_RETAILER":

                break;
            case "GST_AMT_HEADER":
                if (

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    VT == VoucherTypeEnum.TaxInvoice ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    VT == VoucherTypeEnum.OpeningStockBalance
                )
                    showColumn = true;
                break;
            case "GST_AMT_NONEDITABLE":
                if (

                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.InterCompanyTransferIn ||
                    VT == VoucherTypeEnum.InterCompanyTransferInCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOutCancel ||
                    VT == VoucherTypeEnum.InterCompanyTransferOut ||
                    VT == VoucherTypeEnum.PurchaseReturn ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    VT == VoucherTypeEnum.StockIssue ||
                    VT == VoucherTypeEnum.BranchTransferOut ||
                    VT == VoucherTypeEnum.BranchTransferIn ||
                    (VT == VoucherTypeEnum.TaxInvoice) ||
                    VT == VoucherTypeEnum.TaxInvoiceCancel ||
                    VT == VoucherTypeEnum.PurchaseOrder ||
                    VT == VoucherTypeEnum.PurchaseOrderCancel ||
                    VT == VoucherTypeEnum.SalesOrder ||
                    VT == VoucherTypeEnum.OpeningStockBalance
                )
                    showColumn = true;
                break;
            case "GST_AMT_NONEDITABLE_EXCLUSIVE_FOR_RETAILER":

                break;
            case "PRIMARY_DIS_HEADER":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    ((VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.TaxInvoice) && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp"))
                    || VT == VoucherTypeEnum.Purchase
                    || VT == VoucherTypeEnum.MaterialReceipt
                    || VT == VoucherTypeEnum.ReceiptNote

                )

                    showColumn = true;

                break;
            case "SECONDARY_DIS_HEADER":
                if (
                    VT == VoucherTypeEnum.PerformaSalesInvoice ||
                    VT == VoucherTypeEnum.DeliveryChallaan ||
                    VT == VoucherTypeEnum.QuotationInvoice ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    ((VT == VoucherTypeEnum.CreditNote ||
                        VT == VoucherTypeEnum.TaxInvoice) && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "wdb" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "ssa" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "zcp"))
                    || VT == VoucherTypeEnum.Purchase
                    || VT == VoucherTypeEnum.MaterialReceipt
                    || VT == VoucherTypeEnum.ReceiptNote

                )
                    showColumn = true;

                break;
            case "LIQUIDITION_DIS_HEADER":
                if (
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    ((VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.TaxInvoice) && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "superstockist" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "substockist"))
                    || VT == VoucherTypeEnum.Purchase
                    || VT == VoucherTypeEnum.MaterialReceipt
                    || VT == VoucherTypeEnum.ReceiptNote


                )
                    showColumn = true;

                break;
            case "OTHER_DIS_HEADER":
                if (
                    VT == VoucherTypeEnum.Purchase ||
                    VT == VoucherTypeEnum.MaterialReceipt ||
                    VT == VoucherTypeEnum.ReceiptNote ||
                    VT == VoucherTypeEnum.Sales ||
                    VT == VoucherTypeEnum.SalesReturn ||
                    ((VT == VoucherTypeEnum.TaxInvoice || VT == VoucherTypeEnum.CreditNote) && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor")) ||
                    (VT == VoucherTypeEnum.TaxInvoiceCancel && (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor" ||
                        this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor"))
                )
                    showColumn = true;

                break;

            case "UNIT_EDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") {
                    showColumn = false;
                } else {
                    if (VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.SalesReturnCancel || VT == VoucherTypeEnum.DebitNote) {

                    }
                    else {
                        showColumn = true;
                    }

                    if ((VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.CreditNote) && PROD.inputMode == true) {
                        showColumn = true
                    } else if ((VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.CreditNote) && PROD.inputMode == false) {
                        showColumn = false
                    }
                    if (this._trnMainService.TrnMainObj.Mode == "VIEW") {
                        showColumn = false;
                    }
                    if (this.isPIAutoLoad()) {
                        showColumn = true;
                    }
                }
                break;
            case "UNIT_NONEDITABLE":
                if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() != "fitindia" && this._trnMainService.TrnMainObj.AdditionalObj != null && this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "Ecomm_OrderMe_PP_TI") {
                    showColumn = true;
                } else {
                    if (VT == VoucherTypeEnum.CreditNote || VT == VoucherTypeEnum.SalesReturnCancel || VT == VoucherTypeEnum.DebitNote) {
                        showColumn = true;
                    }

                    if ((VT == VoucherTypeEnum.DebitNote || VT == VoucherTypeEnum.CreditNote) && PROD.inputMode == true) {
                        showColumn = false
                    }

                    if (this._trnMainService.TrnMainObj.Mode == "VIEW") {
                        showColumn = true;
                    }
                    if (this.isPIAutoLoad()) {
                        showColumn = false;
                    }
                }
                break;
            default:
                showColumn = true;
                break;
        }

        return showColumn;
    }
    isPIAutoLoad(): boolean {
        if (this._trnMainService.TrnMainObj.REFBILL != null && this._trnMainService.TrnMainObj.REFBILL != '' && this._trnMainService.TrnMainObj.Mode == "EDIT" && this._trnMainService.TrnMainObj.VoucherPrefix == "PI") {
            return true;
        }
        return false;
    }
    SalesmanEnterClicked(event) { }





}




@Pipe({
    name: 'taxinvoiceactive',
    pure: true
})
export class TaxInvoiceActivePipe implements PipeTransform {
    constructor(public _trnMainService: TransactionService) {
    }




    transform(rowName: any, userwiseTransactionFormConf: any[] = [], additionalParam?: boolean): boolean {
        let active: boolean = this.ShowProductInsertTableColumns(rowName, userwiseTransactionFormConf, additionalParam)

        return active;
    }


    ShowProductInsertTableColumns(rowName, userwiseTransactionFormConf: any[] = [], additionalParam): boolean {
        let showColumn = false;
        let gridSetting = userwiseTransactionFormConf.filter(x => x.HEADERKEY == rowName)[0];
        showColumn = gridSetting ? gridSetting.CONTROLVALUE : false;
        return showColumn && (!additionalParam);
    }

    FocusProductInsertTableColumn(rowName, userwiseTransactionFormConf: any[] = [], additionalParam): boolean {
        let focusColumn = false;
        let gridSetting = userwiseTransactionFormConf.filter(x => x.HEADERKEY == rowName)[0];
        focusColumn = gridSetting ? gridSetting.ISFOCUS : false;
        return focusColumn && (!additionalParam);
    }



}




import { NgControl } from '@angular/forms';

@Directive({
    selector: '[disableControl]'
})
export class DisableControlDirective {

    @Input() set disableControl(_trnMainService: TransactionService) {
        const action = _trnMainService.TrnMainObj.tag == "FROMTRANSFERRED" ? 'disable' : 'enable';
        this.ngControl.control[action]();
    }

    constructor(private ngControl: NgControl) {
    }

}
































































import { Directive, ViewContainerRef, TemplateRef, DoCheck, IterableDiffers, IterableDiffer } from '@angular/core';
import { AuthService } from "../services/permission/authService.service";
import { GenericStaticPopUpComponent } from "../popupLists/generic_grid_static/genericGrid_popUp_static.component";
import { MatrixItemGridComponent } from "../popupLists/matrix-item-grid/matrix-item-grid.component";
import { SerializedItemGridComponent } from "../popupLists/serialised-item-grid/serialised-item-grid.component";
import { VoucherHistoryComponent } from "./voucher-history.component";
import { SalesHistoryComponent } from "./sales-history.component";
import { UserWiseTransactionFormConfigurationService } from "../popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.service";
import { forEach, xor } from "lodash";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
@Directive({
    selector: '[lazyFor]'
})
export class LazyForDirective implements DoCheck, OnInit {

    lazyForContainer: HTMLElement;

    itemHeight: number;
    itemTagName: string;

    @Input()
    set lazyForOf(list: any[]) {
        this.list = list;

        if (list) {
            this.differ = this.iterableDiffers.find(list).create();

            if (this.initialized) {
                this.update();
            }
        }
    }

    private templateElem: HTMLElement;

    private beforeListElem: HTMLElement;
    private afterListElem: HTMLElement;

    private list: any[] = [];

    private initialized = false;
    private firstUpdate = true;

    private differ: IterableDiffer<any>;

    private lastChangeTriggeredByScroll = false;

    constructor(private vcr: ViewContainerRef,
        private tpl: TemplateRef<any>,
        private iterableDiffers: IterableDiffers) { }

    ngOnInit() {
        this.templateElem = this.vcr.element.nativeElement;

        this.lazyForContainer = this.templateElem.parentElement;

        //Adding an event listener will trigger ngDoCheck whenever the event fires so we don't actually need to call
        //update here.
        this.lazyForContainer.addEventListener('scroll', () => {
            this.lastChangeTriggeredByScroll = true;
        });

        this.initialized = true;
    }

    ngDoCheck() {
        if (this.differ && Array.isArray(this.list)) {

            if (this.lastChangeTriggeredByScroll) {
                this.update();
                this.lastChangeTriggeredByScroll = false;
            } else {
                const changes = this.differ.diff(this.list);

                if (changes !== null) {
                    this.update();
                }
            }
        }
    }

    /**
     * List update
     *
     * @returns {void}
     */
    private update(): void {

        //Can't run the first update unless there is an element in the list
        if (this.list.length === 0) {
            this.vcr.clear();
            if (!this.firstUpdate) {
                this.beforeListElem.style.height = '0';
                this.afterListElem.style.height = '0';
            }
            return;
        }

        if (this.firstUpdate) {
            this.onFirstUpdate();
        }

        const listHeight = this.lazyForContainer.clientHeight;
        const scrollTop = this.lazyForContainer.scrollTop;

        //The height of anything inside the container but above the lazyFor content
        const fixedHeaderHeight =
            (this.beforeListElem.getBoundingClientRect().top - this.beforeListElem.scrollTop) -
            (this.lazyForContainer.getBoundingClientRect().top - this.lazyForContainer.scrollTop);

        //This needs to run after the scrollTop is retrieved.
        this.vcr.clear();

        let listStartI = Math.floor((scrollTop - fixedHeaderHeight) / this.itemHeight);
        listStartI = this.limitToRange(listStartI, 0, this.list.length);

        let listEndI = Math.ceil((scrollTop - fixedHeaderHeight + listHeight) / this.itemHeight);
        listEndI = this.limitToRange(listEndI, -1, this.list.length - 1);

        for (let i = listStartI; i <= listEndI; i++) {
            this.vcr.createEmbeddedView(this.tpl, {
                $implicit: this.list[i],
                index: i
            });
        }

        this.beforeListElem.style.height = `${listStartI * this.itemHeight}px`;
        this.afterListElem.style.height = `${(this.list.length - listEndI - 1) * this.itemHeight}px`;
    }

    /**
     * First update.
     *
     * @returns {void}
     */
    private onFirstUpdate(): void {

        let sampleItemElem: HTMLElement;
        if (this.itemHeight === undefined || this.itemTagName === undefined) {
            this.vcr.createEmbeddedView(this.tpl, {
                $implicit: this.list[0],
                index: 0
            });
            sampleItemElem = <HTMLElement>this.templateElem.nextSibling;
        }

        if (this.itemHeight === undefined) {
            this.itemHeight = sampleItemElem.clientHeight;
        }

        if (this.itemTagName === undefined) {
            this.itemTagName = sampleItemElem.tagName;
        }

        this.beforeListElem = document.createElement(this.itemTagName);
        this.templateElem.parentElement.insertBefore(this.beforeListElem, this.templateElem);

        this.afterListElem = document.createElement(this.itemTagName);
        this.templateElem.parentElement.insertBefore(this.afterListElem, this.templateElem.nextSibling);

        // If you want to use <li> elements
        if (this.itemTagName.toLowerCase() === 'li') {
            this.beforeListElem.style.listStyleType = 'none';
            this.afterListElem.style.listStyleType = 'none';
        }

        this.firstUpdate = false;
    }

    /**
     * Limit To Range
     *
     * @param {number} num - Element number.
     * @param {number} min - Min element number.
     * @param {number} max - Max element number.
     *
     * @returns {number}
     */
    private limitToRange(num: number, min: number, max: number) {
        return Math.max(
            Math.min(num, max),
            min
        );
    }


}

