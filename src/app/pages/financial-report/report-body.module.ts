import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportBodyComponent } from "./report-body.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [ReportBodyComponent],
  exports: [ReportBodyComponent]
})
export class ReportBodyModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ReportBodyModule,
    };
  }
}
