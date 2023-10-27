import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Divisions, AddDivision } from '.';

const routes: Routes = [
    { path: '', component: Divisions },
    { path: 'adddivisionList', component: AddDivision },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class divisonRoutingModule { }