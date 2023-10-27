import { Routes, RouterModule }  from '@angular/router';

import { WMSComponent } from './wms.component';
import { GatePassComponent } from './components/gate-pass/gate-pass.component';
import { CanActivateTeam } from '../../common/services/permission';
import { MRComponent } from './components/mr/addmr';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: WMSComponent,
    children: [
      { path: 'gate-pass', component: GatePassComponent,
        canActivate: [CanActivateTeam]
      },
      { path: 'mr', component: MRComponent,
        canActivate: [CanActivateTeam]
      }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
