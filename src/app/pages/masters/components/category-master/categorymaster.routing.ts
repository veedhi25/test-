import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CategoryMasterComponent } from './categorymaster.component';




const routes: Routes = [
    { path: '', component:CategoryMasterComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryMasterRoutingModule { }
