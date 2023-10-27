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
declare var CKEDITOR;
@Component({
  selector: "custom-email",
  templateUrl: "./custom-email.html",

})
export class CustomEmailComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;

  isReadonly = true;
  myemailContent: string = "";
  myOutletList: any = [];
  myCatList: any = [];
  myTemplateKey: any = [];
  myselectedRec: string;
  myselectedOutlet: string;
  myselectedCategory: string;
  showMyKeys: boolean = false;
  myemailContentSubject: "";

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
        EMAILCONTENT: [''],
        EMAILCONTENTSUBJECT: ['']

      });
      this.getOutlets();


    } catch (ex) {
      this.alertService.error(ex);
    }
    CKEDITOR.replace('editor1');
  }

  getDropdownValue(event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let selectElementValue = selectedOptions[selectedIndex].value;
    return selectElementValue;
  }
  // getOutlets(event) {
  //   let val=this.getDropdownValue(event);
  //   this.myselectedRec=val;
  //   this.myOutletList = [];
  //   this.myCatList = [];
  //   this.myTemplateKey=[];
  //   this.showMyKeys=false;
  //   this.setckEditorData("");
  //   this.form.patchValue({
  //     MYCategory:"",
  //     MYOUTLETS:""
  // });
  //   try {
  //    let requestOject={
  //     "TemplateType":val
  //   }
  //   console.log(requestOject);
  // this.loadingService.show("Please wait...");
  //      let sub = this.masterService.selectOutletByTemplateType(JSON.stringify(requestOject))
  //          .subscribe(data => {
  //            console.log(data);
  //              if (data.status == 'ok') {
  //               this.loadingService.hide();
  //               this.myOutletList.push(data.result);
  //                 // this.alertService.success("Message send shortly...");
  //                 // this.clearText();
  //              }
  //              else {
  //                  this.loadingService.hide();
  //                  this.alertService.error(data.result);

  //              }

  //          },
  //              error => {
  //                  this.loadingService.hide();
  //                  this.alertService.error(error)
  //              }
  //          );
  //      this.subcriptions.push(sub);
  //   }
  //  catch (e) {
  //      this.childModal.hide()
  //      this.alertService.error(e);
  //  }
  // }
  getOutlets() {
    console.log('hello')
    // this.setckEditorData("");
    this.myOutletList = [];
    try {
      this.loadingService.show("Please wait...");
      let sub = this.masterService.selectOutlet()
        .subscribe(data => {
          console.log(data, "data");
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

  getmyCategory(val) {
    try {
      this.myCatList = [];
      this.myTemplateKey = [];
      this.showMyKeys = false;
      val = val.split(': ');
      this.myselectedOutlet = val[1];
      this.form.patchValue({
        MYCategory: "",
      });
      this.setckEditorData("");
      let requestOject = {
        // "TemplateType": this.myselectedRec,
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
  getTemplateKey(val) {
    console.log(val);
    this.myTemplateKey = [];
    this.showMyKeys = false;
    try {
      val = val.split(': ');
      this.myselectedCategory = val[1];
      this.setMessageContent();
      let requestOject = {
        "TemplateType": this.myselectedRec,
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
        if (!value['CustomEmailMessage'] || value['CustomEmailMessage'] === null) {
          this.myemailContent = value['EmailMessage'];
          this.myemailContentSubject = value['EmailSubject']
        } else {
          console.log("customnullnot")
          this.myemailContent = value['CustomEmailMessage'];
          this.myemailContentSubject = value['EmailSubject']
        }
        this.setckEditorData(this.myemailContent);
      }
    });
  }
  getSelectedKey(event) {
    let val = this.getDropdownValue(event);
    this.myemailContent = this.myemailContent.concat('{{' + val + '}}');
    this.setckEditorData(this.myemailContent);
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
      let myck = CKEDITOR.instances.editor1.getData();
      if ((myck.length) == 0 || myck.length == undefined) {
        this.alertService.error("Email Content is required");
        return;
      }


      let requestOject = {
        "SMSCATID": category,
        "CustomizeEmailMessage": myck,
        "EmailSubject": this.myemailContentSubject
      }
      //console.log(requestOject);

      this.loadingService.show("Saving Data please wait...");
      let sub = this.masterService.myCustomizeEmail(JSON.stringify(requestOject))
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
  setckEditorData(val) {
    CKEDITOR.instances.editor1.setData(val);
  }


  clearText() {
    this.form.patchValue({
      RECIPIENTS: "",
      MYOUTLETS: "",
      MYCategory: "",
      EMAILCONTENT: "",

    });
    this.myOutletList = [];
    this.myCatList = [];
    this.myTemplateKey = [];
    this.showMyKeys = false;
    this.setckEditorData("");
  }

}
