import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import { Warehouse } from "../../../../common/interfaces/TrnMain";
import { AddWarehouseService } from "./addWarehouse.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PreventNavigationService } from "../../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { OrganizationType } from "../../../../../common/interfaces/organization-type.interface";

import { BrandType } from "../../../../../common/interfaces/brand-type.interface";
import { BrandService } from "../brand.service";
import { Brand } from "../../../../../common/interfaces";


@Component({
    selector: "brand-selector",
    templateUrl: "./add-brand.component.html",

    providers: [BrandService],
    styleUrls: ["../../../../modal-style.css"]
})
export class BrandFormComponent implements OnInit, OnDestroy {
    viewMode = false;
    mode: string = "add";
    modeTitle: string = "";
    warehouse: Brand = <Brand>{};
    initialTextReadOnly: boolean = false;
    private returnUrl: string;
    form: FormGroup;
    ParentCodeList: any[] = [];
    BrandTypeList: any[] = [];
    pclist: any[] = [];
    private subcriptions: Array<Subscription> = [];

    constructor(
        private preventNavigationService: PreventNavigationService,
        private alertService: AlertService,
        private loadingService: SpinnerService,
        protected masterService: MasterRepo,
        protected brandService: BrandService,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.getBrandType();
        this.getProductCategory();
        // this.getParent();
        // this.getProductCategory();

    }

    ngOnInit() {
        try {
            this.form = this.fb.group({
                BrandId: [""],
                BrandName: ["", [Validators.required]],
                BRANDCODE: [""],
                PARENTBRANDCODE: [""],
                TYPE: [""],
                PCL: [""],
                STATUS: [1]
            });
            this.form.patchValue({
                
            })
            this.onFormChanges();

            if (!!this._activatedRoute.snapshot.params["mode"]) {
                if (this._activatedRoute.snapshot.params["mode"] == "view") {
                    this.viewMode = true;
                    this.form.get("NAME").disable();
                    this.form.get("ADDRESS").disable();
                    this.form.get("PHONE").disable();
                    this.form.get("REMARKS").disable();
                }
            }
            if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
                this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
            }
            if (!!this._activatedRoute.snapshot.params["BrandName"]) {
                let brandName: string = "";
                brandName = this._activatedRoute.snapshot.params["BrandName"];
                this.loadingService.show("Getting data, Please wait...");
                this.brandService.getBrand(brandName).subscribe(
                    data => {
                        this.loadingService.hide();
                        if (data.status == "ok") {
                            console.log("Brand  data" + data);
                            this.form.patchValue({

                                // BrandId: data.result.BrandId,
                                BrandName: data.result.BrandName,
                                BRANDCODE: data.result.BRANDCODE,
                                PARENTBRANDCODE: data.result.PARENTBRANDCODE,
                                TYPE: data.result.TYPE,
                                PCL: data.result.PCL,
                                STATUS: data.result.STATUS

                            });

                            if (this._activatedRoute.snapshot.params["mode"] == null) {
                                this.modeTitle = "Edit Brand ";
                            } else if (
                                this._activatedRoute.snapshot.params["mode"] == "view"
                            ) {
                                this.modeTitle = "View Brand ";
                            }
                            this.mode = "edit";
                            this.initialTextReadOnly = true;
                        } else {
                            this.mode = "";
                            this.modeTitle = "Edit -Error in Brand ";
                            this.initialTextReadOnly = true;
                        }
                    },
                    error => {
                        this.loadingService.hide();
                        this.mode = "";
                        this.modeTitle = "Edit2 -Error in Brand ";
                        this.masterService.resolveError(error, "Brand - getBrand");
                    }
                );
            } else {
                this.mode = "add";
                this.modeTitle = "Add Brand ";
                this.initialTextReadOnly = false;
            }
        } catch (ex) {
            console.log(ex);
            this.alertService.error(ex);
        }
    }

    onFormChanges(): void {
        this.form.valueChanges.subscribe(val => {
            if (this.form.dirty)
                this.preventNavigationService.preventNavigation(true);
        });
    }

    cancel() {
        try {
            this.router.navigate([this.returnUrl]);
        } catch (ex) {
            console.log(ex);
            this.alertService.error(ex);
        }
    }

    ngOnDestroy() {
        try {
            this.subcriptions.forEach(subs => {
                subs.unsubscribe();
            });
        } catch (ex) {
            console.log(ex);
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
            console.log(ex);
            this.alertService.error(ex);
        }
    }

    onsubmit() {
        try {

            let saveModel = Object.assign(<Brand>{}, this.form.value);
            this.loadingService.show("Saving data, please wait...");
            let bodyData = { mode: this.mode, data: saveModel }
            console.log("Brand" + bodyData);
            let sub = this.masterService
                .masterPostmethod('/saveProductBrand', bodyData)
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

    getParent(type) {
        //let Type: string = "";
        this.ParentCodeList = [];
        this.brandService.getProductBrandParent(type).subscribe(
            (res) => {
                console.log("brand Parent" + JSON.stringify(res));
                this.ParentCodeList = res;
            }
        )
    }


    getBrandType() {
        //let Type: string = "";
        this.BrandTypeList = [];
        this.brandService.getBrandTypeList().subscribe(
            (res) => {
                console.log("Sales man" + JSON.stringify(res));
                this.BrandTypeList = res;
            }
        )
    }


    getProductCategory() {
        this.masterService.getAllProductCategoryLine().subscribe(
            (res) => {
                console.log("product category line" + JSON.stringify(res));
                this.pclist = res;
            }
        )
    }

    onTypeChange($event){
        this.ParentCodeList = [];
        let BrandType = $event.target.value;
        console.log("Brand Value"+BrandType);
        if(BrandType=="DIVISION"){}
        else{
        this.brandService.getProductBrandLevel(BrandType).subscribe(
            (res) => {
                console.log("brand Parent" + JSON.stringify(res));
                this.ParentCodeList = res;
            }
        );
        }
    }


    onType($event) {
  
        if (this.form.get("TYPE").value == '1') {
            this.form.get("PARENTBRANDCODE").disable()
        }
        else {
            this.form.get("PARENTBRANDCODE").enable()
        }
        if (this.form.get("TYPE").value == '1') return;
        let Type = this.form.get("TYPE").value == '3'
            ? '2'
            : '1'
        this.getParent(Type);
       
    }

    onParentChange($event){
        var asdf = this.ParentCodeList.filter(x => x.BRANDCODE == $event.target.value)[0]
        console.log("pcl value"+JSON.stringify(asdf.PCL));
        this.form.patchValue({
            PCL: asdf.PCL
        })

    }
    

    @ViewChild("loginModal") loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            console.log(ex);
            this.alertService.error(ex);
        }
    }
}
