import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { AlertService } from "../../../../common/services/alert/alert.service";



@Component({
    selector: "popup-addnewcust",
    templateUrl: "./AddCustomerPopup.html",
    styleUrls: ["../../../../pages/Style.css", "../../../../common/popupLists/pStyle.css"],
})
export class AddNewCustomerPopUpComponent implements OnInit {
    @Output('okClicked') okClicked = new EventEmitter();
    isActive: boolean = false;
    CustObj: any = <any>{};
    StateList: any[] = [];
    constructor(public masterService: MasterRepo, public _trnMainService: TransactionService, private alertService: AlertService) {
        this.CustObj = <any>{};
        this.CustObj.GEO = "walkin";
        this.CustObj.CTYPE = "RETAIL INVOICE";
        // if(this.EnableGlobalCustomerSYnc()){
        this.CustObj.ISGLOBALPARTY = this._trnMainService.AppSettings.defaultCustomerAsLocal==1?"0":"1";
        // }else
        // {
        //     this.CustObj.ISGLOBALPARTY=0;

        // }
        masterService.getState().subscribe(res => {
            if (res.status == 'ok') {
                this.StateList = res.result;
                this.CustObj.STATE = _trnMainService.userProfile.CompanyInfo.STATE;

            }
        })
    }
    EnableGlobalCustomerSYnc() {
        let userprofiles = this.masterService.userProfile;
        if (userprofiles && (userprofiles.CompanyInfo.companycode != "" || userprofiles.CompanyInfo.companycode != null)) {
            return true;
        }
        return false;
    }
    ngOnInit() {
        this.masterService.customerMobileSubject.subscribe((res) => {
            if (res && typeof res === "string") {
                this.CustObj.MOBILE = res;
            }
        })
    }

    show() {
        this.isActive = true;
    }

    hide() {
        this.isActive = false;
        this.CustObj = <any>{};
    }

    OK() {
        if (this.CustObj.ACNAME == null || this.CustObj.ACNAME == undefined || this.CustObj.ACNAME == "") {
            this.alertService.error("Customer name cannot be empty.");
            return false;
        }

        if (this.CustObj.MOBILE && this.CustObj.MOBILE.length > 0) {
            if (this.CustObj.MOBILE.length > 10 || this.CustObj.MOBILE.length < 10) {
                this.alertService.error("Mobile number must be 10 Digit only.");
                return false;
            }
        }

        this.okClicked.emit(this.CustObj);
        this.hide();
    }

}


