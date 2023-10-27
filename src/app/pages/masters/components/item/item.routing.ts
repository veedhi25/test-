import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ItemPriceChangeFormComponent } from './Item-Price-Change/itemPriceList.component';
import { ItemPriceChangeForm } from './Item-Price-Change/itemPriceChange.component';
import { ItemPropertySettingComponent } from './itempropertysetting/itemPropertySetting.component';
import { PriceDropComponent } from './priceDrop/priceDrop.component';
import { PriceDropListComponent } from './priceDrop/priceDropList.component';

const routes: Routes = [
    { path: 'itempricechange', component: ItemPriceChangeFormComponent },
    {path:'item-property-setting',component:ItemPropertySettingComponent},
    {path:'itempricechange/edit-price',component:ItemPriceChangeForm},
    {path:'priceDrop',component:PriceDropListComponent},
    {path:'priceDrop/addPriceDrop',component:PriceDropComponent}



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemRoutineModule { }
