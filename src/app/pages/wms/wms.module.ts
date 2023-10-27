import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './wms.routing';

import { RatingModule } from 'ng2-bootstrap';
import { WMSComponent } from './wms.component';
import { GatePassComponent } from './components/gate-pass/gate-pass.component';
import { Layouts } from './components/layouts';
import { RouterModule } from '@angular/router';
import { CanActivateTeam } from '../../common/services/permission';
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { MasterRepo } from '../../common/repositories';
import { PurchaseService } from '../Purchases/components/purchase.service';
import { MRComponent } from './components/mr/addmr';
import { TransactionModule } from '../../common/Transaction Components/transaction.module';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { FileUploaderPopupModule } from '../../common/popupLists/file-uploader/file-uploader-popup.module';
import { DynamicFilterOptionModule } from '../../common/popupLists/dynamic-filter-option-popup/dynamic-filter-option-popup.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UserWiseTransactionFormConfigurationModule } from '../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFormsModule,
    TransactionModule,
    NgaModule,
    GenericPopupGridModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    DynamicFilterOptionModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    routing,
    UserWiseTransactionFormConfigurationModule.forRoot()
  ],
  declarations: [
    WMSComponent,
    GatePassComponent,
    MRComponent
  ], providers: [
    CanActivateTeam,
    TransactionService,
    MasterRepo,PurchaseService
  ]
})
export class WMSModule {
}
