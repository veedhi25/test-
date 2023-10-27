import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClaimTypeListComponent } from './claim-type-list.component';
import { ClaimTypeActionComponent } from './claim-type-action/claim-type-action.component';

const routes: Routes = [
    { path: '', component: ClaimTypeListComponent },
    { path: 'add-claim-type', component: ClaimTypeActionComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClaimTypeRoutingModule { }
