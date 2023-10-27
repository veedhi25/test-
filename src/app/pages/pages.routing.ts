import { Routes, RouterModule, CanActivate } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { CanActivateTeam } from '../common/services/permission/guard.service';
import { PendingChangesGuard } from '../common/services/guard/can-navigate.guard';
import { ItemMasterComponent } from './item-master/item-master.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages, 
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule', canActivate: [CanActivateTeam] },
      {
        path: 'masters', loadChildren: 'app/pages/masters/masters.module#MastersModule'
      },
      {
        path: 'message', loadChildren: 'app/pages/message/message.module#MessageModule'
      },
      {
        path: 'transaction/purchases', loadChildren: 'app/pages/Purchases/purchases.module#PurchasesModule'
      },
      {path: 'transaction/sales', loadChildren: 'app/pages/Sales/sales.module#SalesModule'},
      { path: 'report', loadChildren: 'app/pages/DialogReport/dialogRep.module#ReportModule' },
      { path: 'configuration', loadChildren: 'app/pages/configuration/configuration.module#ConfigurationModule' },
      {
        path: 'configuration/userManager', loadChildren: 'app/pages/userManager/userManager.module#UserManagerModule'
      },
      { path: 'configuration/settings', loadChildren: 'app/pages/settings/settings.module#SettingsModule' },
      { path: 'configuration/scheme', loadChildren: 'app/pages/scheme/scheme.module#SchemeModule' },
        
     
      { path: 'transaction/inventory', loadChildren: 'app/pages/Inventory/inventory.module#InventoryModule' },
      { path: 'transaction/production', loadChildren: 'app/pages/production/production.module#ProductionModule' },
      { path: 'transaction/multiple-print', loadChildren: 'app/pages/multiple-voucher-print/multiple-voucher-print.module#MultiPrintModule' },
      { path: 'transaction/pickinglist', loadChildren: 'app/pages/pickinglist/pickinglist.module#pickinglistModule' },
      { path: 'transaction/multiple-mobile-so', loadChildren: 'app/pages/multiple-salesorder/multiple-salesorder.module#MultiSalesOrderModule',canActivate:[CanActivateTeam] },
      { path: 'transaction/multipleproformatosi', loadChildren: 'app/pages/proformatosalesinvoice/proformatosalesinvoice.module#proformaToSalesInvoiceModule',canActivate:[CanActivateTeam] },
      { path: 'editors', loadChildren: 'app/pages/editors/editors.module#EditorsModule' },
      { path: 'components', loadChildren: 'app/pages/components/components.module#ComponentsModule' },
      { path: 'terminal', loadChildren: 'app/pages/terminal/terminal.module#TerminalModule',canActivate:[CanActivateTeam] },
      { path: 'backup-restore', loadChildren: 'app/pages/backupRestore/backup-restore.module#BackupRestoreModule',canActivate:[CanActivateTeam] },
      {path: 'configuration', loadChildren: 'app/pages/configuration/configuration.module#ConfigurationModule'},
      { path: 'reports', loadChildren: 'app/pages/Reports/Reports.module#ReportModule' },  
      {  path: 'wms', loadChildren: 'app/pages/wms/wms.module#WMSModule' },   
      {
        path: 'transaction/reorders', loadChildren: 'app/pages/reorders/reorders.module#ReordersModules'
      }, 
      {  path: 'sms', loadChildren: 'app/pages/sms/sms.module#SMSModule' },
      { path: 'reports', loadChildren: 'app/pages/MISReports/MISReports.module#MISReportsModule' }, 
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
