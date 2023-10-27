import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EmployeeMasterListComponent } from './employee-master-list.component';
import { EmployeeMasterComponent } from './employee-master.component';

const routes: Routes = [
    { path: 'list', component: EmployeeMasterListComponent },
    { path: 'new', component: EmployeeMasterComponent },




];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeMasterRoutingModule { }
