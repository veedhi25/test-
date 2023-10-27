import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PickingListComponent } from './pickinglist.component';


const routes: Routes = [
    { path: '', component: PickingListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class pickinglistRoutingModule { }
