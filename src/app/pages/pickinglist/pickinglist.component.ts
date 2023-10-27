import { Component, ViewChild } from '@angular/core';
// import { GenericPopUpSettings, GenericPopUpComponent } from '../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../common/repositories';
import { SpinnerService } from '../../common/services/spinner/spinner.service';
import { AlertService } from '../../common/services/alert/alert.service';
import * as moment from 'moment'
import { GenericPopUpComponent, GenericPopUpSettings } from '../../common/popupLists/generic-grid/generic-popup-grid.component';
import { PrintInvoiceComponent } from '../../common/Invoice/print-invoice/print-invoice.component';
import { VoucherTypeEnum } from '../../common/interfaces/TrnMain';
@Component(
    {
        selector: 'pickinglist',
        templateUrl: './pickinglist.component.html',
    }
)
export class PickingListComponent {

    public showPosPrinterPreview: boolean = false;
    printStringForPos:string;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    public voucherType: string = "";
    public selectedVoucherList = [];
    pickupfilter: string = "0";
    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    fromDate: string;
    toDate: string;
    constructor(public masterService: MasterRepo, public loadingService: SpinnerService, public alertService: AlertService, public invoicePrint: PrintInvoiceComponent) {
        this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "Proforma List",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "VCHRNO",
                    title: "Proforma No",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "REFBILL",
                    title: "Ref Bill",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "REFORDBILL",
                    title: "Order No",
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: "TRNDATE",
                    title: "Date",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "NETAMOUNT",
                    title: "Amount",
                    hidden: true,
                    noSearch: true
                }
            ]
        });


    }

    ngOnInit() {

    }


    dateChanged(date) {
        if (this.selectedDate.startDate != null) {
            try {
                this.fromDate = moment(this.selectedDate.startDate).format('MM-DD-YYYY');
                this.toDate = moment(this.selectedDate.endDate).format('MM-DD-YYYY');
                this.loadingService.show("Getting Proforma List.Please wait.");
                this.masterService.masterGetmethod(`/${this.pickupfilter == "0" ? 'getConfirmedProformaListFromDate' : 'getpickuplistProformaListFromDate'}?from=${this.fromDate}&to=${this.toDate}`).subscribe((res) => {
                    console.log(res);
                    this.selectedVoucherList = res.result;
                    this.loadingService.hide();
                }, error => {
                    this.loadingService.hide();
                    this.alertService.error(error);
                })
            } catch (ex) {
                this.loadingService.hide();
                this.alertService.error(ex);
            }
        }
    }



    showList() {
        this.genericGrid.show("", false, `${this.pickupfilter == "0" ? 'getConfirmedProformaList' : 'getpicklistproforma'}`, false);
    }




    onItemDoubleClick(event) {
        let x: any
        x = this.selectedVoucherList.filter(itm => itm.VCHRNO == event.VCHRNO)
        if (x.length > 0) {
            return;
        }
        this.selectedVoucherList.push(event)
    }


    removeFromSelectedList(index) {
        this.selectedVoucherList.splice(index, 1)
    }


    public activeurlpath: string = "";
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
            this.selectedVoucherNo.push({ VCHRNO: x.VCHRNO, REFBILL: x.REFBILL })

        })

        this.masterService.masterPostmethod_NEW('/getmultipleprintdata', voucherList).subscribe((res) => {
            if (res && res.status == "ok" && res.result.length) {
                this.loadingService.hide();
                res.result.forEach(x => {
                    htmlString = htmlString + this.invoicePrint.getMultiPrintBody(x.result, x.result2, VoucherTypeEnum.PerformaSalesInvoice, this.activeurlpath, 1, true)
                })
            } else {
                this.loadingService.hide();
            }
        }, err => {
            this.loadingService.hide();
            this.alertService.error(err);
        }, () => {
            this.loadingService.hide();
            this.masterService.masterPostmethod("/updatePickListStatus", this.selectedVoucherNo).subscribe((res) => {
            });


            let popupWin;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.write(`
            <html> <head>
            <style>
                @media print
                {
                    .pagebreak { page-break-after: always; }
                    tr    { page-break-inside:always; page-break-after:always }
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






        // for (let i in this.selectedVoucherList) {
        //     
        //     this.selectedVoucherNo.push({ VCHRNO: this.selectedVoucherList[i].VCHRNO,REFBILL:this.selectedVoucherList[i].REFBILL })
        //     try {
        //         this.masterService.getInvoiceData(this.selectedVoucherList[i].VCHRNO, this.selectedVoucherList[i].DIVISION, this.selectedVoucherList[i].PhiscalID, this.selectedVoucherList[i].PARAC).subscribe((res) => {
        //             htmlString = htmlString + this.invoicePrint.getMultiPrintBody(res.result, res.result2,"PP", this.activeurlpath)
        //             index++;
        //         }, err => {
        //             this.loadingService.hide();
        //             this.alertService.error(err);


        //         }, () => {
        //             if (index == this.selectedVoucherList.length) {
        //                 this.loadingService.hide();
        //                 this.masterService.masterPostmethod("/updatePickListStatus", this.selectedVoucherNo).subscribe((res) => {
        //                     
        //                 })
        //                 let popupWin;
        //                 popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        //                 popupWin.document.write(`
        //             <html> <head>
        //             <style>
        //                 @media print
        //                 {
        //                 table { page-break-after:always }
        //                 tr    { page-break-inside:always; page-break-after:always 
        //                 td    { page-break-inside:avoid; page-break-after:always }
        //                 thead { display:table-header-group }
        //                 tfoot { display:table-footer-group }
        //                 }
        //                 </style>
        //             </head>
        //             <body onload="window.print();window.close()">
        //             ${htmlString}
        //             </body>
        //             </html>`
        //                 );
        //                 popupWin.document.close();
        //             }
        //         })
        //     } catch (ex) {
        //         this.alertService.error(ex)
        //     }
        // }






    }
    print3mm()
    {
        this.printStringForPos="";
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
            this.selectedVoucherNo.push({ VCHRNO: x.VCHRNO, REFBILL: x.REFBILL })

        });

        this.masterService.masterPostmethod_NEW('/getReprintDataForMultipleVoucher', voucherList).subscribe((res) => {
            if (res && res.status == "ok" ) {
                this.loadingService.hide();
                this.showPosPrinterPreview=true;
                this.printStringForPos=res.result;
               
            } else {
                this.loadingService.hide();
                this.alertService.error(res.result);
            }
        }, err => {
            this.loadingService.hide();
            this.alertService.error(err);
        }, () => {
            this.loadingService.hide();
    });
}

    cancelprint() {
     
        this.showPosPrinterPreview = false;
       
    
      }
      printPosBill() {
        this.showPosPrinterPreview = false
        var ws;
        ws = new WebSocket('ws://127.0.0.1:1660');
        ws.addEventListener('message', ws_recv, false);
        ws.addEventListener('open', ws_open(this.printStringForPos), false);
        function ws_open(text) {
          ws.onopen = () => ws.send(text)
        }
    
        function ws_recv(e) {
    
        }
        this.masterService.masterPostmethod("/updatePickListStatus", this.selectedVoucherNo).subscribe((res) => {
        });

      }
}