import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DoctorMasterListComponent } from './doctor-master-list.component';
import { DoctorMasterComponent } from './doctor-master.component';

const routes: Routes = [
    { path: 'list', component: DoctorMasterListComponent },
    { path: 'new', component: DoctorMasterComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DoctorMasterRoutingModule { }
