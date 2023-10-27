import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SchemeViewComponent } from './scheme-view.component';

const routes: Routes = [
    { path: '', component: SchemeViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchemeViewRoutingModule { }
