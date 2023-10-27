import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { hcategorymasterComponent } from './hcategorymaster.component';




const routes: Routes = 
[
    { path: '', component:hcategorymasterComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class hcategorymasterRoutingModule { }