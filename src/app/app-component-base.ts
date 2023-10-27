import { Injector } from "@angular/core";
import { AuthService } from "./common/services/permission";
import { GlobalState } from "./global.state";
import { Http, Response, Headers, RequestOptions, ResponseContentType } from "@angular/http";

export abstract class AppComponentBase {

  public _authService: AuthService;
  public _state: GlobalState;
  public _http: Http;

  constructor(injector: Injector) {
    this._authService = injector.get(AuthService);
    this._state = injector.get(GlobalState);
    this._http = injector.get(Http);
  }

  canActiveMenu(menu: string, right: string) {
    return true;
    //this._authService.checkMenuRight(menu, 'list');
  }

  //end accountlist
  public get apiUrl(): string {
    let url = this._state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) { apiUrl = url[0] };
    return apiUrl
  }

  public getRequestOption() {
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: this._authService.getAuth().token,
      "X-Requested-With": 'XMLHttpRequest'
    });
    return new RequestOptions({ headers: headers });
  }

  public outletconfigChild() {
    let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    // for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
    //   if (user.OutletPermissionSettings[i].SettingTypeId == 1 && user.OutletPermissionSettings[i].CanCreate == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 2 && user.OutletPermissionSettings[i].CanCreate == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 3 && user.OutletPermissionSettings[i].CanCreate == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 4 && user.OutletPermissionSettings[i].CanCreate == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 5 && user.OutletPermissionSettings[i].CanCreate == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 6 && user.OutletPermissionSettings[i].CanCreate == true)
    //     return true;
    //   }
    return true;
  }

  public outletconfigParentandIndividual() {
    // let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    // if (user.CompanyInfo.isHeadoffice == 1 || user.CompanyInfo.companycode == null) {
    //   return true;
    // }
    // return false;
    return true;
  }

  outletconfigExportChild() {
    let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    //   for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
    //     if (user.OutletPermissionSettings[i].SettingTypeId == 1 && user.OutletPermissionSettings[i].CanExport == true)
    //       return true;
    //     else if (user.OutletPermissionSettings[i].SettingTypeId == 2 && user.OutletPermissionSettings[i].CanExport == true)
    //       return true;
    //     else if (user.OutletPermissionSettings[i].SettingTypeId == 3 && user.OutletPermissionSettings[i].CanExport == true)
    //       return true;
    //     else if (user.OutletPermissionSettings[i].SettingTypeId == 4 && user.OutletPermissionSettings[i].CanExport == true)
    //       return true;
    //     else if (user.OutletPermissionSettings[i].SettingTypeId == 5 && user.OutletPermissionSettings[i].CanExport == true)
    //       return true;
    //     else if (user.OutletPermissionSettings[i].SettingTypeId == 6 && user.OutletPermissionSettings[i].CanExport == true)
    //       return true;

    // }
    return true;
  }

  public outletconfigUserManagementCreateChild() {
    let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    // for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
    //   if (user.OutletPermissionSettings[i].SettingTypeId == 6 && user.OutletPermissionSettings[i].CanCreate == true) {
    //     return true;

    //   }
    // }
    return true;
  }

  public outletconfigUserManagementUpdateChild() {
    let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    // for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
    //   if (user.OutletPermissionSettings[i].SettingTypeId == 6 && user.OutletPermissionSettings[i].CanUpdate == true) {
    //     return true;
    //   }
    // }
    return true;
  }

  outletconfigImportChild() {
    let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    // for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
    //   if (user.OutletPermissionSettings[i].SettingTypeId == 1 && user.OutletPermissionSettings[i].CanImport == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 2 && user.OutletPermissionSettings[i].CanImport == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 3 && user.OutletPermissionSettings[i].CanImport == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 4 && user.OutletPermissionSettings[i].CanImport == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 5 && user.OutletPermissionSettings[i].CanImport == true)
    //     return true;
    //   else if (user.OutletPermissionSettings[i].SettingTypeId == 6 && user.OutletPermissionSettings[i].CanImport == true)
    //     return true;
    // }
    return true;
  }

  public outletconfigUserManagementDeleteChild() {
    let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    // for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
    //   if (user.OutletPermissionSettings[i].SettingTypeId == 6 && user.OutletPermissionSettings[i].CanDelete == true) {
    //     return true;
    //   }
    // }
    return true;
  }
}