import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SerializedItemGridComponent } from "./serialised-item-grid.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SerializedItemGridComponent],
  exports: [SerializedItemGridComponent]
})
export class SerializeItemGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SerializeItemGridModule,
    };
  }
}
