//import components

import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { NgaModule } from '../../theme/nga.module';
import { ModalModule } from 'ng2-bootstrap';
import { GenericPopupGridModule } from '../../common/popupLists/generic-grid/generic-popup-grid.module';
import { Ng2SmartTableModule } from '../../node_modules/ng2-smart-table/src/ng2-smart-table.module';
import { CommonModule } from '@angular/common';
import TreeModule from 'angular-tree-component';
import { routing } from './settings-routing.module';
import { BarCodeComponent } from './components/BarCodeSetting/bar-code.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { popupListModule } from '../../common/popupLists/popuplist.module';
import { EanCodeComponent } from './components/ean-code-management/ean-code-management.component';
import { ConfigBarCodeComponent } from './components/ConfigBarCode/configBarCode.component';
import { BarcodeMappingComponent } from './components/BarcodeMapping/BarcodeMapping.component';
import { SupplierItemCodeVsBposItemCode } from './components/supplieritemcodevsbpositemcode/supplieritemcodevsbpositemcode.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../common/shared.module';


@NgModule({
    imports: [
        CommonModule,
        NgaModule,
        ModalModule.forRoot(),
        TreeModule,
        routing,
        Ng2SmartTableModule,
        GenericPopupGridModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        popupListModule,
        SharedModule,
        NgxPaginationModule
    ],
    declarations: [
        SettingsComponent,
        BarCodeComponent,
        EanCodeComponent,
        ConfigBarCodeComponent,
        BarcodeMappingComponent,
        SupplierItemCodeVsBposItemCode
    ],
    providers: [TransactionService]
})

export class SettingsModule { }