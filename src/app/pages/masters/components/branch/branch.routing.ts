import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BranchListComponent } from './branch-list.component';
import { BranchComponent } from './branch.component';

const routes: Routes = [
    { path: '', component: BranchListComponent },
    { path: 'Branch', component: BranchComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchRoutingModule { }
