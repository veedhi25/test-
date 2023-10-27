import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { CanActivateTeam } from '../../common/services/permission/guard.service'
import { ModalModule } from 'ng2-bootstrap';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { from } from 'rxjs/observable/from';import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { DynamicFormModule } from '../../common/dynamicreportparam/dynamicreportparam.module';
import { misrouting } from './MisReports.routing';
import { MISReportsComponent } from './MISReports.component';
import { OutletTrackingComponent } from './components/outlet-tracking-report/outlet-tracking-report.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    misrouting,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    AutoCompleteModule,
    
    NgxDaterangepickerMd.forRoot(),
    GenericPopupGridModule.forRoot(),
    DynamicFormModule

  ],
  declarations:
    [
      // DateSelectionControl,
      MISReportsComponent,
      OutletTrackingComponent
    ],
  providers: [
    CanActivateTeam,
  ],
  entryComponents:[]
})
export class MISReportsModule {
}
