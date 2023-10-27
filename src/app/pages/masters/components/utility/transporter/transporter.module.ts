import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "../../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { TransporterRoutingModule } from "./transporter.routing";
import { TransporterComponent } from "./transporter.component";
import { TransporterListComponent } from "./transporter-list.component";
import { TransporterService } from "./transporter.service";
import { NgaModule } from "../../../../../theme/nga.module";
import { IMSGridModule } from "../../../../../common/ims-grid/ims-grid.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TransporterRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
    IMSGridModule.forRoot()

  ],
  declarations: [
    TransporterComponent,
    TransporterListComponent
  ],
  providers: [TransporterService]
})
export class TransporterModule { }
