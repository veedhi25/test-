import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";

import { itemgroupmasterComponent } from "./itemgroupmaster.component";
import { ItemGroupMasterRoutingModule } from "./itemgroupmaster.routing";
import { ItemGroupMasterService } from "./itemgroupmaster.service";

@NgModule({
    imports: [
      TreeModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ItemGroupMasterRoutingModule,
      GenericPopupGridModule.forRoot(),
      NgaModule,
      TransactionModule,
     
    ],
    declarations: [
        itemgroupmasterComponent
    ],
    providers:[ItemGroupMasterService, TransactionService]
  })
  export class ItemgroupMasterModule { }