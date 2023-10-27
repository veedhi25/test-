import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../common/popupLists/generic-grid/generic-popup-grid.component';
import { PrintInvoiceComponent } from '../../common/Invoice/print-invoice/print-invoice.component';
import { MasterRepo } from '../../common/repositories';
import { SpinnerService } from '../../common/services/spinner/spinner.service';
import { AlertService } from '../../common/services/alert/alert.service';
declare var jQuery;
import * as moment from 'moment'
import { stringify } from 'querystring';
import { TransactionService } from '../../common/Transaction Components/transaction.service';
import { VoucherTypeEnum } from '../../common/interfaces/TrnMain';
@Component(
    {
        selector: 'multiple-print',
        templateUrl: './multiple-voucher-print.component.html',
    }
)
export class MultiPrintComponent {


    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    public voucherType: string = "";
    public selectedVoucherList = [];
    public tmpselectedVoucherList = [];
    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    alwaysShowCalendars: boolean = true;
    includeAlreadyPrinted: boolean = false;
    from: string;
    to: string;
    printstatus: string = "All";
    selectedItemCode: string;
    noOfPrints: number;
    locale = {
        format: 'DD/MM/YYYY',
        direction: 'ltr', // could be rtl
        weekLabel: 'W',
        separator: ' - ', // default is ' - '
        cancelLabel: 'Cancel', // detault is 'Cancel'
        applyLabel: 'Okay', // detault is 'Apply'
        clearLabel: 'Clear', // detault is 'Clear'
        customRangeLabel: 'Custom Range',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: 0 // first day is monday
    }
    constructor(public _transactionService: TransactionService, public invoicePrint: PrintInvoiceComponent, public masterService: MasterRepo, public loadingService: SpinnerService, public alertService: AlertService) {
        let FBDATE = (this._transactionService.userProfile.CompanyInfo.FBDATE).substr(0, 10);
        
    }

    ngOnInit() {

    }


    includeExcludePrinted() {

        if (this.includeAlreadyPrinted) {
            this.selectedVoucherList = this.tmpselectedVoucherList;
            this.includeAlreadyPrinted = !this.includeAlreadyPrinted;

        } else {
            this.selectedVoucherList = this.tmpselectedVoucherList.filter(x => x.ISPRINTED != 1);
            this.includeAlreadyPrinted = !this.includeAlreadyPrinted;
        }
    }

    getVoucherEnumFromVoucherType(value): VoucherTypeEnum {
        if (value == "PI") return VoucherTypeEnum.Purchase;
        if (value == "PO") return VoucherTypeEnum.PurchaseOrder;
        if (value == "PP") return VoucherTypeEnum.PerformaSalesInvoice;
        if (value == "API") return 1000;
        if (value == "DNI") return VoucherTypeEnum.DebitNote;
        if (value == "SO") return VoucherTypeEnum.SalesOrder;
        if (value == "TI") return VoucherTypeEnum.TaxInvoice;
        if (value == "CNI") return VoucherTypeEnum.CreditNote;
        return 0;
    }

    dateChanged(date) {
        this.genericGrid.hide()
        this.from = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
        this.to = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
        if (this.voucherType == null || this.voucherType == "" || this.voucherType == undefined) {
            this.alertService.warning("Please Select Voucher Type to proceed");
            return;
        } else {
            let filterObj = {
                from: this.from,
                to: this.to,
                voucherType: this.voucherType
            }
            this.loadingService.show("Please wait! Getting list of invoices.")
            this.masterService.invoiceListByDate(filterObj).subscribe((res) => {
                if (res.status == "ok") {
                    this.selectedVoucherList = res.result;
                    this.tmpselectedVoucherList = res.result;
                    this.loadingService.hide();
                } else {
                    this.loadingService.hide();
                    this.alertService.error(res.result)
                }
            }, error => {
                this.loadingService.hide();
                this.alertService.error(error);
            })
        }
    }

    showList() {
        if (this.voucherType == null || this.voucherType == "" || this.voucherType == undefined) {
            this.alertService.error("Please select voucher type to proceed");
            return;
        } else {
            this.genericGrid.show("", false, "", false);
        }
    }


    public activeurlpath: string = "";
    voucherChanged(event) {
        let modifiedVoucherType: string = event.target.value;
        if (event.target.value == "DNI") {
            this.activeurlpath = "add-debitnote-itembase";
            modifiedVoucherType = "DN";
        } else if (event.target.value == "CNI") {
            this.activeurlpath = "add-creditnote-itembase";
            modifiedVoucherType = "CN";
        } else {
            this.activeurlpath = ""
        }
        this.selectedVoucherList = [];
        this.tmpselectedVoucherList = [];
        if (this.voucherType == "" || this.voucherType == null || this.voucherType == undefined) {
            return;
        }
        else {
            var endPoint = ``;
            if (modifiedVoucherType == "API") {
                endPoint = `/getApprovedHOPerformaInvoicePagedList`;
            }
            else {
                endPoint = `/getTrnMainPagedList/${modifiedVoucherType}`;
            }

            this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
                title: this.renderTitle(this.voucherType),
                apiEndpoints: endPoint,
                defaultFilterIndex: 0,
                columns: [
                    {
                        key: 'VCHRNO',
                        title: 'Invoice Number.',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'TRNDATE',
                        title: 'DATE',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'NETAMNT',
                        title: 'AMOUNT',
                        hidden: false,
                        noSearch: false
                    },
                    {
                        key: 'PARAC',
                        title: 'CUSTOMER',
                        hidden: true,
                        noSearch: true
                    },
                    {
                        key: 'BILLTO',
                        title: 'CUSTOMER',
                        hidden: false,
                        noSearch: false
                    }
                ]
            })

            this.genericGrid.show("", false, "", false);

        }
    }

    PrintStatusChanged(event) {
        if (event.target.value == "Printed") {
            this.selectedVoucherList = this.tmpselectedVoucherList.filter(x => x.ISPRINTED == 1);
        }
        else if (event.target.value == "NonPrinted") {
            this.selectedVoucherList = this.tmpselectedVoucherList.filter(x => x.ISPRINTED == 0);
        }
        else if (event.target.value == "Remove") {
            this.selectedVoucherList = [];
        }
        else {
            this.selectedVoucherList = this.tmpselectedVoucherList;
        }
    }
    onItemDoubleClick(event) {
        let x: any
        x = this.selectedVoucherList.filter(itm => itm.VCHRNO == event.VCHRNO)
        if (x.length > 0) {
            return;
        }
        this.selectedVoucherList.push(event)
        this.tmpselectedVoucherList.push(event)
    }
    public renderTitle(prefix: string) {
        switch (prefix) {
            case "TI":
                return "Tax Invoice";
            case "PP":
                return "Proforma Invoice";
            case "PI":
                return "Purchase Invoice";
            case "JV":
                return "Journal Voucher";
            case "CE":
                return "Contra";
            case "PV":
                return "Expense Voucher";
            case "RV":
                return "Receive Voucher";
            case "DN":
                return "Debit Note";
            case "CN":
                return "Credit Note";
            case "CNI":
                return "Sales Return";
            case "DNI":
                return "Purchase Return";
            case "PO":
                return "Purchase Order";
            case "RFQ":
                 return "RFQ";
            case "SO":
                return "Sales order";
            case "API":
                return "Active Performa Invoice";
            default:
                return "";
        }
    }

    removeFromSelectedList(index) {
        this.selectedVoucherList.splice(index, 1)
        // this.tmpselectedVoucherList.splice(index, 1)
    }


    public selectedVoucherNo = [];
    print() {
        this.selectedVoucherNo = [];
        if (this.selectedVoucherList.length == 0) {
            this.alertService.error("Please Select Voucher.");
            return;
        }
        let htmlString: string = ""
        let index: number = 0;
        this.loadingService.show("Please Wait! Preparing Multiple Voucher for print")



        let voucherList = [];

        this.selectedVoucherList.forEach(x => {
            voucherList.push({
                VCHRNO: x.VCHRNO,
                DIVISION: x.DIVISION,
                PARAC: x.PARAC,
                PHISCALID: x.PhiscalID,
                tag: ""
            });
            this.selectedVoucherNo.push({ VCHRNO: x.VCHRNO });

        })

        this.masterService.masterPostmethod_NEW('/getmultipleprintdata', voucherList).subscribe((res) => {
            if (res && res.status == "ok" && res.result.length) {
                this.loadingService.hide();
                res.result.forEach(x => {
                    htmlString = htmlString + this.invoicePrint.getMultiPrintBody(x.result, x.result2, this.voucherType == "API" ? VoucherTypeEnum.PerformaSalesInvoice : this.getVoucherEnumFromVoucherType(this.voucherType), this.activeurlpath);
                })
            } else {
                this.loadingService.hide();
            }
        }, err => {
            this.loadingService.hide();
            this.alertService.error(err);
        }, () => {
            this.loadingService.hide();
            this.masterService.masterPostmethod("/updatePrintStatus", this.selectedVoucherNo).subscribe((res) => {
            });


            let popupWin;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.write(`
            <html> <head>
            <style>
                @media print
                {
                table { page-break-after:always }
                tr    { page-break-inside:always; page-break-after:always 
                td    { page-break-inside:avoid; page-break-after:always }
                thead { display:table-header-group }
                tfoot { display:table-footer-group }
                }
                </style>
            </head>
            <body onload="window.print();window.close()">
            ${htmlString}
            </body>
            </html>`
            );
            popupWin.document.close();
        })

    }








    customisedPrint = (): void => {
        let rdlcParams: any[] = [];
        this.selectedVoucherList.forEach(x => {
            rdlcParams.push({
                filename: "taxinvoicesample.rdlc", parameter:
                {
                    vchrno: x.VCHRNO,
                    division: x.DIVISION,
                    physicalid: x.PhiscalID,
                    Title: this.getTitleFromVoucherType(this.getVoucherEnumFromVoucherType(this.voucherType)),
                    printType:"kw"
                }
            })
        })
        let blob: any;
        this.masterService.getPrintDataForCustomisedPrint(rdlcParams).subscribe(
            (res: any) => {

                const blobUrl = URL.createObjectURL(res.content);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = blobUrl;
                document.body.appendChild(iframe);
                iframe.contentWindow.print();

            }
        )

    }
    customisedITCPrint = (): void => {
        let rdlcParams: any[] = [];
        this.selectedVoucherList.forEach(x => {
            rdlcParams.push({
                filename: "taxinvoicesample.rdlc", parameter:
                {
                    vchrno: x.VCHRNO,
                    division: x.DIVISION,
                    physicalid: x.PhiscalID,
                    Title: this.getTitleFromVoucherType(this.getVoucherEnumFromVoucherType(this.voucherType)),
                    printType:"itc"
                }
            })
        })
        let blob: any;
        this.masterService.getPrintDataForCustomisedPrint(rdlcParams).subscribe(
            (res: any) => {

                const blobUrl = URL.createObjectURL(res.content);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = blobUrl;
                document.body.appendChild(iframe);
                iframe.contentWindow.print();

            }
        )

    }



    getTitleFromVoucherType = (voucherType: VoucherTypeEnum): string => {
        switch (voucherType) {
            case VoucherTypeEnum.TaxInvoice:
                return "Tax Invoice";
            case VoucherTypeEnum.PerformaSalesInvoice:
                return "Proforma Invoice";
            case VoucherTypeEnum.Purchase:
                return "Purchase Invoice";
            case VoucherTypeEnum.Journal:
                return "Journal Voucher";
            case VoucherTypeEnum.ContraVoucher:
                return "Contra";
            case VoucherTypeEnum.PaymentVoucher:
                return "Expense Voucher";
            case VoucherTypeEnum.ReceiveVoucher:
                return "Receive Voucher";
            case VoucherTypeEnum.DebitNote:
                return "Debit Note";
            case VoucherTypeEnum.CreditNote:
                return "Credit Note";

            case VoucherTypeEnum.PurchaseOrder:
                return "Purchase Order";
            case VoucherTypeEnum.RFQ:
                return "RFQ";
            case VoucherTypeEnum.SalesOrder:
                return "Sales order";
            default:
                return "";
        }
    }
















    SingleItemLoad() {
        this.genericGrid.hide()
        this.from = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
        this.to = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
        if (this.voucherType == null || this.voucherType == "" || this.voucherType == undefined) {
            this.alertService.warning("Please Select Voucher Type to proceed");
            return;
        } else {
            let filterObj = {
                from: this.from,
                to: this.to,
                voucherType: this.voucherType,
                mcode: this.selectedItemCode == null ? "%" : this.selectedItemCode

            }
            this.loadingService.show("Please wait! Getting list of invoices.")
            this.masterService.masterPostmethod("/singleItemMultiPrintLoad", filterObj).subscribe((res) => {
                if (res.status == "ok") {
                    this.selectedVoucherList = res.result;
                    this.tmpselectedVoucherList = res.result;
                    this.loadingService.hide();
                } else {
                    this.loadingService.hide();
                    this.alertService.error(res.result)
                }
            }, error => {
                this.loadingService.hide();
                this.alertService.error(error);
            })
        }
    }

    noOfPrintsEventClick(noOfPrints) {
        this.selectedVoucherList.splice(noOfPrints, this.selectedVoucherList.length);
    }
}