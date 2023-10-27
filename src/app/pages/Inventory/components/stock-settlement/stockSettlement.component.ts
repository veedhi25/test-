import { Component, ViewChild, OnInit } from '@angular/core';
import { TransactionService } from './../../../../common/Transaction Components/transaction.service';
import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';


@Component({
  selector: 'StockSettlement',
  templateUrl: './stockSettlement.html',
  providers: [TransactionService]

})

export class StockSettlementComponent implements OnInit {
  @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;
  @ViewChild("genericGridUnprovedSettlementList") genericGridUnprovedSettlementList: GenericPopUpComponent;
  public activeurlpath: string;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsUnprovedSettlementList: GenericPopUpSettings = new GenericPopUpSettings();
  constructor(private _trnMainService: TransactionService,
    private masterService: MasterRepo, private arouter: ActivatedRoute,
    private loadingService: SpinnerService,
    private alertService: AlertService) {
    this.activeurlpath = this.arouter.snapshot.url[0].path;
    this._trnMainService.initialFormLoad(9);
    if(this.activeurlpath == "StockSettlementEntryApproval"){
      this._trnMainService.formName = "Stock Settlement Approval";
    }
    else {
      this._trnMainService.formName = "Stock Settlement";
    }
    this._trnMainService.settlementList = [];
    this.masterService.getSettlementMode()
      .subscribe(data => {
        this._trnMainService.settlementList.push(data);
      });
    this.gridPopupSettings ={
      title: "Settlement Item",
      apiEndpoints: `/getSTOCK_SETTLEMENT_MAIN_TMPPagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "VCHRNO",
          title: "Voucher No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "REMARKS",
          title: "Remarks",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNMODE",
          title: "Settlement Mode",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNDATE",
          title: "Date",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.gridPopupSettingsUnprovedSettlementList = {
      title: "Unapproved Settlement List",
      apiEndpoints: `/getUnapprovedStockSettlementPagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "VCHRNO",
          title: "Voucher No.",
          hidden: false,
          noSearch: false
        },
        {
          key: "REMARKS",
          title: "Remarks",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNMODE",
          title: "Settlement Mode",
          hidden: false,
          noSearch: false
        },
        {
          key: "TRNDATE",
          title: "Date",
          hidden: false,
          noSearch: false
        }
      ]
    };
  }

  ngOnInit() {
    if (this.activeurlpath == 'StockSettlementEntryApproval') {
      this._trnMainService.pageHeading = 'Stock Settlement Approval';
    }
  }

  showLoadFromStockSettlement() {
    this.genericGridUnprovedSettlementList.show();
  }

  onItemDoubleClick($event) {
    this.loadVoucher($event, "getStockSettlementForView");
  }

  saveChangeStockSettlement() {
    this.genericGridSO.show();
  }

  loadVoucher(selectedItem, api: string) {
    this._trnMainService.loadStockSettlement(selectedItem.VCHRNO, api)
  }

  onStockSettlementSelect(selectedItem, api) {
    this.loadingService.show("Please Wait while loading data");
    this.masterService.LoadStockSettlement(selectedItem.VCHRNO, api).subscribe(
      result => {
        if (result.status == "ok") {
          this.loadingService.hide();
          this._trnMainService.initialFormLoad(9);
          if (this.activeurlpath == 'StockSettlementEntryApproval') {
            this._trnMainService.pageHeading = 'Stock Settlement Approval';
          }
          let main = result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );      
          this._trnMainService.TrnMainObj.REFBILL = main.VCHRNO;
          this._trnMainService.TrnMainObj.TRNMODE = main.TRNMODE;
          this._trnMainService.TrnMainObj.REMARKS = main.REMARKS;
          this._trnMainService.TrnMainObj.ProdList = main.ProdList;

          for (let i in this._trnMainService.TrnMainObj.ProdList) {
            this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
            this._trnMainService.TrnMainObj.ProdList[i].IsApproveStockSettlement = true;
            this._trnMainService.setAltunitDropDownForView(i);
            this._trnMainService.setunit(this._trnMainService.TrnMainObj.ProdList[i].RATE, this._trnMainService.TrnMainObj.ProdList[i].ALTRATE2, i, this._trnMainService.TrnMainObj.ProdList[i].ALTUNITObj);
          }
          this._trnMainService.TrnMainObj.ProdList = this._trnMainService.TrnMainObj.ProdList.length ? this._trnMainService.TrnMainObj.ProdList.filter(x => x.SELECTEDITEM.STOCK > 0) : [];



          this._trnMainService.ReCalculateBillWithNormal();
          this._trnMainService.showPerformaApproveReject = false;
          if (result.message) {
            this.alertService.error(result.message);
          }

        } else {
          this.loadingService.hide();
          this.alertService.error(result.result);
        }
      },
      error => {
        this.loadingService.hide();
        this.alertService.error(error._body);
      }
    );
  }


  onItemDoubleClickUnprovedSettlementList($event) {
    this.onStockSettlementSelect($event, "getStockSettlement");
  }


  onCancelClicked() {
    if (this._trnMainService.TrnMainObj.Mode.toLocaleLowerCase() != "view") {
      return;
    }

    this.loadingService.show(`Cancelling Invoice ${this._trnMainService.TrnMainObj.VCHRNO}.Please Wait.`);
    this.masterService.masterPostmethod("/cancelStockSettlement", { VCHRNO: this._trnMainService.TrnMainObj.VCHRNO }).subscribe((res) => {
      if (res.status == "ok") {
        this.loadingService.hide();
        this._trnMainService.initialFormLoad(9);
      } else {
        this.alertService.error(res.result);
      }
    }, error => {
      this.loadingService.hide();
      this.alertService.error(error);
    })



  }

}


