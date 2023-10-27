import { MasterRepo } from "../../repositories";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReportFilterComponent } from "./report-filter.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    NguiAutoCompleteModule
 
  
  ],
  declarations: [ReportFilterComponent],
  providers:[MasterRepo],
  exports: [ReportFilterComponent]
})
export class ReportFilterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ReportFilterModule,
      providers: [MasterRepo]
    };
  }
}
