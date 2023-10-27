import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ItemAndMarginComponent } from './itemandmargin.component';

const routes: Routes = [
    { path: '', component: ItemAndMarginComponent },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemAndMarginRoutingModule { }
