import { NgModule } from '@angular/core';
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { NgaModule } from '../../theme/nga.module';
import { routing } from './reorders.routing';

import { CanActivateTeam } from '../../common/services/permission/guard.service'

import { ModalModule } from 'ng2-bootstrap';
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { FileUploaderPopupModule } from '../../common/popupLists/file-uploader/file-uploader-popup.module';
import { DynamicFilterOptionModule } from '../../common/popupLists/dynamic-filter-option-popup/dynamic-filter-option-popup.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { Reorders } from './reorders.component';
import { ReorderComponent } from './components/reorder/reorder.component';
 

@NgModule({
  imports: [
    NgaModule,
    routing,
    // ModalModule.forRoot(),
    TransactionModule,
    GenericPopupGridModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    DynamicFilterOptionModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
  ],
  declarations: [
    Reorders,
    ReorderComponent
  ],
  providers: [
    CanActivateTeam, TransactionService,
  ]
})
export class ReordersModules {
}
