import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ReportMainSerVice, ReportStore } from './Report.service';
import { MasterRepo } from '../../common/repositories';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { ColumnConfiguration } from '../../common/dynamicreportparam/dynamicreportparam.component';


@Component({
    selector: 'report',
    template: `<router-outlet></router-outlet>
    `
})

export class ReportsComponent {
    public allDSM: any[] = [];
    public allBEAT: any[] = [];
    public allCUSTOMER: any[] = [];
    public allSUPPLIER: any[] = [];



    constructor(private router: Router, private reportService: ReportMainSerVice, public masterService: MasterRepo, private fb: FormBuilder) {
        //Dont remove this code block

        this.reportService.getReportFilterData();
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                let url = ev.url.split("/");
                let existingDataFromReportDataStore: ReportStore = this.reportService.reportDataStore[url[url.length - 1]];
                if (existingDataFromReportDataStore != null && existingDataFromReportDataStore != undefined) {
                    this.reportService.repObj = existingDataFromReportDataStore.param;
                    this.reportService.calendarForm = existingDataFromReportDataStore.calendarForm;

                } else {
                    this.initiateDefaultReportParams(url[url.length - 1]);

                }
            }
        });


    }


    initiateDefaultReportParams(report: string) {
        console.log(report, "report");
        this.commonParamInReports();
        switch (report) {
            case 'soerrorlogreport':
                this.reportService.repObj.reportname = "Sales Order Data Error Log";
                this.reportService.repObj.reportdescription = "Sales Order Data Error Log";
                break;
            case 'ordertransfer':
                this.reportService.repObj.reportname = "Order Transfer";
                this.reportService.repObj.reportdescription = "Order Transfer";
                this.reportService.repObj.reportparam.ORDERSTATUS = "%";
                break;
            case 'billwiseitemsalesreport':
                this.reportService.repObj.reportname = "BillWiseItemSalesDetail";
                this.reportService.repObj.reportdescription = "Bill Wise Item Sales Detail";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },

                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;
            case 'itemwisesalesreport':
                this.reportService.repObj.reportname = "ITEMWISESUMMARY";
                this.reportService.repObj.reportdescription = "ITEM WISE SUMMARY";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },

                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;

            case 'itemwisesalescentralreport':
                this.reportService.repObj.reportname = "ITEMWISESUMMARYCENTRAL";
                this.reportService.repObj.reportdescription = "ITEM WISE SUMMARY CENTRAL";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },

                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;


            case 'STOCKISSUEREPORT':
                //
                this.reportService.repObj.reportname = "STOCKISSUEREPORT";
                this.reportService.repObj.reportdescription = "STOCK ISSUE REPORT";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'itemwisecategorysalescentralreport':
                this.reportService.repObj.reportname = "Category Wise Sales Summary Central";
                this.reportService.repObj.reportdescription = "Category Wise Sales Summary Central";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },

                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;

            case 'STOCKISSUEREPORTCENTRAL':
                this.reportService.repObj.reportname = "STOCKISSUEREPORTCENTRAL";
                this.reportService.repObj.reportdescription = "STOCK ISSUE REPORT CENTRAL";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'BESTBUYPRODUCTREPORT':
                this.reportService.repObj.reportname = "BESTBUYPRODUCTREPORT";
                this.reportService.repObj.reportdescription = "BEST BUY PRODUCT REPORT";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                ]
                break;
            case 'SLOWBUYPRODUCTREPORT':
                this.reportService.repObj.reportname = "SLOWBUYPRODUCTREPORT";
                this.reportService.repObj.reportdescription = "Slow Buy Product Central Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                ]
                break;
            case 'ItemCorelation':
                this.reportService.repObj.reportname = "Item Corelation";
                this.reportService.repObj.reportdescription = "Item Correlation"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                ]
                break;
            case 'ItemCorelationFiltered':
                //CODE
                this.reportService.repObj.reportname = "Item Corelation Filtered";
                this.reportService.repObj.reportdescription = "Item Correlation Filtered"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                ]
                break;
            case 'FASTMOVINGPRODUCT':
                this.reportService.repObj.reportname = "FASTMOVINGPRODUCT";
                this.reportService.repObj.reportdescription = "Fast Moving Product"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                ]
                break;

            case 'BestBuyProductReportCentral':
                this.reportService.repObj.reportname = "FASTMOVINGPRODUCT";
                this.reportService.repObj.reportdescription = "Best Buy Product Report Central"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                ]
                break;

            case 'BESTBUYCUSTOMERREPORT':
                this.reportService.repObj.reportname = "BESTBUYCUSTOMERREPORT";
                this.reportService.repObj.reportdescription = 'Best Buy Customer Report'
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                ]
                break;
            case 'CUSTOMERITEMTRACKREPORT':
                this.reportService.repObj.reportname = "CUSTOMERITEMTRACKREPORT";
                this.reportService.repObj.reportdescription = 'Customer Item Track Report'
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                ]
                break;

            case 'SalemanCommisionReport':
                this.reportService.repObj.reportname = "SalemanCommisionReport";
                this.reportService.repObj.reportdescription = 'Saleman Commision Report'
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'proformadetailreport':
                this.reportService.repObj.reportname = "PROFORMADETAILREPORT";
                this.reportService.repObj.reportdescription = 'Proforma Detail  Report'
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'proformasummaryreport':
                this.reportService.repObj.reportname = "PROFORMASUMMARYREPORT";
                this.reportService.repObj.reportdescription = 'Proforma Summary  Report'
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'customerwiseitemsales':
                this.reportService.repObj.reportname = "Customer Wise Item Sales Detail";
                this.reportService.repObj.reportdescription = 'Customer Wise Item Sales Detail'
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'dailysalesreport':
                this.reportService.repObj.reportname = "DAILY SALES REPORT";
                this.reportService.repObj.reportdescription = "DAILY SALES REPORT"
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMCODE",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;

            case 'hoursalesreport':
                this.reportService.repObj.reportname = "hoursalescollectionreport";
                this.reportService.repObj.reportdescription = "Hour Sales Collection Report"

                break;
            case 'HourSalesCentralReport':
                this.reportService.repObj.reportdescription = "Hour Sales Central Report"
                this.reportService.repObj.reportname = "HourSalesCentralReport";
                break;
            case 'LoadSheetDetail':
                this.reportService.repObj.reportname = "LoadSheetDetail";
                this.reportService.repObj.reportdescription = "Load Sheet Detail"

                break;

            case 'dailysalescentralreport':
                this.reportService.repObj.reportname = "DAILY SALES REPORT CENTRAL";
                this.reportService.repObj.reportdescription = "DAILY SALES REPORT CENTRAL"
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMCODE",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;
            case 'salesorder':
                this.reportService.repObj.reportname = "SALES ORDER";
                this.reportService.repObj.reportdescription = " SALES ORDER"
                break;
            case 'holdbillreport':
                this.reportService.repObj.reportname = "HOLDBILL REPORT";
                this.reportService.repObj.reportdescription = "Hold Bill Report"

                break;
            case 'salesbillcancelreport':
                this.reportService.repObj.reportname = "SALES BILL CANCEL REPORT";
                this.reportService.repObj.reportdescription = "Sales Bill Cancel Report"
                break;
            case 'customerwisesalesreturnreport':
                this.reportService.repObj.reportname = "CUSTOMERWISE SALES RETURN REPORT";
                this.reportService.repObj.reportdescription = "Customer Wise Sales Return Report"

                break;
            case 'dailycollectionreport':
                this.reportService.repObj.reportname = "DAILY COLLECTION REPORT";
                this.reportService.repObj.reportdescription = "Daily Collection Report "

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'couponcreationreport':
                this.reportService.repObj.reportname = "COUPONCREATIONREPORT";
                this.reportService.repObj.reportdescription = "Coupon Creation Report "

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'couponmasterreport':
                this.reportService.repObj.reportname = "COUPONMASTERREPORT";
                this.reportService.repObj.reportdescription = "Coupon Master Report"

                // this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                // this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'couponmasterreportcentral':
                this.reportService.repObj.reportname = "COUPONMASTERREPORTCENTRAL";
                this.reportService.repObj.reportdescription = "Coupon Master Report Central"
                // this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                // this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'coupondiscountreceivedreport':
                this.reportService.repObj.reportname = "COUPONDISCOUNTRECEIVED";
                this.reportService.repObj.reportdescription = "Coupon Discount Received "

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'coupondiscountreceivedreportcentral':
                this.reportService.repObj.reportname = "COUPONDISCOUNTRECEIVEDCENTRAL";
                this.reportService.repObj.reportdescription = "Coupon Discount Received Central"

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'couponcreationsummaryreport':
                this.reportService.repObj.reportname = "COUPONCREATIONSUMMARYREPORT";
                this.reportService.repObj.reportdescription = "Coupon Creation Summary Report"

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'couponcreationreportsummarycentral':

                this.reportService.repObj.reportname = "COUPONCREATIONSUMMARYREPORTCENTRAL";
                this.reportService.repObj.reportdescription = "Coupon Creation Summary Report Central"

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'couponcreationreportcentral':
                this.reportService.repObj.reportname = "COUPONCREATIONREPORTCENTRAL";
                this.reportService.repObj.reportdescription = "Coupon Creation Report Central"

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'monthlycollectionreport':
                this.reportService.repObj.reportname = "MONTHLYCOLLECTIONREPORT";
                this.reportService.repObj.reportdescription = "Monthly Collection Report"

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'monthlycollectioncentralreport':
                this.reportService.repObj.reportname = "MONTHLYCOLLECTIONREPORTCENTRAL";
                this.reportService.repObj.reportdescription = "Monthly Collection Report"

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'purchaseMonthlyReport':
                this.reportService.repObj.reportname = "PurchaseMonthlyReport";
                this.reportService.repObj.reportdescription = "Purchase Monthly Report"

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'purchaseMonthlywiseSummaryReport':
                this.reportService.repObj.reportname = "Purchase - Month Wise Summary";
                this.reportService.repObj.reportname = "Purchase  Month Wise Summary"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'dailycollectioncentralreport':
                this.reportService.repObj.reportname = "DAILYCOLLECTIONREPORTCENTRAL";
                this.reportService.repObj.reportdescription = "Daily Collection Report Central"

                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'GstSalesSummaryTaxSlabReport':
                this.reportService.repObj.reportname = "GSTSALESSUMMARYTAXSLAB";
                this.reportService.repObj.reportdescription = "GST Sales Summary Tax Slab"

                break;
            case 'salesreturnreport':
                this.reportService.repObj.reportname = "SALES RETURN REPORT";
                this.reportService.repObj.reportdescription = "Sales Return Report "

                break;
            case 'SALESRETURNREPORTCENTRAL':
                this.reportService.repObj.reportname = "SALESRETURNREPORTCENTRAL";
                this.reportService.repObj.reportdescription = "Sales Return Report Central"

                break;

            case 'salesordersummary':
                this.reportService.repObj.reportname = "Sales Order Summary";
                this.reportService.repObj.reportdescription = "Sales Order Summary"
                break;
            case 'salesreturnsummary':
                this.reportService.repObj.reportname = "Sales Return Summary";
                this.reportService.repObj.reportdescription = "Sales Return Summary"
                break;
            case 'itemwisestockandsalessummary':
                this.reportService.repObj.reportname = "Itemwise Stock and sales summary";
                this.reportService.repObj.reportdescription = "Itemwise Stock and sales summary"
                break;
            case 'TransactionReport':
                this.reportService.repObj.reportname = "TransactionReport";
                this.reportService.repObj.reportdescription = "Transaction Report"
                break;
            case 'salesRegisterReport':
                this.reportService.repObj.reportname = "salesRegisterReport";
                this.reportService.repObj.reportdescription = "Sales Register Report"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                break;

            case 'sovssi':
                this.reportService.repObj.reportname = "SO VS SI";
                this.reportService.repObj.reportdescription = "SO VS SI"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'sovspo':
                this.reportService.repObj.reportname = "SO VS PO";
                this.reportService.repObj.reportdescription = "SO VS PO"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'closingStock':
                this.reportService.repObj.reportname = "Closing Stock";
                this.reportService.repObj.reportdescription = "Closing Stock"
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'SupplierWiseStock':
                this.reportService.repObj.reportname = "Supplier Wise Stock";
                this.reportService.repObj.reportdescription = "Supplier Wise Stock"

                break;
            case 'ClosingStockSummaryReport':
                this.reportService.repObj.reportname = "ClosingStockSummaryReport";
                this.reportService.repObj.reportdescription = "Closing Stock Summary Report"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'nontransactedpartyreport':

                this.reportService.repObj.reportname = "Non Transacted Party Report";
                this.reportService.repObj.reportdescription = "Non Transacted Party Report"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'ShortExpiryReport':
                this.reportService.repObj.reportname = "ShortExpiryReport";
                this.reportService.repObj.reportdescription = "Short Expiry Report"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'ShortExpiryReportCentral':
                this.reportService.repObj.reportname = "ShortExpiryReportCentral";
                this.reportService.repObj.reportdescription = "Short Expiry Report Central"
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'closingstockcentral':
                this.reportService.repObj.reportname = "Closing Stock Central";
                this.reportService.repObj.reportdescription = "Current Stock Item Summary Central";
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'currentstockitemwisecentral':
                this.reportService.repObj.reportname = "CURRENTSTOCKITEMWISEDETAILCENTRAL";
                this.reportService.repObj.reportdescription = "Current Stock Item Wise Detail Central"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'currentstockcategorywisecentral':
                this.reportService.repObj.reportname = "CURRENTSTOCKCATEGORYWISECENTRAL";
                this.reportService.repObj.reportdescription = "Current Stock Category Wise Central"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'PurchaseSummaryCategoryReportCentral':
                this.reportService.repObj.reportname = "PURCHASECATEGORYSUMMARYCENTRAL";
                this.reportService.repObj.reportdescription = "Purchase Category Summary Central"
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'currentstockitemwisesummarycentral':
                this.reportService.repObj.reportname = "CURRENTSTOCKITEMWISESUMMARYCENTRAL";
                this.reportService.repObj.reportdescription = "Current Stock Item Wise Summary Central"
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'customerwiseloyalty':
                this.reportService.repObj.reportname = "CUSTOMERWISELOYALTY";
                this.reportService.repObj.reportdescription = "Customer Wise Loyalty "


                break;
            case 'customerwiseloyaltycentral':
                this.reportService.repObj.reportname = "CUSTOMERWISELOYALTYCENTRAL";
                this.reportService.repObj.reportdescription = "Customer Wise Loyalty Central"


                break;
            case 'customerwisedetailloyalty':
                this.reportService.repObj.reportname = "CUSTOMERWISEDETAILLOYALTY";
                this.reportService.repObj.reportdescription = "Customer Wise Detail Loyalty"


                break;
            case 'customerwisedetailloyaltycentral':
                this.reportService.repObj.reportname = "CUSTOMERWISEDETAILLOYALTYCENTRAL";
                this.reportService.repObj.reportdescription = "Customer Wise Detail Loyalty"

                break;
            case 'ClosingStockSummaryReportCentral':
                this.reportService.repObj.reportname = "ClosingStockSummaryReportCentral";
                this.reportService.repObj.reportdescription = "Closing Stock Summary Report Central"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'StockandSalesCategorySummary':
                this.reportService.repObj.reportname = "StockandSalesCategorySummary";
                this.reportService.repObj.reportdescription = "Stock and Sales Category Summary"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'StockandSalesItemSummaryCentral':
                this.reportService.repObj.reportname = "StockandSalesItemSummaryCentral";
                this.reportService.repObj.reportdescription = "Stock and Sales Item Summary Central"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'StockandSalesItemSummary':
                this.reportService.repObj.reportname = "StockandSalesItemSummary";
                this.reportService.repObj.reportdescription = "Stock and Sales Item Summary"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'OpeningStockCentral':
                this.reportService.repObj.reportname = "OpeningStockCentral";
                this.reportService.repObj.reportdescription = "Opening Stock Central"
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'itemexpiryreportcentral':
                this.reportService.repObj.reportname = "ItemExpiryReport_Central";
                this.reportService.repObj.reportdescription = "Item Expiry Report Central"
                // alert(this.reportService.repObj.reportname)
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'IndentVsReplenishedReport':
                this.reportService.repObj.reportname = "IndentVsReplenishedReport";
                this.reportService.repObj.reportdescription = "Indent Vs Replenished Report"
                // alert(this.reportService.repObj.reportname)
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'DeliveryStatusReport':
                this.reportService.repObj.reportname = "DeliveryStatusReport";
                this.reportService.repObj.reportdescription = "Delivery Status Report"
                // alert(this.reportService.repObj.reportname)
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'GROSSMARGINREPORT':
                this.reportService.repObj.reportname = "GROSSMARGINREPORT";
                this.reportService.repObj.reportdescription = "Gross Margin Report"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'GROSSMARGINREPORTMONTHWISE':
                this.reportService.repObj.reportname = "GROSSMARGINREPORTMONTHWISE";
                this.reportService.repObj.reportdescription = "Monthwise Gross Margin Report"

                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'combopackconfigreport':
                this.reportService.repObj.reportname = "Combo pack configuration";
                this.reportService.repObj.reportdescription = "Combo Pack Configuration"
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'partialsalesbill':
                this.reportService.repObj.reportname = "Partial Sales Bill";
                this.reportService.repObj.reportdescription = "Partial Sales Bill"
                this.reportService.repObj.reportparam.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
                break;
            case 'stockSettlementreport':
                this.reportService.repObj.reportname = "STOCK SETTLEMENT";
                this.reportService.repObj.reportdescription = "Stock Settlement Report "

                break;
            case 'StockSettlementReportCentral':
                this.reportService.repObj.reportname = "StockSettlementReportCentral";
                this.reportService.repObj.reportdescription = "Stock Settlement Report Central"

                break;
            case 'TransactionwiseStockReport':
                this.reportService.repObj.reportname = "Transactionwise Stock Report";
                this.reportService.repObj.reportdescription = "Transactionwise Stock Report "
                break;
            case 'MocWiseSales':
                this.reportService.repObj.reportname = "MocWiseSales";
                this.reportService.repObj.reportdescription = "Moc Wise Sales "
                break;
            case 'MonthWiseSales':
                this.reportService.repObj.reportname = "MonthWiseSales";
                this.reportService.repObj.reportdescription = "Month Wise Sales "
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMCODE",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;
            case 'intransitreport':
                this.reportService.repObj.reportname = "Intransit Report";
                this.reportService.repObj.reportdescription = "In transit Report";
                this.reportService.repObj.reportparam.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;

                break;
            case 'itemexpiryreport':
                this.reportService.repObj.reportname = "Item Expiry Report";
                this.reportService.repObj.reportdescription = "Item Expiry Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                break;
            case 'agewiseexpiryReport':
                this.reportService.repObj.reportname = "AgeWise Item Expiry Report";
                this.reportService.repObj.reportdescription = "AgeWise Item Expiry Report";
                break;
            case 'povsintransit':
                this.reportService.repObj.reportname = "PO VS INTRANSIT";
                this.reportService.repObj.reportdescription = "PO VS INTRANSIT";
                break;
            case 'povspivsintransit':
                this.reportService.repObj.reportname = "PO VS PI VS INTRANSIT";
                this.reportService.repObj.reportdescription = "PO VS PI VS Intransit";
                break;
            case 'delordstatusreport':
                this.reportService.repObj.reportname = "DELIVERY ORDER STATUS REPORT";
                this.reportService.repObj.reportdescription = "Delivery Order Status Report";
                this.reportService.repObj.reportparam.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
                break;
            case 'ordermestatus':
                this.reportService.repObj.reportname = "SUPPLIER ORDER STATUS REPORT";
                this.reportService.repObj.reportdescription = "Supplier Order Status Report";
                this.reportService.repObj.reportparam.COMPANYID = this.masterService.userProfile.CompanyInfo.COMPANYID;
                break;
            case 'transferin':
                this.reportService.repObj.reportname = "Transfer In";
                this.reportService.repObj.reportdescription = "Transfer In";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;

                break;
            case 'TransferInCentralReport':
                this.reportService.repObj.reportname = "TransferInCentralReport";
                this.reportService.repObj.reportdescription = "Transfer In Central Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;

                break;


            case 'TransferoutCentralReport':
                this.reportService.repObj.reportname = "TransferoutCentralReport";
                this.reportService.repObj.reportdescription = "Transfer Out Central Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;

                break;

            case 'transferout':
                this.reportService.repObj.reportname = "Transfer Out";
                this.reportService.repObj.reportdescription = "Transfer Out";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;

                break;
            case 'supplierstockreport':
                this.reportService.repObj.reportname = "Supplier Stock Report";
                this.reportService.repObj.reportdescription = "Supplier Stock Report";
                this.reportService.repObj.reportparam.REPORTMODE = "0";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'erppireport':
                this.reportService.repObj.reportname = "ERP PI REPORT";
                this.reportService.repObj.reportdescription = "ERP PI Report";
                this.reportService.repObj.reportparam.VENDORCODE = "";
                this.reportService.repObj.reportparam.COMPANYID = "";
                break;
            case 'erpsireport':
                this.reportService.repObj.reportname = "ERP SI REPORT";
                this.reportService.repObj.reportdescription = "ERP SI Report";
                this.reportService.repObj.reportparam.VENDORCODE = "";
                this.reportService.repObj.reportparam.COMPANYID = "";
                break;
            case 'purchaseinvoicedetailreport':
                this.reportService.repObj.reportname = "Purchase Invoice Detail";
                this.reportService.repObj.reportdescription = "Purchase Invoice Detail";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'materialreceiptreport':
                this.reportService.repObj.reportname = "Material Receipt Report";
                this.reportService.repObj.reportdescription = "Material Receipt Report";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'MRvsPIReport':
                this.reportService.repObj.reportname = "MRvsPIReport";
                this.reportService.repObj.reportdescription = "MR vs PI Report";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'POvsSOReport':
                this.reportService.repObj.reportname = "POvsSOReport";
                this.reportService.repObj.reportdescription = "PO vs SO Report";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'materialreceiptcentralreport':
                this.reportService.repObj.reportname = "Material Receipt Central Report";
                this.reportService.repObj.reportdescription = "Material Receipt Central Report";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'MRvsPIReportCentral':
                this.reportService.repObj.reportname = "MRvsPIReportCentral";
                this.reportService.repObj.reportdescription = "MR vs PI Report Central";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'IndentVSPOReportCentral':
                this.reportService.repObj.reportname = "IndentVSPOReportCentral";
                this.reportService.repObj.reportdescription = "Indent VS PO Report Central";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'POVSMRReportCentral':
                this.reportService.repObj.reportname = "POVSMRReportCentral";
                this.reportService.repObj.reportdescription = "PO VS MR Report Central";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'IndentReport':
                this.reportService.repObj.reportname = "IntendReport";
                this.reportService.repObj.reportdescription = "Intend Report";
                break;
            case 'IndentCentralReport':
                this.reportService.repObj.reportname = "IndentCentralReport";
                this.reportService.repObj.reportdescription = "Indent Central Report";
                break;
            case 'BillWiseItemWiseSalesCentralReport':
                this.reportService.repObj.reportname = "BillWiseItemWiseSalesCentralReport";
                this.reportService.repObj.reportdescription = "Bill Wise Item Wise Sales Central Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;
            case 'UserLoginDetailsCentralReport':
                this.reportService.repObj.reportname = "USERLOGINDETAILS";
                this.reportService.repObj.reportdescription = "User Login Details Central Report";
                break;
            case 'OfferManagementReport':
                this.reportService.repObj.reportname = "OfferManagementReport";
                this.reportService.repObj.reportdescription = "Offer Management Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;

                break;
            case 'HourlySalesItemwiseCentral':
                this.reportService.repObj.reportname = "HourlySalesItemwiseCentral";
                this.reportService.repObj.reportdescription = "Hourly Sales Itemwise Central";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;
            case 'SalesItemWiseSummaryCentral':
                this.reportService.repObj.reportname = "StockItemWiseSalesCentral";
                this.reportService.repObj.reportdescription = "Sales Item Wise Sales Central";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;
            case 'AvailableStockForDay':
                this.reportService.repObj.reportname = "Available Stock For Day";
                this.reportService.repObj.reportdescription = "Available Stock For Day";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;



            case 'CategoryStockItemWiseSalesCentral':
                this.reportService.repObj.reportname = "CategoryStockItemWiseSalesCentral";
                this.reportService.repObj.reportdescription = "Category Stock ItemWise Sales Central";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;
            case 'purchaseRegisterReportCentral':
                this.reportService.repObj.reportname = "purchaseRegisterReportCentral";
                this.reportService.repObj.reportdescription = "Purchase Register Report Central";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;

            case 'purchaseinvoicedetailcentralreport':
                this.reportService.repObj.reportname = "Purchase Invoice Detail Central";
                this.reportService.repObj.reportdescription = "Purchase Invoice Detail Central";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'purchaseorderdetailreport':
                this.reportService.repObj.reportname = "Purchase Order Detail";
                this.reportService.repObj.reportdescription = "Purchase Order Detail";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'purchaseordercentraldetailreport':
                this.reportService.repObj.reportname = "Purchase Order Detail Central";
                this.reportService.repObj.reportdescription = "Purchase Order Detail Central";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'purchasereturnreport':
                this.reportService.repObj.reportname = "PURCHASE RETURN REPORT";
                this.reportService.repObj.reportdescription = "Purchase Return Report";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'purchaseordersummary':
                this.reportService.repObj.reportname = "Purchase Order Summary";
                this.reportService.repObj.reportdescription = "Purchase Order Summary";
                break;
            case 'POVSMRReport':
                this.reportService.repObj.reportname = "POVSMRReport";
                this.reportService.repObj.reportdescription = "PO VS MR Report";
                break;
            case 'IndentVSPOReport':
                this.reportService.repObj.reportname = "IndentVSPOReport";
                this.reportService.repObj.reportdescription = "Indent VS PO Report";
                break;
            case 'purchasesummary':
                this.reportService.repObj.reportname = "Purchase Summary";
                this.reportService.repObj.reportdescription = "Purchase Summary";
                break;
            case 'purchaseRegisterReport':
                this.reportService.repObj.reportname = "purchaseRegisterReport";
                this.reportService.repObj.reportdescription = "Purchase Register Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                break;
            case 'purchaseReturnSummaryReport':
                this.reportService.repObj.reportname = "Purchase Return Summary Report";
                this.reportService.repObj.reportdescription = "Purchase Return Summary Report";
                break;
            case 'GSTPurchaseSummaryTaxSlabReport':
                this.reportService.repObj.reportname = "GSTPURCHASESUMMARYTAXSLAB";
                this.reportService.repObj.reportdescription = "GST PURCHASE SUMMARY TAX SLAB";
                break;
            case 'POvsPIReport':
                this.reportService.repObj.reportname = "POvsPI Report";
                this.reportService.repObj.reportdescription = "POv sPI Report";
                break;
            case 'POvsPICentralReport':
                this.reportService.repObj.reportname = "POvsPI Central Report";
                this.reportService.repObj.reportdescription = "PO vsPI Central Report";
                break;
            case 'itemwisechannelmarginreport':
                this.reportService.repObj.reportname = "ITEMWISE CHANNEL MARGIN";
                this.reportService.repObj.reportdescription = "Item Wise Channel  Margin";
                break;
            case 'itemMasterreport':
                this.reportService.repObj.reportname = "ITEM MASTER";
                this.reportService.repObj.reportdescription = "Item Master";
                break;
            case 'PRICELIST':
                this.reportService.repObj.reportname = "PRICELIST";
                this.reportService.repObj.reportdescription = "Price List";
                break;
            case 'transferincentralreport':
                this.reportService.repObj.reportname = "TransferInCentralReport";
                this.reportService.repObj.reportdescription = "Transfer In Central Report";
                break;
            case 'transferoutcentralreport':
                this.reportService.repObj.reportname = "TransferOutCentralReport";
                this.reportService.repObj.reportdescription = "Transfer Out Central Report";
                break;
            case 'LOYALTY REPORT':
                this.reportService.repObj.reportname = "LOYALTY REPORT";
                this.reportService.repObj.reportdescription = "LOYALTY REPORT";
                break;

            case 'OUTLETLIST':
                this.reportService.repObj.reportname = "OUTLETLIST";
                this.reportService.repObj.reportdescription = "Ootlet List";
                break;

            case 'SCHEMEMASTER':
                this.reportService.repObj.reportname = "SCHEMEMASTER";
                this.reportService.repObj.reportdescription = "Scheme Master";
                break;
            case 'mrp-change-report':
                this.reportService.repObj.reportname = "MRP Change Report";
                this.reportService.repObj.reportdescription = "MRP Change Report";
                break;
            case 'audit-report':
                this.reportService.repObj.reportname = "Audit Report";
                this.reportService.repObj.reportdescription = "Audit Report";
                break;
            case 'auditcentral-report':
                this.reportService.repObj.reportname = "AUDITREPORTCENTRAL";
                this.reportService.repObj.reportdescription = "Audit Central Report";
                break;
            case 'itemSchemeMasterreport':
                this.reportService.repObj.reportname = "Item Scheme Master";
                this.reportService.repObj.reportdescription = "Item Scheme Master";
                break;
            case 'schemereport':
                this.reportService.repObj.reportname = "Scheme Report";
                this.reportService.repObj.reportdescription = "Scheme Report";
                break;
            case 'claimreport':
                this.reportService.repObj.reportname = "Claim Report";
                this.reportService.repObj.reportdescription = "Claim Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                break;
            case 'erpSalesReturnReport':
                this.reportService.repObj.reportname = "ERP SALES RETURN REPORT";
                this.reportService.repObj.reportdescription = "ERP Sales Return Report";
                this.reportService.repObj.reportparam.VENDORCODE = "";
                this.reportService.repObj.reportparam.COMPANYID = "";
                break;
            case 'erpPurchaseReturnReport':
                this.reportService.repObj.reportname = "ERP PURCHASE RETURN REPORT";
                this.reportService.repObj.reportdescription = "ERP Purchase Return Report";
                this.reportService.repObj.reportparam.VENDORCODE = "";
                this.reportService.repObj.reportparam.COMPANYID = "";
                break
            case 'claimandexpiryreport':
                this.reportService.repObj.reportname = "Claim And Expiry (purchase)";
                this.reportService.repObj.reportdescription = "Claim And Expiry (purchase)";
                this.reportService.repObj.reportparam.ITEMDIVISION = '%';
                this.reportService.repObj.reportparam.MONTH = moment().format("M");
                this.reportService.repObj.reportparam.YEAR = moment().format('YYYY');
                break
            case 'areasalesourstandinreport':
                this.reportService.repObj.reportname = "Area Sales Outstanding Report";
                this.reportService.repObj.reportdescription = "Area Sales Outstanding Report";
                this.reportService.repObj.reportparam.DSM = '';
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }
                ]
                break;


            case 'salesmanecoreport':
                this.reportService.repObj.reportname = "Salesman And Eco Report";
                this.reportService.repObj.reportdescription = "Salesman And Eco Report";
                this.reportService.repObj.reportparam.DSM = '';
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMCODE",
                        position: 'top'

                    }

                }
                ]
                break;





            case 'customerbillreminderreport':
                this.reportService.repObj.reportname = "Customer Bill Reminder Report";
                this.reportService.repObj.reportdescription = "Customer Bill Reminder Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>
                    {
                        label: "CUSTOMER SELECTION",
                        name: "ACID",
                        type: "multiselect",
                        options: this.reportService.allCustomer,
                        multiSelectSetting: {
                            singleSelection: false,
                            text: 'Select',
                            enableCheckAll: true,
                            selectAllText: 'Select All',
                            unSelectAllText: 'UnSelect All',
                            enableSearchFilter: true,
                            searchBy: [],
                            maxHeight: 300,
                            badgeShowLimit: 999999999999,
                            classes: '',
                            disabled: false,
                            searchPlaceholderText: 'Search',
                            showCheckbox: true,
                            noDataLabel: 'No Data Available',
                            searchAutofocus: true,
                            lazyLoading: false,
                            labelKey: "ACNAME",
                            primaryKey: "ACID",
                            position: 'top'

                        }
                    }
                ]


                break
            case 'partyageoutstandingreconcillation':
                this.reportService.repObj.reportname = "Party Age Outstanding Reconcillation Report";
                this.reportService.repObj.reportdescription = "Party Age Outstanding Reconcillation Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;


                break
            case 'loyaltymasterreport':
                this.reportService.repObj.reportname = "Loyalty Master Report";
                this.reportService.repObj.reportdescription = "Loyalty Master Report";


                break;
            case 'offlinesyncreport':
                this.reportService.repObj.reportname = "Offline Sync Report";
                this.reportService.repObj.reportdescription = "Offline Sync Report";
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;


            case 'SalesVsGRNAnalysis':
                this.reportService.repObj.reportname = "SalesVsGRNAnalysis";
                this.reportService.repObj.reportdescription = "Sales Vs GRN Analysis Central Report";
                // this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                // this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;

                break;
            case 'ExpectedPOVsActualPurchase':
                this.reportService.repObj.reportname = "ExpectedPOVsActualPurchase";
                this.reportService.repObj.reportdescription = "Expected PO Vs Actual Purchase Central Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;

                break;


            case 'SuggestedPOQtybasedonlastdaySale':
                this.reportService.repObj.reportname = "SuggestedPOQtybasedonlastdaySale";
                this.reportService.repObj.reportdescription = "Suggested PO Qty based on lastday Sale Central Report";
                // this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                // this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;

                break;

            case 'ItemTransactionHistory':
                this.reportService.repObj.reportname = "ItemTransactionHistory";
                this.reportService.repObj.reportdescription = "Item Transaction History Central Report";
                // this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                // this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'ItemTransactionHistoryStandAlone':
                this.reportService.repObj.reportname = "ItemTransactionHistoryStandAlone";
                this.reportService.repObj.reportdescription = "Item Batch Register Report";
                // this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                // this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'FastMovingOutletWise':
                this.reportService.repObj.reportname = "FastMovingOutletWise";
                this.reportService.repObj.reportdescription = "Fast Moving ItemWise REPORT";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'SlowMovingOutletWise':
                this.reportService.repObj.reportname = "SlowMovingOutletWise";
                this.reportService.repObj.reportdescription = "Slow Moving ItemWise Report";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'PushSalesItemList':
                this.reportService.repObj.reportname = "PushSalesItemList";
                this.reportService.repObj.reportdescription = "Push Sales Item List REPORT";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                break;
            case 'ItemSalesHistory':
                this.reportService.repObj.reportname = "ItemSalesHistory";
                this.reportService.repObj.reportdescription = "Item Sales History List  REPORT";
                this.reportService.repObj.reportparam.division = this.masterService.userProfile.userDivision;
                this.reportService.repObj.reportparam.COMPANYTYPE = this.masterService.userProfile.CompanyInfo.ORG_TYPE;
                this.reportService.repObj.columnSetting = [<ColumnConfiguration>{
                    label: "DSM SELECTION",
                    name: "DSM",
                    type: "multiselect",
                    options: this.reportService.AllDSM,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "DSMNAME",
                        primaryKey: "DSMNAME",
                        position: 'top'

                    }

                },
                {
                    label: "BEAT SELECTION",
                    name: "BEAT",
                    type: "multiselect",
                    options: this.reportService.ALLBEAT,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "BEAT",
                        primaryKey: "BEAT",
                        position: 'top'

                    }
                },
                {
                    label: "CUSTOMER SELECTION",
                    name: "ACID",
                    type: "multiselect",
                    options: this.reportService.allCustomer,
                    multiSelectSetting: {
                        singleSelection: false,
                        text: 'Select',
                        enableCheckAll: true,
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableSearchFilter: true,
                        searchBy: [],
                        maxHeight: 300,
                        badgeShowLimit: 999999999999,
                        classes: '',
                        disabled: false,
                        searchPlaceholderText: 'Search',
                        showCheckbox: true,
                        noDataLabel: 'No Data Available',
                        searchAutofocus: true,
                        lazyLoading: false,
                        labelKey: "ACNAME",
                        primaryKey: "ACID",
                        position: 'top'

                    }
                }

                ]
                break;


            default:
                break;

        }
    }


    commonParamInReports() {
        this.reportService.calendarForm = this.fb.group({
            selectedDate: [{
                startDate: moment(),
                endDate: moment()
            }, Validators.required],
        });
        this.reportService.repObj.reportparam.PHISCALID = this.masterService.userProfile.CompanyInfo.PhiscalID;
        this.reportService.repObj.reportparam.PhiscalID = this.masterService.userProfile.CompanyInfo.PhiscalID;
    }

}