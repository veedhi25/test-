import { DecimalPipe } from "@angular/common";

export interface IRateGroup {
  rid: number;
  description: string;
  shortName: string;
}

export interface IDivision {
  DEFAULTBILLUNIT: any;
  BILLPREFIX: string;
  Mode: string;
  ENABLESTRIPPCSQTY: any;
  INITIAL: string;
  NAME: string;
  REMARKS: string;
  MAIN: number;
  COMNAME: string;
  COMADD: string;
  COMID: string;
  ACID: string;
  ID: string;
  MSG1: string;
  MSG2: string;
  MSG3: string;
  RATEGROUPID: number;
  rateGroup: IRateGroup;
  BRANCH: string;
  BRANCHNAME: string;
}

export interface UserCouponList {
  CouponListValue: string;
  MaxDiscount: string;
  Expiry: string;
  DiscountType: string;
  AppliedMaxBalance: string;
}
export interface Warehouse_Location {
  WAREHOUSE: string;
  LOC_NAME: string;
  LOC_ID: string;
}

export interface WAREHOUSE {
  NAME: string;
  ADDRESS: string;
  PHONE: string;
  REMARKS: string;
  ISDEFAULT: Boolean;
  IsAdjustment: number;
  AdjustmentAcc: string;
  ISVIRTUAL: number;
  VIRTUAL_PARENT: string;
  DIVISION: string;
  ISDELWARE: number;
  WID: number;
  warehouseLocation: Warehouse_Location[];
}

export interface Salesman {
  NAME: string;
  SALESMANID: number;
  DOB: Date;
  ADDRESS: string;
  TELNO: string;
  MOBILE: string;
  EMAIL: string;
  OPBAL: number;
  SALESMANTYPECODE: string;
  STATUS: number;
  mappedItemList: any[];
}
export interface ITEMWISESALESMANMAPPING {
  SALESMANNAME: string;
  SALESMANID: number;
  STATUS: number;
  MCODE: string;
  COMISSION: number;
  DESCA: string;
}

export interface BatchStock {
  MCODE: string;
  BCODE: string;
  EXPIRY: Date;
  UNIT: string;
  BATCH: string;
  RATE_A: number;
  RATE_B: number;
  PRATE: number;
  CRATE: number;
  STOCK: number;
  SCHEMENAME: string;
  SCHEMERATE: number;
  ISSCHEMERATEBYAMOUNT: boolean;
  WAREHOUSE: string;
  SUPPLIER: string;
  FREEITEMS: BatchStock[];
  MANUFACTURER: string;
  MFGDATE: Date;
  MRP: number;
  SRATE: number;
  BRANCH: string;
  STAMP: Date;
  WAREHOUSETYPE: string;
}
