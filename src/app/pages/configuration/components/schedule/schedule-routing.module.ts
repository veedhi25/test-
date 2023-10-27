import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabelComponent } from './tableSchedule.component';
import { scheduleComponent } from './schedule.component';

const routes: Routes = [
    
    {path: '', component: TabelComponent},
    {path: 'add-schedule', component: scheduleComponent}
]

// @NgModule({
//     imports: [RouterModule.forChild(routes)],
//     declarations: [TabelComponent, scheduleComponent],
//     exports: [RouterModule]
// })

export const routing = RouterModule.forChild(routes);