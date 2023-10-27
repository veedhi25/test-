import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { PreventNavigationService } from '../../../../common/services/navigation-perventor/navigation-perventor.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';

@Component(
    {
        selector: 'batchentry',
        templateUrl: './BatchPriceEntry.html',
        styleUrls: ["../../../modal-style.css"],
    }
)
export class BatchFormComponent {

    mode: string = "add";
    router: Router;
    modeTitle: string = "Add Batch";
    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];
    trnMode: string = "";
    form: FormGroup;
    viewMode: boolean;
    Statelist: any[] = [];
    PCLList: any[] = [];
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    selectedItem: any = <any>{};
    LoadedBatch: any = <any>{};
    constructor(private masterService: MasterRepo,
        private preventNavigation: PreventNavigationService,
        private loadingService: SpinnerService,
        private alertService: AlertService,

        router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder) {
        this.router = router;
        if (!!this._activatedRoute.snapshot.params['returnUrl']) {
            this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
        }
        if (!!this._activatedRoute.snapshot.params['mode']) {
            this.mode = this._activatedRoute.snapshot.params['mode'];
        }
        this.masterService.masterGetmethod("/getActivePCLList")
            .subscribe(res => {
                if (res.status == "ok") {
                    this.PCLList = JSON.parse(res.result);
                }
                else {
                    console.log("error on getting pcllist " + res.result);
                };
            }, error => {
                console.log("error on getting pcllist ", error);
            }
            );
        this.masterService.masterGetmethod("/getActiveStateList")
            .subscribe(res => {
                if (res.status == "ok") {
                    this.Statelist = JSON.parse(res.result);
                }
                else {
                    console.log("error on getting states " + res.result);
                };

            }, error => {
                console.log("error on getting states ", error);
            }
            );
        this.gridPopupSettings = Object.assign(new GenericPopUpSettings,{
            title: "Items Chooser",
            apiEndpoints: `/getMenuItemsPagedList`,
            defaultFilterIndex : 1,
            columns: [
                {
                    key: 'MENUCODE',
                    title: 'ItemCode',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'DESCA',
                    title: 'Item Name',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'BARCODE',
                    title: 'Barcode',
                    hidden: false,
                    noSearch: false
                }

            ]
        });
    }

    ngOnInit() {
        this.form = this.fb.group({
            DESCA: [''],
            MCODE: ['', [Validators.required]],
            BCODE: ['', [Validators.required]],
            BATCHCODE: ['', [Validators.required]],
            MRP: [0, [Validators.required]],
            LSP: [0],
            SELLRATEBEFORETAX: [0],
            MFGDATE: ['', [Validators.required]],
            EXPDATE: ['', [Validators.required]],

            APPLYFROMDATE: ['', [Validators.required]],
            PCL: [''],
            ID: [''],
            STATUS: [1],
            STATE: ['']
        });
        this.onFormChangeChanges();
        if (this.mode == "edit") {
            this.modeTitle = "Edit Batch";
            this.loadingService.show("Loading Data please wait...")
            let id = this._activatedRoute.snapshot.params['id'];

            this.masterService.masterPostmethod("/getBatchPrice", { ID: id })
                .subscribe(data => {
                    this.loadingService.hide();
                    if (data.status == 'ok') {
                        this.LoadedBatch = data.result;
                        this.form.get("DESCA").disable();
                        this.form.get("BCODE").disable();
                        this.form.get("BATCHCODE").disable();
                        this.form.get("PCL").disable();
                        this.form.get("STATE").disable();
                        this.form.patchValue({
                            DESCA: data.result.DESCA,
                            MCODE: data.result.MCODE,
                            BCODE: data.result.BCODE,
                            BATCHCODE: data.result.BATCHCODE,
                            MRP: data.result.MRP,
                            LSP: data.result.LSP,
                            SELLRATEBEFORETAX: data.result.SELLRATEBEFORETAX,
                            MFGDATE: ((data.result.MFGDATE == null) ? "" : data.result.MFGDATE.toString().substring(0, 10)),
                            EXPDATE: ((data.result.EXPDATE == null) ? "" : data.result.EXPDATE.toString().substring(0, 10)),

                            APPLYFROMDATE: ((data.result.APPLYFROMDATE == null) ? "" : data.result.APPLYFROMDATE.toString().substring(0, 10)),
                            PCL: data.result.PCL,
                            ID: data.result.ID,
                            STATUS: data.result.STATUS,
                            STATE: data.result.STATE
                        });
                        this.preventNavigation.preventNavigation(false);

                    }
                    else {

                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }

                        this.alertService.error("Error in getting Data:" + data.result._body);

                    }
                },
                    error => {
                        this.alertService.error(error);
                    }
                );

        }
    }

    onFormChangeChanges(): void {
        this.form.valueChanges.subscribe(val => {
            if (this.form.dirty) this.preventNavigation.preventNavigation(true);
        });
    }
    ItemEnterKeyCommand() {
        this.genericGrid.show();
    }
    onKeydownPreventEdit(event) {
        if (event.key === "Enter") { }
        else {
            event.preventDefault();
        }

    }
    onItemDoubleClick(event) {
        this.selectedItem = event;
        this.form.patchValue({ MCODE: this.selectedItem.MCODE, DESCA: this.selectedItem.DESCA, BCODE: this.selectedItem.BARCODE });
    }
    cancel() {
        this.router.navigate([this.returnUrl]);
    }

    onSave() {

        if (!this.form.valid) {
            this.alertService.info("please, enter all required fields");
            return;
        }
        if (new Date(this.form.value.EXPDATE) < new Date(this.form.value.MFGDATE)) {
            this.alertService.info("Expiry Date should be greater than Manufacturing Date ");
            return;
        }
        this.loadingService.show("Saving Data please wait...")
        this.onSaveClicked();
    }

    onSaveClicked() {
        try {

            var submitData =
            {
                APPLYFROMDATE: new Date(this.form.value.APPLYFROMDATE),
                BATCHCODE: this.mode == 'edit' ? this.LoadedBatch.BATCHCODE : this.form.value.BATCHCODE,
                BCODE: this.mode == 'edit' ? this.LoadedBatch.BCODE : this.form.value.BCODE,
                DESCA: this.form.value.DESCA,
                EXPDATE: new Date(this.form.value.EXPDATE),
                ID: this.form.value.ID,
                LSP: this.form.value.LSP,
                MCODE: this.mode == 'edit' ? this.LoadedBatch.MCODE : this.form.value.MCODE,
                MFGDATE: new Date(this.form.value.MFGDATE),
                MRP: this.form.value.MRP,
                PCL: this.mode == 'edit' ? this.LoadedBatch.PCL : this.form.value.PCL,
                SELLRATEBEFORETAX: this.form.value.SELLRATEBEFORETAX,
                STATE: this.mode == 'edit' ? this.LoadedBatch.STATE : this.form.value.STATE,
                STATUS: this.form.value.STATUS
            }

            let sub = this.masterService.masterPostmethod("/saveBatchPrice", { mode: this.mode, data: submitData })
                .subscribe(data => {
                    this.loadingService.hide();
                    if (data.status == 'ok') {
                        this.alertService.success("Batch Saved Successfully");
                        this.preventNavigation.preventNavigation(false);
                        setTimeout(() => {
                            this.router.navigate([this.returnUrl]);
                        }, 1000)
                    }
                    else {
                        //alert(data.result);
                        //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            //
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }

                        this.alertService.error("Error in Saving Data:" + data.result._body);
                        //console.log(data.result._body); 
                    }
                },
                    error => {
                        this.alertService.error(error);
                    }
                );
            this.subcriptions.push(sub);
        }
        catch (e) {
            //alert(e);
        }
    }

    disabled() {
        try {
            if (this.mode == 'view') {
                return "#EBEBE4";
            } else {
                return "";
            }
        } catch (ex) {
            console.log(ex);
            this.alertService.error(ex);
        }
    }

    editDisabled() {
        try {
            if (this.mode == "edit") {
                return "#EBEBE4";
            } else {
                return "";
            }
        } catch (ex) {
            console.log(ex);
            this.alertService.error(ex);
        }
    }
    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        this.loginModal.hide();
    }
}