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
import { BrandTypeListService } from "../brand-type.service";


@Component({
  selector: "brand-type-selector",
  templateUrl: "./add-brand-type.component.html",

  providers: [BrandTypeListService],
  styleUrls: ["../../../../modal-style.css"]
})
export class BrandTypeFormComponent implements OnInit, OnDestroy {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  warehouse: BrandType = <BrandType>{};
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  form: FormGroup;
  private subcriptions: Array<Subscription> = [];

  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected service: BrandTypeListService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    try {
      this.form = this.fb.group({
        BrandTypeCode: ["0"],  
        BrandTypeName: ["", [Validators.required]],
        Status : [1]
        
      });

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
      if (!!this._activatedRoute.snapshot.params["brandTypeCode"]) {
        let WarehouseName: string = "";
        WarehouseName = this._activatedRoute.snapshot.params["brandTypeCode"];
        this.loadingService.show("Getting data, Please wait...");
        this.service.getBrandType(WarehouseName).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              console.log("Brand type data"+data);
              this.form.patchValue({
                BrandTypeCode: data.result.BrandTypeCode,
                BrandTypeName: data.result.BrandTypeName,
                Status: data.result.Status 
              });

              if (this._activatedRoute.snapshot.params["mode"] == null) {
                this.modeTitle = "Edit Brand Type";
              } else if (
                this._activatedRoute.snapshot.params["mode"] == "view"
              ) {
                this.modeTitle = "View Brand Type";
              }
              this.mode = "edit";
              this.initialTextReadOnly = true;
            } else {
              this.mode = "";
              this.modeTitle = "Edit -Error in Brand Type";
              this.initialTextReadOnly = true;
            }
          },
          error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2 -Error in Brand Type";
            this.masterService.resolveError(error, "BrandType - getBrandType");
          }
        );
      } else {
        this.mode = "add";
        this.modeTitle = "Add Brand Type";
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
   
      let saveModel = Object.assign(<BrandType>{}, this.form.value); 
      this.loadingService.show("Saving data, please wait...");
      let bodyData = { mode: this.mode, data:saveModel}
      let sub = this.masterService
        .masterPostmethod('/saveBrandType', bodyData) 
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
      console.log(ex);
      this.alertService.error(ex);
    }
  }
}
