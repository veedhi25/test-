import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouteMasterListComponent } from './route-master-list.component';
import { RouteMasterComponent } from './route-master.component';

const routes: Routes = [
    { path: '', component: RouteMasterListComponent },
    { path: 'add-routemaster', component: RouteMasterComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RouteMasterRoutingModule { }
