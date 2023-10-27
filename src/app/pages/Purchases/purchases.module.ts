import { NgModule } from '@angular/core';
import { TransactionService } from "./../../common/Transaction Components/transaction.service";
import { NgaModule } from '../../theme/nga.module';
import { routing } from './purchases.routing';
import { Purchases } from './purchases.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service'
import { AddPurchaseInvoiceComponent } from './components/purchaseinvoice/AddPurchaseInvoice';
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { DebitNoteItemBaseComponent } from "./components/DebitNoteItemWise/debitnote-itembase.component";
import { PurchaseOrderEntryComponent } from './components/purchaseorder/purchaseorderEntry';
import { RFQEntryComponent } from './components/RFQ/RFQEntry.component';
import { RFQListComponent } from './components/RFQ/RFQlist.component';
//import { RFQComponent } from "./components/RFQ/RFQ.component";
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { FileUploaderPopupModule } from '../../common/popupLists/file-uploader/file-uploader-popup.module';
import { PurchaseOrderDeliveryComponent } from './components/purchase-order-delivery/purchase-order-delivery.components';
import { DynamicFilterOptionModule } from '../../common/popupLists/dynamic-filter-option-popup/dynamic-filter-option-popup.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PurchaseService } from './components/purchase.service';
import { DeliveryOrderComponent } from '../../common/Transaction Components/delivery-order.component';
import { AutoIndentComponent } from './components/AutoIndent/AutoIndent.component';
import { IndentApproval } from "./components/indent-approval/indent-approval.component";
import { AddReceiptNoteComponent } from './components/purchaseinvoice/addReceiptNote';
import { UserWiseTransactionFormConfigurationModule } from '../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.module';
import { QuotationComponent } from './components/Quotation/quotation.component';
import { InterCompanyTransferInComponent } from '../Inventory/components/CompanyTransferIn/CompanyTransferIn';
import { SupplierResponseDetailComponent } from './components/Supplier-response-detail/supplier-response-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../common/shared.module';

@NgModule({
  imports: [
    NgaModule,
    routing,
    TransactionModule,
    GenericPopupGridModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    DynamicFilterOptionModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    UserWiseTransactionFormConfigurationModule.forRoot(),
    NgxPaginationModule,
    SharedModule.forRoot()
  ],
  declarations: [
    PurchaseOrderDeliveryComponent,
    AddPurchaseInvoiceComponent,
    AddReceiptNoteComponent,
    Purchases,
    DebitNoteItemBaseComponent,
    PurchaseOrderEntryComponent,
    DeliveryOrderComponent,
    AutoIndentComponent,
    RFQEntryComponent,
    IndentApproval,
    RFQListComponent,
    QuotationComponent,
    InterCompanyTransferInComponent,

    SupplierResponseDetailComponent
    //RFQComponent
  ],
  providers: [
    CanActivateTeam, TransactionService, PurchaseService
  ]
})
export class PurchasesModule {
}
