import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ModalModule } from "ngx-bootstrap";
import { SalesManRoutingModule } from "./sales-man.routing";
import { SalesmanComponent } from "./Saleman.component";
import { FormSalemanComponent } from "./FormSaleman.component";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SalesManRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    IMSGridModule.forRoot(),

  ],
  declarations: [
    SalesmanComponent,
    FormSalemanComponent
  ],
})
export class SalesManModule { }
