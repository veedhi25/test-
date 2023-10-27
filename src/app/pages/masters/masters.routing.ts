import { Routes, RouterModule } from '@angular/router';
import { Masters } from './masters.component';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { PendingChangesGuard } from '../../common/services/guard/can-navigate.guard';
import { ResolveMasterFormData } from '../../common/repositories/ResolveMasterFormData.service';
import { HierarchicalCategoryMasterComponent } from './components/hierarchical-category-master/hierarchicalcategorymaster.component';


const routes: Routes = [
    {
        path: '',
        component: Masters,
        children: [

            { path: 'addDeliveryBoy', loadChildren: 'app/pages/masters/components/deliveryboy/deliveryBoy.module#DeliveryBoyModule', canActivate: [CanActivateTeam] },
            { path: 'employee-master', loadChildren: 'app/pages/masters/components/employee-master/employee-master.module#EmployeeMasterModule', canActivate: [CanActivateTeam] },
            { path: 'doctor-master', loadChildren: 'app/pages/masters/components/doctor-master/doctor-master.module#DoctorMasterModule', canActivate: [CanActivateTeam] },
            { path: 'scheme-view', loadChildren: 'app/pages/masters/components/scheme-view/scheme-view.module#SchemeViewModule', canActivate: [CanActivateTeam] },
            { path: 'claim-type', loadChildren: 'app/pages/masters/components/claim-type/claim-type.module#ClaimTypeModule', canActivate: [CanActivateTeam] },
            { path: 'sales-man-type', loadChildren: 'app/pages/masters/components/sales-man-type/sales-man-type.module#SalesManTypeModule', canActivate: [CanActivateTeam] },
            { path: 'salesman', loadChildren: 'app/pages/masters/components/Saleman/sales-man.module#SalesManModule', canActivate: [CanActivateTeam] },
            { path: 'sales-terminal', loadChildren: 'app/pages/masters/components/sales-terminal/sales-terminal.module#SalesTerminalModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/unit-list', loadChildren: 'app/pages/masters/components/Unit/unit.module#UnitModule', canActivate: [CanActivateTeam] },
            { path: 'category', loadChildren: 'app/pages/masters/components/Category/category.module#CategoryModule', canActivate: [CanActivateTeam] },
            { path: 'cost-center', loadChildren: 'app/pages/masters/components/CostCenter/cost-center.module#CostCenterModule', canActivate: [CanActivateTeam] },
            { path: 'PartyLedger', loadChildren: 'app/pages/masters/components/PLedger/pledger.module#PartyLedgerModule', canActivate: [CanActivateTeam] },
            { path: 'tPartyLedger', loadChildren: 'app/pages/masters/components/transferPartyLedger/transferpartyledger.module#TransferPartyLedgerModule', canActivate: [CanActivateTeam] },
            { path: 'item', loadChildren: 'app/pages/masters/components/item/item.module#ItemModule', canActivate: [CanActivateTeam] },
            { path: 'utility/transporter', loadChildren: 'app/pages/masters/components/utility/transporter/transporter.module#TransporterModule', canActivate: [CanActivateTeam] },
            { path: 'utility/loyalty', loadChildren: 'app/pages/masters/components/utility/loyalty/loyalty.module#LoyaltyModule', canActivate: [CanActivateTeam] },
            { path: 'utility/customerwisemaxqtylist', loadChildren: 'app/pages/masters/components/utility/customerwiseMaxQty/customerwisemaxqty.module#CustomerWisemaxQuantityModule', canActivate: [CanActivateTeam] },
            { path: 'utility/customer-item-mapping', loadChildren: 'app/pages/masters/components/utility/customer-item-mapping/customer-item-mapping.module#CustomerItemMappingModule', canActivate: [CanActivateTeam] },
            { path: 'channel', loadChildren: 'app/pages/masters/components/Channel/channel.module#ChannelModule', canActivate: [CanActivateTeam] },
            { path: 'routemaster', loadChildren: 'app/pages/masters/components/RouteMaster/route-master.module#RouteMasterModule', canActivate: [CanActivateTeam], canDeactivate: [PendingChangesGuard] },
            { path: 'organizationhierarchy', loadChildren: 'app/pages/masters/components/organization-hierarchy/organisation-hierarchy.module#OrganisationHeirarchyModule', canActivate: [CanActivateTeam] },
            { path: 'brand', loadChildren: 'app/pages/masters/components/brand/brand.module#BrandModule', canActivate: [CanActivateTeam] },
            { path: 'statelist', loadChildren: 'app/pages/masters/components/StateMaster/state.module#StateModule', canActivate: [CanActivateTeam] },
            { path: 'salesarealist', loadChildren: 'app/pages/masters/components/sales-area-type/sales-area.module#SalesAreaModule', canActivate: [CanActivateTeam] },
            { path: 'batchpricinglist', loadChildren: 'app/pages/masters/components/BatchPrice/batch-price.module#BatchPriceModule', canActivate: [CanActivateTeam] },
            { path: 'TaxGroupTable', loadChildren: 'app/pages/masters/components/Tax/tax.module#TaxModule', canActivate: [CanActivateTeam] },
            { path: 'organizationtype', loadChildren: 'app/pages/masters/components/organization-type/organisation-type.module#OrganisationTypeModule', canActivate: [CanActivateTeam] },
            { path: 'tendertype', loadChildren: 'app/pages/masters/components/tender-type/tender-type.module#TenderTypeModule', canActivate: [CanActivateTeam] },
            { path: 'salesorganization', loadChildren: 'app/pages/masters/components/SalesOrganization/sales-organisation.module#SalesOrganisationModule', canActivate: [CanActivateTeam] },
            { path: 'productHierarchy', loadChildren: 'app/pages/masters/components/product-hierarchy/product-hierarchy.module#ProductHierarchyModule', canActivate: [CanActivateTeam] },
            { path: 'salesHierarchy', loadChildren: 'app/pages/masters/components/sales-hierarchy/sales-hierarchy.module#SalesHierarchyModule', canActivate: [CanActivateTeam] },
            { path: 'geograhphicalHeirarchy', loadChildren: 'app/pages/masters/components/GeographicalHierarchey/geographical-hierarchy.module#GeographicalHierarchyModule', canActivate: [CanActivateTeam] },
            { path: 'salesareatype', loadChildren: 'app/pages/masters/components/sales-area-type/sales-area-type.module#SalesAreaTypeModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/productmaster', loadChildren: 'app/pages/masters/components/ProductMaster/product-master.module#ProductMasterModule', canActivate: [CanActivateTeam], resolve: { formSetting: ResolveMasterFormData }, data: { formName: 'itemMaster' } },
            { path: 'divisionList', loadChildren: 'app/pages/masters/components/divisions/divisions.module#DivisonsModule', canActivate: [CanActivateTeam] },
            { path: 'BranchList', loadChildren: 'app/pages/masters/components/branch/branch.module#BranchModule', canActivate: [CanActivateTeam] },
            { path: 'deliveryordertransfer', loadChildren: 'app/pages/masters/components/DeliveryOrderTransfer/delivery-order-transfer.module#DeliveryOrderTransferModule', canActivate: [CanActivateTeam] },
            { path: 'ruchisoyaconfiguration', loadChildren: 'app/pages/masters/components/itemandmargin/itemandmargin.module#ItemAndMarginrModule', canActivate: [CanActivateTeam] },
            { path: 'PartyLedger/customercategoryList', loadChildren: 'app/pages/masters/components/customercategory/customer-category.module#CustomerCategoryModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/kit-config', loadChildren: 'app/pages/masters/components/kit-config/kitconfig.module#KitConfigModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/unpack', loadChildren: 'app/pages/masters/components/unpacking/unpacking.module#UnpackingModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/comboItem', loadChildren: 'app/pages/masters/components/combo-item/comboitem.module#ComboItemModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/categorymaster', loadChildren: 'app/pages/masters/components/category-master/categorymaster.module#CategoryMasterModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/hcategorymaster', loadChildren: 'app/pages/masters/components/hcategory-master/hcategorymaster.module#hcategorymasterModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/departmentvscategory', loadChildren: 'app/pages/masters/components/departmentvscategories/departmentvscategories.module#DepartmentVsCategoryModule', canActivate: [CanActivateTeam] },
            { path: 'deliveryBoyList', loadChildren: 'app/pages/masters/components/deliveryboy/deliveryBoy.module#DeliveryBoyModule', canActivate: [CanActivateTeam] },

            { path: 'inventory-info/kit-configQualityCheck', loadChildren: 'app/pages/masters/components/kit-configQualityCheck/kitconfigQualityCheck.module#KitConfigQualityCheckModule', canActivate: [CanActivateTeam] },
            { path: 'inventory-info/taxslab', loadChildren: 'app/pages/masters/components/taxslab/taxslab.module#TaxslabModule', canActivate: [CanActivateTeam] },
           

        ]

    }
    
];

export const routing = RouterModule.forChild(routes);