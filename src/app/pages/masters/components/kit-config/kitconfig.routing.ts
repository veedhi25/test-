import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { KitConfigComponent } from './kitconfig.component';



const routes: Routes = [
    { path: '', component: KitConfigComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KitConfigRoutingModule { }
