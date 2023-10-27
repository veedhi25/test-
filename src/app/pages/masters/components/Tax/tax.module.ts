import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { TaxRoutingModule } from "./tax.routing";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { TaxGroupTableComponent } from "./TaxGroupTable.component";
import { TaxGroupComponent } from "./TaxGroup.component";
import { TaxGroupService } from "./TaxService";
import { popupListModule } from "../../../../common/popupLists/popuplist.module";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaxRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    popupListModule
  ],
  declarations: [
    TaxGroupTableComponent,
    TaxGroupComponent,
    
  ],
  providers:[TaxGroupService]
})
export class TaxModule { }
