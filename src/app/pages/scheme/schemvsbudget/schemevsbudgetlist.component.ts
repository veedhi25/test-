import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MasterRepo } from "../../../common/repositories";
import { LocalDataSource } from '../../../node_modules/ng2-smart-table/';

@Component({
    template: `
                <div class="fixed-top nav-bar" style="background   : #ffffff !important;
                                                    box-shadow   : 0px 1px 1px 1px #c0bec2;
                                                    width        : 100vw;
                                                    height       : 40px !important;
                                                    margin-bottom: 10px;">
                    <div class="col-md-4">
                        <h3>Scheme Vs Budget Master</h3>
                    </div>
                    <div class="col-md-8">
                        <button  class="btn btn-info pull-right" (click)="onAddClick()">Add New Scheme Vs Budget</button>
                    </div>
                </div>
                <div class="full-width">
                    <div class="ng-tableinner">
                        <ba-card baCardClass="with-scroll">
                        <ng2-smart-table [settings]="settings" [source]="source" (edit)="onEditClick($event)"
                            (view)="onViewClick($event)"></ng2-smart-table>
                        </ba-card>
                    </div>
                </div>
                `,
})


export class SchemeVsBudgetComponentList {

    settings = {
        mode: 'external',
        add: {
            addButtonContent: '',
            createButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        actions: {
            position: 'right'
        },
        view: {
            editButtonContent: '<i class="fa fa-eye" title="Click to view"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        edit: {
            editButtonContent: '<i class="fa fa-pencil" title="Click to edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
            deleteButtonContent: '',
            confirmDelete: true
        },
        columns: {
            retailercode: {
                title: 'Retailer Code',
                type: 'string'
            },
            customername: {
                title: 'Customer Name',
                type: 'string'
            },
            schemeno: {
                title: 'Scheme No',
                type: 'string'
            },
            description: {
                title: 'Scheme Name',
                type: 'string'
            },
            budgetamount: {
                title: 'Budget Amount',
                type: 'string'
            },
            budgetquantity: {
                title: 'Budget Quantity',
                type: 'string'
            }
        }
    };

    source: LocalDataSource = new LocalDataSource();
    constructor(private router: Router, private _masterRepo: MasterRepo) {
        this._masterRepo.masterGetmethod_NEW("/getallschemevsbudget").subscribe(res => {
            if (res.status == "ok") {
                this.source.load(res.result);
            }
        });
    }






    onAddClick(): void {
        this.router.navigate(["./pages/configuration/scheme/schemebudget"]);
    }

    onEditClick(event) {
        this.router.navigate(["./pages/configuration/scheme/schemebudget", {
            mode: "edit", schemeno: event.data.schemeno,
            description: event.data.description,
            retailercode: event.data.retailercode,
            customername: event.data.customername,
            budgetamount: event.data.budgetamount,
            budgetquantity: event.data.budgetquantity, returnUrl: this.router.url
        }]);

    }

    onViewClick(event) {
        this.router.navigate(["./pages/configuration/scheme/schemebudget", {
            mode: "view", schemeno: event.data.schemeno,
            description: event.data.description,
            retailercode: event.data.retailercode,
            customername: event.data.customername,
            budgetamount: event.data.budgetamount,
            budgetquantity: event.data.budgetquantity, returnUrl: this.router.url
        }]);

    }
}