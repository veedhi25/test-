import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { SalesAreaRoutingModule } from "./sales-area.routing";
import { SalesAreaHeirarchyListComponent } from "../SalesAreaHeirarchy/SalesAreaHeirarchyList";
import { SalesAreaFormComponent } from "../SalesAreaHeirarchy/SalesAreaHeirarchyEntry";
import { SalesAreaTypeService } from "./sales-area-type.service";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SalesAreaRoutingModule,
    NgaModule,
    Ng2SmartTableModule
  ],
  declarations: [
    SalesAreaFormComponent,
    SalesAreaHeirarchyListComponent
  ],
  providers:[SalesAreaTypeService]
})
export class SalesAreaModule { }
