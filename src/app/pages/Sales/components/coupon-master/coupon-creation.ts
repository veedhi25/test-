import { Component, ViewChild, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { ModalDirective } from 'ng2-bootstrap';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CouponsModel } from "./couponsModel";

@Component({
  selector: "couponcreation",
  templateUrl: "./coupon-creation.html",

})
export class CouponCreation implements OnInit {
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();


  isReadonly = true;
  CouponTypeId: string = "";
  CouponNames: any = [];
  MaxDiscountLimit: number;
  StartSeriesNo: number;
  CouponCount: number;
  SeriesPrefix: string;
  IsExpiryValidationRequired: string = "";
  ValidUpto: string = "";
  NoOfValidDayFromIssuedDate: number = 0;
  IsExpiryValidationFlag: boolean = false;
  SerialGenerationMethod: string = null;
  startingValueFlag: boolean = false;
  CouponValueData: CouponsModel[] = [];
  tableFlag: boolean = false;
  MaxDiscountLimitFlag: string = null;
  AppliedMaxBalance: number = 0;

  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo, private fb: FormBuilder,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {

  }

  selectCouponType(id) {
    this.startingValueFlag = false;
    this.MaxDiscountLimitFlag = null;
    var myArr = [];
    this.tableFlag = false;
    this.CouponValueData = [];
    this.MaxDiscountLimit = 0;
    this.StartSeriesNo = null;
    this.CouponCount = null;
    this.SeriesPrefix = null;
    this.AppliedMaxBalance = 0;
    this.loadingService.show('Data Loading wait...');
    this.masterService.masterGetmethod(`/getCouponDefinationByid?couponTypeID=${id}`).subscribe(res => {
      this.loadingService.hide();
      if (res.status == "ok") {
        let myArray = res.result[0];
        this.SeriesPrefix = myArray.SeriesPrefix;
        this.StartSeriesNo = parseInt(myArray.StartSeriesNo) + parseInt(myArray.CouponCount);
      }
    });
    myArr = this.CouponNames.filter(e => e.CouponTypeId == id);
    //  console.log(myArr);
    if (myArr.length > 0) {
      if (myArr[0].SerialGenerationMethod == "Manual") {
        this.startingValueFlag = true;
        this.MaxDiscountLimitFlag = myArr[0].DiscountType
      } else {
        this.MaxDiscountLimitFlag = myArr[0].DiscountType;
      }
      //  console.log("discount type", this.MaxDiscountLimitFlag);
      if (this.MaxDiscountLimitFlag == "Amount") {
        this.AppliedMaxBalance = myArr[0].AppliedMaxBalance;
      }
      // console.log("this.AppliedMaxBalance", this.AppliedMaxBalance);
    }
  }
  preventInput($event) {
    $event.preventDefault();
    return false;
  }


  ngOnInit() {
    this.getCouponName();
  }

  getCouponName() {
    try {
      this.masterService.masterPostmethod('/selectCouponType', '')
        .subscribe(data => {
          if (data.status == "ok") {
            this.CouponNames = data.result;
          }
        });
    }
    catch (ex) {
      this.alertService.error(ex);

    }
  }

  onGenerateClicked() {
    this.CouponValueData = [];
    if (this.startingValueFlag) {
      if (this.CouponTypeId == "" || this.CouponTypeId == null || this.CouponNames == undefined) {
        this.alertService.error("Choose Coupon Type"); return;
      }
      if (this.MaxDiscountLimit == null || this.MaxDiscountLimit == 0) {
        this.alertService.error("Enter value in Max Discount Limit"); return;
      }
      // console.log("this.MaxDiscountLimitFlagss", this.MaxDiscountLimitFlag);
      //  
      if (this.MaxDiscountLimitFlag == "Amount") {
        if (this.MaxDiscountLimit >= this.AppliedMaxBalance) {
          this.alertService.error("Coupon Value must be less than " + this.AppliedMaxBalance); return;
        }
      }
      if (this.CouponCount == 0 || this.CouponCount == null) {
        this.alertService.error("Enter Coupon Counting value"); return;
      }
      if (this.CouponCount > 500) {
        this.alertService.error("Coupon Count must be 500 or less "); return;
      }
      for (let i = 0; i < this.CouponCount; i++) {
        var data = {
          CouponListValue: "",
          DiscountValue: this.MaxDiscountLimit
        } as CouponsModel;
        this.CouponValueData.push(data);
      }
      this.tableFlag = true;
    } else {
      if (this.CouponTypeId == "" || this.CouponTypeId == null || this.CouponNames == undefined) {
        this.alertService.error("Choose Coupon Type"); return;
      }
      if (this.MaxDiscountLimit == null || this.MaxDiscountLimit == 0) {
        this.alertService.error("Enter value in Max Discount Limit"); return;
      }
      if (this.MaxDiscountLimitFlag == "Amount") {
        if (this.MaxDiscountLimit >= this.AppliedMaxBalance) {
          this.alertService.error("Coupon Value must be less than " + this.AppliedMaxBalance); return;
        }
      }
      if (this.SeriesPrefix == null || this.SeriesPrefix == "" || this.SeriesPrefix == undefined) {
        this.alertService.error("Series Prefix because your coupon is Auto Generated Type"); return;
      }
      if (this.StartSeriesNo == null || this.StartSeriesNo == 0) {
        this.alertService.error("Enter Start Series number"); return;
      }
      if (this.CouponCount == 0 || this.CouponCount == null) {
        this.alertService.error("Enter Coupon Counting value"); return;
      }
      if (this.CouponCount > 500) {
        this.alertService.error("Coupon Count must be 500 or less "); return;
      }
      // let requestOject = {
      //   SeriesPrefix: this.SeriesPrefix,
      //   StartSeriesNo: this.StartSeriesNo,
      //   CouponCount: this.CouponCount
      // };
      // this.loadingService.show("Validation in process please wait...");
      // this.masterService.masterPostmethod('/validateCouponDefination', JSON.stringify(requestOject)).subscribe(res => {
      //   this.loadingService.hide();
      //   // if (res.status == "ok") {
      //   if (res.result.length > 0) {
      //     this.alertService.error("Coupon Generation Defination already exist!! Please change it ");
      //   } else {
      var a = this.StartSeriesNo;
      for (let i = 0; i < this.CouponCount; i++) {
        let couponString = this.SeriesPrefix + a;
        var data = {
          CouponListValue: couponString,
          DiscountValue: this.MaxDiscountLimit
        } as CouponsModel;
        this.CouponValueData.push(data);
        a++;
      }
      this.tableFlag = true;
      //     }
      //   }
      // })
    }
  }

  changeExpValid() {
    this.IsExpiryValidationFlag = false;
    //console.log("exp status ", this.IsExpiryValidationRequired);
    if (this.IsExpiryValidationRequired == "1") {
      this.IsExpiryValidationFlag = true;
    }
  }


  numberOnly(event): boolean {
    let regex = /^[0-9,\b]+$/;
    if (!regex.test(event.key)) {
      return false;
    } else {
      return true;
    }
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

  onSaveClicked() {
    var CouponFilterVal = [];
    // console.log("coupon value data ", this.CouponValueData.length);
    if (this.CouponValueData.length <= 0) {
      this.alertService.error("Generate Coupon First"); return;
    }
    if (this.MaxDiscountLimit == null || this.MaxDiscountLimit == 0) {
      this.alertService.error("Enter value in Max Discount Limit"); return;
    }
    if (this.MaxDiscountLimitFlag == "Amount") {
      if (this.MaxDiscountLimit >= this.AppliedMaxBalance) {
        this.alertService.error("Coupon Value must be less than " + this.AppliedMaxBalance); return;
      }
    }
    if (this.startingValueFlag) {
      CouponFilterVal = this.CouponValueData.filter(e => e.CouponListValue.length > 0);
      if (CouponFilterVal.length <= 0) {
        this.alertService.error("This is manual coupon enter value of coupon");
        return;
      }
      this.CouponValueData = CouponFilterVal;
    }
    if (this.CouponTypeId == "" || this.CouponTypeId == null || this.CouponNames == undefined) {
      this.alertService.error("Choose Coupon Type"); return;
    }
    if (this.MaxDiscountLimit == null || this.MaxDiscountLimit == 0) {
      this.alertService.error("Enter value in Max Discount Limit"); return;
    }
    if (!this.startingValueFlag) {
      if (this.SeriesPrefix == null || this.SeriesPrefix == "" || this.SeriesPrefix == undefined) {
        this.alertService.error("Series Prefix because your coupon is Auto Generated Type"); return;
      }
      if (this.StartSeriesNo == null || this.StartSeriesNo == 0) {
        this.alertService.error("Enter Start Series number"); return;
      }
    }
    if (this.CouponCount == 0 || this.CouponCount == null) {
      this.alertService.error("Enter Coupon Counting value"); return;
    }
    if (this.IsExpiryValidationFlag) {
      if (this.ValidUpto == null || this.ValidUpto.length == 0) {
        if (this.NoOfValidDayFromIssuedDate == null || this.NoOfValidDayFromIssuedDate == 0) {
          this.alertService.error("Enter Valid upto or issue days");
          this.ValidUpto = "";
          return;
        }
      }
      if (this.ValidUpto == null || this.ValidUpto.length == 0) {
        this.ValidUpto = new Date().toLocaleDateString();
      }
    }

    if (!this.IsExpiryValidationFlag) {
      this.ValidUpto = new Date().toLocaleDateString();
      this.NoOfValidDayFromIssuedDate = 0;
    }

    // console.log("Coupon data ", this.CouponValueData);
    try {

      let requestOject = {
        "CouponDefinationId": -1,
        "CouponTypeId": parseInt(this.CouponTypeId),
        "MaxDiscountLimit": this.MaxDiscountLimit,
        "SeriesPrefix": this.SeriesPrefix,
        "StartSeriesNo": this.StartSeriesNo,
        "CouponCount": this.CouponCount,
        "IsExpiryValidationRequired": parseInt(this.IsExpiryValidationRequired),
        "ValidUpto": new Date(this.ValidUpto),
        "NoOfValidDayFromIssuedDate": this.NoOfValidDayFromIssuedDate,
        "UseFrequencyAllowed": 1,
        "CouponCodeList": this.CouponValueData
      }
      //console.log(requestOject);

      this.loadingService.show("Saving Data please wait...");
      let sub = this.masterService.masterPostmethod('/saveCouponDefination', JSON.stringify(requestOject))
        .subscribe(data => {
          //console.log(data);
          if (data.status == 'ok') {
            this.loadingService.hide();
            this.alertService.success("Coupon Create successfully");
            this.CouponValueData = null;
            this.CouponTypeId = "";
            this.MaxDiscountLimit = null;
            this.SeriesPrefix = "";
            this.StartSeriesNo = null;
            this.CouponCount = null;
            this.IsExpiryValidationFlag = false;
            this.IsExpiryValidationRequired = "";
            this.NoOfValidDayFromIssuedDate = 0;
            this.ValidUpto = "";
          }
          else {
            this.loadingService.hide();
            this.alertService.error(data.result);

          }

        },
          error => {
            this.loadingService.hide();
            this.alertService.error(error)
          }
        );

    }
    catch (e) {
      this.childModal.hide()
      this.alertService.error(e);
    }
  }
}
