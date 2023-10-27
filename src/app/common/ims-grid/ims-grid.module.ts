import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IMSGridComponent } from "./ims-grid.component";
import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  declarations: [IMSGridComponent],
  exports: [IMSGridComponent]
})
export class IMSGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IMSGridModule
    };
  }
}
