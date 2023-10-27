import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PreventNavigationService } from "../../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { Transporter } from "../../../../../common/interfaces/transporter.interface";
import { AuthService } from "../../../../../common/services/permission";
import { TransporterService } from "./transporter.service";


@Component({
  selector: "app-transporter",
  templateUrl: "./transporter.component.html",
  styleUrls: ["../../../../modal-style.css"]
})
export class TransporterComponent implements OnInit, OnDestroy {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  private returnUrl: string;
  form: FormGroup;
  private subcriptions: Array<Subscription> = [];
  @ViewChild('NAME') NAME: ElementRef;
  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    private router: Router,
    private authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected service: TransporterService,
  ) { }

  ngOnInit() {
    
    let auth = this.authService.getAuth()
    try {
      this.form = this.fb.group({
        NAME: ["", [Validators.required]],
        PHONE: [''],
        COMPANYID: [auth.profile.CompanyInfo.COMPANYID],
        TRANSMODE: [1],
        ADDRESS: [''],
        AREA: [''],
        EMAIL: [''],
        GSTNO: [''],
        PANNO: [''],
        STATUS: [1],
        TRANSPORTERID: [''],
        VEHICLENO: ['']


      });

      this.onFormChanges();


      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }
      if (this._activatedRoute.snapshot.params["mode"] === "add") {

        this.mode = "add";
        this.modeTitle = "Add Transporter";
        this.NAME.nativeElement.focus()
      } else if (this._activatedRoute.snapshot.params["mode"] === "edit") {
        this.mode = "edit";
        this.modeTitle = "Edit Transporter";
        this.loadingService.show("Getting data, Please wait...");
        let transporterId = this._activatedRoute.snapshot.params["transporterId"];
        this.service.getTransporter(transporterId).subscribe((data) => {
          this.loadingService.hide();
          if (data.status == "ok") {
            this.form.patchValue({
              NAME: data.result.NAME,
              ADDRESS: data.result.ADDRESS,
              PHONE: data.result.PHONE,
              COMPANYID: data.result.COMPANYID,
              TRANSMODE: data.result.TRANSMODE,
              AREA: data.result.AREA,
              STATUS: data.result.STATUS,
              VEHICLENO: data.result.VEHICLENO,
              GSTNO: data.result.GSTNO,
              PANNO: data.result.PANNO,
              EMAIL: data.result.EMAIL,
              TRANSPORTERID: data.result.TRANSPORTERID
            });
          }


        }, error => {
          this.alertService.error(error)
        })
      }
      else if (this._activatedRoute.snapshot.params["mode"] === "view") {
        this.mode = "view";
        this.modeTitle = "View Transporter";
        this.loadingService.show("Getting data, Please wait...");
        let transporterId = this._activatedRoute.snapshot.params["transporterId"];
        this.service.getTransporter(transporterId).subscribe((data) => {
          this.loadingService.hide();
          if (data.status == "ok") {
            this.form.patchValue({
              NAME: data.result.NAME,
              ADDRESS: data.result.ADDRESS,
              PHONE: data.result.PHONE,
              COMPANYID: data.result.COMPANYID,
              TRANSMODE: data.result.TRANSMODE,
              AREA: data.result.AREA,
              STATUS: data.result.STATUS,
              VEHICLENO: data.result.VEHICLENO,
              GSTNO: data.result.GSTNO,
              PANNO: data.result.PANNO,
              EMAIL: data.result.EMAIL,
              TRANSPORTERID: data.result.TRANSPORTERID
            });
          }


        }, error => {
          this.alertService.error(error)
        })
      }
    } catch (ex) {
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

      let saveModel = Object.assign(<Transporter>{}, this.form.value);
      
      this.loadingService.show("Saving data, please wait...");
      let bodyData = { mode: this.mode, data: saveModel }
      let sub = this.masterService
        .masterPostmethod('/saveTransporter', bodyData)
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
