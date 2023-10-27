import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesAreaTypeListComponent } from './sales-area-list.component';
import { SalesAreaTypeFormComponent } from './add-sales-area-type/add-sales-area.component';

const routes: Routes = [
    { path: '', component: SalesAreaTypeListComponent },
    { path: 'add-salesareatype', component: SalesAreaTypeFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesAreaTypeRoutingModule { }
