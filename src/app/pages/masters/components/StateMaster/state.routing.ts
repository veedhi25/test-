import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StateListComponent } from './StateList';
import { StateFormComponent } from './StateEntry';

const routes: Routes = [
    { path: '', component: StateListComponent },
    { path: 'addstate', component: StateFormComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StateRoutingModule { }
