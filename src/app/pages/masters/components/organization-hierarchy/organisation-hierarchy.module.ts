import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ModalModule } from "ngx-bootstrap";
import { OrganisationHeirarchyRoutingModule } from "./organisation-hierarchy.routing";
import { OrganizationHierarchyFormComponent } from "./add-organization-hierarchy/add-organization-hierarchy.component";
import { OrganizationHierarchyListComponent } from "./organization-hierarchy-list.component";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrganisationHeirarchyRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),

  ],
  declarations: [
    OrganizationHierarchyFormComponent,
    OrganizationHierarchyListComponent
  ],
})
export class OrganisationHeirarchyModule { }
