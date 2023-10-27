import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component({
    selector: "openingstockentry",
    templateUrl: "./openingStockEntry.html",
    providers: [TransactionService]

})

export class OpeningStockEntryComponent {
    configCodeParams: any = [];
    itemVariantDetails: any = [];
    @ViewChild('fileMatrixUploadPopup') fileMatrixUploadPopup: FileUploaderPopupComponent;
    fileMatrixUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService,
        private alertService: AlertService,
        private loadingSerive: SpinnerService,) {
        this._trnMainService.formName = "Opening Stock Entry";
        this._trnMainService.initialFormLoad(24);
    }

    ngOnInit() {
      this.getconfigParameter();
        this.fileMatrixUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
        {
          title: "Import Opening Stock Entry From Matrix Input",
          sampleFileUrl: `/downloadSample/${this._trnMainService.TrnMainObj.VoucherPrefix}matrix`,
          uploadEndpoints: `/pifrominputmatrix/${this._trnMainService.TrnMainObj.VoucherPrefix}`,
          allowMultiple: false,
          acceptFormat: ".csv",
          filename: "OP_SampleFile"
    
        });
    }
    onImportMatrixinputOpeningStockEnrty() {
      this.fileMatrixUploadPopup.show();
    }
    getconfigParameter() {
      try {
        this.masterService.masterGetmethod('/selectDetailsofCode').subscribe(res => {
          if (res.status == "ok") {
            this.configCodeParams = res.result;
          } else {
            this.alertService.warning("Config Code bar code for generate item bar code")
          }
        })
      }
      catch (e) {
      }
    }
    fileMatrixUploadSuccess(uploadResult) {
        if (uploadResult.status == 'ok') {;
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
            this._trnMainService.TrnMainObj.ProdList[i].CHALANNO = this._trnMainService.TrnMainObj.CHALANNO;
            if (this._trnMainService.TrnMainObj.ProdList[i].BC==null || this._trnMainService.TrnMainObj.ProdList[i].BC=="") {
                this.generateString(this._trnMainService.TrnMainObj.ProdList[i], i);
                this._trnMainService.TrnMainObj.ProdList[i].BCODEID=this._trnMainService.TrnMainObj.ProdList[i].BC;
            }
        }    
    
          this._trnMainService.ReCalculateBillWithNormal();
          this.loadingSerive.hide();
    
        } else {
          this.loadingSerive.hide();
          this.alertService.error(uploadResult.result._body);
    
        }
    }
    generateString(val, ind) {

        val['Sno'] = (parseInt(ind) + 1).toString();
        console.log("input array ", val);
        var valKey;
        var variantKey = [];
        var barcodeString = [];
        valKey = Object.keys(val);
        // console.log("val key ", valKey);
        if (!valKey.includes('VARIANTLIST')) {
          if (valKey.includes('VARIANTDETAIL')) {
            val.VARIANTLIST = val.VARIANTDETAIL;
          }
        }
    
        if ((val.VARIANTLIST == null || val.VARIANTLIST == undefined)) {
          // this.alertService.warning("Bar code not generated. Due to variant not available");
          // return;
        } else {
          this.itemVariantDetails = val.VARIANTLIST;
          variantKey = Object.keys(val.VARIANTLIST);
        }

        this.configCodeParams.forEach((cp) => {
    
          if (cp.VARIANTNAME == null || cp.VARIANTNAME == "" || cp.VARIANTNAME == undefined) {
            console.log("dbname ", cp.DbColumn);
            if(valKey==null)valKey="";
            for (let a = 0; a < valKey.length; a++) {
              if (cp.DbColumn.includes(valKey[a])) {
                var bcodeval;
                if (val[valKey[a]] == "" || val[valKey[a]] == null) { } else {
                  if (val[valKey[a]].length < cp.ParaMaxLength) {
                    //console.log('string length short');
                    bcodeval = this.zeroPad(val[valKey[a]], cp.ParaMaxLength);
                  } else {
                    //console.log(val[valKey[a]]);
                    bcodeval = val[valKey[a]].toString().slice(-parseInt(cp.ParaMaxLength));
                  }
                  barcodeString.push(bcodeval.replace(/[^A-Z0-9]/ig, ""));
                }
              } else { }
            }
    
          } else {
            if(variantKey==null)variantKey=[];
    
            for (let a = 0; a < variantKey.length; a++) {
              if (cp.ParameterTitle == variantKey[a]) {
    
                let bcodeval = val.VARIANTLIST[variantKey[a]].VARIANTBARCODE.toString().replace(/[^A-Z0-9]/ig, "").slice(-parseInt(cp.ParaMaxLength));
                barcodeString.push(this.zeroPad(bcodeval, cp.ParaMaxLength).replace(/[^A-Z0-9]/ig, ""));
              }
            }
          }
    
          if (barcodeString!=null && barcodeString.length > 0) {
            this._trnMainService.TrnMainObj.ProdList[ind].BC = barcodeString.join('');
    
          } else {
    
          }
    
        });
    
    }
    
    zeroPad(num, len) {
        return num.toString().padStart(len, "0");
    }
}
