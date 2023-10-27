import { NgModule } from "@angular/core";
import { CustomerCategoryRoutingModule } from "./customer-category.routing";
import { CustomerCategoryComponent } from "./customer-category.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CustomerCategoryService } from "./customer-category.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { CustomerCategoryListComponent } from "./customer-category-list.compoent";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";


@NgModule({
    imports: [
        CommonModule,
        CustomerCategoryRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2SmartTableModule,

        GenericPopupGridModule.forRoot(),
        IMSGridModule.forRoot()
    ],
    declarations: [
        CustomerCategoryComponent,
        CustomerCategoryListComponent
    ],
    providers: [
        CustomerCategoryService,
        TransactionService
    ]
})
export class CustomerCategoryModule { }
