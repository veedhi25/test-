export class LoadChartModel {

    VOUCHERNO: string;
    DATE:String;
    VEHICLENO: string;
    DRIVERNAME: string;
    DRIVERLISCENSENO: string;
    SALESMANNAME: string;
    ROUTENO: string;
    TOTALWEIGHT:number;
    TOTALNUMBEROFBILLS:number;
    TOTALTAXABLE:number;
    TOTALAMOUNT:number;
    SalesVoucher: SalesVoucher[] = [];
    REFBILL =[];
    COLLECTIONSHEET =[];
    ITEMSUMMARY:SUMMARY[]=[]
    MODE:string;
    VTYPE:string;
  }


  export interface SUMMARY{
    TAXABLE: any;
    VOUCHERENO:string;
    MCODE:string;
    ITEMDESC:string;
    BATCH:string;
    MRP:string;
    MFGDATE:string;
    EXPDATE:string;
    QUANTITY:number;
    WEIGHT:number;
    NETAMOUNT:number;
    CLD:number;
    PCS:number;
    RealQty:number;
    CONFACTOR:number
  }

  export class SalesVoucher {
  
    SalesVoucherNumber: string;
    ClientName: string;
    Address: string;
    Phone: string;
    SalesVoucherItem: SalesVoucherItem[];
  
  }
  
  export class SalesVoucherItem {
  
    SalesVoucherNumber: string;
    ItemCode: string;
    ItemDescription: string;
    Quantity: string;
    BaseUnit: string;
    AltUnit: string;
    Weight: string;
    Amount: string;
  }
  
  