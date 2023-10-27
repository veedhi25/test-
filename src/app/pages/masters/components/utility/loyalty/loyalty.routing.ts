import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { LoyaltyComponent } from "./loyalty.component";
import { LoyaltyListComponent } from "./loyalty-list.component";

const routes: Routes = [
    {
        path: '', component: LoyaltyListComponent,
    },
    {
        path: 'add-loyalty', component: LoyaltyComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    declarations: [

    ],
    exports: [RouterModule]
})
export class LoyaltyRoutingModule {

}