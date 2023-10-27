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
  selector: "custom-message",
  templateUrl: "./custom-message.html",

})
export class CustomMessageComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;

  isReadonly = true;
  myProval: any;
  myRemainCont: any = 160;
  mysmsContent: string = "";
  myOutletList: any = [];
  myCatList: any = [];
  myTemplateKey: any = [];
  myselectedRec: string;
  myselectedOutlet: string;
  myselectedCategory: string;
  showMyKeys: boolean = false;


  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo, private fb: FormBuilder,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {

  }
  selectedModeName: [string];




  preventInput($event) {
    $event.preventDefault();
    return false;

  }


  ngOnInit() {

    try {
      this.form = this.fb.group({
        RECIPIENTS: ['', Validators.required],
        MYOUTLETS: ['', Validators.required],
        MYCategory: ['', Validators.required],
        SMSCONTENT: ['', Validators.required],

      });
      this.getOutlets();


    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  getDropdownValue(event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let selectElementValue = selectedOptions[selectedIndex].value;
    return selectElementValue;
  }

  // getOutlets(event) {
  //   let val = this.getDropdownValue(event);
  //   this.myselectedRec = val;
  //   this.myOutletList = [];
  //   this.myCatList = [];
  //   this.myTemplateKey = [];
  //   this.showMyKeys = false;
  //   this.findSMSLength("");
  //   this.form.patchValue({
  //     MYCategory: "",
  //     MYOUTLETS: ""
  //   });
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

    this.myOutletList = [];
    try {
      this.loadingService.show("Please wait...");
      let sub = this.masterService.selectOutlet()
        .subscribe(data => {
          console.log(data);
          if (data.status == 'ok') {
            this.loadingService.hide();
            this.myOutletList.push(data.result);
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
  getmySubCategory(val) {
    try {

    }
    catch (e) {
      this.childModal.hide()
      this.alertService.error(e);
    }
  }

  getmyCategory(val) {
    try {
      this.myCatList = [];
      this.myTemplateKey = [];
      this.showMyKeys = false;
      val = val.split(': ');
      this.myselectedOutlet = val[1];
      this.findSMSLength("");
      let requestOject = {
        // "TemplateType": this.myselectedRec,
        "OUTLETID": val[1]
      }
      this.form.patchValue({
        MYCategory: "",
      });
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
  getTemplateKey(val) {
    console.log(val);
    this.myTemplateKey = [];
    this.showMyKeys = false;
    try {
      val = val.split(': ');
      this.myselectedCategory = val[1];
      this.setMessageContent();
      let requestOject = {
        // "TemplateType": this.myselectedRec,
        "OUTLETID": this.myselectedOutlet,
        "SMSCATID": val[1]
      }
      console.log(requestOject);
      this.loadingService.show("Please wait...");
      let sub = this.masterService.selectTemplateKeyByCatID(JSON.stringify(requestOject))
        .subscribe(data => {
          console.log(data);
          if (data.status == 'ok') {
            this.showMyKeys = true;
            this.loadingService.hide();
            this.myTemplateKey.push(data.result);
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

  setMessageContent() {
    console.log("setmessagecontent");
    this.myCatList[0].forEach(value => {
      if (value['SMSCATID'] == this.myselectedCategory) {
        if (!value['CustomMessage'] || value['CustomMessage'] === null) {
        } else {
          this.mysmsContent = value['CustomMessage'];
          this.findSMSLength(this.mysmsContent);
        }
      }
    });
  }
  getSelectedKey(event) {
    let val = this.getDropdownValue(event);
    let mykeyLength = val.length + 4;
    let currentMessageLength = this.mysmsContent.length;
    if ((currentMessageLength + mykeyLength) > 160) {
      alert("You have not more remain character of message")
    } else {
      this.mysmsContent = this.mysmsContent.concat('{{' + val + '}}');
      this.findSMSLength(this.mysmsContent)
    }
  }
  findSMSLength(val) {
    let mycontlength = val.length;
    this.mysmsContent = val;
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
      let recipient = this.myselectedRec;
      let outlet = this.myselectedOutlet;
      let category = this.myselectedCategory;
      // if ((this.form.controls['RECIPIENTS'].value) == "" || this.form.controls['RECIPIENTS'].value == undefined) {
      //   this.alertService.error("Recipient is required");
      //   return;
      // }
      if ((this.form.controls['MYOUTLETS'].value) == "" || this.form.controls['MYOUTLETS'].value == undefined) {
        this.alertService.error("Outlet is required");
        return;
      }
      if ((this.form.controls['MYCategory'].value) == "" || this.form.controls['MYCategory'].value == undefined) {
        this.alertService.error("Category is required");
        return;
      }
      if ((this.form.controls['SMSCONTENT'].value) == "" || this.form.controls['SMSCONTENT'].value == undefined) {
        this.alertService.error("SMSCONTENT is required");
        return;
      }
      let requestOject = {
        "SMSCATID": category,
        "CustomizeMessage": this.form.controls['SMSCONTENT'].value,
      }
      // console.log(requestOject);

      this.loadingService.show("Saving Data please wait...");
      let sub = this.masterService.myCustomizeMessage(JSON.stringify(requestOject))
        .subscribe(data => {
          console.log(data);
          if (data.status == 'ok') {
            this.loadingService.hide();
            this.alertService.success("Set Customize Template successfully...");
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
  setDefaultMessage(val) {
    this.form.patchValue({
      MYCategory: "",
      MYOUTLETS: ""
    });
  }
  clearText() {
    this.form.patchValue({
      RECIPIENTS: "",
      MYOUTLETS: "",
      MYCategory: "",
      SMSCONTENT: "",
    });
    this.findSMSLength("");
    this.myOutletList = [];
    this.myCatList = [];
    this.myTemplateKey = [];
    this.showMyKeys = false;
  }

}
