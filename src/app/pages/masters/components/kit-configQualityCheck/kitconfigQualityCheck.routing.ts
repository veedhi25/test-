import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { KitConfigQualityComponent } from './kitconfigQualityCheck.component';




const routes: Routes = [
    { path: '', component: KitConfigQualityComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KitConfigQualityRoutingModule { }
