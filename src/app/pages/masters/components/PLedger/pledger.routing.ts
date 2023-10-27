import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PLedgerComponent } from './PLedger.component';
import { SupplierLedgerComponent } from './SupplierLedger.component';
import { CustomerLedgerComponent } from './CustomerLedger.component';
import { SuppliervsItemComponent } from './suppliervsitem.component';
import { ResolveMasterFormData } from '../../../../common/repositories/ResolveMasterFormData.service';
import { CusotmerPagnition } from './CusotmerPagnition.component';

const routes: Routes = [
    { path: 'Supplier', component: PLedgerComponent, resolve: { formSetting: ResolveMasterFormData }, data: { formName: 'SupplierMaster' } },
    { path: 'SupplierList', component: SupplierLedgerComponent },
    { path: 'Customer', component: PLedgerComponent, resolve: { formSetting: ResolveMasterFormData }, data: { formName: 'customerMaster' } },
    { path: 'CustomerList', component: CustomerLedgerComponent },
    { path: 'suppliervsitem', component: SuppliervsItemComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartyLedgerRoutingModule { }
