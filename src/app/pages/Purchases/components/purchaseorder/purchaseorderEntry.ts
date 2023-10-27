import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { FileUploaderPopUpSettings, FileUploaderPopupComponent } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import * as moment from 'moment';

@Component({
  selector: "purchaseorderentry",
  templateUrl: "./purchaseorderEntry.html",
  providers: [TransactionService],

})

export class PurchaseOrderEntryComponent {

  genericGridSoSetting: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

  note = `
   <P>You can supply item list in a csv format for quick importing</p>
   <ul>
      <li>Enter CAR or PCS|PC in UOM field </li>
      <li>Item Code should be SAP Code</li>
   </ul> 
   `

  constructor(public masterService: MasterRepo, public _trnMainService: TransactionService, private alertService: AlertService, private spinnerService: SpinnerService) {
    this._trnMainService.formName = "Purchase Order";
    this._trnMainService.initialFormLoad(19);
    this.genericGridSoSetting = {
      title: "Sales Orders in PO",
      apiEndpoints: `/getMasterPagedListOfAny`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'ACNAME',
          title: 'Customer.',
          hidden: true,
          noSearch: false
        },
        {
          key: 'VCHRNO',
          title: 'SONO.',
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
          key: 'TRNSTATUS',
          title: 'STATUS',
          hidden: false,
          noSearch: false
        }]
    }
  }
  ngOnInit() {

   
  }

  showImportPopup() {
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
    {
      title: "Import Purchase Order",
      sampleFileUrl: `/downloadSampleFile/${this._trnMainService.TrnMainObj.VoucherPrefix}?acid=${this._trnMainService.TrnMainObj.PARAC}`,
      uploadEndpoints: `/importFileForTransaction/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
      allowMultiple: false,
      acceptFormat: ".csv",
      note: this.note,
      filename: "PO_SampleFile"
    });
    this.fileUploadPopup.show();
  }

  fileUploadSuccess(uploadedResult) {
    try {
      if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
        return;
      }

      if (uploadedResult.status == "ok") {
        let productList = uploadedResult.result;
        this._trnMainService.TrnMainObj.ProdList = productList;
        if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
        this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this.masterService.po_excelimport;
        for (let i in this._trnMainService.TrnMainObj.ProdList) {
          this._trnMainService.setAltunitDropDownForView(i);
          this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
          let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
          this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
          this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
          let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
          let rate2 = 0;

          rate2 = this._trnMainService.TrnMainObj.ProdList[i].SPRICE;

          this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
        }
        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.addRow();
        setTimeout(() => {
          this.masterService.focusAnyControl("menucode" + (this._trnMainService.TrnMainObj.ProdList.length - 1));
        }, 100);
      }
      else {
        this.alertService.error(uploadedResult.result._body);
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }


  onCancel() {
    if (this._trnMainService.TrnMainObj.POST) {
      this.alertService.error(`Cannot cancel invoice. ${this._trnMainService.TrnMainObj.VCHRNO} has already been delivered.`);
      return;
    } else if (this._trnMainService.TrnMainObj.STATUS) {
      this.alertService.error(`Cannot cancel invoice. ${this._trnMainService.TrnMainObj.VCHRNO} has already been cancelled.`);

    } else {
      this.spinnerService.show(`Please wait while cancelling invoice ${this._trnMainService.TrnMainObj.VCHRNO}.`)
      this.masterService.cancelInvoice(this._trnMainService.TrnMainObj.VCHRNO, this._trnMainService.TrnMainObj.VoucherPrefix).subscribe((res) => {
        if (res.status == "ok") {
          this.spinnerService.hide();
          this.alertService.success(res.result);
          this._trnMainService.initialFormLoad(this._trnMainService.TrnMainObj.VoucherType);
        }
      }, error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      })
    }
  }

  onImportFromSOInPO() {

    this.genericGridSO.show("", false, "salesOrderForPoImport");
  }
  onSoItemDoubleClick(event) {
    let MODE = "ViEW_SO_FOR_MULTIPLE_PO";
    this.spinnerService.show("Getting Details, Please Wait...");
    this.masterService.LoadTransaction(event.VCHRNO, event.DIVISION, event.PhiscalID, MODE).subscribe(
      data => {
        this.spinnerService.hide();
        if (data.status == "ok") {
          this._trnMainService.TrnMainObj = data.result;
          this._trnMainService.TrnMainObj.Mode = "NEW";
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.TrnMainObj.REFBILLDATE = data.result.TRN_DATE == null ? (moment(data.result.TRNDATE.substr(0, 10)).format("DD/MM/YYYY")) : (moment(data.result.TRN_DATE.substr(0, 10)).format("DD/MM/YYYY"));
          this._trnMainService.TrnMainObj.TRN_DATE = this._trnMainService.TrnMainObj.TRNDATE == null ? new Date().toString().substring(0, 10) : this._trnMainService.TrnMainObj.TRNDATE.toString().substring(0, 10);
         //if (this._trnMainService.TrnMainObj.ProdList[0].substring)() =='')
          
          
        //   if (this._trnMainService.TrnMainObj.ProdList[0].VCHRNO.substr(0, 2) == 'SO' ){
        //   this._trnMainService.TrnMainObj.ProdList = 
        //   this._trnMainService.TrnMainObj.ProdList.filter(u => u.Quantity > u.QtyAddedToPO);
        //   for (let i in this._trnMainService.TrnMainObj.ProdList) {
        //     
        //     
              
        //       if(!this._trnMainService.TrnMainObj.ProdList[i].QtyAddedToPO){
        //         this._trnMainService.TrnMainObj.ProdList[i].QtyAddedToPO = 0;

        //       }
        //       this._trnMainService.TrnMainObj.ProdList[i].Quantity -= this._trnMainService.TrnMainObj.ProdList[i].QtyAddedToPO;
        //       console.log(this._trnMainService.TrnMainObj.ProdList[i].Quantity)                              

        //   }
        // }

          
           for (let i in this._trnMainService.TrnMainObj.ProdList) {

            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            this._trnMainService.TrnMainObj.ProdList[i].MFGDATE = ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
            this._trnMainService.TrnMainObj.ProdList[i].EXPDATE = ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));
          }
          // this._trnMainService.TrnMainObj.PARAC = this._trnMainService.TrnMainObj.TRNAC;
          this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAME = this._trnMainService.TrnMainObj.TRNAC;
          this._trnMainService.TrnMainObj.AdditionalObj.SHIPNAMEVIEW = this._trnMainService.TrnMainObj.BILLTO;
          this._trnMainService.TrnMainObj.DeliveryAddress = this._trnMainService.TrnMainObj.BILLTOADD;

        }

      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error._body);
      },
      () => {
        this.spinnerService.hide();
        this._trnMainService.TrnMainObj.VoucherType = 19;
        this._trnMainService.TrnMainObj.VoucherPrefix = "PO";
        this._trnMainService.TrnMainObj.VoucherAbbName = "PO";
        this._trnMainService.TrnMainObj.Mode = "NEW";
        this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = "FROM_SO" + "_PO";
        this._trnMainService.TrnMainObj.REFORDBILL = this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILL;
        this._trnMainService.TrnMainObj.Mode = "NEW";
        this._trnMainService.TrnMainObj.REFBILL = event.VCHRNO;
        this._trnMainService.TrnMainObj.VCHRNO = "";
        this._trnMainService.TrnMainObj.CHALANNO = "";
        this._trnMainService.TrnMainObj.tag = "FROMSALESORDER";
        this._trnMainService.ReCalculateBillWithNormal();
        this._trnMainService.getVoucherNumber();
        this._trnMainService.getCurrentDate();
        this._trnMainService.TrnMainObj.TRNAC=null;
        this._trnMainService.TrnMainObj.BILLTOADD=null;
        this._trnMainService.TrnMainObj.BILLTO=null;
        this._trnMainService.TrnMainObj.BILLTOMOB=null;
        this._trnMainService.TrnMainObj.TRNMODE=null;
        this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE=null;
        this._trnMainService.TrnMainObj.PARAC=null;
        this._trnMainService.TrnMainObj.CREDITDAYS=null;

      }
    );

  }


}
