import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";
import { MasterRepo } from "../../repositories";
import { NgaModule } from "../../../theme/nga.module";
import { NgxPaginationModule } from "ngx-pagination";
import { AccountGroupPopUpComponent } from "./account-group-popup-grid.component";
import { FilterPipe, SortByPipe } from "../../../theme/directives/pipes/pipes";

@NgModule({
  imports: [
    CommonModule,

    ModalModule.forRoot(),
    NgaModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [AccountGroupPopUpComponent],
  exports: [AccountGroupPopUpComponent]
})
export class AccountGroupPopupGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AccountGroupPopupGridModule,
      providers: [MasterRepo]
    };
  }
}
