import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { ModalModule } from "ng2-bootstrap";
import { GeographicalHierarchyRoutingModule } from "./geographical-hierarchy.routing";
import { GeographicalHierarchyListComponent } from "./geographical-hierarchy-list.component";
import { GeographicalHierarchyComponent } from "./geographical-hierarchy.component";




@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeographicalHierarchyRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule
  ],
  declarations: [
    GeographicalHierarchyListComponent,
    GeographicalHierarchyComponent,
    
  ],
})
export class GeographicalHierarchyModule { }
