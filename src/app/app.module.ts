import { NgModule, ApplicationRef } from '@angular/core';
import { MessageDialog } from "./pages/modaldialogs/messageDialog/messageDialog.component";
import { AuthDialog } from "./pages/modaldialogs/authorizationDialog/authorizationDialog.component";
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
// import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeyModule } from 'angular2-hotkeys';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { SharedModule } from 'primeng/components/common/shared'
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { routing } from './app.routing';
// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
//services
import { MockMasterRepo } from './common/repositories';
import { AppSettings, IndexedDbWrapper } from './common/services'
import { SettingService } from './common/services/setting.service';
import { CanActivateTeam, Permissions, UserToken, AuthService, CacheService } from './common/services/permission';

import { ContextMenuModule } from 'ngx-contextmenu';

import { CookieService } from 'angular2-cookie/core';
import { TransactionModule } from "./common/Transaction Components/transaction.module";
import { DispatchDialog } from "./pages/modaldialogs/dispatchDialog/dispatchDialog.component";
import { GRNPopUpComponent } from './pages/modaldialogs/GRNDialog/GRNPopUp';
import { popupListModule } from './common/popupLists/popuplist.module';
import { InventryYearEndDialog } from './pages/modaldialogs/YearEndDialog/InventryYearEnd.component';
import { LoginDialog } from './pages/modaldialogs/logindialog/logindialog.component';
import { LoginService } from './pages/login/loginService.service';
import { LoginModule } from './pages/login/login.module';
import { ReportMainSerVice } from './pages/Reports/Report.service';
import { WindowRef } from './common/repositories/windows.service';
import { SignalRService } from './common/services/NotificationHub.service';
import { AngularMultiSelectModule } from './node_modules/angular4-multiselect-dropdown/index'
import { IMSGridModule } from './common/ims-grid/ims-grid.module';
// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState,
  AuthService,
  CacheService, CookieService,
  MockMasterRepo, UserToken, Permissions,
  CanActivateTeam,
  SettingService, LoginService, AppSettings, IndexedDbWrapper, ReportMainSerVice, WindowRef,
  SignalRService

];


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [LoginDialog, AuthDialog, MessageDialog, DispatchDialog,
    App,
    GRNPopUpComponent,
    InventryYearEndDialog
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    NgaModule.forRoot(),
    PagesModule,
    routing,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    ContextMenuModule, LoginModule,
    HotkeyModule.forRoot(),
    AutoCompleteModule, SharedModule,
    TransactionModule, popupListModule,
    AngularMultiSelectModule,
    IMSGridModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ],
  entryComponents: [LoginDialog, AuthDialog, MessageDialog, DispatchDialog, GRNPopUpComponent, InventryYearEndDialog],
})

export class AppModule {

  constructor(public appRef: ApplicationRef, public appState: AppState) {
  }

}

