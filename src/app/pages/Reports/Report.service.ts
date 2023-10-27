import { Injectable } from "@angular/core"
import { FormGroup } from "@angular/forms";
import internal from "assert";
import { ColumnConfiguration } from "../../common/dynamicreportparam/dynamicreportparam.component";
import { MasterRepo } from "../../common/repositories";

@Injectable()
export class ReportMainSerVice {

    repObj: ReportMainFilter = <ReportMainFilter>{};
    calendarForm: FormGroup;

    public selectedRowIndex = 0
    reportDataStore: ReportStore[] = [];
    AllDSM: any[] = [];
    ALLBEAT: any[] = [];
    allCustomer: any[] = [];
    allSupplier: any[] = [];
    constructor(private masterService: MasterRepo) {
        this.repObj.reportparam = <ReportParams>{};
    }

    getReportFilterData() {
        // if (JSON.parse(localStorage.getItem("CUSTOMER"))) {
        //     this.allCustomer = JSON.parse(localStorage.getItem("CUSTOMER"));
        // } 
        // else {
        //     this.allCustomer = [];
        // }
        // if (JSON.parse(localStorage.getItem("SUPPLIER"))) {
        //     this.allSupplier = JSON.parse(localStorage.getItem("SUPPLIER"));
        // } else {
        //     this.allSupplier = [];
        // }
        // if (JSON.parse(localStorage.getItem("DSM"))) {
        //     this.AllDSM = JSON.parse(localStorage.getItem("DSM"));
        // } else {
        //     this.AllDSM = [];
        // }
        // if (JSON.parse(localStorage.getItem("BEAT"))) {
        //     this.ALLBEAT = JSON.parse(localStorage.getItem("BEAT"));
        // } else {
        //     this.ALLBEAT = [];
        // }

        this.allCustomer = this.masterService.customerList;
        this.allSupplier = this.masterService.supplierList;
        this.AllDSM = this.masterService.DSMLIST;
        this.ALLBEAT = this.masterService.BEATLIST;


    }

}





export interface ReportStore {
    calendarForm?: FormGroup;
    param: any;
    data: any;
}


export interface ReportMainFilter {
    reportname: string;
    reportdescription: string;
    aliasName: string;
    reportparam: ReportParams;
    columnSetting?: ColumnConfiguration[];


}

export interface ReportParams {
    DSM: string;
    date1?: string,
    date2?: string,
    PHISCALID?: string,
    PhiscalID?: string,
    COMPANYID?: string,
    COMPANYTYPE?: string,
    division?: string,
    DATE1?: string,
    DATE2?: string,
    fromdate?: string,
    todate?: string,
    tag?: string,
    REPMODE?: number
    REPORTMODE?: string;
    VENDORCODE?: string;
    ORDERSTATUS?: string;
    SUPPLIER?: string;
    MONTH?: string;
    YEAR?: string;
    ITEMDIVISION?: string;
    SelectedItemList?: string;
    ACID?: string;
    rowCount?: string;
    MODE?: number;
    WAREHOUSE?: string;
    fromTime?: string;
    toTime?: string;
    Type?: number,
    TCount?: number,
    MCODE?: string,
    batch?: string;

}