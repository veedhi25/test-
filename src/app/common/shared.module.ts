import { NgModule, ModuleWithProviders } from "@angular/core";
import { OnlyNumber } from "./directives/onlynumber.directive";
import { FilterPipe } from "./pipes/data-modifier.pipe";
import { ControlShowHide } from "./pipes/formControl.pipe";

@NgModule({
  declarations: [OnlyNumber,ControlShowHide,FilterPipe],
  exports: [OnlyNumber,ControlShowHide,FilterPipe]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
    };
  }
}

