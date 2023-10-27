import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Product } from '../../../../common/interfaces/ProductItem';

@Component({
    selector: 'sales-tab',
    templateUrl: './sales.component.html',
    styleUrls: ["../../../Style.css"]
})

export class SalesTab{
    @Input() productObj: Product = <Product>{};
    margin: number;
    marginPercentage: number;
    focusRate: number;
    loyaltyAllowed: number;

    @Output() changeRequireEmit = new EventEmitter()
    @Output() changeDiscountEmit = new EventEmitter();
    @Output() changeOfferEmit = new EventEmitter();
    @Output() changeFocusEmit = new EventEmitter();
    @Output() changeLoyaltyEmit = new EventEmitter();

    constructor(){
        this.focusRate = 0;
        this.loyaltyAllowed = 1;

        this.productObj.focusRate = this.focusRate;
        this.productObj.loyaltyAllowed = this.loyaltyAllowed;
    }

    changeRequiredQTY(){
        this.changeRequireEmit.emit(this.productObj.RequiredQTY);
    }
    changeDiscount(){
        this.changeDiscountEmit.emit(this.productObj.ItemRateDiscount);
    }
    changeOffer(){
        this.changeOfferEmit.emit(this.productObj.ItemOffer);
    }

    onFocusChange(){
        this.productObj.focusRate = this.focusRate;
        this.changeFocusEmit.emit(this.productObj.focusRate);
    }
    onLoyaltyChange(){
        this.productObj.loyaltyAllowed = this.loyaltyAllowed;
        this.changeLoyaltyEmit.emit(this.productObj.loyaltyAllowed)
    }
}