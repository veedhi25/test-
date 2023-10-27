import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductHierarchyListComponent } from './productHierarchyList.component';
import { ProductHierarchyComponent } from './productHierarchy.component';

const routes: Routes = [
    { path: '', component: ProductHierarchyListComponent },
    { path: 'add-productHierarchy', component: ProductHierarchyComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductHierarchyRoutingModule { }
