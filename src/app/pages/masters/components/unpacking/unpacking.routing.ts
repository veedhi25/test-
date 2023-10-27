import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UnpackingComponent } from './unpacking.component';



const routes: Routes = [
    { path: '', component: UnpackingComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UnpackingRoutingModule { }
