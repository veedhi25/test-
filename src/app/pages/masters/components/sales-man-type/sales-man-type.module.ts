import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ModalModule } from "ngx-bootstrap";
import { SalesManTypeRoutingModule } from "./sales-man-type.routing";
import { SalesManTypeListComponent } from "./sales-man-type-list.component";
import { SalesManTypeActionComponent } from "./sales-man-type-action/sales-man-type-action.component";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SalesManTypeRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),

  ],
  declarations: [
    SalesManTypeListComponent,
    SalesManTypeActionComponent
  ],
})
export class SalesManTypeModule { }
