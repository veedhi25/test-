import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { SalesAreaTypeRoutingModule } from "./sales-area-type.routing";
import { SalesAreaTypeListComponent } from "./sales-area-list.component";
import { SalesAreaTypeFormComponent } from "./add-sales-area-type/add-sales-area.component";
import { SalesAreaTypeService } from "./sales-area-type.service";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SalesAreaTypeRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    SalesAreaTypeListComponent,
    SalesAreaTypeFormComponent,
  ],
  providers:[SalesAreaTypeService]

})
export class SalesAreaTypeModule { }
