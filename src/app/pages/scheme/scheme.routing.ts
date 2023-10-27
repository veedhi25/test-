import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SchemeComponent } from './scheme-form/SchemeMaster.component';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { TabelComponent } from './schedule/tableSchedule.component';
import { CanActivateTeam } from '../../common/services/permission';
import { scheduleComponent } from './schedule/schedule.component';
import { SchemeVsBudgetComponent } from './schemvsbudget/schemevsbudget.component';
import { SchemeVsBudgetComponentList } from './schemvsbudget/schemevsbudgetlist.component';




const routes: Routes = [
  { path: 'schemeList', component: SchemeListComponent },
  { path: 'add-scheme', component: SchemeComponent },
  { path: "schedule", component: scheduleComponent },
  {
    path: "scheduleTable",
    component: TabelComponent,
    canActivate: [CanActivateTeam]
  },
  {
    path: "scheduleTable/add-schedule",
    component: scheduleComponent,
    canActivate: [CanActivateTeam]
  },
  {
    path: "schemebudgetlist",
    component: SchemeVsBudgetComponentList,
    canActivate: [CanActivateTeam]
  },
  {
    path: "schemebudget",
    component: SchemeVsBudgetComponent,
    canActivate: [CanActivateTeam]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemeRoutingModule { }
