import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Transporter } from "../../../../common/interfaces/transporter.interface";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AuthService } from "../../../../common/services/permission";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { TransporterService } from "../../../masters/components/utility/transporter/transporter.service";


@Component({
  selector: "dsmvsminamount",
  templateUrl: "./dsmvsminamount.component.html"
})
export class DSMVSMinAmountComponent implements OnInit {
  returnUrl: any;
  dsmObj: any = <any>{};
  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    private router: Router,
    private authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    let auth = this.authService.getAuth()
    try {

      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }
      this.loadingService.show("Getting data, Please wait...");
      let dsmcode = this._activatedRoute.snapshot.params["dsmcode"];
      this.masterService.masterGetmethod(`/getdsminfo?code=${dsmcode}`).subscribe((data) => {
        this.loadingService.hide();
        if (data.status == "ok") {
          this.dsmObj = data.result;
        }
      }, error => {
        this.alertService.error(error)
      })

    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  cancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }



  onSave() {
    this.loadingService.show("Saving data, please wait...");

    this.masterService.masterPostmethod('/savedsminfo', this.dsmObj).subscribe(
      data => {
        this.loadingService.hide();
        if (data.status == "ok") {
          this.alertService.success("Data Saved Successfully");
          this.router.navigate([this.returnUrl]);
        }
      },
      error => {
        this.loadingService.hide();
        this.alertService.error(error);
      }
    );

  }


}
