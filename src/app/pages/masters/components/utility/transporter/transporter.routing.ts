import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransporterListComponent } from './transporter-list.component';
import { TransporterComponent } from './transporter.component';

const routes: Routes = [
    { path: '', component: TransporterListComponent },
    {path:'add-transporter',component:TransporterComponent},



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransporterRoutingModule { }
