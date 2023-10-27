import { Component, ViewChild, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { ModalDirective, DatepickerModule } from 'ng2-bootstrap';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ReportMainSerVice } from '../../../Reports/Report.service';
import { Console } from "console";

@Component({
  selector: "quick-schedule-msg",
  templateUrl: "./quick-schedule-msg.html",

})
export class QuickSchedulerMsgComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;

  isReadonly = true;
  myModearr: any = [];
  myProval: any;
  myRemainCont: any = 160;
  mysmsContent: string = "";
  apikey: string;
  Msgmode: any;
  date: Date;
  minDate: Date;
  public messagesms: string = "";
  disabledDate: { dt: Date, mode: string };
  ApiList: any[] = [];
  selectRecptType: string = "0";
  public mySupplier: any[];
  public mySupplierFilter: any[];
  public RECIPIENTNOFlag: boolean = false;
  @ViewChild('childModal') childModal: ModalDirective;


  constructor(public reportFilterService: ReportMainSerVice, private masterService: MasterRepo, private fb: FormBuilder,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {
    this.date = new Date();
    this.minDate = new Date();
    this.minDate.setDate(this.date.getDate() - 1);
    this.ApiList = [];
    // this.CustomerList=[];

    this.masterService.getApiList().subscribe(result => {
      // console.log("result",result);return;
      // console.log(data); return;
      this.ApiList.push(result);
      console.log("ApiList", this.ApiList)
    });
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

  mySelecttype: any = [
    {
      value: "all",
      name: "From Master"
    },
    {
      value: "manually",
      name: "Enter Manually"
    }
  ];

  getChoose() {
    this.RECIPIENTNOFlag = false;
    // console.log("this ",this.selectRecptType)
    if (this.selectRecptType == "all") {
      this.RECIPIENTNOFlag = true;

    }
    if (this.selectRecptType == "manually") {
      this.RECIPIENTNOFlag = false;
    }
  }

  preventInput($event) {
    $event.preventDefault();
    return false;

  }
  counter(i: number) {
    return new Array(i);
  }

  ngOnInit() {

    try {
      this.form = this.fb.group({
        SCHEDULERNAME: ['', Validators.required],
        RECIPIENTNO: ['', Validators.required],
        SCHEDULERDATE: ['', Validators.required],
        HOURS: ['', Validators.required],
        MINUTES: ['', Validators.required],
        SMSCONTENT: ['', Validators.required],
        APIKEY: ['', Validators.required],
        messageMode: ['', Validators.required],
        CUSTMOBILE: ['', Validators.required]

      });

    } catch (ex) {
      this.alertService.error(ex);
    }

  }



  findSMSLength() {
    let mycontlength = this.form.controls['SMSCONTENT'].value.length;
    this.mysmsContent = this.form.controls['SMSCONTENT'].value;
    let max_char_lenght = 160;
    if (mycontlength <= max_char_lenght) {
      this.myRemainCont = max_char_lenght - mycontlength;
      let main = (max_char_lenght - this.myRemainCont) * 100;
      this.myProval = (main / max_char_lenght);
    } else {
      this.myRemainCont = 0;
      this.myProval = 100;
      alert('Please dont enter more than ' + max_char_lenght + ' characters');
      this.mysmsContent = this.mysmsContent.substring(0, 160);
    }

  }

  getSelectedMode(event, val) {
    let status = event.target.checked;
    status ? this.myModearr.push(val.toLowerCase()) : this.removeMode(val.toLowerCase());
    console.log(this.myModearr);
  }

  removeMode(val) {
    let index = this.myModearr.indexOf(val);
    if (index > -1) {
      this.myModearr.splice(index, 1);
    };
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


  setSMSContent() {
    this.form.patchValue({
      SMSCONTENT: this.apikey,


    });
  }

  onSaveClicked() {
    try {
      if (this.selectRecptType == "0" || this.selectRecptType == null) {
        this.alertService.error("Select Recpient Type"); return;
      }
      if (this.selectRecptType != "all") {
        let mobileno = this.form.controls['RECIPIENTNO'].value;
        let value2 = mobileno.replace(/[\s]/g, '');
        let x = /^(\d{10,15},)*\d{10,15}$/.test(value2);
        if (!x) {
          this.alertService.error("Mobile number/numbers entered is invalid"); return
        }
        if ((this.form.controls['RECIPIENTNO'].value) == "" || this.form.controls['RECIPIENTNO'].value == undefined) {
          this.alertService.error("RECIPIENTNO is required");
          return;
        }
      }
      if ((this.form.controls['SMSCONTENT'].value) == "" || this.form.controls['SMSCONTENT'].value == undefined) {
        this.alertService.error("SMSCONTENT is required");
        return;
      }
      if (this.myModearr.length <= 0) {
        this.alertService.error("Choose Message mode is required");
        return;
      }


      let requestOject = {
        "SendingMSG": this.form.controls['SMSCONTENT'].value,
        "ReceiverMobile": this.form.controls['RECIPIENTNO'].value,
        "MessageMode": this.myModearr.join(),
        "selectRecptType": this.selectRecptType,
        "SmsType": "Quick"
      }
      console.log(requestOject);

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




  clearText() {
    this.form.patchValue({
      RECIPIENTNO: "",
      SMSCONTENT: "",


    });

  }

}
