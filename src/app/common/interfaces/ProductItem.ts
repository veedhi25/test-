import { AlternateUnit, UnitAndQty } from './TrnMain';
//import { TAcList } from './Account';
import { IDivision } from './commonInterface.interface';
import { TAcList } from "./Account.interface";
import { EventEmitter } from "@angular/core";
import { String } from 'shelljs';
export interface Item {
    MCODE: string;
    MENUCODE: string;
    DESCA: string;
    BARCODE: string;
    RATE: number;
    PRATE: number;
    BASEUNIT: string;
    QUANTITY: number;
    ISVAT: number;
    ISSERVICECHARGE: number;
    PTYPE: number;
    CRATE: number;
    EDATE: Date;
    PARENT: string;
    MGROUP: string;
    SUPCODE: string;
    STOCK: number;
    BATCH: string;
    MCategory: string;
    MRP: number;
    //duplicate name cannot remove because it is used my other classes.
    Mcode: string;
    MGroup: string;
    Parent: string;
    Batches: string;
    RangeType: string;
    inputMode: boolean;
}
export interface Product {
    SlabRateId: string;
    TaxSlabName: string;
    DigitsAfterDecimal: string | number;
    CANSALE: string | number;
    CANPURCHASE: string | number;
    DefaultPurchaseUnit: string;
    DefaultSellUnit: string;
    BULKparentItem: any;
    BULKPARENT: any;
    AlternateUnits: AlternateUnit[];
    AltUnit: UnitAndQty;
    Par: Product;
    MajorGroup: Product;
    TRNUSER: string;
    Serial: number;
    PARENTITEM: string;
    MCODE: string;
    MENUCODE: string;
    MCAT2: string;
    MCAT3: string;
    DIV: string;
    ALLOWNEGATIVE: any;
    ISEXEMPTED: number;
    DESCA: string;
    DESCB: string;
    PARENT: string;
    DISCOUNT: number;
    TYPE: string;
    BASEUNIT: string;
    ALTUNIT: string;
    CONFACTOR: number;
    RATE_A: number;
    RATE_B: number;
    RATE_C: number;
    PRATE_A: number;
    PRATE_B: number;
    PRATE_C: number;
    VAT: number;
    MINLEVEL: number;
    MAXLEVEL: number;
    ROLEVEL: number;
    MINQTY: number;
    MAXQTY: number;
    MINWARN: number;
    MAXWARN: number;
    ROWARN: number;
    LEVELS: number;
    BRAND: string;
    MODEL: string;
    MGROUP: string;
    FCODE: number;
    ECODE: number;
    DISMODE: string;

    DISRATE: number;
    DISAMOUNT: number;
    RECRATE: number;
    MARGIN: number;
    PRERATE: number;
    PRESRATE: number;
    DISCONTINUE: number;
    PRERATE1: number;
    PRERATE2: number;
    SCHEME_A: number;
    SCHEME_B: number;
    SCHEME_C: number;
    SCHEME_D: number;
    SCHEME_E: number;
    FLGNEW: number;
    SALESMANID: number;
    TDAILY: number;
    TMONTHLY: number;
    TYEARLY: number;
    VPRATE: number;
    VSRATE: number;
    PTYPE: number;
    NOOFSERIAL: number;
    ZEROROLEVEL: number;
    CRATE: number;
    ISUNKNOWN: number;
    TSTOP: number;
    HASSERIAL: number;
    HASSERVICECHARGE: number;
    TAXGROUP_ID: number;
    REQEXPDATE: number;
    SHELFLIFE: number;
    MODES: string;
    PATH: string;
    ItemImageBase64: string;
    SUPCODE: string;
    LATESTBILL: string;
    MCAT: string;
    MCAT1: string;
    MIDCODE: string;
    SAC: string;
    SRAC: string;
    PAC: string;
    PRAC: string;
    GENERIC: string;
    BARCODE: string;
    DIMENSION: string;
    SUPITEMCODE: string;
    EDATE: Date;
    MAXSQTY: number;
    MultiStockLevels: MultiStockLevel[];
    ItemRateDiscount: RateDiscount;
    WHOUSE: string;
    BRANDCODE: string;
    PCL: string;
    STATUS: number;
    PRODUCTID: string;
    MRP: number;
    HSNCode: number;
    GST: number;
    CESS: number;
    GWEIGHT: number;
    OpeningStock: number;
    InclusiveOfTax: number;
    IN_RATE_A: number;
    IN_RATE_B: number;
    IN_RATE_C: number;
    sellingPrice: number;
    wholesalePrice: number;
    intercompanyPrice: number;
    PTYPE_NAME: string;

    //new Sales
    focusRate: number;
    loyaltyAllowed: number;
    RequiredQTY: number;
    ItemOffer: string;

    //new GST
    SalesTax: number;

    //new Price
    RackNumber: string;
    PriceLevel: string;
    SupplierName: string;
    MFR: string;

    //new General
    FocusPacking: number;
    BatchExpiry: number;

    //Item Group
    HCategory?: number;
    IsEditable?:number;
    variantCombinationDetail: any[];
}
export interface RateGroup {
    RID: number;
    DESCRIPTION: string;
    SHORTNAME: string;
}
export interface RateDiscount {
    MCODE: string;
    DTRRATE: number;
    WSLRATE: number;
    RTLRATE: number;
    FLTRATE: number;
}
export interface ItemRate {
    RateGroup: RateGroup;
    ISNEW: number;
    SNO: number;
    UNIT: string;
    RATETYPE: string;
    RATE: number;
    RATEID: number;
    MCODE: string;
    ExistsInCollection: boolean;
}
export interface MultiStockLevel {
    MCODE: string;
    WAREHOUSE: string;
    ROLEVEL: number;
    MINLEVEL: number;
    MAXLEVEL: number;
}
export interface TBarcode {
    SN: number;
    BCODEID: string;
    SRATE: number;
    BCODE: string;
    MCODE: string;
    UNIT: string;
    ISSUENO: string;
    SUPCODE: string;
    BATCHNO: string;
    REMARKS: string;
    INVNO: string;
    DIV: string;
    FYEAR: string;
    DESCA: string;
    EDATE: Date;
    EXPIRY: Date;

    SupplierAccount: TAcList;
    BCodeDetails: BarcodeDetail[];
    Division: IDivision;
}
export interface BarcodeDetail {
    VALUE: any;
    COL_LENGTH: number;
    DATA_TYPE: string;
    COLUMN_NAME: string;
}

export interface KotCategory {
    ID: number;
    NAME: string;
}
export interface Brand {
    BrandId: string;
    BrandName: string;
    BRANDCODE: string;
    PARENTBRANDCODE: string;
    TYPE: string;
    PCL: string;
    STATUS: string;
    BRANDTYPE: string

}
export interface Model {
    BrandId: string;
    ModelId: string;
    ModelName: string;
}

export interface MenuItem {
    label?: string;
    icon?: string;
    command?: (event?: any) => void;
    url?: string;
    routerLink?: any;
    eventEmitter?: EventEmitter<any>;
    items?: MenuItem[];
    expanded?: boolean;
    disabled?: boolean;
    visible?: boolean;
    target?: string;
    routerLinkActiveOptions?: any;
    menuName: string;
}