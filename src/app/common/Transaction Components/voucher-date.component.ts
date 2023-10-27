import { TransactionService } from './transaction.service';
import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { TrnMain, TrnProd, VoucherTypeEnum } from './../interfaces/TrnMain';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from './../repositories/masterRepo.service';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';
import { SettingService } from './../services'
import { AuthService } from '../services/permission/authService.service';
import { MessageDialog } from '../../pages/modaldialogs/messageDialog/messageDialog.component';
import { BehaviorSubject } from 'rxjs';
import { MdDialog } from '@angular/material';
import { IDivision } from '../interfaces/commonInterface.interface';

@Component({
    selector: "voucher-date-entry",
    templateUrl: "./voucher-date.component.html",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"],
})

export class VoucherDateComponent implements OnDestroy {
    @Input() isSales;
    transactionType: string //for salesmode-entry options
    mode: string = "NEW";
    modeTitle: string = '';
    public returnUrl: string;
    TrnMainObj: TrnMain = <TrnMain>{};
    divisionList: IDivision[] = [];
    TrnDate: Date;
    Trn_Date: Date;
    warehouse: string;
    public vchrno: string;
    public division: string;
    public phiscalid: string;
    form: FormGroup;
    AppSettings;
    pageHeading: string;
    showOrder = false;
    voucherType: VoucherTypeEnum;
    subscriptions: any[] = [];
    tempWarehouse: any;
    userProfile: any = <any>{};
    // additonalCost is 99 sends from AdditionalCost component
    @Input() additionCost: number;
    @Output() additionalcostEmit = new EventEmitter();

    constructor(public masterService: MasterRepo, public _trnMainService: TransactionService, public _fb: FormBuilder, public router: Router, public arouter: ActivatedRoute, public setting: SettingService, public authservice: AuthService, public dialog: MdDialog) {
        this.TrnMainObj = _trnMainService.TrnMainObj;
        this.masterService.ShowMore = true;
        this.AppSettings = this.setting.appSetting;
        this.userProfile = authservice.getUserProfile();
        this.voucherType = this.TrnMainObj.VoucherType;
        this.TrnMainObj.BRANCH = this.userProfile.userBranch;
        this.TrnMainObj.DIVISION = this.userProfile.userDivision;

        this.masterService.refreshTransactionList();
        if (this.TrnMainObj.VoucherType == VoucherTypeEnum.CreditNote || this.TrnMainObj.VoucherType == VoucherTypeEnum.SalesReturn) {
            this.transactionType = 'creditnote';
        }
    }
    ShowMore() {
        this.masterService.ShowMore = true;
    }
    ngOnInit() {
        try {
            this.masterService.masterGetmethod("/getDefaultSellableWarehouse").subscribe(
                x => {
                    if (x.status == "ok") {
                        this._trnMainService.DefaultSellableWarehouse = x.result;
                    }
                    else {
                        alert("Error On getting Default warehouse," + x.result);
                    }
                }
                , error => {
                    alert("Error On getting Default warehouse," + error);
                }
            );
            // this.masterService.getDivisions().subscribe(res => { this.divisionList.push(<IDivision>res); }, error => { this.resolevError(error); });
            //this.masterService.refreshTransactionList();
            if (this.TrnMainObj.VoucherType != VoucherTypeEnum.StockIssue) {
                this.showOrder = true;
            }

            this.form = this._fb.group({
                VCHRNO: ['', Validators.required],
                CHALANNO: ['', Validators.required],
                TRNDATE: ['', Validators.required],
                BSDATE: ['', Validators.required],
                TRN_DATE: ['', Validators.required],
                BS_DATE: ['', Validators.required],
                DIVISION: ['', Validators.required],
                TRNMODE: ['', Validators.required],
                REFBILL: [''],
            });

            if (this.TrnMainObj.Mode == "VIEW") {
                this.form.get('CHALANNO').disable();
                this.form.get('TRNDATE').disable();
                this.form.get('BSDATE').disable();
                this.form.get('TRN_DATE').disable();
                this.form.get('BS_DATE').disable();
                this.form.get('DIVISION').disable();
                this.form.get('REFBILL').disable();
            }

            // this.form.get('VCHRNO').disable();

            var sub3 = this.form.valueChanges.subscribe(form => {
                this.TrnMainObj.VCHRNO = form.VCHRNO;
                this.TrnMainObj.CHALANNO = form.CHALANNO;
                this.TrnMainObj.TRNDATE = form.TRNDATE;
                this.TrnMainObj.BSDATE = null;
                this.TrnMainObj.TRN_DATE = form.TRN_DATE;
                this.TrnMainObj.BS_DATE = null;
                //  this.TrnMainObj.DIVISION = form.DIVISION.INITIAL;
                this.TrnMainObj.REFBILL = form.REFBILL;
                if (this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferIn || this.TrnMainObj.VoucherType == VoucherTypeEnum.BranchTransferOut) {
                    this.TrnMainObj.BILLTO = form.DIVISION.INITIAL;
                }
            });
            this.subscriptions.push(sub3);
            if (this.TrnMainObj.Mode == "EDIT" || this.TrnMainObj.Mode == "VIEW") {
                var sub4 = this._trnMainService.loadDataObservable.subscribe(data => {
                    try {
                        //   
                        if (this.TrnMainObj.Mode == "EDIT") {
                            data.guid = null;
                            const uuidV1 = require('uuid/v1');
                            this.TrnMainObj.guid = uuidV1();
                        }
                        this.form.patchValue({
                            VCHRNO: data.VCHRNO,
                            CHALANNO: data.CHALANNO,
                            TRNDATE: ((data.TRNDATE == null) ? "" : data.TRNDATE.toString().substring(0, 10)),
                            BSDATE: data.BSDATE,
                            TRN_DATE: ((data.TRN_DATE == null) ? "" : data.TRN_DATE.toString().substring(0, 10)),
                            BS_DATE: data.BS_DATE,
                            DIVISION: data.DIVISION,
                            REFBILL: data.REFBILL,
                        });
                        //calligin function to set the division object in control
                        this.setDivision(data.DIVISION);
                        if (this.TrnMainObj.Mode == "EDIT") {
                            this.modeTitle = "Edit ";
                        } else if (this.TrnMainObj.Mode == "VIEW") {
                            this.modeTitle = "View ";
                        }

                        if ((this.form.get('BSDATE').value)) {
                            var resBSDATE = (this.form.get('BSDATE').value).split('/');
                            this.form.get('BSDATE').setValue(resBSDATE[2] + '-' + (resBSDATE[1].length == 1 ? '0' + resBSDATE[1] : resBSDATE[1]) + '-' + (resBSDATE[0].length == 1 ? '0' + resBSDATE[0] : resBSDATE[0]));
                        }
                        if ((this.form.get('BS_DATE').value)) {
                            var resBS_DATE = (this.form.get('BS_DATE').value).split('/');
                            this.form.get('BS_DATE').setValue(resBS_DATE[2] + '-' + (resBS_DATE[1].length == 1 ? '0' + resBS_DATE[1] : resBS_DATE[1]) + '-' + (resBS_DATE[0].length == 1 ? '0' + resBS_DATE[0] : resBS_DATE[0]));
                        }

                        // this.prefix.VNAME = data.VoucherPrefix;
                        // this.TrnMainObj.VCHRNO = data.VCHRNO;
                    }
                    catch (ex) {
                        
                    }
                });
                this.subscriptions.push(sub4);
            } else {
                this.modeTitle = "Add ";
                const uuidV1 = require('uuid/v1');
                this.TrnMainObj.guid = uuidV1();
                // this.setDivision(this.AppSettings.DefaultDivision);
                this.TrnMainObj.DIVISION = this.userProfile.userDivision;
                var sub1 = this.masterService.getCurrentDate().subscribe(date => { this.form.get('TRNDATE').setValue(date.Date.substring(0, 10)); this.changeEntryDate(date.Date.substring(0, 10), "AD"); this.form.get('TRN_DATE').setValue(date.Date.substring(0, 10)); this.changeTrnDate(date.Date.substring(0, 10), "AD"); }, error => {
                    console.log({ errorGetCurrentDate: error });
                    this.masterService.resolveError(error, "voucher-date - getCurrentDate");
                });
                this.subscriptions.push(sub1);
                if (this.TrnMainObj.DIVISION == '' || this.TrnMainObj.DIVISION == null) {
                    this.TrnMainObj.DIVISION = this.setting.appSetting.DefaultDivision;
                }
                var sub2 = this.masterService.getVoucherNo(this.TrnMainObj).subscribe(res => {
                    if (res.status == "ok") {
                        let TMain = <TrnMain>res.result;
                        this.form.get('VCHRNO').setValue(TMain.VCHRNO);
                        this.form.get('CHALANNO').setValue(TMain.CHALANNO);
                    }
                    else {
                        alert("Failed to retrieve VoucherNo");
                        console.log(res);
                    }
                });
                this.subscriptions.push(sub2);
            }

        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    public setDivision(division: string): void {
        if (division == '') division = this.AppSettings.DefaultDivision;
        this.divisionList = [];
        let defaultDiv;
        var sub = this.masterService.divisionList$.subscribe(data => {
            this.divisionList = data;
            defaultDiv = this.divisionList.filter(d => d.INITIAL == this.AppSettings.DefaultDivision)[0];
            // console.log({ completeDivisionList: this.divisionList, filteredDiv: defaultDiv });
            if (defaultDiv) {
                this.form.get("DIVISION").setValue(defaultDiv);
            }
        }, error => {
            console.log({ divisionloadError: error });
            this.masterService.resolveError(error, "voucher-date - setDivision");
        }
        )
        this.subscriptions.push(sub);

    }
    //   public resolevError(error: Error) {
    //     if (error.message == 'The ConnectionString property has not been initialized.') {
    //         // this.router.navigate(["/login", { returnUrl: this.router.url }]);
    //     }
    //     else {
    //         alert(error.message);
    //     }
    // }

    displayFn(division: any): string {
        return division ? division.NAME : division;
    }

    changeTrnDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.form.get("BS_DATE").setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRN_DATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    clickTrnDate(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRN_DATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    changeEntryDate(value, format: string) {
        try {
            var adbs = require("ad-bs-converter");
            if (format == "AD") {
                var adDate = (value.replace("-", "/")).replace("-", "/");
                var bsDate = adbs.ad2bs(adDate);
                this.form.get("BSDATE").setValue(bsDate.en.year + '-' + (bsDate.en.month == '1' || bsDate.en.month == '2' || bsDate.en.month == '3' || bsDate.en.month == '4' || bsDate.en.month == '5' || bsDate.en.month == '6' || bsDate.en.month == '7' || bsDate.en.month == '8' || bsDate.en.month == '9' ? '0' + bsDate.en.month : bsDate.en.month) + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day));
            }
            else if (format == "BS") {
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRNDATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    clickEntryDate(value) {
        try {
            if (value != null && value != 0) {
                var adbs = require("ad-bs-converter");
                var bsDate = (value.replace("-", "/")).replace("-", "/");
                var adDate = adbs.bs2ad(bsDate);
                this.form.get("TRNDATE").setValue(adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
            }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    ngOnDestroy() {
        try {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            })
        }
        catch (ex) {
            console.log({ OnDestroyVoucherDate: ex });
        }
    }
    ReferenceLoad() {
        let vchrno = this.form.get("REFBILL").value;
        if (!vchrno) { return; }
        
        this.ProdListFillerFromDispatch({ VCHRNO: vchrno, DIVISION: this.AppSettings.DefaultDivision, PHISCALID: null })
        return;
    }
    TrnProdObj: TrnProd;
    ProdListFillerFromDispatch(selectedRow) {
        this.TrnMainObj.ProdList = [];
        let response: Array<any> = [];
        this.masterService.getList({ VCHRNO: selectedRow.VCHRNO, DIVISION: selectedRow.DIVISION, PHISCALID: selectedRow.PhiscalID }, "/getTrnMain")
            .subscribe(res => {
                console.log({ mainReturn: res });
                var retmain: TrnMain = res.result;
                this.TrnMainObj.TRNMODE = retmain.TRNMODE;
                this.TrnMainObj.TRNAC = retmain.TRNAC;
                this.TrnMainObj.REMARKS = retmain.REMARKS;
                this.TrnMainObj.BILLTO = retmain.BILLTO;
                this.TrnMainObj.BILLTOADD = retmain.BILLTOADD;
                this.TrnMainObj.BILLTOTEL = retmain.BILLTOTEL;
                this.TrnMainObj.BILLTOMOB = retmain.BILLTOMOB;
            }, error => this.masterService.resolveError(error, 'trnmain-not-item-prodlistfiller')
            )

        this.masterService.getList({ VCHRNO: selectedRow.VCHRNO, DIVISION: selectedRow.DIVISION, PHISCALID: selectedRow.PhiscalID }, "/getDeliveryProdList")
            .subscribe(res => {
                console.log({ getDeliveryProdList: res });
                response = res.result;
                this._trnMainService.cnReturnedProdList = res.result;
                if (response && response.length > 0) {

                    for (let p of response) {

                        this.TrnMainObj.MWAREHOUSE = p.WAREHOUSE;
                        this._trnMainService.Warehouse = p.WAREHOUSE;
                        this.tempWarehouse = p.WAREHOUSE;
                        this.TrnProdObj = p;
                        
                        this.TrnProdObj = this._trnMainService.CalculateNormal(this.TrnProdObj, this.AppSettings.ServiceTaxRate, this.AppSettings.VATRate);
                        this.TrnProdObj.REALQTY_IN = p.RealQty;
                        this.TrnProdObj.ALTQTY_IN = p.AltQty;
                        this.TrnProdObj.RealQty = 0;
                        this.TrnProdObj.AltQty = 0;

                        this.TrnMainObj.ProdList.push(this.TrnProdObj);

                    }
                } console.log("prodlist1", this.TrnMainObj.ProdList);
            })
    }
    getAdditionalCost(value: string) {

        this.additionalcostEmit.emit(value);

    }

    LoadSalesBill() {
        try {
            if (this.TrnMainObj.REFBILL == null || this.TrnMainObj.REFBILL == "") return;
            if (this.TrnMainObj.REFBILL.substr(0, 2) != 'TI') {
                alert("Invalid Bill Number detected"); return;
            }
            var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Checking Bill Number please wait... ");
            var message$: Observable<string> = messageSubject.asObservable();
            let childDialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
            this.masterService.masterPostmethod("/getsalesbillDataFromCentralServer", { billno: this.TrnMainObj.REFBILL }).subscribe(
                x => {
                    if (x.status == "ok") {
                        var data = JSON.parse(x.result);
                        var Plist = data.prod;
                        this.TrnMainObj.ProdList = [];
                        for (var p of Plist) {
                            p.REALQTY_IN = p.RealQty;
                            p.ALTQTY_IN = p.AltQty;
                            p.RealQty = 0;
                            p.AltQty = 0;
                            p.AltQtyStr = "0";
                        }
                        this.TrnMainObj.ProdList = Plist;
                        //console.log(this.TrnMainObj.ProdList);
                        this.ReCalculateBill();
                        messageSubject.next("Successfull")
                        setTimeout(() => {
                            childDialogRef.close();
                        }, 1000)
                        // for(let p of Plist)
                        // {
                        // let prodObj=<TrnProd>{};
                        // prodObj.MCODE=p.MCODE;
                        // prodObj.ITEMDESC=p.ITEMDESC;
                        // prodObj.MENUCODE=p.MENUCODE;
                        // prodObj.RATE=p.RATE;
                        // prodObj.BATCH=prodObj.BC=p.BC;
                        // prodObj.MFGDATE=p.MFGDATE;
                        // prodObj.EXPDATE=p.EXPDATE;
                        // prodObj.UNIT=p.UNIT;
                        // prodObj.PRATE=p.PRATE;
                        // prodObj.WAREHOUSE;
                        // prodObj.Quantity=p.Quantity;
                        // prodObj.REALQTY_IN=p.RealQty;
                        // prodObj.ALTQTY_IN=p.AltQty;
                        // prodObj.RealQty=0;
                        // prodObj.AltQty=0;
                        // prodObj.DISCOUNT=p.DISCOUNT;
                        // prodObj.INDDISCOUNT=p.INDDISCOUNT;
                        // prodObj.AMOUNT=p.AMOUNT;
                        // prodObj.ISVAT=p.ISVAT;
                        // prodObj.TAXABLE=p.TAXABLE;
                        // prodObj.NONTAXABLE=p.NONTAXABLE;
                        // prodObj.VAT=p.VAT;
                        // prodObj.NETAMOUNT=p.NETAMOUNT;
                        // prodObj.PROMOTION=p.PROMOTION;
                        // prodObj.LOYALTY=p.LOYALTY;
                        // }

                    }
                    else {
                        messageSubject.next(x.result)
                        setTimeout(() => {
                            childDialogRef.close();
                        }, 3000)
                        console.log("error on status error", x.result);
                    }
                }, error => {
                childDialogRef.close();
                alert(error);
            }
            );
        } catch (e) {

            alert("Error on loading voucher," + e);
        }
    }
    ReCalculateBill() {
        this.TrnMainObj.TOTAMNT = 0;
        this.TrnMainObj.ProdList.filter(x => x.ADDTIONALROW == 0 || x.ADDTIONALROW == null).forEach(x => { this.TrnMainObj.TOTAMNT += x.AMOUNT; });
        //calculating flat discount. If GblReplaceIndividualWithFlat=1 or 0
        var i: number = 0;
        var amt: number = 0;
        this.TrnMainObj.ProdList.forEach(x => { amt += (x.AMOUNT - this.nullToZeroConverter(x.INDDISCOUNT) - this.nullToZeroConverter(x.PROMOTION) - this.nullToZeroConverter(x.LOYALTY)); });
        this.TrnMainObj.ProdList.forEach(prod => {
            i++; prod.SNO = i;
            if (this.TrnMainObj.ReplaceIndividualWithFlatDiscount == 1) {
                if (this.TrnMainObj.TOTALFLATDISCOUNT != 0) { prod.INDDISCOUNT = 0; }
            }
            if (amt == 0) { prod.FLATDISCOUNT = 0; }
            else { prod.FLATDISCOUNT = (prod.AMOUNT - this.nullToZeroConverter(prod.INDDISCOUNT) - this.nullToZeroConverter(prod.PROMOTION) - this.nullToZeroConverter(prod.LOYALTY)) * (this.nullToZeroConverter(this.TrnMainObj.TOTALFLATDISCOUNT) / amt); }

            prod.DISCOUNT = this.nullToZeroConverter(prod.INDDISCOUNT) + this.nullToZeroConverter(prod.FLATDISCOUNT) + this.nullToZeroConverter(prod.PROMOTION) + this.nullToZeroConverter(prod.LOYALTY);
            if (prod.ISSERVICECHARGE == 1) { prod.SERVICETAX = (prod.AMOUNT - prod.DISCOUNT) * this.setting.appSetting.ServiceTaxRate; }
            if (prod.ISVAT == 1) {
                prod.TAXABLE = prod.AMOUNT - prod.DISCOUNT + this.nullToZeroConverter(prod.SERVICETAX);
                prod.VAT = prod.TAXABLE * this.setting.appSetting.VATRate == null ? 0.13 : this.setting.appSetting.VATRate;
                prod.NONTAXABLE = 0;
                prod.NCRATE = prod.RATE * prod.EXRATE;
                // if (prod.REALQTY_IN == 0)
                // { prod.NCRATE = prod.PRATE; }
                // else
                // { prod.NCRATE = prod.TAXABLE / this.nullToZeroConverter(prod.REALQTY_IN); }
            }
            else {
                prod.TAXABLE = 0; prod.VAT = 0;
                prod.NONTAXABLE = prod.AMOUNT - prod.DISCOUNT + this.nullToZeroConverter(prod.SERVICETAX);
                prod.NCRATE = prod.RATE * prod.EXRATE;
                // if (prod.REALQTY_IN == 0)
                // { prod.NCRATE = prod.PRATE; }
                // else
                // { prod.NCRATE = prod.NONTAXABLE / this.nullToZeroConverter(prod.REALQTY_IN); }
            }
            console.log("prodcheck", prod.NETAMOUNT, prod.TAXABLE, prod.NONTAXABLE, prod.SERVICETAX, prod.VAT, this.setting.appSetting.VATRate);
            prod.NETAMOUNT = this.nullToZeroConverter(prod.TAXABLE) + this.nullToZeroConverter(prod.NONTAXABLE) + this.nullToZeroConverter(prod.SERVICETAX) + this.nullToZeroConverter(prod.VAT);

        });
        this.TrnMainObj.TOTAMNT = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.TOTAMNT += x.AMOUNT; });
        this.TrnMainObj.TOTALINDDISCOUNT = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.TOTALINDDISCOUNT += this.nullToZeroConverter(x.INDDISCOUNT); });
        this.TrnMainObj.TOTALLOYALTY = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.TOTALLOYALTY += this.nullToZeroConverter(x.LOYALTY); });
        this.TrnMainObj.TOTALPROMOTION = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.TOTALPROMOTION += this.nullToZeroConverter(x.PROMOTION); });
        this.TrnMainObj.DCAMNT = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.DCAMNT += this.nullToZeroConverter(x.DISCOUNT); });
        this.TrnMainObj.ServiceCharge = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.ServiceCharge += this.nullToZeroConverter(x.SERVICETAX); });
        this.TrnMainObj.TAXABLE = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.TAXABLE += this.nullToZeroConverter(x.TAXABLE); });
        this.TrnMainObj.NONTAXABLE = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.NONTAXABLE += this.nullToZeroConverter(x.NONTAXABLE); });
        this.TrnMainObj.VATAMNT = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.VATAMNT += this.nullToZeroConverter(x.VAT); });
        this.TrnMainObj.NETWITHOUTROUNDOFF = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.NETWITHOUTROUNDOFF += this.nullToZeroConverter(x.NETAMOUNT); });
        this.TrnMainObj.NETAMNT = Math.round(this.nullToZeroConverter(this.TrnMainObj.NETWITHOUTROUNDOFF));
        this.TrnMainObj.ROUNDOFF = this.TrnMainObj.NETAMNT - this.TrnMainObj.NETWITHOUTROUNDOFF;
        this.TrnMainObj.TotalWithIndDiscount = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.TotalWithIndDiscount += this.nullToZeroConverter(x.TOTAL); });
        this.TrnMainObj.TOTALDISCOUNT = 0; this.TrnMainObj.ProdList.forEach(x => { this.TrnMainObj.TOTALDISCOUNT += this.nullToZeroConverter(x.DISCOUNT); });

    }

    nullToZeroConverter(value) {
        if (value == undefined || value == null || value == "") {
            return 0;
        }
        return parseFloat(value);
    }

}
