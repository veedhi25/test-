import { Routes, RouterModule } from '@angular/router';
import { Inventory } from './inventory.component';
import { BranchInComponent } from "./components/branch-in/branch-in.component";
import { StockIssueComponent } from "./components/stock-issue/stock-issue.component";
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { BranchOutComponent } from "./components/branch-out/branch-out.component";
import { StockSettlementComponent } from './components/stock-settlement/stockSettlement.component';
import { OpeningStockEntryComponent } from './components/openingStockEntry/openingStockEntry';
import { InterCompanyTransferOutComponent } from './components/CompanyTransferOut/CompanyTransferOut';
import { RepackEntryComponent } from './components/repackEntry/repackEntry.component';

const routes: Routes = [
    {
        path: '',
        component: Inventory,
        children: [

            { path: 'add-stock-issue', component: StockIssueComponent, canActivate: [CanActivateTeam] },
            { path: 'branch-in', component: BranchInComponent, canActivate: [CanActivateTeam] },
            { path: 'branch-out', component: BranchOutComponent, canActivate: [CanActivateTeam] },
            { path: 'StockSettlementEntry', component: StockSettlementComponent,canActivate:[CanActivateTeam] },
            { path: 'StockSettlementEntryApproval', component: StockSettlementComponent ,canActivate:[CanActivateTeam]},
            { path: 'openingstockentry', component: OpeningStockEntryComponent, canActivate: [CanActivateTeam] },
            { path: 'repackentry', component: RepackEntryComponent, canActivate: [CanActivateTeam] }

        ]

    }
];

export const routing = RouterModule.forChild(routes);
