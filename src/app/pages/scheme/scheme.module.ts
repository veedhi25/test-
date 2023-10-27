// import { SharedModule } from '../../../../common/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalModule} from 'ng2-bootstrap';
import { SchemeRoutingModule } from './scheme.routing';
import { SchemeComponent } from './scheme-form/SchemeMaster.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoplistComponent } from './PopItemList/PopItems.component';
// import { GenericPopupGridModule } from '@app/common/popup/generic-grid/generic-popup-grid.module';
// import {MatDialogModule} from '@angular/material/dialog';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { SchemeTableComponent } from './scheme-form/schemeTable.component';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { scheduleComponent } from './schedule/schedule.component';
import { TabelComponent } from './schedule/tableSchedule.component';
import {NgaModule} from '../../theme/nga.module';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { SearchPipe } from './scheme-list/search.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopUpClinetSidePaginatedModule } from '../../common/popupLists/popupClientSidePaginated/popupClientSidePaginated.module';
import {AngularMultiSelectModule} from '../../node_modules/angular4-multiselect-dropdown'
import { SchemeVsBudgetComponent } from './schemvsbudget/schemevsbudget.component';
import { SchemeVsBudgetComponentList } from './schemvsbudget/schemevsbudgetlist.component';
import {Ng2SmartTableModule} from '../../node_modules/ng2-smart-table/src/ng2-smart-table.module'
  @NgModule({
    declarations: [
      SchemeComponent, 
      PoplistComponent,
      SchemeListComponent,
      SchemeTableComponent,
      scheduleComponent,
      TabelComponent,
      SchemeVsBudgetComponent,
      SchemeVsBudgetComponentList,
      SearchPipe

    ],
    imports: [
      CommonModule,
      NgaModule,
      SchemeRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      GenericPopupGridModule.forRoot(),
      Ng2SmartTableModule,
      CalendarModule,
      ModalModule.forRoot(),
      NgxPaginationModule,
      PopUpClinetSidePaginatedModule.forRoot(),
      AngularMultiSelectModule,
      Ng2SmartTableModule
            
     
    ],
    providers: [
    ]
  })
  export class SchemeModule {
   }