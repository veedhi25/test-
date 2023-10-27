import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesAreaHeirarchyListComponent } from '../SalesAreaHeirarchy/SalesAreaHeirarchyList';
import { SalesAreaFormComponent } from '../SalesAreaHeirarchy/SalesAreaHeirarchyEntry';
import { BatchPriceListComponent } from './BatchPriceList';
import { BatchFormComponent } from './BatchPriceEntry';

const routes: Routes = [
    { path: '', component: BatchPriceListComponent },
    { path: 'addbatch', component: BatchFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BatchPriceRoutingModule { }
