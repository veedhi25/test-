import { Component, OnInit, OnDestroy, Inject, ElementRef } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { Router, NavigationEnd, Routes } from "@angular/router";
import 'style-loader!./baPageTop.scss';
import { Subscription } from 'rxjs';
import { BaMenuService } from '../../services/baMenu/baMenu.service';
import { DOCUMENT } from '@angular/platform-browser';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { PAGES_MENU } from '../../../pages/pages.menu';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
})
export class BaPageTop implements OnInit, OnDestroy {

  //public ViewChild() sci = ElementRef('sci');
  public activePageTitle: string = '';
  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = true;
  public offlineSyncStatus: boolean = false;
  public onlineSyncStatus: boolean = false;
  menuSearched: FormControl = new FormControl();
  public menu = [];
  //for menu top
  public menuItems: any[];
  public selectedMenuItems: any[];
  protected _menuItemsSub: Subscription;
  protected _onRouteChange: Subscription;
  private isAllMenu = false;
  public userData = {
    username: "",
    password: "",
    newPassword: ""
  }
  ORGANIZATION_INFO: any = <any>{};
  ORG_TYPE: string = "";
  orgEnum: number;
  menuRights: any[] = [];
  public icon = '../../../assets/img/bharuwa_logo1.png';
  public _SYSTEMSETTING: any = <any>{};
  public __SYSTEMSETTINGMENU:any=<any>{};
  constructor(@Inject(DOCUMENT) private document: any,
    private _state: GlobalState,
    private router: Router,
    private http: Http,
    private _service: BaMenuService,
    private _spinnerService: SpinnerService
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this._state.subscribe('menu.activeLink', (activeLink) => {
      if (activeLink) {
        this.activePageTitle = activeLink.title;
      }
    });

    if (localStorage.getItem("setting")) {
      this.__SYSTEMSETTINGMENU = JSON.parse(localStorage.getItem("setting"));
    }

    if (localStorage.getItem("USER_PROFILE")) {
      this.ORGANIZATION_INFO = JSON.parse(localStorage.getItem("USER_PROFILE"))

      this.ORG_TYPE = this.ORGANIZATION_INFO.CompanyInfo ? this.ORGANIZATION_INFO.CompanyInfo.ORG_TYPE : "";
      this.menuRights = this.ORGANIZATION_INFO.menuRights;
      if (this.ORG_TYPE == 'central') { this.orgEnum = 1 }
      else if (this.ORGANIZATION_INFO.CompanyInfo.isHeadoffice == 1) { this.orgEnum = 15 }
      else if (this.ORGANIZATION_INFO.CompanyInfo.companycode == null || this.ORGANIZATION_INFO.CompanyInfo.companycode == "" || this.ORGANIZATION_INFO.CompanyInfo.companycode == undefined) { this.orgEnum = 16 }
      else if (this.outletconfigChild()) { this.orgEnum = 17 }
      else if (this.ORG_TYPE == 'superdistributor') { this.orgEnum = 2 }
      else if (this.ORG_TYPE == 'distributor') { this.orgEnum = 3 }
      else if (this.ORG_TYPE == 'retailer') { this.orgEnum = 4 }
      else if (this.ORG_TYPE.toLowerCase() == 'fitindia') { this.orgEnum = 5 }
      else if (this.ORG_TYPE.toLowerCase() == 'superstockist') { this.orgEnum = 6 }
      else if (this.ORG_TYPE.toLowerCase() == 'wdb') { this.orgEnum = 7 }
      else if (this.ORG_TYPE.toLowerCase() == 'ak') { this.orgEnum = 8 }
      else if (this.ORG_TYPE.toLowerCase() == 'ck') { this.orgEnum = 9 }
      else if (this.ORG_TYPE.toLowerCase() == 'pms') { this.orgEnum = 10 }
      else if (this.__SYSTEMSETTINGMENU.IsEnableHCategory==true){
        this.orgEnum=25
      }

    }
    if (localStorage.getItem("setting")) {
      this._SYSTEMSETTING = JSON.parse(localStorage.getItem("setting"));
    } else {
      this._SYSTEMSETTING.ENABLEOFFLINESALE = 0;
    }
  }

  offlineSubmenu: string[] = ["Sales",
    "Purchase",
    "Inventory Report",
    "Purchase Report",
    "Sales Report",
    "Master Report",
    "App configuration",
    "Organisation Master",
    "Inventory",
    "Multiple Voucher Print",
    "User Manager",
    "Master Migration",
    "Company Info",
    "Settings",
    "Customer",
    "Supplier",
    "Item",
    "Dashboard",
    "Inventory Info",
    "Tender"
  ];
  offlineMenu: string[] = [
    "Sales Order",
    "Cash Handover",
    "Sales Invoice",
    "Sales Return",
    "Customer Category",
    "Purchase Order",
    "Purchase Invoice",
    "Purchase Invoice",
    "Purchase Return",
    "Stock Settlement Entry",
    "Stock Settlement Approval",
    "Opening stock entry",
    "Stock Issue",
    "Closing Report",
    "Stock Settlement",
    "Bill Wise Item Sales Report",
    "Daily Sales Report",
    "Daily Collection Report",
    "Sales Return Report",
    "Purchase Invoice Detail Report",
    "Item Master",
    "User List",
    "Item Price Change",
    "Price Drop",
    "Company Info",
    "sales",
    "Customer",
    "Supplier",
    "Item Price Change",
    "Product Master",
    "Unit Of Measurement",
    "Warehouse",
    "Combo Item",
    "Kit Configuration"
  ]
  public ngOnInit(): void {



    if (!this.isAllMenu) {
      this.offlineSubmenu = ["Sales",

        "Inventory Report",
        "Sales Report",
        "Master Report",
        "App configuration",

      ];
      this.offlineMenu = [
        "Sales Invoice",
        "Closing Report",
        "Bill Wise Item Sales Report"
      ]
    }

    this._onRouteChange = this.router.events.subscribe((event) => {

      let convertedMenuObject: Routes = _.cloneDeep(<Routes>PAGES_MENU)[0].children;
      this.menu = [];
      convertedMenuObject.forEach(child => {
        child.children.forEach(children => {
          if (children.hasOwnProperty("children")) {
            children.children.forEach(subchildren => {
              this.menu.push({
                name: subchildren.data.menu.title,
                path: (`${child.path}/${children.path}/${subchildren.path}`).replace("//", "/")
              })
            })
          } else {
            this.menu.push({
              name: children.data.menu.title,
              path: (`${child.path}/${children.path}`).replace("//", "/")
            })
          }
        })
      })
      if (event instanceof NavigationEnd) {
        if (this.menuItems) {
          this.selectMenuAndNotify();
        } else {
          // on page load we have to wait as event is fired before menu elements are prepared
          setTimeout(() => this.selectMenuAndNotify());
        }
      }
    });

    this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));
    this.menuSearched.valueChanges.subscribe((res) => {
      this.router.navigate([`./pages/${res}`]);
    })
  }

  setSelectedMenu(menuItem) {
    if (menuItem.title == "Financial Account") {
      window.open(window.location.protocol + "//" + window.location.hostname + ":8040");
    } else if (menuItem.title == "Multi Business") {
      window.open(window.location.protocol + "//" + window.location.hostname + ":8030");
    }
    else {
      this.selectedMenuItems = menuItem;
    }
  }
  logoClickEvent() {
    this.selectedMenuItems = this.menuItems.filter(x => x.title == "IMSPOS")[0];
  }
  public selectMenuAndNotify(): void {
    if (this.menuItems) {
      this.menuItems = this._service.selectMenuItem(this.menuItems);
      this._state.notifyDataChanged('menu.activeLink', this._service.getCurrentItem());
    }
  }

  public hoverItem($event): void {

  }

  public toggleSubMenu($event): boolean {
    let submenu = jQuery($event.currentTarget).next();
    $event.item.expanded = !$event.item.expanded;
    return false;
  }

  public ngOnDestroy(): void {
    this._onRouteChange.unsubscribe();
    this._menuItemsSub.unsubscribe();
  }

  public updateMenu(newMenuItems) {
    this.selectedMenuItems = newMenuItems.length ? newMenuItems[0] : null;
    this.menuItems = newMenuItems;
    // this.selectMenuAndNotify();
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  onHoverItem() {

  }


  EnableOfflineMenu(menu) {
    if (menu.title == "Multi Business") {
      return false;
    }
    if (this._SYSTEMSETTING.ENABLEOFFLINESALE == 1) {
      if ((menu.title == "IMSPOS") || (menu.title == "Transaction") || menu.title == "Report" || menu.title == "Configuration" || menu.title == "Masters") {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  EnableOfflineMenuChild(child) {

    if (this._SYSTEMSETTING.ENABLEOFFLINESALE == 1) {

      if (this.offlineSubmenu.filter(x => x == child.title).length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (child.title == "User Manager") {
        if (this.ORGANIZATION_INFO.username.toLowerCase() == "admin" || this.ORGANIZATION_INFO.username.toLowerCase() == "patanjali_user" || this.ORGANIZATION_INFO.username.toLowerCase() == "patanjali_support") {
          return true;
        } else {
          return false
        }
      } else {
        return true;
      }
    }
  }


  EnbaleOfflineChildren(children) {

    if (children.title == "Item Property Setting") {
      if (this.ORGANIZATION_INFO.username.toLowerCase() == "patanjali_user") {
        return true;
      } else {
        return false;
      }
    }
    // if (children.title == "Opening stock entry" || children.title == "Stock Settlement Approval") {
    //   if (this.ORGANIZATION_INFO.username.toLowerCase() == "patanjali_user" || this.ORGANIZATION_INFO.username.toLowerCase() == "patanjali_support" || this.ORGANIZATION_INFO.username.toLowerCase() == "supplychain" || (this.ORGANIZATION_INFO.CompanyInfo.companyType == "retailer" && this.ORGANIZATION_INFO.username.toLowerCase() == "admin")) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    if (children.title == "Ruchi Soya Configuration" || children.title == "Delivery Order Transfer") {
      if (this.ORGANIZATION_INFO.CompanyInfo.COMPANYID == "central") {
        return true;
      } else {
        return false;
      }
    }
    if (children.title == "Loyalty" && !this._SYSTEMSETTING.ENABLELOYALTY) {
      return false;
    }
    if (this._SYSTEMSETTING.ENABLEOFFLINESALE == 1) {
      if (this.offlineMenu.filter(x => x == children.title).length > 0) {
        return true;
      }
      else if ((this.ORGANIZATION_INFO.username.toLowerCase() == "admin" || this.ORGANIZATION_INFO.username.toLowerCase() == "patanjali_user")
        && (children.title == "App configuration" || children.title == "Closing Stock" || children.title == 'Bill Wise Item Sales Report' || children.title == 'Bill Wise Item Sales Report' || children.title == 'Audit Report')) {
        return true;
      } else {

        return false;
      }
    } else if (this._SYSTEMSETTING.ENABLEOFFLINESALE == 2 || this._SYSTEMSETTING.ENABLEOFFLINESALE == 1) {
      if (children.title == "Sales Invoice") {//|| children.title == "Sales Return") {
        return false;
      }
      else if (children.title == "Indent Approval") {
        if (this._SYSTEMSETTING.ENABLEINDENTDELIVERY == true) {
          return true;
        }
        else {

          return false;
        }
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }




  isShowPageMenu(menuItem: any): boolean {
    let res: boolean = false;
    if (menuItem.route) {
      if (menuItem.route.menuType) {
        if (menuItem.route.companyType.filter(c => c == 0 || c == this._SYSTEMSETTING.COMPANYNATURE)[0] != null && menuItem.route.menuType.filter(x => x == 0 || x == this.orgEnum)[0] != null && this.getMenuRights(menuItem.route.path)) 
        {res= true;
        }
      }
      else {
        res= true;
      }
    }
    else if (menuItem.children) {
      let childrens = menuItem.children.filter(x => (x.route.menuType.filter(y => y == 0 || y == this.orgEnum) && x.route.companyType.filter(y => y == 0 || y == this._SYSTEMSETTING.COMPANYNATURE)));
      if (childrens.length == menuItem.children.length) {
        res= false;
      }
      res= true;
    }
    else {

      res= true;

    }
        if(menuItem.title=="Hierarchical Category Master")
        {
          //alert(menuItem.path);
         if (this.__SYSTEMSETTINGMENU.IsEnableHCategory==true)
          {
            res=true;       
          }
          else{
            
          res=false;
          }
          //alert(res);
    }
    return res;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
  public logout() {

    if (confirm('Are you sure to log out?')) {
      this.router.navigate(["login", { logout: 'logout' }]);
    }
  }
  public forgetPassword: boolean = false
  changePasswordPrompt() {
    this.forgetPassword = true
  }
  public changepwd: boolean = false
  changePassword() {
    try {
      this.changepwd = true
      let header: Headers = new Headers({
        "Content-type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("TOKEN"))
      }); let option = new RequestOptions({ headers: header })
      var apicall = this._state.getGlobalSetting("apiUrl") + "/changePassword";
      this.http.post(apicall, this.userData, option).subscribe(res => {
        if (res.statusText == "OK") {
          this.changepwd = false
          this.router.navigate(["login", { logout: 'logout' }]);
        }
      }, error => {
        this.changepwd = false
        alert(error);
      })
    } catch (ex) {
      this.changepwd = false
    }
  }


  cancelPassword() {
    this.forgetPassword = false
  }

  public downloadPrintService() {
    if (confirm('Are you sure to configure printer?')) {
      this.document.location.href = 'https://app.pos.bharuwa.com/printService/PrintSetup.exe';
    }
  }

  getMenuRights(menuname: string): boolean {
    if (this.ORGANIZATION_INFO.username == "Admin" || this.ORGANIZATION_INFO.username.toLowerCase() == "patanjali_user") { return true; }
    // return true;
    let right = false;
    let men = this.menuRights.filter(x => x.menu == menuname)[0];
    if (men != null) {

      right = men.right.indexOf('view') > -1;
    }

    if (menuname == "") {
      right = true;
    }
    return right;
  }
  OfflineSync() {
    let header: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("TOKEN"))
    }); let option = new RequestOptions({ headers: header })
    this.offlineSyncStatus = true;
    this._spinnerService.show("Syncing Data.Please wait while the operation is complete");
    this.http
      .post(this._state.getGlobalSetting("apiUrl") + "/syncforoffline", this._state.getGlobalSetting("apiUrl"), option)
      .map(ret => ret.json())
      .subscribe(
        data => {

          alert(data.result);
          this.offlineSyncStatus = false;
          this._spinnerService.hide();
        },
        error => {
          alert(error);
          this.offlineSyncStatus = false;
          this._spinnerService.hide();
        }
      );
  }


  showSyncMaster() {
    if (this._SYSTEMSETTING.ENABLEOFFLINESALE == 1) {
      if (this.ORGANIZATION_INFO.username.toLowerCase() == 'admin' || this.ORGANIZATION_INFO.username.toLowerCase() == 'patanjali_user') {
        return true
      }
    } else {
      return true;
    }
  }

  loadsyncmaster() {
    if (this._SYSTEMSETTING.ENABLEOFFLINESALE == 1) {
      if (this.ORGANIZATION_INFO.username.toLowerCase() == 'admin' || this.ORGANIZATION_INFO.username.toLowerCase() == 'patanjali_user') {
        this.offlineSyncStatus = true;
      }
    } else {
      this.onlineSyncStatus = true;
    }
  }


  syncmaster(apiforsync) {
    try {
      let header: Headers = new Headers({
        "Content-type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("TOKEN"))
      }); let option = new RequestOptions({ headers: header })
      this._spinnerService.show("Syncing Data.Please wait while the operation is complete");

      this.http
        .post(`${this._state.getGlobalSetting('apiUrl')}/${apiforsync}`, this._state.getGlobalSetting("apiUrl"), option)
        .map(ret => ret.json())
        .subscribe(
          data => {
            if (data.status == "ok") {
              this.offlineSyncStatus = false;
              this._spinnerService.hide();
            } else {
              this.offlineSyncStatus = false;
              this._spinnerService.hide();
              alert(data.message);
            }
          },
          error => {
            alert(error);
            this.offlineSyncStatus = false;
            this._spinnerService.hide();
          }
        );
    } catch (error) {
      if (this._spinnerService != null) {
        this._spinnerService.hide();
      }
      alert(error);
    }
  }
  onlinesyncmaster(apiforsync) {
    try {
      let header: Headers = new Headers({
        "Content-type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("TOKEN"))
      }); let option = new RequestOptions({ headers: header })
      this._spinnerService.show("Syncing Data.Please wait while the operation is complete.");
      this.http
        .post(`${this._state.getGlobalSetting('apiUrl')}/${apiforsync}`, this._state.getGlobalSetting("apiUrl"), option)
        .map(ret => ret.json())
        .subscribe(
          data => {
            if (data.status == "ok") {
              this.onlineSyncStatus = false;
              this._spinnerService.hide();
            } else {
              this.onlineSyncStatus = false;
              this._spinnerService.hide();
              alert(data.message);
            }
          },
          error => {
            alert(error);
            this.onlineSyncStatus = false;
            this._spinnerService.hide();
          }
        );
    } catch (error) {
      if (this._spinnerService != null) {
        this._spinnerService.hide();
      }
      alert(error);
    }
  }

  loadmessage() {

    this.router.navigate(["./pages/message"])
  }

  syncInChildDomains(body: string) {
    try {
      let apiforsyncDomain = `syncInChildDomains/${body}`;
      let header: Headers = new Headers({
        "Content-type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("TOKEN")),
        "X-Requested-With": 'XMLHttpRequest'
      }); let option = new RequestOptions({ headers: header })
      this._spinnerService.show("Syncing Data.Please wait while the operation is complete");

      this.http
        .post(`${this._state.getGlobalSetting('apiUrl')}/${apiforsyncDomain}`, body, option)
        .map(ret => ret.json())
        .subscribe(
          data => {
            if (data.status == "ok") {
              this.offlineSyncStatus = false;
              this._spinnerService.hide();
            } else {
              this.offlineSyncStatus = false;
              this._spinnerService.hide();
              alert(data.message);
            }
          },
          error => {
            alert(error);
            this.offlineSyncStatus = false;
            this._spinnerService.hide();
          }
        );
    } catch (error) {
      if (this._spinnerService != null) {
        this._spinnerService.hide();
      }
      alert(error);
    }


  }

  outletconfigChild() {
    let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));

    // for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
    //   if (user.OutletPermissionSettings[i].SettingTypeId == 2 && user.OutletPermissionSettings[i].CanView == true) {
    //     return true;
    //   }
    // }
    // return false;
    return true;
  }
}
