import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IMSGridComponent } from "./ims-grid.component";
import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IMSReportColumnFormatComponent } from "./ims-report-column-format.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  declarations: [IMSReportColumnFormatComponent],
  exports: [IMSReportColumnFormatComponent]
})
export class IMSReportColumnFormatModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IMSReportColumnFormatModule
    };
  }
}
