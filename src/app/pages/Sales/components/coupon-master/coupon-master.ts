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

@Component({
  selector: "discountcouponmaster",
  templateUrl: "./coupon-master.html",

})
export class CouponMaster implements OnInit {
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();


  isReadonly = true;
  couponname: string = "";
  minBalance: number = 0;
  discountType: string = "";
  generationMethod: string = "";
  maxBalance: number = 0;

  @ViewChild('childModal') childModal: ModalDirective;
  constructor(private masterService: MasterRepo, private fb: FormBuilder,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {

  }

  preventInput($event) {
    $event.preventDefault();
    return false;

  }


  ngOnInit() {
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
    if (this.couponname == "" || this.couponname == undefined || this.couponname == null) {
      this.alertService.error("Enter Coupon Name"); return;
    }
    if (this.discountType == "" || this.discountType == undefined || this.discountType == null) {
      this.alertService.error("Choose Discount Type"); return;
    }
    if (this.generationMethod == "" || this.generationMethod == undefined || this.generationMethod == null) {
      this.alertService.error("Choose Generation Method"); return;
    }
    if (this.minBalance == 0 || this.minBalance == null) {
      this.alertService.error("Enter Min Balance"); return;
    }
    if (this.maxBalance == 0 || this.maxBalance == null) {
      this.alertService.error("Enter Max Balance"); return;
    }
    if (this.maxBalance <= this.minBalance) {
      this.alertService.error("Max Balance must be greater than Min Balance"); return;
    }
    try {
      let requestOject = {
        "CouponTypeId": -1,
        "CouponName": this.couponname,
        "DiscountType": this.discountType,
        "SerialGenerationMethod": this.generationMethod,
        "AppliedMinBalance": this.minBalance,
        "AppliedMaxBalance": this.maxBalance,

      }
      //console.log(requestOject);

      this.loadingService.show("Saving Data please wait...");
      let sub = this.masterService.masterPostmethod('/saveCouponType', JSON.stringify(requestOject))
        .subscribe(data => {
          console.log(data);
          if (data.status == 'ok') {
            this.loadingService.hide();
            this.alertService.success(data.result);
            this.couponname = "";
            this.discountType = "";
            this.generationMethod = "";
            this.minBalance = 0;
            this.maxBalance = 0;

            //this.alertService.success("Message send shortly...");
            // this.clearText();
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
