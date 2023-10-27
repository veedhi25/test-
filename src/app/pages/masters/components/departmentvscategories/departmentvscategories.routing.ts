import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DepartmentVsCategoryComponent } from './departmentvscategories.component';




const routes: Routes = [
    { path: '', component:DepartmentVsCategoryComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartmentVsCategoryRoutingModule { }
