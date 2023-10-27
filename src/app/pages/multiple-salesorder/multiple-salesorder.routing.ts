import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MultiSalesOrderComponent } from './multiple-salesorder.component';


const routes: Routes = [
    { path: '', component: MultiSalesOrderComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MultiSalesOrderRoutingModule { }
