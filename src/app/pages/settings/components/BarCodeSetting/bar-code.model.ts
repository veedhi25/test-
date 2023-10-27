import { FlowAssignment } from "typescript";

export interface BarCodeModel {
    Sno: number,
    Code: string;
    Item: string;
    Batch: string;
    Rate: string;
    QTY: number;
    ExpDate: Date;
    Stock: string;
    MRP: number;
    BarCode: string;
    ConvType: string;
    PrintedQTY: number;
    VARIANTLIST: any;
    checkFlagEAN: any;
    ConfigParaTitle: string;
    VARIANTDETAIL: any;
    VCHRNO: string;
    UUID: string;
    CONFACTOR: any;
    ALTUNIT: any;
    PhiscalID: string;
    PRATE: number;
    MFGDATE: string;
    DIVISION: string;
    UNIT: string;
    BID: string;
    HSNCODE: string;
    BCODEID: string;
}