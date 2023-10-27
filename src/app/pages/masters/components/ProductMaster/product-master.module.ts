import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeModule } from "angular-tree-component";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { ProductsComponent } from "./products";
import { AddProductComponent } from "./addproducts";
import { ProductMasterRoutingModule } from "./product-master.routing";
import { AcInfoTabComponent } from "./AccountInformationTabComponent";
import { AddProductGroupComponent } from "./addproductGroup";
import { AlternateUnitTabComponent } from "./AlternateUnitTabComponent";
import { SalesTab } from "./sales.component";
import { OthersTabComponent } from './others-tab.component';
import { GSTTabComponent } from './gst-tab.component';
import { CategoryTabComponent } from './category-tab.component'
import { BarcodeTabComponent } from "./BarcodeTabComponent";
import { BrandModelTabComponent } from "./BrandModelComponent";
import { InventoryControlTabComponent } from "./InventoryControlTabComponent";
import { PHomeTab } from "./PHomeTab";
import { PHomeTabs } from "./PHomeTabs";
import { PriceSettingTabComponent } from "./priceSettingTabComponent";
import { ProductMasterTabComponent } from "./productmasterTab";
import { ProductMasterService } from "./ProductMasterService";
import { Tab } from "./tab";
import { Tabs } from "./tabs";
import { AuthService } from "../../../../common/services/permission";
import { ContextMenuModule } from "ngx-contextmenu";
import { ModalModule } from "ng2-bootstrap";
import { popupListModule } from "../../../../common/popupLists/popuplist.module";
import { AccountGroupPopupGridModule } from "../../../../common/popupLists/AGroupPopup/account-group-popup-grid.module";
import { ProductListComponent } from "./ProductList.component";
import { BrandModule } from "../brand/brand.module";
import { LimitDecimalPlacesModule } from "../../../../common/directives/limit-decimal.module";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";
import { PricingDetailsTabComponent } from "./PricingDetailsTabComponent";
import { SharedModule } from "../../../../common/shared.module";
import { ResolveMasterFormData } from "../../../../common/repositories/ResolveMasterFormData.service";
import {AngularMultiSelectModule} from '../../../../node_modules/angular4-multiselect-dropdown'

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ProductMasterRoutingModule,
    ReactiveFormsModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    ContextMenuModule,
    ModalModule.forRoot(),
    popupListModule,
    Ng2SmartTableModule,
    AccountGroupPopupGridModule.forRoot(),
    BrandModule,
    LimitDecimalPlacesModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    SharedModule.forRoot(),
    AngularMultiSelectModule

  ],
  declarations: [
    ProductsComponent,
    AddProductComponent,
    AcInfoTabComponent,
    AddProductGroupComponent,
    AlternateUnitTabComponent,
    SalesTab,
    OthersTabComponent,
    GSTTabComponent,
    CategoryTabComponent,
    BarcodeTabComponent,
    BrandModelTabComponent,
    InventoryControlTabComponent,
    PHomeTab,
    PHomeTabs,
    PriceSettingTabComponent,
    ProductMasterTabComponent,
    Tab,
    Tabs,
    ProductListComponent,
    PricingDetailsTabComponent,
    GSTTabComponent,
    CategoryTabComponent,
    OthersTabComponent
  ],
  providers: [ProductMasterService, AuthService, TransactionService,ResolveMasterFormData]
})
export class ProductMasterModule { }
