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

  import { isNullOrUndefined } from "util";
  import { xor } from "lodash";
import { debounce, GenericPopUpSettings } from "../generic-grid/generic-popup-grid.component";
  
  @Component({
    selector: "popup-ClientSidePaginated",
    templateUrl: "./popupClientSidePaginated.html",
    styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
  })
  export class PopupClientSidePaginatedComponent extends PagedListingComponentBase
    implements OnChanges, AfterViewInit, OnInit {
    ngAfterViewInit(): void {
      this.filterValue.valueChanges.debounceTime(200).subscribe((x) => {
        this.refreshPage();
        this.refresh();
      });
  
    }
  
  
    ngOnInit() {
     
    }
    /** List Declaration  */
  

    requestUrl: string = "";
  
    isActive: boolean = false;
    itemList: any[] = [];
    selectedRowIndex: number = 0;
    tabindex: string = "list";
    hideGridOnDoubleClick: boolean = true;
    //for transaction filter
    /** Output  */
  
    @Output() onPopUpClose = new EventEmitter();
    @Output() onItemDoubleClick = new EventEmitter();
  
    /** Input  */
  
    @Input() popupsettings: GenericPopUpSettings;
    @Input() summary: string;
    @ViewChild('inputBox') inputBox: ElementRef
    constructor(public injector: Injector) {
      super(injector);
    }
  
    show(list:any[]) {
    
      this.summary = null;
      this.itemList = list;
     
      this.selectedRowIndex = 0;
      setTimeout(() => {
        this.inputBox.nativeElement.focus()
      }, 10);
  
  
      setTimeout(() => {
        this.isActive = true;
        document.getElementById('inputBox').focus();
       
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
       
  
          this.onItemDoubleClick.emit(this.itemList[this.selectedRowIndex]);
          this.hide();
          this.itemListClosed();
        
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
  
 