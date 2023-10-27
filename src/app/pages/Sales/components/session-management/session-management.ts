import { Component, ViewChild, OnInit } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { ActivatedRoute } from "@angular/router";
import { ModalDirective } from "ng2-bootstrap";
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { AuthService } from "../../../../common/services/permission";
import { result } from "lodash";
import { SelectionChange } from "@angular/material";


@Component({
  selector: "session-management",
  templateUrl: "./session-management.html",
  providers: [TransactionService],
  styles: [
    `
    .GRNPopUp tbody tr:hover {
      background-color: #e0e0e0;
    }
    .GRNPopUp tr.active td {
      background-color: #123456 !important;
      color: white;
    }
    .modal-dialog.modal-md {
      top: 45%;
      margin-top: 0px;
    }

    .modal-dialog.modal-sm {
      top: 45%;
      margin-top: 0px;
    }

    .table-summary > tbody > tr > td {
      font-size: 12px;
      font-weight: bold;
    }

    .table-summary > tbody > tr > td:first-child {
      text-align: left !important;
    }
    `
  ]
})
export class SessionManagementComponent implements OnInit {
  morningCash: number = 0;
  cashLimit: number = 0;
  selectedUser: string = "";
  sessionId: string = "";
  isCreate: boolean = true;

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private loadingService: SpinnerService,
  ) { }

  ngOnInit() {
    this.selectedUser = this.masterService.userProfile.username;
    this.getSession();
  }

  save() {
    if (this.morningCash !== this.denoTotal) {
      if (confirm("There is cash difference in actual cash and total cash. Are you sure you want to save?")) {
        if (this.selectedUser.trim() == "") {
          this.alertService.error("Please select a user!");
          return;
        }
        var object = {};
        if (this.denoList != undefined && this.denoList.filter(a => a.qty > 0).length > 0) {
          object = {
            morningCash: this.morningCash,
            cashLimit: this.cashLimit,
            user: this.selectedUser,
            denominationList: this.denoList
          };
        }
        else {
          object = {
            morningCash: this.morningCash,
            cashLimit: this.cashLimit,
            user: this.selectedUser,
            denominationList: null
          };
        }
        this.masterService.masterPostmethod('/startsession', object).subscribe(data => {
          this.alertService.success("Session started");
          this.isCreate = true;
        });
      }
    }
  }

  edit() {
    if (this.morningCash !== this.denoTotal) {
      if (confirm("There is cash difference in actual cash and total cash. Are you sure you want to save?")) {
        var object = {
          morningCash: this.morningCash,
          cashLimit: this.cashLimit,
          user: this.selectedUser,
          sessionId: this.sessionId,
          denominationList: this.denoList
        };
        this.masterService.masterPostmethod('/editsession', object).subscribe(data => {
          this.alertService.success("Session edited");
          this.isCreate = true;
        });
      }
    }
  }
  isEditable: boolean = true;
  getTodaySales() {
    this.masterService
      .masterGetmethod("/gettodaycashsalesbyuser/" + this.selectedUser).subscribe((data: any) => {
        if (data.result.totalSales > 0) {
          this.isEditable = false;
          this.isCreate = false;
        }
        else {
          this.isEditable = true;
          this.isCreate = true;
        }
        this.getSession();
      });
  }


  session: any;
  sessionDenomination: any[] = [];
  getSession() {
    this.masterService.masterGetmethod('/getsession/' + this.selectedUser).subscribe(data => {

      if (data.result == "Not Found") {
        this.isCreate = true;
        this.morningCash = 0;
        this.cashLimit = 0;
        this.sessionDenomination = [];
      }
      else {
        this.isCreate = false;
        this.session = data.result;
        this.sessionDenomination = data.result[0].denominationList;
        this.morningCash = data.result[0].OpeningAmount;
        this.cashLimit = data.result[0].CashLimit;
        this.sessionId = data.result[0].SessionID;
      }
    });
  }

  gridPopupSettingsForuser: GenericPopUpSettings = {
    title: "Users",
    apiEndpoints: `/getUsers`,
    defaultFilterIndex: 0,
    columns: [
      {
        key: "UNAME",
        title: "NAME",
        hidden: false,
        noSearch: false
      },
      {
        key: "DESCRIPTION",
        title: "DESCRIPTION",
        hidden: false,
        noSearch: true
      }
    ]
  };
  @ViewChild("genericGridUser") genericGridUser: GenericPopUpComponent;
  customerTabCommand(e) {
    e.preventDefault();
    let userProfile = this._trnMainService.userProfile;
    if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice && (userProfile.CompanyInfo.ORG_TYPE == "ak" || userProfile.CompanyInfo.ORG_TYPE == "ck" || userProfile.CompanyInfo.ORG_TYPE == "pms" || userProfile.CompanyInfo.ORG_TYPE == "gak" || userProfile.CompanyInfo.ORG_TYPE == "retailer")) {
      // this.masterService.focusAnyControl("barcodebilling0");
    } else {
      // document.getElementById("customerselectid").blur();
      if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
      this.genericGridUser.show("", false, "");
    }
  }
  customerEnterCommand(e) {
    e.preventDefault();
    //  document.getElementById("customerselectid").blur();
    if (this._trnMainService.TrnMainObj.BILLTO == null || this._trnMainService.TrnMainObj.BILLTO == "" || this._trnMainService.TrnMainObj.BILLTO == undefined) {

      if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }

      this.genericGridUser.show("", false, this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE);
    }

  }
  onUserSelected(customer) {
    console.log(customer);
    this.selectedUser = customer.UNAME;
    this.getTodaySales();
  }

  denoTotal: number = 0;
  denoList: any;
  getDenomination(event) {
    
    this.denoTotal = 0;
    this.denoList = event;
    if (this.denoList) {
      for (let d of this.denoList) {
        d.amount = this.masterService.nullToZeroConverter(d.qty) * this.masterService.nullToZeroConverter(d.basevalue);
        this.denoTotal = this.denoTotal + d.amount;
      }
    }
  }
  saveDenomination() {
    if (this.morningCash !== this.denoTotal) {
      if (confirm("There is cash difference in actual cash and total cash. Are you sure you want to save?")) {
        this.loadingService.show("Please wait... Saving your data.");

        this.denoList.forEach(d => {
          d.morning_cash = this.morningCash;
          d.cash_taken = 0
        });
        this.masterService.masterPostmethod("/saveUserDenomination", this.denoList).subscribe(res => {
          if (res.status == 'ok') {
            this.loadingService.hide();
            // console.log(res);
            this.alertService.success("Data Saved SuccessFully");
            // this.reset();
          }
          else {
            
            this.loadingService.hide();
            this.alertService.warning(res.status)
            // this.reset();
          }
        })

      }
      else {
        return;
      }
    }


  }

}
