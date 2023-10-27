import { Component, Injector, ViewChild } from '@angular/core';
import 'style-loader!./smartTables.scss';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";

import { AuthDialog } from '../../../modaldialogs/authorizationDialog/authorizationDialog.component';
import { PLedgerservice } from './PLedger.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AppComponentBase } from '../../../../app-component-base';
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../common/ims-grid/ims-grid.component';

@Component({
    selector: 'pLedgerTable',
    templateUrl: './PLedgerTable.html',
    styleUrls: ["../../../modal-style.css"],
})
export class pLedgerTableComponent extends AppComponentBase {
    @ViewChild("accountGenericGrid") genericGrid: IMSGridComponent;
    activeurlpath: any;
    PType: string;
    partyName: string;
    source: ServerDataSource;
    @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
    fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

    imsGridSettingsEntity: IMSGridSettings = new IMSGridSettings();


    settings = {
        mode: 'external',
        actions: {
            position: 'left',
            edit: true,
            view: true

        },
        // custom: [
        //     { name: 'viewrecord', title: 'View' }
        // ],
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
        view: {
            viewButtonContent: '<i class="fa fa-eye" title="View"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        columns: {
            ACNAME: {
                title: 'NAME',
                type: 'string'
            },
            shortname: {
                title: 'Short Name',
                type: 'string'
            },
            MOBILE: {
                title: 'Mobile',
                type: 'string'
            },
            customerID: {
                title: 'Customer Id',
                type: 'string'
            },
            Address: {
                title: 'ADDRESS',
                type: 'string'
            },
            GSTNO: {
                title: 'GST No',
                type: 'string'
            },

            ISACTIVE: {
                title: 'STATUS',
                type: 'string',
                valuePrepareFunction: (value) => { return value == 1 ? 'Active' : 'InActive'; },
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'Show all',
                        list: [
                            { value: 1, title: 'Active' },
                            { value: 0, title: 'InActive' },
                        ]
                    }
                }
            },

            // POSupplier:{
            //     title:  'POSupplier',
            //     type: 'string',
            //     valuePrepareFunction: (value) => {
            //         
            //         return value == true ? 'Yes' : 'NO'},
            //     filter: {
            //         type: 'list',
            //         config: {
            //             selectText: 'Show all',
            //             list: [
            //                 { value: true, title: 'Yes' },
            //                 { value: false, title: 'NO' },
            //             ]
            //         }
            //     }
            // }

        }
    };

    // source: LocalDataSource = new LocalDataSource();
    messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
    message$: Observable<string> = this.messageSubject.asObservable();

    constructor(public injector: Injector, private _Ledgerservice: PLedgerservice,
        private router: Router, public _activatedRoute: ActivatedRoute,
        public dialog: MdDialog, public masterService: MasterRepo,
        private alertService: AlertService, private loadingService: SpinnerService) {
        super(injector);

        try {
            // this.settings.actions.edit = false;

            this.PType = this.masterService.PType;
            if (this.PType == 'C') this.partyName = 'New Customer';
            else if (this.PType == 'V') this.partyName = 'New Supplier';

            this.imsGridSettingsEntity = {
                title: "Customer",
                apiEndpoints: '/getPartyPagedList/' + this.PType,
                pageSize: 10,
                showActionButton: true,
                columns: [
                    {
                        key: "ACNAME",
                        title: "Name",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "300px"
                    },
                    {
                        key: "ACNAME",
                        title: "Short Name",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "300px"
                    },
                    {
                        key: "MOBILE",
                        title: "MOBILE",
                        hidden: false,
                        noSearch: false,
                        width: "150px",
                        type: "string"
                    },
                    {
                        key: "ACCODE",
                        title: "SAPCODE",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "100px"
                    },
                    {
                        key: "ADDRESS",
                        title: "ADDRESS",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "300px"
                    },
                    {
                        key: "GSTTYPE",
                        title: "GSTTYPE",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "150px"

                    },
                    {
                        key: "ISACTIVE",
                        title: "STATUS",
                        hidden: false,
                        noSearch: false,
                        width: "100px",
                        type: "list",
                        valuePrepareFunction: (value) => {
                            return value == 1 ? "Active" : "Inactive";
                        },
                        filter: {
                            list: [
                                {
                                    value: 1,
                                    title: "Active"
                                },
                                {
                                    value: 0,
                                    title: "InActive"
                                }
                            ]
                        }
                    }
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
            // let apiUrl = `${this.apiUrl}/getPartyPagedList/${this.PType}`;
            // this.source = new ServerDataSource(this._http,
            //     {
            //         endPoint: apiUrl,
            //         dataKey: "data",
            //         pagerPageKey: "currentPage",
            //         pagerLimitKey: "maxResultCount"
            //     });

        } catch (ex) {
            alert(ex);
        }
    }

    setMode() {
        try {

        } catch (ex) {
            alert(ex);
        }
    }

    onCustom(event) {
        alert(`Custom event '${event.action}' fired on row №: ${event.data.ACID}`)
    }

    getCustomerSupplierData(Ptype: string) {
        let data: Array<any> = [];
        this._Ledgerservice.getPartyItemByPtype(this.PType).subscribe(res => {
            if (res.status == "ok") {
                data = res.result;
                this.source.load(data);
            }
        });
    }

    onAddClick(): void {
        try {
            if (this.PType == 'C')
                this.router.navigate(["./pages/masters/PartyLedger/Customer", { mode: "add", isGroup: 0, PType: 'C', Title: 'Create Customer', returnUrl: this.router.url }]);
            else if (this.PType == 'V')
                this.router.navigate(["./pages/masters/PartyLedger/Supplier", { mode: "add", isGroup: 0, PType: 'V', Title: 'Create Supplier', returnUrl: this.router.url }]);
        } catch (ex) {
            alert(ex);
        }
    }
    onGrpAddClick() {

        try {
            if (this.PType == 'C')
                this.router.navigate(["./pages/masters/PartyLedger/Customer", { mode: "add", isGroup: 1, PType: 'C', Title: 'Create Customer Group', returnUrl: this.router.url }]);
            else if (this.PType == 'V')
                this.router.navigate(["./pages/masters/PartyLedger/Supplier", { mode: "add", isGroup: 1, PType: 'V', Title: 'Create Supplier Group', returnUrl: this.router.url }]);
        } catch (ex) {
            alert(ex);
        }
    }

    onDeleteConfirm(event): void {
        try {
            if (window.confirm('Are you sure you want to Discontinue?')) {
                this.masterService.masterPostmethod('/discontinueAccount', { ACID: event.data.ACID }).subscribe((res) => {
                    this.getCustomerSupplierData(this.PType);
                })
            } else {
                event.confirm.reject();
            }
        } catch (ex) {
            alert(ex);
        }
    }

    onViewClicked(event) {

        try {
            // this.router.navigate(["./pages/masters/company", { initial: event.data.INITIAL, mode: "view", returnUrl: this.router.url }]);

            let acid = event.data.ACID
            if (this.PType == 'C') {
                console.log("View1", acid);
                this.router.navigate(["./pages/masters/PartyLedger/Customer", { mode: "view", ACID: acid, isGroup: 0, PType: 'C', Title: 'View Customer', returnUrl: this.router.url }]);
            }
            else if (this.PType == 'V')
                this.router.navigate(["./pages/masters/PartyLedger/Supplier", { mode: "view", ACID: acid, isGroup: 0, PType: 'V', Title: 'View Supplier', returnUrl: this.router.url }]);

        } catch (ex) {
            alert(ex);
        }
    }

    onEditClicked(event) {

        try {
            let acid = event.data.ACID
            if (this.PType == 'C') {
                console.log("Edit1", acid);
                this.router.navigate(["./pages/masters/PartyLedger/Customer", { mode: "edit", ACID: acid, isGroup: 0, PType: 'C', Title: 'Edit Customer', returnUrl: this.router.url }]);
            }
            else if (this.PType == 'V')
                this.router.navigate(["./pages/masters/PartyLedger/Supplier", { mode: "edit", ACID: acid, isGroup: 0, PType: 'V', Title: 'Edit Supplier', returnUrl: this.router.url }]);
        } catch (ex) {
            alert(ex);
        }


    }


    openAuthDialog() {
        var message = { header: "Information", message: this.message$ };
        this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
    }
    getCustomerFromMobileApp() {
        this.loadingService.show("Please Wait while fetching the customer...");
        this.masterService.masterGetmethod("/getRetailerDetailsFromMobileApi")
            .subscribe(
                res => {
                    if (res.status == "ok") {
                        this.loadingService.hide();
                        this.alertService.success(res.result);
                    } else {
                        this.loadingService.hide();
                        this.alertService.error(res.result._body);
                    }
                },
                error => {
                    this.loadingService.hide();
                }
            );
    }
    ExportCusotmerToExcel() {
        this.masterService.downloadCustomersCSV(this.PType).subscribe(
            data => {
                this.loadingService.hide();
                this.downloadFile(data);
            },
            error => {
                this.loadingService.hide();
            }
        );
    }
    ExportSupplierToExcel() {
        this.masterService.downloadSuppliersCSV().subscribe(
            data => {
                this.loadingService.hide();
                this.downloadFile(data);
            },
            error => {
                this.loadingService.hide();
            }
        );
    }
    downloadFile(response: any) {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(response.content);
        element.download = response.filename;
        document.body.appendChild(element);
        element.click();

    }

    showNewCustomerOption() {
        if (this.PType == 'V' || this.masterService.userProfile.CompanyInfo.ORG_TYPE != 'superdistributor'
            || (this.masterService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == 'superdistributor' && (this.masterService.userProfile.username.toLowerCase() == 'patanjali_user' || this.masterService.userProfile.username.toLowerCase() == 'patanjali_support'))) {
            return true;
        } else {

            return false;
        }
    }

    syncSupplier = (): void => {
        this.loadingService.show("Syncing items.Please wait.....");
        this.masterService.masterGetmethod("/syncSupplier").subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.alertService.success(res.message);
            }
            else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();

        }, () => {
            this.loadingService.hide();

        })
    }


    fileUploadSuccessStatus(response) {
        if (response.status == "ok") {
            this.alertService.success("Upload Successfully")
        }
        else if (response.status == "error" || response.status == "errorfile") {
            this.alertService.error(`Errors:${response.result}`);
        }
        else {
            this.alertService.error("Could not uploaded")
        }
    }

    Importparty() {
        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
            {
                title: `${this.PType.toLowerCase() == 'c' ? 'Customer Master' : 'Supplier Master'}`,
                sampleFileUrl: ``,
                uploadEndpoints: `/masterImport/${this.PType.toLowerCase() == 'c' ? 'Customer Master' : 'Supplier Master'}/nothing`,
                allowMultiple: false,
                acceptFormat: ".csv"
            });
        this.fileUploadPopup.show();
    }

    syncSuppliertoChild = (): void => {
        this.loadingService.show("Syncing Supplier.Please wait.....");
        this.masterService.masterGetmethod("/syncDataParenttoChild?pType=V").subscribe((res) => {
            if (res.status == "ok") {

                this.loadingService.hide();
                this.alertService.success(res.result);
            }
            else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();

        }, () => {
            this.loadingService.hide();

        })
    }

    syncCustomertoChild = (): void => {
        this.loadingService.show("Syncing Customer.Please wait.....");
        this.masterService.masterGetmethod("/syncDataParenttoChild?pType=C").subscribe((res) => {
            if (res.status == "ok") {

                this.loadingService.hide();
                this.alertService.success(res.result);
            }
            else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();

        }, () => {
            this.loadingService.hide();

        })
    }
    syncGlobalCustomer = (): void => {
        this.loadingService.show("Syncing Customer.Please wait.....");
        this.masterService.masterGetmethod_NEW("/syncGlobalCustomer").subscribe((res) => {
            if (res.status == "ok") {

                this.loadingService.hide();
                this.alertService.success(res.result);
            }
            else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();

        }, () => {
            this.loadingService.hide();

        })
    }
    EnableGlobalCustomerSYnc() {
        let userprofiles = this.masterService.userProfile;
        if (userprofiles && userprofiles.CompanyInfo.isHeadoffice == 1) {
            return true;
        }
        return false;
    }

    // onEditClicked(event) {
    //     if (!(this._authService.checkMenuRight(this.activeurlpath, "edit"))) {
    //         console.log("Edit1", this.activeurlpath);
    //         this.alertService.error("You are not authorized for this operation.");
    //         return;
    //     }
    //     this.router.navigate(["./pages/masters/PartyLedger/Customer", { mode: "edit", ACID: event.data.ACID, isGroup: 0, PType: 'C', Title: 'Edit Customer', returnUrl: this.router.url }]);

    // }
    onAccountDelete(event) {
        if (!(this._authService.checkMenuRight(this.activeurlpath, "delete"))) {
            this.alertService.error("You are not authorized for this operation.");
            return;
        }



        this.masterService.masterGetmethod_NEW(`/DeleteAccount/${event.data.ACID}`).subscribe((res) => {
            this.genericGrid.refresh();
        }, error => {

        })

    }

}
