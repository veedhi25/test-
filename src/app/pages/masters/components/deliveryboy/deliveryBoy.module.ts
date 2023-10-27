import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { ModalModule } from "ng2-bootstrap";
import { AddDeliveryBoyComponent } from "./addDeliveryBoy.component";
import { DeliveryBoyComponent } from "./deliveryBoy.component";
import { DeliveryBoyRouting } from "./deliveryBoy.routing";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";


@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeliveryBoyRouting,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule,
    IMSGridModule.forRoot()

  ],
  declarations: [
    AddDeliveryBoyComponent,
    DeliveryBoyComponent
  ],
})
export class DeliveryBoyModule { }