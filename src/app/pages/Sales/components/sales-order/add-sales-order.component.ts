import { Component, ViewChild, OnInit } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  GenericPopUpComponent,
  GenericPopUpSettings
} from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { AuthService } from "../../../../common/services/permission";

@Component({
  selector: "add-sales-order",
  templateUrl: "./add-sales-order.component.html",
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
export class AddSalesOrderComponent implements OnInit {
  @ViewChild("genericGridPO") genericGridPO: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForPurchaseOrder: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridPOfromMobile") genericGridPOfromMobile: GenericPopUpComponent;
  gridPopupSettingsForPurchaseOrderFromMobile: GenericPopUpSettings = new GenericPopUpSettings();

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

  note = `
   <P>You can supply item list in a csv format for quick importing</p>
   <ul>
      <li>Enter CAR or PCS|PC in UOM field </li>
      <li>Item Code should be SAP Code</li>
   </ul> 
   `
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private loadingSerive: SpinnerService,
  ) {
    this._trnMainService.formName = "Sales Order";
    this._trnMainService.initialFormLoad(20);

    this.gridPopupSettingsForPurchaseOrder = Object.assign(new GenericPopUpSettings, {
      title: "Purchase Orders",
      apiEndpoints: `/getAllHOPurchaseOrderPagedList`,
      defaultFilterIndex: 0,
      showActionButton: true,
      actionKeys: [{
        icon: "fa fa-trash",
        text: "delete",
        title: "Click to hide Order."
      }],
      columns: [
        {
          key: "VCHRNO",
          title: "PO No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNDATE",
          title: "DATE",
          hidden: false,
          noSearch: false
        },
        {
          key: "CUSTOMERNAME",
          title: "CUSTOMER",
          hidden: false,
          noSearch: false
        },
        {
          key: "FROMCOMPANYID",
          title: "CUSTOMER ID",
          hidden: false,
          noSearch: false
        }
      ]
    });
    this.gridPopupSettingsForPurchaseOrderFromMobile = Object.assign(new GenericPopUpSettings, {
      title: "Sales Orders from Mobile",
      apiEndpoints: `/getPurchaseOrderFromMobilePagedList`,
      defaultFilterIndex: 0,
      showActionButton: true,
      actionKeys: [{
        icon: "fa fa-trash",
        text: "delete",
        title: "Click to hide Order."
      }],
      columns: [
        {
          key: "ORDERDATE",
          title: "Order Date",
          hidden: false,
          noSearch: false
        },
        {
          key: "RETAILERNAME",
          title: "ORDER FROM",
          hidden: false,
          noSearch: false
        },
        {
          key: "DSM",
          title: "DSM NAME",
          hidden: false,
          noSearch: false
        }
        ,
        {
          key: "BEAT",
          title: "BEAT",
          hidden: false,
          noSearch: false
        },
        {
          key: "REMARK",
          title: "REMARKS",
          hidden: false,
          noSearch: false
        },
        {
          key: "REFNO",
          title: "Order No",
          hidden: true,
          noSearch: true
        }
      ]
    });

    this.route.queryParams
      .subscribe(params => {
        if (params.voucher) {
          let voucherNo = params.voucher;
          if (params.type == "PURCHASEORDER_MOBILE") {
            this.getSelectedPurchaseOrderFromMobile(voucherNo, params.fromcompany, params.dsmname, params.dsmcode, params.beat, params.remark);
          }
          else {

            this.getSelectedPurchaseOrder(voucherNo, params.fromcompany);
          }
        }
        if (params.status) {
          let status = params.status;
          if (status == 1) this._trnMainService.showPerformaApproveReject = false;
        }
        if (params.downloaded) {
          let downloadedState = params.downloaded;
        }
      });
  }

  ngOnInit() {
    this.masterService.masterGetmethod("/gettransactionmodes").subscribe(
      res => {
        if (res.status == "ok") {
          this._trnMainService.paymentmodelist = res.result;
        } else {
          console.log("error on getting paymentmode " + res.result);
        }
      },
      error => {
        console.log("error on getting paymentmode ", error);
      }
    );

    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Sales Order",
        sampleFileUrl: `/downloadSampleFile/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        uploadEndpoints: `/importFileForTransaction/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
        allowMultiple: false,
        acceptFormat: ".csv",
        note: this.note,
        filename: "SO_SampleFile"
      });

  }

  showLoadFromPOPopup($event) {
    this.genericGridPO.show();
  }

  showLoadFromPOPopupFromMobile($event) {
    this.genericGridPOfromMobile.show();
  }

  showImportPopup() {
    this.fileUploadPopup.show();
  }

  onPurchaseOrderSelect(item) {
    this.masterService.loadSalesInvoiceFromSalesOrder(item.VCHRNO).subscribe(
      result => {
        // console.log(result.result);
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          // console.log("salesorder", this._trnMainService.TrnMainObj);
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          if (!this._trnMainService.TrnMainObj
            || !this._trnMainService.TrnMainObj.ProdList
            || !this._trnMainService.TrnMainObj.ProdList == undefined) return;
          this._trnMainService.TrnMainObj.REFBILL = item.VCHRNO;
          for (let i in this._trnMainService.TrnMainObj.ProdList) {

            this._trnMainService.setAltunitDropDownForView(i);
          }
          // for(let i=0; i < this._trnMainService.TrnMainObj.ProdList.length; i++){
          //   this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
          //   this._trnMainService.TrnMainObj.ProdList[i].Quantity = result.result.ProdList[i].Quantity; 
          // }  
          this._trnMainService.TrnMainObj.VoucherType = 20;
          this._trnMainService.TrnMainObj.VoucherPrefix = "SO";
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();

          this._trnMainService.TrnMainObj.Mode = "NEW"
          //  this._trnMainService.ReCalculateBill();
          this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.showPerformaApproveReject = false;
        }
      },
      error => { }
    );
  }

  onHoPurchaseOrderClicked(purchaseOrder) {
    this.getSelectedPurchaseOrder(purchaseOrder.VCHRNO, purchaseOrder.FROMCOMPANYID);
  }
  onHoPurchaseOrderFromMobileClicked(purchaseOrder) {

    this.getSelectedPurchaseOrderFromMobile(purchaseOrder.REFNO, purchaseOrder.FROMCOMPANY, purchaseOrder.DSM, purchaseOrder.DSMCODE, purchaseOrder.BEAT, purchaseOrder.REMARK);
  }
  fileUploadSuccess(uploadedResult) {
    try {
      if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
        return;
      }

      if (uploadedResult.status == "ok") {
        let productList = uploadedResult.result;
        this._trnMainService.TrnMainObj.ProdList = productList
        if (this._trnMainService.TrnMainObj.AdditionalObj == null) { this._trnMainService.TrnMainObj.AdditionalObj = <any>{}; }
        { this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this.masterService.so_excelimport; }
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
          //  this._trnMainService.CalculateNormalNew(i);

        }

        // var ZeroStockedProduct=this._trnMainService.TrnMainObj.ProdList.filter(x=>x.SELECTEDITEM.STOCK<=0);
        //this._trnMainService.TrnMainObj.ProdList=this._trnMainService.TrnMainObj.ProdList.filter(x=>x.SELECTEDITEM.STOCK>0);

        // this._trnMainService.ReCalculateBill();
        this._trnMainService.ReCalculateBillWithNormal();
      }
      else {
        this.alertService.error(uploadedResult.result._body);
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }

  getSelectedPurchaseOrder(voucherNO, FromCompanmyId) {
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.loadHoPurchaseOrder(voucherNO, FromCompanmyId).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          this._trnMainService.TrnMainObj.REFBILL = voucherNO;
          this._trnMainService.TrnMainObj.VoucherType = 20;
          this._trnMainService.TrnMainObj.VoucherPrefix = "SO";
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.BATCHNO = FromCompanmyId;
          this._trnMainService.TrnMainObj.tag = "frompo";
          this._trnMainService.TrnMainObj.POST = 0;
          if (this._trnMainService.TrnMainObj.AdditionalObj != null) {
            this._trnMainService.TrnMainObj.AdditionalObj.INVOICEREFBILL = voucherNO;
            this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE + "_SO";
          }
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
            let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
            this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;

            this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            //  this._trnMainService.CalculateNormalNew(i);

          }

          // this._trnMainService.ReCalculateBill();
          this._trnMainService.ReCalculateBillWithNormal();

        }
        else {

          this.loadingSerive.hide();
          this.alertService.error(result.result._body);
        }
      },
      error => {

        this.loadingSerive.hide();
        this.alertService.error(error);
      }
    );
  }

  getSelectedPurchaseOrderFromMobile(orderid, orderfrom, dsmname, dsmcode, beat, remarks) {
    orderfrom = orderfrom.replace('&', '^');
    this.loadingSerive.show("Getting data, Please wait...");
    this.masterService.loadHoPurchaseOrderFromMobile(orderid, orderfrom).subscribe(
      result => {
        this.loadingSerive.hide();
        if (result.status == "ok") {
          this._trnMainService.TrnMainObj = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
          const uuidV1 = require('uuid/v1');
          this._trnMainService.TrnMainObj.guid = uuidV1();
          this._trnMainService.TrnMainObj.REMARKS = remarks;
          this.masterService.masterGetmethod("/getPartyBalanceAmount?acid=" + this._trnMainService.TrnMainObj.PARAC)
            .subscribe(
              res => {
                if (res.status == "ok") {
                  this._trnMainService.TrnMainObj.BALANCE = this._trnMainService.nullToZeroConverter(res.result);

                } else {
                  alert(res.result);
                }
              },
              error => {
                alert(error);
              }
            );
          this._trnMainService.TrnMainObj.REFBILL = orderid;
          this._trnMainService.TrnMainObj.VoucherType = 20;
          this._trnMainService.TrnMainObj.VoucherPrefix = "SO";
          this._trnMainService.TrnMainObj.Mode = "NEW";
          this._trnMainService.TrnMainObj.tag = "PURCHASEORDER_MOBILE";
          this._trnMainService.TrnMainObj.BATCHNO = orderfrom.replace('^', '&');;
          this._trnMainService.TrnMainObj.AdditionalObj = <any>{};
          this._trnMainService.TrnMainObj.AdditionalObj.tag = "PURCHASEORDER_MOBILE";
          this._trnMainService.TrnMainObj.AdditionalObj.CREATION_TYPE = this.masterService.so_mobileimport;
          this._trnMainService.TrnMainObj.AdditionalObj.DSMNAME = dsmname;
          this._trnMainService.TrnMainObj.AdditionalObj.DSMCODE = dsmcode;
          this._trnMainService.TrnMainObj.AdditionalObj.BEAT = beat;
          this._trnMainService.getVoucherNumber();
          this._trnMainService.getCurrentDate();
          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.AssignSellingPriceAndDiscounts_New(this._trnMainService.TrnMainObj.ProdList[i].ProductRates, i);
            let cofactorObj = this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj;
            this._trnMainService.RealQuantitySet(i, cofactorObj == null ? 1 : cofactorObj.CONFACTOR);
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
            let rate1 = this._trnMainService.TrnMainObj.ProdList[i].RATE;
            let rate2 = 0;
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = true;
            rate2 = this._trnMainService.TrnMainObj.ProdList[i].PRATE;

            this._trnMainService.setunit(rate1, rate2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
            // this._trnMainService.CalculateNormalNew(i);

          }

          // this._trnMainService.ReCalculateBill();
          this._trnMainService.ReCalculateBillWithNormal();
        }
        else {

          this.loadingSerive.hide();
          this.alertService.error(result.result._body);
        }
      },
      error => {

        this.loadingSerive.hide();
        this.alertService.error(error);
      }
    );
  }


  onSoDeleteClick(data) {
    this.masterService.masterGetmethod(`/deletePurchaseOrderFromMobile?orderNo=${data.REFNO}`).subscribe((res) => {
      if (res.status == "ok") {
        this.genericGridPOfromMobile.refresh();
      } else {
        this.alertService.error(res.result);
      }
    })
  }


  onPODeleteClick(data) {
    this.masterService.masterGetmethod(`/deleteEDIPurchaseOrder?orderNo=${data.VCHRNO}`).subscribe((res) => {
      if (res.status == "ok") {
        this.genericGridPO.refresh();
      } else {
        this.alertService.error(res.result);
      }
    })
  }




}
