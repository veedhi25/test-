import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { BatchPriceRoutingModule } from "./batch-price.routing";
import { BatchFormComponent } from "./BatchPriceEntry";
import { BatchPriceListComponent } from "./BatchPriceList";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BatchPriceRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
    GenericPopupGridModule.forRoot(),

  ],
  declarations: [
    BatchFormComponent,
    BatchPriceListComponent
  ],
})
export class BatchPriceModule { }
