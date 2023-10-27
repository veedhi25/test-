import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatrixItemGridComponent } from "./matrix-item-grid.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule.forRoot()
  ],
  declarations: [MatrixItemGridComponent],
  exports: [MatrixItemGridComponent]
})
export class MatrixItemGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MatrixItemGridModule,
    };
  }
}
