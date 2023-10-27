import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './sms.routing';
import { RatingModule } from 'ng2-bootstrap';
import { SMSComponent } from './sms.component';
import { Layouts } from './components/layouts';
import { RouterModule } from '@angular/router';
import { CanActivateTeam } from '../../common/services/permission';
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { MasterRepo } from '../../common/repositories';
import { PurchaseService } from '../Purchases/components/purchase.service';
import { TransactionModule } from '../../common/Transaction Components/transaction.module';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { FileUploaderPopupModule } from '../../common/popupLists/file-uploader/file-uploader-popup.module';
import { DynamicFilterOptionModule } from '../../common/popupLists/dynamic-filter-option-popup/dynamic-filter-option-popup.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ModalModule } from 'ng2-bootstrap';
import { AddUserService } from '../userManager/components/userManger/adduser.service';
import { CustTempComponent } from './components/cust-template/cust-template.component';
import { EmpTempComponent } from './components/emp-template/emp-template.component';
import { DeliveryDetailComponent } from './components/delivery-details/delivery-details.component';
import { FailedDetailsComponent } from './components/failed-details/failed-details.component';
import { QuickMsgComponent } from './components/Quick-message/quick-msg.component';
import { QuickEmailComponent } from './components/Quick-email/quick-email.component';
import { SMSDeliveryComponent } from './components/sms-delivery/sms-delivery.component';
import { SMSFailedComponent } from './components/sms-failed/sms-failed.component';
import { EmailDeliveryComponent } from './components/email-delivery/email-delivery.component';
import { EmailFailedComponent } from './components/email-failed/email-failed.component';
import { ScheduleEmailComponent } from './components/schedule-email/schedule-email.component';
import { ScheduleMsgComponent } from './components/schedule-message/schedule-message.component';
import { CustomMessageComponent } from './components/custom-message/custom-message.component';
import { OutletMasterComponent } from './components/outlet-master/outlet-master.component';
import { CategoryMasterComponent } from './components/category-master/category-master.component';
import { CustomEmailComponent } from './components/custom-email/custom-email.component';
import { QuickSchedulerMsgComponent } from './components/quick-schedule-message/quick-schedule-msg.component';
import { QuickScheduleEmailComponent } from './components/quick-schedule-email/quick-schedule-email.component';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMultiSelectModule } from '../../node_modules/angular4-multiselect-dropdown/index'
import { ReportSchedulerComponent } from './components/report-scheduler/report-scheduler.component';
import { ReportSchedulerDetails } from './components/report-scheduler/reportschedulerDetails.component';

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
    ModalModule.forRoot(),
    routing,
    AngularMultiSelectModule,

  ],
  declarations: [
    SMSComponent,
    QuickEmailComponent,
    QuickMsgComponent,
    CustTempComponent,
    EmpTempComponent,
    SMSDeliveryComponent,
    SMSFailedComponent,
    EmailDeliveryComponent,
    EmailFailedComponent,

    ScheduleEmailComponent,
    ScheduleMsgComponent,
    CustomMessageComponent,
    OutletMasterComponent,
    CategoryMasterComponent,
    CustomEmailComponent,
    QuickSchedulerMsgComponent,
    QuickScheduleEmailComponent,
    ReportSchedulerComponent,
    ReportSchedulerDetails,

  ], providers: [
    CanActivateTeam,
    TransactionService,
    MasterRepo, PurchaseService, AddUserService
  ]
})
export class SMSModule {
}
