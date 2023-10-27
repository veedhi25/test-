import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../../../theme/nga.module";
import { StateFormComponent } from "./StateEntry";
import { StateListComponent } from "./StateList";
import { StateRoutingModule } from "./state.routing";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StateRoutingModule,
    NgaModule,
    Ng2SmartTableModule
  ],
  declarations: [
    StateListComponent,
    StateFormComponent
  ],
})
export class StateModule { }
