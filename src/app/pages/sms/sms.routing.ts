import { Routes, RouterModule } from '@angular/router';

import { SMSComponent } from './sms.component';
import { CanActivateTeam } from '../../common/services/permission';
import { CustTempComponent } from './components/cust-template/cust-template.component';
import { EmpTempComponent } from './components/emp-template/emp-template.component';
import { QuickEmailComponent } from './components/Quick-email/quick-email.component';
import { QuickMsgComponent } from './components/Quick-message/quick-msg.component';
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
import { ReportSchedulerComponent } from './components/report-scheduler/report-scheduler.component';
import { ReportSchedulerDetails } from './components/report-scheduler/reportschedulerDetails.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: SMSComponent,
    children: [
      {
        path: 'quick-message', component: QuickMsgComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'quick-email', component: QuickEmailComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'cust-template', component: CustTempComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'emp-template', component: EmpTempComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'sms-delivery', component: SMSDeliveryComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'sms-failed', component: SMSFailedComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'email-delivery', component: EmailDeliveryComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'email-failed', component: EmailFailedComponent,
        canActivate: [CanActivateTeam]
      },

      {
        path: 'schedule-email', component: ScheduleEmailComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'schedule-message', component: ScheduleMsgComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'custom-message', component: CustomMessageComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'outlet-master', component: OutletMasterComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'category-master', component: CategoryMasterComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'custom-email', component: CustomEmailComponent,
        canActivate: [CanActivateTeam]
      },

      {
        path: 'quick-schedule-msg', component: QuickSchedulerMsgComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'quick-schedule-email', component: QuickScheduleEmailComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'custom-email', component: CustomEmailComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'quick-schedule-msg', component: QuickSchedulerMsgComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'quick-schedule-email', component: QuickScheduleEmailComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'reportscheduler', component: ReportSchedulerComponent,
        canActivate: [CanActivateTeam]
      },
      {
        path: 'reportschedulerlisting', component: ReportSchedulerDetails,
        canActivate: [CanActivateTeam]
      },

    ]
  }
];

export const routing = RouterModule.forChild(routes);
