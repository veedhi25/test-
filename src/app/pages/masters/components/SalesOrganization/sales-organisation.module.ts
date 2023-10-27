import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { SalesOrganisationRoutingModule } from "./sales-organisation.routing";
import { SalesOrganizationListComponent } from "./salesorganizationList.component";
import { SalesOrganization } from "./salesorganization.component";
import { ModalModule } from "ng2-bootstrap";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SalesOrganisationRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule
  ],
  declarations: [
    SalesOrganizationListComponent,
    SalesOrganization,
    
  ],
})
export class SalesOrganisationModule { }
