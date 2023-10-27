import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../common/interfaces/ProductItem';
import { SettingService, AppSettings } from "../../../../common/services/index";

@Component({
  selector: "producthometab",
  template: `
  <hometabs [selectedNode]="selectedNode">
        <hometab [tabTitle]="'Product List'" >
          <productlist [source]="source" (searchItemEmit)="searchItemEmitEvent($event)"></productlist>
        </hometab>    
          <hometab [tabTitle]="'Add Group'">
               <addproductgroup [selectedNode]="selectedNode" [productObj]="productObj"></addproductgroup>
        </hometab>
          <hometab [tabTitle]="'Add Product'">
          <addproductmaster [productObj]="productObj"></addproductmaster>
        </hometab>    
</hometabs>`,
})

export class ProductHomeTabComponent {
  AppSettings: AppSettings;
  @Input() source;
  @Input() selectedNode;
  @Input()productObj:Product;
  @Output() searchItemEmit=new EventEmitter();
   constructor(private setting: SettingService) {
    try {
      this.AppSettings = this.setting.appSetting;
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  searchItemEmitEvent(value){
this.searchItemEmit.emit(value);
  }
}