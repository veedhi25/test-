import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PreventNavigationService } from "../../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { OrganizationType } from "../../../../../common/interfaces/organization-type.interface";

import { SalesAreaTypeService } from "../sales-area-type.service";
import { SalesAreaType } from "../../../../../common/interfaces/sales-area-type.interface";



@Component({
  selector: "add-sales-area-type",
  templateUrl: "./add-sales-area.comonent.html",
  styleUrls: ["../../../../modal-style.css"]
})
export class SalesAreaTypeFormComponent implements OnInit, OnDestroy {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  salesAreaTypeObj: SalesAreaType = <SalesAreaType>{};
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  form: FormGroup;
  chanels : any[] = [];
  private subcriptions: Array<Subscription> = [];

  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected salesAreaTypeService: SalesAreaTypeService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.getParent();
  }

  ngOnInit() {
    try {
      this.form = this.fb.group({
        SalesAreaTypeCode: ["0"],
        SalesAreaTypeName: [""],
        ParentSalesAreaTypeCode: [""],
        STATUS: ["1"]

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
      if (!!this._activatedRoute.snapshot.params["salesAreaTypeCode"]) {
        let WarehouseName: string = "";
        WarehouseName = this._activatedRoute.snapshot.params["salesAreaTypeCode"];
        this.loadingService.show("Getting data, Please wait...");
        this.salesAreaTypeService.getSalesAreaType(WarehouseName).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              console.log("sales Area Type code"+data);
              this.form.patchValue({
                SalesAreaTypeCode: data.result.SalesAreaTypeCode,
                SalesAreaTypeName: data.result.SalesAreaTypeName,
                ParentSalesAreaTypeCode: data.result.ParentSalesAreaTypeCode,
                STATUS: data.result.STATUS 
              });

              if (this._activatedRoute.snapshot.params["mode"] == null) {
                this.modeTitle = "Edit Sales Area Type";
              } else if (
                this._activatedRoute.snapshot.params["mode"] == "view"
              ) {
                this.modeTitle = "View Sales Area Type";
              }
              this.mode = "edit";
              this.initialTextReadOnly = true;
            } else {
              this.mode = "";
              this.modeTitle = "Edit -Error in Sales Area Type";
              this.initialTextReadOnly = true;
            }
          },
          error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2 -Error in SalesAreaType";
            this.masterService.resolveError(error, "SalesAreaType - getSalesAreaType");
          }
        );
      } else {
        this.mode = "add";
        this.modeTitle = "Add Sales Area  Type";
        this.initialTextReadOnly = false;
      }
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
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
   
      let saveModel = Object.assign(<OrganizationType>{}, this.form.value); 
      this.loadingService.show("Saving data, please wait...");
      let bodyData = { mode: this.mode, data:saveModel}
      console.log("Sales Area type"+bodyData);
      let sub = this.masterService
        .masterPostmethod('/saveSalesAreaType', bodyData) 
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

  getParent(){
   
    this.chanels = [];
    this.salesAreaTypeService.getParentSalesAreaTypeCode().subscribe(
        (res) => {
            console.log("Sales man"+JSON.stringify(res));
            this.chanels = res;
        }
    )
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
