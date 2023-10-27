import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { Product } from '../../../../common/interfaces/ProductItem';
import { MasterRepo } from "../../../../common/repositories";


@Component({
  selector: "pricingdetailstab",
  templateUrl:'./PricingDetailsTabComponent.html',

  styleUrls: ["../../../Style.css"],
})

export class PricingDetailsTabComponent {
    sellingPrice:number;
    @Input() productObj: Product = <Product>{};
    margin: number;
    marginPercent: number;
    MCat1List: any[] = [];

    @Output() changeSPemit = new EventEmitter();
    @Output() changePurchaseEmit = new EventEmitter();
    @Output() changeSupplierEmit = new EventEmitter();
    @Output() changeMFREmit = new EventEmitter();

    constructor( private masterService: MasterRepo ){
      this.masterService.getMCat1List().subscribe(res => { this.MCat1List.push(<any>res); });
    }
    
    marginCalculation(){
      this.margin = this.productObj.sellingPrice -this.productObj.PRATE_A;
      this.marginPercent =this.margin*100/ this.productObj.PRATE_A;
  
  }

  changePurchase(){
    this.changePurchaseEmit.emit(this.productObj.PRATE_A);
  }

  changeSellingPrice(){
    this.changeSPemit.emit(this.productObj.sellingPrice);
  }

  changeMRP(){
    this.productObj.sellingPrice = this.productObj.MRP;
    this.marginCalculation()
}

  changeSupplier(){
    this.changeSupplierEmit.emit(this.productObj.SupplierName);
  }
  changeMFR(){
    this.changeMFREmit.emit(this.productObj.MFR)
  }
  
}
