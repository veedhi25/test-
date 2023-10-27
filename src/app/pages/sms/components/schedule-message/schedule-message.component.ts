import { Component, EventEmitter, Output, ViewChild, OnInit } from "@angular/core";
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
import { ConditionalExpr, THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";
import { Console } from "console";
import * as moment from 'moment'
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';


@Component({
  selector: "schedule-message",
  templateUrl: "./schedule-message.html",

})
export class ScheduleMsgComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;
  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
  @Output() onDataFileUploadPopupEmit: EventEmitter<any> = new EventEmitter<any>();

  isReadonly = true;
  myModearr: any = [];
  myOutletList: any = [];
  myCatList: any = [];
  myselectedRec: string;
  myselectedOutlet: string;
  selectRecptType: string = "0";
  public RECIPIENTNOFlag: boolean = false;
  myselectedCategory: string;
  mySchedulerFlag: boolean = false;
  mysmscontentflag: boolean = false;
  myemailcontentflag: boolean = false;
  myemailsubjectflag: boolean = false;
  dateflag: boolean = false;
  textMessageModeSelect: boolean = false;
  emailModeSelect: boolean = false;
  mysmsContent: string = "";
  myemailContent: string = "";
  myemailContentSubject = "";
  @ViewChild('childModal') childModal: ModalDirective;
  messagetemp = false;
  emailtemp = false;
  schname: string = "";
  schdate: any;
  excelbtn: boolean = false;
  title = 'read-excel-in-angular8';
  storeData: any;
  csvData: any;
  jsonData: any;
  textData: any;
  htmlData: any;
  fileUploaded: File;
  worksheet: any;


  constructor(private masterService: MasterRepo, private fb: FormBuilder,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {

    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Purchase Invoice",
        sampleFileUrl: `/downloadSample`,
        uploadEndpoints: `/downloadSample`,
        allowMultiple: false,
        acceptFormat: ".csv",
        filename: "PI_SampleFile"
        // note: this.note
      });
  }
  mySelecttype: any = [
    {
      value: "all",
      name: "Customer"
    },
    {
      value: "manually",
      name: "Enter Manually"
    },
    {
      value: "fromexcel",
      name: "Export Excel"
    }

  ];
  selectedModeName: [string];
  myMessageMode: any = [
    {
      name: "Text Message",
      value: "Text"
    },
    {
      name: "Email",
      value: "email"
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
    if (this.selectRecptType == "fromexcel") {
      this.RECIPIENTNOFlag = true;
      this.excelbtn = true;

    }

  }
  Importparty() {

    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: `Import Data`,
        sampleFileUrl: ``,
        uploadEndpoints: `/masterImport/myschedulerMsg/nothing`,
        allowMultiple: false,
        acceptFormat: ".csv"
      });

    this.fileUploadPopup.show();
  }
  fileUploadSuccessStatus(response) {
    if (response.status == "ok") {
      this.alertService.success("Upload Successfully")
    }
    else if (response.status == "error" || response.status == "errorfile") {
      this.alertService.error(`Errors:${response.result}`);
    }
    else {
      this.alertService.error("Could not uploaded")
    }
  }
  onImportData() {
    this.onDataFileUploadPopupEmit.emit(true);
  }

  showDataImportPopup() {

    this.fileUploadPopup.show();
  }


  onclicktext() {
    // this.alertService.success("Comma Seperated numbers");

  }
  numberOnly(event): boolean {
    let regex = /^[0-9,\b]+$/;
    if (!regex.test(event.key)) {
      return false;
    } else {
      return true;
    }
  }



  preventInput($event) {
    $event.preventDefault();
    return false;

  }


  ngOnInit() {

    try {
      this.form = this.fb.group({
        RECIPIENTS: ['', Validators.required],
        RECIPIENTNO: ['', Validators.required],
        SMSCONTENT: ['', Validators.required],
        EMAILCONTENT: ['', Validators.required],
        EMAILCONTENTSUBJECT: ['', Validators.required],
        MYOUTLETS: ['', Validators.required],
        MYCategory: ['', Validators.required],
        messageMode: ['', Validators.required],
        defaultMessageForText: ['', Validators.required],
        defaultMessageForEmail: ['', Validators.required],
        HOURS: ['', Validators.required],
        MINUTES: ['', Validators.required],
        SCHEDULERCYCLE: ['', Validators.required],
        SCHDATE: ['', Validators.required],
        CUSTMOBILE: ['', Validators.required]
      });
      this.form.patchValue({
        defaultMessageForText: true,
        defaultMessageForEmail: true,

      });
      this.getOutlets();

    } catch (ex) {
      this.alertService.error(ex);
    }

  }

  getSelectedMode(event, val) {
    if (this.myCatList.length == 0) {
      this.alertService.error('Error choose all fields');
      return;
    }
    if (val.toLowerCase() == 'text') {
      this.mysmscontentflag = true;
      // this.messagetemp = true;
      if (this.selectRecptType == "manually" || this.selectRecptType == "excel") {
        this.alertService.error("keys to be entered only in case of customers")
      }
      this.textMessageModeSelect = true;
      // this.myemailContent = ""
    } else if (val.toLowerCase() == 'email') {
      this.myemailcontentflag = true;
      this.myemailsubjectflag = true;
      // this.emailtemp = true;
      if (this.selectRecptType == "manually" || this.selectRecptType == "excel") {
        this.alertService.error("keys to be entered only in case of customers")
      }
      this.emailModeSelect = true;
      // this.mysmsContent = ""
    } else { }
    let status = event.target.checked;
    status ? this.myModearr.push(val.toLowerCase()) : this.removeMode(val.toLowerCase());
    console.log(this.myModearr);
  }

  removeMode(val) {
    if (val.toLowerCase() == 'text') {
      this.textMessageModeSelect = false;
      this.form.patchValue({
        defaultMessageForText: false,
      });
      this.mysmscontentflag = false;
    } else if (val.toLowerCase() == 'email') {
      this.emailModeSelect = false;
      this.form.patchValue({
        defaultMessageForEmail: false,
      });
      this.myemailcontentflag = false;
      this.myemailsubjectflag = false;
    } else { }
    let index = this.myModearr.indexOf(val);
    if (index > -1) {
      this.myModearr.splice(index, 1);
    };
  }

  getDropdownValue(event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let selectElementValue = selectedOptions[selectedIndex].value;
    return selectElementValue;
  }

  counter(i: number) {
    return new Array(i);
  }

  // getOutlets(event) {
  //   let val = this.getDropdownValue(event);
  //   this.myselectedRec = val;
  //   this.mySchedulerFlag = false;
  //   this.textMessageModeSelect = false;
  //   this.emailModeSelect = false;
  //   this.myOutletList = [];
  //   this.myCatList = [];
  //   this.myModearr = [];
  //   this.clearMode();
  //   this.setDefaultMessage();
  //   try {
  //     let requestOject = {
  //       "TemplateType": val
  //     }
  //     console.log(requestOject);
  //     this.loadingService.show("Please wait...");
  //     let sub = this.masterService.selectOutletByTemplateType(JSON.stringify(requestOject))
  //       .subscribe(data => {
  //         console.log(data);
  //         if (data.status == 'ok') {
  //           this.loadingService.hide();
  //           this.myOutletList.push(data.result);
  //           // this.alertService.success("Message send shortly...");
  //           // this.clearText();
  //         }
  //         else {
  //           this.loadingService.hide();
  //           this.alertService.error(data.result);

  //         }

  //       },
  //         error => {
  //           this.loadingService.hide();
  //           this.alertService.error(error)
  //         }
  //       );
  //     this.subcriptions.push(sub);
  //   }
  //   catch (e) {
  //     this.childModal.hide()
  //     this.alertService.error(e);
  //   }
  // }
  getOutlets() {
    this.mysmscontentflag = false;
    this.myOutletList = [];
    try {
      this.loadingService.show("Please wait...");
      let sub = this.masterService.selectOutlet()
        .subscribe(data => {
          console.log(data);
          if (data.status == 'ok') {
            this.loadingService.hide();
            // console.log("this.myOutletList", this.myOutletList);
            //       var keyname = this.myOutletList[0].filter(x => x.OUTLETID==)[0].OUTLETNAME;
            //   console.log(keyname, "filter")
            // var check = this.myOutletList.filter(x => x.OUTLETNAME.includes("PROMOTIONAL", "OTHERS"));
            var check1 = (data.result).filter(x => x.OUTLETNAME == "PROMOTIONAL" || x.OUTLETNAME == "OTHERS");
            // console.log("data.result", data.result);
            console.log("check1", check1);
            this.myOutletList.push(check1);
            // this.alertService.success("Message send shortly...");
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

  getmyCategory(val) {
    try {
      this.mysmscontentflag = false;
      this.mySchedulerFlag = false;
      this.textMessageModeSelect = false;
      this.emailModeSelect = false;
      this.myCatList = [];
      this.myModearr = [];
      this.clearMode();
      this.setDefaultMessage();
      val = val.split(': ');
      this.myselectedOutlet = val[1];
      let requestOject = {
        "TemplateType": this.myselectedRec,
        "OUTLETID": val[1]
      }
      console.log(requestOject);
      this.loadingService.show("Please wait...");
      let sub = this.masterService.selectSmsCatByOutLetidandTemplateType(JSON.stringify(requestOject))
        .subscribe(data => {
          console.log(data);
          if (data.status == 'ok') {
            this.loadingService.hide();
            this.myCatList.push(data.result);
            // this.alertService.success("Message send shortly...");
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

  getSchedularType(val) {
    // this.mysmscontentflag = true;
    // this.messagetemp = true;
    this.mySchedulerFlag = false;
    this.textMessageModeSelect = false;
    this.emailModeSelect = false;
    this.myModearr = [];
    this.clearMode();
    this.setDefaultMessage();
    val = val.split(': ');
    this.myselectedCategory = val[1];
    this.setMessageContent();
    this.myCatList[0].forEach(value => {
      this.schname = value['SmsCatTitle'];
      console.log(this.schname);
      if (value['SMSCATID'] == val[1]) {
        if (value['SMSCatSchedulerType'] == 'Reminder') {
          this.mySchedulerFlag = true;

        }
      }
    });
  }
  cycletype(val) {
    console.log(val, "cyycletype")
    this.dateflag = false;
    if (val == 'fixed') {
      this.dateflag = true;
    }

  }
  setMessageContent() {

    this.myCatList[0].forEach(value => {
      if (value['SMSCATID'] == this.myselectedCategory) {

        if ((!value['CustomMessage'] || value['CustomMessage'] === null) && (!value['CustomEmailMessage'] || value['CustomEmailMessage'] === null)) {
        } else {
          this.mysmsContent = value['CustomMessage'];
          this.myemailContent = value['CustomEmailMessage'];
          this.myemailContentSubject = value['EmailSubject'];
          if (this.myemailContent == null) {
            this.myemailContent = value['EmailMessage'];
            this.myemailContentSubject = value['EmailSubject'];

          }
          if (this.mysmsContent == null) {
            this.mysmsContent = value['SmsCatMessage'];
          }
          console.log(value['CustomEmailMessage'])
          // this.findSMSLength(this.mysmsContent);
        }
      }
    });
    console.log(this.mysmsContent);
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

// checkCustomMessage(event){
//   let status=event.target.checked;
//   if(!status){
//     this.myCatList[0].forEach(value => {
      
//       if(value['SMSCATID']==this.myselectedCategory){
//         if(!value['CustomizeMessage'] || value['CustomizeMessage']===null){
//           this.alertService.error('This category have no customize message content');
//            this.form.patchValue({
//             defaultMessageForText: true,
//         });
//         }else{
              
//             }
//       }
//   });
// }
// }
  checkCustomMessage(event) {
    let status = event.target.checked;
    console.log("status", status)
    if (status == true) {
      this.myCatList[0].forEach(value => {
        console.log(value['SMSCATID'] + '   ' + this.myselectedCategory)
        if (value['SMSCATID'] == this.myselectedCategory) {

          if (!value['CustomMessage'] || value['CustomMessage'] === null) {
            this.alertService.error('Default Content Only');
            this.form.patchValue({
              defaultMessageForText: true,
            });
          } else {
            this.mysmsContent = value['SmsCatMessage'];
          }
        }
      });
    }
    else {
      console.log("status", status)
      this.myCatList[0].forEach(value => {
        console.log(value['SMSCATID'] + '   ' + this.myselectedCategory)
        if (value['SMSCATID'] == this.myselectedCategory) {

          if (!value['CustomMessage'] || value['CustomMessage'] === null) {
            this.alertService.error('This category have no customize message content');
            this.form.patchValue({
              defaultMessageForText: true,
            });
          } else {
            this.mysmsContent = value['CustomMessage'];
          }
        }
      });
    }
  }
  checkCustomEmail(event) {
    let status = event.target.checked;
    if (status) {
      this.myCatList[0].forEach(value => {
        if (value['SMSCATID'] == this.myselectedCategory) {
          if (!value['CustomEmailMessage'] || value['CustomMessage'] === null) {
            this.alertService.error('Default Content Only');
            this.form.patchValue({
              defaultMessageForEmail: true,
            });
            this.myemailContent = value['EmailMessage'];
          } else {
            this.myemailContent = value['EmailMessage'];
          }
        }
      });
    }
    else {
      this.myCatList[0].forEach(value => {
        if (value['SMSCATID'] == this.myselectedCategory) {
          if (!value['CustomEmailMessage'] || value['CustomEmailMessage'] === null) {
            this.alertService.error('This category have no customize Email content');
            this.form.patchValue({
              defaultMessageForEmail: true,
            });
          } else {
            this.myemailContent = value['CustomEmailMessage'];
          }
        }
      });

    }
  }




  onSaveClicked() {
    try {

      this.schdate = moment(new Date().toLocaleDateString()).format("YYYY-MM-DD");
      let recipient = this.form.controls['RECIPIENTNO'].value;
      let outlet = this.myselectedOutlet;
      let category = this.schname;
      // if ((this.form.controls['RECIPIENTS'].value) == "" || this.form.controls['RECIPIENTS'].value == undefined) {
      //   this.alertService.error("Recipient is required");
      //   return;
      // }
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
      if ((this.form.controls['MYOUTLETS'].value) == "" || this.form.controls['MYOUTLETS'].value == undefined) {
        this.alertService.error("Outlet is required");
        return;
      }
      if ((this.form.controls['MYCategory'].value) == "" || this.form.controls['MYCategory'].value == undefined) {
        this.alertService.error("Category is required");
        return;
      }
      if (this.mySchedulerFlag) {
        if ((this.form.controls['HOURS'].value) == "" || this.form.controls['HOURS'].value == undefined) {
          this.alertService.error("Hours is required");
          return;
        }
        if ((this.form.controls['MINUTES'].value) == "" || this.form.controls['MINUTES'].value == undefined) {
          this.alertService.error("Minutes is required");
          return;
        }
        if ((this.form.controls['SCHEDULERCYCLE'].value) == "" || this.form.controls['SCHEDULERCYCLE'].value == undefined) {
          this.alertService.error("Scheduler Cycle is required");
          return;
        }
      }

      if (this.myModearr.length <= 0) {
        this.alertService.error("Choose Message mode is required");
        return;
      }
      var requestList = [];
      var myarr
      if (this.myModearr.includes("email") && this.myModearr.includes("text")) {
        console.log(this.myModearr);
        myarr = {
          "DefaultEmailTemplate": this.form.controls['defaultMessageForEmail'].value,
          "DefaultMessageTemplate": this.form.controls['defaultMessageForText'].value
        }

      } else if (this.myModearr.includes("email")) {
        this.mysmsContent = "";
        myarr = { "DefaultEmailTemplate": this.form.controls['defaultMessageForEmail'].value }
      } else if (this.myModearr.includes("text")) {
        this.myemailContent = "";
        this.myemailContentSubject = "";
        myarr = { "DefaultMessageTemplate": this.form.controls['defaultMessageForText'].value }
      } else {
      }
      var requestOject;

      if (this.form.controls['SCHEDULERCYCLE'].value == "fixed") {
        this.schdate = this.form.controls['SCHDATE'].value;
      }


      if (this.mySchedulerFlag) {
        requestOject = {
          "selectRecptType": this.selectRecptType,
          "SchedulerMessage": this.mysmsContent,
          "SchedulerEmailMessage": this.myemailContent,
          "SchedulerEmailSubject": this.myemailContentSubject,
          "MessageSendTo": this.selectRecptType,
          "CONTACTNumber": recipient,
          "SchedulerName": category,
          "OUTLETID": outlet,
          "SchedulerMode": this.myModearr.join(),
          "SMSCatSchedulerType": "Reminder",
          "SchedulerCycle": this.form.controls['SCHEDULERCYCLE'].value,
          "SchedulerTime": this.form.controls['HOURS'].value + ':' + this.form.controls['MINUTES'].value,
          "SchedulerDomain": "My Domain",
          "SMSCATID": this.myselectedCategory,
          "SchedulerDate": this.schdate
        }
      } else {
        requestOject = {
          "selectRecptType": this.selectRecptType,
          "SchedulerMessage": this.mysmsContent,
          "SchedulerEmailMessage": this.myemailContent,
          "SchedulerEmailSubject": this.myemailContentSubject,
          "MessageSendTo": this.selectRecptType,
          "CONTACTNumber": recipient,
          "SchedulerName": category,
          "OUTLETID": outlet,
          "SchedulerMode": this.myModearr.join(),
          "SMSCatSchedulerType": "Fixed",
          "SchedulerDomain": "My Domain",
          "SMSCATID": this.myselectedCategory,
          "SchedulerDate": this.schdate
        }
      }

      var newRequest = Object.assign(requestOject, myarr)
      //requestList.push(requestOject.concat(myarr));
      console.log(newRequest);
      this.loadingService.show("Saving Data please wait...");
      let sub = this.masterService.insertMyscheduler(JSON.stringify(newRequest))
        .subscribe(data => {
          console.log(data);
          if (data.status == 'ok') {
            this.loadingService.hide();
            this.alertService.success("Message send shortly...");
            this.getOutlets();
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


  clearText() {
    this.mysmsContent = "";
    this.myemailContent = "";
    this.myemailcontentflag = false;
    this.myemailsubjectflag = false;
    this.mysmscontentflag = false;
    this.mySchedulerFlag = false;
    this.form.patchValue({
      messageMode: false,
      HOURS: "",
      MINUTES: "",
      SCHEDULERCYCLE: "",
      RECIPIENTNO: "",
      MYCategory: "",
      CUSTMOBILE: "",
      MYOUTLETS: "",
      SCHDATE: "",
      defaultMessageForText: ""
    });
    this.textMessageModeSelect = false;




  }
  clearMode() {
    this.form.patchValue({
      messageMode: false,
    });

  }

  setDefaultMessage() {
    this.form.patchValue({
      defaultMessageForEmail: false,
      defaultMessageForText: false,
    });
  }

}
