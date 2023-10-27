import { Component, ViewChild, OnInit } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { QuotationItemList } from "../../../../common/interfaces/QuotationItemList";
import * as moment from 'moment'
import { result } from "lodash";
import { RESOURCE_CACHE_PROVIDER } from "@angular/platform-browser-dynamic";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { isNullOrUndefined } from "util";
@Component({
  selector: "quotationinvoice",
  templateUrl: "./quotationinvoice.html",
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
export class AddQuotationInvoiceComponent implements OnInit {
  ItemList: QuotationItemList[] = <QuotationItemList[]>[];
  activerowIndex: number;

  @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;
  @ViewChild("genericGridPerformaInvoice") genericGridPerformaInvoice: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForHOPerformaRequest: GenericPopUpSettings = new GenericPopUpSettings();
  customer: any;
  mainobj: any;
  mode: string;

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private aroute: ActivatedRoute,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    private route: Router

  ) {
    this._trnMainService.initialFormLoad(65);
    this._trnMainService.formName = "Quotation Invoice";
    this.aroute.queryParams.subscribe(params => {
      if (params.voucher) {
        let voucherNo = params.voucher;
        this.loadingService.show("Please wait.Getting Data...");
        this.masterService.masterGetmethod(`/loadRFQFromSenderDatabase?voucherNo=${voucherNo}&fromCompanyid=${params.FROMCOMPANY}`).subscribe(
          (res) => {
            this.loadingService.hide();
            if (res.status == "ok") {
              this.ItemList = [];
              res.result.im.ItemList.forEach(e => {
                let item: QuotationItemList = <QuotationItemList>{};
                item.ORDERQTY = e.Indent;
                item.ITEMDESC = e.DESCA;
                item.MCODE = e.MCODE;
                item.ALTUNIT = e.ALTUNIT;
                this.ItemList.push(item)
              });
              this.customer = res.result.customer[0];
              this._trnMainService.TrnMainObj.RFQValidity = this.transformDate(res.result.im.RFQVALIDITY);
              this._trnMainService.TrnMainObj.ExpectedDeliveryDate = this.transformDate(res.result.im.EXPECTEDDELIVERYDATE)
              this._trnMainService.TrnMainObj.REFBILL = res.result.im.RFQNO
              this._trnMainService.TrnMainObj.TRN_DATE = this.transformDate(res.result.im.TRNDATE)
              this._trnMainService.TrnMainObj.BILLTO = this.customer.ACNAME;
              this._trnMainService.TrnMainObj.PARAC = this.customer.ACID;
              this._trnMainService.TrnMainObj.TRNAC = this.customer.ACID;
              // _trnMainService.TrnMainObj.INVOICETYPE
              //   _trnMainService.TrnMainObj.AdditionalObj.TRNTYPE
              this.masterService.ShowMore = true;
              
            }
            else {
              this.alertService.error(res.message);
            }
          },
          (error) => {
            this.alertService.error(error.message);
          },
          () => {
          }
        );
      }
    }
    );
    this.masterService.ShowMore == true;
  }
  ngOnInit() {
    this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Quotation Vouchers",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'VCHRNO',
          title: 'SO NO.',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TRNDATE',
          title: 'DATE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'NETAMNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false
        }
      ]
    });

  }
  transformDate(date) {
    return moment(date).format('DD/MM/YYYY')
  }
  OnQuantityEnter = (index: number) => {
    if (this._trnMainService.nullToZeroConverter(this.ItemList[index].ORDERQTY) <= 0) {
      return false;
    } else {
      if (this.activerowIndex < this.ItemList.length) {
        this.activerowIndex = index + 1;
        let nextIndex = index + 1;
        setTimeout(() => {
          if (document.getElementById("Quantity" + nextIndex)) {
            document.getElementById("Quantity" + nextIndex).focus();
          }
        }, 5);
      }
    }
  }
  saveQuotation() {
    if (this._trnMainService.TrnMainObj.Mode == "view") {
      this.alertService.error("cannot save in view Mode.")
      return;
    }
    let il = this.ItemList;
    let body = {
      MainObj: {
        VCHRNO: this._trnMainService.TrnMainObj.VCHRNO,
        DIVISION: this._trnMainService.TrnMainObj.DIVISION,
        CHALANNO: this._trnMainService.TrnMainObj.CHALANNO,
        TRNDATE: this._trnMainService.TrnMainObj.TRNDATE,
        NETAMNT: this._trnMainService.TrnMainObj.NETAMNT,
        RFQVALIDITY: this._trnMainService.TrnMainObj.RFQValidity,
        EXPECDELIVERYDATE: this._trnMainService.TrnMainObj.ExpectedDeliveryDate,
        DELIVERYDATE: this.transformDate(this._trnMainService.TrnMainObj.DeliveryDate),
        REFBILL: this._trnMainService.TrnMainObj.REFBILL,
        TRN_DATE: this._trnMainService.TrnMainObj.TRN_DATE,
        PARAC: this._trnMainService.TrnMainObj.PARAC,
        REMARKS: this._trnMainService.TrnMainObj.REMARKS,
        PHISCALID: this._trnMainService.TrnMainObj.PhiscalID,
        VOUCHERTYPE: this._trnMainService.TrnMainObj.VoucherType
      },
      ItemList: this.ItemList,
    }
    this.masterService.masterPostmethod(`/saveQuotation`, body).subscribe(
      res => {
        if (res.status == "ok") {
          this.alertService.success("Quotation saved successfullly.").then(
            () => {
              let url = this.route.url.split('?')[0];
              this.route.navigateByUrl(url);
              this.onResetClicked();
            }
          );
        }
        else {
          this.alertService.error(res.message);
        }
      },
      error => {
        this.alertService.error(error);
      }
    )
  }
  onVoucherDoubleClicked(event) {
    this._trnMainService.TrnMainObj.Mode = "view";
    console.log(event, 'onVoucherDoubleClicked');
    this.loadingService.show("Please wait data is loading...");
    this.masterService.masterGetmethod(`/getViewVoucherDetails/?VoucherNo=${event.VCHRNO}`).subscribe(
      res => {
        this.loadingService.hide();
        console.log(res);
        if (res.status == "ok") {
          this.mainobj = res.result;
          this._trnMainService.TrnMainObj.VCHRNO = event.VCHRNO
          this._trnMainService.TrnMainObj.DIVISION = res.result.DIVISION
          this._trnMainService.TrnMainObj.CHALANNO = res.result.CHALANNO
          this._trnMainService.TrnMainObj.TRNDATE = this.transformDate(res.result.TRNDATE)
          this._trnMainService.TrnMainObj.NETAMNT = res.result.NETAMNT
          this._trnMainService.TrnMainObj.RFQValidity = this.transformDate(res.result.RFQVALIDITY)
          this._trnMainService.TrnMainObj.DeliveryDate = this.transformDate(res.result.DELIVERYDATE)
          this._trnMainService.TrnMainObj.ExpectedDeliveryDate = this.transformDate(res.result.EXPECDELIVERYDATE)
          this._trnMainService.TrnMainObj.REFBILL = res.result.REFBILL
          this._trnMainService.TrnMainObj.TRN_DATE = this.transformDate(res.result.TRN_DATE)
          this._trnMainService.TrnMainObj.PARAC = res.result.PARAC
          this._trnMainService.TrnMainObj.REMARKS = res.result.REMARKS
          this._trnMainService.TrnMainObj.PhiscalID = res.result.PHISCALID
          this._trnMainService.TrnMainObj.VoucherType = res.result.VOUCHERTYPE
          this.ItemList = res.result.ProdList;
        }
        else if (res.status == "error") {
          this.loadingService.hide();
          this.alertService.error(res.message)
        }
        else {
          this.loadingService.hide();
          this.alertService.error(res.result)
        }
      },
      error => {
        this.loadingService.hide();
        this.alertService.error(error);

      },
      () => {
        this.loadingService.hide();
      }
    );
  }
  onEnterQuantity(i) {

    this.activerowIndex = i;
    if (this._trnMainService.nullToZeroConverter(this.ItemList[i].QUANTITY) < 1) {
      document.getElementById("Quantity" + i).focus();
      return false;
    }
    document.getElementById("Rate" + i).focus();
    return false;
  }
  QuantityChangeEvent(i) {
    this.activerowIndex = i;
    
    this.masterService.focusAnyControl('Rate' + (this._trnMainService.nullToZeroConverter(this.activerowIndex)))
    return;

  }
  onEnterRate(i) {
    
    if (this.masterService.nullToZeroConverter(this.ItemList[i].RATE) < 0) {
      document.getElementById("Rate" + i).focus();
      return false;
    }
    document.getElementById("Dcrate" + i).focus();
    return false;
  }
  RateChangeEvent(i) {
    if (this.masterService.nullToZeroConverter(this.ItemList[i].RATE) < 0) {
      document.getElementById("rate" + i).focus();
      return false;
    }
    this.activerowIndex = i;
    
    this.masterService.focusAnyControl("Dcrate" + this.activerowIndex);
  }
  onEnterDcrate(i) {
    if (this.masterService.nullToZeroConverter(this.ItemList[i].DCRATE) < 0) {
      document.getElementById("dcrate" + i).focus();
      return false;
    }
    let amount = this.ItemList[i].QUANTITY * this.ItemList[i].RATE;
    this.ItemList[i].DCAMNT = (this.ItemList[i].DCRATE * amount) / 100;
    let per = (100 - this.masterService.nullToZeroConverter(this.ItemList[i].DCRATE)) / 100;
    amount = amount * per;
    
    this.ItemList[i].NETAMOUNT = amount;
    document.getElementById("remarks" + i).focus();
    return false;

  }
  DcrateChangeEvent(i) {
    this.masterService.focusAnyControl("Remarks" + this.activerowIndex);
  }
  onEnterRemarks(i) {
    console.log(this.masterService.nullToZeroConverter(this.ItemList.length));
    if (this._trnMainService.TrnMainObj.REFBILL != null) {
      if (this.masterService.nullToZeroConverter(this.ItemList.length) > i + 1) {
        this.masterService.nullToZeroConverter(this.ItemList[i + 1].QUANTITY);
      }
    }
    else {
    }

  }
  onResetClicked() {
    this.ItemList = [];
    this.activerowIndex = 0;
    this._trnMainService.initialFormLoad(65);
    this._trnMainService.formName = "Quotation Invoice";
  }
  calculateindividualNetAmount() {

  }
}
