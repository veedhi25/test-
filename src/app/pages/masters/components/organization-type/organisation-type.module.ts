import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { OrganizationTypeListComponent } from "./organization-type-list.component";
import { OrganizationTypeFormComponent } from "./add-organization-type/organization-type.component";
import { OrganisationTypeRoutingModule } from "./organisation-type.routing";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrganisationTypeRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    OrganizationTypeFormComponent,
    OrganizationTypeListComponent,
    
  ],
})
export class OrganisationTypeModule { }
