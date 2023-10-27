import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { DeliveryOrderTransferRoutingModule } from "./delivery-order-transfer.routing";
import { DeliveryOrderTransferComponent } from "./delivery-order-transfer.component";
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeliveryOrderTransferRoutingModule,
    FileUploaderPopupModule.forRoot()

  ],
  declarations: [
    DeliveryOrderTransferComponent
  ],
  providers: [TransactionService],

})
export class DeliveryOrderTransferModule { }
