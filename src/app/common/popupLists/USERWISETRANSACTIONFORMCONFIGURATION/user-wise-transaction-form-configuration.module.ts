import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilterOptionFocus, UserWiseTransactionFormConfigurationComponent } from "./user-wise-transaction-form-configuration.component";
import { UserWiseTransactionFormConfigurationService } from "./user-wise-transaction-form-configuration.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [UserWiseTransactionFormConfigurationComponent,FilterOptionFocus],
  providers: [UserWiseTransactionFormConfigurationService],
  exports: [UserWiseTransactionFormConfigurationComponent,FilterOptionFocus]
})
export class UserWiseTransactionFormConfigurationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserWiseTransactionFormConfigurationModule,
      providers: [UserWiseTransactionFormConfigurationService]
    };
  }
}
