import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ALedgerComponent } from './ALedger.component';
import { ALedgerTableComponent } from './ALedgerTable.component';
import { PendingChangesGuard } from '../../../../common/services/guard/can-navigate.guard';
import { BankListComponent } from '../Bank/bank-list.component';

const routes: Routes = [
    {path:'Account',component:ALedgerComponent,canDeactivate: [PendingChangesGuard]},
    {path:'AccountList',component:ALedgerTableComponent},
    {path:'bank',loadChildren:'app/pages/masters/components/Bank/bank.module#BankModule'},


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AledgerRoutingModule { }
