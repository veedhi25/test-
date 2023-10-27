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
  selector: "sms-failed",
  templateUrl: "./sms-failed.html",

})
export class SMSFailedComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;
 
  isReadonly = true;
  
  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo, private fb: FormBuilder, 
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute,public dialog: MdDialog, private loadingService: SpinnerService) {

  }
  // Table Heading
  colTableHeader: any = [
    {
      value: "Sno.",
    },
    {
      value:"SMS Category"
    },
    {
      value:"SMS Sign"
    },
    {
      value:"Mobile No."
    },
    {
      value:"Message Content"
    },
    {
      value:"Sending Date"
    },
    {
      value:"Failed Reason"
    },
    {
      value:"Status"
    }
  ];

  

preventInput($event)
{
    $event.preventDefault();
    return false;

}


ngOnInit() {

 

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
  try {

    if ((this.form.controls['RECIPIENTNO'].value) == "" || this.form.controls['RECIPIENTNO'].value == undefined) {
        this.alertService.error("RECIPIENTNO is required");
        return;
    }
    if ((this.form.controls['SMSCONTENT'].value) == "" || this.form.controls['SMSCONTENT'].value == undefined) {
      this.alertService.error("SMSCONTENT is required");
      return;
  }
   
      let loc = <any>{}
      loc.RECIPIENTNO = this.form.value.RECIPIENTNO;
      loc.SMSCONTENT = this.form.value.SMSCONTENT;
      

   this.loadingService.show("Saving Data please wait...");
      let sub = this.masterService.saveLocationAddandUpdate(loc)
          .subscribe(data => {
          
              if (data.status == 'ok') {
               this.loadingService.hide();
                  this.alertService.success("Location Info Inserted successfully...");
                  this.clearText();
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
      this.subcriptions.push(sub);
  }
  catch (e) {
      this.childModal.hide()
      this.alertService.error(e);
  }
}

onBackClick(): void {
  try {
    this.router.navigate([
      "/pages/wms/location-master",
      //{ mode: "addlocation", returnUrl: this.router.url }
    ]);
    /*this.router.navigate([
      "/pages/wms/addlocation",
      { mode: "addlocation", returnUrl: this.router.url }
    ]);
    */
  } catch (ex) {
    alert(ex);
  }
}



clearText()
{
  this.form.patchValue({
    RECIPIENTNO: "",
    SMSCONTENT: "",
    
    
});

}

}
