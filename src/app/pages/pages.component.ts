import { Component, OnInit, ViewChild, AfterViewInit, HostListener, NgZone, ElementRef } from '@angular/core';
import { MasterRepo } from "./../common/repositories/masterRepo.service";
import { Routes, Router } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { NotificationPopUpComponent } from '../common/popupLists/notification/notification-popup-grid.component';
import { SignalRService } from '../common/services/NotificationHub.service';
import { NotificationInterface } from '../common/interfaces/NotificationInterface';
import { OrderNotificationAcknowledgementComponent } from '../common/popupLists/oder-notification-acknowledgement/oder-notification-acknowledgement.component';

@Component({
  selector: 'pages',
  template: `
    <div class="">
      <div class="">
          <ba-page-top></ba-page-top>
      </div>
      <div class="">
        <div class="al-content">
          <router-outlet></router-outlet>
          <alert></alert>
          <spinner></spinner>
          <navigation-preventor></navigation-preventor> 
          <order-ack #orderackGrid></order-ack>

          <a (click)="toggleNotificationPopup()" class="notification notification-sticky" [class.notification-active]= "isActive">
          <span><i class="fa fa-bell" aria-hidden="true"></i></span>
          <span class="badge">{{notificationCount}}</span>
          </a>
        </div>
      </div>
    </div>
    <pages-footer></pages-footer>
    <notification-popup-grid #notification 
    (notificationCountUpdate)="updateNotificationCount($event)"
    >
    </notification-popup-grid>
    `
})
export class Pages implements OnInit, AfterViewInit {

  @ViewChild("orderackGrid") orderackGrid: OrderNotificationAcknowledgementComponent;
  @ViewChild("notification") notification: NotificationPopUpComponent;
  notificationCount: string = "0";
  isActive: boolean = false;

  constructor(
    private masterRepService: MasterRepo,
    private _menuService: BaMenuService,
    private _router: Router,
    private signalrService: SignalRService,
    private _ngZone: NgZone
  ) {
    localStorage.setItem("CUSTOMER", null);
    localStorage.setItem("SUPPLIER", null)
    localStorage.setItem("DSM", null)
    localStorage.setItem("BEAT", null)
    this.masterRepService.getReportFilterData();
   
  }

  ngAfterViewInit() {
    this.getNotificationCount();
  } 

  ngOnInit() {



    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    this.masterRepService.getCurrentDate().subscribe(date => {
      //   console.log("datecheck", date);
      this.masterRepService.serverDate = date.Date;
    });
  }

  toggleNotificationPopup() {
    this.notification.toggle();
  }

  getNotificationCount() {
    //this.notificationCount = 2
    this.notification.getNotificationCount();
  }

  updateNotificationCount(count) {
    if (count > 100) {
      this.notificationCount = "100+";
    } else {
      this.notificationCount = count;
    }
  }

  updateNotification() {
    this.notification.refresh();
  }


  @HostListener('document:keydown', ['$event'])

  onKeyPress($event: KeyboardEvent) {
    if (document.getElementById('ordermeNotification')) {
      $event.preventDefault();
      return;
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 83) {
      $event.preventDefault();
      if (this._router.url === "/pages/transaction/sales/addsientry") {
        return;
      } else if (this._router.url === "/pages/dashboard") {
        this._router.navigate(["./pages/transaction/sales/addsientry"])
      } else {
        if (confirm("Are You sure to leave the current page?")) {
          this._router.navigate(["./pages/transaction/sales/addsientry"])
        }
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 76) {
      $event.preventDefault();
      if (this._router.url === "/pages/transaction/purchases/add-purchase-order") {
        return;
      } else if (this._router.url === "/pages/dashboard") {
        this._router.navigate(["./pages/transaction/purchases/add-purchase-order"])
      } else {
        if (confirm("Are You sure to leave the current page?")) {
          this._router.navigate(["./pages/transaction/purchases/add-purchase-order"])
        }
      }
    }
    // if (($event.altKey || $event.metaKey) && $event.keyCode == 76) {
    //   $event.preventDefault();
    //   if (this._router.url === "/pages/transaction/purchases/add-RFQ-order") {
    //     return;
    //   } else if (this._router.url === "/pages/dashboard") {
    //     this._router.navigate(["./pages/transaction/purchases/add-RFQ-order"])
    //   } else {
    //     if (confirm("Are You sure to leave the current page?")) {
    //       this._router.navigate(["./pages/transaction/purchases/add-RFQ-order"])
    //     }
    //   }
    // }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 80) {
      $event.preventDefault();
      if (this._router.url === "/pages/transaction/purchases/add-purchase-invoice") {
        return;
      } else if (this._router.url === "/pages/dashboard") {
        this._router.navigate(["./pages/transaction/purchases/add-purchase-invoice"])
      } else {
        if (confirm("Are You sure to leave the current page?")) {
          this._router.navigate(["./pages/transaction/purchases/add-purchase-invoice"])
        }
      }
    }
    if (($event.altKey || $event.metaKey) && $event.keyCode == 73) {
      $event.preventDefault();
      if (this._router.url === "/pages/masters/inventory-info/productmaster") {
        return;
      } else if (this._router.url === "/pages/dashboard") {
        this._router.navigate(["./pages/masters/inventory-info/productmaster"])
      } else {
        if (confirm("Are You sure to leave the current page?")) {
          this._router.navigate(["./pages/masters/inventory-info/productmaster"])
        }
      }
    }


  }



  private subscribeAndListenToEvents(): void {
    this.signalrService.connectionEstablished.subscribe(() => {
    });

    this.signalrService.messageReceived.subscribe((message: any) => {
      let notification: NotificationInterface = new NotificationInterface();
      this._ngZone.run(() => {
        notification.FROMCOMPANY = message.fromcompany;
        notification.TOCOMPANY = message.tocompany;
        notification.ID = message.id;
        notification.REFNO = message.refno;
        notification.REMARKS = message.remarks;

        let userprofiles: any = JSON.parse(localStorage.getItem('USER_PROFILE'));
        let companyId = userprofiles.CompanyInfo.COMPANYID;
        if (message.tocompany == companyId) {
          this.orderackGrid.notificationForAck.push(notification);
        }

      });
    });
  }



}
