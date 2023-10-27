import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { RFQMain, RFQPROD } from "../../../../common/interfaces/rfq.interface";
import * as moment from 'moment'
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
@Component({
  selector: "RFQentry",
  templateUrl: "./RFQEntry.component.html",
  providers: [TransactionService]
})
export class RFQEntryComponent {
  rfqItemList: RFQPROD[] = [];
  @ViewChild("genericgridIndentForRFQ") genericgridIndentForRFQ: GenericPopUpComponent;
  gridPopupSettingsForRFQIndent: GenericPopUpSettings = new GenericPopUpSettings();
  RFQSuppliersMailEdiSentorNotGrid: boolean;
  RFQSupplierdata: any[] = [];
  constructor(public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private alertService: AlertService,
    private spinnerService: SpinnerService,
    private route: Router) {
    this._trnMainService.initialFormLoad(114);
    this._trnMainService.formName = "RFQ";
    this.gridPopupSettingsForRFQIndent = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings("RFQINDENTLIST"));
  }
  onCancel() {

  }
  transformDate(date) {
    return moment(date).format('YYYY/MM/DD')
  }
  onShowIndentLoadForRFQ() {
    this.genericgridIndentForRFQ.show();
  }
  onRFQIndentDoubleClick(event) {
    if (event.TRNSTATUS == "CONVERTED TO RFQ") {
      this.alertService.error("this indent is already converted to RFQ");
      return;
    }
    if (event.TRNSTATUS == "CONVERTED TO PO") {
      this.alertService.error("this indent is already converted to PO");
      return;
    }
    this.spinnerService.show("Please Wait..");
    this.masterService.masterGetmethod(`/getIndentDetailForRFQ?INDENTNO=${event.INDENTNO}`).subscribe((res) => {
      this.spinnerService.hide();
      if (res.status == "ok") {
        this.rfqItemList = res.result.prodList;

        this._trnMainService.TrnMainObj.REFBILL = event.INDENTNO;
        this._trnMainService.TrnMainObj.TRN_DATE = res.result.IndentDate;
      }
    });
  }
  SaveRfq() {
    if (this._trnMainService.TrnMainObj.Mode == "View") {
      this.alertService.error("cannot save in view Mode.")
      return;
    }
    let obj = this._trnMainService.TrnMainObj;
    if (obj.VCHRNO == undefined || obj.VCHRNO == null || obj.VCHRNO == '') {
      this.alertService.error("vchrno is undefined or null");
      return;
    }
    if (obj.Mode == undefined || obj.Mode == null) {
      this.alertService.error("mode is undefined or null");
      return;
    }
    if (obj.TRNDATE == undefined || obj.TRNDATE == null) {
      this.alertService.error("TRNDATE is undefined or null");
      return;
    }
    if (this._trnMainService.TrnMainObj.SupplierListForRfq == undefined || this._trnMainService.TrnMainObj.SupplierListForRfq == null || this._trnMainService.TrnMainObj.SupplierListForRfq.length == 0) {
      this.alertService.error("Please Choose atleast one Supplier")
      return;
    }
    if (obj.RFQValidity == undefined || obj.RFQValidity == null) {
      this.alertService.error("please choose rfqvalidity date")
      return;
    }
    if (this.transformDate(obj.RFQValidity) < this.transformDate(new Date())) {
      this.alertService.error("rfq validity date cannot be less than today date.Please choose a valid date")
      return;
    }
    if (obj.ExpDate == undefined || obj.ExpDate == null) {
      this.alertService.error("please choose expdate");
      return;
    }
    if (this.transformDate(obj.ExpDate) < this.transformDate(obj.RFQValidity)) {
      this.alertService.error("Expected Delivery date cannot be less than rfq validity date. Please choose a valid date.");
      return;
    }
    if (this.rfqItemList == undefined || this.rfqItemList == null || this.rfqItemList.length == 0) {
      this.alertService.error("you have to add atleast one product");
      return;
    }
    if (obj.REFBILL == undefined || obj.REFBILL == null || !obj.REFBILL.startsWith('IN')) {
      this.alertService.error("Invalid Indent Number");
      return;
    }
    if (obj.TRN_DATE == undefined || obj.TRN_DATE == null || this.transformDate(obj.TRN_DATE) > this.transformDate(obj.RFQValidity)) {
      this.alertService.error("Invalid indent date or rfq validity date.Please choose valid dates.");
      return;
    }
    let rfqMain: any = {};
    console.log('obj', obj);
    rfqMain.RFQNO = obj.VCHRNO;
    rfqMain.MODE = obj.Mode;
    rfqMain.TRNDATE = obj.TRNDATE;
    rfqMain.RFQVALIDITY = obj.RFQValidity;
    rfqMain.EXPECTEDDELIVERYDATE = obj.ExpDate;
    let supplierList: any = obj.SupplierListForRfq;
    rfqMain.SUPPLIERLIST = supplierList;
    rfqMain.ItemList = this.rfqItemList;
    rfqMain.STAMP = obj.Stamp;
    rfqMain.REFNO = obj.REFBILL;
    rfqMain.REFDATE = obj.TRN_DATE;
    if (obj.REMARKS != undefined && obj.REMARKS != null) {
      rfqMain.REMARKS = obj.REMARKS;
    }
    console.log('saverfq');
    console.log(rfqMain, 'rfqMain');
    let body = {
      data: rfqMain,
      ItemList: this.rfqItemList,
      SupplierList: supplierList
    }
    this.spinnerService.show("Please wait while sending your rfq...");
    this.masterService.masterPostmethod(`/saveRfq`, body).subscribe(
      res => {
        if (res.status == "ok") {
          this.spinnerService.hide();
          this.alertService.success("rfq saved successfully").then(
            () => {
              let url = this.route.url.split('?')[0];
              this.route.navigateByUrl(url);
              this.onResetClicked();
            }
          );

        }
        else {
          this.spinnerService.hide();
          this.alertService.error(res.result);
        }
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error.Message);
      },
      () => {
        this.spinnerService.hide();
        
      }
    );
  }
  onVoucherDoubleClickedForView(event) {
    console.log(event, 'onVoucherDoubleClicked');
    this.spinnerService.show("Please wait data is loading...");
    this.masterService.masterGetmethod(`/getViewVoucherDetails?VoucherNo=${event.RFQNO}`).subscribe(
      res => {
        this.spinnerService.hide();
        console.log(res);
        this.spinnerService.hide();
        if (res.status == "ok") {
          this._trnMainService.TrnMainObj.Mode = "View";
          this._trnMainService.TrnMainObj.VCHRNO = res.result.qm.TRNDATE
          this._trnMainService.TrnMainObj.RFQValidity = res.result.qm.RFQValidity
          this.rfqItemList = res.result.qm.ItemList
          this._trnMainService.TrnMainObj.VCHRNO = res.result.qm.RFQNO;
          // this._trnMainService.TrnMainObj.Mode = res.result.qm.MODE;
          this._trnMainService.TrnMainObj.TRNDATE = res.result.qm.TRNDATE;
          this._trnMainService.TrnMainObj.RFQValidity = res.result.qm.RFQVALIDITY;
          this._trnMainService.TrnMainObj.ExpDate = res.result.qm.EXPECTEDDELIVERYDATE;
          if (res.result.SupplierListForRfq != null || res.result.SupplierListForRfq != undefined)
            this._trnMainService.TrnMainObj.SupplierListForRfq = res.result.SupplierListForRfq;
          this._trnMainService.TrnMainObj.BILLTO = '';
          if (!isNullOrUndefined(res.result.suppliernameList) || res.result.suppliernameList != '')
            this._trnMainService.TrnMainObj.BILLTO = res.result.suppliernameList;
          this._trnMainService.TrnMainObj.BILLTO
          this.rfqItemList = res.result.qm.ItemList;
          this._trnMainService.TrnMainObj.REFBILL = res.result.qm.REFNO;
          this._trnMainService.TrnMainObj.TRN_DATE = res.result.qm.REFDATE;
          if (res.result.qm.REMARKS != undefined && res.result.qm.REMARKS != null) {
            this._trnMainService.TrnMainObj.REMARKS = res.result.qm.REMARKS;
          }
        }
      }

    );
  }


  onResetClicked() {
    this.rfqItemList = [];
    this._trnMainService.initialFormLoad(114);
    this._trnMainService.formName = "RFQ";
  }
  onViewRFQSuppliersMailEdiSentorNot(event) {
    console.log('EVENT', event)
    this.masterService.masterGetmethod(`/ViewRFQSuppliersMailEdiSentorNot?rfqno=${event}`).subscribe(
      res => {
        if (res.status == "ok") {
          this.RFQSuppliersMailEdiSentorNotGrid = true;
          console.log(res.result)
          this.RFQSupplierdata = res.result
          this.RFQSupplierdata.forEach(x => {
            if (x.mailsent == true) {
              x.mailsent = 'yes'
            }
            else {
              x.mailsent = 'no'
            }
            if (x.notificationsent == true) {
              x.notificationsent = 'yes'
            }
            else {
              x.notificationsent = 'no'
            }
          })


        }
      }
    )
  }
  hide() {
    this.RFQSupplierdata = []
    this.RFQSuppliersMailEdiSentorNotGrid = false
  }
}
