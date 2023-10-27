import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BranchListComponent } from './branch-list.component';
import { BranchComponent } from './branch.component';
import { CategoryListComponent } from './categoryList.component';
import { CategoryFormComponent } from './categoryForm.component';

const routes: Routes = [
    { path: '', component: CategoryListComponent },
    { path: 'add-category', component: CategoryFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule { }
