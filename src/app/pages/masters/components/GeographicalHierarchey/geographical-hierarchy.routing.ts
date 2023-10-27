import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GeographicalHierarchyListComponent } from './geographical-hierarchy-list.component';
import { GeographicalHierarchyComponent } from './geographical-hierarchy.component';

const routes: Routes = [
    { path: '', component: GeographicalHierarchyListComponent },
    { path: 'add-geograhphicalHeirarchy', component: GeographicalHierarchyComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeographicalHierarchyRoutingModule { }
