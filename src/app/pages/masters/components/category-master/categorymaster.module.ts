import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { TransactionModule } from "../../../../common/Transaction Components/transaction.module";

import { CategoryMasterComponent } from "./categorymaster.component";
import { CategoryMasterRoutingModule } from "./categorymaster.routing";
import { CategoryMasterService } from "./categorymaster.service";
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";

  

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryMasterRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    TransactionModule,
    FileUploaderPopupModule.forRoot()
   
  ],
  declarations: [
    CategoryMasterComponent
  ],
  providers:[CategoryMasterService, TransactionService]
})
export class CategoryMasterModule { }
