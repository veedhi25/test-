import { Component, ViewChild, OnInit } from '@angular/core';
import { DynamicFilterOptionComponent, DynamicFilterSetting } from '../../../../common/popupLists/dynamic-filter-option-popup/dynamic-filter-option-popup.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { AuthService } from '../../../../common/services/permission';
import { PurchaseService } from '../purchase.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';



@Component({
    selector: "purchase-order-delivery",
    styleUrls: ["../../../Style.css"],
    templateUrl: "./purchase-order-delivery.component.html",
})
export class PurchaseOrderDeliveryComponent {


    postatus: string = "0";
    showhidedeliverybtn: boolean = false;
    showhidedeliverybtn1: boolean = false;
    public Header = ["PO No", "PO Date", "Supplier Name", "Supplier SAP", "Invoice Amount", "Status"];



    @ViewChild('dynamicFilterOption') dynamicFilterOption: DynamicFilterOptionComponent
    public filterSettings: DynamicFilterSetting = new DynamicFilterSetting()
    public title = "PO Delivery"
    public pageNumber = 1
    public source: any
    public itemList: any[] = [];
    constructor(public _spinnerService: SpinnerService, public _transactionService: TransactionService, public _authService: AuthService, public _purchaseService: PurchaseService, public masterService: MasterRepo, private alertService: AlertService) {
        this._transactionService.FilterObj.type = "PO"
        let user = this._authService.getUserProfile()
        this._transactionService.FilterObj.location = user.userWarehouse
        let abc = {
            title: "Advance Filter",
            filterOptions: [
                {
                    key: "STATUS",
                    title: "Status",
                    isDefaultFixed: true,
                    isSelected: true,
                    filterType: {
                        type: "dropdown",
                        value: "1",
                        options: [
                            {
                                title: "Completed",
                                value: "1",
                            }
                        ]
                    },
                    filterOperatorDefaultValue: "notequals",
                    filterOperatorOptions: [
                        {
                            title: "Not equals",
                            value: "notequals"
                        },
                        {
                            title: "Equals",
                            value: "equals"
                        }
                    ]
                },
                {
                    key: "VCHRNO",
                    title: "Bill No",
                    isSelected: false,
                    filterType: {
                        type: "text",
                        value: "",
                        options: []
                    },
                    filterOperatorDefaultValue: "greterorequal",
                    filterOperatorOptions: [
                        {
                            title: "is equal to",
                            value: "equals"
                        },
                        {
                            title: "is greater than",
                            value: "greaterthan"
                        },
                        {
                            title: "is less than",
                            value: "lessthan"
                        },
                        {
                            title: "is greater than or equal to",
                            value: "greterorequal"
                        },
                        {
                            title: "is less than or equal to",
                            value: "lessorequal"
                        }
                    ]
                },
                {
                    key: "AMOUNT",
                    title: "Bill Amount",
                    isSelected: false,
                    filterType: {
                        type: "text",
                        value: "",
                        options: []
                    },
                    filterOperatorDefaultValue: "equals",
                    filterOperatorOptions: [
                        {
                            title: "is equal to",
                            value: "equals"
                        },
                        {
                            title: "is greater than",
                            value: "greaterthan"
                        },
                        {
                            title: "is less than",
                            value: "lessthan"
                        },
                        {
                            title: "is greater than or equal to",
                            value: "greterorequal"
                        },
                        {
                            title: "is less than or equal to",
                            value: "lessorequal"
                        }
                    ]
                },
                {
                    key: "NAME",
                    title: "Customer Name",
                    isSelected: false,
                    filterType: {
                        type: "text",
                        value: "",
                        options: []
                    },
                    filterOperatorDefaultValue: "is",
                    filterOperatorOptions: [
                        {
                            title: "is",
                            value: "is"
                        },
                        {
                            title: "contains",
                            value: "contains"
                        },
                        {
                            title: "starts with",
                            value: "startswith"
                        }
                    ]
                },

            ]
        }

        this.filterSettings = Object.assign(new DynamicFilterSetting, abc)
    }

    onFilterApply(filterOptions) {
        this._transactionService.FilterObj.advanceFilterObj = filterOptions
        if (this.postatus === "0") {
            this.refresh();
        } else {
            this.POResendlick();
        }
    }

    show() {
        this.dynamicFilterOption.show()
    }


    dateRangeChanged(date) {
        if (this.postatus === "0") {
            this.refresh();
        } else {
            this.POResendlick();
        }
    }

    onPageChangedEvent(pageNumber) {
        this.pageNumber = pageNumber
        if (this.postatus === "0") {
            this.refresh();
        } else {
            this.POResendlick();
        }
    }
    refresh() {
        this._spinnerService.show("Getting Invoice Records, Please wait !")
        this._purchaseService.getPoList(this._transactionService.FilterObj, this.pageNumber).subscribe((res) => {
            if (res.status == "ok") {
                this._transactionService.FilterObj.invoiceList = res.result
                this.source = res.result
            }
            this._spinnerService.hide();
        }, error => {
            this._spinnerService.hide()
            alert(error);
        })
    }
    LoadClick() {
        if (this.postatus === "0") {
            this.refresh();
        } else {
            this.POResendlick();
        }
    }
    POResendlick() {
        this._spinnerService.show("Getting Delivered PO, Please wait !")
        this._purchaseService.getDeliveredPoList(this._transactionService.FilterObj, this.pageNumber).subscribe((res) => {
            if (res.status == "ok") {
                this._transactionService.FilterObj.invoiceList = res.result
                this.source = res.result
            }
            this._spinnerService.hide();
        }, error => {
            this._spinnerService.hide()
            alert(error);
        })
    }
    deliverClick() {
        let checkpo = [];
        for (var i of this.source.data.filter(x => x.isChecked)) {
            checkpo.push(i.VCHRNO);
        }
        if (this.source == null || this.source.data == null) { return; }
        this._spinnerService.show("Saving , Please wait... !")
        this.masterService.masterPostmethod("/savepodelivery", checkpo).subscribe(
            res => {
                if (res.status == "ok") {
                    this._spinnerService.hide();
                    this.alertService.success("PO Delivered Sucessfully...");
                    this.refresh();
                }
                else {
                    this._spinnerService.hide();
                    this.alertService.error(res.result._body);
                }

            }, error => {
                this._spinnerService.hide();
                this.alertService.error(error);
            }
        );
    }

    ResendPOClick() {
        let checkpo = [];
        for (var i of this.source.data.filter(x => x.isChecked)) {
            checkpo.push(i.VCHRNO);
        }
        if (this.source == null || this.source.data == null) { return; }
        this._spinnerService.show("Saving , Please wait... !")
        this.masterService.masterPostmethod("/resendpodelivery", checkpo).subscribe(
            res => {
                if (res.status == "ok") {
                    this._spinnerService.hide();
                    this.alertService.success("PO Resend Sucessfully...");
                    this.refresh();
                }
                else {
                    this._spinnerService.hide();
                    this.alertService.error(res.result);
                }

            }, error => {
                this._spinnerService.hide();
                this.alertService.error(error);
            }
        );
    }

    postatusemit(postatus) {
        this.postatus = postatus;
    }


}
