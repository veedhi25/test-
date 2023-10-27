import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { ModalModule } from "ng2-bootstrap";

import { Divisions } from "./divisions.component";
import { AddDivision } from "./addDivision.component";
import { divisonRoutingModule } from "./divisions.routing";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";


@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    divisonRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule,
    IMSGridModule.forRoot()
  ],
  declarations: [
    AddDivision,
    Divisions
  ],
})
export class DivisonsModule { }