import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import { AddDeliveryBoyComponent } from './addDeliveryBoy.component';
// import { DeliveryBoyComponent } from './deliveryBoy.component';
import { AddDeliveryBoyComponent, DeliveryBoyComponent } from '.';


const routes: Routes = [
    { path: '', component: DeliveryBoyComponent },
    { path: 'addDeliveryBoy', component: AddDeliveryBoyComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeliveryBoyRouting { }