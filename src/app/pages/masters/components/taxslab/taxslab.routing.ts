import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TaxSlabComponent } from './taxslab.component';



const routes: Routes = [
    { path: '', component: TaxSlabComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaxSlabRoutingModule { }
