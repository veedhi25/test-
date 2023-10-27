import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { DepartmentVsCategoryComponent } from "./departmentvscategories.component";
import { DepartmentVsCategoryRoutingModule } from "./departmentvscategories.routing";


  

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DepartmentVsCategoryRoutingModule,
    GenericPopupGridModule.forRoot(),
   
  ],
  declarations: [
    DepartmentVsCategoryComponent
  ],
})
export class DepartmentVsCategoryModule { }
