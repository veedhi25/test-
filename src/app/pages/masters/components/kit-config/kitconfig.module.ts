import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { KitConfigService } from "./kitconfig.service";
import { KitConfigComponent } from "./kitconfig.component";
import { KitConfigRoutingModule } from "./kitconfig.routing";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";
import { popupListModule } from "../../../../common/popupLists/popuplist.module";

  

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KitConfigRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    TransactionModule,
    popupListModule
   
  ],
  declarations: [
    KitConfigComponent,
    
  ],
  providers:[KitConfigService, TransactionService]
})
export class KitConfigModule { }
