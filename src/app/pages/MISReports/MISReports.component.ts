import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ReportMainSerVice, ReportStore } from './Report.service';
import { MasterRepo } from '../../common/repositories';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { ColumnConfiguration } from '../../common/dynamicreportparam/dynamicreportparam.component';


@Component({
    selector: 'misreports',
    template: `<router-outlet></router-outlet>
    `
})

export class MISReportsComponent {
    public allDSM: any[] = [];
    public allBEAT: any[] = [];
    public allCUSTOMER: any[] = [];
    public allSUPPLIER: any[] = [];



    constructor(private router: Router, public masterService: MasterRepo, private fb: FormBuilder) {
        //D
    }


}