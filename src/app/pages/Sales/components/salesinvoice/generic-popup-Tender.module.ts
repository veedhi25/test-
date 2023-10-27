import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";

import { NgxPaginationModule } from "ngx-pagination";
import { GenericPopUpTenderComponent } from "./generic-popup-Tender.component";
import { NgaModule } from "../../../../theme/nga.module";
import { MasterRepo } from "../../../../common/repositories";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    GenericPopupGridModule.forRoot(),
  ],
  declarations: [GenericPopUpTenderComponent],
  exports: [GenericPopUpTenderComponent]
})
export class GenericPopupTenderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GenericPopupTenderModule,
      providers: [MasterRepo]
    };
  }
}
