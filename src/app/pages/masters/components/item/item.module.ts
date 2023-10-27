import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgaModule } from "../../../../theme/nga.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { ItemRoutineModule } from "./item.routing";
import { ItemPriceChangeForm } from "./Item-Price-Change/itemPriceChange.component";
import { ItemPriceChangeFormComponent } from "./Item-Price-Change/itemPriceList.component";
import { ItemPriceChangeService } from "./Item-Price-Change/itemPriceChange.service";
import { ItemPropertySettingComponent } from "./itempropertysetting/itemPropertySetting.component";
import { NgxPaginationModule } from "ngx-pagination";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { popupListModule } from "../../../../common/popupLists/popuplist.module";
import { PriceDropComponent } from "./priceDrop/priceDrop.component";
import { PriceDropListComponent } from "./priceDrop/priceDropList.component";
import { AngularMultiSelectModule } from '../../../../node_modules/angular4-multiselect-dropdown'
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemRoutineModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    NgxPaginationModule,
    popupListModule,
    AngularMultiSelectModule,
    FileUploaderPopupModule.forRoot()


  ],
  declarations: [
    ItemPropertySettingComponent,
    ItemPriceChangeFormComponent,
    ItemPriceChangeForm,
    PriceDropComponent,
    PriceDropListComponent],
  providers: [ItemPriceChangeService, TransactionService]
})
export class ItemModule { }
