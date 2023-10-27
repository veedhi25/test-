import { NgModule } from '@angular/core';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './inventory.routing';
import { Inventory } from './inventory.component';
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { BranchOutComponent } from "./components/branch-out/branch-out.component";
import { StockIssueComponent } from "./components/stock-issue/stock-issue.component";
import { BranchInComponent } from "./components/branch-in/branch-in.component";
import { StockSettlementComponent } from './components/stock-settlement/stockSettlement.component';
import { OpeningStockEntryComponent } from './components/openingStockEntry/openingStockEntry';
import { RepackEntryComponent } from './components/repackEntry/repackEntry.component';
import { FileUploaderPopupModule } from '../../common/popupLists/file-uploader/file-uploader-popup.module';


@NgModule({
  imports: [
    NgaModule,
    routing,
    NgxPaginationModule,
    GenericPopupGridModule.forRoot(),
    TransactionModule,
    FileUploaderPopupModule.forRoot(),
  ],
  declarations: [
    Inventory,
    StockIssueComponent,
    BranchInComponent,
    BranchOutComponent,
    StockSettlementComponent,
    OpeningStockEntryComponent,
    RepackEntryComponent

  ],

  providers: [CanActivateTeam, TransactionService]

})
export class InventoryModule {
}
