import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { CustomerWiseMaxQuantityRoutingModule } from "./customerwisemaxqty.routing";
import { CustomerWiseMaxQuantityListComponent } from "./customerwisemaxqtylist.component";
import { CustomerWiseMaxQuantityComponent } from "./customerwisemaxqty.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerWiseMaxQuantityRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule

  ],
  declarations: [
    CustomerWiseMaxQuantityComponent,
    CustomerWiseMaxQuantityListComponent
  ],
})
export class CustomerWisemaxQuantityModule { }
