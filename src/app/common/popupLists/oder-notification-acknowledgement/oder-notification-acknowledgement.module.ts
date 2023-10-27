import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MasterRepo } from "../../repositories";
import { NgaModule } from "../../../theme/nga.module";
import { OrderNotificationAcknowledgementComponent } from "./oder-notification-acknowledgement.component";

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
  ],
  declarations: [OrderNotificationAcknowledgementComponent],
  exports: [OrderNotificationAcknowledgementComponent]
})
export class OrderNotificationAcknowledgementModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OrderNotificationAcknowledgementModule,
      providers: [MasterRepo]
    };
  }
}
