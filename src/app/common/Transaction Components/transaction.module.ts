import { VoucherDateComponent } from "./voucher-date.component";
import { TrnMainVoucherEntryComponent } from "./trnmain-voucher-entry.component";
import { NgModule } from "@angular/core";
import { TrnMainPurchaseComponent } from "./trnmain-purchase.component";
import { ProductInsertComponent, ActivePipe, LazyForDirective, TaxInvoiceActivePipe, DisableControlDirective } from "./ProductInsert";
import { TrnMainBranchComponent } from "./trnmain-branch.component";
import { NgaModule } from "../../theme/nga.module";
import { FocusDirective } from "./focus.directive";
import { SubFocusDirective } from "./sub-ledger-focus.directive";
import { ModalModule } from "ng2-bootstrap";
import { popupListModule } from "../popupLists/popuplist.module";
import { TrnMainParametersComponent } from "./TrnMainParameters";
import { VoucherMessageRemarksComponent } from "./voucher-message-remarks.component";
import { ButtonShowPipe, VoucherMasterActionComponent } from "./voucher-master-action.component";
import { VoucherMasterTogglerComponent } from "./voucher-master-toggler.component";
import { VoucherTotalAreaComponent } from "./voucher-total-area.component";
import { InventoryParametersComponent } from "./InventoryParameters";
import { GenericPopupGridModule } from "../popupLists/generic-grid/generic-popup-grid.module";
import { GenericPopupTenderModule } from "../../pages/Sales/components/salesinvoice/generic-popup-Tender.module";
import { PopupAddNewCustomerModule } from "../../pages/Sales/components/salesinvoice/AddCustomerPopup.module";
import { TransportPopupModule } from "../../pages/Sales/components/salesinvoice/Transport-popup.module";
import { FileUploaderPopupModule } from "../popupLists/file-uploader/file-uploader-popup.module";
import { LimitDecimalPlacesModule } from "../directives/limit-decimal.module";
import { VoucherSidebarBillDetailComponent } from "./voucher-sidebar-billdetail.component";
import { IMSDatePickerModule } from "../date-picker/date-picker.module";
import { GenericStaticPopupGridModule } from "../popupLists/generic_grid_static/genericGrid_static.module";
import { InvoiceListComponent } from "./invoice-list.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { TrnMainReceiptNoteComponent } from "./trnmain-receipt-note.component";
import { RepackParametersComponent } from './RepackParameters';
import { MatrixItemGridModule } from "../popupLists/matrix-item-grid/matrix-item-grid.module";
import { VoucherHistoryComponent } from "./voucher-history.component";
import { SalesHistoryComponent } from "./sales-history.component";
import { SchemeComponent } from "./scheme.component";
import { SerializeItemGridModule } from "../popupLists/serialised-item-grid/serialised-item-grid.module";
import { UserWiseTransactionFormConfigurationModule } from "../popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.module";
import { AngularMultiSelectModule } from '../../node_modules/angular4-multiselect-dropdown/index'

@NgModule({
  imports: [
    NgaModule,
    ModalModule.forRoot(),
    popupListModule,
    GenericPopupGridModule.forRoot(),
    GenericPopupTenderModule.forRoot(),
    PopupAddNewCustomerModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    TransportPopupModule.forRoot(),
    LimitDecimalPlacesModule.forRoot(),
    IMSDatePickerModule.forRoot(),
    GenericStaticPopupGridModule.forRoot(),
    NgxPaginationModule,
    AngularMultiSelectModule,
    MatrixItemGridModule.forRoot(),
    SerializeItemGridModule.forRoot(),
    UserWiseTransactionFormConfigurationModule.forRoot()
  ],
  declarations: [
    ActivePipe,
    DisableControlDirective,
    TaxInvoiceActivePipe,
    ButtonShowPipe,
    TrnMainPurchaseComponent,
    TrnMainReceiptNoteComponent,
    VoucherDateComponent,
    ProductInsertComponent,
    TrnMainBranchComponent,
    FocusDirective,
    TrnMainVoucherEntryComponent,
    SubFocusDirective,
    FocusDirective,
    VoucherMessageRemarksComponent,
    VoucherMasterTogglerComponent,
    VoucherMasterActionComponent,
    TrnMainParametersComponent,
    VoucherTotalAreaComponent,
    InventoryParametersComponent,
    InvoiceListComponent,
    VoucherSidebarBillDetailComponent,
    RepackParametersComponent,
    VoucherHistoryComponent,
    SalesHistoryComponent,
    SchemeComponent



  ],
  exports: [
    ActivePipe,
    ButtonShowPipe,
    TrnMainPurchaseComponent,
    TrnMainReceiptNoteComponent,
    VoucherDateComponent,
    ProductInsertComponent,
    TrnMainBranchComponent,
    TrnMainParametersComponent,
    TrnMainVoucherEntryComponent,
    FocusDirective,
    SubFocusDirective,
    VoucherMessageRemarksComponent,
    VoucherMasterTogglerComponent,
    VoucherMasterActionComponent,
    VoucherTotalAreaComponent,
    InventoryParametersComponent,
    VoucherSidebarBillDetailComponent,
    InvoiceListComponent,
    RepackParametersComponent,
    VoucherHistoryComponent,
    SalesHistoryComponent,
    popupListModule
    ],
  providers: []
})
export class TransactionModule { }
