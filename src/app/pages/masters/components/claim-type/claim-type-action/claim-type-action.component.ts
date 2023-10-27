import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap"; 
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PreventNavigationService } from "../../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { MasterRepo } from "../../../../../common/repositories";
import { AddClaimTypeService } from "../claim-type.service";
import { ClaimTypeMaster } from "../../../../../common/interfaces/claim-type.interface";
import { CustomValidators } from "../../../../../common/validators/custom-validators";

@Component({
  selector: "claim-type-action",
  templateUrl: "./claim-type-action.component.html", 
  providers: [AddClaimTypeService],
  styleUrls: ["../../../../modal-style.css"]
})
export class ClaimTypeActionComponent implements OnInit, OnDestroy {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = ""; 
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  form: FormGroup;
  private subcriptions: Array<Subscription> = [];
  claimType : any = <any>{};

  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected service: AddClaimTypeService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    try {
      this.form = this.fb.group({
        ClaimTypeName: ["", [Validators.required, CustomValidators.validateCharacters]], 
        STATUS : [1]
      });

      this.onFormChanges();
      
      if (!!this._activatedRoute.snapshot.params["mode"]) {
        if (this._activatedRoute.snapshot.params["mode"] == "view") {
          this.viewMode = true;
          this.form.get("ClaimTypeName").disable(); 
          this.form.get("STATUS").disable();
        }
      }
      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }
      if (!!this._activatedRoute.snapshot.params["name"]) {
        let claimTypeName: string = "";
        claimTypeName = this._activatedRoute.snapshot.params["name"];
        this.loadingService.show("Getting data, Please wait...");
        this.service.getClaimType(claimTypeName).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              console.log(data);
              this.claimType = data.result;
              this.form.patchValue({
                ClaimTypeName: this.claimType.ClaimTypeName, 
                STATUS: this.claimType.STATUS 
              });

              if (this._activatedRoute.snapshot.params["mode"] == 'edit') {
                this.modeTitle = "Edit Claim Type";
              } else if (
                this._activatedRoute.snapshot.params["mode"] == "view"
              ) {
                this.modeTitle = "View SalClaimesman Type";
              }
              this.mode = "edit";
              this.initialTextReadOnly = true;
            } else {
              this.mode = "";
              this.modeTitle = "Edit -Error in Claim Type";
              this.initialTextReadOnly = true;
            }
          },
          error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2 -Error in Claim Type";
            this.masterService.resolveError(error, "Claim Type - getClaimType");
          }
        );
      } else {
        this.mode = "add";
        this.modeTitle = "Add Claim Type";
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
      let saveModel = Object.assign(<ClaimTypeMaster>{}, this.form.value); 
      saveModel.STATUS = saveModel.STATUS ? 1 : 0
 
      if(this.mode == 'edit'){
        this.claimType.STATUS = saveModel.STATUS ? 1 : 0;
        this.claimType.ClaimTypeName = saveModel.ClaimTypeName;
      }else {
        this.claimType = saveModel
      }

      this.loadingService.show("Saving data, please wait...");
      let sub = this.masterService
        .saveClaimType(this.mode, this.claimType) 
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
