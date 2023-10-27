import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SchemeViewRoutingModule } from "./scheme-view.routing.module";
import { SchemeViewComponent } from "./scheme-view.component";
import { SchemeViewService } from "./scheme-view.service";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SchemeViewRoutingModule,
    GenericPopupGridModule.forRoot()
  ],
  declarations: [
    SchemeViewComponent
  ],
  providers:[SchemeViewService]
})
export class SchemeViewModule { 

}
