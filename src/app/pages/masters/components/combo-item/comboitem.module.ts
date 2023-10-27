import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ComboItemComponent } from "./comboitem.component";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";
import { ComboItemService } from "./comboitem.service";
import { ComboItemRoutingModule } from "./comboitem.routing";

  

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComboItemRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    TransactionModule,
   
  ],
  declarations: [
    ComboItemComponent
  ],
  providers:[ComboItemService, TransactionService]
})
export class ComboItemModule { }
