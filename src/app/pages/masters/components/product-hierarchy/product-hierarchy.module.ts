import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { ModalModule } from "ng2-bootstrap";
import { ProductHierarchyRoutingModule } from "./product-hierarchy.routing";
import { ProductHierarchyComponent } from "./productHierarchy.component";
import { ProductHierarchyListComponent } from "./productHierarchyList.component";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductHierarchyRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule
  ],
  declarations: [
    ProductHierarchyComponent,
    ProductHierarchyListComponent,
    
  ],
})
export class ProductHierarchyModule { }
