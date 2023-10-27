import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrganizationHierarchyListComponent } from './organization-hierarchy-list.component';
import { OrganizationHierarchyFormComponent } from './add-organization-hierarchy/add-organization-hierarchy.component';

const routes: Routes = [
    { path: '', component: OrganizationHierarchyListComponent },
    { path: 'add-organizationhierarchy', component: OrganizationHierarchyFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganisationHeirarchyRoutingModule { }
