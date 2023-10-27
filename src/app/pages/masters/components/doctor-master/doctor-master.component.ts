import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";


@Component({
  selector: "doctor-master",
  templateUrl: "doctor-master.component.html",
})
export class DoctorMasterComponent implements OnInit {

  public doctor: any = <any>{};
  returnUrl: any;

  constructor(private spinnerService: SpinnerService, private _activatedRoute: ActivatedRoute, private alertService: AlertService, private masterService: MasterRepo, private router: Router) {

  }


  ngOnInit() {
    if (!!this._activatedRoute.snapshot.params["mode"])
      this.doctor.MODE = this._activatedRoute.snapshot.params["mode"];

    if (!!this._activatedRoute.snapshot.params["ACID"])
      this.doctor.ACID = this._activatedRoute.snapshot.params["ACID"];
    if (!!this._activatedRoute.snapshot.params["returnUrl"])
      this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];



    if (this.doctor.MODE == "edit") {
      let param = {
        data: {
          ACID: this.doctor.ACID
        },
        mode: "query"
      }
      this.masterService.masterPostmethod("/getAccount", param).subscribe((res) => {
        this.doctor.ACID = res.result.ACID;
        this.doctor.ACNAME = res.result.ACNAME;
        this.doctor.EMAIL = res.result.EMAIL;
        this.doctor.MOBILE = res.result.MOBILE;
        this.doctor.AREA = res.result.AREA;
        this.doctor.LANDMARK = res.result.LANDMARK;
        this.doctor.shortname = res.result.shortname;
      })
    }
    else if (this.doctor.MODE == "view") {
      let param = {
        data: {
          ACID: this.doctor.ACID
        },
        mode: "query"
      }
      this.masterService.masterPostmethod("/getAccount", param).subscribe((res) => {
        this.doctor.ACID = res.result.ACID;
        this.doctor.ACNAME = res.result.ACNAME;
        this.doctor.EMAIL = res.result.EMAIL;
        this.doctor.MOBILE = res.result.MOBILE;
        this.doctor.AREA = res.result.AREA;
        this.doctor.LANDMARK = res.result.LANDMARK;
        this.doctor.shortname = res.result.shortname;
      })
    }
  }




  onSaveClicked = (): void => {



    this.spinnerService.show("Please Wait while saving data.")
    this.masterService.masterPostmethod_NEW("/saveDoctor", this.doctor).subscribe((res) => {
      this.spinnerService.hide();
      if (res.status == "ok") {
        this.doctor = <any>{};
        this.back();
      } else {
        this.alertService.error(res.message);
      }
    }, error => {
      this.spinnerService.hide();

    })
  }

  back = (): void => {
    this.router.navigate([this.returnUrl]);

  }
}