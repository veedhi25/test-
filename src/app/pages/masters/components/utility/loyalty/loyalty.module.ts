import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "../../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { LoyaltyRoutingModule } from "./loyalty.routing";
import { LoyaltyComponent } from "./loyalty.component";
import { LoyaltyListComponent } from "./loyalty-list.component";

import { NgaModule } from "../../../../../theme/nga.module";
import { FileUploaderPopupModule } from "../../../../../common/popupLists/file-uploader/file-uploader-popup.module";
import { TransactionService } from "../../../../../common/Transaction Components/transaction.service";
import {AngularMultiSelectModule} from '../../../../../node_modules/angular4-multiselect-dropdown'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoyaltyRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
    FileUploaderPopupModule.forRoot(),
    AngularMultiSelectModule,


  ],
  declarations: [
    LoyaltyComponent,
    LoyaltyListComponent
  ],
  providers:[TransactionService]
})
export class LoyaltyModule { }
