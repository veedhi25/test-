import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TaxGroupTableComponent } from './TaxGroupTable.component';
import { TaxGroupComponent } from './TaxGroup.component';

const routes: Routes = [
    { path: '', component: TaxGroupTableComponent },
    { path: 'addTaxGroup', component: TaxGroupComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaxRoutingModule { }
