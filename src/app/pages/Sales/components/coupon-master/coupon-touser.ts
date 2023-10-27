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
import { BlockLike, HighlightSpanKind } from "typescript";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
@Component({
  selector: "coupontouser",
  templateUrl: "./coupon-touser.html",


})
export class CouponTouser implements OnInit {
  @ViewChild('genericGridCustomer') genericGridCustomer: GenericPopUpComponent;
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  public freeUseFlag: boolean = true;
  public selectAllCouponCode: boolean = false;
  public searchSup: string = "";
  public myStores: any = [];
  public selectedCoupons: string = "";
  public allCoupons: any = [];
  public searchIt: string = "";
  public myCouponsCode: any = [];
  public myCouponsCodefilter: any = [];
  public custArr: any = [];


  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {
    this.gridPopupSettingsForCustomer = Object.assign(new GenericPopUpSettings, {
      title: "Customers",
      apiEndpoints: `/getAccountPagedListByPType/PA/C`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "ACNAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "customerID",
          title: "CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "ADDRESS",
          title: "ADDRESS",
          hidden: false,
          noSearch: false
        },
        {
          key: "PRICELEVEL",
          title: "TYPE",
          hidden: false,
          noSearch: false
        }
      ]

    });
  }

  freeUseFlagChange() {
    this.custArr = null;
    if (!this.freeUseFlag) {
      this.genericGridCustomer.show();
    } else {
      this.genericGridCustomer.hide();
    }
  }

  ngOnInit() {
    this.selectCouponDefination();
  }
  onCustomerSelect(custData) {
    //console.log("custData ", custData);
    this.custArr = custData;
    console.log("cust id ", this.custArr.ACID);
  }

  selectCouponDefination() {
    this.masterService.masterPostmethod('/selectCouponDefinationforcoupontouser', '').subscribe(res => {
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
    this.masterService.masterPostmethod('/selectCouponListByDefAssignToStoreID', requestObj).subscribe(res => {
      this.loadingService.hide();
      if (res.status == "ok") {
        this.myCouponsCode = res.result;
        this.myCouponsCodefilter = res.result;
        if (this.myCouponsCode.length <= 0) {
          this.alertService.error("No Coupon value available");
        }
        //console.log("couponlist ", res.result);
      }
    })
  }


  onSaveClicked() {
    var couponValueArr = [];
    var IssuedTo = null;
    if (!this.freeUseFlag) {
      if (this.custArr.length <= 0) {
        this.alertService.error("Select Customer"); return;
      } else {
        IssuedTo = this.custArr.ACID;
      }
    }
    couponValueArr = this.myCouponsCode.filter(e => e.CouponCodeCheck == true);
    console.log(couponValueArr);
    if (this.selectedCoupons == null || this.selectedCoupons == undefined || this.selectedCoupons == "") {
      this.alertService.error("Select Coupon Type"); return;
    } if (couponValueArr.length <= 0) {
      this.alertService.error("Select At least one coupon"); return;
    }
    this.loadingService.show("Please wait..");
    var requestObject = {
      "IssuedTo": IssuedTo,
      "CouponDefinationId": parseInt(this.selectedCoupons),
      "couponallotValue": couponValueArr,
      "FreetoUseByAnyone": this.freeUseFlag
    }
    try {
      this.masterService.masterPostmethod('/couponIssueTo', requestObject).subscribe(res => {
        this.loadingService.hide();
        if (res.status == "ok") {
          this.alertService.success("Coupon Issued successfully");
          this.selectCouponDefination();
          this.myCouponsCode = null;
          this.myCouponsCodefilter = null;
          //this.selectedCoupons = "";
          IssuedTo = null;
          this.custArr = null;
          this.changeCoupons()
          if (!this.freeUseFlag) {
            this.genericGridCustomer.show();
          }
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
