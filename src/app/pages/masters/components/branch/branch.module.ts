import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { BranchRoutingModule } from "./branch.routing";
import { BranchListComponent } from "./branch-list.component";
import { BranchComponent } from "./branch.component";
import { ModalModule } from "ngx-bootstrap";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BranchRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
    ModalModule
  ],
  declarations: [
    BranchListComponent,
    BranchComponent
  ],
})
export class BranchModule { }
