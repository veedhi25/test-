import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "./authService.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Permissions } from './permission.service';
import { UserToken } from './userToken.service';
import { GlobalState } from '../../../global.state';
import { MasterRepo } from "../../repositories/index";
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MessageDialog } from "../../../pages/modaldialogs/messageDialog/messageDialog.component";
import * as moment from 'moment'
import { InventryYearEndDialog } from '../../../pages/modaldialogs/YearEndDialog/InventryYearEnd.component';

@Injectable()
export class CanActivateTeam implements CanActivate {
  viewPermission: Array<string> = [];
  userSetting: any = <any>{};
  userProfile: any = <any>{};
  Auth: any;
  enableFiscalYearEnd: boolean = false;
  constructor(private permission: Permissions, private userToken: UserToken, private gblstate: GlobalState, private _authService: AuthService,
    private masterService: MasterRepo, private router: Router, public dialog: MdDialog) {
    this.viewPermission = gblstate.getGlobalSetting("View-Permission") || [];
    this.userSetting = this.masterService.userSetting;
    this.userProfile = this.masterService.userProfile;
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
    var message$: Observable<string> = messageSubject.asObservable();
    var LoggedIn = this._authService.getAuth();

    var path: string = "";
    if (route.url[0] != null) {
      path = route.url[0].path;
    }
    if (this.userSetting.ENABLESESSIONMANAGEMENT === true && this.userProfile.OpeningAmount == null && (path == 'addsientry')) {
      messageSubject.next("Please start the session first.");
      var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
      setTimeout(() => {
        dialogref.close();

      }, 5000);
      return false;
    }
    if (this.userSetting.ENABLESESSIONMANAGEMENT != true && (path == 'session-management')) {
      messageSubject.next("Please start the session first.");
      var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
      setTimeout(() => {
        dialogref.close();

      }, 5000);
      return false;
    }
    // if ((path == 'userManager') && this.outletconfigUserManagementViewChild()) {
    //   messageSubject.next("You are not configured for this option.");
    //   var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
    //   setTimeout(() => {
    //     dialogref.close();

    //   }, 1000);
    //   return false;
    // }
    var right: string = route.params["mode"];
    if (right == undefined) right = "list";

    if (!(LoggedIn && LoggedIn.profile)) {
      messageSubject.next("You are not logged In.Please login in");
      var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
      setTimeout(() => {
        dialogref.close();
      }, 1000);
      return false;
    }
    else {
      var sub = this.masterService.checkUserValid().subscribe(res => {
        if (res == false) {
          messageSubject.next("Invalid User");
          var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
          setTimeout(() => {
            dialogref.close();
            return false;
          }, 1000);
          return false;
        }
      })
    }

    // Validating for fiscal Year end process
    //if (this.userSetting.ENABLEOFFLINESALE === 0 || this.userSetting.ENABLEOFFLINESALE === 2) {
    if (this._authService.getSessionVariable("isIYE") == 0) {
      this.dialog.closeAll();
      let childDialogRef = this.dialog.open(InventryYearEndDialog, {
        hasBackdrop: true,
        data: { header: "Information", message: "" }
      });
      if (path != "dashboard") { return false; }
    }
    //  }
    if (this.userSetting.ENABLEOFFLINESALE === 0 || this.userSetting.ENABLEOFFLINESALE === 2 || this.userSetting.ENABLEOFFLINESALE === 1) {
      if ((LoggedIn && LoggedIn.profile) && path == 'dashboard') {
        return true;
      } else {


        // let FBDATE: string = (this.masterService.userProfile.CompanyInfo.FBDATE).substr(0, 10);
        // let currentFiscalYearEndDate: string = this.masterService.userProfile.CompanyInfo.FEDATE;
        // if (moment(this.masterService.serverDate).isAfter(moment(currentFiscalYearEndDate), 'day')) {
        //   messageSubject.next("Please end you current fiscal year before any transaction.Contact your administrator");
        //   var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
        //   return false;
        // }
        //End of Fiscal year end process
      }
      if (this.userSetting.ENABLEOFFLINESALE === 0 || this.userSetting.ENABLEOFFLINESALE === 1) {
        if (this.masterService.userProfile.username.toUpperCase() == "ADMIN"
          || this.masterService.userProfile.username.toLowerCase() == "patanjali_user"
          || this.masterService.userProfile.username.toLowerCase() == "patanjali_support") {

          if (path.toLowerCase() == "stocksettlemententryapproval" && this.masterService.userProfile.username.toUpperCase() == "ADMIN" && this.masterService.userProfile.CompanyInfo.companyType == "retailer") {
            return true;
          }


          // if ((path.toLowerCase() == "openingstockentry") && this.masterService.userProfile.username.toUpperCase() == "ADMIN") {
          //   return false;
          // }
          if ((path.toLowerCase() != "openingstockentry" && path.toLowerCase() != "stocksettlemententryapproval") && this.masterService.userProfile.username.toUpperCase() == "ADMIN") {
            return true;
          }
          if ((path.toLowerCase() == "openingstockentry" || path.toLowerCase() == "stocksettlemententryapproval") && (this.masterService.userProfile.username.toLowerCase() == "patanjali_support" || this.masterService.userProfile.username.toLowerCase() == "supplychain" || this.masterService.userProfile.username.toUpperCase() == "ADMIN")) {
            return true;
          }
          if (this.masterService.userProfile.username == "patanjali_user") {
            return true;
          }
        }
      } else if (this.userSetting.ENABLEOFFLINESALE === 2 || this.userSetting.ENABLEOFFLINESALE === 1) {
        if (path == "addsientry") {
          messageSubject.next("You are not authorize for this operation");
          var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
          setTimeout(() => {
            dialogref.close();
            return false;
          }, 2000);
          return false;
        }
        else {
          if (this.masterService.userProfile.username.toUpperCase() == "ADMIN" || this.masterService.userProfile.username == "patanjali_user") { return true; }
        }
      }

      var result = this._authService.getMenuRight(path, right)
      if (!path) {
        if (result.list == true) {
          return true;
        }
      }
      else {
        if (result.right == true) {
          return true;
        }
        else {
          if (right == 'list') {
            if (result.list == true) {
              return true;
            }

          }
        }
      }
      messageSubject.next("You are not authorize for this operation");
      var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
      setTimeout(() => {
        dialogref.close();
        return false;
      }, 2000);

      //   if (this._authService.checkMenuRight(path, route.params["mode"]) == true && route.url[0] != null && route.url[1] != null) {
      //     // if (this.viewPermission.find((x) => x.toUpperCase() == viewToOpen.toUpperCase())) {
      //     //   console.log("permission-true1");

      //      console.log("permission-false1");
      //      return true;
      //   }


      // if(this._authService.checkMenuRight(path, route.params["mode"]) == false && route.url[0] != null && route.url[1] == null) {
      //   // if (this.viewPermission.find((x) => x.toUpperCase() == viewToOpen.toUpperCase())) {
      //   //   console.log("permission-true2");
      //   //   return true;
      //   // }

      //   console.log("permission-false2");
      //   return true;
      // }
    } else if (this.userSetting.ENABLEOFFLINESALE == 1 || this.userSetting.ENABLEOFFLINESALE === 0) {
      if ((LoggedIn && LoggedIn.profile) && (path == 'dashboard' || path == 'addsientry' || path == 'appconfiguration' || path == 'closingStock' || path == 'billwiseitemsalesreport' || path == 'audit-report')) {
        return true;
      } else {
        messageSubject.next("You are not authorize for this operation");
        var dialogref = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: message$ } });
        setTimeout(() => {
          dialogref.close();
          return false;
        }, 1000);
      }
    }

  }

  public outletconfigUserManagementViewChild() {
    let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    // for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
    //   if (user.OutletPermissionSettings[i].SettingTypeId == 6 && user.OutletPermissionSettings[i].CanView == false) {
    //     return true;

    //   }
    // }
    // return false;
    return false;
  }
}

