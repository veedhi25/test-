import { Component, Output, EventEmitter, Injector, HostListener, ViewChild, ElementRef } from "@angular/core";
import { PagedListingComponentBase } from "../../../paged-list-component-base";
import { GenericPopUpSettings } from "../generic-grid/generic-popup-grid.component";
import { Headers, RequestOptions } from "@angular/http";
import { NotificationService } from "./notification.service";
import { Router } from "@angular/router";

@Component({
  selector: "notification-popup-grid",
  templateUrl: "./notification-popup-grid.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class NotificationPopUpComponent extends PagedListingComponentBase {
  /** List Declaration  */


  isActive: boolean = false;
  itemList: any[] = [];
  selectedRowIndex: number = 0;
  tabindex: string = "list";

  /** Output  */

  @Output() onPopUpClose = new EventEmitter();
  @Output() onItemDoubleClick = new EventEmitter();
  @Output() notificationCountUpdate = new EventEmitter();

  /** Input  */
  @ViewChild('notificationPanel') notificationPanel: ElementRef;
  @ViewChild('notificationCardInside') notificationCardInside: ElementRef;
  popupsettings: GenericPopUpSettings;

  constructor(
    public injector: Injector,
    private notificationService: NotificationService,
    private router: Router
  ) {
    super(injector);
    this.popupsettings = Object.assign(new GenericPopUpSettings, {
      title: "All Notifications",
      apiEndpoints: `/getAllNotificationPagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "MESSAGE",
          title: "Details",
          hidden: false,
          noSearch: false
        },
        {
          key: "TIMESTAMP",
          title: "Notification At",
          hidden: false,
          noSearch: false
        }
      ]
    });

    this.refreshPage();
    this.refresh();
  }

  show() {
    this.isActive = true;
    this.selectedRowIndex = 0;
  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(
      result => {
        let count = Number(result) ? Number(result) : 0;
        this.notificationCountUpdate.emit(count);
      },
      error => {
        this.notificationCountUpdate.emit(0);
      }
    );
  }

  markAsRead(item) {
    this.redirectToBestRoute(item);
    if (item.ISSEEN) return;
    this.notificationService
      .markAsRead(item.ID)
      .subscribe(result => { }, error => { });
  }

  redirectToBestRoute(item) {
    let caseString = "";
    let parentNotificationId = 0;
    let status = 0;
    let isDownloaded = 0;
    if (item) {
      caseString = item.TYPE;
      parentNotificationId = item.PARENTNOTIFICATIONID;
      status =
        item.ISAPPROVED ||
          item.ISAPPROVED == null ||
          item.ISAPPROVED == undefined
          ? 0
          : 1;
      isDownloaded =
        item.ISDOWNLOADED ||
          item.ISDOWNLOADED == 0 ||
          item.ISDOWNLOADED == null ||
          item.ISDOWNLOADED == undefined
          ? 0
          : 1;
    }


    switch (caseString) {
      case "PERFORMA": {
        //statements;

        if (
          parentNotificationId == 0 ||
          parentNotificationId == undefined ||
          parentNotificationId == null
        ) {
          //redirect to performa
          this.router.navigate(
            ["/pages/transaction/purchases/add-purchase-invoice"],
            {
              queryParams: {
                voucher: item.REFNO,
                status: status,
                downloaded: isDownloaded,
                fromCompany: item.FROMCOMPANY,
                for: "PP"
              }
            }
          );
        } else {
          this.router.navigate(
            ["/pages/transaction/sales/addsientry"],
            { queryParams: { voucher: item.REFNO, downloaded: isDownloaded } }
          );
          //redirect to sales -- approved
        }
        break;
      }
      case "PURCHASEORDER": {
        //statements;
        if (
          parentNotificationId == 0 ||
          parentNotificationId == undefined ||
          parentNotificationId == null
        ) {
          //redirect to performa
          this.router.navigate(
            ["/pages/transaction/sales/sales-order"],
            {
              queryParams: {
                voucher: item.REFNO,
                status: status,
                fromcompany: item.FROMCOMPANY,
                downloaded: isDownloaded,

              }
            }
          );
        }
        break;
      }
      case "SALES": {
        //statements;
        break;
      }
      case "PURCHASEORDER_MOBILE":
        {
          if (
            parentNotificationId == 0 ||
            parentNotificationId == undefined ||
            parentNotificationId == null
          ) {
            //redirect to performa
            this.router.navigate(
              ["/pages/transaction/sales/sales-order"],
              {
                queryParams: {
                  voucher: item.REFNO,
                  status: status,
                  downloaded: isDownloaded,
                  type: "PURCHASEORDER_MOBILE",
                  fromcompany: item.FROMCOMPANY,
                  dsmname: item.DSM,
                  dsmcode: item.DSMCODE,
                  beat: item.BEAT,
                  remark: item.REMARK
                }
              }
            );
          }
          break;
        }
      case "ORDERME_PROFORMA":
        {
          this.router.navigate(
            ["/pages/transaction/sales/addsientry"],
            { queryParams: { voucher: item.REFNO, downloaded: isDownloaded } }
          );
          break;
        }
      case "TRANSFER_OUT":
        {
          this.router.navigate(
            ["/pages/transaction/inventory/branch-in"],
            { queryParams: { voucher: item.REFNO, downloaded: isDownloaded } }
          );
          break;
        }
      case "PURCHASERETURN_FITINDIA":
        {
          this.router.navigate(
            ["/pages/transaction/sales/add-creditnote-itembase"],
            { queryParams: { voucher: item.REFNO, downloaded: isDownloaded, FROMCOMPANY: item.FROMCOMPANY } }
          );
          break;
        }
      case "INDENT":
        {
          this.router.navigate(["/pages/transaction/purchases/indent"],
            { queryParams: { voucher: item.REFNO, downloaded: isDownloaded, FROMCOMPANY: item.FROMCOMPANY } }
          );
          break;
        }
      case "DeliveryChallaan": {
        this.router.navigate(["/pages/wms/mr"],
          { queryParams: { voucher: item.REFNO, downloaded: isDownloaded, FROMCOMPANY: item.FROMCOMPANY } }

        );
      }
        break;
      case "MR": {
        this.router.navigate(["pages/transaction/sales/addsientry"],
          { queryParams: { voucher: item.REFNO, downloaded: isDownloaded, FROMCOMPANY: item.FROMCOMPANY } }

        );
      }
        break;
      case "RFQ":
        {
          this.router.navigate(["/pages/transaction/sales/quotationinvoice"],
            { queryParams: { voucher: item.REFNO, downloaded: isDownloaded, FROMCOMPANY: item.FROMCOMPANY } }
          );
          break;
        }
      case "Quotation":
        {
          this.router.navigate(["/pages/transaction/sales/quotationinvoice"],
            { queryParams: { voucher: item.REFNO, downloaded: isDownloaded, FROMCOMPANY: item.FROMCOMPANY } }
          );
          break;
        }
      default: {
        //statements;
        break;
      }
    }
  }

  getData() {
    this.selectedRowIndex = 0;
    let apiUrl = `${this.apiUrl}${this.popupsettings.apiEndpoints
      }?currentPage=${this.pageNumber}&maxResultCount=${this.pageSize}`;
    apiUrl = this.getFilterOption(apiUrl);
    return this._http
      .get(apiUrl, this.getRequestOption())
      .map(res => res.json() || [])
      .subscribe(res => {
        this.totalItems = res ? res.totalCount : 0;
        this.itemList = res ? res.data : [];
        //console.table(this.itemList);
      });
  }

  hide() {
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
    if (this.filterValue != undefined &&
      (
        this.filterValue.value == null ||
        this.filterValue.value == undefined ||
        this.filterValue.value == ""
      )
    )
      return;

    this.refreshPage();
    this.refresh();
  }

  singleClick(index) {
    this.selectedRowIndex = index;
  }

  doubleClick($event) {
    this.onItemDoubleClick.emit($event);
    this.hide();
  }

  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) {
    if (!this.isActive) {
      return;
    }
    if (
      $event.code == "ArrowDown" &&
      this.selectedRowIndex < this.pageSize - 1
    ) {
      this.notificationPanel.nativeElement.scrollTop = this.notificationPanel.nativeElement.scrollTop + 120;
      $event.preventDefault();
      this.selectedRowIndex++;
    }
    else if ($event.code == "ArrowDown") {
      this.notificationPanel.nativeElement.scrollTop = this.notificationPanel.nativeElement.scrollTop + 120;
      $event.preventDefault();
      this.selectedRowIndex = 0;
      this.pageNumber = this.pageNumber + 1;
      this.refresh();
    }
    else if ($event.code == "ArrowUp" && this.selectedRowIndex - 1 > -1) {
      if (this.notificationPanel.nativeElement.scrollTop > 0) {
        this.notificationPanel.nativeElement.scrollTop = this.notificationPanel.nativeElement.scrollTop - 120;
      }
      $event.preventDefault();
      this.selectedRowIndex--;
    }
    else if ($event.code == "ArrowUp") {
      if (this.notificationPanel.nativeElement.scrollTop > 0) {
        this.notificationPanel.nativeElement.scrollTop = this.notificationPanel.nativeElement.scrollTop - 120;
      }
      $event.preventDefault();
      this.selectedRowIndex = 0;
      this.pageNumber = this.pageNumber > 0 ? this.pageNumber - 1 : this.pageNumber
      this.refresh();
    }
    else if (
      $event.code == "Enter" &&
      this.selectedRowIndex >= 0 &&
      this.selectedRowIndex < this.itemList.length - 1
    ) {
      $event.preventDefault();

      let itemIndex = ((this.pageNumber - 1) * this.pageSize) + (this.selectedRowIndex)
      this.onItemDoubleClick.emit(this.itemList[this.selectedRowIndex]);
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

    } else if ($event.code == "Escape") {
      $event.preventDefault();
      this.hide();
      this.itemListClosed();
    }

  }

  itemListClosed() {
    this.onPopUpClose.emit();
  }

  public getRequestOption() {
    let token = localStorage.getItem("TOKEN");
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: token ? token.replace(/['"]+/g, "") : ""
    });
    return new RequestOptions({ headers: headers });
  }

  toggle() {
    if (this.isActive) {
      this.hide();
    } else {
      this.getNotificationCount();
      this.refresh();
      this.show();
    }
  }
}
