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
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PagedListingComponentBase } from "../../../paged-list-component-base";
import { MasterRepo } from "../../repositories";
import * as moment from 'moment'

@Component({
  selector: "generic-popup-grid",
  templateUrl: "./generic-popup-grid.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class GenericPopUpComponent extends PagedListingComponentBase
  implements OnChanges, AfterViewInit {
  ngAfterViewInit(): void {
    this.filterValue.valueChanges.debounceTime(500).subscribe((x) => {
      if (!this.isActive) return;
      if (x == null || x == "" || x == undefined) return;
      this.refreshPage();
      this.refresh();
    })
  }
  /** List Declaration  */

  requestUrl: string = "";
  isActive: boolean = false;
  itemList: any[] = [];
  selectedItemList: any[] = [];
  isMultiSelectEnabled: boolean = false;
  userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
  selectedRowIndex: number = 0;
  tabindex: string = "list";
  hideGridOnDoubleClick: boolean = true;
  //for transaction filter
  billTo: string = "";
  tag: string = "";
  mtag: string = "";
  additionalParam: string
  isForCancelOrder: boolean = false;
  activeUrlPath: string = "";

  selectedItems: any[] = [];
  isGlobalChecked: boolean = false;

  /** Output  */

  @Output() onPopUpClose = new EventEmitter();
  @Output() onItemDoubleClick = new EventEmitter();
  @Output() onButtonClick = new EventEmitter();
  @Output() onDeleteClicked = new EventEmitter();
  @Output() ViewSupplierHistory = new EventEmitter();

  /** Input  */

  @Input() popupsettings: GenericPopUpSettings;
  @Input() summary: string;
  @ViewChild('inputBox') inputBox: ElementRef
  constructor(public injector: Injector, private masterService: MasterRepo, public route: Router, public aroute: ActivatedRoute) {
    super(injector);
    let currentUrl = this.route.url;
    let currentUrlList = currentUrl.split("/");
    this.activeUrlPath = currentUrlList[currentUrlList.length - 1];
  }

  show(billTo: string = "", isForCancelOrder: boolean = false, tag: string = "", hideOnDoubleClick: boolean = true,
    mtag: string = "", isMultiSelectEnabled: boolean = false, additionalParam: string = "") {

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
    this.mtag = mtag;
    this.additionalParam = additionalParam;
    this.isMultiSelectEnabled = isMultiSelectEnabled;
    setTimeout(() => {
      this.setFilterOption();
      this.refreshPage();
      this.refresh();
    }, 100)
  }

  setFilterOption() {
    if (this.popupsettings && this.popupsettings.columns.length) {
      let filterIndex = this.popupsettings.defaultFilterIndex ? this.popupsettings.defaultFilterIndex : 0;
      if (this.popupsettings.columns.length <= filterIndex) return;
      this.filterValue.setValue("");
      this.filterOption = this.popupsettings.columns[filterIndex].key;
    }
  }

  getData() {
    if (!this.isActive) return;
    this.summary = null;
    this.selectedRowIndex = 0;
    let apiEndpoints = this.popupsettings.apiEndpoints;
    let apiUrl = `${this.apiUrl}${apiEndpoints}?currentPage=${this.pageNumber
      }&maxResultCount=${this.pageSize}`;
    if (this.billTo && this.billTo != "" && this.billTo != null && this.billTo != undefined) {
      apiUrl = apiUrl + `&billTo=${this.billTo}`;
    }
    if (this.tag && this.tag != "" && this.tag != null && this.isTableLoading != undefined) {
      apiUrl = apiUrl + `&tag=${encodeURIComponent(this.tag)}`;
    }
    if (this.mtag && this.mtag != "" && this.mtag != null && this.isTableLoading != undefined) {
      apiUrl = apiUrl + `&mtag=${encodeURIComponent(this.mtag)}`;
    }
    if (this.additionalParam && this.additionalParam != "" && this.additionalParam != null && this.isTableLoading != undefined) {
      apiUrl = apiUrl + `&additionalParam=${encodeURIComponent(this.additionalParam)}`;
    }
    if (this.isForCancelOrder) {
      apiUrl = apiUrl + `&isForCancelOrder=${this.isForCancelOrder}`;
    }
    this.requestUrl = this.getFilterOption(apiUrl);
    return this._http
      .get(this.requestUrl, this.masterService.getRequestOption())
      .map(res => res.json() || [])
      .subscribe(res => {

        this.totalItems = res ? res.totalCount : 0;

        if (this.popupsettings.title == "Indents Received From Outlets" && this.userProfile.CompanyInfo.isHeadoffice == 1 && this.userProfile.CompanyInfo.companycode != null) {
          this.itemList = res.result;
          this.itemList.forEach(e => {
            if (e.IsConverted == false && (e.HQVoucherNumber == null || e.HQVoucherNumber == "")) {
              e.INDENTNO = e.VoucherNumber;
              e.isChecked = false;
              e.isDisabled = false
            }
            else {
              e.isDisabled = true;
            }
          });
          this.verifyData();
        }
        else {
          this.itemList = res ? res.data ? res.data : [] : [];
        }
        if (this.popupsettings.title == "Approved Quotations") {
          res.result.PoData.forEach(e => {
            let x = {
              RFQNO: e.RfqNo,
              SupplierName: e.SupplierName,
              RFQDate: moment(e.RfqDate).format('YYYY/MM/DD'),
              QTApprovalDate: moment(e.QuotationApprovalDate).format('YYYY/MM/DD'),
              Supplieracid: e.Supplieracid
            }
            this.itemList.push(x)
          });
        }
        this.itemList.forEach(function (item) {
          if (item.TRNDATE != null && item.TRNDATE != undefined) {
            item.TRNDATE = item.TRNDATE.toString().substring(0, 10);
          }
          if (item.DATE != null && item.DATE != undefined) {
            item.DATE = item.DATE.toString().substring(0, 10);
          }
        });

        if (this.itemList[this.selectedRowIndex] != null) {
          this.itemList[this.selectedRowIndex].itemSummary;
        }
        if (
          this.itemList.length > 0 &&
          this.selectedRowIndex == 0 &&
          this.itemList[this.selectedRowIndex].itemSummary
        ) {
          this.summary = this.itemList[this.selectedRowIndex].itemSummary;
        }
        if ((this.popupsettings.title == "Indent List For PO") || (this.popupsettings.title == "Intend List" && this.userProfile.CompanyInfo.isHeadoffice == 1 && this.userProfile.CompanyInfo.companycode != null)) {

          this.itemList = this.itemList.filter(e => e.TRNSTATUS.toLowerCase() == 'active')
          this.itemList.forEach(x => x.isDisabled = false)
          this.verifyData();
        }
        if (this.popupsettings.title == "Suppliers List For RFQ" && (this.userProfile.CompanyInfo.isHeadoffice == 1 || this.userProfile.CompanyInfo.companycode == null)) {
          this.itemList.forEach(e => {
            e.isChecked = false;
            e.isDisabled = false
          });
          this.verifyData();
        }

        if (this.activeUrlPath)
          // if (this.activeUrlPath == 'quotationinvoice') {
          //   this.aroute.queryParams.subscribe(params => {
          //     if (params.voucher) {
          //       let company = params.FROMCOMPANY;
          //       console.log(company);                
          //     }
          //   });
          // }
          if (this.popupsettings.title == 'Quotations' && this.tag == 'ViewQuotation') {
            this.itemList.forEach(
              x => {
                x.TRNDATE = moment(x.TRNDATE).format('DD/MM/YYYY');
                x.rfqvalidity = moment(x.rfqvalidity).format('DD/MM/YYYY');
                x.DELIVERYDATE = moment(x.DELIVERYDATE).format('DD/MM/YYYY');
              }
            )

          }
        if (this.activeUrlPath == 'add-RFQ-order' && this.tag == 'ViewRFQ') {
          this.itemList.forEach(
            x => {
              x.TRNDATE = moment(x.TRNDATE).format('DD/MM/YYYY');
              x.rfqvalidity = moment(x.rfqvalidity).format('DD/MM/YYYY');
            }
          )
        }

      });
  }

  hide() {
    this.itemList = [];
    this.pageNumber = 1;
    this.totalItems = 0;
    this.isActive = false;
  }

  globalSelect(event) {
    var pp = this.selectedItems;
    if (this.isGlobalChecked == true) {
      this.itemList.forEach(function (item, index) {
        item.isChecked = true;
        //for converted indents indentno is not defined so they won't get selected even on all items selection, in case of indents from outlet to hq
        if (item.INDENTNO != null && item.INDENTNO != undefined) {
          var selectedFilteredList = pp.filter(u => u.INDENTNO == item.INDENTNO);
          if (selectedFilteredList.length == 0) {
            pp.push(item);
          }
        }
        if (item.ACID != null && item.ACID != undefined) {
          var selectedFilteredList = pp.filter(u => u.ACID == item.ACID);
          if (selectedFilteredList.length == 0) {
            pp.push(item);
          }
        }
      });
    }
    else {
      this.itemList.forEach(function (item, index) {
        item.isChecked = false;
        pp.forEach(function (selectedItem, selectedIndex) {
          if (item.INDENTNO != null && item.INDENTNO != undefined) {
            if (item.INDENTNO == selectedItem.INDENTNO) {
              pp.splice(selectedIndex, 1);
            }
          }
          if (item.ACID != null && item.ACID != undefined) {
            if (item.ACID == selectedItem.ACID) {
              pp.splice(selectedIndex, 1);
            }
          }
        });
      });
    }
  }

  singleSelect(event, item) {
    if (item.isChecked == true) {
      if (item.INDENTNO != null && item.INDENTNO != undefined) {
        var selectedFilteredList = this.selectedItems.filter(u => u.INDENTNO == item.INDENTNO);
        if (selectedFilteredList.length == 0) {
          this.selectedItems.push(item);
        }
      }
      if (item.ACID != null && item.ACID != undefined) {

        var selectedFilteredList = this.selectedItems.filter(u => u.ACID == item.ACID);
        if (selectedFilteredList.length == 0) {
          this.selectedItems.push(item);
        }
      }

    } else {
      var pp = this.selectedItems;
      this.selectedItems.forEach(function (selectedItem, selectedIndex) {
        if (item.INDENTNO != null && item.INDENTNO != undefined) {
          if (item.INDENTNO === selectedItem.INDENTNO) {
            pp.splice(selectedIndex, 1);
          }
        }
        if (item.ACID != null && item.ACID != undefined) {
          if (item.ACID === selectedItem.ACID) {

            pp.splice(selectedIndex, 1);
          }
        }
      });
    }
    this.verifyData();
  }

  buttonClick() {
    if (this.selectedItems) {
      this.onButtonClick.emit(this.selectedItems);
      if (this.hideGridOnDoubleClick) {
        this.hide();
      }
    }
  }

  verifyData() {

    var pp = this.selectedItems;
    var checkedCount = 0;
    this.itemList.forEach(item => {
      if (item.INDENTNO != null && item.INDENTNO != undefined) {
        var selectedFilteredList = pp.filter(u => u.INDENTNO == item.INDENTNO);
        if (selectedFilteredList.length == 0) {
          item.isChecked = false;
        }
        else {
          item.isChecked = true;
          checkedCount = checkedCount + 1;
        }
      }
      if (item.ACID != null && item.ACID != undefined) {
        var selectedFilteredList = pp.filter(u => u.ACID == item.ACID);
        if (selectedFilteredList.length == 0) {
          item.isChecked = false;
        }
        else {
          item.isChecked = true;
          checkedCount = checkedCount + 1;
        }
      }

      if (checkedCount === this.itemList.length) {
        this.isGlobalChecked = true;
      }
      else {
        this.isGlobalChecked = false;
      }
    });

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


  onMultiSelectApply() {
    this.onItemDoubleClick.emit(this.itemList.filter(x => x.isSelected == true));
    this.hide();
  }


  @HostListener("document : keydown", ["$event"])
  @debounce(10)
  updown($event: KeyboardEvent) {
    if (!this.isActive) return true;


    //preventing if enter in menucode
    if (($event.srcElement as Element) != null && ($event.srcElement as Element).id != null && ($event.srcElement as Element).id.includes("menucode")) {
      return true;
    }
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
    } else if (
      ($event.code == "Space") &&
      this.selectedRowIndex >= 0 &&
      this.selectedRowIndex < this.itemList.length
    ) {

      if (this.isMultiSelectEnabled) {
        $event.preventDefault();
        if (this.itemList[this.selectedRowIndex].isSelected) {
          this.itemList[this.selectedRowIndex].isSelected = false;
        } else {
          this.itemList[this.selectedRowIndex].isSelected = true;
        }
      }
    }
    else if ($event.code == "Escape") {
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


  onActionClicked(actionString: string, index: number) {
    if (actionString == "" || actionString == null || actionString == undefined) {
      return;
    } else {
      let action = actionString.toLowerCase();
      switch (action) {
        case "delete":
          if (confirm(`Are you sure to ${action} this row ?.`)) {
            this.onDeleteClicked.emit(this.itemList[index]);
          }
          break;
        case "cancel":
          if (confirm(`Are you sure to ${action} this row ?.`)) {
            this.onDeleteClicked.emit(this.itemList[index]);
          }
          break;
        case "view supplier history":
          this.ViewSupplierHistory.emit(this.itemList[this.selectedRowIndex].RFQNO);
          this.hide()
          break;

        default:
          break;
      }
    }
  }
}

export class GenericPopUpSettings {
  title: string;
  apiEndpoints: string;
  columns: ColumnSettings[] = [];
  defaultFilterIndex: number = 0;
  showActionButton?: boolean = false;
  actionKeys?: ActionKeySettings[] = [];
}



export class ColumnSettings {
  key: string;
  title: string;
  hidden: boolean = false;
  noSearch: boolean = false;
}
export class InputColumn {
  title: string;
  key: string
}
export class ActionKeySettings {
  icon: string = "";
  text: string = "";
  title: string = "";

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