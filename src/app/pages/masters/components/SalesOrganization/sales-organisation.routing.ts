import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesOrganizationListComponent } from './salesorganizationList.component';
import { SalesOrganization } from './salesorganization.component';

const routes: Routes = [
    { path: '', component: SalesOrganizationListComponent },
    { path: 'add-salesorganization', component: SalesOrganization },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesOrganisationRoutingModule { }
