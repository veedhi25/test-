import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { UnitFormComponent } from "./unitForm.component";
import { UnitListComponent } from "./unitList.component";
import { UnitService } from "./unit.service";
import { UnitRoutingModule } from "./unit.routing";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UnitRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule

  ],
  declarations: [
    UnitFormComponent,
    UnitListComponent
  ],
  providers:[UnitService]
})
export class UnitModule { }
