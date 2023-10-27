export interface TAcList {
    customerID: string;
    MODE: string;
    DISTRICT: string;
    GEO: string;
    ISDISCONTINUED: string;
    SERIAL: number;
    ACID: string;
    ACNAME: string;
    PARENT: string;
    TYPE: string;
    OPBAL: string;
    MAPID: string;
    IsBasicAc: number;
    ADDRESS: string;
    PHONE: string;
    FAX: string;
    EMAIL: string;
    ALTERNATEEMAIL:string;
    VATNO: string;
    PType: string;
    CRLIMIT: number;
    CRPERIOD: number;
    SALEREF: number;
    ACCODE: string;
    LEVELS: number;
    FLGNEW: number;
    COMMON: number;
    PATH: string;
    INITIAL: string;
    EDATE: Date;
    DISMODE: string;
    MCAT: string;
    HASSUBLEDGER: number;
    RATETYPE: number;
    INVCHECK: number;
    LEADTIME: number;
    DUELIMIT: number;
    PRICETAG: number;
    CURRENCY: number;
    ISACTIVE: number;
    MEMID: string;
    PARENTID: string;
    ACTYPE: string;
    DIV: string;
    BANKBUILDING: string;
    BANKACCOUNTNUMBER: string;
    BANKCOSTCENTER: string;



    TITLE:string;
    SHORTNAME:string;
    CUSTOMERID:string;
    CATEGORY:string;
    Currency:string;
    PMODE:string;
    PSTYPE:string;
    GSTTYPE:string;
    MAILTYPE:string;
    TEMPADDRESS:string;
    CITY:string;
    STATE:string;
    AREA:string;
    LANDMARK:string;
    MOBILE:string;
    POSTALCODE:string;
    ADHARNO:string;
    GSTNO:string;
    PRICELEVELCONFIG:string;
    PRICELEVEL:string;
    CTYPE:string;
    ERPPLANTCODE:string;
    ERPSTOCKLOCATIONCODE:string;
    CBALANCE:number;
    DISTANCE:number;
    ISGLOBALPARTY:number;
}

export interface AcListTree {
    SERIAL: Number;
    ACID: number;
    ACNAME: string;
    PARENTID: number;
    TYPE: string;
    isBasicAC: boolean;
    ACCODE: number;
    LEVELS: number;
    PATH: string;
    PARENT: AcListTree;
    PTYPE: string;
    CHILDREN: AcListTree[]
    TEXT: string;
    ANCESTORS: number[]
}


export interface OpticalEyeDetail{
    LABEL:string;
    LEFT:string;
    RIGHT:string
}