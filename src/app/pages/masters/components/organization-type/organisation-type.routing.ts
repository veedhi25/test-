import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrganizationTypeListComponent } from './organization-type-list.component';
import { OrganizationTypeFormComponent } from './add-organization-type/organization-type.component';

const routes: Routes = [
    { path: '', component: OrganizationTypeListComponent },
    { path: 'add-organizationtype', component: OrganizationTypeFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganisationTypeRoutingModule { }
