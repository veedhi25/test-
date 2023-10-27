import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LocalDataSource } from '../../../../../node_modules/ng2-smart-table';
import { MasterRepo } from "../../../../../common/repositories";

@Component({
    template: `
                <div class="fixed-top nav-bar" style="background   : #ffffff !important;
                                                    box-shadow   : 0px 1px 1px 1px #c0bec2;
                                                    width        : 100vw;
                                                    height       : 40px !important;
                                                    margin-bottom: 10px;">
                    <div class="col-md-4">
                        <h3>CustomerWise ItemWise Max Quantity Master</h3>
                    </div>
                    <div class="col-md-8">
                        <button  class="btn btn-info pull-right" (click)="onAddClick()">Add New</button>
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


export class CustomerWiseMaxQuantityListComponent {

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

            acname: {
                title: 'Customer Name',
                type: 'string'
            },
            mcode: {
                title: 'Item Code',
                type: 'string'
            },
            desca: {
                title: 'Item Description',
                type: 'string'
            },
            maxquantity: {
                title: 'Max Quantity',
                type: 'string'
            }
        }
    };

    source: LocalDataSource = new LocalDataSource();
    constructor(private router: Router, private _masterRepo: MasterRepo) {
        this._masterRepo.masterGetmethod_NEW("/getcustomerwisemaxqty").subscribe(res => {
            if (res.status == "ok") {
                this.source.load(res.result);
            }
        });
    }






    onAddClick(): void {
        this.router.navigate(["./pages/masters/utility/customerwisemaxqtylist/addnew"]);
    }

    onEditClick(event) {
        this.router.navigate(["./pages/masters/utility/customerwisemaxqtylist/addnew", {
            mode: "edit", mcode: event.data.mcode,
            desca: event.data.desca,
            parac: event.data.parac,
            acname: event.data.acname,
            maxquantity: event.data.maxquantity, returnUrl: this.router.url
        }]);

    }

    onViewClick(event) {
        this.router.navigate(["./pages/masters/utility/customerwisemaxqtylist/addnew", {
            mode: "view", mcode: event.data.mcode,
            desca: event.data.desca,
            parac: event.data.parac,
            acname: event.data.acname,
            maxquantity: event.data.maxquantity, returnUrl: this.router.url
        }]);

    }
}