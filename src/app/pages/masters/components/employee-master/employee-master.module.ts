import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table";
import { EmployeeMasterRoutingModule } from "./employee-master.routing";
import { EmployeeMasterComponent } from "./employee-master.component";
import { EmployeeMasterListComponent } from "./employee-master-list.component";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    EmployeeMasterRoutingModule,
    IMSGridModule.forRoot()
  ],
  declarations: [
    EmployeeMasterComponent,
    EmployeeMasterListComponent
  ],

})
export class EmployeeMasterModule { }
