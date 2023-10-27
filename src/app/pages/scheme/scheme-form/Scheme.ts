export interface Scheme{
    DisID: number;
    SchemeName: string;
    ScheduleID: number;
    SchemeType: string;
    DiscountType: string;
    OfferOn: string;
    Account:string;
    AccountName:string;
    CustomerType:string;
    VAT:number;
    offerFamily:string;
    slabDiscountType :string;
    SchemeList:SchemeList[];
    outletList:any[];

}

export interface SchemeList{
   DisID:number;
   Mgroup:string;
   Parent:string;
   Mcode:string;
   DisRate:number;
   DisAmount:number;
   ReceipeID:string;
   Priority:number;
   ScheduleID:number;
   SchemeName:string;
   GreaterThan:number;
   LessThan:number;
   comboId:string;
   Quantity:number;
   DiscountQuantity:number;
   SchemeType:string;
   VAT:number;
   DiscountType:string;
    MCategory:string;
    DiscountRateType:number;
    Offeron:string;
    CustomerType:string;
    Account:string;
    DESCA:string;
    MENUCODE:string;
    slabDiscountType :string;
    Rate_A:number;
    offerFamily:string;
    DisItemCode:string;
    DisItemName:string;
    amtLimit:number;
    qtyLimit:number;
}