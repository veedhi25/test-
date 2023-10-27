import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ReportsComponent } from './Reports.component';
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { ReportMain } from './components/ReportMain/ReportMain';
import { Component } from '@angular/core';
import { CrateReportComponent } from '../ReportDialogs/crateReport/crateReport.component';
import { LoyaltyReport } from '../ReportDialogs/loyalty-report/loyalty-report.component';
import { MISReportsComponent } from './MISReports.component';
import { OutletTrackingComponent } from './components/outlet-tracking-report/outlet-tracking-report.component';

const routes: Routes = [
    {
        path: '',
        component: MISReportsComponent,
        children: [
            
             { path: 'outlettracking', component: OutletTrackingComponent, canActivate: [CanActivateTeam] },

        ]
    }
];

export const misrouting = RouterModule.forChild(routes);
