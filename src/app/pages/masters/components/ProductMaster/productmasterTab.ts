import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Product, ItemRate, TBarcode } from '../../../../common/interfaces/ProductItem';
import { AlternateUnit } from '../../../../common/interfaces/TrnMain';
import { SettingService, AppSettings } from "../../../../common/services/index";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';


@Component({
  selector: "productmastertab",
  template: ` <tab [tabTitle]="'Sales'">
            <sales-tab 
            [productObj]="productObj"
            (changeRequireEmit) = "changeRequireEmit($event)"
            (changeDiscountEmit) = "changeDiscountEmit($event)"
            (changeOfferEmit) = "changeOfferEmit($event)"
            (changeFocusEmit) = "changeFocusEmit($event)"
            (changeLoyaltyEmit) = "changeLoyaltyEmit($event)"
            > </sales-tab>
          </tab>

          <tab [tabTitle]="'GST'" > 
            <gst-tab
            [productObj]="productObj"
            (changeInclusiveEmit) = changeTaxEmit($event)
            (changeVATEmit) = changeVATEmit($event)
            (changeHSNEmit) = changeHSNEmit($event)
            (changeInclusiveEmit) = changeInclusiveEmit($event)
            (changeGstEmit) = changeGstEmit($event)
            > </gst-tab>
          </tab>

          <tab [tabTitle]="'Categories'" >
            <category-tab [productObj]="productObj"> </category-tab>
          </tab>

          <tab [tabTitle]="'Others'" >
            <others-tab
            [productObj]="productObj"
            (changeWarehouseEmit) = "changeWarehouseEmit($event)"
            (changeRackEmit) = "changeRackEmit($event)"
            (changeFormulaEmit) = "changeFormulaEmit($event)"> 
            
            </others-tab>
          </tab>

        <tab [tabTitle]="'Pricing Details'">
          <pricingdetailstab  [productObj]="productObj"></pricingdetailstab>
        </tab>`,
})

export class ProductMasterTabComponent implements OnChanges {
  @Input() productObj: Product = <Product>{};
  @Input() MRP: any;
  @Input() AlternateUnits: AlternateUnit[] = [];
  @Input() RGLIST: ItemRate[] = [];
  @Input() PBarCodeCollection: TBarcode[] = [];
  @Input() BrandModelList: any[] = [];
  @Input() EnableMultiStockLevel: boolean;

  //new Sales
  @Output() changedRequire = new EventEmitter()
  @Output() changedDiscount = new EventEmitter()
  @Output() changedOffer = new EventEmitter()
  @Output() changedFocus = new EventEmitter()
  @Output() changedLoyalty = new EventEmitter()

  //new GST
  @Output() changedTax = new EventEmitter();
  @Output() changedVAT = new EventEmitter();
  @Output() changedHSN = new EventEmitter();
  @Output() changedInclusive = new EventEmitter();
  @Output() changedGst = new EventEmitter();

  //new Others
  @Output() changedWarehouse = new EventEmitter();
  @Output() changedRack = new EventEmitter();
  @Output() changedFormula = new EventEmitter();

  AppSettings: AppSettings;
  constructor(private setting: SettingService,) {
    // this.productObj.MRPGSTExclusive = 0;
    // this.productObj.MRPGSTInclusive = 0;
    // this.productObj.SellingPriceGSTExclusive = 0;
    // this.productObj.SellingPriceGSTInclusive = 0;
    // this.productObj.MRPGSTExclusive = 0;

    try {
      this.AppSettings = this.setting.appSetting;
    } catch (ex) {
      alert(ex);
    }
  }

  //new GST
  changeTaxEmit(event) {
    this.changedTax.emit(event);
  }
  changeVATEmit(event) {
    this.changedVAT.emit(event);
  }
  changeHSNEmit(event) {
    this.changedHSN.emit(event);
  }
  changeInclusiveEmit(event) {
    this.changedInclusive.emit(event);
  }
  changeGstEmit(event) {
    this.changedGst.emit(event);
  }

  //new Sales

  changeRequireEmit(event) {
    this.changedRequire.emit(event);
  }
  changeDiscountEmit(event) {
    this.changedDiscount.emit(event);
  }
  changeOfferEmit(event) {
    this.changedOffer.emit(event);
  }
  changeFocusEmit(event) {
    this.changedFocus.emit(event);
  }
  changeLoyaltyEmit(event) {
    this.changedLoyalty.emit(event);
  }

  //new Others
  changeWarehouseEmit(event) {
    this.changedWarehouse.emit(event);
  }
  changeRackEmit(event) {
    this.changedRack.emit(event);
  }
  changeFormulaEmit(event) {
    this.changedFormula.emit(event);
  }

  ngOnChanges() {
  }

  changeMRPExclusive() {
    // if(this.productObj.GST == undefined)
    // {
    //   this.productObj.GST = 0;
    // }
    // this.productObj.MRPGSTInclusive = (+this.productObj.MRPGSTExclusive) + (+((this.productObj.GST*this.productObj.MRPGSTExclusive)/100)) ;
  }

  forTest() {
    return 'i am a child';
  }

  changeMRPInclusive() {
    // if(this.productObj.GST == undefined)
    // {
    //   this.productObj.GST = 0;
    // }
    // this.productObj.MRPGSTExclusive = (+this.productObj.MRPGSTInclusive)-(+((this.productObj.GST*this.productObj.MRPGSTExclusive)/100)) ;

  }

  changeSellingPriceExclusive() {
    // if(this.productObj.GST == undefined)
    // {
    //   this.productObj.GST = 0;
    // }
    // this.productObj.SellingPriceGSTInclusive = (+this.productObj.SellingPriceGSTExclusive) + (+((this.productObj.GST*this.productObj.SellingPriceGSTExclusive)/100)) ;
  }

  changeSellingPriceInclusive() {
    // if(this.productObj.GST == undefined)
    // {
    //   this.productObj.GST = 0;
    // }
    // this.productObj.SellingPriceGSTExclusive = (+this.productObj.SellingPriceGSTInclusive)-(+((this.productObj.GST*this.productObj.SellingPriceGSTExclusive)/100)) ;


  }

  changeLandingPriceExclusive() {
    // if(this.productObj.GST == undefined)
    // {
    //   this.productObj.GST = 0;
    // }
    // this.productObj.LandingPriceGSTInclusive = (+this.productObj.LandingPriceGSTExclusive) + (+((this.productObj.GST*this.productObj.LandingPriceGSTExclusive)/100)) ;
  }

  changeLandingPriceInclusive() {
    // if(this.productObj.GST == undefined)
    // {
    //   this.productObj.GST = 0;
    // }
    // this.productObj.LandingPriceGSTExclusive = (+this.productObj.LandingPriceGSTInclusive)-(+((this.productObj.GST*this.productObj.LandingPriceGSTExclusive)/100)) ;


  }

  changeInclusive(inclusive, exlusive) {
    //if(inclusive == "MRP")

  }


}