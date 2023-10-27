import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesAreaHeirarchyListComponent } from '../SalesAreaHeirarchy/SalesAreaHeirarchyList';
import { SalesAreaFormComponent } from '../SalesAreaHeirarchy/SalesAreaHeirarchyEntry';

const routes: Routes = [
    { path: '', component: SalesAreaHeirarchyListComponent },
    { path: 'addsalesarea', component: SalesAreaFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesAreaRoutingModule { }
