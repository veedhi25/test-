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
  selector: "quick-message",
  templateUrl: "./quick-msg.component.html",

})
export class QuickMsgComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;
 
  isReadonly = true;
  myModearr : any= [];
   myProval : any ;
   myRemainCont: any=160;
   mysmsContent: string ="";
  
  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo, private fb: FormBuilder, 
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute,public dialog: MdDialog, private loadingService: SpinnerService) {

  }
  selectedModeName: [string];
  myMessageMode: any = [
    {
      name: "Text Message",
      value: "Text"
    },
    {
      name: "Whatsapp",
      value: "whatsapp"
    }
  ];

  

preventInput($event)
{
    $event.preventDefault();
    return false;

}


ngOnInit() {

  try {
    this.form = this.fb.group({
      RECIPIENTNO: ['', Validators.required],
      SMSCONTENT:['',Validators.required],
      messageMode:['',Validators.required],
    
    });

} catch (ex) {
    this.alertService.error(ex);
}

}

findSMSLength(){
  let mycontlength = this.form.controls['SMSCONTENT'].value.length;
  this.mysmsContent = this.form.controls['SMSCONTENT'].value;
  let max_char_lenght= 160;
  if(mycontlength <= max_char_lenght){
    this.myRemainCont=max_char_lenght-mycontlength;
    let main = (max_char_lenght - this.myRemainCont)*100;
    this.myProval= (main / max_char_lenght);
   }else{
    this.myRemainCont=0;
    this.myProval=100;
    alert( 'Please dont enter more than '+max_char_lenght+' characters' );
    this.mysmsContent= this.mysmsContent.substring(0,160);
   }
  
}

getSelectedMode(event,val){
  let status=event.target.checked;
  status ? this.myModearr.push(val.toLowerCase()) : this.removeMode(val.toLowerCase());
 console.log(this.myModearr);
}

removeMode(val){
  let index = this.myModearr.indexOf(val);
  if (index > -1) {
    this.myModearr.splice(index, 1);
  };
}

numberOnly(event): boolean {
  let regex = /^[0-9,\b]+$/;
  if (!regex.test(event.key)) {
  return false;
  }else{
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
  try {
   let mobileno= this.form.controls['RECIPIENTNO'].value;
   let value2=mobileno.replace(/[\s]/g,'');
	    let x=/^(\d{10,15},)*\d{10,15}$/.test(value2);
      if(!x){
        this.alertService.error("Mobile number/numbers entered is invalid"); return
    }
    if ((this.form.controls['RECIPIENTNO'].value) == "" || this.form.controls['RECIPIENTNO'].value == undefined) {
        this.alertService.error("RECIPIENTNO is required");
        return;
    }
    if ((this.form.controls['SMSCONTENT'].value) == "" || this.form.controls['SMSCONTENT'].value == undefined) {
      this.alertService.error("SMSCONTENT is required");
      return;
  }
  if(this.myModearr.length<=0){
    this.alertService.error("Choose Message mode is required");
      return;
  }

   
  let requestOject={
    "SendingMSG":this.form.controls['SMSCONTENT'].value,
    "ReceiverMobile":this.form.controls['RECIPIENTNO'].value,
    "MessageMode":this.myModearr.join(),
    "SmsType":"Quick"
  }
  //console.log(requestOject);

  this.loadingService.show("Saving Data please wait...");
     let sub = this.masterService.sendQuickMessage(JSON.stringify(requestOject))
         .subscribe(data => {
           console.log(data);
             if (data.status == 'ok') {
              this.loadingService.hide();
                 this.alertService.success("Message send shortly...");
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
     this.subcriptions.push(sub);
  }
 catch (e) {
     this.childModal.hide()
     this.alertService.error(e);
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
