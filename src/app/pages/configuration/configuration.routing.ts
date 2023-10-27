import { Routes, RouterModule } from "@angular/router";
import { Configuration } from "./configuration.component";
import { SchemeSettingComponent } from "./components/scheme-setting/scheme-setting.component";
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { OpeningStockComponent } from "./components/openingStock/openingStock.component";
import { openingstocklistComponent } from "./components/openingStock/openingStockList.component";
import { NormsSettingComponent } from "./components/norms-setting/norms-setting.component";
import { TableVehicleRegistrationComponent } from "./components/vehicle-registry/vehicleRegistrationTable.component";
import { VehicleRegistrationComponent } from "./components/vehicle-registry/vehicleRegistration.component";
import { EwayComponent } from "./components/EwayUpdate/Eway.component";
import { ExcelImportConfigComponent } from "./components/excel-import-config/excel-import-config.component";
import { DataMigrationComponent } from "./components/DataMigrationGof/dataMigrationGof";
import { AccountMigrationComponent } from "./components/AccountMigrationGoF/accountmigrationgof";
import { AppConfigurationComponent } from "./components/AppConfiguration/app-configuration.component";
import { ErpMapConfigurationComponent } from "./components/ErpMapConfiguration/ErpMapConfiguration.component";
import { SalesConfigurationComponent } from "./components/salesconfiguration/SalesConfiguration.component";
import { EInvoiceComponent } from "./components/einvoice/EInvoice.component";
import { BankFinanceQuerycomponent } from "./components/BankFinancing/BankFinanceQuery.component";
import { PhysicalInventorycomponent } from "./components/PhysicalInventory/PhysicalInventory.component";
import { DeviceSettingComponent } from "./components/device-setting/devicesetting.component";
import { DSMVsMinAmountListComponent } from "./components/dsmvsminamount/dsmvsminamount-list.component";
import { DSMVSMinAmountComponent } from "./components/dsmvsminamount/dsmvsminamount.component";
import { PrefixSettingComponent } from "./components/prefixSetting";
import { PageWiseControlComponent } from "./components/PageWiseControl/PageWiseControlDetail.component";
import { AddPageWiseControlComponent } from "./components/PageWiseControl/AddPageWiseControl.component";
import { ControlAccessPageWiseDetailComponent } from "./components/ControlAccessPageWise/ControlAccessPageWiseDetail.component";
import { OutletConfigurationComponent } from "./components/OutletConfigurationComponent/OutletConfiguration.component";
import { CompanyFormComponent } from "../masters/components/CompanyInfo/companyForm.component";
import { OutletPermission } from "./components/OutletConfigurationComponent/outlet-permission/outlet-permission";
import { UserList } from "../userManager/components/userManger";
import { DigitalSignatureComponent } from "./components/DigitalSignature/DigitalSignature.component";
import { EmailSettingComponent } from "./components/emailsetting/emailsetting.component";
import { ThreeMmPrintComponent } from "./components/AppConfiguration/three-mm-print/threeMmPrint.component";

const routes: Routes = [
  {
    path: "",
    component: Configuration,
    children: [
      {
        path: "org-master/company-info",
        component: CompanyFormComponent,
        canActivate: [CanActivateTeam]
      },
      // { path: 'org-master/company-info', loadChildren: 'app/pages/masters/components/CompanyInfo/company-info.module#CompanyInfoModule', canActivate: [CanActivateTeam] },
      { path: 'org-master/warehouse', loadChildren: 'app/pages/masters/components/Warehouse/warehouse.module#WarehouseModule', canActivate: [CanActivateTeam] },
      {
        path: "scheme-setting",
        component: SchemeSettingComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "openingStock",
        component: openingstocklistComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "openingStock/add-openingstock",
        component: OpeningStockComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "normsetting",
        component: NormsSettingComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "VehicleRegistration",
        component: TableVehicleRegistrationComponent
      },
      {
        path: "NewVehicleRegistration",
        component: VehicleRegistrationComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "invoicing-finance/EwayUpdate",
        component: EwayComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "invoicing-finance/einvoice",
        component: EInvoiceComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "invoicing-finance/BankFinanceQuery",
        component: BankFinanceQuerycomponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "PhysicalInventory",
        component: PhysicalInventorycomponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "master-migration",
        component: ExcelImportConfigComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "userManager/userlist",
        component: UserList,
        canActivate: [CanActivateTeam]
      },
      {
        path: "datamigrationgof",
        component: DataMigrationComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "accountmigrationgof",
        component: AccountMigrationComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/appconfiguration",
        component: AppConfigurationComponent,
        canActivate: [CanActivateTeam]
      }
      ,
      {
        path: "erpmapconfiguration",
        component: ErpMapConfigurationComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "salesconfiguration",
        component: SalesConfigurationComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/devicesetting",
        component: DeviceSettingComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/threemmprint",
        component: ThreeMmPrintComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/beatvsminlist",
        component: DSMVsMinAmountListComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/beatvsmin",
        component: DSMVSMinAmountComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/prefixsetting",
        component: PrefixSettingComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/PageWiseControl",
        component: PageWiseControlComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/AddPageWiseControl",
        component: AddPageWiseControlComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/ControlAccessPageWise",
        component: ControlAccessPageWiseDetailComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "outlet-configuration",
        component: OutletConfigurationComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "outlet-permission",
        component: OutletPermission,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/digitalSignature",
        component: DigitalSignatureComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: "settings/emailsetting",
        component: EmailSettingComponent,
        canActivate: [CanActivateTeam]
      }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
