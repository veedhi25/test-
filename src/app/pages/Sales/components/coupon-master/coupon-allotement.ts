import { Component, ViewChild, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { ModalDirective } from 'ng2-bootstrap';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as XLSX from 'xlsx';
import _ from "lodash";
import { HighlightSpanKind } from "typescript";
@Component({
  selector: "couponallotement",
  templateUrl: "./coupon-allotement.html",


})
export class CouponAllotement implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  public selectAllCouponCode: boolean = false;
  public searchSup: string = "";
  public myStores: any = [];
  public selectedCoupons: string = "";
  public allCoupons: any = [];
  public searchIt: string = "";
  public myCouponsCode: any = [];
  public myCouponsCodefilter: any = [];


  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {
  }

  ngOnInit() {
    this.selectCouponDefination();
    this.getCompanyList();

  }

  selectCouponDefination() {
    this.masterService.masterPostmethod('/selectCouponDefination', '').subscribe(res => {
      if (res.status == 'ok') {
        this.allCoupons = res.result;
        //console.log("coupon defination ", res);
      }
    })
  }
  getSelectAllCouponCode() {
    //console.log(this.selectAllCouponCode);
    this.myCouponsCode.map(e => e.CouponCodeCheck = this.selectAllCouponCode);

  }

  searchMyCouponCode(val: string) {
    this.myCouponsCode = this.myCouponsCodefilter;
    if (val) {
      this.myCouponsCode = this.myCouponsCode.filter(e => {
        if (e.CouponListValue &&
          e.CouponListValue.toLowerCase().includes(val.toLowerCase())) {
          return true
        }
      });
    } else {
      this.myCouponsCode = this.myCouponsCodefilter;
    }
  }

  changeCoupons() {
    this.myCouponsCode = null;
    if (this.selectedCoupons == "" || this.selectedCoupons == null) {
      this.alertService.error("Select Coupon"); return;
    }
    this.loadingService.show("Please wait..");
    
    var requestObj = { CouponDefinationId: this.selectedCoupons };
    this.masterService.masterPostmethod('/selectCouponListByDefId', requestObj).subscribe(res => {
      this.loadingService.hide();
      if (res.status == "ok") {
        this.myCouponsCode = res.result;
        this.myCouponsCodefilter = res.result;
        if (this.myCouponsCode.length < 0) {
          this.alertService.error("No Coupon value available");
        }
        //console.log("couponlist ", res.result);
      }
    })
  }

  getCompanyList() {
    this.masterService.masterPostmethod('/companylist', '').subscribe(res => {
      if (res.status == "ok") {
        this.myStores = res.result;
      }
    })
  }

  onSaveClicked() {
    //if()
    var compArr = [];
    var couponValueArr = [];
    compArr = this.myStores.filter(e => e.compCheck == true);
    couponValueArr = this.myCouponsCode.filter(e => e.CouponCodeCheck == true);
    console.log(compArr);
    console.log(couponValueArr);
    if (compArr.length <= 0 || compArr.length >= 2) {
      this.alertService.error("Check at least one Store"); return;
    } if (this.selectedCoupons == null || this.selectedCoupons == undefined || this.selectedCoupons == "") {
      this.alertService.error("Select Coupon Type"); return;
    } if (couponValueArr.length <= 0) {
      this.alertService.error("Select At least one coupon"); return;
    }
    this.loadingService.show("Please wait..");
    var requestObject = {
      "AssignToStoreID": compArr[0].companyId,
      "CouponDefinationId": this.selectedCoupons,
      "couponallotValue": couponValueArr
    }
    try {
      this.masterService.masterPostmethod('/couponAllotementTo', requestObject).subscribe(res => {
        this.loadingService.hide();
        if (res.status == "ok") {
          this.alertService.success("Coupon alloted successfully");
          this.selectCouponDefination();
          this.myCouponsCode = null;
          this.myCouponsCodefilter = null;
          this.selectedCoupons = "";
        } else {
          this.alertService.error(res.Message);
        }
      });
    }
    catch (e) {
      this.alertService.error(e);
    }
  }

  preventInput($event) {
    $event.preventDefault();
    return false;

  }
  hideChildModal() {
    try {
      this.childModal.hide();
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  @ViewChild('loginModal') loginModal: ModalDirective;
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
}
