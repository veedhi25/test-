import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { CustomerItemMappingComponent } from "./customer-item-mapping.component";
import { CustomerItemMappingRoutingModule } from "./customer-item-mapping.routing";
import { NgaModule } from "../../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerItemMappingRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule

  ],
  declarations: [
    CustomerItemMappingComponent,
  ],
})
export class CustomerItemMappingModule { }
