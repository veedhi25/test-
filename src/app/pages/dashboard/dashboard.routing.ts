import { Routes, RouterModule }  from '@angular/router';
import {CanActivateTeam} from '../../common/services/permission/guard.service'
import { Dashboard } from './dashboard.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      { path: 'dashboard', component: Dashboard }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
