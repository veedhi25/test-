import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { TenderTypeRoutingModule } from "./tender-type.routing";
import { NgaModule } from "../../../../theme/nga.module";
import { TenderTypeComponent } from "./add-tender-type/add-tender-type.component";
import { TenderTypeListComponent } from "./tender-type-list.component";
import { TenderTypeService } from "./tender-type.service";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TenderTypeRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
    IMSGridModule.forRoot()

  ],
  declarations: [
    TenderTypeComponent,
    TenderTypeListComponent
  ],
  providers: [TenderTypeService]
})
export class TenderTypeModule { }
