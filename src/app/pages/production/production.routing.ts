import { Routes, RouterModule } from '@angular/router';
import { CanActivateTeam } from '../../common/services/permission/guard.service';
import { BOMComponent } from './components/bom/bom.component';
import { ProductionEntryComponent } from './components/production-entry/production-entry.component';
import { ProductionQualityCheckComponent } from './components/production-quality-check/production-quality-check.component';
import { ProductionTargetComponent } from './components/production-target/production-target.component';
import { ProductionComponent } from './production.component';

const routes: Routes = [
    {
        path: '',
        component: ProductionComponent,
        children: [

            { path: 'bom', component: BOMComponent, canActivate: [CanActivateTeam] },
            { path: 'production-target', component: ProductionTargetComponent, canActivate: [CanActivateTeam] },
            { path: 'production-entry', component: ProductionEntryComponent, canActivate: [CanActivateTeam] },
            { path: 'production-quality-check', component: ProductionQualityCheckComponent, canActivate: [CanActivateTeam] }

        ]

    }
];

export const productionrouting = RouterModule.forChild(routes);
