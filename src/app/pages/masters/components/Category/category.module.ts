import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { CategoryRoutingModule } from "./category.routing";
import { CategoryListComponent } from "./categoryList.component";
import { CategoryFormComponent } from "./categoryForm.component";
import { ModalModule } from "ngx-bootstrap";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CategoryRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule
  ],
  declarations: [
    CategoryListComponent,
    CategoryFormComponent
  ],
})
export class CategoryModule { }
