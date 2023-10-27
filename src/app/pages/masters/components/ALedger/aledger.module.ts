import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgaModule } from "../../../../theme/nga.module";
import { AledgerRoutingModule } from "./aledger.routing";
import { ALedgerComponent } from "./ALedger.component";
import { ALedgerTableComponent } from "./ALedgerTable.component";
import { PendingChangesGuard } from "../../../../common/services/guard/can-navigate.guard";
import { AccountGroupPopupGridModule } from "../../../../common/popupLists/AGroupPopup/account-group-popup-grid.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AledgerRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
    AccountGroupPopupGridModule.forRoot()

  ],
  declarations: [
    ALedgerComponent,
    ALedgerTableComponent,
  ],
  providers:[PendingChangesGuard]
})
export class AledgerModule { }
