import { ModalModule } from "ng2-bootstrap";
import { CheckboxModule } from "primeng/components/checkbox/checkbox";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../theme/nga.module";
import { Ng2SmartTableModule } from "../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { AutoCompleteModule } from "primeng/components/autocomplete/autocomplete";
import { NguiAutoCompleteModule } from "@ngui/auto-complete/dist";
import { routing } from "./configuration.routing";
import { Configuration } from "./configuration.component";
import { SchemeSettingComponent } from "./components/scheme-setting/scheme-setting.component";
import { SchemeSettingListComponent } from "./components/scheme-setting/scheme-setting-list.component";

import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { OpeningStockComponent } from "./components/openingStock/openingStock.component";
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { CalendarModule } from "primeng/components/calendar/calendar";
import { openingstocklistComponent } from "./components/openingStock/openingStockList.component";
import { NormsSettingComponent } from "./components/norms-setting/norms-setting.component";
import { TreeModule } from "angular-tree-component";
import { TableVehicleRegistrationComponent } from "./components/vehicle-registry/vehicleRegistrationTable.component";
import { VehicleRegistrationComponent } from "./components/vehicle-registry/vehicleRegistration.component";
import { popupListModule } from "../../common/popupLists/popuplist.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { EwayComponent } from "./components/EwayUpdate/Eway.component";
import { Ewaypopupcomponent } from "./components/EwayUpdate/Ewaypopup.component";
import { ExcelImportConfigComponent } from "./components/excel-import-config/excel-import-config.component";
import { KeysPipe } from "../../theme/directives/pipes/pipes";
import { EwaypopupRowDataComponent } from "./components/EwayUpdate/EwaypopupRowData.component";
import { FileUploaderPopupModule } from "../../common/popupLists/file-uploader/file-uploader-popup.module";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";
import { LimitDecimalPlacesModule } from "../../common/directives/limit-decimal.module";
import { IMSDatePickerModule } from "../../common/date-picker/date-picker.module";
import { DataMigrationComponent } from "./components/DataMigrationGof/dataMigrationGof";
import { AccountMigrationComponent } from "./components/AccountMigrationGoF/accountmigrationgof";
import { AppConfigurationComponent } from "./components/AppConfiguration/app-configuration.component";
import { EwayTransporterComponent } from "./components/EwayUpdate/Eway-transporter.component";
import { ErpMapConfigurationComponent } from "./components/ErpMapConfiguration/ErpMapConfiguration.component";
import { SalesConfigurationComponent } from "./components/salesconfiguration/SalesConfiguration.component";
import { EInvoiceComponent } from "./components/einvoice/EInvoice.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { BankFinanceQuerycomponent } from "./components/BankFinancing/BankFinanceQuery.component";
import { PhysicalInventorycomponent } from "./components/PhysicalInventory/PhysicalInventory.component";
import { DeviceSettingComponent } from "./components/device-setting/devicesetting.component";
import { SearchPipe } from "./components/device-setting/search.pipe";
import { DSMVsMinAmountListComponent } from "./components/dsmvsminamount/dsmvsminamount-list.component";
import { DSMVSMinAmountComponent } from "./components/dsmvsminamount/dsmvsminamount.component";
import { PrefixSettingModule } from "./components/prefixSetting";
import { AddPageWiseControlComponent } from "./components/PageWiseControl/AddPageWiseControl.component";
import { NgxPaginationModule } from "ngx-pagination";
import { PageWiseControlComponent } from "./components/PageWiseControl/PageWiseControlDetail.component";
import { ControlAccessPageWiseDetailComponent } from "./components/ControlAccessPageWise/ControlAccessPageWiseDetail.component";
import { OutletConfigurationComponent } from "./components/OutletConfigurationComponent/OutletConfiguration.component";
import { CompanyFormComponent } from "../masters/components/CompanyInfo/companyForm.component";
import { OutletPermission } from "./components/OutletConfigurationComponent/outlet-permission/outlet-permission";

import { AngularMultiSelectModule } from '../../node_modules/angular4-multiselect-dropdown'
import { UserManagerModule } from "../userManager/userManager.module";
import { DigitalSignatureComponent } from "./components/DigitalSignature/DigitalSignature.component";
import { EmailSettingComponent } from "./components/emailsetting/emailsetting.component";
import { ThreeMmPrintComponent } from "./components/AppConfiguration/three-mm-print/threeMmPrint.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    TransactionModule,
    AutoCompleteModule,
    NguiAutoCompleteModule,
    CalendarModule,
    CheckboxModule,
    TreeModule,
    popupListModule,
    FileUploaderPopupModule.forRoot(),
    GenericPopupGridModule.forRoot(),
    LimitDecimalPlacesModule.forRoot(),
    IMSDatePickerModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    PrefixSettingModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
    UserManagerModule


  ],
  declarations: [
    SearchPipe,
    SchemeSettingListComponent,
    SchemeSettingComponent,
    Configuration,
    OpeningStockComponent,
    openingstocklistComponent,
    NormsSettingComponent,
    VehicleRegistrationComponent,
    TableVehicleRegistrationComponent,
    EwayComponent,
    Ewaypopupcomponent,
    ExcelImportConfigComponent,
    KeysPipe,
    EwaypopupRowDataComponent,
    EwayTransporterComponent,
    DataMigrationComponent,
    AccountMigrationComponent,
    AppConfigurationComponent,
    ErpMapConfigurationComponent,
    SalesConfigurationComponent,
    EInvoiceComponent,
    BankFinanceQuerycomponent,
    PhysicalInventorycomponent,
    DeviceSettingComponent,
    DSMVsMinAmountListComponent,
    DSMVSMinAmountComponent,
    PageWiseControlComponent,
    AddPageWiseControlComponent,
    ControlAccessPageWiseDetailComponent,
    OutletConfigurationComponent,
    CompanyFormComponent,
    OutletPermission,
    DigitalSignatureComponent,
    EmailSettingComponent,
    ThreeMmPrintComponent
  ],
  providers: [CanActivateTeam, TransactionService]
})
export class ConfigurationModule { }
