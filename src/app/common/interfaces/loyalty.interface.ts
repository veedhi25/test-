export class Loyalty {
    LCODE: number;
    LNAME: String;
    MINREDEEMAMNT: number;
    STATUS: string;
    cus_category: string='walkin';
    RANGE: Range[];
    outletList:any[];

}

export class Range {
    LCODE: number;
    MINAMNT: number;
    MAXAMNT: number;
    INCREMENTALVALUE: number;
    EARNPOINTS: number;
}