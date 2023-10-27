import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component'
import { BarCodeComponent } from './components/BarCodeSetting/bar-code.component';
import { EanCodeComponent } from './components/ean-code-management/ean-code-management.component';
import { ConfigBarCodeComponent } from './components/ConfigBarCode/configBarCode.component';
import { BarcodeMappingComponent } from './components/BarcodeMapping/BarcodeMapping.component';
import { SupplierItemCodeVsBposItemCode } from './components/supplieritemcodevsbpositemcode/supplieritemcodevsbpositemcode.component';

const routes: Routes = [
    {
        path: '', component: SettingsComponent,
        children: [
            { path: 'bar-code', component: BarCodeComponent },
            { path: 'eancode', component: EanCodeComponent },
            { path: 'config-bar-code', component: ConfigBarCodeComponent },
            { path: 'barcodeMapping', component: BarcodeMappingComponent },
            { path: 'supplieritemcodevsbpositemcode', component: SupplierItemCodeVsBposItemCode },
        ]
    }
]

export const routing = RouterModule.forChild(routes);