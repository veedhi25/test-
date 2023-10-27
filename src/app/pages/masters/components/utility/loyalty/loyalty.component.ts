import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MasterRepo } from "../../../../../common/repositories/masterRepo.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { Loyalty } from "../../../../../common/interfaces/loyalty.interface";
import { AuthService } from "../../../../../common/services/permission";
@Component({
  selector: "app-loyalty",
  templateUrl: "./loyalty.component.html",
  styleUrls: ["../../../../modal-style.css"]
})
export class LoyaltyComponent implements OnInit {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  LID: number;
  private returnUrl: string;
  loyalty: Loyalty;
  LCODE: any;
  uneditableStatus: boolean = false;
  categoryList: any;
  outletList: any[] = [];
  multiselectOutLetSetting: any = {
    singleSelection: false,
    text: 'Select Outlets',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    searchBy: [],
    maxHeight: 300,
    badgeShowLimit: 999999999999,
    classes: '',
    disabled: false,
    searchPlaceholderText: 'Search',
    showCheckbox: true,
    noDataLabel: 'No Data Available',
    searchAutofocus: true,
    lazyLoading: false,
    labelKey: 'COMPANYID',
    primaryKey: 'COMPANYID',
    position: 'bottom'

  };
  
  constructor(

    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    private router: Router,
    private authService: AuthService,

    private _activatedRoute: ActivatedRoute,


  ) { 
    if(this.authService.getAuth().profile.CompanyInfo.isHeadoffice==1){
    this.masterService.masterGetmethod_NEW("/getoutlets").subscribe((res) => {
      if (res.status == "ok") {
        this.outletList = res.result;
      }
    })
  }
  }

  ngOnInit() {
    //console.log("category name ", this.loyalty.CATEGORY_NAME);
    this.getCategoryList();
    let auth = this.authService.getAuth()
    try {
      this.loyalty = new Loyalty();
      this.loyalty.STATUS = "InActive";
      this.loyalty.RANGE = [{
        LCODE: 0,
        MINAMNT: 0,
        MAXAMNT: 0,
        INCREMENTALVALUE: 0,
        EARNPOINTS: 0
      }];
      this.loyalty.outletList=[];
      this.StatusEditable();
      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }
      if (this._activatedRoute.snapshot.params["mode"] === "add") {
        this.mode = "add";
        this.modeTitle = "Add Loyalty";
      }
      if (this._activatedRoute.snapshot.params["mode"] === "edit") {
        this.mode = "edit";
        this.modeTitle = "Edit Loyalty";
        this.LCODE = this._activatedRoute.snapshot.params["LCODE"]
        
        this.masterService.masterGetmethod(`/getLoyalty/?LCODE=${this.LCODE}`).subscribe(
          (res) => {
            if (res.status = "ok") {
              let obj = res.result;
              obj.STATUS = obj.STATUS == true ? "Active" : "InActive";
              this.loyalty = obj;
            }
          });
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  getCategoryList() {
    this.masterService.getAllCustomerCategory().subscribe(res => {
      if (res.length > 0) {
        this.categoryList = res;
      } else {
        this.alertService.error("No Category Found");
      }
    })
  }
  addToRange() {
    this.loyalty.RANGE.push({
      LCODE: 0,
      MINAMNT: 0,
      MAXAMNT: 0,
      INCREMENTALVALUE: 0,
      EARNPOINTS: 0
    });
  }
  RemoveFromRange() {
    this.loyalty.RANGE.pop();
  }
  cancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  onSave() {
    try {
      if (!this.loyalty.LNAME) {
        alert('name cannot be empty');
        return;
      }
      if (!this.loyalty.STATUS) {
        alert('status cannot be empty');
        return;
      }
      if (!this.loyalty.MINREDEEMAMNT) {
        alert('minimum redeem amount cannot be empty');
        return;
      }
      if (this.loyalty.MINREDEEMAMNT <= 0) {
        alert('minimum redeem amount cannot be less than or equal to 0');
        return;
      }
      for (let r of this.loyalty.RANGE) {
        if (r.MINAMNT <= 0 || r.MAXAMNT <= 0) {
          alert('amount should be greater than 0.');
          return;
        }
        if (r.MAXAMNT <= r.MINAMNT) {
          alert("To amount should be greater than From amount.");
          return;
        }
        for (let m of this.loyalty.RANGE) {
          let last = m;
          for (let r of this.loyalty.RANGE) {
            if (m != r) {
              if (last.MINAMNT < r.MINAMNT && last.MAXAMNT >= r.MINAMNT) {

              }
              if (last.MINAMNT == r.MINAMNT && last.MAXAMNT <= r.MAXAMNT) {
                alert("no range should fall in between other range");
                return;
              }
              else if (last.MINAMNT > r.MINAMNT && last.MAXAMNT <= r.MAXAMNT) {
                alert("no range should fall in between other range");
                return;
              } else if (last.MINAMNT > r.MAXAMNT && last.MAXAMNT > r.MAXAMNT) {

              }
            }
          }
        }
      }
      this.onsubmit();
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  onsubmit() {
    try {
      let saveModel = Object.assign(<Loyalty>{}, this.loyalty);
      //saveModel.STATUS = this.form.controls['STATUS'].value == "1" ? true : false;
      //console.log(saveModel); return;
      this.loadingService.show("Saving data, please wait...");
      let bodyData: any = {}
      if (this.mode == "edit") {
        bodyData = {
          data: saveModel,
          LCODE: this.LCODE,
          mode: this.mode
        }
      }
      else {
        bodyData = {
          data: saveModel,
          mode: this.mode
        }
      }
      this.masterService
        .masterPostmethod('/saveLoyalty', bodyData)
        .subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              this.alertService.success("Success");
            }
            else if (data.status == "error") {
              this.alertService.error(data.message);
            } else {
              this.alertService.error(data.result._body);
            }
          },
          error => {
            this.loadingService.hide();
            this.alertService.error(error);
          }
        );

    } catch (e) {
      this.alertService.error(e);
    }
  }
  StatusEditable() {
    
    this.masterService.masterGetmethod('/getAllLoyalty').subscribe(
      (res) => {
        if (res.status == "ok") {
          if (res.result != null) {
            let list = res.result
            list.forEach(e => {
              if (e.STATUS == true) {
                this.uneditableStatus = true;
              }
              console.log('this.uneditableStatus', this.uneditableStatus);
            });
          }
        }
      });
  }
  onMultiSelect(event) {

  }
}
