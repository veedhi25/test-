import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { PLedgerComponent } from "./PLedger.component";
import { SupplierLedgerComponent } from "./SupplierLedger.component";
import { CustomerLedgerComponent } from "./CustomerLedger.component";
import { PartyLedgerRoutingModule } from "./pledger.routing";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { pLedgerTableComponent } from "./PLedgerTable.component";
import { PLedgerservice } from "./PLedger.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { SuppliervsItemComponent } from "./suppliervsitem.component";
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";
import { ResolveMasterFormData } from "../../../../common/repositories/ResolveMasterFormData.service";
import { SharedModule } from "../../../../common/shared.module";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";


@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PartyLedgerRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    FileUploaderPopupModule.forRoot(),    
    SharedModule.forRoot(),
    IMSGridModule.forRoot()
  ],
  declarations: [
    PLedgerComponent,
    SupplierLedgerComponent,
    CustomerLedgerComponent,
    pLedgerTableComponent,
    SuppliervsItemComponent
  ],
  providers: [PLedgerservice, TransactionService, ResolveMasterFormData],

})
export class PartyLedgerModule { }
