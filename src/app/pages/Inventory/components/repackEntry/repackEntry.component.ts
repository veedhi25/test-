import { Component, ViewChild } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";
import { GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { GenericPopUpComponent } from './../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { Product } from '../../../../common/interfaces/ProductItem';
import { BULKITEM, TrnProd } from '../../../../common/interfaces/TrnMain';

@Component({
  selector: "repackentry",
  templateUrl: "./repackEntry.component.html",
  styleUrls: ["repackEntry.component.css"],
  providers: [TransactionService]

})

export class RepackEntryComponent {
  @ViewChild("genericGridItem") genericGridItem: GenericPopUpComponent;
  gridPopupSettingsForItem: GenericPopUpSettings = new GenericPopUpSettings();
  public activeRowIndex: number = 0;
  constructor(private masterService: MasterRepo, private _trnMainService: TransactionService, private loadingService: SpinnerService, private alertservice: AlertService) {
    //load intialfrom here passing repackentry vouchercode
    this._trnMainService.formName = "Repack Entry";
    this._trnMainService.initialFormLoad(72);
  }

  ngOnInit() {
    this.gridPopupSettingsForItem = {
      title: `Repack Details`,
      apiEndpoints: `/getMenuitemWithStockPagedList/0/all/RP/${this.masterService.userProfile.userWarehouse}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'DESCA',
          title: 'DESCRIPTION',
          hidden: false,
          noSearch: false
        },
        {
          key: 'MENUCODE',
          title: 'ITEM CODE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'STOCK',
          title: 'STOCK',
          hidden: false,
          noSearch: false
        }
        ,
        {
          key: 'MRP',
          title: 'MRP',
          hidden: false,
          noSearch: false
        }
        ,
        {
          key: 'BARCODE',
          title: 'BARCODE',
          hidden: true,
          noSearch: false
        }
      ]
    };

  }
  onItemSelected = (value) => {
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].SELECTEDITEM = value;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BC = value.BARCODE;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].MENUCODE = value.MCODE;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKPARENT = value.BULKPARENT;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].MCODE = value.MCODE;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].ITEMDESC = value.DESCA;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].MRP = value.MRP;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].ALTMRP = value.MRP;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].PRATE = value.PRATE;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].RATE = value.RATE;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].WEIGHT = value.GWEIGHT;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].NWEIGHT = value.NWEIGHT;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].ISVAT = value.ISVAT;
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Mcat = value.MCAT;
    this.masterService.masterGetmethod("/getbulkitemdetail/" + this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKPARENT
    ).subscribe((res) => {
      if (res.status == "ok") {
        this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKITEM = <BULKITEM>{};
        this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKITEM = res.result;
      }
    })
    this.masterService
      .masterGetmethod(
        "/getAltUnitsOfItem/" +
        this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].MCODE
      )
      .subscribe(
        res => {
          if (res.status == "ok") {
            if (
              this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Product == null
            ) {
              this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Product = <Product>{};
            }
            this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Product.MCODE = this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].MCODE;
            this._trnMainService.TrnMainObj.ProdList[
              this.activeRowIndex
            ].Product.AlternateUnits = JSON.parse(res.result);

            this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].ALTUNITObj = this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Product.AlternateUnits.filter(x => x.ISDEFAULT == 1)[0];

            let checkIfAlreadyPackedIn = this._trnMainService.TrnMainObj.ProdList.filter(x => x.BULKPARENT == this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKPARENT);
            if (checkIfAlreadyPackedIn.length > 0) {
              this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKITEM = checkIfAlreadyPackedIn[0].BULKITEM;
            }

            this.masterService.focusAnyControl("Quantity" + this.activeRowIndex)
          }
        },
        error => {
        }
      );





  }
  onItemClick = (index) => {
    this.activeRowIndex = index;
    this.genericGridItem.show();
  }

  SelectUnit = (index) => {
    this.activeRowIndex = index;
    this.masterService.focusAnyControl("sellingrate" + index)


  }


  UnitEnterEventClick = (index) => {
    this.activeRowIndex = index;

  }

  srate(event, index) {
    event.preventDefault();
    this.activeRowIndex = index;
    this.masterService.focusAnyControl("Quantity" + index)
  }


  QuantityEnter(index) {

    if (this.masterService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[index].Quantity) < 1) {
      return;
    }
    if (this.CalculateStock()) {
      if (this.addRow()) {
        let nextindex = index + 1;
        this.activeRowIndex = nextindex;
        setTimeout(() => {
          this.masterService.focusAnyControl("mcode" + nextindex)
        }, 10);
      };
    }


  }



  CalculateStock() {
    let bulkitem = this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null && x.BULKPARENT == this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKPARENT);
    let currentPackedStock = 0;
    bulkitem.forEach(blk => {
      let confactor = this.masterService.nullToZeroConverter(blk.WEIGHT) / this.masterService.nullToZeroConverter(blk.BULKITEM.GWEIGHT);
      // let qty = this.masterService.nullToZeroConverter(blk.Quantity) * this.masterService.nullToZeroConverter(confactor) * this.masterService.nullToZeroConverter(blk.BULKITEM.GWEIGHT);
      let qty = this.masterService.nullToZeroConverter(blk.Quantity) * this.masterService.nullToZeroConverter(confactor);
      currentPackedStock = currentPackedStock + this.masterService.nullToZeroConverter(qty);
    });

    let availableStock = this.masterService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKITEM.STOCK) - this.masterService.nullToZeroConverter(currentPackedStock);
    // let altUnit = this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Product.AlternateUnits.filter(x => x.ALTUNIT == this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].BULKITEM.BASEUNIT)[0];
    // this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].AltQty = this.masterService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Quantity) * this.masterService.nullToZeroConverter(altUnit.CONFACTOR);
    this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].AltQty = this.masterService.nullToZeroConverter(this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Quantity);

    if (availableStock < 0) {
      this._trnMainService.TrnMainObj.ProdList[this.activeRowIndex].Quantity = 0;
      return false;
    }
    this._trnMainService.TrnMainObj.ProdList.forEach(x => {
      if (x.MCODE != null && x.BULKPARENT == bulkitem[0].BULKPARENT) {
        x.BULKITEM.PACKED = currentPackedStock;
        x.BULKITEM.AVAIL = this.masterService.nullToZeroConverter(x.BULKITEM.STOCK) - this.masterService.nullToZeroConverter(currentPackedStock);
      }
    })
    return true;

  }


  addRow = () => {
    if (this._trnMainService.TrnMainObj.ProdList.some(x => x.MCODE == null && x.MENUCODE == null)) { return true; }

    var newRow = <TrnProd>{};
    newRow.inputMode = true;
    newRow.MENUCODE = null;
    newRow.ITEMDESC = null;
    newRow.RATE = null;
    newRow.RATE = null;
    newRow.NCRATE = null;
    newRow.AMOUNT = null;
    newRow.DISCOUNT = null;
    newRow.VAT = null;
    newRow.NETAMOUNT = null;
    newRow.ITEMTYPE = null;
    newRow.RECEIVEDTYPE = null;
    newRow.WAREHOUSE = null;
    newRow.BC = null;
    newRow.TRANSACTIONMODE = "NEW";
    newRow.BULKITEM = <BULKITEM>{};



    this._trnMainService.TrnMainObj.ProdList.push(newRow);
    return true;
  }


  onSaveClicked() {

    if (this._trnMainService.TrnMainObj.TRNMODE.toLowerCase() == "view") {
      this.alertservice.error("Cannot save in View Mode")
      return;
    }
    let filteredProdList = this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null && this.masterService.nullToZeroConverter(x.Quantity) > 0);
    this._trnMainService.TrnMainObj.ProdList = filteredProdList;
    this.loadingService.show("Saving Data.Please wait.");
    this.masterService.masterPostmethod_NEW("/saveRepacking", this._trnMainService.TrnMainObj).subscribe((res) => {
      if (res.status == "ok") {

        this._trnMainService.initialFormLoad(72);
        this.loadingService.hide();
        this.alertservice.success("Saved Successfully");

      } else {
        this.alertservice.error(res.result);
        this.loadingService.hide();
      }
    }, error => {
      this.loadingService.hide();
      this.alertservice.error(error._body)
    })
  }
}
