import { Routes, RouterModule } from '@angular/router';
import { CustomerItemMappingComponent } from './customer-item-mapping.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: CustomerItemMappingComponent,

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CustomerItemMappingRoutingModule { }
  