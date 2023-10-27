import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransferPartyLedgerComponent } from './transferpartyledger.component';
import { TransferPartyLedgerTableComponent } from './trasferpartyledgertable.component';

const routes: Routes = [
    { path: 'tCustomer', component: TransferPartyLedgerComponent },
    { path: 'tCustomerList', component: TransferPartyLedgerTableComponent },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransferPartyLedgerRoutingModule { }
