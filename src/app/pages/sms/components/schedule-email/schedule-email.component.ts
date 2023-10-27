import { Component, ViewChild, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { FormGroup, FormControl, FormBuilder, Validators,AbstractControl } from '@angular/forms';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { ModalDirective } from 'ng2-bootstrap';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
declare var CKEDITOR;
@Component({
  selector: "schedule-email",
  templateUrl: "./schedule-email.html",
  

})
export class ScheduleEmailComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;
 
  isReadonly = true;
  
  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo, private fb: FormBuilder, 
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute,public dialog: MdDialog, private loadingService: SpinnerService) {
     
  }
  

  

preventInput($event)
{
    $event.preventDefault();
    return false;

}


ngOnInit() {

  try {
    this.form = this.fb.group({
      SCHEDULERNAME:['',Validators.required],
      SCHEDULERDATETIME:['',Validators.required],
      RECIPIENTEMAIL: ['', [Validators.required, this.commaSepEmail]],
      RECIPIENTSUBJECT:['',Validators.required],
      EMAILCONTENT:[''],
     });

} catch (ex) {
    this.alertService.error(ex);
}
//
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

commaSepEmail = (control: AbstractControl): { [key: string]: any } | null => {
  const emails = control.value.split(',').map(e=>e.trim());
  const forbidden = emails.some(email => Validators.email(new FormControl(email)));
  return forbidden ? { 'RECIPIENTEMAIL': { value: control.value } } : null;
};



onSaveClicked() {
  try {
    let emails = this.form.controls['RECIPIENTEMAIL'].value.split(',');

    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      for (var i = 0; i < emails.length; i++) {
        if( emails[i] == "" || ! regex.test(emails[i])){
            this.alertService.error("Email Invalid");
            return;
          }
      }
      if ((this.form.controls['SCHEDULERNAME'].value) == "" || this.form.controls['RECIPIENTEMAIL'].value == undefined) {
        this.alertService.error("Scheduled Name is required");
        return;
    }
    if ((this.form.controls['SCHEDULERDATETIME'].value) == "" || this.form.controls['RECIPIENTEMAIL'].value == undefined) {
      this.alertService.error("Scheduled Date and Time is required");
      return;
  }
      if ((this.form.controls['RECIPIENTEMAIL'].value) == "" || this.form.controls['RECIPIENTEMAIL'].value == undefined) {
        this.alertService.error("Email is required");
        return;
    }
    if ((this.form.controls['RECIPIENTSUBJECT'].value) == "" || this.form.controls['RECIPIENTSUBJECT'].value == undefined) {
      this.alertService.error("Subject is required");
      return;
  }
  let myck= CKEDITOR.instances.editor1.getData();
    if ((myck.length) == 0 || myck.length == undefined) {
      this.alertService.error("Email Content is required");
      return;
  }

  let requestOject={
    "SendingMSG":myck,
    "EmailSubject":this.form.controls['RECIPIENTSUBJECT'].value,
    "ReceiverEmail":this.form.controls['RECIPIENTEMAIL'].value,
    "SmsType":"Quick"
  }
  console.log(requestOject);

   this.loadingService.show("Saving Data please wait...");
      let sub = this.masterService.sendQuickEmail(JSON.stringify(requestOject))
          .subscribe(data => {
            console.log(data);
              if (data.status == 'ok') {
               this.loadingService.hide();
                  this.alertService.success("Email send shortly...");
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
