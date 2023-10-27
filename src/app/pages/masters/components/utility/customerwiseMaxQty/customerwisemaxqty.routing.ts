import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CustomerWiseMaxQuantityListComponent } from './customerwisemaxqtylist.component';
import { CustomerWiseMaxQuantityComponent } from './customerwisemaxqty.component';

const routes: Routes = [
    {
        path: '',
        component: CustomerWiseMaxQuantityListComponent,

    },
    {
        path: 'addnew',
        component: CustomerWiseMaxQuantityComponent,

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CustomerWiseMaxQuantityRoutingModule { }
  