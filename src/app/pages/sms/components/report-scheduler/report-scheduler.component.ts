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
@Component({
  selector: "reportscheduler",
  templateUrl: "./report-scheduler.html",


})
export class ReportSchedulerComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;
  SCHID: string = "";
  isReadonly = true;
  mode: string = "add";
  public loading: boolean;
  isShownupdate: boolean = false;
  isShownsave: boolean = true;
  public STATUSTYPE: string = "";
  public RECIPIENTS: string = "";
  public SchedulerCycle: string = "";
  public SCHEDULERDATE: string;
  public HOURS: string = "";
  public MINUTES: string = "";
  public PHISCALID: string = "";
  public myRecipientList: any = [];
  public myReportList: any = [];
  myReportListFilter: any = [];
  public selectAll: boolean = false;
  checkreportArr: any = [];

  public CCEmail: string = "";
  public BCCEmail: string = "";


  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo, private fb: FormBuilder,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {
    this.mode = this._activatedRoute.snapshot.params["mode"];
    this.SCHID = this._activatedRoute.snapshot.params["passId"];
    this.get();
  }
  schedulerCycle: any = [
    {
      name: "Daily",
      value: "daily"
    },
    {
      name: "Weekly",
      value: "weekly"
    }, {
      name: "Monthly",
      value: "monthly"
    }
  ];

  get() {
    try {
      this.loading = true;
      this.loadingService.show("Loading Data please wait...");
      this.masterService.masterGetmethod('/getAllMasterReport')
        .subscribe(data => {
          console.log(data);
          if (data.status == 'ok') {
            this.loading = false;
            this.loadingService.hide();
            this.myReportList.push(data.result);
            this.myReportListFilter.push(data.result);
            for (let i = 0; i < this.myReportList[0].length; i++) {
              for (let a = 0; a < this.checkreportArr.length; a++) {
                if (this.myReportList[0][i].REPORTNAME == this.checkreportArr[a]) {
                  this.myReportList[0][i].checkAccess = true;
                }
              }
            }

          } else {
            this.loadingService.hide();
            this.alertService.error(data.result);

          }
        });
      //console.log(this.myReportList);

    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  searchDivision(query: string) {

    let filteredParticipants = [];
    this.myReportList[0] = this.myReportListFilter[0];
    if (query) {
      this.myReportList[0] = this.myReportList[0].filter(p => {
        if (p.REPORTNAME && p.REPORTNAME.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
        return false;
      });
      //this.selectedVoucherList =  filteredParticipants;
    }
    else {
      this.myReportList[0] = this.myReportListFilter[0];

    }

  }

  getSelectAllRecord() {

    if (this.selectAll == true) {
      for (var i = 0; i < this.myReportList[0].length; i++) {
        this.myReportList[0][i].checkAccess = true;
      }
    }
    else {
      for (var i = 0; i < this.myReportList[0].length; i++) {
        this.myReportList[0][i].checkAccess = false;
      }
    }
  }

  preventInput($event) {
    $event.preventDefault();
    return false;

  }
  counter(i: number) {
    return new Array(i);
  }

  getRecipient() {
    this.myRecipientList = [];
    this.RECIPIENTS = "";
    if (this.STATUSTYPE == "" || this.STATUSTYPE == undefined) {
    } else {
      try {
        let requestOject = {
          "SchedulerMode": this.STATUSTYPE.toLowerCase()
        }
        this.loadingService.show("Loading Data please wait...");
        this.masterService.masterPostmethod('/getCustomerAndEmployee', requestOject)
          .subscribe(data => {
            // console.log(data);
            if (data.status == 'ok') {
              this.loadingService.hide();
              this.myRecipientList.push(data.result);
            } else {
              this.loadingService.hide();
              this.alertService.error(data.result);

            }
          });
        //(this.myRecipientList);
      } catch (ex) {
        this.alertService.error(ex);
      }
    }


  }
  ngOnInit() {

    try {
      if (this.mode == "edit") {
        this.masterService.masterGetmethod(`/getReportSchedulerbyId?schID=${this.SCHID}`).subscribe(res => {
          if (res.status == "ok") {
            console.log("getReportSchedulerbyId", res.result);
            var data = res.result;
            let datearr = data[0].SCH_DATE.split('T');
            let myarr = datearr[1].split(':');
            var myhour;
            var mymin;
            if (myarr[0] < 10) {
              var hh = myarr[0].split('');
              myhour = hh[1];
            } else { myhour = myarr[0]; }
            if (myarr[1] < 10) {
              var hh = myarr[1].split('');
              mymin = hh[1];
            } else { mymin = myarr[1] }
            this.SCHEDULERDATE = datearr[0],
              this.HOURS = myhour,
              this.MINUTES = mymin,
              this.SchedulerCycle = data[0].CATEGORY;
            this.STATUSTYPE = data[0].STATUS_TYPE;
            this.PHISCALID = data[0].PHISCALID;
            this.getRecipient();
            this.RECIPIENTS = data[0].ASSIGN_REPORT;
            this.checkreportArr = data[0].REPORT_NAME.split(',');
            //this.messageMode = 1;
            this.isShownsave = false;
            this.isShownupdate = true;

          }
        });




      }

    } catch (ex) {
      this.alertService.error(ex);
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




  onSaveClicked(action) {
    try {
      this.checkreportArr = [];
      for (var i = 0; i < this.myReportList[0].length; i++) {
        if (this.myReportList[0][i].checkAccess == true) {
          this.checkreportArr.push(this.myReportList[0][i].REPORTNAME);
        }
      }
      if (this.checkreportArr.length < 5) {
        this.alertService.error("Please Select Minimum Five Report");
        return;
      }
      if (this.STATUSTYPE == "" || this.STATUSTYPE == undefined) {
        this.alertService.error("Select Type");
        return;
      }
      if (this.RECIPIENTS == "" || this.RECIPIENTS == undefined) {
        this.alertService.error("Select Recipient");
        return;
      }
      if (this.SchedulerCycle == "" || this.SchedulerCycle == undefined) {
        this.alertService.error("Select Cycle");
        return;
      }
      if (this.SCHEDULERDATE == "" || this.SCHEDULERDATE == undefined) {
        this.alertService.error("Date is required");
        return;
      }
      if (this.HOURS == "" || this.HOURS == undefined) {
        this.alertService.error("Hour is required");
        return;
      }
      if (this.MINUTES == "" || this.MINUTES == undefined) {
        this.alertService.error("Minutes is required");
        return;
      }
      if (this.PHISCALID == "" || this.PHISCALID == undefined) {
        this.alertService.error("Physical Year is required");
        return;
      }
      if (action == "save") {
        let requestOject = {
          "ASSIGN_REPORT": this.RECIPIENTS,
          "REPORT_NAME": this.checkreportArr.join(),
          "SCH_DATE": this.SCHEDULERDATE + ' ' + this.HOURS + ':' + this.MINUTES,
          "CATEGORY": this.SchedulerCycle,
          "STATUS_TYPE": this.STATUSTYPE,
          "PHISCALID": this.PHISCALID,
          "CCEmail": this.CCEmail,
          "BCCEmail": this.BCCEmail
        }

        //console.log(requestOject);

        this.loadingService.show("Saving Data please wait...");
        let sub = this.masterService.masterPostmethod('/insertReportScheduler', requestOject)
          .subscribe(data => {
            //console.log(data);
            if (data.status == 'ok') {
              this.loadingService.hide();
              this.alertService.success("Scheduler set Successfully...");
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

      if (action == "edit") {
        let requestOject = {
          "SCHID": this.SCHID,
          "ASSIGN_REPORT": this.RECIPIENTS,
          "REPORT_NAME": this.checkreportArr.join(),
          "SCH_DATE": this.SCHEDULERDATE + ' ' + this.HOURS + ':' + this.MINUTES,
          "CATEGORY": this.SchedulerCycle,
          "STATUS_TYPE": this.STATUSTYPE,
          "PHISCALID": this.PHISCALID,
          "CCEmail": this.CCEmail,
          "BCCEmail": this.BCCEmail
        }
        console.log(requestOject);

        this.loadingService.show("Saving Data please wait...");
        let sub = this.masterService.masterPostmethod('/updateReportScheduler', requestOject)
          .subscribe(data => {
            //console.log(data);
            if (data.status == 'ok') {
              this.loadingService.hide();
              this.alertService.success("Report Scheduler Update Successfully...");
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
    }
    catch (e) {
      this.childModal.hide()
      this.alertService.error(e);
    }

  }





  clearText() {
    this.isShownupdate = false;
    this.isShownsave = true;
    this.STATUSTYPE = "";
    this.RECIPIENTS = "";
    this.SchedulerCycle = "";
    this.SCHEDULERDATE = "";
    this.HOURS = "";
    this.PHISCALID = "";
    this.MINUTES = "";
    this.myRecipientList = [];
    this.myReportList = [];
    this.myReportListFilter = [];
    this.selectAll = false;
    this.checkreportArr = [];
    this.get();

  }

}
