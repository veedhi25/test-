import {NgModule} from '@angular/core';
import  {TabelComponent} from './tableSchedule.component';
import {scheduleComponent} from './schedule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from "../../../../theme/nga.module";
import { CommonModule } from "@angular/common";
import { TreeModule } from "angular-tree-component";
import { CalendarModule } from "primeng/components/calendar/calendar";
import {ModalModule} from "ngx-bootstrap";
import { routing } from "./schedule-routing.module";
import { SearchPipe } from './search.pipe';
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
    declarations: [TabelComponent, scheduleComponent, SearchPipe],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        routing,
        NgaModule,
        TreeModule,
        ModalModule.forRoot(),
        NgxPaginationModule
    ],
    providers: []
})

export class ScheduleModule{}