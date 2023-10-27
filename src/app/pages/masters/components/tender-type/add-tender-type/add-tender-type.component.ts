import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PreventNavigationService } from "../../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";


import { TenderTypeService } from "../tender-type.service";
import { TenderType } from "../../../../../common/interfaces/tender-type-interface";


@Component({
    selector: "tender-type-selector",
    templateUrl: "./add-tender-type.component.html",

    styleUrls: ["../../../../modal-style.css"]
})
export class TenderTypeComponent implements OnInit, OnDestroy {
    viewMode = false;
    mode: string = "add";
    modeTitle: string = "";
    tenderType: TenderType = <TenderType>{};
    initialTextReadOnly: boolean = false;
    private returnUrl: string;
    form: FormGroup;
    ParentCodeList: any[] = [];
    BrandTypeList: any[] = [];
    pclist: any[] = [];
    private subcriptions: Array<Subscription> = [];

    TenderType = false;
    modeType: string;

    constructor(
        private preventNavigationService: PreventNavigationService,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        protected masterService: MasterRepo,
        protected tendertypeService: TenderTypeService,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private fb: FormBuilder
    ) {

    }

    ngOnInit() {
        try {
            this.form = this.fb.group({
                PAYMENTMODEID: [""],
                PAYMENTMODENAME: ["", [Validators.required]],
                TYPE: [""],
                STATUS: ["1"],
                MODE: [""],

            });

            this.onFormChanges();
            if (!!this._activatedRoute.snapshot.params["mode"]) {
                if (this._activatedRoute.snapshot.params["mode"] == "view") {
                    this.viewMode = true;
                    // this.form.get("NAME").disable();
                    // this.form.get("ADDRESS").disable();
                    // this.form.get("PHONE").disable();
                    // this.form.get("REMARKS").disable();
                }
            }
            if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
                this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
            }
            if (!!this._activatedRoute.snapshot.params["tenderTypeId"]) {
                let WarehouseName: string = "";
                WarehouseName = this._activatedRoute.snapshot.params["tenderTypeId"];
                this.loadingService.show("Getting data, Please wait...");
                this.tendertypeService.getTenderType(WarehouseName).subscribe(
                    data => {
                        this.loadingService.hide();
                        if (data.status == "ok") {
                            this.modeType = data.result.TYPE;
                            if (this.modeType == 'Wallet') {
                                this.TenderType = true;
                            }
                            this.form.patchValue({

                                // BrandId: data.result.BrandId,

                                PAYMENTMODEID: data.result.PAYMENTMODEID,
                                PAYMENTMODENAME: data.result.PAYMENTMODENAME,
                                TYPE: data.result.TYPE,
                                STATUS: data.result.STATUS,
                                MODE: data.result.MODE,


                            })


                            if (this._activatedRoute.snapshot.params["mode"] == null) {
                                this.modeTitle = "Edit Tender Type ";
                            } else if (this._activatedRoute.snapshot.params["mode"] == "view") {
                                this.modeTitle = "View Tender Type ";
                            }
                            this.mode = "edit";
                            this.initialTextReadOnly = true;
                        } else {
                            this.mode = "";
                            this.modeTitle = "Edit -Error in Tedner Type ";
                            this.initialTextReadOnly = true;
                        }
                    },
                    error => {
                        this.loadingService.hide();
                        this.mode = "";
                        this.modeTitle = "Edit2 -Error in Tender Type ";
                        this.masterService.resolveError(error, "TenderType - TenderType");
                    }
                );
            } else {
                this.mode = "add";
                this.modeTitle = "Add Tender Type ";
                this.initialTextReadOnly = false;
            }
        } catch (ex) {

            this.alertService.error(ex);
        }
    }

    TenderTypeChange($event) {
        if (this.form.get("TYPE").value == 'Wallet') {
            this.TenderType = true;
            this.form.patchValue({
                MODE: 'Manual'
            })
        } else {
            this.TenderType = false;
        }
    }

    onFormChanges(): void {
        this.form.valueChanges.subscribe(() => {
            if (this.form.dirty)
                this.preventNavigationService.preventNavigation(true);
        });
    }

    cancel() {
        try {
            this.router.navigate([this.returnUrl]);
        } catch (ex) {
            this.alertService.error(ex);
        }
    }

    ngOnDestroy() {
        try {
            this.subcriptions.forEach(subs => {
                subs.unsubscribe();
            });
        } catch (ex) {
            this.alertService.error(ex);
        }
    }

    disabled() {
        try {
            if (this.viewMode == true) {
                return "#EBEBE4";
            } else {
                return "";
            }
        } catch (ex) {
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
            this.alertService.error(ex);
        }
    }

    onSave() {
        try {
            //validate before Saving
            if (!this.form.valid) {
                this.alertService.info(
                    "Invalid Request, Please enter all required fields."
                );
                return;
            }
            this.onsubmit();
        } catch (ex) {
            this.alertService.error(ex);
        }
    }

    onsubmit() {
        try {

            let saveModel = Object.assign(<TenderType>{}, this.form.value);
            this.loadingService.show("Saving data, please wait...");
            let bodyData = { mode: this.mode, data: saveModel }
            let sub = this.masterService
                .masterPostmethod('/saveFirstTenderType', bodyData)
                .subscribe(
                    data => {
                        this.loadingService.hide();
                        if (data.status == "ok") {
                            this.alertService.success("Data Saved Successfully");
                            this.preventNavigationService.preventNavigation(false);
                            setTimeout(() => {
                                this.router.navigate([this.returnUrl]);
                            }, 1000);
                        } else {
                            if (
                                data.result._body ==
                                "The ConnectionString property has not been initialized."
                            ) {
                                this.router.navigate(["/login", this.router.url]);
                                return;
                            }
                            this.alertService.error(
                                `Error in Saving Data: ${data.result._body}`
                            );
                        }
                    },
                    error => {
                        this.loadingService.hide();
                        this.alertService.error(error);
                    }
                );
            this.subcriptions.push(sub);
        } catch (e) {
            this.alertService.error(e);
        }
    }



    @ViewChild("loginModal") loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            this.alertService.error(ex);
        }
    }
}
