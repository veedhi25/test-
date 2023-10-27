import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesTerminalListComponent } from './sales-terminal-list.component';
import { SalesTerminalComponent } from './sales-terminal.component';

const routes: Routes = [
    { path: '', component: SalesTerminalListComponent },
    { path: 'add-sales-terminal', component: SalesTerminalComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesTerminalRoutingModule { }
