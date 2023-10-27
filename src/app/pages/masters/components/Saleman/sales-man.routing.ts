import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesmanComponent } from './Saleman.component';
import { FormSalemanComponent } from './FormSaleman.component';

const routes: Routes = [
    { path: '', component: SalesmanComponent },
    { path: 'add-salesman', component: FormSalemanComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesManRoutingModule { }
