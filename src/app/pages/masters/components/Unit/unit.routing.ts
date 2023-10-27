import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UnitListComponent } from './unitList.component';
import { UnitFormComponent } from './unitForm.component';

const routes: Routes = [
    { path: '', component: UnitListComponent },
    {path:'add-unit-list',component:UnitFormComponent},



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UnitRoutingModule { }
