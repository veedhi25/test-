import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerCategory } from '../../../../common/interfaces/customercategory.interface';
import { CustomerCategoryService } from './customer-category.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { MasterRepo } from '../../../../common/repositories';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';

@Component(
    {
        selector: 'customer-category',
        templateUrl: './customer-category.component.html',
        styleUrls: ["./customer-category.component.scss"],
    }
)
export class CustomerCategoryComponent implements OnInit {
    @ViewChild("genericGridItemPricesPopup") genericGridItemPricesPopup: GenericPopUpComponent;
    gridPopupSettingsForItemPrices: GenericPopUpSettings = new GenericPopUpSettings();

    public mode: string = "NEW";
    public customercategory: CustomerCategory = <CustomerCategory>{};
    public divisionList: any[] = [];
    public companyList: any[] = [];

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private transactionService: TransactionService, private service: CustomerCategoryService, private alertService: AlertService, private masterService: MasterRepo, private spinnerService: SpinnerService) {
        this.loadInitial();
        this.customercategory.MODE = "NEW";

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

    loadInitial() {
        this.service.getMultiBusinessDivision().subscribe((res) => {
            if (res.status == "ok") {
                this.divisionList = res.result.division;
                this.companyList = res.result.company;
            } else {
                this.alertService.error("Error on getting division list.");
            }
        }, error => {
            this.alertService.error(error);
        })
    }
    ngOnInit() {
        if (this.activatedRoute.snapshot.params['mode']) {
            if (this.activatedRoute.snapshot.params['mode'] == "VIEW" || this.activatedRoute.snapshot.params['mode'] == "EDIT") {
                this.service.getCustomerCategoryByName(this.activatedRoute.snapshot.params['name']).subscribe((res) => {
                    this.customercategory = res[0];
                    this.customercategory.MODE = this.activatedRoute.snapshot.params['mode'];
                })
            }
        }
    }



    save() {

        if (this.customercategory.MODE == "NEW" || this.customercategory.MODE == "EDIT") {
            if (this.customercategory.CATEGORY_NAME == "" || this.customercategory.CATEGORY_NAME == null || this.customercategory.CATEGORY_NAME == undefined) {
                this.alertService.error("Please provide valid category name.");
                setTimeout(() => {
                    this.masterService.focusAnyControl("cat_name");
                }, 2000);
                return;

            }
            if (this.customercategory.COMPANYID == "" || this.customercategory.COMPANYID == null || this.customercategory.COMPANYID == undefined) {
                this.alertService.error("Please provide company.");
                setTimeout(() => {
                    this.masterService.focusAnyControl("cat_company");
                }, 2000);
                return;

            }
            if (this.customercategory.DIVISION == "" || this.customercategory.DIVISION == null || this.customercategory.DIVISION == undefined) {
                this.alertService.error("Please provide valid division.");
                setTimeout(() => {
                    this.masterService.focusAnyControl("cat_div");
                    return;
                }, 2000);
                return;

            }
            this.customercategory.MARGIN = this.transactionService.nullToZeroConverter(this.customercategory.MARGIN);
            this.spinnerService.show("Saving customer data,Please wait a moment.")
            this.service.saveCustomerCategory(this.customercategory).subscribe((res) => {
                if (res.status == "ok") {
                    this.spinnerService.hide();
                    this.alertService.success(res.message);
                    this.reset();
                } else {
                    this.spinnerService.hide();
                    this.alertService.error(res.message);
                }
            }, error => {
                this.spinnerService.hide();
                this.alertService.error(error);
            })
        } else {
            this.alertService.error("You are in View Mode");
        }


    }


    reset() {
        this.loadInitial();
        this.customercategory = <CustomerCategory>{};
        this.customercategory.MODE = "NEW";
    }

    back() {
        try {
            this.reset();
            this.router.navigate(["./pages/masters/PartyLedger/customercategoryList"]);
        } catch (ex) {
            alert(ex);
        }
    }
    dblClickPopupPartItemPrices(value) {
        if (value == null) return;

        this.customercategory.PRICE_LEVEL = value.pid;
        this.customercategory.PRICE_LEVEL_LABEL = value.plabel;
    }

    pricelevelEnterEventt() {

        this.genericGridItemPricesPopup.show();
    }

}