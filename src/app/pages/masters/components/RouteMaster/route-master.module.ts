import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { RouteMasterRoutingModule } from "./route-master.routing";
import { RouteMasterComponent } from "./route-master.component";
import { RouteMasterListComponent } from "./route-master-list.component";
import { ReportFilterModule } from "../../../../common/popupLists/report-filter/report-filter.module";
import { ReportBodyModule } from "../../../financial-report/report-body.module";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouteMasterRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ReportFilterModule.forRoot(),
    ReportBodyModule.forRoot()
  ],
  declarations: [
    RouteMasterListComponent,
    RouteMasterComponent
  ],
})
export class RouteMasterModule { }
