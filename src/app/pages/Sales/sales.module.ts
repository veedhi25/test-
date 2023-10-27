import { NgModule } from "@angular/core";
import { NgaModule } from "../../theme/nga.module";
//import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { routing } from "./sales.routing";
import { Sales } from "./sales.component";
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { TransactionModule } from "../../common/Transaction Components/transaction.module";
import { TransactionService } from "../../common/Transaction Components/transaction.service";
import { CreditNoteItemBaseComponent } from "./components/CreditNoteItemWise/creditnote-itembase.component";
import { AddSalesInvoiceComponent } from "./components/salesinvoice/AddSalesInvoices";
import { CashHandoverComponent } from "./components/cash-handover/cash-handover.component";
import { GenericPopupGridModule } from "../../common/popupLists/generic-grid/generic-popup-grid.module";

import { NgxPaginationModule } from 'ngx-pagination';

import { LoadChartActionComponent } from "./components/load-chart/load-chart-action/load-chart-action.component";
import { AddSalesOrderComponent } from "./components/sales-order/add-sales-order.component";
import { AddPerformaInvoiceComponent } from "./components/performa-invoice/add-performa-invoice.component";
import { FileUploaderPopupModule } from "../../common/popupLists/file-uploader/file-uploader-popup.module";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SalesOrderDeliveryComponent } from "./components/SalesInvoiceDelivery/Sales-Invoice_delivery.component";
import { AddQuotationInvoiceComponent } from "./components/quotationinvoice/quotationinvoice";
import { UserWiseTransactionFormConfigurationModule } from "../../common/popupLists/USERWISETRANSACTIONFORMCONFIGURATION/user-wise-transaction-form-configuration.module";
import { AddDeliveryChallaanComponent } from "./components/delivery-challaan/add-delivery-challaan.component";
import { SessionManagementComponent } from "./components/session-management/session-management";
import { CouponMaster } from "./components/coupon-master/coupon-master";
import { ModalModule } from "ng2-bootstrap";
import { CouponCreation } from "./components/coupon-master/coupon-creation";
import { DenominationComponent } from "./components/session-management/Denomination/denomination";
import { CouponTouser } from "./components/coupon-master/coupon-touser";
import { CouponAllotement } from "./components/coupon-master/coupon-allotement";
import { InterCompanyTransferOutComponent } from "../Inventory/components/CompanyTransferOut/CompanyTransferOut";


@NgModule({
  imports: [
    NgaModule,
    routing,
    ModalModule.forRoot(),
    TransactionModule,
    // popupListModule,
    NgxPaginationModule,
    GenericPopupGridModule.forRoot(),
    FileUploaderPopupModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    Ng2SmartTableModule,
    UserWiseTransactionFormConfigurationModule.forRoot()

  ],
  declarations: [
    Sales,
    CreditNoteItemBaseComponent,
    // CreditNoteItemBaseListComponent,
    // TrnMainSalesInvoiceComponent,
    // SalesInvoiceListComponent,
    // SalesInvoiceComponent,
    // SalesReturnListComponent,
    // TaxInvoiceListComponent,
    AddSalesInvoiceComponent,
    LoadChartActionComponent,
    AddPerformaInvoiceComponent,
    AddQuotationInvoiceComponent,
    AddSalesOrderComponent,
    SalesOrderDeliveryComponent,
    CashHandoverComponent,
    AddDeliveryChallaanComponent,
    SessionManagementComponent,
    DenominationComponent,
    CouponMaster,
    CouponCreation,
    CouponAllotement,
    CouponTouser,
    InterCompanyTransferOutComponent,


  ],

  providers: [CanActivateTeam, TransactionService]
})
export class SalesModule { }
