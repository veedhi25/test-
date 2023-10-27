import {
    Component, Output, EventEmitter, ViewChild, ElementRef, HostListener
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { TenderObj, TBillTender, TrnMain } from "../../../../common/interfaces";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { Loyalty } from "../../../../common/interfaces/loyalty.interface";
import { isNullOrUndefined } from "util";
import { eventNames } from "process";



@Component({
    selector: "generic-popup-Tender",
    templateUrl: "./generic-popup-Tender.html",
    styleUrls: ["../../../../pages/Style.css", "../../../../common/popupLists/pStyle.css"],
})
export class GenericPopUpTenderComponent {
    @Output('okClicked') okClicked = new EventEmitter();
    @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
    gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
    BillTenderList: TBillTender[] = [];
    TendersaveList: TenderObj[] = [];
    CardName: any[] = [];
    walletList: any[] = [];
    couponList: any[] = [];
    cardList: any[] = [];
    samridhiCardList: any[] = [];
    isActive: boolean = false;
    PaymentMode: string;
    calculateTenderAmt: number;
    TrnmainObj: TrnMain = <TrnMain>{};
    tenderObj: TenderObj = <TenderObj>{};
    form: FormGroup;
    TenderSaveObj: TenderObj = <TenderObj>{}
    PaymentModeAcidObj: any = <any>{};
    mixmode = false;
    customer: boolean = false;
    LoyaltyTenderSelected: boolean = false;
    currentLoyalty: number;
    PrevLoyalty: number;
    couponOfferValue: number = 0;

    UsingLoyalty: Loyalty;
    customerid: any;
    minredeemamount: number;
    userCouponList: any;
    AdjustadvancePayment: boolean;
    activeRRNList: any[] = [];
    constructor(private fb: FormBuilder, public masterService: MasterRepo, public _trnMainService: TransactionService, private loadingService: SpinnerService,
        private _hotkeysService: HotkeysService) {
        this.userCouponList = this._trnMainService.UserCouponList;

    }
    ngOnInit() {

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
                    key: "ACCODE",
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





        this.form = this.fb.group({
            CASH: [0],
            LOYALTY: [''],
            CREDIT: [0],
            PAYTM: [0],
            PAYTMAMT: [0],
            PAYTMPHONENUMBER: '',
            CHEQUE: [0],
            WALLET: [0],
            CARD: [0],
            SAMRIDHICARD: [0],
            COUPON: [0],
            CASHAMT: [0],
            CASHAMTRETURN: [0],
            CASHTENDER: [0],
            CARDAMT: [0],
            RETURN_NOTE: [0],
            RETURN_NOTE_AMT: [0],
            SAMRIDHICARDAMT: [0],
            CARDNO: [''],
            SAMRIDHICARDNO: [''],
            CARDNAME: [''],
            APPROVALCODE: [''],
            CARDHOLDERNAME: [''],
            SAMRIDHICARDHOLDERNAME: [''],
            CREDITAMT: [0],
            CHEQUEAMT: [0],
            CHEQUENO: [''],
            DATE: [''],
            BANK: [''],
            TOTAL: [0],
            OUTSTANDING: [''],
            ADVANCE: [0],
            TENDERAMT: [''],
            BALANCE: [0],
            LOYALTYAMT1: [0],
            LOYALTYAMT2: [0],
            LoyaltyTender: [0],
            LOYALTYAMT: [0],
            COUPONNAME: [''],
            COUPONAMT: [0],
            WALLETAMT: [0],
            WALLETTYPE: [''],
            WALLETCARDNO: [''],
            CUSTOMER: [''],
            CUSTOMERDETAIL: <any>{}


        });
        this.mixmode = false;
        this.userCouponList = null;

    }

    setCouponValue(val) {
        this.form.patchValue({
            COUPONNAME: val
        });
    }

    initialiseTenderMode() {
        this.PaymentMode = 'cash';
        if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superdistributor"
            || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor"
            || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "superstockist"
            || this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "substockist") { }
        else {
            this.setHotKeyFunction();
        }
    }
    ngAfterViewInit() {

        this.masterService.TenderTypes().subscribe(res => {
            if (res.status == 'ok') {
                this.walletList = res.result.Wallet;
                this.couponList = res.result.Coupon;
                this.cardList = res.result.Card;
                this.samridhiCardList = res.result.SamridhiCard
            }
        });
        this.masterService.masterGetmethod("/gettransactionmodes").subscribe(
            res => {
                if (res.status == "ok") {
                    this._trnMainService.paymentmodelist = res.result;
                    this.Cash();
                } else {
                    alert(res.result);
                }
            },
            error => {
                alert(error);
            }
        );

        this.masterService.focusAnyControl("CASHTENDER");
        //  document.getElementById('batchFilterPopup').focus();

    }
    show() {
        this.masterService.masterGetmethod("/getSalesOrderWiseAdvanceAmount?acid=" + this._trnMainService.TrnMainObj.PARAC + "&salesOrderNo=" + this._trnMainService.TrnMainObj.REFORDBILL)
            .subscribe(
                res => {
                    if (res.status == "ok") {
                        this._trnMainService.TrnMainObj.totalAdvanceAvailable = this._trnMainService.nullToZeroConverter(res.result);
                        this._trnMainService.TrnMainObj.AdvanceAmountReferenceNo = res.RefNo;
                    } else {
                        alert(res.result);
                    }
                },
                error => {
                    alert(error);
                }
            );

        if (this._trnMainService.paymentmodelist && this._trnMainService.paymentmodelist.length == 0) {
            this.masterService.masterGetmethod("/gettransactionmodes").subscribe(
                res => {
                    if (res.status == "ok") {
                        this._trnMainService.paymentmodelist = res.result;
                    } else {

                    }
                },
                error => {
                }
            );
        }



        this.isActive = true;
        this.TrnmainObj = this._trnMainService.TrnMainObj;
        this._trnMainService.TrnMainObj.selectedRRNList = [];
        this.activeRRNList = [];
        this.form.patchValue({
            TOTAL: this.TrnmainObj.NETAMNT,
            BALANCE: this.TrnmainObj.NETAMNT,
        })
        if (this._trnMainService.TrnMainObj.PARAC) {
            this.customer = true;
        }
        //Vaibhav: 15-06-2020 Added to allowonly in case of edit as following thing needs to be worked in edit mode only.
        if (this._trnMainService.TrnMainObj.Mode.toUpperCase() == "EDIT") {
            //Vaibhav: 13-06-2020 Added to allow select previous tender.
            if (this.TrnmainObj.TRNMODE.toLowerCase() == "samridhicard") {
                this.SamridhiCard();
            }
            else if (this.TrnmainObj.TRNMODE.toLowerCase() == "cash") {
                this.Cash();
            }
            else if (this.TrnmainObj.TRNMODE.toLowerCase() == "card") {
                this.Card();
            }
            else if (this.TrnmainObj.TRNMODE.toLowerCase() == "cheque") {
                this.Cheque();
            }
            else if (this.TrnmainObj.TRNMODE.toLowerCase() == "wallet") {
                this.Wallet();
            }
            else if (this.TrnmainObj.TRNMODE.toLowerCase() == "credit") {
                this.credit();
            }
            else if (this.TrnmainObj.TRNMODE.toLowerCase() == "paytm") {
                this.Paytm();
            }
            else if (this.TrnmainObj.TRNMODE.toLowerCase() == "loyalty") {
                this.Loyalty();
            }
        }
    }

    hide() {

        this.isActive = false;
        this.ValueInitilize();
        this.initialiseTenderMode();
    }

    onCustomerSelected(selectedCustomer) {

        this.form.controls['CUSTOMER'].setValue(selectedCustomer.ACNAME)
        this.form.controls['CUSTOMERDETAIL'].setValue(selectedCustomer)




    }

    validateSelectedPaymentModes(value) {
        if (value == "Cash") {
            return true;
        }

        else if (value == "Coupon") {
            if (this.TenderSaveObj.COUPONNAME == "") {
                alert("Please fill required coupon Information.")
                return false;
            }
            else
                return true;
        }
        else if (value == "Wallet") {
            if (this.TenderSaveObj.WALLETCARDNO == "" || this.TenderSaveObj.WALLETTYPE == "") {
                alert("Please fill required wallet Information.")
                return false;
            }
            else
                return true;
        }
        else if (value == "paytm") {
            if (this.TenderSaveObj.PAYTMPHONENUMBER == "") {
                alert("Please fill required paytm Information.")
                return false;
            }
            if (!this.paymentStatus) {
                alert("Please process your payment first.");
            }
            else
                return true;
        }
        else if (value == "Cheque") {
            if (this.TenderSaveObj.CHEQUENO == "" && this.TenderSaveObj.BANK == "") {
                alert("Please fill required cheque Information.")
                return false;
            }
            else
                return true;
        }
    }

    public requestId: string = "";
    public paymentStatus: boolean = false;
    sendPaytmRequest() {

        if (this.form.controls['PAYTMPHONENUMBER'].value == "") {
            alert("please enter Phone Number first.")
            return;
        }
        var requestBody = {
            "amount": this.form.controls['PAYTMAMT'].value,
            "userPhoneNo": this.form.controls['PAYTMPHONENUMBER'].value
        };
        this.loadingService.show("Please wait...");
        this.masterService
            .sendPaytmPaymentRequest(
                requestBody
            )
            .subscribe(
                res => {
                    console.log(res);
                    if (res.status == "ok") {
                        //alert(res);
                        var result = res.result;
                        this.requestId = result.requestId;
                        this.loadingService.hide();
                        alert(result.body.paymentUrl);
                    } else {
                        alert(result.body.resultInfo.resultMsg);
                    }
                },
                error => {
                    alert(error);
                    this.loadingService.hide();
                }
            );
    }

    checkPaytmRequestStatus() {
        if (this.requestId == "") {
            alert("Please create payment request first.")
            return;
        }
        var requestBody = {
            "requestId": this.requestId
        };
        this.loadingService.show("Please wait...");
        this.masterService
            .checkPaytmPaymentStatusRequest(
                requestBody
            )
            .subscribe(
                res => {
                    if (res.status == "ok") {
                        var result = res.result;
                        // this.requestId = result.requestId;
                        if (result.body.resultInfo.resultStatus == "TXN_SUCCESS") {
                            this.paymentStatus = true;
                            console.log(this.paymentStatus);
                            alert(result.body.resultInfo.resultMsg);
                        }
                        else {
                            alert(result.body.resultInfo.resultMsg);
                        }
                    } else {
                        alert(res.result);
                    }
                    this.loadingService.hide();
                },
                error => {
                    alert(error);
                    this.loadingService.hide();
                }
            );
    }

    showCustomer() {
        this.genericGridCustomer.show();
    }

    validateCoupon() {

        this.couponOfferValue = 0;
        this.TenderSaveObj.COUPONAMT = 0;
        var couponValue = this.form.controls['COUPONNAME'].value;
        var total = this.form.controls['TOTAL'].value;
        if (this._trnMainService.TrnMainObj.PARAC == "" || this._trnMainService.TrnMainObj.PARAC == null) {
            alert("Choose Customer First");
            return;
        }
        if (total == 0 || total == null) {
            alert("Amount should be greater than zero");
            return;
        }
        if (couponValue == null || couponValue == "" || couponValue == undefined) {
            alert("Enter Coupon Code"); return;
        }



        var requestObject = {
            "ACID": this._trnMainService.TrnMainObj.PARAC,
            "CouponListValue": couponValue,
            "BillAmount": this.TrnmainObj.NETAMNT
        }
        this.masterService.masterPostmethod('/applyCoupon', requestObject).subscribe(res => {
            if (res.status == "warn") {
                alert(res.message);
            } else if (res.status == "ok") {

                this.couponOfferValue = parseInt(res.result);
                this.TenderSaveObj.COUPONAMT = this.couponOfferValue;
                this.form.patchValue({
                    COUPON: this.couponOfferValue,
                })
                this.addAllAmount();
                this.validateTenderAmt();
            } else {
                alert(res.message);
            }
        })
    }

    OK() {
        this.masterService
            .masterGetmethod("/gettodaycashsales").subscribe((data: any) => {
                if (this.masterService.userSetting.ENABLESESSIONMANAGEMENT == true && this.masterService.userProfile.CashLimit == null) {
                    alert("Please start the session.")
                    return;
                }
                if (this.masterService.userSetting.ENABLESESSIONMANAGEMENT == true && data.result.totalSales >= this.masterService.userProfile.CashLimit && this.masterService.userProfile.CashLimit != 0) {
                    alert("Your cash limit has been exceeded.")
                    return;
                }



                let totalSum = this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                    + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)

                if (totalSum > this.TrnmainObj.NETAMNT) {
                    alert("Tender amount is Greater than NetAmount!")
                    return;
                }
                if (this.PaymentMode == 'paytm' && !this.paymentStatus) {
                    alert("Please process the payment reaquest first!")
                    return;
                }
                if (totalSum < this.TrnmainObj.NETAMNT) {
                    alert("Tender amount is Less than NetAmount!")
                    return;
                } else {
                    this._trnMainService.TrnMainObj.PAYTMREQUESTID = this.requestId;
                    this.BillTenderList = [];

                    this.TenderSaveObj = this.form.value;
                    var amount = 0;

                    /**
                     * PAYMENT MODE CASH
                     */
                    if (this.TenderSaveObj.CASHAMT > 0) {
                        this.tenderObj.TRNMODE = "Cash";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        if (Validate == false) return;
                        if (this.TenderSaveObj.CASHAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;

                        }
                        amount = this.TenderSaveObj.CASHAMT;
                        this.tenderObj.ACID = this.PaymentModeAcidObj.CashID;
                        this.AddTender(this.tenderObj, amount, "Cash");
                    }
                    if (this.TenderSaveObj.LoyaltyTender > 0) {
                        this.tenderObj.TRNMODE = "Loyalty";
                        if (this.tenderObj.LoyaltyTender == this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;

                        }
                        amount = this.TenderSaveObj.LoyaltyTender;
                        this.tenderObj.ACID = this.PaymentModeAcidObj.LoyaltyID;


                        this.AddTender(this.tenderObj, amount, "Loyalty");

                    }


                    /**
                     * PAYMENT MODE CARD
                     */
                    if (this.TenderSaveObj.CARDAMT > 0) {
                        this.tenderObj.TRNMODE = "Card";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        if (Validate == false) return;
                        if (this.TenderSaveObj.CARDAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;
                        }
                        this.tenderObj.CARDNAME =
                            this.tenderObj.REMARKS = this.TenderSaveObj.CARDNAME;
                        amount = this.TenderSaveObj.CARDAMT;
                        this.tenderObj.ACID = this.PaymentModeAcidObj.CardID;
                        this.tenderObj.CARDNO = this.form.controls['CARDNO'].value;
                        this.tenderObj.APPROVALCODE = this.form.controls['APPROVALCODE'].value;
                        this.tenderObj.CARDHOLDERNAME = this.form.controls['CARDHOLDERNAME'].value;
                        this.AddTender(this.tenderObj, amount, "Card");

                    }

                    /**
                     * PAYMENT MODE SAMRIDHI CARD
                     */
                    if (this.TenderSaveObj.SAMRIDHICARDAMT > 0) {
                        this.tenderObj.TRNMODE = "SamridhiCard";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        if (Validate == false) return;
                        if (this.TenderSaveObj.SAMRIDHICARDAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;
                        }
                        amount = this.TenderSaveObj.SAMRIDHICARDAMT;
                        this.tenderObj.ACID = this.PaymentModeAcidObj.CardID;
                        this.tenderObj.SAMRIDHICARDNO = this.form.controls['SAMRIDHICARDNO'].value;
                        this.tenderObj.SAMRIDHICARDHOLDERNAME = this.form.controls['SAMRIDHICARDHOLDERNAME'].value;
                        this.tenderObj.REMARKS = null;
                        this.AddTender(this.tenderObj, amount, "SamridhiCard");
                    }
                    // -------------------**  Credit might needed on DB and SD ** -----------------
                    // if (TenderSaveObj.CREDITAMT > 0) {
                    //     this.tenderObj.TRNMODE = "Credit"
                    //     amount = TenderSaveObj.CREDITAMT
                    //     this.AddTender(this.tenderObj, amount);
                    // }
                    if (this.TenderSaveObj.CHEQUEAMT > 0) {
                        this.tenderObj.TRNMODE = "Cheque";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        if (Validate == false) return;
                        if (this.TenderSaveObj.CHEQUEAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;

                        }
                        this._trnMainService.TrnMainObj.CHEQUENO = this.TenderSaveObj.CHEQUENO;
                        this._trnMainService.TrnMainObj.CHEQUEDATE = this.TenderSaveObj.DATE;
                        amount = this.TenderSaveObj.CHEQUEAMT;
                        this.tenderObj.BANK =
                            this.tenderObj.REMARKS = this.TenderSaveObj.BANK;
                        this.AddTender(this.tenderObj, amount, "Cheque");
                    }


                    /**
                     * PAYMENMODE COUPON
                     */
                    if (this.couponOfferValue > 0) {
                        this.TenderSaveObj.COUPONAMT = this.couponOfferValue;
                    }
                    if (this.TenderSaveObj.COUPONAMT > 0) {
                        this.tenderObj.TRNMODE = "Coupon";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        console.log("coupon Validate", Validate);
                        if (Validate == false) return;
                        if (this.TenderSaveObj.COUPONAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;

                        }
                        amount = this.TenderSaveObj.COUPONAMT;
                        this.tenderObj.COUPONNAME =
                            this.tenderObj.REMARKS = this.TenderSaveObj.COUPONNAME;
                        this.tenderObj.ACID = this.PaymentModeAcidObj.CouponID;
                        this.AddTender(this.tenderObj, amount, "Coupon");
                    }

                    /**
                     * PAYMENT MODE WALLET
                     */
                    if (this.TenderSaveObj.WALLETAMT > 0) {
                        this.tenderObj.TRNMODE = "Wallet";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        if (Validate == false) return;
                        if (this.TenderSaveObj.WALLETAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;
                        }
                        this.tenderObj.ACID = this.PaymentModeAcidObj.WalletID;
                        amount = this.TenderSaveObj.WALLETAMT;
                        this.tenderObj.WALLETTYPE =
                            this.tenderObj.REMARKS = this.TenderSaveObj.WALLETTYPE;
                        this.tenderObj.WALLETCARDNO = this.form.controls['WALLETCARDNO'].value;
                        this.AddTender(this.tenderObj, amount, "Wallet");
                    }


                    /**
                     * PAYMENT MODE PAYTM
                     */
                    if (this.TenderSaveObj.PAYTMAMT > 0) {
                        this.tenderObj.TRNMODE = "paytm";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        if (Validate == false) return;
                        if (this.TenderSaveObj.PAYTMAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;
                        }
                        this.tenderObj.ACID = this.PaymentModeAcidObj.WalletID;
                        amount = this.TenderSaveObj.PAYTMAMT;
                        this.tenderObj.WALLETTYPE =
                            this.tenderObj.REMARKS = this.TenderSaveObj.WALLETTYPE;
                        this.tenderObj.PAYTMPHONENUMBER = this.form.controls['PAYTMPHONENUMBER'].value;
                        this.AddTender(this.tenderObj, amount, "paytm");
                    }


                    /**
                     * PAYMENT MODE CREDIT
                     */
                    if (this.TenderSaveObj.CREDITAMT > 0) {
                        this.tenderObj.TRNMODE = "Credit";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        if (Validate == false) return;
                        if (this.TenderSaveObj.CREDITAMT != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;
                        }
                        amount = this.TenderSaveObj.CREDITAMT;
                        if (this.TrnmainObj.PARAC == null || this.TrnmainObj.PARAC == "") {
                            alert("Select the customer for credit transaction");
                            return;
                        }
                        this.tenderObj.ACID = this.TrnmainObj.PARAC;
                        this.tenderObj.REMARKS = this.TrnmainObj.BILLTO;
                        this.AddTender(this.tenderObj, amount, "Credit");
                    }
                    if (this.TenderSaveObj.ADVANCE > 0) {
                        this.tenderObj.TRNMODE = "advance";
                        var Validate = this.validateSelectedPaymentModes(this.tenderObj.TRNMODE)
                        if (Validate == false) return;
                        if (this.TenderSaveObj.ADVANCE != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;
                        }
                        amount = this.TenderSaveObj.ADVANCE;
                        if (this.TrnmainObj.PARAC == null || this.TrnmainObj.PARAC == "") {
                            alert("Select the customer for credit transaction");
                            return;
                        }
                        this.tenderObj.ACID = this.TrnmainObj.PARAC;
                        this.tenderObj.REMARKS = "Advance amount adjusted in sales from " + this._trnMainService.TrnMainObj.AdvanceAmountReferenceNo;
                        this.AddTender(this.tenderObj, amount, "advance");
                    }
                    if (this.TenderSaveObj.RETURN_NOTE > 0) {
                        this.tenderObj.TRNMODE = "return_note";
                        if (this.TenderSaveObj.RETURN_NOTE != this._trnMainService.TrnMainObj.NETAMNT) {
                            this._trnMainService.TrnMainObj.TRNMODE = "Mix";
                        }
                        else {
                            this._trnMainService.TrnMainObj.TRNMODE = this.tenderObj.TRNMODE;
                        }
                        this.tenderObj.ACID = this._trnMainService.AppSettings.RETURN_NOTE;
                        this.tenderObj.REMARKS = "Settled From Return Note";
                        this.AddTender(this.tenderObj, this.TenderSaveObj.RETURN_NOTE, "return_note");
                    }


                    this._trnMainService.TrnMainObj.TENDER = this.calculateTenderAmt;
                    this._trnMainService.TrnMainObj.CHANGE = this.form.controls['CASHAMTRETURN'].value;
                    this._trnMainService.TrnMainObj.TOTALCASH = this.form.controls['CASHTENDER'].value;

                    //Vaibhav: 13-06-2020 Added to allow exchange of items for same invoice for Samridhi card.
                    // It will edit the invoice but amount cannot be less than previous amount
                    if (this.TenderSaveObj.SAMRIDHICARDAMT > 0) {
                        if (this._trnMainService.TrnMainObj.Mode.toUpperCase() == "EDIT" && this._trnMainService.TrnMainObj.NETAMNT < this._trnMainService.TrnMainObj.EditModeNetAMount) {
                            alert("With Samrithi card, new net amount value must be equal or greater than previous net amount value.");

                            return;
                        }
                    }
                    this._trnMainService.TrnMainObj.selectedRRNList = this._trnMainService.TrnMainObj.selectedRRNList.filter(x => x.ADJUSTEDAMNT > 0)
                    this.okClicked.emit(this.BillTenderList);
                    this.ValueInitilize()

                }
            });

    }


    AddTender(TenderObj, Amount, TRNMODE) {
        console.log("TenderObj in addtender", TenderObj);
        let BillObj: TBillTender = <TBillTender>{}
        BillObj.TRNMODE = TenderObj.TRNMODE;
        BillObj.VCHRNO = this.TrnmainObj.VCHRNO;
        BillObj.DIVISION = this.TrnmainObj.DIVISION;
        BillObj.REMARKS = TenderObj.REMARKS;
        BillObj.AMOUNT = Amount;
        BillObj.ACCOUNT = TenderObj.ACID;
        BillObj.CARDNO = TenderObj.CARDNO;
        BillObj.APPROVALCODE = TenderObj.APPROVALCODE;
        BillObj.CARDHOLDERNAME = TenderObj.CARDHOLDERNAME;
        BillObj.SAMRIDHICARDNO = TenderObj.SAMRIDHICARDNO;
        BillObj.SAMRIDHICARDHOLDERNAME = TenderObj.SAMRIDHICARDHOLDERNAME;

        if (TRNMODE == "SamridhiCard") {
            BillObj.CARDNO = TenderObj.SAMRIDHICARDNO;
            BillObj.CARDHOLDERNAME = TenderObj.SAMRIDHICARDHOLDERNAME;
            BillObj.REMARKS = null;
        }

        else if (TRNMODE == "Wallet") {
            BillObj.CARDNO = TenderObj.WALLETCARDNO;
            BillObj.REMARKS = TenderObj.WALLETTYPE;
        }
        if (TRNMODE == "Coupon") {
            BillObj.REMARKS = BillObj.REMARKS.toUpperCase();
        }



        this.BillTenderList.push(BillObj);
    }

    changeCardAmt(value) {
        this.form.patchValue({
            CARD: this._trnMainService.nullToZeroConverter(value),
        })
        this.addAllAmount();
        this.validateTenderAmt();

    }

    changeSamridhiCardAmt(value) {
        this.form.patchValue({
            SAMRIDHICARD: this._trnMainService.nullToZeroConverter(value),
        })
        this.addAllAmount();
        this.validateTenderAmt();

    }

    changePaytmAmt(value) {
        this.form.patchValue({
            PAYTM: this._trnMainService.nullToZeroConverter(value),
        })
        this.addAllAmount();
        this.validateTenderAmt();

    }

    changeChequeAmt(value) {
        this.form.patchValue({
            CHEQUE: this._trnMainService.nullToZeroConverter(value),
        })
        this.addAllAmount();
        this.validateTenderAmt();
    }

    changeCashAmt(value) {
        this.form.patchValue({
            CASH: this._trnMainService.nullToZeroConverter(value),
        })
        this.addAllAmount();
        this.validateTenderAmt();
    }

    changeCreditAmt(value) {
        this.form.patchValue({
            CREDIT: this._trnMainService.nullToZeroConverter(value),

        })
        this.addAllAmount();
        this.validateTenderAmt();
    }

    changeCouponAmt(value) {
        this.form.patchValue({
            COUPON: this._trnMainService.nullToZeroConverter(value),

        })
        this.addAllAmount();
        this.validateTenderAmt();
    }

    changeWalletAmt(value) {
        this.form.patchValue({
            WALLET: this._trnMainService.nullToZeroConverter(value),

        })
        this.addAllAmount();
        this.validateTenderAmt();
    }
    changeAdvanceAmt(value) {
        this.form.patchValue({
            ADVANCE: this._trnMainService.nullToZeroConverter(value),

        })
        this.addAllAmount();
        this.validateTenderAmt();
    }
    Cash() {
        if (this.alertForOtherPaymentMode("cash")) {
            this.PaymentMode = "cash"; this.onpaymentmodechange('Cash'); setTimeout(() => { this.masterService.focusAnyControl("CASHAMT_Native"); }, 500);
        }
    }
    Card() {
        if (this.alertForOtherPaymentMode("card")) {
            this.PaymentMode = "card"; this.onpaymentmodechange('Card'); setTimeout(() => { this.masterService.focusAnyControl("CARDAMT_Native"); }, 500);
        }
    }
    Cheque() {
        if (this.alertForOtherPaymentMode("cheque")) {
            this.PaymentMode = "cheque"; this.onpaymentmodechange('Cheque'); setTimeout(() => { this.masterService.focusAnyControl("CHEQUEAMT_Native"); }, 500);
        }
    }
    Coupon() {
        if (this.alertForOtherPaymentMode("coupon")) {
            this.PaymentMode = "coupon"; this.onpaymentmodechange('Coupon'); setTimeout(() => { this.masterService.focusAnyControl("COUPONAMT_Native"); }, 500);
        }
    }
    Wallet() {
        if (this.alertForOtherPaymentMode("wallet")) {
            this.PaymentMode = "wallet"; this.onpaymentmodechange('Wallet'); setTimeout(() => { this.masterService.focusAnyControl("WALLETAMT_Native"); }, 500);
        }
    }
    Paytm() {
        if (this.alertForOtherPaymentMode("paytm")) {
            console.log("paytm");
            this.PaymentMode = "paytm"; this.onpaymentmodechange('paytm'); setTimeout(() => { this.masterService.focusAnyControl("PAYTMAMT_Native"); }, 500);
        }
    }
    Loyalty() {
        if (this.alertForOtherPaymentMode("loyalty")) {
            this.PaymentMode = "loyalty"; this.onpaymentmodechange('loyalty'); setTimeout(() => { this.masterService.focusAnyControl("LOYALTY_Native"); }, 500);
        }
    }
    LoyaltyButtonClicked() {
        if (this.customer == null) {
            alert("Please choose customer first");
        }
        else {
            this.PaymentMode = 'loyalty';

            this.currentLoyalty = this._trnMainService.TrnMainObj.CurrentBillLoyatly;
            this.PrevLoyalty = isNullOrUndefined(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY) ? 0 : this._trnMainService.TrnMainObj.CUS_PREVlOYALTY;
            if (isNullOrUndefined(this._trnMainService.TrnMainObj.loyaltyunredeemable) ? true : this._trnMainService.TrnMainObj.loyaltyunredeemable) {
                this.form.controls["LoyaltyTender"].disable();
            }
            this.form.patchValue({
                LOYALTYAMT1: this.PrevLoyalty,
                LOYALTYAMT2: this.currentLoyalty
            });
            this.Loyalty();
            setTimeout(() => {
                this.masterService.focusAnyControl("LOYALTY_Native3");
            }, 500);
        }
    }
    credit() {
        if (this.alertForOtherPaymentMode("credit")) {
            this.PaymentMode = "credit"; this.onpaymentmodechange('credit'); setTimeout(() => { this.masterService.focusAnyControl("CREDIT_Native"); }, 500);
        }
    }
    SamridhiCard() {
        if (this._trnMainService.userProfile.username.toLowerCase() != "patanjali_user" && this._trnMainService.TrnMainObj.Mode.toUpperCase() == "EDIT" && this._trnMainService.TrnMainObj.TRNMODE.toLowerCase() != "samridhicard" && ((this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "pms" ||
            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ak" ||
            this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "ck"))) {
            return;
        }
        if (this.alertForOtherPaymentMode("samridhicard")) {
            this.PaymentMode = "samridhicard"; this.onpaymentmodechange('SamridhiCard'); setTimeout(() => { this.masterService.focusAnyControl("SAMRIDHICARDAMT_Native"); }, 500);
        }
    }
    AdvanceClicked() {
        if (this.alertForOtherPaymentMode("advance")) {
            this.PaymentMode = "advance"; this.onpaymentmodechange('advance'); setTimeout(() => { this.masterService.focusAnyControl("advance_Native3"); }, 500);
        }
    }

    RRNCLICKED() {
        this.PaymentMode = "return_note";
        this.onpaymentmodechange('return_note');
        setTimeout(() => { this.masterService.focusAnyControl("return_note_Native3"); }, 500);

    }



    alertForOtherPaymentMode(targetPaymentMode) {
        var currentPayementMode = this.PaymentMode;
        if (targetPaymentMode != 'samridhicard') {
            if (currentPayementMode == "paytm") {
                if (confirm("Paytm is already selected. You cannot use other mode with Paytm." +
                    "Previous filled data will be lost. Do you want to continue?")) {
                    this.clearPaymentModeData();
                    return true;
                }
            }
            if (currentPayementMode == "samridhicard") {
                if (this._trnMainService.TrnMainObj.Mode == "EDIT") {
                    alert("Can not change Samridhicard mode");
                    return false;
                }
                if (confirm("Samridhi card is already selected. You cannot use other mode with Samridhi card." +
                    "Previous filled data will be lost. Do you want to continue?")) {
                    this.clearPaymentModeData();
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else if (targetPaymentMode == 'samridhicard') {
            if (currentPayementMode != "samridhicard") {
                if (typeof (this.PaymentMode) != undefined || this.PaymentMode.trim() != "") {
                    // if(confirm("Other payement is already selected. You cannot use other mode with Samridhi card." +
                    // "Previous filled data will be lost. Do you want to continue?")){
                    this.clearPaymentModeData();
                    return true;
                    // }
                    // else{
                    //     return false;
                    // }
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    clearPaymentModeData() {
        this.BillTenderList = [];
        this.form.patchValue({
            CASH: 0,
            CREDIT: 0,
            CHEQUE: 0,
            WALLET: 0,
            CARD: 0,
            PAYTM: 0,
            SAMRIDHICARD: 0,
            COUPON: 0,
            CASHAMT: 0,
            CASHAMTRETURN: 0,
            CASHTENDER: 0,
            CARDAMT: 0,
            SAMRIDHICARDAMT: 0,
            PAYTMAMT: 0,
            PAYTMPHONENUMBER: '',
            CARDNO: '',
            CARDNAME: '',
            APPROVALCODE: '',
            CARDHOLDERNAME: '',
            SAMRIDHICARDHOLDERNAME: '',
            CREDITAMT: 0,
            CHEQUEAMT: 0,
            CHEQUENO: '',
            DATE: '',
            BANK: '',
            OUTSTANDING: '',
            ADVANCE: 0,
            TENDERAMT: 0,
            LOYALTYAMT: 0,
            COUPONNAME: 0,
            COUPONAMT: 0,
            WALLETAMT: 0,
            WALLETTYPE: '',
            WALLETCARDNO: '',
            RETURN_NOTE: 0,
            RETURN_NOTE_AMT: 0
        })
    }

    onAmntChange(mode) {
    }


    EnterTenderAmt(mode) {
        if (this._trnMainService.nullToZeroConverter(this.form.controls['CASHTENDER'].value) == 0) {
            let autoCashTender = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)

            )

            this.form.patchValue({
                CASHTENDER: autoCashTender
            })
            this.EnterAmt('cash');
        } else {
            this.EnterAmt('cash');
        }

    }

    EnterLoyaltyTenderAmt() {

        if (this._trnMainService.nullToZeroConverter(this.form.controls['LoyaltyTender'].value == 0)) {
            return;
        }
        else {
            this.EnterAmt('loyalty');

        }
    }


    EnterAmt(mode) {
        this.CheckMixModeEnter()
        if (mode == 'cash') {
            let validCash: number = 0;
            let balance = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            )

            if (this._trnMainService.nullToZeroConverter(this.form.controls['CASHTENDER'].value) <= this._trnMainService.nullToZeroConverter(balance)) {
                validCash = this._trnMainService.nullToZeroConverter(this.form.controls['CASHTENDER'].value);
            } else if (this._trnMainService.nullToZeroConverter(this.form.controls['CASHTENDER'].value) > this._trnMainService.nullToZeroConverter(balance)) {
                validCash =
                    this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                        this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                        + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)

                    )
            }

            this.form.patchValue({
                CASH: validCash
            })
            this.form.patchValue({
                CASHAMT: validCash
            })


            let cashReturn = this._trnMainService.nullToZeroConverter(this.form.controls['CASHTENDER'].value) - this._trnMainService.nullToZeroConverter(this.form.controls['CASHAMT'].value);
            this.form.patchValue({
                CASHAMTRETURN: cashReturn
            })
        }

        if (mode == 'loyalty') {
            let balance = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            );

            let loyalty: number;
            if (this.form.controls['LoyaltyTender'].value == 0) {
                if (this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY <= balance)) {
                    loyalty = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY)
                    this.form.patchValue(
                        {
                            LOYALTY: loyalty,
                            LoyaltyTender: loyalty
                        }
                    );
                }
                else {
                    loyalty = balance;
                    this.form.patchValue(
                        {
                            LOYALTY: loyalty,
                            LoyaltyTender: loyalty
                        }
                    );

                }

            }
            if (this.form.controls['LoyaltyTender'].value <= this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY)
                && this.form.controls['LoyaltyTender'].value <= this._trnMainService.nullToZeroConverter(balance)) {
                loyalty = this.form.controls['LoyaltyTender'].value

            }
            else {
                if (balance < this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY)) {
                    loyalty = this._trnMainService.nullToZeroConverter(balance)


                }
                else {
                    loyalty = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.CUS_PREVlOYALTY)
                }

            }

            this.form.patchValue(
                {
                    LOYALTY: loyalty,
                    LoyaltyTender: loyalty
                }
            );
            if (loyalty != null && loyalty > 0) {

                this._trnMainService.TrnMainObj.CustomerLoyalty = this._trnMainService.TrnMainObj.CustomerLoyalty - loyalty;
            }

        }



        if (mode == 'cheque') {
            let validCheque: number = 0
            validCheque = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            )
            this.form.patchValue({
                CHEQUE: validCheque
            })
            this.form.patchValue({
                CHEQUEAMT: validCheque
            })
        }
        if (mode == 'card') {
            let validCredit: number = 0;
            validCredit = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            )

            this.form.patchValue({
                CARD: validCredit
            })
            this.form.patchValue({
                CARDAMT: validCredit
            })
        }
        if (mode == 'return_note') {
            let validCredit: number = 0;
            validCredit = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)

            )

            this.form.patchValue({
                RETURN_NOTE: validCredit
            })
            this.form.patchValue({
                RETURN_NOTE_AMT: validCredit
            })
        }
        if (mode == 'samridhicard') {
            let validCredit: number = 0;
            validCredit = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            )

            this.form.patchValue({
                SAMRIDHICARD: validCredit
            })
            this.form.patchValue({
                SAMRIDHICARDAMT: validCredit
            })
        }
        if (mode == 'wallet') {
            let validWallet: number = 0;
            validWallet = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            )

            this.form.patchValue({
                WALLET: validWallet
            })
            this.form.patchValue({
                WALLETAMT: validWallet
            })
        }
        if (mode == 'paytm') {
            let validWallet: number = 0;
            validWallet = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            )

            this.form.patchValue({
                PAYTM: validWallet
            })
            this.form.patchValue({
                PAYTMAMT: validWallet
            })
        }
        if (mode == 'coupon') {
            let validCoupon: number = 0;
            validCoupon = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            )

            this.form.patchValue({
                COUPON: validCoupon
            })
            this.form.patchValue({
                COUPONAMT: validCoupon
            })
        }
        if (mode == 'credit') {
            let validCredit: number = 0;
            validCredit = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)
            )

            this.form.patchValue({
                CREDIT: validCredit
            })
            this.form.patchValue({
                CREDITAMT: validCredit
            })
        }
        if (mode == 'advance') {
            let validAdvance: number = 0;
            validAdvance = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
                this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
                + this._trnMainService.nullToZeroConverter(this.form.controls['RETURN_NOTE'].value)

            )
            let availableAdvance = this._trnMainService.nullToZeroConverter(this._trnMainService.TrnMainObj.totalAdvanceAvailable);
            if (validAdvance > availableAdvance) {
                this.form.patchValue({ ADVANCE: availableAdvance });
            }
            else { this.form.patchValue({ ADVANCE: validAdvance }); }
            if (availableAdvance <= 0) { this.form.patchValue({ ADVANCE: 0 }); }

        }


        this.addAllAmount();
        this.validateTenderAmt();
        this.BalanceAmt();
    }
    addAllAmount() {
        this.calculateTenderAmt =
            this._trnMainService.nullToZeroConverter(this.form.value.LOYALTY)
            + this._trnMainService.nullToZeroConverter(this.form.value.COUPON)
            + this._trnMainService.nullToZeroConverter(this.form.value.CREDIT)
            + this._trnMainService.nullToZeroConverter(this.form.value.WALLET)
            + this._trnMainService.nullToZeroConverter(this.form.value.CASHAMT)
            + this._trnMainService.nullToZeroConverter(this.form.value.CHEQUE)
            + this._trnMainService.nullToZeroConverter(this.form.value.CARD)
            + this._trnMainService.nullToZeroConverter(this.form.value.PAYTM)
            + this._trnMainService.nullToZeroConverter(this.form.value.SAMRIDHICARD)
            + this._trnMainService.nullToZeroConverter(this.form.value.ADVANCE)
            + this._trnMainService.nullToZeroConverter(this.form.value.RETURN_NOTE);
    }
    validateTenderAmt() {
        this.form.patchValue({
            TENDERAMT: this.calculateTenderAmt,
        })

        this.BalanceAmt();
    }
    BalanceAmt() {
        this.form.patchValue({
            BALANCE: this.form.value.TOTAL - this.form.value.TENDERAMT
        })

    }

    preventInput($event) {
        $event.preventDefault();
        return false;
    }

    CheckMixModeEnter() {
        if (this.form.value.TENDERAMT == this.form.value.NetAmount)
            return;
        this.form.value.NetAmount != this.form.value.TENDERAMT ? this.mixmode = true : this.mixmode = false;

    }
    ValueInitilize() {
        this.form.patchValue({
            CASH: 0,
            LOYALTY: '',
            CREDIT: 0,
            CHEQUE: 0,
            WALLET: 0,
            CARD: 0,
            SAMRIDHICARD: 0,
            COUPON: 0,
            CASHAMT: 0,
            LoyaltyTender: 0,
            LOYALTYAMT2: 0,
            LOYALTYAMT1: 0,
            CASHAMTRETURN: 0,
            CASHTENDER: 0,
            CARDAMT: 0,
            SAMRIDHICARDAMT: 0,
            CARDNO: '',
            CARDNAME: '',
            APPROVALCODE: '',
            CARDHOLDERNAME: '',
            SAMRIDHICARDHOLDERNAME: 0,
            PAYTM: 0,
            PAYTMAMT: 0,
            PAYTMPHONENUMBER: '',
            CREDITAMT: 0,
            CHEQUEAMT: 0,
            CHEQUENO: '',
            DATE: '',
            BANK: '',
            TOTAL: 0,
            OUTSTANDING: '',
            ADVANCE: 0,
            TENDERAMT: 0,
            BALANCE: 0,
            LOYALTYAMT: 0,
            COUPONNAME: 0,
            COUPONAMT: 0,
            WALLETAMT: 0,
            RETURN_NOTE: 0,
            RETURN_NOTE_AMT: 0,
            WALLETTYPE: '',
            WALLETCARDNO: '',
            CUSTOMER: '',
            CUSTOMERDETAIL: <any>{}

        })
    }

    pushPaymentACID(value, selectedMode) {
        if (selectedMode == null) {
            return;
        }
        if (value == 'Cash') {
            this.PaymentModeAcidObj.CashID = selectedMode.ACID
        }
        if (value == 'Card') {
            this.PaymentModeAcidObj.CardID = selectedMode.ACID
        }
        if (value == 'Cheque') {
            this.PaymentModeAcidObj.ChequeID = selectedMode.ACID
        }
        if (value == 'Coupon') {
            this.PaymentModeAcidObj.CouponID = selectedMode.ACID
        }
        if (value == 'Wallet') {
            this.PaymentModeAcidObj.WalletID = selectedMode.ACID
        }
        if (value == 'paytm') {
            this.PaymentModeAcidObj.WalletID = selectedMode.ACID
        }
        if (value == 'Credit') {
            this.PaymentModeAcidObj.CreditID = selectedMode.ACID
        }
        if (value == 'SamridhiCard') {
            this.PaymentModeAcidObj.CardID = selectedMode.ACID
        }
        if ((value == null ? "" : value) == 'loyalty') {
            this.PaymentModeAcidObj.LoyaltyID = selectedMode.ACID;
        }
    }

    onpaymentmodechange(value) {

        this._trnMainService.paymentAccountList = [];
        if (this._trnMainService.paymentmodelist == null
            || this._trnMainService.paymentmodelist.length == 0
        ) {
            return;
        }

        var selectedmode = this._trnMainService.paymentmodelist.filter(
            x =>
                (x.MODE == null ? "" : x.MODE).toUpperCase() ==
                value.toUpperCase()
        )[0];
        if (selectedmode == null) {
            return;
        }
        this.pushPaymentACID(value, selectedmode);
        let modetype = selectedmode.MODETYPE;

        if (selectedmode.ACID != null && selectedmode.ACID != "") {
            this._trnMainService.TrnMainObj.TRNAC = selectedmode.ACID;
        } else {
            this._trnMainService.TrnMainObj.TRNAC = null;
        }

        if (modetype != null && (modetype.toUpperCase() == "LIST" || value == "paytm")) {
            this.masterService

                .masterGetmethod(
                    "/getpaymentmodelist/" + value
                )
                .subscribe(
                    res => {
                        if (res.status == "ok") {
                            this._trnMainService.paymentAccountList = JSON.parse(res.result);
                            console.log(this._trnMainService.paymentAccountList);
                        } else {
                            alert(res.result);
                        }
                    },
                    error => {
                        alert(error);
                    }
                );
        }
    }

    setHotKeyFunction() {
        if (this._trnMainService.TrnMainObj.VoucherType == 14) {
            this._hotkeysService.add(
                new Hotkey(
                    "shift+a",
                    (event: KeyboardEvent): ExtendedKeyboardEvent => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.Cash();
                        }
                        const e: ExtendedKeyboardEvent = event;
                        e.returnValue = false;
                        return e;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );

            this._hotkeysService.add(
                new Hotkey(
                    "shift+s",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.Card()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+d",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.Cheque()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+n",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.Paytm()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+f",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.Coupon()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+g",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.Wallet()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+h",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.credit();
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            // this._hotkeysService.add(
            //     new Hotkey(
            //         "shift+m",
            //         (event: KeyboardEvent): boolean => {
            //             event.preventDefault();
            //             if (this.isActive == true) {
            //                 this.SamridhiCard();
            //             }
            //             return false;
            //         }, ['INPUT', 'TEXTAREA', 'SELECT']
            //     )
            // );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+c",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.hide()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+x",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.OK();
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+v",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.AdvanceClicked()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+u",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.RRNCLICKED()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
            this._hotkeysService.add(
                new Hotkey(
                    "shift+i",
                    (event: KeyboardEvent): boolean => {
                        event.preventDefault();
                        if (this.isActive == true) {
                            this.LoyaltyButtonClicked()
                        }
                        return false;
                    }, ['INPUT', 'TEXTAREA', 'SELECT']
                )
            );
        }
    }




    enableCentralTenderSelection() {
        let userprofiles = this.masterService.userProfile;
        if (userprofiles.CompanyInfo.companycode && userprofiles.CompanyInfo.isHeadoffice == 0) {
            return true;
        }
        return false;
    }



    onRRNEnterCommand(event) {
        event.preventDefault();
        this.masterService.masterGetmethod_NEW(`/rrnlist?billto=${this._trnMainService.TrnMainObj.PARAC}&bill=${this._trnMainService.TrnMainObj.Mode.toLowerCase() == "new" ? '' : this._trnMainService.TrnMainObj.VCHRNO}`).subscribe((res) => {
            this.activeRRNList = res.data;
            setTimeout(() => {
                this.masterService.focusAnyControl("adjustment0");
            }, 10);
        })
    }




    onRRNAdjustmentAmountEnter(data, i: number) {
        var nextIndex = i + 1;
        if (this._trnMainService.nullToZeroConverter(data.ADJUSTMENT) > this._trnMainService.nullToZeroConverter(data.AMOUNT)) {
            this.PaymentMode = "";
            return;
        }
        if (this._trnMainService.TrnMainObj.selectedRRNList.findIndex(x => x.RETURN_NOTE == data.RETURN_NOTE) == -1) {
            this._trnMainService.TrnMainObj.selectedRRNList.push(data);

        } else {
            this._trnMainService.TrnMainObj.selectedRRNList.filter(x => x.RETURN_NOTE == data.RETURN_NOTE)[0].ADJUSTMENT = data.ADJUSTMENT;
        }
        this.calculateRRNAmount();
        this.addAllAmount();
        this.validateTenderAmt();
        this.BalanceAmt();
        if (document.getElementById("adjustment" + nextIndex)) {
            this.masterService.focusAnyControl("adjustment" + nextIndex);
        } else {
            this.PaymentMode = "";
        }
    }

    calculateRRNAmount() {
        let validCredit: number = 0;
        validCredit = this._trnMainService.nullToZeroConverter(this.TrnmainObj.NETAMNT) - (
            this._trnMainService.nullToZeroConverter(this.form.controls['CREDIT'].value)
            + this._trnMainService.nullToZeroConverter(this.form.controls['CASH'].value)
            + this._trnMainService.nullToZeroConverter(this.form.controls['CHEQUE'].value)
            + this._trnMainService.nullToZeroConverter(this.form.controls['WALLET'].value)
            + this._trnMainService.nullToZeroConverter(this.form.controls['COUPON'].value)
            + this._trnMainService.nullToZeroConverter(this.form.controls['PAYTM'].value)
            + this._trnMainService.nullToZeroConverter(this.form.controls['SAMRIDHICARD'].value)
            + this._trnMainService.nullToZeroConverter(this.form.controls['LOYALTY'].value)
            + this._trnMainService.nullToZeroConverter(this.form.controls['ADVANCE'].value)

        )

        for (var x of this._trnMainService.TrnMainObj.selectedRRNList) {
            if (validCredit > 0) {
                let amountTosettleFromRRN = this._trnMainService.nullToZeroConverter(x.ADJUSTMENT);
                if (validCredit > amountTosettleFromRRN) {
                    x.ADJUSTEDAMNT = amountTosettleFromRRN;
                    validCredit = validCredit - amountTosettleFromRRN;
                } else {
                    x.ADJUSTEDAMNT = validCredit;
                    validCredit = 0;
                }
            }
        }


        this.form.patchValue({
            RETURN_NOTE: this._trnMainService.TrnMainObj.selectedRRNList.reduce(function (x, y) { return x + y.ADJUSTEDAMNT }, 0)
        })
        this.form.patchValue({
            RETURN_NOTE_AMT: this._trnMainService.TrnMainObj.selectedRRNList.reduce(function (x, y) { return x + y.ADJUSTEDAMNT }, 0)
        })
    }

}
