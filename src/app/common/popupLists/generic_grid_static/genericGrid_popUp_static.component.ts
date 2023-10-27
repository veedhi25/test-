import {
  Component,
  Input,
  Output,
  EventEmitter,
  Injector,
  HostListener,
  OnChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit
} from "@angular/core";
import { PagedListingComponentBase } from "../../../paged-list-component-base";
import { MasterRepo } from "../../repositories";
import { TransactionService } from "../../Transaction Components/transaction.service";
import { isNullOrUndefined } from "util";
import { VoucherTypeEnum } from "../../interfaces/TrnMain";
import { xor } from "lodash";

@Component({
  selector: "generic-static-popup-grid",
  templateUrl: "./generic_popUp_static.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class GenericStaticPopUpComponent extends PagedListingComponentBase
  implements OnChanges, AfterViewInit, OnInit {
  ngAfterViewInit(): void {
    this.filterValue.valueChanges.debounceTime(200).subscribe((x) => {
      this.refreshPage();
      this.refresh();
    });

  }


  ngOnInit() {
    this.masterService.onWarehouseChangeEvent.subscribe((res) => {
      if (res) {
        this.warehouse = res
      } else {
        let userProfile = this._authService.getUserProfile();
        this.warehouse = userProfile.userWarehouse;
      }
    })
  }
  /** List Declaration  */

  warehouse: string
  requestUrl: string = "";

  isActive: boolean = false;
  itemList: any[] = [];
  selectedRowIndex: number = 0;
  tabindex: string = "list";
  hideGridOnDoubleClick: boolean = true;
  //for transaction filter
  billTo: string = "";
  tag: string = "";
  isForCancelOrder: boolean = false;

  /** Output  */

  @Output() onPopUpClose = new EventEmitter();
  @Output() onItemDoubleClick = new EventEmitter();

  /** Input  */

  @Input() popupsettings: GenericPopUpSettings;
  @Input() summary: string;
  @ViewChild('inputBox') inputBox: ElementRef
  constructor(public injector: Injector, private masterService: MasterRepo, private _transactionService: TransactionService) {
    super(injector);
  }

  show(billTo: string = "", isForCancelOrder: boolean = false, tag: string = "", hideOnDoubleClick: boolean = true, filterOption: string = '', filtervalue: string = '') {
    this.hideGridOnDoubleClick = hideOnDoubleClick;
    setTimeout(() => {
      this.inputBox.nativeElement.focus()
    }, 10);
    this.summary = null;
    this.billTo = billTo;
    this.isForCancelOrder = isForCancelOrder;
    this.itemList = [];
    this.isActive = true;
    this.selectedRowIndex = 0;
    this.tag = tag;


    setTimeout(() => {
      this.setFilterOption(filtervalue, filterOption);
      this.refreshPage();
      this.refresh();

    }, 100)
  }

  setFilterOption(filtervalue, filterOption) {
    if (this.popupsettings && this.popupsettings.columns.length) {
      let filterIndex = this.popupsettings.defaultFilterIndex ? this.popupsettings.defaultFilterIndex : 0;
      if (this.popupsettings.columns.length <= filterIndex) return;

      this.filterValue.setValue(filtervalue);
      if (filterOption == "" || filterOption == null) {
        this.filterOption = this.popupsettings.columns[filterIndex].key;
      }
      else { this.filterOption = filterOption }
    }
  }

  getData() {
    this.summary = null;
    this.selectedRowIndex = 0;
    let totalFilteredlist = [];

    if (this.warehouse == null || this.warehouse == undefined || this.warehouse == "") {
      if (this._transactionService.TrnMainObj.MWAREHOUSE == null || this._transactionService.TrnMainObj.MWAREHOUSE == null || this._transactionService.TrnMainObj.MWAREHOUSE == "") {
        let userProfile = this._authService.getUserProfile();
        this.warehouse = userProfile.userWarehouse;
      } else {
        this.warehouse = this._transactionService.TrnMainObj.MWAREHOUSE;
      }

    }
    if (this.filterValue.value == null || this.filterValue.value == undefined || this.filterValue.value == "") {
      totalFilteredlist = this.masterService.MCODEWISE_ITEMSTOCKLIST.filter(x => (x.STOCK > 0 || x.ALLOWNEGATIVE == 1 ) && x.WAREHOUSE == this.warehouse  || x.PTYPE==8 || x.PTYPE==15).sort((a, b) => a.DESCA.localeCompare(b.DESCA));


    }
    else {
      if (this.filterOption == "MENUCODE") {
        totalFilteredlist = this.masterService.MCODEWISE_ITEMSTOCKLIST.filter(x => ((x.STOCK > 0 || x.ALLOWNEGATIVE == 1) && x.WAREHOUSE == this.warehouse || x.PTYPE==8 || x.PTYPE==15) && x.MENUCODE.toLowerCase().includes(this.filterValue.value.toLowerCase()))
          .sort((a, b) => a.DESCA.localeCompare(b.DESCA));
      }
      else if (this.filterOption == "STOCK") {
        totalFilteredlist = this.masterService.MCODEWISE_ITEMSTOCKLIST.filter(x => ((x.STOCK > 0 || x.ALLOWNEGATIVE == 1) && x.WAREHOUSE == this.warehouse || x.PTYPE==8 || x.PTYPE==15) && x.STOCK == this.filterValue.value)
          .sort((a, b) => a.DESCA.localeCompare(b.DESCA));
      }
      else if (this.filterOption == "MRP") {
        totalFilteredlist = this.masterService.MCODEWISE_ITEMSTOCKLIST.filter(x => ((x.STOCK > 0 || x.ALLOWNEGATIVE == 1) && x.WAREHOUSE == this.warehouse || x.PTYPE==8 || x.PTYPE==15) && x.MRP == this.filterValue.value)
          .sort((a, b) => a.DESCA.localeCompare(b.DESCA));
      }
      else if (this.filterOption == "BARCODE") {
        totalFilteredlist = this.masterService.MCODEWISE_ITEMSTOCKLIST.filter(x => ((x.STOCK > 0 || x.ALLOWNEGATIVE == 1) && x.WAREHOUSE == this.warehouse || x.PTYPE==8 || x.PTYPE==15) && x.BARCODE.toLowerCase().includes(this.filterValue.value.toLowerCase()))
          .sort((a, b) => a.DESCA.localeCompare(b.DESCA));
      }

      else {
        totalFilteredlist = this.masterService.MCODEWISE_ITEMSTOCKLIST.filter(x => ((x.STOCK > 0 || x.ALLOWNEGATIVE == 1) && x.WAREHOUSE == this.warehouse || x.PTYPE==8 || x.PTYPE==15) && x.DESCA.toLowerCase().includes(this.filterValue.value.toLowerCase()))
          .sort((a, b) => a.DESCA.localeCompare(b.DESCA));
      }
    }


    let divisionFilteredItemList = [];
    divisionFilteredItemList = totalFilteredlist;
    if (this._transactionService.TrnMainObj.itemDivisionList != null && this._transactionService.TrnMainObj.itemDivisionList != undefined) {
      if (totalFilteredlist.length) {

        divisionFilteredItemList = [];
        totalFilteredlist.forEach(x => {
          var aa = this._transactionService.TrnMainObj.itemDivisionList.filter(i => isNullOrUndefined(i) ? "" : i.toLowerCase() == x.DIVISIONS.toLowerCase())[0];
          if (aa != null) {
            divisionFilteredItemList.push(x);
          }
        })
      }
    }

    let mcatFilteredItemItemList, itemAfterDivisoinFiltered = [];
    mcatFilteredItemItemList = this._transactionService.TrnMainObj.itemDivision == "all" ? totalFilteredlist : divisionFilteredItemList;
    itemAfterDivisoinFiltered = this._transactionService.TrnMainObj.itemDivision == "all" ? totalFilteredlist : divisionFilteredItemList;
    if (!isNullOrUndefined(this._transactionService.TrnMainObj.customerMCAT)) {
      if (itemAfterDivisoinFiltered.length) {

        mcatFilteredItemItemList = [];
        itemAfterDivisoinFiltered.filter(x => x.MCAT != null).forEach(x => {
          if (x.MCAT.toLowerCase() == this._transactionService.TrnMainObj.customerMCAT.toLowerCase()) {
            mcatFilteredItemItemList.push(x);
          }
        })
      }
    }

    this.totalItems = this._transactionService.TrnMainObj.customerMCAT == "%" ? itemAfterDivisoinFiltered.length : mcatFilteredItemItemList.length;
    this.itemList = this._transactionService.TrnMainObj.customerMCAT == "%" ? itemAfterDivisoinFiltered.slice(0 + ((this.pageNumber - 1) * 10), 10 + ((this.pageNumber - 1) * 10)) : mcatFilteredItemItemList.slice(0 + ((this.pageNumber - 1) * 10), 10 + ((this.pageNumber - 1) * 10));

    if (this.itemList[this.selectedRowIndex] != null && this.itemList != null &&
      this.itemList.length > 0 &&
      this.selectedRowIndex == 0 &&
      this.itemList[this.selectedRowIndex].itemSummary
    ) {
      this.summary = this.itemList[this.selectedRowIndex].itemSummary;
    }
  }


  hide() {
    this.itemList = [];
    this.pageNumber = 1;
    this.totalItems = 0;
    this.isActive = false;
  }



  triggerSearch() {
    if (
      this.filterOption == null ||
      this.filterOption == undefined ||
      this.filterOption == ""
    )
      return;
    this.filterValue.setValue("");
    this.refreshPage();
    this.refresh();
  }

  singleClick(index) {
    this.selectedRowIndex = index;
    this.summary = this.itemList[index].itemSummary;
  }

  doubleClick($event) {
    this.onItemDoubleClick.emit($event);
    if (this.hideGridOnDoubleClick) {
      this.hide();
    }

  }

  @HostListener("document : keydown", ["$event"])
  @debounce(10)
  updown($event: KeyboardEvent) {


    if (!this.isActive) return true;

    //preventing if enter in menucode
    if (($event.srcElement as Element) != null && ($event.srcElement as Element).id != null && ($event.srcElement as Element).id.includes("menucode")) {
      return true;
    }
    // let actualSelectedIndex=this.selectedRowIndex+((this.pageNumber-1)*10);
    if ($event.code == "ArrowDown") {
      $event.preventDefault();
      this.selectedRowIndex++;
      if (this.itemList[this.selectedRowIndex] != null) {
        this.summary = this.itemList[this.selectedRowIndex].itemSummary;
      }
      this.calculateTotalPages();
      if (
        this.selectedRowIndex == this.itemList.length &&
        this.pageNumber < this.totalPages
      ) {
        this.pageNumber = this.pageNumber + 1;
        this.refresh();
        this.selectedRowIndex = 0;
        this.itemListClosed();
      } else if (
        this.selectedRowIndex == this.itemList.length &&
        this.pageNumber == this.totalPages
      ) {
        this.selectedRowIndex = this.itemList.length - 1;
      }
    } else if ($event.code == "ArrowUp") {
      $event.preventDefault();
      this.selectedRowIndex--;
      if (this.itemList[this.selectedRowIndex] != null) {
        this.summary = this.itemList[this.selectedRowIndex].itemSummary;
      }
      if (this.selectedRowIndex == -1 && this.pageNumber > 1) {
        this.pageNumber = this.pageNumber - 1;
        this.refresh();
        this.selectedRowIndex = this.itemList.length - 1;
        this.itemListClosed();
      } else if (this.selectedRowIndex == -1 && this.pageNumber == 1) {
        this.selectedRowIndex = 0;
      }
    } else if (
      ($event.code == "Enter" || $event.code == "NumpadEnter") &&
      this.selectedRowIndex >= 0 &&
      this.selectedRowIndex < this.itemList.length
    ) {
      $event.preventDefault();
      if (this.filterOption == "BARCODE") { }
      else {

        this.onItemDoubleClick.emit(this.itemList[this.selectedRowIndex]);
        this.hide();
        this.itemListClosed();
      }
    } else if ($event.code == "Escape") {
      $event.preventDefault();
      this.hide();
      this.itemListClosed();
    } else if ($event.code == "ArrowRight") {
      $event.preventDefault();
      this.calculateTotalPages();
      if (this.pageNumber >= this.totalPages) {
        this.pageNumber = this.totalPages;
        return;
      }

      this.selectedRowIndex = 0;
      this.pageNumber = this.pageNumber + 1;
      this.refresh();
    } else if ($event.code == "ArrowLeft") {
      $event.preventDefault();
      if (this.pageNumber <= 1) {
        this.pageNumber = 1;
        return;
      }
      this.selectedRowIndex = 0;
      this.pageNumber = this.pageNumber - 1;
      this.refresh();

    }
  }

  itemListClosed() {
    this.onPopUpClose.emit();
  }

  ngOnChanges(changes: any) {
    this.popupsettings = changes.popupsettings.currentValue;
  }
}

export class GenericPopUpSettings {
  title: string;
  apiEndpoints: string;
  columns: ColumnSettings[] = [];
  defaultFilterIndex: number = 0;
}

export class ColumnSettings {
  key: string;
  title: string;
  hidden: boolean = false;
  noSearch: boolean = false;
}

export function debounce(delay: number): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    const original = descriptor.value;
    const key = `__timeout__${propertyKey}`;

    descriptor.value = function (...args) {
      clearTimeout(this[key]);
      this[key] = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}