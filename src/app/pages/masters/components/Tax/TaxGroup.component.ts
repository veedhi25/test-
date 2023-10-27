import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import { Warehouse } from "../../../../common/interfaces/TrnMain";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { TaxGroupService } from "./TaxService";
import { Tax } from "../../../../common/interfaces/Tax";
import { AuthService } from "../../../../common/services/permission";
@Component({
  selector: "TaxGroup",
  templateUrl: "./TaxGroup.html",
  styleUrls: ["../../../modal-style.css", "../../../../common/Transaction Components/halfcolumn.css"]
})
export class TaxGroupComponent implements OnInit, OnDestroy {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  warehouse: Warehouse = <Warehouse>{};
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  form: FormGroup;
  StateList: any[] = [];
  PCL_List: any[] = [];
  MCODE: any;
  TAX: Tax = <Tax>{};
  private subcriptions: Array<Subscription> = [];
  userProfile:any;
  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected service: TaxGroupService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public authservice:AuthService
  ) { }

  ngOnInit() {
    try {
      this.form = this.fb.group({
        MCODE: ["", [Validators.required]],
        DESCRIPTION: ["", [Validators.required]],
        HSNCODE: [""],
        PCL: ["",[Validators.required]],
        TAX: ["",[Validators.required]],
        TAXGROUP: [""],
        STATUS: [1],
        STATE: ["",[Validators.required]],
        PRODUCTHEIRARCHYLEVEL: [""],
        CreateBy:[''],
        ID:[0]
      });

      this.masterService.getState().subscribe(res => {
        if (res.status == 'ok') {
          this.StateList = res.result;
        }
      })
      this.service.getAllPCL().subscribe(res => {
        if (res.status == 'ok') {
          this.PCL_List = res.result;
          // if(this.PCL_List!=null){
          //   this.form.patchValue({STATUS:this.PCL_List[0]})
          // }
        }
      })
      this.userProfile = this.authservice.getUserProfile()
      this.form.patchValue({CreateBy:this.userProfile.username})
     
      this.onFormChanges();

      if (!!this._activatedRoute.snapshot.params["mode"]) {

        if (this._activatedRoute.snapshot.params["mode"] == "view") {
          this.viewMode = true;
          this.form.get("MCODE").disable();
          this.form.get("DESCRIPTION").disable();
          this.form.get("HSNCODE").disable();
          this.form.get("PCL").disable();
          this.form.get("TAX").disable();
          this.form.get("TAXGROUP").disable();
          this.form.get("STATUS").disable();
          this.form.get("STATE").disable();
          this.form.get("PRODUCTHEIRARCHYLEVEL").disable();
        }
      }
      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }

     
      if (!!this._activatedRoute.snapshot.params["ID"]) {
        let ID: number=0;
        ID = this._activatedRoute.snapshot.params["ID"];
        this.loadingService.show("Getting data, Please wait...");
        this.service.getTAXfromMCODE(ID).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              console.log(data);
              this.form.patchValue({
                MCODE: data.result.MCODE,
                DESCRIPTION: data.result.DESCRIPTION,
                PRODUCTHEIRARCHYLEVEL: data.result.PRODUCTHEIRARCHYLEVEL,
                HSNCODE: data.result.HSNCODE,
                PCL: data.result.PCL,
                TAX: data.result.TAX,
                TAXGROUP: data.result.TAXGROUP,
                STATE: data.result.STATE,
                STATUS: data.result.STATUS,
                ID:data.result.ID
              });
              this.MCODE=data.result.MCODE
              if (this._activatedRoute.snapshot.params["mode"] == "edit") {
                this.modeTitle = "Edit Tax";
              } else if (
                this._activatedRoute.snapshot.params["mode"] == "view"
              ) {
                this.modeTitle = "View Tax";
              }
              this.mode = "edit";
              this.initialTextReadOnly = true;
            } else {
              this.mode = "";
              this.modeTitle = "Edit -Error in Tax";
              this.initialTextReadOnly = true;
            }
          },
          error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2 -Error in TaxGroup";
            this.masterService.resolveError(error, "TaxGroup - TaxGroup");
          }
        );
      } else {
        this.mode = "add";
        this.modeTitle = "Add TAX";
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


      let saveModel = Object.assign(<Tax>{}, this.form.value);
      
      this.loadingService.show("Saving data, please wait...");
      let sub = this.service
        .saveTax(this.mode, saveModel)
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
              this.loadingService.hide();
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
  model1Closed() {
    this.masterService.PlistTitle = "";
  }
  ItemkeyEvent() {

    this.masterService.PlistTitle = "itemList";

  }
  dblClickPopupItem(value) {

    this.masterService.PlistTitle = "";
    this.form.patchValue({
      MCODE: value.MCODE,
      DESCRIPTION: value.DESCA
    })
    this.MCODE = value.MCODE;
    
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
