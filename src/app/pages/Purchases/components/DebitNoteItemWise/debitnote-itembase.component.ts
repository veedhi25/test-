import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { PREFIX } from "./../../../../common/interfaces/Prefix.interface";

import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { AlertService } from '../../../../common/services/alert/alert.service';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import * as moment from 'moment'
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { VoucherTypeEnum } from '../../../../common/interfaces/TrnMain';
import { ProductInsertComponent } from '../../../../common/Transaction Components/ProductInsert';
import { VoucherHistoryComponent } from '../../../../common/Transaction Components/voucher-history.component';
import { UserWiseTransactionFormConfigurationComponent } from '../../../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.component';


@Component({
  selector: "debitnote-itembase",
  templateUrl: "./debitnote-itembase.component.html",
  providers: [TransactionService],
  styleUrls: ["../../../modal-style.css"]
})

export class DebitNoteItemBaseComponent {
  @ViewChild("userwisetransactionformconfig") userwisetransactionformconfig: UserWiseTransactionFormConfigurationComponent;

  gridcancelPurchasePopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericPurchaseReturnCancel") genericPurchaseReturnCancel: GenericPopUpComponent;
  @ViewChild("productinsert") productinsert: ProductInsertComponent;


  genericCreditNotePopupSetting: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericCreditNoteGrid") genericCreditNoteGrid: GenericPopUpComponent;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
  @ViewChild("purchasereturnhistory") purchasereturnhistory: VoucherHistoryComponent;


  prefix: PREFIX = <PREFIX>{};
  public printCopyCaption: string = '';

  private myTimer: any;
  checkstatus = true;
  checkView: string;

  constructor(public masterService: MasterRepo, private _trnMainService: TransactionService, public alertService: AlertService,
    private loadingService: SpinnerService) {
    this._trnMainService.formName = "Purchase Return";
    this._trnMainService.initialFormLoad(16);
    this._trnMainService.pageHeading = "Purchase Return";

  }

  ngOnInit() {


    this.genericCreditNotePopupSetting = {
      title: "Credit Notes",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'BILLTO',
          title: 'CUSTOMER',
          hidden: true,
          noSearch: false
        },
        {
          key: 'VCHRNO',
          title: 'VOUCHER NO.',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TDATE',
          title: 'DATE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'NETAMNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false
        },
        {
          key: 'VOUCHERREMARKS',
          title: 'TYPE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TRNSTATUS',
          title: 'STATUS',
          hidden: false,
          noSearch: true
        }
      ]
    }




    this.gridcancelPurchasePopupSettings = Object.assign(new GenericPopUpSettings, {
      title: "Purchase Return Cancel",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'VCHRNO',
          title: 'RETURN NO.',
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
    
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Purchase Return",
        sampleFileUrl: `/downloadSample/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        uploadEndpoints: `/importFileForTransaction/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        allowMultiple: false,
        acceptFormat: ".csv",
        filename: "PI_SampleFile"
        // note: this.note
      });
  }


  onPurchaseReturnCancelClick() {
    this.genericPurchaseReturnCancel.show("", false, "purchaseReturnCancelList")
  }




  public printIt() {
    clearInterval(this.myTimer);
    try {
      //alert("reached printIT")
      let printContents, popupWin;
      printContents = document.getElementById('InvoiceNewPrint').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1500px');
      // popupWin.document.open();
      popupWin.document.write(`
          <html>
              <head>                  
                  <style>
                      .InvoiceHeader{
                text-align:center;
                font-weight:bold
            }
            p
            {
                height:5px;
            }
            table{
                margin:5px
            }
            .summaryTable{
                float: right;
                border: none;
            }

            .summaryTable  td{
                text-align:right;
                border:none;
            }

            .itemtable{
                border: 1px solid black;
                border-collapse: collapse;
            }
            .itemtable th{                
                height:30px;
                font-weight:bold;
            }
            .itemtable th, td {               
                border: 1px solid black;
                padding:2px;

            }
                  </style>
              </head>
              <body onload="window.print();window.close()">${printContents}
              </body>
          </html>`
      );
      popupWin.document.close();
    }
    catch (ex) {
      this.alertService.error(ex)
    }



  }

  onPurchaseReturnCancelSelect(event) {
    // this._trnMainService.loadData(event.VCHRNO,event.DIVISION,event.PhiscalId);
    this.loadingService.show("Getting Details, Please Wait...");
    this.masterService.LoadTransaction(event.VCHRNO, event.DIVISION, event.PhiscalID, "VIEW").subscribe(
      data => {
        this.loadingService.hide();
        if (data.status == "ok") {
          this._trnMainService.TrnMainObj = data.result;
          this._trnMainService.TrnMainObj.REFBILLDATE = moment(data.result.TRNDATE).format("DD/MM/YYYY");
          if (this._trnMainService.TrnMainObj.TransporterEway == null) {
            this._trnMainService.TrnMainObj.TransporterEway = <any>{};
          }
          if (this._trnMainService.TrnMainObj.AdditionalObj == null) {
            this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
          }


          for (let i in this._trnMainService.TrnMainObj.ProdList) {

            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            // this._trnMainService.CalculateNormalNew(i);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
          }

          //  this._trnMainService.ReCalculateBill();
          this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.Warehouse = this._trnMainService.TrnMainObj.MWAREHOUSE;
          if (
            !this._trnMainService.Warehouse &&
            this._trnMainService.TrnMainObj.ProdList &&
            this._trnMainService.TrnMainObj.ProdList.length > 0
          ) {
            this._trnMainService.Warehouse = this._trnMainService.TrnMainObj.ProdList[0].WAREHOUSE;
          }

          this._trnMainService.TrnMainObj.TRNDATE =
            this._trnMainService.TrnMainObj.TRNDATE == null
              ? ""
              : this._trnMainService.TrnMainObj.TRNDATE.toString().substring(0, 10);
          this._trnMainService.TrnMainObj.TRN_DATE =
            this._trnMainService.TrnMainObj.TRN_DATE == null
              ? ""
              : this._trnMainService.TrnMainObj.TRN_DATE.toString().substring(0, 10);
          this._trnMainService.TrnMainObj.CHEQUEDATE =
            this._trnMainService.TrnMainObj.CHEQUEDATE == null
              ? ""
              : this._trnMainService.TrnMainObj.CHEQUEDATE.toString().substring(0, 10);
          this._trnMainService.TrnMainObj.DeliveryDate =
            this._trnMainService.TrnMainObj.DeliveryDate == null
              ? ""
              : this._trnMainService.TrnMainObj.DeliveryDate.toString().substring(0, 10);
        }
        this._trnMainService.TrnMainObj.tag = "PURCHASERETURNCANCEL";
      },
      error => {
        this.loadingService.hide();
        this.alertService.error(error);
        this._trnMainService.trnmainBehavior.complete();
      },
      () => {
        this.loadingService.hide();
        this._trnMainService.trnmainBehavior.complete();
        this._trnMainService.TrnMainObj.REFBILL = this._trnMainService.TrnMainObj.VCHRNO;
        this._trnMainService.TrnMainObj.VoucherType = 64;
        this._trnMainService.TrnMainObj.VoucherPrefix = "DC";
        this._trnMainService.TrnMainObj.VoucherAbbName = "DC";
        this._trnMainService.TrnMainObj.tag = "PURCHASERETURNCANCEL";
        this._trnMainService.TrnMainObj.Mode = "CANCEL";
        this._trnMainService.pageHeading = "Purchase Return";
        const uuidV1 = require('uuid/v1');
        this._trnMainService.TrnMainObj.guid = uuidV1();
        this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE == "PurchaseReturnCancel";
      }
    );
  }
  onPurchaseReturnCancelSave() {
    if (confirm("Are you sure to cancel this Purchase return")) {
      this.loadingService.show("Cancelling the purchase return Please wait...");
      this.masterService.saveTransaction(this._trnMainService.TrnMainObj.Mode = "CANCEL", this._trnMainService.TrnMainObj).subscribe((res) => {
        if (res.status == 'ok') {
          this.loadingService.hide();
          this.alertService.success("Purchase Return Cancel Success...");
          this._trnMainService.initialFormLoad(16);
          this._trnMainService.pageHeading = "Purchase Return";
          this._trnMainService.TrnMainObj.VoucherPrefix = "DN";
          this._trnMainService.TrnMainObj.VoucherType = 16;
        }
        else {
          this._trnMainService.initialFormLoad(16);
          this.loadingService.hide();
          this.alertService.error(res.result._body);

        }
      }, error => {
        this._trnMainService.initialFormLoad(16);
        this.loadingService.hide();
        this.alertService.error(error);
      })

    }

  }

  showPurchaseInvoiceReturnPopup() {
    if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
      this.alertService.warning("Please select the supplier...");
      return;
    }
    this.fileUploadPopup.show();
  }

  fileUploadSuccess(uploadResult) {

    if (uploadResult.status == 'ok') {
      this._trnMainService.TrnMainObj.ProdList = uploadResult.result;
      this._trnMainService.TrnMainObj.tag = "FROMEXCEL";
      for (let i in this._trnMainService.TrnMainObj.ProdList) {

        this._trnMainService.setAltunitDropDownForView(i);
        let excelpurchaseprice = this._trnMainService.TrnMainObj.ProdList[i].REALRATE;
        this._trnMainService.TrnMainObj.ProdList[i].PRATE =
          this._trnMainService.TrnMainObj.ProdList[i].REALRATE =
          this._trnMainService.TrnMainObj.ProdList[i].ALTRATE =
          this._trnMainService.TrnMainObj.ProdList[i].RATE = excelpurchaseprice;
        this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
        this._trnMainService.TrnMainObj.ProdList[i].OtherDiscount = this._trnMainService.TrnMainObj.ProdList[i].INDODAMT;



      }


      this._trnMainService.ReCalculateBillWithNormal();
      this.loadingService.hide();

    } else {
      this.loadingService.hide();
      this.alertService.error(uploadResult.result._body);

    }

  }




  showCreditNote() {
    if (this._trnMainService.TrnMainObj.PARAC == null || this._trnMainService.TrnMainObj.PARAC == "") {
      this.alertService.error("Please select supplier first.");
      return;
    }
    this.genericCreditNoteGrid.show(null, false, "cnlistforedit");

  }
  onCreditNoteSelect(event) {




    let params = {
      VCHRNO: event.VCHRNO,
      DIVISION: event.DIVISION,
      PHISCALID: event.PhiscalID,
      MODE: "VIEW"
    }


    let selectedSupplier = this._trnMainService.TrnMainObj;
    this.loadingService.show("Please Wait While loadin details.");
    this.masterService.masterPostmethod_NEW(`/getViewVoucher`, params).subscribe((res) => {
      if (res.status == "ok") {
        this.loadingService.hide();
        this._trnMainService.TrnMainObj = res.result;
        if (
          !this._trnMainService.TrnMainObj ||
          !this._trnMainService.TrnMainObj.ProdList ||
          this._trnMainService.TrnMainObj.ProdList == undefined
        )
          return;
        this._trnMainService.TrnMainObj.BILLTO = selectedSupplier.BILLTO;
        this._trnMainService.TrnMainObj.PARAC = selectedSupplier.PARAC
        this._trnMainService.TrnMainObj.TRNAC = selectedSupplier.TRNAC;
        this._trnMainService.TrnMainObj.BILLTOADD = selectedSupplier.BILLTOADD;
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = selectedSupplier.AdditionalObj.TRNTYPE;
        this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = selectedSupplier.PARTY_ORG_TYPE;
        this._trnMainService.TrnMainObj.PARTY_GSTTYPE = selectedSupplier.PARTY_GSTTYPE;
        this._trnMainService.TrnMainObj.VoucherType = VoucherTypeEnum.DebitNote;
        this._trnMainService.TrnMainObj.VoucherPrefix = "DN";
        this._trnMainService.TrnMainObj.VoucherAbbName = "DN";
        this._trnMainService.TrnMainObj.Mode = "NEW";
        this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
        this._trnMainService.TrnMainObj.VCHRNO = "";
        this._trnMainService.TrnMainObj.CHALANNO = "";
        this._trnMainService.TrnMainObj.tag = "FROM_SALES_RETURN";
        this._trnMainService.TrnMainObj.AdditionalObj.tag = "FROM_SALES_RETURN";
        this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = "FROM_SALES_RETURN";
        for (let i in this._trnMainService.TrnMainObj.ProdList) {
          let x = this._trnMainService.TrnMainObj.ProdList[i];
          this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          this._trnMainService.TrnMainObj.ProdList[i].RealQty = x.REALQTY_IN;
          this._trnMainService.TrnMainObj.ProdList[i].STOCK = x.REALQTY_IN;
          this._trnMainService.TrnMainObj.ProdList[i].AltQty = x.AltQty;
          this._trnMainService.TrnMainObj.ProdList[i].REALQTY_IN = 0;
          this._trnMainService.TrnMainObj.ProdList[i].ALTQTY_IN = 0;
          this._trnMainService.TrnMainObj.ProdList[i].TOTALDISCOUNTINRETRUN = x.INDDISCOUNT;
          this._trnMainService.TrnMainObj.ProdList[i].TOTALDISCOUNTINRETRUN = x.ALTINDDISCOUNT;

          this._trnMainService.setAltunitDropDownForView(i);
          this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].PRATE, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
          this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
          this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
        }


        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.getVoucherNumber();
        this._trnMainService.getCurrentDate();
        const uuidV1 = require('uuid/v1');
        this._trnMainService.TrnMainObj.guid = uuidV1();
        let invoiceDate = res.result.TRN_DATE;
        this._trnMainService.TrnMainObj.TRN_DATE = invoiceDate == null ? this._trnMainService.TrnMainObj.TRNDATE : invoiceDate.toString().substring(0, 10);

      }
      else {
        this.loadingService.hide();
        this.alertService.error(res.result._body);
      }
    }, error => {
      this.loadingService.hide();
      this.alertService.error(error._body)
    })
  }

  onTransactionConfigureClick() {
    this.userwisetransactionformconfig.show(VoucherTypeEnum.DebitNote)
  }



  updateGridConfig(gridsetting) {
    this._trnMainService.userwiseTransactionFormConf = gridsetting;
  }

}
