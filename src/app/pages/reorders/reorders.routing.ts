import { Routes, RouterModule } from '@angular/router';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { AutoIndentComponent } from './components/AutoIndent/AutoIndent.component';
import { ReorderComponent } from './components/reorder/reorder.component';
import { Reorders } from './reorders.component';
// import { purchaseDataComp } from "./components/AdditionalCost/purchaseData.component";

const routes: Routes = [
    {
        path: '',
        component: Reorders,
        children: [
        
             { path: 'reorder', component: ReorderComponent, canActivate: [CanActivateTeam] },
        ]

    }
];

export const routing = RouterModule.forChild(routes);