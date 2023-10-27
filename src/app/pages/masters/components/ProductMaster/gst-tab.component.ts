import {Component, Input, Output, ViewChild} from '@angular/core';
import { EventEmitter } from '@angular/core';
import {Product} from "../../../../common/interfaces/ProductItem";
import { ProductMasterTabComponent } from './productmasterTab';

@Component({
    selector: 'gst-tab',
    templateUrl: './gst-tab.component.html',
    styleUrls: ["../../../Style.css"]
})
export class GSTTabComponent{

    @Input() productObj: Product = <Product>{};

    @ViewChild(ProductMasterTabComponent) child:ProductMasterTabComponent;

    @Output() changeGstEmit = new EventEmitter();
    @Output() changeInclusiveEmit = new EventEmitter();
    @Output() changeTaxEmit = new EventEmitter();
    @Output() changeVATEmit = new EventEmitter();
    @Output() changeHSNEmit = new EventEmitter();

    changeTax(){
        this.changeTaxEmit.emit(this.productObj.SalesTax)
    }
    changeVAT(){
        this.changeVATEmit.emit(this.productObj.VAT);
    }
    changeHSN(){
        this.changeHSNEmit.emit(this.productObj.HSNCode);
    }
    changeInclusive(){
        this.changeInclusiveEmit.emit(this.productObj.InclusiveOfTax);
    }

    changeGST()
    {
        // this.child.changeMRPInclusive();
        // this.child.changeSellingPriceInclusive();
        // this.child.changeLandingPriceInclusive();

        // this.child.changeMRPExclusive();
        // this.child.changeSellingPriceExclusive();
        // this.child.changeLandingPriceExclusive();
        console.log(this.productObj.GST);
        var gstString = this.productObj.GST.toString();
        this.changeGstEmit.emit(gstString);
    }
}