import { Component, Injector, ViewChild } from '@angular/core';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AppComponentBase } from '../../../../app-component-base';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../common/ims-grid/ims-grid.component';


@Component({
    selector: 'employee-master-list',
    templateUrl: './employee-master-list.component.html',
})
export class EmployeeMasterListComponent extends AppComponentBase {
    @ViewChild("accountGenericGrid") genericGrid: IMSGridComponent;
    PType: string;
    imsGridSettingsEntity: IMSGridSettings = new IMSGridSettings();
    // PType: string;
    // partyName: string;
    settings = {
        mode: 'external',
        actions: {
            position: 'right'
        },
        add: {
            addButtonContent: '',
            createButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        edit: {
            editButtonContent: '<i class="fa fa-pencil" title="Edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
            deleteButtonContent: '',
            confirmDelete: true
        },
        columns: {
            ACID: {
                title: 'ID',
                type: 'string'
            },
            ACNAME: {
                title: 'NAME',
                type: 'string'
            },
            MOBILE: {
                title: 'Mobile',
                type: 'string'
            },

            EMAIL: {
                title: 'Email',
                type: 'string'
            }
        }
    };

    source: LocalDataSource = new LocalDataSource();

    constructor(private router: Router, public dialog: MdDialog, private alertService: AlertService, private loadingService: SpinnerService, public injector: Injector) {
        super(injector);
        try {
            this.imsGridSettingsEntity = {

                title: "Customer",
                apiEndpoints: '/getEmployeePagedList/',
                pageSize: 10,
                showActionButton: true,
                columns: [
                    {
                        key: "ACID",
                        title: "ID",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "300px"
                    },
                    {
                        key: "ACNAME",
                        title: "NAME",
                        hidden: false,
                        noSearch: false,
                        width: "150px",
                        type: "string"
                    },
                    {
                        key: "MOBILE",
                        title: "Mobile",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "100px"
                    },
                    {
                        key: "EMAIL",
                        title: "Email",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "100px"
                    },
                ],
                actionKeys: [
                    {
                        text: "Edit",
                        title: "Edit",
                        icon: "fa fa-edit",
                        type: ActionKeyMaster.EDIT,
                        hidden: false
                    },
                    // {
                    //     text: "Click to delete customer",
                    //     title: "Delete Customer",
                    //     icon: "fad fa-trash text-danger",
                    //     type: ActionKeyMaster.DELETE
                    // },
                    {
                        text: "View",
                        title: "View",
                        icon: "fa fa-eye",
                        type: ActionKeyMaster.VIEW,
                        hidden: false
                    },
                ]
            };
            // this.masterService.masterGetmethod_NEW("/getEmployeeList").subscribe((res) => {
            //     if (res.status == "ok") {
            //         this.source.load(res.result);
            //     } else {
            //         this.source.load([])
            //     }

            // })



        } catch (ex) {
            alert(ex);
        }
    }



    onAddClick(): void {
        try {
            this.router.navigate(["./pages/masters/employee-master/new", { mode: "add", returnUrl: this.router.url }]);
        } catch (ex) {
            alert(ex);
        }
    }




    onEditClicked(event) {

        try {

            let acid = event.data.ACID
            this.router.navigate(["./pages/masters/employee-master/new", { mode: "edit", ACID: acid, returnUrl: this.router.url }]);

        } catch (ex) {
            alert(ex);
        }
    }
    onViewClicked(event) {

        try {

            let acid = event.data.ACID
            this.router.navigate(["./pages/masters/employee-master/new", { mode: "view", ACID: acid, returnUrl: this.router.url }]);

        } catch (ex) {
            alert(ex);
        }
    }

}