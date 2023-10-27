import { NgModule } from "@angular/core";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgaModule } from "../../../../theme/nga.module";
import { TransferPartyLedgerComponent } from "./transferpartyledger.component";
import { TransferPartyLedgerTableComponent } from "./trasferpartyledgertable.component";
import { TransferPartyLedgerRoutingModule } from "./transferpartyledger.routing";
import { TransferPartyLedgerService } from "./transferpartyledger.service";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";

@NgModule({
  imports: [
    TransferPartyLedgerRoutingModule,
    NgaModule,
    Ng2SmartTableModule,
    GenericPopupGridModule.forRoot(),
    IMSGridModule.forRoot()

  ],
  declarations: [
    TransferPartyLedgerComponent,
    TransferPartyLedgerTableComponent
  ],

  providers: [TransferPartyLedgerService]
})
export class TransferPartyLedgerModule { }
