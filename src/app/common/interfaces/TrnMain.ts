import { NumericDictionaryIterator } from 'lodash';
import { TAcList } from './Account.interface';
import { Product } from "./ProductItem";
export interface TrnMain {
    DLNO1: any;
    DLNO2: any;
    DLNO3: any;
    DLNO4: any;
    OpticalEyeDetails: any[];
    fileList: FileList;
    loyaltyunredeemable: boolean;
    //billOfferOnlyForHold: any;
    holdstock: boolean;
    SELECTEDVARIANT: string;
    VARIANT: string;
    VARIANTNAME: string;
    BARCODEPRINTMULTIPLIER: number;
    BILLINGSTATUS: string;
    customerID : string;
    ISREMARKSCOMPULSORY: boolean;
    Mode: string;
    NextVno: string;
    TotalWithIndDiscount: number;
    guid: string;
    ReplaceIndividualWithFlatDiscount: number;
    TOTALINDDISCOUNT: number;
    TOTALLOYALTY: number;
    TOTALPROMOTION: number;
    TOTALFLATDISCOUNT: number;
    COSTCENTER: string;
    RECEIVEBY: string;
    STATUS: number;
    ConvertedToPOStatus: string;
    CONFIRMEDBY: string;
    CONFIRMEDTIME: string;
    PhiscalID: string;
    Stamp: number;
    Customer_Count: number;
    DBUSER: string;
    HOSTID: string;
    ORDERS: number;
    REFORDBILL: string;
    INDDIS: number;
    CREBATE: number;
    CREDIT: number;
    DUEDATE: Date | string;
    TRNAC: string;
    PARAC: string;
    TRNACName: string;
    PARTRNAMNT: number;
    PAYTMREQUESTID: string;
    RETTO: string;
    REFBILL: string;
    REFBILLDATE: string;
    CHEQUENO: string;
    CHEQUEDATE: Date | string;
    EDATE: Date | string;
    POST: number;
    POSTUSER: string;
    FPOSTUSER: string;
    SHIFT: string;
    EXPORT: number;
    CHOLDER: string;
    CARDNO: string;
    EditUser: string;
    MEMBERNO: string;
    MEMBERNAME: string;
    EDITED: number;
    VMODE: number;
    BILLTOTEL: string;
    BILLTOMOB: string;
    CUSTOMERID: string;
    TRN_DATE: Date | string;
    BS_DATE: string;
    STAX: number;
    TOTALCASH: number;
    TOTALCREDIT: number;
    TOTALCREDITCARD: number;
    TOTALGIFTVOUCHER: number;
    CardTranID: string;
    ReturnVchrID: string;
    TranID: number;
    VoucherStatus: string;
    PRESCRIBEBY: string;
    DISPENSEBY: string;
    Longitude: string;
    Latitude: string;
    MobileNo: string;
    DeliveryDate: Date | string;
    ExpectedDeliveryDate: Date | string;
    DeliveryAddress: string;
    DeliveryTime: string;
    DeliveryMiti: string;
    OrderNo: string;
    ADJWARE: string;
    BATCHNO: string;
    BATCHNAME: string;
    DPSNO: string;
    EDITTIME: string;
    EID: string;
    EXTRACHARGE: string;
    ISSUEWARE: string;
    ADVANCE: number;
    VoucherType: VoucherTypeEnum;
    VoucherAbbName: string;
    VoucherName: string;
    VoucherPrefix: string;
    NextNumber: number;
    SalesManID: string;
    VCHRNO: string;
    CHALANNO: string;
    DIVISION: string;
    TRNDATE: Date | string;
    RFQValidity: Date | string;
    ExpDate: Date | string;
    BSDATE: string;
    TRNTIME: string;
    TOTAMNT: number;
    DCAMNT: number;
    DCRATE: number;
    VATAMNT: number;
    NETAMNT: number;
    TRNMODE: string;
    TAXABLE: number;
    NONTAXABLE: number;
    BILLTO: string;
    BILLTOADD: string;
    TRNUSER: string;
    TERMINAL: string;
    TENDER: number;
    CHANGE: number;
    ROUNDOFF: number;
    NETWITHOUTROUNDOFF: number;
    ServiceCharge: number;
    IsTable: boolean;
    IsVATBill: boolean;
    VATBILL: number;
    REMARKS: string;
    VoucherNumber: number;
    MWAREHOUSE: string;
    TrntranList: Trntran[];
    AdditionTranList: Trntran[];
    ProdList: TrnProd[];
    SupplierListForRfq: any[];
    AdditionProdList: TrnProd[];
    AdditionProdListForSO: TrnProd[];

    FCurrency: string;
    EXRATE: number;
    TOTALDISCOUNT: number;
    TOTALDISCOUNT_VATINCLUDED: number;
    CREDITDAYS: number;
    InvAmount: number;
    DiscRate: number;
    RoundOffAmount: number;
    ManualDiscount: number;
    BRANCH: string;
    BALANCE: number;
    LCODE: string;
    CurrentBillLoyatly: number;
    CustomerLoyalty: number;
    TOTALQTY: number;
    TOTALWEIGHT: number;
    AdditionalObj: TrnMain_AdditionalInfo
    SHIPNAME: string;
    SHIPNAMEOBj: any;
    BILLNAME: string;
    BILLNAMEOBj: any;
    INVOICETYPE: string;
    TRNTYPE: string;
    TenderList: TBillTender[];
    PARTY_ORG_TYPE: string;
    HOLDBILLID: number;
    TransporterEway: Transporter_Eway;
    IsAccountBase: boolean;
    hasShipName: boolean;
    tag: string;
    printStringForPos: string
    JOBNO: string;
    AdvanceAdjustmentObj: any;
    ISMANUALRETURN: boolean;
    TOTALDISCOUNTINRETRUN: number;
    shipToDetail: SHIPTODETAIL;
    billToDetail: BILLTODETAIL;
    TOTALNETWEIGHT: number;
    COMPANYID: String;
    TOTALCLDQUANTITY: number;
    ALT_TOTFLATDISCOUNT: number;
    PARTY_GSTTYPE: string;
    CDRATE: number;
    CDAMT: number;
    EditModeNetAMount: number;
    itemDivision: string;
    itemDivisionList: any[];
    customerMCAT: string;
    requestId: string;
    TRNSCHEMEAPPLIED: TRNSCHEMEAPPLIED[];
    CUS_CATEGORY_NAME: string;
    CUS_CATEGORY_PRICELEVEL: string;
    CUS_CATEGORY_PRICELEVEL_LABEL: string;
    CUS_PREVlOYALTY: number;
    serialNo: number;
    offerList: schemeForCalculationClass[];//just to hold the offer list not for save
    billoffer: string;
    billOfferOnlyForHold: schemeForCalculationClass;//not for save
    partyDetail: TAcList;
    PARTY_GSTNO: string;
    totalAdvanceAvailable: number;
    AdvanceAmountReferenceNo: string;
    selectedRRNList: any[];
    
}
export interface BULKITEM {
    MCODE: string;
    ITEMDESC: string;
    WEIGHT: number;
    GWEIGHT: number;
    PRATE: number;
    RATE: number;
    STOCK: number;
    PACKED: number;
    AVAIL: number;
    BASEUNIT: string;
}
export interface TRNSCHEMEAPPLIED {
    VCHRNO: string;
    MCODE: string;
    DIVISION: string;
    PHISCALID: string;
    COMPANYID: string;
    SCHEMENO: string;
    SCHEMEPERCENT: number;
    SCHEMEAMOUNT: number;
}
export interface SHIPTODETAIL {
    ACNAME: string;
    ADDRESS: string;
    ADDRESS2: string;
    LANDMARK: string;
    AREA: string;
    CITY: string;
    PINCODE: string;
    MOBILE: string;
    EMAIL: string;
    CUSTOMERTYPE: string;
    STATE: string;
    STATENAME: string;
}
export interface BILLTODETAIL {
    ACNAME: string;
    ADDRESS: string;
    ADDRESS2: string;
    LANDMARK: string;
    AREA: string;
    CITY: string;
    PINCODE: string;
    MOBILE: string;
    EMAIL: string;
    CUSTOMERTYPE: string;
    STATE: string;
    STATENAME: string;
}
// export interface S{
//     QtyAddedTOPO :
// }

export interface TrnProd {
    TaxSLABRATEID: string;
    TaxSLABRATEDETAILS: any[];
    DigitsAfterDecimal: number;
    serialItemList: SerialItem[];
    NOOFSERIALITEMHAS: number;
    SchemeDiscount: number;
    DefaultSellUnit: string;
    DefaultPurchaseUnit: string;
    INDCDRATE: number;
    VARIANTDESCA: string;
    SCHEMESAPPLIED: string;
    VARIANTLIST: any[];
    TOTALDISCOUNTINRETRUN: number;
    INDDISCOUNT: number;
    FLATDISCOUNT: number;
    NETAMOUNT: number;
    LOYALTY: number;
    PROMOTION: number;
    ISSERVICECHARGE: number;
    ISVAT: number;
    ADDTIONALROW: number;
    COSTCENTER: string;
    VCHRNO: string;
    CHALANNO: string;
    DIVISION: string;
    MCODE: string;
    UNIT: string;
    Quantity: number;
    ReceivedQuantityMR: number;
    ReturnQuantityMR: number;
    AvailableQuantity: number;
    QtyAddedToPO: number;
    ConvertedToPOStatus: string;
    FreeQuantity: number;
    RealQty: number;
    AltQty: number;
    RATE: number;
    AMOUNT: number;
    DISCOUNT: number;
    INDODAMT: number;
    VAT: number;
    REALRATE: number;
    EXPORT: number;
    IDIS: string;
    OPQTY: number;
    REALQTY_IN: number;
    ALTQTY_IN: number;
    WAREHOUSE: string;
    REFBILLQTY: number;
    SPRICE: number;
    EXPDATE: Date | string;
    EXPDATE_DDMMYYYY: string;
    REFOPBILL: number;
    ALTUNIT: string;
    TRNAC: string;
    PRATE: number;
    VRATE: number;
    ALTRATE: number;
    VPRATE: number;
    VSRATE: number;
    TAXABLE: number;
    NONTAXABLE: number;
    SQTY: number;
    REMARKS: string;
    INVRATE: number;
    EXRATE: number;
    NCRATE: number;
    CRATE: number;
    SNO: number;
    CUSTOM: number;
    WEIGHT: number;
    DRATE: number;
    CARTON: number;
    INVOICENO: string;
    ISSUENO: string;
    BC: string;
    GENERIC: string;
    BATCH: string;
    MFGDATE: Date | string;
    MFGDATE_DDMMYYYY: string;
    MANUFACTURER: string;
    SERVICETAX: number;
    BCODEID: string;
    VoucherType: number;
    SALESMANID: number;
    PhiscalID: string;
    STAMP: number;
    ITEMDESC: string;
    MENUCODE: string;
    BULKPARENT: string;
    TOTAL: number;
    Ptype: number;
    Product: Product;
    unitQty: UnitAndQty;
    Mcat: string;
    Mcat1: string;
    ITEMTYPE: string;
    HASITEMTYPE: number;
    RECEIVEDTYPE: string;
    inputMode: boolean;
    index: number;
    MRP: number;
    GODOWN: string;
    INDDISCOUNTRATE: number;
    SELECTEDITEM: any;
    BRANCH: string;
    Supplier: string;
    STOCK: number;
    ALLSCHEME: any;
    BATCHSCHEME: any;
    PrimaryDiscount: number;
    SecondaryDiscount: number;
    LiquiditionDiscount: number;
    BasePrimaryDiscount: number;
    BaseSecondaryDiscount: number;
    BaseLiquiditionDiscount: number;
    OtherDiscount: number;
    BaseOtherDiscount: number;
    ALTUNITObj: any;
    ALTRATE2: number;
    RATE2: number;
    GSTRATE: number;
    CONFACTOR: number;
    ACNAME: string;
    GSTRATE_ONLYFORSHOWING: number;
    VAT_ONLYFORSHOWING: number;
    PClist: any[];
    INDIVIDUALDISCOUNT_WITHVAT: number;
    IsApproveStockSettlement: boolean;
    ALTMRP: number;
    backgroundcolor: string;
    ADJUSTEDAMNT: number;
    UPLOADEDNETAMOUNT: number;
    ProductRates: any;
    PrimaryDiscountPercent: number;
    SecondaryDiscountPercent: number;
    LiquiditionDiscountPercent: number;
    DEFAULTPRICES: string;
    SellingPrice: number;
    SELECTEDBATCH: any;
    NWEIGHT: number;
    BATCHID: string;
    PARENTMERGEITEM: any;
    EDITEDBILLQUANTITY: number;
    TRANSACTIONMODE: string;
    HOLDINGSTOCK: number;
    INDCESS_PER: number;
    INDCESS_AMT: number;
    ALTINDDISCOUNT: number;//for view purpose for storing vat included or excluded
    ALTFLATDISCOUNT: number;//for view purpose for storing vat included or excluded
    CARTONCONFACTOR: number;
    INDCDAMT: number;
    ISAUTOPRIMARYSCHEME: boolean;
    ISAUTOSECONDARYSCHEME: boolean;
    ISAUTOLIQUIDATIONSCHEME: boolean;
    SALESMANNAME: string;
    SALESMAN_COMMISION: number;
    PROFIT: number;
    IsTaxInclusive: number;
    ORIGINALTRANRATE: number;
    TRNSCHEMEAPPLIED: TRNSCHEMEAPPLIED[];
    BULKITEM: BULKITEM;
    ALT_ORIGINALTRANRATE: number;
    COMBOITEMLIST: Product[];
    TransactionHistory: TransactionHistory[];
    AllSchemeOffer: schemeForCalculationClass[] | any;
    categorys: any[];
    variantNamelist: any[];
    priceDropTag: string;
    AltPrimaryDiscount: number;
    AltSecondaryDiscount: number;
}

export class Trntran {

    ACNAME: string;
    SubledgerTranList: TSubLedgerTran[];
    AccountItem: TAcList;
    VCHRNO: string;
    CHALANNO: string;
    DIVISION: string;
    A_ACID: string;
    DRAMNT: number;
    CRAMNT: number;
    B_ACID: string;
    NARATION: string;
    TOACID: string;
    NARATION1: string;
    VoucherType: VoucherTypeEnum;
    ChequeNo: string;
    ChequeDate: string;
    CostCenter: string;
    MultiJournalSno: number;
    PhiscalID: string;
    SNO: number;
    ROWMODE: string;
    acType: string;
    hasDebit: boolean;
    hasCredit: boolean;
    drBGColor: string;
    crBGColor: string;
    drColor: string;
    crColor: string;
    inputMode: boolean;
    editMode: boolean;
    acitem: any;//to hold the select acount Item value;
    PartyDetails: PartyOpeningDetail[] = [];
}

export class PartyOpeningDetail {
    VCHRNO: string;
    DIVISION: string;
    REFVNO: string;
    ACID: string;
    REFDATE: string;
    AMOUNT: number;
    CLRAMOUNT: number;
    DUEAMT: number;
    DUEDATE: string;
    REFSNO: string;
    PHISCALID: string;
    STAMP: string
}


export interface TSubLedgerTran {
    SNO: number;
    VCHRNO: string;
    CHALANNO: string;
    DIVISION: string;
    A_ACID: string;
    DRAMNT: number;
    CRAMNT: number;
    B_ACID: string;
    NARATION: string;
    TOACID: string;
    VoucherType: VoucherTypeEnum;
    PhiscalID: string;
    MultiJournalSno: number;
    SubledgerItem: TSubLedger;
    ACNAME: string;
    Amount: number;
    ROWMODE: string;
    inputMode: boolean;
    editMode: boolean;
}
export interface TSubLedger {
    SERIAL: number;
    ACID: string;
    ACCODE: string;
    ACNAME: string;
    PARENT: string;
    TYPE: string;
    OPBAL: number;
    MAPID: string;
    IsBasicAc: number;
    ADDRESS: string;
    PHONE: string;
    FAX: string;
    EMAIL: string;
    VATNO: string;
    PType: string;
    CRLIMIT: number;
    CRPERIOD: number;
    SALEREF: number;
    LEVELS: number;
    FLGNEW: number;
    COMMON: number;
    PATH: string;
    INITIAL: string;
}

export interface UnitAndQty {
    Unit: string;
    Qty: number;
    Rate: number;
    BaseUnit: string;
    BaseQty: number;
    BaseRate: number;
    ConversionFactor: number;
}

export interface AlternateUnit {
    SNO: number;
    MCODE: string;
    ALTUNIT: string;
    CONFACTOR: number;
    RATE: number;
    ISDEFAULT: number;
    ISDEFAULTPRATE: number;
    BRCODE: string;
    RATE_A: number;
    RATE_B: number;
    RATE_C: number;
    RATE_D: number;
    PRATE: number;
    ISDISCONTINUE: number;

}
export interface CostCenter {
    CostCenterName: string;
    DIVISION: string;
    Parent: string;
    TYPE: string;
}

export interface Division {
    INITIAL: string;
    NAME: string;
    REMARKS: string;
    MAIN: string;
    COMNAME: string;
    COMADD: string;
}
export interface Warehouse {
    NAME: string;
    ADDRESS: string;
    PHONE: string;
    REMARKS: string;
    ISDEFAULT: boolean;
    IsAdjustment: number;
    AdjustmentAcc: string;
    ISVIRTUAL: number;
    VIRTUAL_PARENT: string;
    DIVISION: string;
    WarehouseType: string;
    POSTALCODE: string;
    VATNO: string;
    GSTNO: string;
    STATE: string;
}

export interface Branch {
    COMPANYID: string;
    companyAlias: string;
    name: string;
    type: string;
    chanel: string;
    margin: string;
    remarks: string;
    PARENTBRANCHID: string;
}

export enum VoucherTypeEnum {
    Default = 0,
    Sales = 1,
    SalesReturn = 2,
    Purchase = 3,
    PurchaseReturn = 4,
    StockIssue = 5,
    StockReceive = 6,
    BranchTransferIn = 7,
    BranchTransferOut = 8,
    StockSettlement = 9,
    Stockadjustment = 10,
    Receipe = 11,
    Journal = 12,
    Delivery = 13,
    TaxInvoice = 14,
    CreditNote = 15,
    DebitNote = 16,
    PaymentVoucher = 17,
    ReceiveVoucher = 18,
    PurchaseOrder = 19,
    SalesOrder = 20,
    DeliveryReturn = 21,
    AccountOpeningBalance = 22,
    PartyOpeningBalance = 23,
    OpeningStockBalance = 24,
    SubLedgerOpeningBalance = 25,
    GoodsReceived = 26,
    PerformaSalesInvoice = 57,
    PurchaseOrderCancel = 58,
    RequestIndent = 59,
    StockSettlementEntryApproval = 60,
    TaxInvoiceCancel = 61,
    ContraVoucher = 62,
    SalesReturnCancel = 63,
    PurchaseReturnCancel = 64,
    ReceiptNote = 67,
    QuotationInvoice = 65,
    ReceiptNoteCancel = 66,
    LoadChart = 70,
    Repack = 72,
    NormSetting = 101,
    InterCompanyTransferIn = 102,
    InterCompanyTransferOut = 103,
    MaterialReceipt = 110,
    Production = 111,
    Consumption = 111,
    ReceipeEstimate = 112,
    DeliveryChallaan = 113,
    RFQ = 114,
    InterCompanyTransferOutCancel = 115,
    InterCompanyTransferInCancel = 116,
}


export enum ITEMTYPE {
    INVENTORYITEM = 0,
    RAWITEM = 1,
    MATRIXITEM = 2,
    BULKITEM = 3,
    REPACKITEM = 4,
    SERIALIZEDITEM = 6,
    SERVICEITEM = 10,
    COCKTAILITEM = 11,
    INTERMEDIATEITEM = 12,
    COMBOITEM = 13,
}
export enum CompanyTypeEnum {
    Pharma = 1
}
export interface TransactionHistory {
    MCODE: string;
    TRNDATE: Date | string;
    ACNAME: string;
    CHALANNO: string;
    TRN_DATE: Date | string;
    BATCH: string;
    EXPDATE: string | Date;
    Qty: number;
    PRATE: number;
    MRP: number;
    SELLINGPRICE: number;
    REFBILL: string;
    ITEMDESC: string;
}

export interface VoucherSatus {
    vouchertype: VoucherTypeEnum;
    VCHRNO: string;
    DIVISION: string;
    PhiscalID: string;
    BillMode: string;
}

export interface DialogInfo {
    TRANSACTION: String;
    PARAC: string;
    DIVISION: any;
    DELEVERYLIST: String;
    SALESMODE: String;
    WARRENTYTODATE: Date;
}
export interface TrnMain_AdditionalInfo {
    VEHICLENO:string;
    IMAGEBASE64: string;
    IMAGEURL: any;
    MARGIN_PERCENT: any;
    MARGIN_ACTION: any;
    DELIVERYBOYNAME: any;
    DELIVERYBOY: string;
    DOCTORNAME: string;
    BILLREMINDERDAYS: string;
    ISCENTRALPAYMENT: string;
    VCHRNO: string;
    STAMP: number;
    SHIPNAME: string;
    SHIPNAMEVIEW: string,
    BILLNAME: string;
    BILLNAMEVIEW: string,
    TRNTYPE: string;
    CFORM: string;
    PAYMENTTYPE: string;
    RETURNMODE: string;
    PAYMENTMODE: string;
    PAYMENTTERMS: string;
    INVNO: string;
    INVDATE: Date;
    INVAMOUNT: number;
    TOTALGST: number;
    TOTALEXTRACESS: number;
    FREIGHT: string;
    CREDITDAYS: string;
    SOSTOCKSTATUS: string;
    INVOICETYPE: string;
    COUPONBALANCE: string;
    tag: string;
    CREATION_TYPE: string;
    DSMNAME: string;
    DSMCODE: string;
    INVOICEREFBILL: string;
    BEAT: string;
    CESS_PER: number;
    INVOICEREFBILLDATE: Date;
    TCS_PER: number;
    TCS_AMT: number;
    CUSTOMER_TOTALSALES: number;
    BILLTOPAN: string;
    DOCTOR: string;
    T_AND_C: string;

}
export class TenderObj {
    CREDIT: number;
    CHEQUE: number;
    CASH: number;
    WALLET: number;
    PAYTM: number;
    PAYTMAMT: number;
    CARD: number;
    SAMRIDHICARD: number;
    COUPON: number;
    CASHAMT: number;
    CARDAMT: number;
    SAMRIDHICARDAMT: number;
    CARDNO: string;
    SAMRIDHICARDNO: string;
    CARDNAME: string;
    APPROVALCODE: string;
    CARDHOLDERNAME: string;
    SAMRIDHICARDHOLDERNAME: string;
    CREDITAMT: number;
    CHEQUEAMT: number;
    CHEQUENO: string;
    DATE: Date;
    BANK: string;
    TOTAL: number;
    OUTSTANDING: string;
    ADVANCE: number;
    TENDERAMT: string;
    BALANCE: number;
    LoyaltyTender: number;
    COUPONNAME: string;
    COUPONAMT: number;
    WALLETAMT: number;
    WALLETTYPE: string;
    WALLETCARDNO: string;
    PAYTMPHONENUMBER: string;
    TRNMODE: string;
    REMARKS: string;
    ACID: string;
    RETURN_NOTE: number;

}

export class TBillTender {
    VCHRNO: string;
    DIVISION: string;
    TRNMODE: string;
    ACCOUNT: string;
    REMARKS: string;
    SN: number;
    AMOUNT: number;
    PHISCALID: string;
    CHANGE: number;
    STAMP: number;
    guid: string;
    TRANSACTIONID: string;
    OTP: string;
    PROVIDERNAME: string;
    PROVIDERACCOUNT: string;
    SALESMANID: number;
    // added by bzu
    CARDNO: string;
    SAMRIDHICARDNO: string;
    APPROVALCODE: string;
    CARDHOLDERNAME: string;
    SAMRIDHICARDHOLDERNAME: string;
}

export interface ExcelImportConfig {
	PARAC: any;
    ImportName: string;
    ColumnName: string;
    MappingName: string;
    SNO: number;
    ColumnSize: string;
    DataType: boolean;
    ColumnValue: number;
    Mandatory: string;
    AddToSheet: number;
}
export interface Transporter_Eway {
    ID: number;
    VCHRNO: string;
    TRANSPORTER: string;
    VEHICLENO: string;
    PERSON: string;
    VEHICLENAME: string;
    DRIVERNAME: string;
    DRIVERNO: string;
    TOTALBOX: string;
    MODE: string;
    LRNO: string;
    LRDATE: Date;
    STAMP: Date;
    DISTANCE: number;
    EWAYNO: string;
    TOTALWEIGHT: number;
    COMPANYID: String;
    TRANSPORTERID: string;
}
export interface voucherseries {
    voucher_id: string;
    vseries_name: string;
    vseries_id: string;
    vouchertype: VoucherTypeEnum;
}
export interface schemeForCalculationClass {
    schemeID: string;
    mcode: string;
    disrate: number;
    disamount: number
    schemename: string;
    minQty: number
    schemeType: string;
    discountedQty: number;
    isSelected: boolean;
    offerOn: string;
    mcat: string;
    discountType: string;
    vat: number;
    account: string;
    customertype: string;
    greaterThan: number;
    lessThan: number;
    offerFamily: string;
    slabDiscountType: string;
    rate_A: number;
    desca: string;
    disItemCode: string;
    disItemName: string;
    variantid: string;
}



export interface SerialItem {
    SERIAL1: number | string;
    SERIAL2: number | string;
    SERIAL3: number | string;
    SERIAL4: number | string;
    SERIAL5: number | string;
}



export interface BarcodeDifferentiatorModel {
    BARCODETYE: number;
    BARCODE: string;
    MCODE: string;
    QTY: number;
}

