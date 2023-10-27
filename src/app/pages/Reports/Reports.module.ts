import { GstSalesSummaryTaxSlabReport } from './../ReportDialogs/GstSalesSummaryTaxSlab/GstSalesSummaryTaxSlab.component';
import { GSTPurchaseSummaryTaxSlabReport } from './../ReportDialogs/GSTPurchaseSummaryTaxSlab/GSTPurchaseSummaryTaxSlab.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { CanActivateTeam } from '../../common/services/permission/guard.service'
import { ModalModule } from 'ng2-bootstrap';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { Ng2SearchPipeModule } from '../../node_modules/ng2-search-filter';
import { routing } from './Reports.routing';
import { ReportsComponent } from './Reports.component';
import { ReportMain } from './components/ReportMain/ReportMain';
import { MasterDialogReport } from '../ReportDialogs/MasterDialogReport/MasterDialogReport';
import { NgxPaginationModule } from 'ngx-pagination';

import { PurchaseOrderDetailReport } from '../ReportDialogs/purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderCentralDetailReport } from '../ReportDialogs/purchase-order-central-detail/purchase-order-central-detail.component';
import { BillWiseItemSalesReport } from '../ReportDialogs/bill-wise-item-sales-report/bill-wise-item-sales-report.component';
import { ItemWiseSalesReport } from '../ReportDialogs/itemwisesales-report/item-wise-sales-report.component';
import { ItemWiseSalesCentralReport } from '../ReportDialogs/itemwisesalescentral-report/item-wise-sales-central-report.component';
import { ItemWiseCategorySalesCentralReport } from '../ReportDialogs/itemwisecategorysalescentral-report/item-wise-category-sales-central-report.component';
import { STOCKISSUEREPORT } from '../ReportDialogs/STOCKISSUEREPORT/STOCKISSUEREPORT.component';
import { STOCKISSUEREPORTCENTRAL } from '../ReportDialogs/STOCKISSUEREPORTCENTRAL/STOCKISSUEREPORTCENTRAL.component';
import { BESTBUYPRODUCTREPORT } from '../ReportDialogs/BESTBUYPRODUCTREPORT/BESTBUYPRODUCTREPORT.component';
import { SLOWBUYPRODUCTREPORT } from '../ReportDialogs/SLOWBUYPRODUCTREPORT/SLOWBUYPRODUCTREPORT.component';
import { SalemanCommisionReport } from '../ReportDialogs/Saleman-Commision-Report/Saleman-Commision-Report.component';

import { ClosingStockReport } from '../ReportDialogs/closing-stock/closing-stock.component';
import { SupplierWiseStock } from '../ReportDialogs/SupplierWiseStock/SupplierWiseStock';
import { ClosingStockSummaryReport } from '../ReportDialogs/ClosingStockSummaryReport/ClosingStockSummaryReport.component';
import { ShortExpiryReport } from '../ReportDialogs/ShortExpiryReport/ShortExpiryReport.component';
import { ShortExpiryReportCentral } from '../ReportDialogs/ShortExpiryReportCentral/ShortExpiryReportCentral.component';

import { PurchaseInvoiceDetailReport } from '../ReportDialogs/purchase-invoice-detail-report/purchase-invoice-detail.component';
import { MaterialReceiptReport } from '../ReportDialogs/Material-Receipt-report/material-receipt.component';
import { MRvsPIReport } from '../ReportDialogs/MRvsPIReport/MRvsPIReport.component';
import { POvsSOReport } from '../ReportDialogs/POvsSOReport/POvsSOReport.component';
import { MaterialReceiptCentralReport } from '../ReportDialogs/Material-Receipt-Central-report/material-receipt-central.component';
import { MRvsPIReportCentral } from '../ReportDialogs/MRvsPIReportCentral/MRvsPIReportCentral.component';
import { IndentVSPOReportCentral } from '../ReportDialogs/IndentVSPOReportCentral/IndentVSPOReportCentral.component';
import { POVSMRReportCentral } from '../ReportDialogs/POVSMRReportCentral/POVSMRReportCentral.component';
import { PurchaseInvoiceDetailCentralReport } from '../ReportDialogs/purchase-invoice-detail-central-report/purchase-invoice-detail-central.component';
import { CustomerWiseItemSalesReport } from '../ReportDialogs/customer-wise-item-sales-report/customer-wise-item-sales.component';
import { DailySalesReport } from '../ReportDialogs/Daily_sales_report/Daily_sales_report.component';
import { OpticalReport } from '../ReportDialogs/opticalreport/opticalreport.component';
import { HourSalesReport } from '../ReportDialogs/Hour_sales_report/Hour_sales_report.component';
import { LoadSheetDetail } from '../ReportDialogs/LoadSheetDetail/LoadSheetDetail.component';
import { IndentReport } from '../ReportDialogs/IndentReport/IndentReport.component';
import { IndentCentralReport } from '../ReportDialogs/IndentCentralReport/IndentCentralReport.component';
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { ItemMasterReport } from '../ReportDialogs/ItemMaster/item-master.component';
import { PRICELIST } from '../ReportDialogs/PRICELIST/PRICELIST.component';
import { TransferInCentralComponent } from "../ReportDialogs/transfer-in-central/transfer-in-central.component";
import { TransferOutCentralComponent } from "../ReportDialogs/transfer-out-central/transfer-out-central.component";
import { LoyaltyReport } from "../ReportDialogs/loyalty-report/loyalty-report.component";
import { CustomerWiseLoyaltyReport } from "../ReportDialogs/CUSTOMERWISELOYALTY/customerwiseloyalty-report.component";
import { CustomerWiseLoyaltyCentralReport } from "../ReportDialogs/CUSTOMERWISELOYALTYCENTRAL/customerwiseloyaltycentral-report.component";
import { CustomerWiseDetailLoyaltyReport } from "../ReportDialogs/CUSTOMERWISEDETAILLOYALTY/customerwisedetailloyalty-report.component";
import { CouponCreationReport } from "../ReportDialogs/CouponCreationReport/couponcreation-report.component";
import { CouponDiscountReceivedReport } from "../ReportDialogs/CouponDiscountReceivedReport/coupondiscountreceived-report.component";
import { CouponDiscountReceivedReportCentral } from "../ReportDialogs/CouponDiscountReceivedReportCentral/coupondiscountreceivedcentral-report.component";
import { CouponCreationSummaryReport } from "../ReportDialogs/CouponCreationSummaryReport/couponcreationsummary-report.component";
import { CouponCreationSummaryReportCentral } from "../ReportDialogs/CouponCreationSummaryReportCentral/couponcreationsummarycentral-report.component";
import { CouponCreationReportCentral } from "../ReportDialogs/CouponCreationReportCentral/couponcreationcentral-report.component";
import { CustomerWiseDetailLoyaltyCentralReport } from "../ReportDialogs/CUSTOMERWISEDETAILLOYALTYCENTRAL/customerwisedetailloyaltycentral-report.component";
import { CustomerMasterReport } from "../ReportDialogs/CustomerMasterReport/customer-master-report.component";
import { OUTLETLIST } from '../ReportDialogs/OUTLETLIST/OUTLETLIST.component';
import { SCHEMEMASTER } from '../ReportDialogs/SCHEMEMASTER/SCHEMEMASTER.component';
import { StockSettlementReportCentral } from '../ReportDialogs/stock-settlement-report-central/stock-settlement-report-central.component';
import { StockSettlementReport } from '../ReportDialogs/Stock-Settlement/stock-settlement.component';
import { ItemSchemeMasterReport } from '../ReportDialogs/Item-scheme-master/item-scheme-master.component';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { ItemwiseChannelmarginReport } from '../ReportDialogs/Itemwise-Channel-Margin/itemwise-channel-margin.component';
import { PurchaseReturnReport } from '../ReportDialogs/Purchase Return/purchase-return.component';
import { ReportFilterModule } from '../../common/popupLists/report-filter/report-filter.module';
import { SalesOrderReportComponent } from '../ReportDialogs/sales-order/sales-order.component';
import { SalesBillCancelReport } from '../ReportDialogs/SalesBillcancel/salesbillcancel.component';
import { CustomerwiseSalesReturnReport } from '../ReportDialogs/customerwise-sales-return/customerwise-salesreturn.component';
import { DailyCollectionReport } from '../ReportDialogs/DailyCollectionReport/dailycollection-report.component';
import { MonthlyCollectionReport } from '../ReportDialogs/MonthlyCollectionReport/monthlycollection-report.component';
import { MonthlyCollectionReportCentral } from '../ReportDialogs/MonthlyCollectionReportCentral/monthlycollectioncentral-report.component';
import { SalesReturnReport } from '../ReportDialogs/SalesReturnReport/salesreturn-report.component';
import { SchemeReport } from '../ReportDialogs/SchemeReport/scheme-report.component';
import { PurchaseOrderSummaryComponent } from '../ReportDialogs/PurchaseOrderSummary/purchase-order-summary.component';
import { POVSMRReportComponent } from '../ReportDialogs/POVSMRReport/POVSMRReport.component';
import { IndentVSPOReport } from '../ReportDialogs/IndentVSPOReport/IndentVSPOReport.component';
import { PurchaseSummaryComponent } from '../ReportDialogs/PurchaseSummary/purchase-summary.component';
import { SalesOrderSummaryComponent } from '../ReportDialogs/SalesOrderSummary/sales-order-summary.component';
import { SalesReturnSummaryComponent } from '../ReportDialogs/SalesReturnSummary/sales-return-summary.component';
import { ItemwiseStockandsalessummaryReport } from '../ReportDialogs/itemwisestockandsalessummary/itemwisestockandsalessummary';
import { TransactionReport } from '../ReportDialogs/TransactionReport/TransactionReport';
import { PurchaseRegisterReport } from '../ReportDialogs/PurchaseRegisterReport/purchaseregisterreport.component';
import { SalesRegisterReport } from '../ReportDialogs/SalesRegisterReport/salesRegisterReport';
import { OpeningStockReport } from '../ReportDialogs/opening-stock/opening-stock.component';
import { MRPChangeReport } from '../ReportDialogs/mrp-change/mrp-change.component';
import { AuditReport } from '../ReportDialogs/audit/audit.component';
import { AuditCentralReport } from '../ReportDialogs/auditcentral/auditcentral.component';
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { PurchaseReturnSummaryComponent } from '../ReportDialogs/PurchaseReturnSummary/purchasereturnsummary.component';
import { POvsPIReportComponent } from '../ReportDialogs/POvsPI/POvsPI.component';
import { POvsPICentralReportComponent } from '../ReportDialogs/POvsPICentral/POvsPICentral.component';
import { TranwiseStockComponent } from '../ReportDialogs/Transactionwise Stock Report/tranwisestockreport.component';
import { MocWiseSales } from '../ReportDialogs/MocWiseSales/MocWiseSales.component';
import { MonthWiseSales } from '../ReportDialogs/MonthWiseSales/MonthWiseSales.component';
import { HoldBillReportComponent } from '../ReportDialogs/holbillreport/holdbill-report.component';
import { IntransitReportComponent } from '../ReportDialogs/intransitReport/intransitReport';
import { ItemExpiryReport } from '../ReportDialogs/ItemExpiryReport/ItemExpiryReport';
import { IndentVsReplenishedReport } from '../ReportDialogs/IndentVsReplenishedReport/IndentVsReplenishedReport';
import { DeliveryStatusReport } from '../ReportDialogs/delivery-status-report/delivery-status-report';
import { ItemExpiryReport_Central } from '../ReportDialogs/ItemExpiryReport_Central/ItemExpiryReport_Central';
import { ProformaDetailReportComponent } from '../ReportDialogs/proforma-detail-report/proforma-detail-report.component';
import { AgeWiseItemExpiryReport } from '../ReportDialogs/agewise-itemexpiry-report/agewise-item-expiry-report.component';
import { AutoDebitNoteRaisedReportComponent } from '../ReportDialogs/AutodebitNoteRaised/auto-debit-note-raised-report.component';
import { ERPINVOICEREPORTCOMPONENT } from '../ReportDialogs/ERPINVOICEREPORT/erp-invoice-report.component';
import { SOVSSIReportComponent } from '../ReportDialogs/sovssi/sovssi-report.component';
import { SOVSPOReportComponent } from '../ReportDialogs/sovspo/sovspo-report.component';
import { ERPSIREPORTCOMPONENT } from '../ReportDialogs/ERPSIREPORT/erp-si-report.component';
import { SOERRORLOGREPORTCOMPONENT } from '../ReportDialogs/SOERRORLOG/soerrorlog-report.component';
import { ORDERTRANSFERREPORTCOMPONENT } from '../ReportDialogs/ordertransfer/ordertransfer-report.component';
import { SupplierStockReportComponent } from '../ReportDialogs/supplierstockreport/supplier-stock-report.component';
import { POVSINTRANSITReport } from '../ReportDialogs/povsintransit/povsintransit.component';
import { ReportFormatPipe } from '../../theme/directives/pipes/pipes';
import { IMSReportColumnFormatModule } from './components/ReportMain/ReportColumnFormat/ims-report-column-format.module';
import { POVSPIVSINTRANSITReport } from '../ReportDialogs/povspivsintransit/povspivsintransit.component';
import { PartialSalesBillReport } from '../ReportDialogs/partial-sales-bill/partial-sales-bill.component';
import { DeliveryOrderStatusReportComponent } from '../ReportDialogs/delivery-order-status-report/delivery-order-status-report.component';
import { TransferInReportComponent } from '../ReportDialogs/transfer-in/transfer-in.component';
import { TransferInCentralReport } from '../ReportDialogs/TransferInCentralReport/TransferInCentralReport.component';
import { TransferOutReportComponent } from '../ReportDialogs/transfer-out/transfer-out.component';
import { ProformaSummaryReportComponent } from '../ReportDialogs/proforma-summary-report/proforma-summary-report.component';
import { SupplierOrderStatusReportComponent } from '../ReportDialogs/supplier-order-status-report/supplier-order-status-report.component';
import { ClaimReportComponent } from '../ReportDialogs/claim-report/claim-report.component';
import { ERPDNREPORTCOMPONENT } from '../ReportDialogs/erpDnReport/erp-dn-report.component';
import { ERPCNREPORTCOMPONENT } from '../ReportDialogs/erpCnReport/erp-cn-report.component';
import { ClaimAndExpiryReportComponent } from '../ReportDialogs/claimandexpiryreport/claimandexpiryreport.component';
import { PrvsSrReportComponent } from '../ReportDialogs/PrVsSrReport/PrVsSrReport';
import { comboitemconfigurationReport } from '../ReportDialogs/combo-item-configuration-report/comboitemconfiguration.component';
import { AngularMultiSelectModule } from '../../node_modules/angular4-multiselect-dropdown'
import { partyAgeOutstandingReconcillationReport } from '../ReportDialogs/partyageoutstandingreconcillation/partyageoutstandingreconcillation.component';
import { AreaSalesOutstandingReport } from '../ReportDialogs/areasalesoutstanding/areasalesoutstanding.component';
import { DynamicFormModule } from '../../common/dynamicreportparam/dynamicreportparam.module';
import { closingstockcentral } from '../ReportDialogs/closingstockcentral/closingstockcentral.component';
import { currentstockitemwisecentral } from '../ReportDialogs/currentstockitemwisecentral/currentstockitemwisecentral.component';
import { currentstockitemwisesummarycentral } from '../ReportDialogs/currentstockitemwisesummarycentral/currentstockitemwisesummarycentral.component';
import { ClosingStockSummaryReportCentral } from '../ReportDialogs/ClosingStockSummaryReportCentral/ClosingStockSummaryReportCentral.component';
import { BESTBUYCUSTOMERREPORT } from '../ReportDialogs/BESTBUYCUSTOMERREPORT/BESTBUYCUSTOMERREPORT.component';
import { PurchaseSummaryCategoryCentral } from "../ReportDialogs/PurchaseSummaryCategoryCentral";
import { CustomerBillReminderReport } from '../ReportDialogs/customer-bill-reminder-report/customer-bill-reminder-report.component';
import { NonTransactedCustomerReport } from '../ReportDialogs/nontransactedpartyreport/nontransactedpartyreport.component';
import { SalesmanecoReportComponent } from '../ReportDialogs/salesmanvsecoreport/salesmanecoreport.component';
import { CrateReportComponent } from '../ReportDialogs/crateReport/crateReport.component';
import { BillWiseItemWiseSalesCentralReport } from '../ReportDialogs/BillWiseItemWiseSalesCentralReport/BillWiseItemWiseSalesCentralReport.component';
import { UserLoginDetailsCentralReport } from '../ReportDialogs/UserLoginDetailsCentralReport/UserLoginDetailsCentralReport.component';
import { OfferManagementReport } from '../ReportDialogs/OfferManagementReport/OfferManagementReport.component';
import { HourlySalesItemwiseCentral } from '../ReportDialogs/HourlySalesItemwiseCentral/HourlySalesItemwiseCentral.component';
import { SalesItemWiseSummaryCentral } from '../ReportDialogs/SalesItemWiseSummaryCentral/SalesItemWiseSummaryCentral.component';
import { CategoryStockItemWiseSalesCentral } from '../ReportDialogs/CategoryStockItemWiseSalesCentral/CategoryStockItemWiseSalesCentral.component';
import { AvailableStockForDay } from '../ReportDialogs/AvailableStockForDay/AvailableStockForDay.component';
import { GROSSMARGINREPORT } from '../ReportDialogs/GROSSMARGINREPORT/GROSSMARGINREPORT.component';
import { GROSSMARGINREPORTMONTHWISE } from '../ReportDialogs/GROSSMARGINREPORTMONTHWISE/GROSSMARGINREPORTMONTHWISE.component';
import { DailySalesCentralReport } from '../ReportDialogs/Daily_sales_central_report/Daily_sales_central_report.component';
import { DailyCollectionCentralReport } from '../ReportDialogs/DailyCollectionCentralReport/dailycollectioncentral-report.component';
import { purchaseRegisterReportCentral } from '../ReportDialogs/purchaseRegisterReportCentral/purchaseRegisterReportCentral.component';
import { SALESRETURNREPORTCENTRAL } from '../ReportDialogs/SALESRETURNREPORTCENTRA/SALESRETURNREPORTCENTRAL.component';
import { OpeningStockCentral } from '../ReportDialogs/OpeningStockCentral/OpeningStockCentral.component';
import { CUSTOMERITEMTRACKREPORT } from '../ReportDialogs/CUSTOMERITEMTRACKREPORT/CUSTOMERITEMTRACKREPORT.component';
import { TransferoutCentralReport } from '../ReportDialogs/TransferoutCentralReport/TransferoutCentralReport.component'
import { LoyaltyMasterReportComponent } from '../ReportDialogs/loyalty-master/loyalty-master.component';
import { FASTMOVINGPRODUCT } from '../ReportDialogs/FASTMOVINGPRODUCT/FASTMOVINGPRODUCT.component';
import { ItemCorelation } from '../ReportDialogs/ItemCorelation/ItemCorelation.component';
//CODE
import { ItemCorelationFiltered } from '../ReportDialogs/ItemCorelationFiltered/ItemCorelationFiltered.component';
import { BestBuyProductReportCentralComponent } from "../ReportDialogs/best-buy-product-report-central/best-buy-product-report-central.component";
import { HourSalesCentralReport } from '../ReportDialogs/HourSalesCentralReport/HourSalesCentralReport.component';
import { PurchaseMonthlyCollectionReport } from '../ReportDialogs/PurchaseMonthlyReport/purchasemonthlycollection-report.component';
import { StockandSalesCategorySummary } from '../ReportDialogs/StockandSalesCategorySummary/StockandSalesCategorySummary.component';
import { StockandSalesItemSummaryCentral } from '../ReportDialogs/StockandSalesItemSummaryCentral/StockandSalesItemSummaryCentral.component';
import { StockandSalesItemSummary } from '../ReportDialogs/StockandSalesItemSummary/StockandSalesItemSummary.component';
import { PurchaseMonthlywiseSummary } from '../ReportDialogs/PurchaseMonthlywiseSummary/purchaseMonthlywiseSummary-report.component';
import { CurrentStockCategoryWiseSummaryCentralReport } from '../ReportDialogs/CurrentStockCategoryWiseSummaryCentral/CurrentStockCategoryWiseSummaryCentralReport.component';
import { PurchaseSummaryCategoryCentralReport } from '../ReportDialogs/PurchaseSummaryCategoryCentral/PurchaseSummaryCategoryCentralReport.component';

import { CouponReportComponent } from '../ReportDialogs/couponReport/couponReport.component';
import { CouponMasterReport } from '../ReportDialogs/couponmasterreport/couponmasterreport.component';
import { CouponMasterReportCentral } from '../ReportDialogs/couponmasterreportcentral/couponmasterreportcentral.component';


import { OfflineSyncReport } from '../ReportDialogs/offline-sync-report/offline-sync-report.component';
import { SalesVsGRNAnalysis } from '../ReportDialogs/SalesVsGRNAnalysis/SalesVsGRNAnalysis';
import { ItemTransactionHistory } from '../ReportDialogs/ItemTransactionHistory/ItemTransactionHistory';
import { ItemTransactionHistoryStandAlone } from '../ReportDialogs/ItemTransactionHistoryStandAlone/ItemTransactionHistoryStandAlone';
import { ExpectedPOVsActualPurchase } from '../ReportDialogs/ExpectedPOVsActualPurchase/ExpectedPOVsActualPurchase';
import { SuggestedPOQtybasedonlastdaySale } from '../ReportDialogs/SuggestedPOQtybasedonlastdaySale/SuggestedPOQtybasedonlastdaySale';
import { FastMovingOutletWise } from '../ReportDialogs/FastMovingOutletWise/FastMovingOutletWise';
import { SlowMovingOutletWise } from '../ReportDialogs/SlowMovingOutletWise/SlowMovingOutletWise';
import { PushSalesItemList } from '../ReportDialogs/PushSalesItemList/PushSalesItemList';
import { ItemSalesHistory } from '../ReportDialogs/ItemSalesHistory/ItemSalesHistory';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    AutoCompleteModule,
    Ng2SearchPipeModule,
    NgxDaterangepickerMd.forRoot(),
    AngularMultiSelectModule,
    GenericPopupGridModule.forRoot(),
    ReportFilterModule,
    IMSReportColumnFormatModule.forRoot(),
    DynamicFormModule

  ],
  declarations:
    [ReportsComponent,
      ReportMain,
      //// DateSelectionControl,
      MasterDialogReport,
      TransferInCentralReport,
      TransferoutCentralReport,
      BillWiseItemSalesReport,
      ItemWiseSalesReport,
      ItemWiseSalesCentralReport,
      ItemWiseCategorySalesCentralReport,
      HourlySalesItemwiseCentral,
      STOCKISSUEREPORT,
      STOCKISSUEREPORTCENTRAL,
      BESTBUYPRODUCTREPORT,
      SLOWBUYPRODUCTREPORT,
      BESTBUYCUSTOMERREPORT,
      SalemanCommisionReport,
      ClosingStockReport,
      SupplierWiseStock,
      ClosingStockSummaryReport,
      ClosingStockSummaryReportCentral,
      StockandSalesCategorySummary,
      StockandSalesItemSummaryCentral,
      StockandSalesItemSummary,
      ShortExpiryReport,
      ShortExpiryReportCentral,
      closingstockcentral,
      currentstockitemwisecentral,
      currentstockitemwisesummarycentral,
      CurrentStockCategoryWiseSummaryCentralReport,
      PurchaseInvoiceDetailReport,
      MaterialReceiptReport,
      MRvsPIReport,
      POvsSOReport,
      MaterialReceiptCentralReport,
      MRvsPIReportCentral,
      IndentVSPOReportCentral,
      POVSMRReportCentral,
      PurchaseInvoiceDetailCentralReport,
      PurchaseOrderDetailReport,
      PurchaseOrderCentralDetailReport,
      CustomerWiseItemSalesReport,
      DailySalesReport,
      OpticalReport,
      HourSalesReport,
      LoadSheetDetail,
      IndentReport,
      IndentCentralReport,
      BillWiseItemWiseSalesCentralReport,
      UserLoginDetailsCentralReport,
      OfferManagementReport,
      SalesItemWiseSummaryCentral,
      CategoryStockItemWiseSalesCentral,
      AvailableStockForDay,
      DailySalesCentralReport,
      ItemMasterReport,
      LoyaltyReport,
      CustomerWiseLoyaltyReport,
      CustomerWiseLoyaltyCentralReport,
      CustomerWiseDetailLoyaltyReport,
      CustomerWiseDetailLoyaltyCentralReport,
      CustomerMasterReport,
      PRICELIST,
      TransferInCentralComponent,
      TransferOutCentralComponent,
      OUTLETLIST,
      SCHEMEMASTER,
      StockSettlementReport,
      StockSettlementReportCentral,
      ItemSchemeMasterReport,
      ItemwiseChannelmarginReport,
      PurchaseReturnReport,
      PurchaseSummaryCategoryCentralReport,
      SalesOrderReportComponent,
      SalesBillCancelReport,
      CustomerwiseSalesReturnReport,
      DailyCollectionReport,
      CouponCreationReport,
      CouponDiscountReceivedReport,
      CouponDiscountReceivedReportCentral,
      CouponCreationSummaryReport,
      CouponCreationSummaryReportCentral,
      CouponCreationReportCentral,
      MonthlyCollectionReport,
      MonthlyCollectionReportCentral,
      GstSalesSummaryTaxSlabReport,
      GSTPurchaseSummaryTaxSlabReport,
      SalesReturnReport,
      SchemeReport,
      PurchaseOrderSummaryComponent,
      POVSMRReportComponent,
      IndentVSPOReport,
      PurchaseSummaryComponent,
      SalesOrderSummaryComponent,
      SalesReturnSummaryComponent,
      ItemwiseStockandsalessummaryReport,
      TransactionReport,
      PurchaseRegisterReport,
      SalesRegisterReport,
      OpeningStockReport,
      MRPChangeReport,
      AuditReport,
      AuditCentralReport,
      PurchaseReturnSummaryComponent,
      POvsPIReportComponent,
      POvsPICentralReportComponent,
      TranwiseStockComponent,
      MocWiseSales,
      MonthWiseSales,
      HoldBillReportComponent,
      IntransitReportComponent,
      ItemExpiryReport,
      IndentVsReplenishedReport,
      ItemExpiryReport_Central,
      ProformaDetailReportComponent,
      ProformaSummaryReportComponent,
      AgeWiseItemExpiryReport,
      AutoDebitNoteRaisedReportComponent,
      ERPINVOICEREPORTCOMPONENT,
      ERPSIREPORTCOMPONENT,
      SOVSSIReportComponent,
      SOVSPOReportComponent,
      SOERRORLOGREPORTCOMPONENT,
      ORDERTRANSFERREPORTCOMPONENT,
      SupplierStockReportComponent,
      POVSINTRANSITReport,
      ReportFormatPipe,
      POVSPIVSINTRANSITReport,
      PartialSalesBillReport,
      DeliveryOrderStatusReportComponent,
      SupplierOrderStatusReportComponent,
      TransferInReportComponent,
      TransferOutReportComponent,
      ClaimReportComponent,
      ERPDNREPORTCOMPONENT,
      ERPCNREPORTCOMPONENT,
      ClaimAndExpiryReportComponent,
      PrvsSrReportComponent,
      comboitemconfigurationReport,
      partyAgeOutstandingReconcillationReport,
      AreaSalesOutstandingReport,
      CustomerBillReminderReport,
      NonTransactedCustomerReport,
      SalesmanecoReportComponent,
      SALESRETURNREPORTCENTRAL,
      CrateReportComponent,
      GROSSMARGINREPORT,
      GROSSMARGINREPORTMONTHWISE,
      CrateReportComponent,
      DailySalesCentralReport,
      DailyCollectionCentralReport,
      purchaseRegisterReportCentral,
      OpeningStockCentral,
      CUSTOMERITEMTRACKREPORT,
      DeliveryStatusReport,
      LoyaltyMasterReportComponent,
      FASTMOVINGPRODUCT,
      ItemCorelation,
      ItemCorelationFiltered,
      HourSalesCentralReport,
      PurchaseMonthlyCollectionReport,
      OfflineSyncReport,
      BestBuyProductReportCentralComponent,
      PurchaseMonthlywiseSummary,
      CouponReportComponent,
      CouponMasterReport,
      CouponMasterReportCentral,
      SalesVsGRNAnalysis,
      ItemTransactionHistory,
      ItemTransactionHistoryStandAlone,
      ExpectedPOVsActualPurchase,
      SuggestedPOQtybasedonlastdaySale,
      FastMovingOutletWise,
      SlowMovingOutletWise,
      PushSalesItemList,
      ItemSalesHistory
    ],
  providers: [
    CanActivateTeam,
    TransactionService
  ],
  entryComponents:
    [MasterDialogReport],
})
export class ReportModule {
}
