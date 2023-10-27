import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductsComponent } from './products';
import { AddProductComponent } from './addproducts';
import { AddProductGroupComponent } from './addproductGroup';

const routes: Routes = [
    { path: '', component: ProductsComponent },
    {path:'add-productmaster',component:AddProductComponent},
    {path:'add-product-group', component: AddProductGroupComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductMasterRoutingModule { }
