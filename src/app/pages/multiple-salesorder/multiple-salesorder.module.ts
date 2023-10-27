import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { MultiSalesOrderComponent } from "./multiple-salesorder.component";
import { MultiSalesOrderRoutingModule } from "./multiple-salesorder.routing";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    MultiSalesOrderRoutingModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  declarations: [
    MultiSalesOrderComponent  ],
  providers:[TransactionService]
})
export class MultiSalesOrderModule { }
