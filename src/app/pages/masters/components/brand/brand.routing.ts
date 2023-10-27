import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrandListComponent } from './brand-list.component';
import { BrandFormComponent } from './add-new-brand/add-brand.component';

const routes: Routes = [
    { path: '', component: BrandListComponent },
    { path: 'add-brand', component: BrandFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrandRoutingModule { }
