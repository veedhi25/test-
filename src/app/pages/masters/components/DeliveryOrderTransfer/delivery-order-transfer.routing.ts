import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DeliveryOrderTransferComponent } from './delivery-order-transfer.component';

const routes: Routes = [
    { path: '', component: DeliveryOrderTransferComponent },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeliveryOrderTransferRoutingModule { }
