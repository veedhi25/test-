import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { PickingListComponent } from "./pickinglist.component";
import { pickinglistRoutingModule } from "./pickinglist.routing";
import { PrintInvoiceComponent } from "../../common/Invoice/print-invoice/print-invoice.component";
// import { ProformaToTaxInvoiceComponent } from "./proformatosalesinvoice.component";
// import { proformaToSalesInvoiceRoutingModule } from "./proformatosalesinvoice.routing";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    pickinglistRoutingModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  declarations: [
   PickingListComponent  ],
  providers:[TransactionService, PrintInvoiceComponent]
})
export class pickinglistModule { }