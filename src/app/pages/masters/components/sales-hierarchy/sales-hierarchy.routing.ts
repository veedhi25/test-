import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesHierarchyListComponent } from './salesHierarchyList.component';
import { SalesHierarchyComponent } from './salesHierarchy.component';

const routes: Routes = [
    { path: '', component: SalesHierarchyListComponent },
    { path: 'add-salesHierarchy', component: SalesHierarchyComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesHierarchyRoutingModule { }
