import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";
import { NgaModule } from "../../../theme/nga.module";
import { NgxPaginationModule } from "ngx-pagination";
import { PopupClientSidePaginatedComponent } from "./popupClientSidePaginated";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [PopupClientSidePaginatedComponent],
  exports: [PopupClientSidePaginatedComponent]
})
export class PopUpClinetSidePaginatedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PopUpClinetSidePaginatedModule,
    };
  }
}
