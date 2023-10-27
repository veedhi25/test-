import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";

import { hcategorymasterComponent } from "./hcategorymaster.component";
import { hcategorymasterService } from "./hcategorymaster.service";
import { hcategorymasterRoutingModule } from "./hcategorymaster.routing";

@NgModule({
    imports: [
      TreeModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      hcategorymasterRoutingModule,
      GenericPopupGridModule.forRoot(),
      NgaModule,
      TransactionModule,
     
    ],
    declarations: [
      hcategorymasterComponent
    ],
    providers:[hcategorymasterService, TransactionService]
  })
  export class hcategorymasterModule { }