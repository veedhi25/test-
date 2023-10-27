import { Routes, RouterModule } from '@angular/router';
import { Purchases } from './purchases.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { AddPurchaseInvoiceComponent } from './components/purchaseinvoice/AddPurchaseInvoice';
import { DebitNoteItemBaseComponent } from "./components/DebitNoteItemWise/debitnote-itembase.component";
import { PurchaseOrderEntryComponent } from './components/purchaseorder/purchaseorderEntry';
import { RFQEntryComponent } from './components/RFQ/RFQEntry.component';
import { PurchaseOrderDeliveryComponent } from './components/purchase-order-delivery/purchase-order-delivery.components';
import { AutoIndentComponent } from './components/AutoIndent/AutoIndent.component';
import { AddReceiptNoteComponent } from './components/purchaseinvoice/addReceiptNote';
import { IndentApproval } from './components/indent-approval/indent-approval.component';
import { RFQListComponent } from './components/RFQ/RFQlist.component';
import { QuotationComponent } from './components/Quotation/quotation.component';
import { InterCompanyTransferInComponent } from '../Inventory/components/CompanyTransferIn/CompanyTransferIn';
import { SupplierResponseDetailComponent } from './components/Supplier-response-detail/supplier-response-detail.component';
// import { purchaseDataComp } from "./components/AdditionalCost/purchaseData.component";

const routes: Routes = [
    {
        path: '',
        component: Purchases,
        children: [

            { path: 'add-purchase-invoice', component: AddPurchaseInvoiceComponent, canActivate: [CanActivateTeam] },
            { path: 'add-receipt-note', component: AddReceiptNoteComponent, canActivate: [CanActivateTeam] },
            { path: 'add-debitnote-itembase', component: DebitNoteItemBaseComponent, canActivate: [CanActivateTeam] },
            // { path: 'additional-cost', component: MasterAdditional, canActivate: [CanActivateTeam] },
            { path: 'indent', component: AutoIndentComponent, canActivate: [CanActivateTeam] },
            { path: 'RFQ', component: RFQListComponent, canActivate: [CanActivateTeam] },
            { path: 'add-purchase-order', component: PurchaseOrderEntryComponent, canActivate: [CanActivateTeam] },
            { path: 'add-RFQ-order', component: RFQEntryComponent, canActivate: [CanActivateTeam] },
            { path: 'send-quotation', component: QuotationComponent, canActivate: [CanActivateTeam] },
            // { path: 'purchase-order-cancel', component: PurchaseOrderCancelComponent, canActivate: [CanActivateTeam] },
            { path: 'purchase-order-delivery', component: PurchaseOrderDeliveryComponent, canActivate: [CanActivateTeam] },
            { path: 'indent-approval', component: IndentApproval, canActivate: [CanActivateTeam] },
            { path: 'transfer-in', component: InterCompanyTransferInComponent, canActivate: [CanActivateTeam] },
            {
                path: 'supplier-response-detail/:rfqno', component: SupplierResponseDetailComponent, canActivate: [CanActivateTeam]
            }

        ]

    }
];

export const routing = RouterModule.forChild(routes);