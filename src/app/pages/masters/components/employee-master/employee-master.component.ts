import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";


@Component({
  selector: "employee-master",
  templateUrl: "employee-master.component.html",
})
export class EmployeeMasterComponent implements OnInit {

  public employee: any = <any>{};
  returnUrl: any;

  constructor(private spinnerService: SpinnerService, private _activatedRoute: ActivatedRoute, private alertService: AlertService, private masterService: MasterRepo, private router: Router) {

  }


  ngOnInit() {
    if (!!this._activatedRoute.snapshot.params["mode"])
      this.employee.MODE = this._activatedRoute.snapshot.params["mode"];

    if (!!this._activatedRoute.snapshot.params["ACID"])
      this.employee.ACID = this._activatedRoute.snapshot.params["ACID"];
    if (!!this._activatedRoute.snapshot.params["returnUrl"])
      this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];



    if (this.employee.MODE == "edit") {
      let param = {
        data: {
          ACID: this.employee.ACID
        },
        mode: "query"
      }
      this.masterService.masterPostmethod("/getAccount", param).subscribe((res) => {
        this.employee.ACID = res.result.ACID;
        this.employee.ACNAME = res.result.ACNAME;
        this.employee.EMAIL = res.result.EMAIL;
        this.employee.MOBILE = res.result.MOBILE;
      })
    }
    if (this.employee.MODE == "view") {
      let param = {
        data: {
          ACID: this.employee.ACID
        },
        mode: "query"
      }
      this.masterService.masterPostmethod("/getAccount", param).subscribe((res) => {
        this.employee.ACID = res.result.ACID;
        this.employee.ACNAME = res.result.ACNAME;
        this.employee.EMAIL = res.result.EMAIL;
        this.employee.MOBILE = res.result.MOBILE;
      })
    }
  }




  onSaveClicked = (): void => {



    this.spinnerService.show("Please Wait while saving data.")
    this.masterService.masterPostmethod_NEW("/saveEmployee", this.employee).subscribe((res) => {
      this.spinnerService.hide();
      if (res.status == "ok") {
        this.employee = <any>{};
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