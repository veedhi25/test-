import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";
import { GenericStaticPopUpComponent } from "./genericGrid_popUp_static.component";
import { MasterRepo } from "../../repositories";
import { NgaModule } from "../../../theme/nga.module";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [GenericStaticPopUpComponent],
  exports: [GenericStaticPopUpComponent]
})
export class GenericStaticPopupGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GenericStaticPopupGridModule,
      providers: [MasterRepo]
    };
  }
}
