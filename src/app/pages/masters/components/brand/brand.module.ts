import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { BrandRoutingModule } from "./brand.routing";
import { BrandListComponent } from "./brand-list.component";
import { BrandFormComponent } from "./add-new-brand/add-brand.component";



@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrandRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    BrandListComponent,
    BrandFormComponent,
    
  ],
})
export class BrandModule { }
