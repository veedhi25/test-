import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnInit, ViewChild } from "@angular/core";
import { isNullOrUndefined } from "util";
import { DynamicFilterOptionComponent, DynamicFilterSetting } from "../../../../common/popupLists/dynamic-filter-option-popup/dynamic-filter-option-popup.component";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { AuthService } from "../../../../common/services/permission";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PurchaseService } from "../purchase.service";
import * as moment from 'moment'
@Component({
    selector: 'indent-approval',
    templateUrl: './indent-approval.component.html',
    styleUrls: ['../../../Style.css']

})
export class IndentApproval implements OnInit {
    showApproved: string = '0';
    public Header = ["Indent NO", "Indent Date", "Approved", "Delivered"];

    public title = "Indent Approval";
    public pageNumber = 1
    public source: any
    public itemList: any[] = [];
    private user: any;
    showDeliveryButon: boolean;
    showApprovalButton: boolean;
    loadApprovedBtnSelected: boolean = false;
    loadUnapprovedBtnSelected: boolean = false;
    obj: {
        data: { INDENTNO: string, TRNDATE: string, APPROVED: boolean, DELIVERED: boolean }[],
        totalCount: number
    };
    constructor(public loadingService: SpinnerService, public _transactionService: TransactionService, public _authService: AuthService, public _purchaseService: PurchaseService, public masterService: MasterRepo, private alertService: AlertService) {

        try {
            this.user = this._authService.getUserProfile();
        }
        catch (ex) {
            alert(ex);
        }
    }
    ngOnInit(): void {
        try {
            this.AllowDelivery();
            this.AllowApproval();
            this.obj = {
                data: [{ INDENTNO: "", TRNDATE: "", APPROVED: false, DELIVERED: false }],
                totalCount: 1
            };
        }
        catch (ex) {
            alert(ex);
        }

    }
    transformDate(date) {
        return moment(date).format('YYYY/MM/DD')
    }
    onPageChangedEvent(pageNumber) {
        this.pageNumber = pageNumber
        this.refresh();
    }
    refresh() {
        
        this.loadingService.show("Getting Indent Records, Please wait !")
        this.masterService.masterGetmethod(`/getUnApprovedIndentList?approve=0`).subscribe((res) => {
            this.loadingService.hide();
            if (res.status == "ok") {
                
                this._transactionService.FilterObj.invoiceList = res.result.data
                this.source = res.result;
                let obj: any = {};
                res.result.data.forEach(function (item, index) {
                    item.TRNDATE = moment(item.TRNDATE).format('DD/MM/YYYY')

                    if (item.APPROVED == true) {
                        item.APPROVED = "Approved"
                    }
                    else {
                        item.APPROVED = "UnApproved"
                    }
                    if (item.DELIVERED == true) {
                        item.DELIVERED = "Delivered"
                    }
                    else {
                        item.DELIVERED = "UnDelivered"
                    }

                });

                console.log('obj', obj);
                
            }

        }, error => {
            this.loadingService.hide()
            alert(error);
        })
    }
    LoadClick() {
        this.loadUnapprovedBtnSelected = true;
        this.loadApprovedBtnSelected = false;
        this.refresh();
    }
    deliverClick() {
        if (this.source == null || this.source.data == null || !(this.source.data.length)) { return; }
        let checkindent = [];
        for (var i of this.source.data.filter(x => x.isChecked)) {
            checkindent.push(i.INDENTNO);
        }
        if (!checkindent.length) {
            this.alertService.warning("Please Select indents to deliver");
            return;
        }
        this.loadingService.show("Please wait while delivering indents.")
        this.masterService.masterPostmethod("/DeliverIndentToHQ", checkindent).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.alertService.success(res.message);
                this.refresh();
            } else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error);
        }, () => {
            this.loadingService.hide();
        })
    }
    approvedIndents() {
        if (this.source == null || this.source.data == null || !(this.source.data.length)) { return; }
        let checkindent = [];
        for (var i of this.source.data.filter(x => x.isChecked)) {
            checkindent.push(i.INDENTNO);
        }
        if (!checkindent.length) {
            this.alertService.warning("Please Select indents to approve");
            return;
        }
        this.loadingService.show("Please wait while approving indents.")
        this.masterService.masterPostmethod("/saveApprovedIndentList", checkindent).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.alertService.success(res.message);
                this.refresh();
            } else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error);
        }, () => {
            this.loadingService.hide();
        })
    }
    getApprovedIndents() {
        this.loadUnapprovedBtnSelected = false;
        this.loadApprovedBtnSelected = true;
        
        this.loadingService.show("Please wait while getting approved indents.")
        this.masterService.masterGetmethod(`/getUnApprovedIndentList?approve=1`).subscribe((res) => {
            this.loadingService.hide();
            if (res.status == "ok") {
                // var result = res.result
                
                // result.data.forEach(element => {
                //     
                //     moment(element.TRNDATE).format('YYYY/MM/DD')
                //     
                // });
                this.source = res.result
                
            }
        }, error => {
            this.loadingService.hide()
            alert(error);
        })
    }
    AllowDelivery() {
        try {
            if (!isNullOrUndefined(this.user.CompanyInfo.companycode) &&
                this.user.CompanyInfo.companycode != '' &&
                this.user.CompanyInfo.isHeadoffice == 0 &&
                this.user.allowIndentDeliveryToHQ ? this.user.allowIndentDeliveryToHQ : 0) {
                this.showDeliveryButon = true;
            }
            else {
                this.showDeliveryButon = false;
            }
        }
        catch (ex) {
            alert(ex);
        }
    }
    AllowApproval() {
        try {
            if (!isNullOrUndefined(this.user.CompanyInfo.companycode) &&
                this.user.CompanyInfo.companycode != '' &&
                this.user.CompanyInfo.isHeadoffice == 0 &&
                this.user.allowIndentApprovalToHQ ? this.user.allowIndentApprovalToHQ : false) {
                
                this.showApprovalButton = true;
            }
            else {
                this.showApprovalButton = false;
            }
        } catch (ex) {
            alert(ex)
        }
    }
}