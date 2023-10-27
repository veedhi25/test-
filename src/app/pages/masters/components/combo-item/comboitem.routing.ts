import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ComboItemComponent } from './comboitem.component';



const routes: Routes = [
    { path: '', component:ComboItemComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComboItemRoutingModule { }
