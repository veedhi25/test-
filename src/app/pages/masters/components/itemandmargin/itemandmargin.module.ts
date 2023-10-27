import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";
import { ItemAndMarginRoutingModule } from "./itemandmargin.routing";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { ItemAndMarginComponent } from "./itemandmargin.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemAndMarginRoutingModule,
    FileUploaderPopupModule.forRoot()

  ],
  declarations: [
    ItemAndMarginComponent
  ],
  providers: [TransactionService],

})
export class ItemAndMarginrModule { }
