import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { TaxSlabComponent } from "./taxslab.component";
import { TaxSlabRoutingModule } from "./taxslab.routing";

  

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaxSlabRoutingModule,
    GenericPopupGridModule.forRoot()
  ],
  declarations: [
    TaxSlabComponent,
    
  ],
})
export class TaxslabModule { }
