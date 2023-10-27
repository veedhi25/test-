import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CustomerCategoryComponent } from './customer-category.component';
import { CustomerCategoryListComponent } from './customer-category-list.compoent';

const routes: Routes = [
    { path: '', component: CustomerCategoryListComponent },
    { path: 'addCategory', component: CustomerCategoryComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerCategoryRoutingModule { }
