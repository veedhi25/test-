import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { itemgroupmasterComponent } from './itemgroupmaster.component';




const routes: Routes = 
[
    { path: '', component:itemgroupmasterComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemGroupMasterRoutingModule { }