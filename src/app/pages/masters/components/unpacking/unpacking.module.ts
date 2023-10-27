import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";
import { popupListModule } from "../../../../common/popupLists/popuplist.module";
import { UnpackingComponent } from "./unpacking.component";
import { UnpackingService } from "./unpacking.service";
import { UnpackingRoutingModule } from "./unpacking.routing";

  

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UnpackingRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    TransactionModule,
    popupListModule
   
  ],
  declarations: [
    UnpackingComponent,
    
  ],
  providers:[UnpackingService, TransactionService]
})
export class UnpackingModule { }
