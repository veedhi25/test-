import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesManTypeListComponent } from './sales-man-type-list.component';
import { SalesManTypeActionComponent } from './sales-man-type-action/sales-man-type-action.component';

const routes: Routes = [
    { path: '', component: SalesManTypeListComponent },
    { path: 'add-sales-man-type', component: SalesManTypeActionComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesManTypeRoutingModule { }
