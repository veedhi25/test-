import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TenderTypeListComponent } from './tender-type-list.component';
import { TenderTypeComponent } from './add-tender-type/add-tender-type.component';

const routes: Routes = [
    { path: '', component: TenderTypeListComponent },
    {path:'add-tendertype',component:TenderTypeComponent},



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TenderTypeRoutingModule { }
