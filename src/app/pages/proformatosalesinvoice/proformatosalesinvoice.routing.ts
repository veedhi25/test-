import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProformaToTaxInvoiceComponent } from './proformatosalesinvoice.component';


const routes: Routes = [
    { path: '', component: ProformaToTaxInvoiceComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class proformaToSalesInvoiceRoutingModule { }
