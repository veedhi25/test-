import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { ProformaToTaxInvoiceComponent } from "./proformatosalesinvoice.component";
import { proformaToSalesInvoiceRoutingModule } from "./proformatosalesinvoice.routing";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    proformaToSalesInvoiceRoutingModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  declarations: [
    ProformaToTaxInvoiceComponent  ],
  providers:[TransactionService]
})
export class proformaToSalesInvoiceModule { }
