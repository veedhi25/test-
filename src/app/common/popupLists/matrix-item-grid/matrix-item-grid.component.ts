import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";

@Component({
  selector: "matrix-item-grid",
  templateUrl: "./matrix-item-grid.component.html",
  styleUrls: ['./matrix-item-grid.scss']
})
export class MatrixItemGridComponent implements OnChanges {

  @Input() itemname: string = "";
  @Input() matrixItemAtrribute: MatrixItemAttributes[];
  public isActive: boolean = false;
  public keys: string[] = [];
  public headerKeys: string[] = [];
  public matrixItemRows: any[] = [];
  public SELECTEDINDEX: number = 0;
  @Output() onApplyClicked = new EventEmitter();
  constructor(@Inject(DOCUMENT) private document: Document,
  ) {

  }



  ngOnChanges(changes: any) {
    this.matrixItemAtrribute = changes.matrixItemAtrribute.currentValue;
    this.keys = [];
    this.headerKeys = [];
    this.matrixItemAtrribute.forEach(x => {
      x.VARIANT_ATTRIBUTE_LIST = JSON.parse(x.VARIANT_ATTRIBUTE);
      this.keys.push(x.VARIANTID)
      this.headerKeys.push(x.VARIANTNAME)
    });
    this.keys.push('QTY');
    this.keys.push('PRATE');
    this.keys.push('MRP');
    this.keys.push('SRATE');
    this.keys.push('BARCODE');
    this.keys.push('BATCH');
    this.headerKeys.push('QTY');
    this.headerKeys.push('PRATE');
    this.headerKeys.push('MRP');
    this.headerKeys.push('SRATE');
    this.headerKeys.push('BARCODE');
    this.headerKeys.push('BATCH');

    this.matrixItemRows = [];
    var matrixItemRowsObj = {};
    this.keys.forEach(key => matrixItemRowsObj[key] = null);
    this.matrixItemRows.push(matrixItemRowsObj);
  }


  addRows = (index): void => {
    // for (var x of this.matrixItemRows) {
    //   for (var key in x) {
    //     if (x[key] == null || x[key] == "" || x[key] == undefined || x[key] < 0)
    //       return;
    //   }
    // }
    var matrixItemRowsObj = {};
    this.keys.forEach(key => matrixItemRowsObj[key] = null);
    this.matrixItemRows.push(matrixItemRowsObj);
    var nextindex = parseFloat(index) + 1;
    setTimeout(() => {
      this.onAttributeChange("NONE", nextindex);
    }, 0);
  }

  onAttributeChange = (key, index): void => {
    let indexOfKey = this.keys.findIndex(x => x == key);
    let tmpArray = [];
    if (indexOfKey > -1) {
      tmpArray = this.keys.slice(indexOfKey + 1);
    } else {
      tmpArray = this.keys;
    }

    for (var id in tmpArray) {
      if (this.document.getElementById(tmpArray[id] + index)) {
        setTimeout(() => this.document.getElementById(tmpArray[id] + index).focus());
        return;
      }
    }
  }

  getvariantValues = (key): any[] => {
    var filteredAttr = this.matrixItemAtrribute.filter(x => x.VARIANTID == key);
    if (filteredAttr.length) {
      return filteredAttr[0].VARIANT_ATTRIBUTE_LIST;
    }
    return [];
  }



  selectInputType = (key, inputype): boolean => {
    if (inputype === "input" && ['QTY', 'PRATE', 'MRP', 'SRATE','BARCODE','BATCH'].indexOf(key) > -1) {
      return true;
    }
    if (inputype === "select" && ['QTY', 'PRATE', 'MRP', 'SRATE','BARCODE','BATCH'].indexOf(key) == -1) {
      return true;
    }
  }








  okClicked = (): void => {

    this.onApplyClicked.emit(this.matrixItemRows);
    this.hide();
  }




  show = (): void => {
    this.isActive = true;
    setTimeout(() => {
      this.onAttributeChange("NONE", 0);
    }, 0);
  }
  hide = (): void => {
    this.isActive = false;
    this.matrixItemAtrribute = [];
    this.keys = [];
    this.matrixItemRows = [];
  }
}







export interface MatrixItemAttributes {
  MCODE: string;
  VARIANTNAME: string;
  VARIANTID: string;
  VARIANT_ATTRIBUTE: string;
  VARIANT_ATTRIBUTE_LIST?: any[];
}