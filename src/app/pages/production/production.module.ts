import { NgModule } from '@angular/core';
import { NgaModule } from '../../theme/nga.module';
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { BOMComponent } from './components/bom/bom.component';
import { ProductionComponent } from './production.component';
import { ProductionEntryComponent } from './components/production-entry/production-entry.component';
import { ProductionQualityCheckComponent } from './components/production-quality-check/production-quality-check.component';
import { productionrouting } from './production.routing';
import { ProductionTargetComponent } from './components/production-target/production-target.component';



@NgModule({
  imports: [
    NgaModule,
    productionrouting,
    NgxPaginationModule,
    GenericPopupGridModule.forRoot(),
    TransactionModule,
  ],
  declarations: [
    ProductionComponent,
    BOMComponent,
    ProductionEntryComponent,
    ProductionQualityCheckComponent,
    ProductionTargetComponent

  ],

  providers: [CanActivateTeam, TransactionService]

})
export class ProductionModule {
}
