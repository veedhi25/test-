import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePickerComponent } from "./date-picker-custom.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent]
})
export class DatePickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DatePickerModule,
    };
  }
}
