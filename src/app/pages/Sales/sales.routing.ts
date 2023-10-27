import { Routes, RouterModule } from '@angular/router';
import { Sales } from './sales.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { CreditNoteItemBaseComponent } from "./components/CreditNoteItemWise/creditnote-itembase.component";
import { AddSalesInvoiceComponent } from './components/salesinvoice/AddSalesInvoices';
import { PendingChangesGuard } from '../../common/services/guard/can-navigate.guard';
import { AddSalesOrderComponent } from './components/sales-order/add-sales-order.component';
import { LoadChartActionComponent } from './components/load-chart/load-chart-action/load-chart-action.component';
import { AddPerformaInvoiceComponent } from './components/performa-invoice/add-performa-invoice.component';
import { AddDeliveryChallaanComponent } from './components/delivery-challaan/add-delivery-challaan.component';

import { SalesOrderDeliveryComponent } from './components/SalesInvoiceDelivery/Sales-Invoice_delivery.component';
import { CashHandoverComponent } from './components/cash-handover/cash-handover.component';
import { AddQuotationInvoiceComponent } from './components/quotationinvoice/quotationinvoice';
import { SessionManagementComponent } from './components/session-management/session-management';
import { CouponMaster } from './components/coupon-master/coupon-master';
import { CouponCreation } from './components/coupon-master/coupon-creation';
import { CouponAllotement } from './components/coupon-master/coupon-allotement';
import { CouponTouser } from './components/coupon-master/coupon-touser';
import { InterCompanyTransferOutComponent } from '../Inventory/components/CompanyTransferOut/CompanyTransferOut';

const routes: Routes = [
    {
        path: '',
        component: Sales,
        children: [
            { path: 'add-creditnote-itembase', component: CreditNoteItemBaseComponent, canActivate: [CanActivateTeam], canDeactivate: [PendingChangesGuard], },
            { path: 'addsientry', component: AddSalesInvoiceComponent, canActivate: [CanActivateTeam], canDeactivate: [PendingChangesGuard], },
            { path: 'loadchart', component: LoadChartActionComponent, canActivate: [CanActivateTeam], canDeactivate: [PendingChangesGuard] },
            { path: 'performa-invoice', component: AddPerformaInvoiceComponent, canActivate: [CanActivateTeam] },
            { path: 'quotationinvoice', component: AddQuotationInvoiceComponent, canActivate: [CanActivateTeam] },
            { path: 'sales-order', component: AddSalesOrderComponent, canActivate: [CanActivateTeam] },
            { path: 'salesinvoicedelivery', component: SalesOrderDeliveryComponent, canActivate: [CanActivateTeam] },
            { path: 'cash-handover', component: CashHandoverComponent, canActivate: [CanActivateTeam] },
            { path: 'delivery-challaan', component: AddDeliveryChallaanComponent, canActivate: [CanActivateTeam] },
            { path: 'session-management', component: SessionManagementComponent, canActivate: [CanActivateTeam] },
            { path: 'discountcouponmaster', component: CouponMaster, canActivate: [CanActivateTeam] },
            { path: 'couponcreation', component: CouponCreation, canActivate: [CanActivateTeam] },
            { path: 'couponallotement', component: CouponAllotement, canActivate: [CanActivateTeam] },
            { path: 'coupontouser', component: CouponTouser, canActivate: [CanActivateTeam] },
            { path: 'transfer-out', component: InterCompanyTransferOutComponent, canActivate: [CanActivateTeam] },

        ]
    }
];

export const routing = RouterModule.forChild(routes);