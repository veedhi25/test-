import { Component } from '@angular/core';
import { AuthService } from '../../services/permission';
import * as moment from 'moment'
import { TransactionService } from '../../Transaction Components/transaction.service';
import { DecimalPipe } from '@angular/common';
import Rx from 'rxjs/Rx';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { VoucherTypeEnum } from '../../interfaces/TrnMain';



@Component(
    {

        selector: 'print-invoice',
        template: `
        <div id="print"></div>`,
        providers: [AuthService]
    }
)

export class PrintInvoiceComponent {

    private imageUrl = "assets/img/patanjali.png";
    private organisation_type: string = "";
    private companyProfile: any
    private userProfile: any
    private customerInfo: any
    private invoiceType: VoucherTypeEnum;
    public activeurlpath: string;
    public printMode: number;
    public noOfInvoiceForA5: number;
    public arrayIndex: number = 0;
    public numberOfItemInA5: number = 0;
    public grandTotal: any;
    invoiceCount: number;
    enableFooter: boolean;
    public isPickingList: boolean = false;

    public setting: any = <any>{}
    digitalSignatureUrl: any;




    constructor(private _authService: AuthService, private _transactionService: TransactionService) {
        this.userProfile = this._authService.getUserProfile();
        this.setting = this._authService.getSetting();
        this.companyProfile = this.userProfile.CompanyInfo;

    }

    limitDecimal(value: number) {
        return new DecimalPipe('en-US').transform(value, '1.2-2')
    }

    public gstData: any
    calculateGSTRateWise(data: any[]) {
        this.grandTotal = <any>{}
        Rx.Observable.from(data)
            .groupBy(x => x.GSTRATE)
            .flatMap(group => group.toArray())
            .map(g => {
                return {
                    IGSTRATE: g[0].GSTRATE,
                    IGSTTOTAL: _.sumBy(g, 'VAT'),
                    CGSTRATE: this._transactionService.nullToZeroConverter(g[0].GSTRATE) / 2,
                    CGSTTOTAL: this._transactionService.nullToZeroConverter(_.sumBy(g, 'VAT')) / 2,
                    SGSTRATE: this._transactionService.nullToZeroConverter(g[0].GSTRATE) / 2,
                    SGSTTOTAL: this._transactionService.nullToZeroConverter(_.sumBy(g, 'VAT')) / 2,
                    taxable: _.sumBy(g, 'TAXABLE')
                }
            })
            .toArray()
            .subscribe((d) => {
                this.gstData = d
            });
        data.forEach(x => {
            let conversionfactor: any
            conversionfactor = x.Product.AlternateUnits.find(con => con.ALTUNIT.toLowerCase() == "carton")
            if (conversionfactor == undefined || conversionfactor == null) {
                conversionfactor = <any>{};
                conversionfactor.CONFACTOR = 1;
            }
            x.CLD = Math.floor(this._transactionService.nullToZeroConverter(x.RealQty) / this._transactionService.nullToZeroConverter(x.CONFACTOR))
            x.PCS = Math.ceil(this._transactionService.nullToZeroConverter(x.RealQty) % this._transactionService.nullToZeroConverter(x.CONFACTOR))
            if (this.activeurlpath == 'add-creditnote-itembase' || this.invoiceType == VoucherTypeEnum.PurchaseOrder) {
                x.AltQty = (this._transactionService.nullToZeroConverter(x.REALQTY_IN) / this._transactionService.nullToZeroConverter(conversionfactor.CONFACTOR));
                x.CLD = Math.floor(this._transactionService.nullToZeroConverter(x.REALQTY_IN) / this._transactionService.nullToZeroConverter(conversionfactor.CONFACTOR));
                x.PCS = Math.ceil(this._transactionService.nullToZeroConverter(x.REALQTY_IN) % this._transactionService.nullToZeroConverter(conversionfactor.CONFACTOR));
            } else {
                x.AltQty = this._transactionService.nullToZeroConverter(x.RealQty) / this._transactionService.nullToZeroConverter(conversionfactor.CONFACTOR);
                x.CLD = Math.floor(this._transactionService.nullToZeroConverter(x.RealQty) / this._transactionService.nullToZeroConverter(conversionfactor.CONFACTOR));
                x.PCS = Math.ceil(this._transactionService.nullToZeroConverter(x.RealQty) % this._transactionService.nullToZeroConverter(conversionfactor.CONFACTOR));
            }
            if (x.ALTUNIT == null) {
                x.ALTUNIT = "PCS";
            }
            let ALTUNITObj = x.Product.AlternateUnits.filter(y => y.ALTUNIT.toLowerCase() == x.ALTUNIT.toLowerCase())
            if (ALTUNITObj == undefined || ALTUNITObj == null) {
                ALTUNITObj = [];
                if (ALTUNITObj[0] == null) {
                    ALTUNITObj.push(<any>{});
                }
                ALTUNITObj[0].CONFACTOR = 1;
            }
            // x.MRP = (this._transactionService.nullToZeroConverter(x.MRP == 0 ? x.SELECTEDITEM.MRP : x.MRP) * this._transactionService.nullToZeroConverter(ALTUNITObj[0].CONFACTOR));
            this.grandTotal.cldtotal = this._transactionService.nullToZeroConverter(this.grandTotal.cldtotal) + this._transactionService.nullToZeroConverter(x.AltQty);
            if (this.activeurlpath == 'add-creditnote-itembase' || this.invoiceType == VoucherTypeEnum.PurchaseOrder) {
                this.grandTotal.pcstotal = this._transactionService.nullToZeroConverter(this.grandTotal.pcstotal) + this._transactionService.nullToZeroConverter(x.REALQTY_IN);

            } else {
                this.grandTotal.pcstotal = this._transactionService.nullToZeroConverter(this.grandTotal.pcstotal) + this._transactionService.nullToZeroConverter(x.RealQty);
            }

            this.grandTotal.onlycldtotal = this._transactionService.nullToZeroConverter(this.grandTotal.onlycldtotal) + this._transactionService.nullToZeroConverter(x.CLD);
            this.grandTotal.onlypcstotal = this._transactionService.nullToZeroConverter(this.grandTotal.onlypcstotal) + this._transactionService.nullToZeroConverter(x.PCS);
            this.grandTotal.igsttotal = this._transactionService.nullToZeroConverter(this.grandTotal.igsttotal) + this._transactionService.nullToZeroConverter(x.VAT);
            this.grandTotal.cgsttotal = this._transactionService.nullToZeroConverter(this.grandTotal.cgsttotal) + this._transactionService.nullToZeroConverter(x.VAT) / 2;
            this.grandTotal.sgsttotal = this._transactionService.nullToZeroConverter(this.grandTotal.sgsttotal) + this._transactionService.nullToZeroConverter(x.VAT) / 2;
            this.grandTotal.pdistotal = this._transactionService.nullToZeroConverter(this.grandTotal.pdistotal) + this._transactionService.nullToZeroConverter(x.BasePrimaryDiscount);
            this.grandTotal.sdistotal = this._transactionService.nullToZeroConverter(this.grandTotal.sdistotal) + this._transactionService.nullToZeroConverter(x.BaseSecondaryDiscount);
            this.grandTotal.INDDISCOUNTTOTAL = this._transactionService.nullToZeroConverter(this.grandTotal.INDDISCOUNTTOTAL) + this._transactionService.nullToZeroConverter(x.INDDISCOUNT);
            this.grandTotal.NETWEIGHT = this._transactionService.nullToZeroConverter(this.grandTotal.NETWEIGHT) + (this._transactionService.nullToZeroConverter(x.NWEIGHT));
            this.grandTotal.TOTALWEIGHT = this._transactionService.nullToZeroConverter(this.grandTotal.TOTALWEIGHT) + this._transactionService.nullToZeroConverter(x.WEIGHT);
            this.grandTotal.TOTALCESS = this._transactionService.nullToZeroConverter(this.grandTotal.TOTALCESS) + this._transactionService.nullToZeroConverter(x.INDCESS_AMT);
            this.grandTotal.TOTNETAMOUNT = this._transactionService.nullToZeroConverter(this.grandTotal.TOTNETAMOUNT) + this._transactionService.nullToZeroConverter(x.NETAMOUNT);

        })
    }
    html: string;
    getprintHtlmString(invoiceData, customerInfo, invoiceType, activeurlpath: string = "") {
        this.calculateGSTRateWise(invoiceData.ProdList)




        this.invoiceType = invoiceType;
        if (customerInfo == null) {
            customerInfo = [];
        }
        if (customerInfo[0] == null) {
            customerInfo.push(<any>{});
        }
        this.customerInfo = customerInfo;
        this.activeurlpath = activeurlpath;
        let popupWin;
        let tableData = `<table *ngIf="itemDetail" #invoiceData  style='width: 100%;font-size: 10px;
            border-collapse: collapse;border-top: none;border-bottom: none'>`;
        let head = this.head(invoiceData, customerInfo);
        let body = this.body(invoiceData);
        let footer = this.footer(invoiceData);
        tableData = tableData + head + body + footer + + `</table>`;
        this.html = ` <html> <head>
                        <title>${invoiceType + '_' + this.customerInfo[0].ACNAME}</title>
                        </head>
                        <body>
                        ${tableData}
                        </body>
                    </html>`
        return this.html;
    }

    getMultiPrintBody(invoiceData, customerInfo, invoiceType, activeurlpath: string = "", printMode: number = 1, isPickingList: boolean = false) {
        this.isPickingList = isPickingList;


        this.invoiceCount = 0;
        let printString = "";

        try {

            this.noOfInvoiceForA5 = 0;
            if (customerInfo == null || !customerInfo.length) {
                customerInfo = [];
            }
            if (customerInfo[0] == null) {
                customerInfo.push(<any>{});
            }
            this.customerInfo = customerInfo;
            this.activeurlpath = activeurlpath;

            this.invoiceType = invoiceType;
            this.arrayIndex = 0;
            this.printMode = printMode;
            this.calculateGSTRateWise(invoiceData.ProdList)
            this.organisation_type = this.getOrgtypeBasedOnPartyType(invoiceData.PARTY_ORG_TYPE);

            let totalDiscount = 0;
            if (this.companyProfile.ORG_TYPE === "retailer" || this.companyProfile.ORG_TYPE === "ak" || this.companyProfile.ORG_TYPE === "ck" || this.companyProfile.ORG_TYPE === "gak" || this.companyProfile.ORG_TYPE === "pms") {
                invoiceData.ProdList.forEach(x => {
                    totalDiscount = this._transactionService.nullToZeroConverter(totalDiscount)
                        + this._transactionService.nullToZeroConverter(x.DISCOUNT) * (1 + (x.GSTRATE / 100))
                })
                invoiceData.DCAMNT = totalDiscount;
            }

            if (this.printMode == 1) {

                this.numberOfItemInA5 = 15;
                this.invoiceCount = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / 15);


                if (this.invoiceCount == 1 && invoiceData.ProdList.length >= 15) {
                    this.noOfInvoiceForA5 = 2;
                    this.numberOfItemInA5 = 15;
                } else {
                    this.noOfInvoiceForA5 = this.invoiceCount;
                }

                let popupWin, head, body, footer, tableData;
                if (this.invoiceType == VoucherTypeEnum.TaxInvoice && (this.organisation_type == 'distributor' ||
                    this.organisation_type == "superstockist" || this.organisation_type == "superdistributor")) {
                    tableData = this.body(invoiceData);
                } else {
                    tableData = ``
                    head = this.head(invoiceData, customerInfo)
                    body = `${this.body(invoiceData)}`
                    footer = this.footer(invoiceData)
                    tableData = tableData + head + body + footer
                }

                return tableData;
            }


            if (this.printMode == 2) {
                this.numberOfItemInA5 = 7;
                this.noOfInvoiceForA5 = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / this.numberOfItemInA5);
                let popupWin;
                let body = this.body(invoiceData)
                return body;
            }
            if (this.printMode == 13 || this.printMode == 14) {
                this.numberOfItemInA5 = 7;
                this.noOfInvoiceForA5 = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / this.numberOfItemInA5);
                let popupWin;
                let body = this.body(invoiceData)
                return body;
            }
        } catch (error) {
            alert(error);
        }
    }


    printInvoice(invoiceData, customerInfo, invoiceType, activeurlpath: string = "", printMode: number = 1) {
        console.log('PRINTINVOICE print mode ' + printMode);
        console.log(printMode);



        this.invoiceCount = 0;
        let printString = "";

        try {

            this.noOfInvoiceForA5 = 0;
            if (customerInfo == null || !customerInfo.length) {
                customerInfo = [];
            }
            if (customerInfo[0] == null) {
                customerInfo.push(<any>{});
            }
            this.customerInfo = customerInfo;
            this.activeurlpath = activeurlpath;

            this.invoiceType = invoiceType;
            this.arrayIndex = 0;
            this.printMode = printMode;
            if (this.printMode != 20) {
                this.calculateGSTRateWise(invoiceData.ProdList)
                this.organisation_type = this.getOrgtypeBasedOnPartyType(invoiceData.PARTY_ORG_TYPE);

                let totalDiscount = 0;
                if (this.companyProfile.ORG_TYPE === "ak" || this.companyProfile.ORG_TYPE === "ck" || this.companyProfile.ORG_TYPE === "gak" || this.companyProfile.ORG_TYPE === "pms") {
                    invoiceData.ProdList.forEach(x => {
                        totalDiscount = this._transactionService.nullToZeroConverter(totalDiscount)
                            + this._transactionService.nullToZeroConverter(x.DISCOUNT) * (1 + (x.GSTRATE / 100))
                    })
                    invoiceData.DCAMNT = totalDiscount;
                }
            }
            if (this.printMode == 1) {


                this.numberOfItemInA5 = 15;
                this.invoiceCount = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / 15);


                if (this.invoiceCount == 1 && invoiceData.ProdList.length >= 15) {
                    this.noOfInvoiceForA5 = 2;
                    this.numberOfItemInA5 = 15;
                } else {
                    this.noOfInvoiceForA5 = this.invoiceCount;
                }

                let popupWin, head, body, footer, tableData;
                if (this.invoiceType == VoucherTypeEnum.TaxInvoice && (this.organisation_type == 'distributor' ||
                    this.organisation_type == "superstockist" || this.organisation_type == "superdistributor")) {
                    tableData = this.body(invoiceData);
                } else {
                    tableData = `<table *ngIf="itemDetail" #invoiceData  style='width: 100%;font-size: 10px;
                    border-collapse: collapse;border-top: none;border-bottom: none'>`
                    head = this.head(invoiceData, customerInfo)
                    body = `<tbody>${this.body(invoiceData)}</tbody>`
                    footer = this.footer(invoiceData)
                    tableData = tableData + head + body + footer + `</table>`
                }

                this._transactionService.initialFormLoad(this._transactionService.TrnMainObj.VoucherType);

                printString = `<html><head>`

                if (this.organisation_type == 'fitindia') {
                    printString += `
                        `
                } else {
                    printString += `<title>${invoiceData.VCHRNO}_${this.transformDate(invoiceData.TRNDATE)}_${invoiceType + '_' + this.customerInfo[0].ACNAME}</title>
                        `
                }
                printString += ` <style>
                                            thead   {display: table-header-group;   }
                                            tfoot   {display: table-footer-group;   }
                                            @media print {
                                                .pagebreak { page-break-before: always; } /* page-break-after works, as well */
                                            }
                                        </style>
                                        </head>
                                        <body onload="window.print();window.close()">
                                        ${tableData}

                                        </body>
                                        </html>`



                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.write(printString);
                popupWin.document.close();
            }


            if (this.printMode == 2) {
                this.numberOfItemInA5 = 7;
                this.noOfInvoiceForA5 = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / this.numberOfItemInA5);
                let popupWin;
                let body = this.body(invoiceData)
                this._transactionService.initialFormLoad(this._transactionService.TrnMainObj.VoucherType);
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.write(`
                                        <html>
                                            <head>
                                            <title>${invoiceType + '_' + this.customerInfo[0].ACNAME}</title>
                                            <style>

                                                @media print {
                                                    .pagebreak { page-break-after: always; }
                                                }
                                            </style>
                                            </head>
                                            <body onload="window.print();window.close()">

                                            ${body}
                                            </body>
                                        </html>`
                );
                popupWin.document.close();
            }
            if (this.printMode == 3) {
                this.numberOfItemInA5 = 7;
                this.noOfInvoiceForA5 = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / this.numberOfItemInA5);
                let popupWin;
                let body = this.body(invoiceData)
                this._transactionService.initialFormLoad(this._transactionService.TrnMainObj.VoucherType);
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.write(`
                                        <html>
                                            <head>
                                            <title>${invoiceType + '_' + this.customerInfo[0].ACNAME}</title>
                                            <style>

                                                @media print {
                                                    .pagebreak { page-break-after: always; }
                                                }
                                            </style>
                                            </head>
                                            <body onload="window.print();window.close()">

                                            ${body}
                                            </body>
                                        </html>`
                );
                popupWin.document.close();
            }
            if (this.printMode == 13 || this.printMode == 14) {

                if (this.printMode == 13) {
                    this.numberOfItemInA5 = 20;
                } else {
                    this.numberOfItemInA5 = 7;
                }

                this.noOfInvoiceForA5 = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / this.numberOfItemInA5);
                let popupWin;
                let body = this.body(invoiceData)
                this._transactionService.initialFormLoad(this._transactionService.TrnMainObj.VoucherType);
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.write(`
                                        <html>
                                            <head>
                                            <title>${invoiceType + '_' + this.customerInfo[0].ACNAME}</title>
                                            <style>

                                                @media print {
                                                    .pagebreak { page-break-after: always; }
                                                }
                                            </style>
                                            </head>
                                            <body onload="window.print();window.close()">

                                            ${body}
                                            </body>
                                        </html>`
                );
                popupWin.document.close();
            }
            if (this.printMode == 12) {

                this.numberOfItemInA5 = 15;
                this.invoiceCount = Math.ceil((this._transactionService.nullToZeroConverter(invoiceData.ProdList.length)) / 15);


                if (this.invoiceCount == 1 && invoiceData.ProdList.length >= 15) {
                    this.noOfInvoiceForA5 = 2;
                    this.numberOfItemInA5 = 15;
                } else {
                    this.noOfInvoiceForA5 = this.invoiceCount;
                }

                let popupWin, head, body, footer, tableData;
                if (this.invoiceType == VoucherTypeEnum.TaxInvoice && (this.organisation_type == 'distributor' ||
                    this.organisation_type == "superstockist" || this.organisation_type == "superdistributor")) {
                    tableData = this.body(invoiceData);
                    // *ngIf="itemDetail" #invoiceData 
                } else {
                    tableData = `<table  style='width: 100%;font-size: 10px;
                    border-collapse: collapse;border-top: none;border-bottom: none'>`
                    head = this.head(invoiceData, customerInfo)
                    body = `<tbody>${this.body(invoiceData)}</tbody>`
                    footer = this.footer(invoiceData);
                    tableData = tableData + head + body + footer + `</table>`
                }

                this._transactionService.initialFormLoad(this._transactionService.TrnMainObj.VoucherType);

                printString = `<html><head>`

                if (this.organisation_type == 'fitindia') {
                    printString += `
                        `
                } else {
                    printString += `<title>${invoiceData.VCHRNO}_${this.transformDate(invoiceData.TRNDATE)}_${invoiceType + '_' + this.customerInfo[0].ACNAME}</title>
                        `
                }
                printString += ` <style>
                                            thead   {display: table-header-group;   }
                                            tfoot   {display: table-footer-group;   }
                                            @media print {
                                                .pagebreak { page-break-before: always; } /* page-break-after works, as well */
                                            }
                                        </style>
                                        </head>
                                        <body onload="window.print();window.close()">
                                        ${tableData}

                                        </body>
                                        </html>`


                // window.open('data:application/vnd.ms-excel,' + encodeURIComponent(printString));
                // console.log("reached at the bottom",printString);

                var blob = new Blob([printString], { type: "application/vnd.ms-excel" });
                var blobUrl = URL.createObjectURL(blob);
                var downloadLink = document.createElement("a");
                downloadLink.href = blobUrl;
                downloadLink.download = this._transactionService.pageHeading + '.xls';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);



            }
            if (this.printMode == 20) {
                // console.log(invoiceData,this.printMode);
                let popupWin, head, body, footer, tableData;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.write(`
                                        <html>
                                            <head>
                                            <title>${invoiceType + '_' + this.customerInfo[0].ACNAME}</title>
                                            <style>

                                                @media print {
                                                    .pagebreak { page-break-after: always; }
                                                }
                                            </style>
                                            </head>
                                            <body onload="window.print();window.close()">

                                            ${invoiceData}
                                            </body>
                                        </html>`
                );
                popupWin.document.close();
            }
            if (this.printMode == 100) {
                let popupWin;
                let printText = this.autorepeatableprint(invoiceData)
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.write(printText);
                popupWin.document.close();
            }
        } catch (error) {
            alert(error);
        }
    }

    transformDate(date) {
        return moment(date).format('DD/MM/YYYY')
    }

    isDrCr(dr, cr) {
        if (dr > 0) {
            return 'DR'
        } else if (cr > 0) {
            return 'CR'
        }

    }
    getOrgtypeBasedOnPartyType(PARTY_ORG_TYPE, geo: string = null): string {

        let customer_org_type: string = PARTY_ORG_TYPE;
        if (customer_org_type == undefined || customer_org_type == "" || customer_org_type == null) {
            customer_org_type = "";
        }
        if (geo == undefined || geo == "" || geo == null) {
            geo = "";
        }
        if ((customer_org_type.toLowerCase() == "ak" ||
            customer_org_type.toLowerCase() == "ck" ||
            customer_org_type.toLowerCase() == "gak" ||
            customer_org_type.toLowerCase() == "retailer") && this.companyProfile.ORG_TYPE.toLowerCase() == "pms"
        ) {
            return "distributor";
        } else if ((this.companyProfile.ORG_TYPE.toLowerCase() == "ak" ||
            this.companyProfile.ORG_TYPE.toLowerCase() == "ck" ||
            this.companyProfile.ORG_TYPE.toLowerCase() == "gak" ||
            this.companyProfile.ORG_TYPE.toLowerCase() == "pms") && geo == "fitindia") {
            return "fitindia";
        } else {
            return this.companyProfile.ORG_TYPE;
        }
    }





    head(data, customer = null): string {

        var header = "";
        if (this.printMode == 1 || this.printMode == 12) {

            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && this.companyProfile.ORG_TYPE != 'distributor' &&
                this.companyProfile.ORG_TYPE != 'superdistributor' &&
                this.companyProfile.ORG_TYPE != 'fitindia' &&
                this.companyProfile.ORG_TYPE.toLowerCase() != 'wdb' &&
                this.companyProfile.ORG_TYPE.toLowerCase() != 'ssa' &&
                this.companyProfile.ORG_TYPE.toLowerCase() != 'zcp') {

            }
            else if (this.activeurlpath == "StockSettlementEntry") {
                header = header + `
          <thead style='border: 1px solid black;'>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'><b>${this.companyProfile.NAME}</b></td>
                </tr>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'>${this.companyProfile.ADDRESS} &nbsp;${this.companyProfile.ADDRESS2},&nbsp;${this.companyProfile.STATE}</td>
                </tr>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'>Tel: ${this.companyProfile.TELA} </td>
                </tr>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'>Email : ${this.companyProfile.EMAIL} </td>
                </tr>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'>GST NO. :${this.companyProfile.GSTNO} <br/> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                </tr>
                <tr style='border: 1px solid black;'>
                    <td colspan='1' style='text-align: left;'><b>SL NO</b></td>
                    <td colspan='1' style='text-align: left;'><b>Item Code<b></td>
                    <td colspan='4' style='text-align: left;'><b>Item Name</b></td>
                    <td colspan='1' style='text-align: left;'><b>CLD</b></td>
                    <td colspan='1' style='text-align: left;'><b>PCS</b></td>
                    <td colspan='1' style='text-align: left;'><b>QTY<b/></td>
                    <td colspan='1' style='text-align: left;'><b>UOM<b/></td>
                    <td colspan='1' style='text-align: left;'><b>MRP<b/></td>
                    <td colspan='1' style='text-align: left;'><b>GST%</b></td>
                    <td colspan='1' style='text-align: left;'><b>GST Amt</b></td>
                    <td colspan='1' style='text-align: left;'><b>TOTAL AMT</b></td>
                </tr>
      </thead>
          `
            } else if (this.invoiceType == VoucherTypeEnum.StockSettlement) {
                header = header + `
          <thead style='border: 1px solid black;'>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'><b>${this.companyProfile.NAME}</b></td>
                </tr>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'>${this.companyProfile.ADDRESS} &nbsp;${this.companyProfile.ADDRESS2},&nbsp;${this.companyProfile.STATE}</td>
                </tr>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'>Tel: ${this.companyProfile.TELA} </td>
                </tr>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'>Email : ${this.companyProfile.EMAIL} </td>
                </tr>
                <tr>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='2'>&nbsp;</td>
                    <td colspan='6'>GST NO. :${this.companyProfile.GSTNO}</td>
                </tr>
                <tr style='border: 1px solid black;'>
                    <td colspan='1' style='text-align: left;'><b>SL NO</b></td>
                    <td colspan='1' style='text-align: left;'><b>Item Code</b></td>
                    <td colspan='4' style='text-align: left;'><b>Item Name</b></td>
                    <td colspan='1' style='text-align: left;'><b>CLD</b></td>
                    <td colspan='1' style='text-align: left;'><b>PCS</b></td>
                    <td colspan='1' style='text-align: left;'><b>QTY</b></td>
                    <td colspan='1' style='text-align: left;'><b>UOM</b></td>
                    <td colspan='1' style='text-align: left;'><b>MRP</b></td>
                    <td colspan='1' style='text-align: left;'><b>GST%</b></td>
                    <td colspan='1' style='text-align: left;'><b>GST Amt</b></td>
                    <td colspan='1' style='text-align: left;'><b>TOTAL AMT</b></td>
                </tr>
      </thead>
          `
            } else if (this.invoiceType == VoucherTypeEnum.PurchaseOrder) {
                header = header + `
          <thead style='border: 1px solid black;'>
                <tr>
                    <td colspan='14' style='text-align:center;border-right: 1px solid black;'>${this.companyProfile.NAME}</td>

                </tr>
                <tr>
                <td colspan='14' style='text-align:center;border-right: 1px solid black;'>${this.companyProfile.ADDRESS} &nbsp;${this.companyProfile.ADDRESS2},&nbsp;${this.companyProfile.STATE}</td>
                </tr>
                <tr>
                <td colspan='14' style='text-align:center;border-right: 1px solid black;'>Tel: ${this.companyProfile.TELA}</td>
                </tr>
                <tr>
                <td colspan='14' style='text-align:center;border-right: 1px solid black;'>Email : ${this.companyProfile.EMAIL} </td>

                </tr>
                <tr>
                <td colspan='14' style='text-align:center;border-right: 1px solid black;'>GST NO. :${this.companyProfile.GSTNO}</td>
                </tr>
                <tr>
                    <td colspan='14' style='border-right: 1px solid black;'>&nbsp;</td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                <td colspan='14' style='text-align:center;border-right: 1px solid black;'>PURCHASE ORDER</td>
                </tr>
                <tr>
                    <td colspan='2'>Supplier Name</td>
                    <td colspan='3'>${data.BILLTO ? data.BILLTO : ''}</td>
                    <td colspan='6'>&nbsp;</td>
                    <td colspan='1'>P.O. Number:</td>
                    <td colspan='2' style="border-right:1px solid #000;">${data.VCHRNO ? data.VCHRNO : ''}</td>
                </tr>
                <tr>
                    <td colspan='2'>Address</td>
                    <td colspan='4'>${data.BILLTOADD ? data.BILLTOADD : ''}</td>
                    <td colspan='5'>&nbsp;</td>
                    <td colspan='1'>P.O. Date:</td>
                    <td colspan='2' style="border-right:1px solid #000;">${this.transformDate(data.TRNDATE)}</td>
                </tr>
                <tr>
                    <td colspan='2'>Mobile No.:</td>
                    <td colspan='4'>${data.BILLTOMOB ? data.BILLTOMOB : ''}</td>
                    <td colspan='5'>&nbsp;</td>
                    <td colspan='1'>Gross Weight:</td>
                    <td colspan='2' style="border-right:1px solid #000;">${this.limitDecimal(this.grandTotal.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='2'>GST NO:</td>
                    <td colspan='4'>${this.customerInfo[0].GSTNO ? this.customerInfo[0].GSTNO : ''}</td>
                    <td colspan='5'>&nbsp;</td>
                    <td colspan='1'>Net Weight:</td>
                    <td colspan='2' style="border-right:1px solid #000;">${this.limitDecimal(this.grandTotal.NETWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='14' style="border-right:1px solid #000;">&nbsp;</td>
                </tr>
                <tr>
                <td colspan='2' style="border-top:1px solid #000;">Bill To:</td>
                <td colspan='3' style="border-top:1px solid #000;">${data.billToDetail.ACNAME ? data.billToDetail.ACNAME : ''}</td>
                <td colspan='4' style="border-top:1px solid #000;">&nbsp;</td>
                <td colspan='2' style="border-top:1px solid #000;">Ship To:</td>
                <td colspan='3' style="border-top:1px solid #000;">${data.shipToDetail.ACNAME ? data.shipToDetail.ACNAME : data.BILLTO}</td>                    
            </tr>
            <tr>
                <td colspan='2'>Address</td>
                <td colspan='3'>${data.billToDetail.ADDRESS ? data.billToDetail.ADDRESS : ''}</td>
                <td colspan='4'>&nbsp;</td>
                <td colspan='2'>Address:</td>
                <td colspan='3'>${data.shipToDetail.ADDRESS ? data.shipToDetail.ADDRESS : data.BILLTOADD}</td>
            </tr>
            <tr>
                <td colspan='2'>Mobile:</td>
                <td colspan='3'>${data.billToDetail.MOBILE ? data.billToDetail.MOBILE : ''}</td>
                <td colspan='4'>&nbsp;</td>
                <td colspan='2'>Mobile No:</td>
                <td colspan='3'>${data.shipToDetail.MOBILE ? data.shipToDetail.MOBILE : (data.BILLTOMOB ? data.BILLTOMOB : '')}</td>
            </tr>
            <tr>
                <td colspan='2'>GST NO:</td>
                <td colspan='3'>${data.billToDetail.GSTNO ? data.billToDetail.GSTNO : ''}</td>
                <td colspan='4'>&nbsp;</td>
                <td colspan='2'>GST NO:</td>
                <td colspan='3'>${data.shipToDetail.GSTNO ? data.shipToDetail.GSTNO : ''}</td>
            </tr>
                <tr style='border: 1px solid black;'>
                    <td colspan='1' style='text-align: left;'><b>SL NO</b></td>
                    <td colspan='1' style='text-align: left;'><b>Item Code</b></td>
                    <td colspan='${this.companyProfile.COMPANYID == "8888888" ? 4 : 3}' style='text-align: left;'><b>Item Name</b></td>
                    <td colspan='1' style='text-align: left;'><b>CLD</b></td>
                    <td colspan='1' style='text-align: left;'><b>PCS</b></td>
                    <td colspan='1' style='text-align: left;'><b>QTY</b></td>
                    <td colspan='1' style='text-align: left;'><b>UOM</b></td>
                    <td colspan='1' style='text-align: left;'><b>COST PRICE</b></td>`;
                if (this.companyProfile.COMPANYID != "8888888") {
                    header = header + ` <td colspan='1' style='text-align: left;'><b>MRP</b></td>`;
                }
                header = header + ` <td colspan='1' style='text-align: left;'><b>GST%</b></td>
                    <td colspan='1' style='text-align: left;'><b>GST Amt</b></td>
                    <td colspan='1' style='text-align: left; border-right:1px solid #000;'><b>TOTAL AMT</b></td>
                </tr>
      </thead>
          `
            } else if (this.invoiceType == VoucherTypeEnum.SalesOrder) {
                header = header + `
          <thead style='border: 1px solid black;'>
          <tr>
              <td colspan='9'></td>
              <td colspan='2' style='text-align: left;'><b>${this.companyProfile.NAME}</b></td>
          </tr>
          <tr>
              <td colspan='9'></td>
              <td colspan='2' style='text-align: left;'><b>${this.companyProfile.PLACE}, &nbsp;${this.companyProfile.ADDRESS} &nbsp;${this.companyProfile.ADDRESS2}, &nbsp;${this.companyProfile.STATE}</b></td>
          </tr>
          <tr>
              <td colspan='9'></td>
              <td colspan='2' style='text-align: left;'><b>Tel: ${this.companyProfile.TELA}</b></td>
          </tr>
          <tr style='border-bottom: 1px solid black'>
              <td colspan='4'>&nbsp;</td>
              <td colspan='3' style='text-align: center;'><b>SALES ORDER</b></td>
              <td colspan='4'>&nbsp;</td>
          </tr>
          <tr>
              <td colspan='1'>Customer:</td>
              <td colspan='8'>${data.BILLTO}</td>
              <td colspan='1'>SO No:</td>
              <td colspan='1'>${data.VCHRNO}</td>
          </tr>
          <tr>
          <td colspan='1'>Gross Weight:</td>
          <td colspan='2'>${this.limitDecimal(this.grandTotal.TOTALWEIGHT)}</td>
          <td colspan='6'>&nbsp;</td>
          <td colspan='1'>Net Weight:</td>
          <td colspan='2'>${this.limitDecimal(this.grandTotal.NETWEIGHT)}</td>
      </tr>
          <tr>
              <td colspan='1'></td>
              <td colspan='8'></td>
              <td colspan='1'>Date: </td>
              <td colspan='1'>${this.transformDate(data.TRNDATE)}</td>
          </tr>

          <tr>
              <td colspan='1'>Mobile No :&nbsp;${data.BILLTOMOB}</td>
              <td colspan='8'></td>
              <td colspan='1'></td>
              <td colspan='1'></td>
          </tr>
          <tr>
              <td colspan='1'>GST NO. :</td>
              <td colspan='8'></td>
              <td colspan='1'></td>
              <td colspan='1'></td>
          </tr>
          <tr style='border-top: 1px solid black;'>
              <td colspan='1' style='text-align: left;'><b>S.No.</b></td>
              <td colspan='1' style='text-align: left;'><b>SAP CODE</b></td>
              <td colspan='1' style='text-align: left;'><b>ITEM NAME</b></td>
              <td colspan='1' style='text-align: left;'><b>CLD</b></td>
              <td colspan='1' style='text-align: left;'><b>PCS</b></td>
              <td colspan='1' style='text-align: left;'><b>QTY</b></td>
              <td colspan='1' style='text-align: left;'><b>UOM</b></td>
              <td colspan='1' style='text-align: left;'><b>Rate</b></td>
              <td colspan='1' style='text-align: left;'><b>GST%</b></td>
              <td colspan='1' style='text-align: left;'><b>GST AMT</b></td>
              <td colspan='1' style='text-align: right;'><b>AMOUNT</b></td>
          </tr>
      </thead>
          `
            } else if (this.invoiceType == VoucherTypeEnum.Purchase) {

                header = header +
                    `<thead style='border: 1px solid black;'>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='9' style='text-align: center;'><b>${this.companyProfile.NAME}</b></td>
              <td colspan='1'>&nbsp;</td>
              <td colspan='5' style='text-align: left;'>Original for Recipient</td>
          </tr>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='9' style='text-align: center;'>${this.companyProfile.PLACE}, &nbsp;${this.companyProfile.ADDRESS} &nbsp;${this.companyProfile.ADDRESS2}, &nbsp;${this.companyProfile.STATE}</td>
              <td colspan='1'>&nbsp;</td>
              <td colspan='5' style='text-align: left;'>Duplicate for Supplier/Transporter</td>
          </tr>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='9' style='text-align: center;'>&nbsp;</td>
              <td colspan='1'>&nbsp;</td>
              <td colspan='5' style='text-align: left;'>Triplicate for Supplier</td>
          </tr>
          <tr style='border-bottom: 1px solid black;'>
              <td colspan='7'>GSTIN:&nbsp;${this.companyProfile.GSTNO}</td>
              <td colspan='9' style='text-align: center;'>${this.companyProfile.TELA}</td>
              <td colspan='6'>&nbsp;</td>
          </tr>
          <tr style='border-bottom: 1px solid black;'>
          <td colspan='7'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
          <td colspan='9' style='text-align: center;'><b>PURCHASE INVOICE</b></td>
              <td colspan='6'></td>
          </tr>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='9'>&nbsp</td>
              <td colspan='6'>&nbsp;</td>
          </tr>
          <tr style='border-top: 1px solid black;'>
              <td colspan='7' style='border-right: 1px solid black;'>Supplier:&nbsp;${data.BILLTO}</td>
              <td colspan='9' style='border-right: 1px solid black;'>Ship-to:&nbsp;${data.AdditionalObj.SHIPNAME}</td>
              <td colspan='6'>Invoice No./Date: ${data.REFBILL}&nbsp;${this.transformDate(data.TRN_DATE)}</td>
          </tr>


          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>${data.BILLTOADD}</td>
              <td colspan='9' style='border-right: 1px solid black;'></td>
              <td colspan='6'>GRN No./Date: ${data.VCHRNO}&nbsp;${this.transformDate(data.TRNDATE)}</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'></td>
              <td colspan='9' style='border-right: 1px solid black;'></td>
              <td colspan='6'>Gross Weight:${this.limitDecimal(this.grandTotal.TOTALWEIGHT)}</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'></td>
              <td colspan='9' style='border-right: 1px solid black;'></td>
              <td colspan='6'>Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>&nbsp;</td>
              <td colspan='9' style='border-right: 1px solid black;'>&nbsp;</td>
              <td colspan='6'>Truck No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>Pincode :</td>
              <td colspan='9' style='border-right: 1px solid black;'>Pincode :</td>
              <td colspan='6'>Driver No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>Mobile No :${data.BILLTOMOB}</td>
              <td colspan='9' style='border-right: 1px solid black;'>Mobile No:</td>
              <td colspan='6'>Delivery No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>GSTIN :</td>
              <td colspan='9' style='border-right: 1px solid black;'>GSTIN :</td>
              <td colspan='6'>Ref No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>PAN No :${data.BILLTOPAN}</td>
              <td colspan='9' style='border-right: 1px solid black;'>PAN No :</td>
              <td colspan='6'>Ref No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>State Code :</td>
              <td colspan='9' style='border-right: 1px solid black;'>State Code : </td>
              <td colspan='6'>Place of Supply:</td>
          </tr>
          <tr style='border: 1px solid black;'>
              <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
              <td style='border-right: 1px solid black;' colspan='2'><b>Material Description</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Qty</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Tot Dis</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>

              <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amount</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
          </tr>
      </thead>
          `
            }
            else if (this.invoiceType == VoucherTypeEnum.MaterialReceipt) {

                header = header +
                    `<thead style='border: 1px solid black;'>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='9' style='text-align: center;'><b>${this.companyProfile.NAME}</b></td>
              <td colspan='1'>&nbsp;</td>
              <td colspan='5' style='text-align: left;'>Original for Recipient</td>
          </tr>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='9' style='text-align: center;'>${this.companyProfile.PLACE}, &nbsp;${this.companyProfile.ADDRESS} &nbsp;${this.companyProfile.ADDRESS2}, &nbsp;${this.companyProfile.STATE}</td>
              <td colspan='1'>&nbsp;</td>
              <td colspan='5' style='text-align: left;'>Duplicate for Supplier/Transporter</td>
          </tr>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='9' style='text-align: center;'>&nbsp;</td>
              <td colspan='1'>&nbsp;</td>
              <td colspan='5' style='text-align: left;'>Triplicate for Supplier</td>
          </tr>
          <tr style='border-bottom: 1px solid black;'>
              <td colspan='7'>GSTIN:&nbsp;${this.companyProfile.GSTNO}</td>
              <td colspan='9' style='text-align: center;'>${this.companyProfile.TELA}</td>
              <td colspan='6'>&nbsp;</td>
          </tr>
          <tr style='border-bottom: 1px solid black;'>
          <td colspan='7'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
          <td colspan='9' style='text-align: center;'><b>MATERIAL RECEIPT</b></td>
              <td colspan='6'></td>
          </tr>
          <tr>
              <td colspan='7'>&nbsp;</td>
              <td colspan='9'>&nbsp</td>
              <td colspan='6'>&nbsp;</td>
          </tr>
          <tr style='border-top: 1px solid black;'>
              <td colspan='7' style='border-right: 1px solid black;'>Supplier:&nbsp;${data.BILLTO}</td>
              <td colspan='9' style='border-right: 1px solid black;'>Ship-to:&nbsp;${data.AdditionalObj.SHIPNAME}</td>
              <td colspan='6'>Invoice No./Date: ${data.REFBILL}&nbsp;${this.transformDate(data.TRN_DATE)}</td>
          </tr>


          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>${data.BILLTOADD}</td>
              <td colspan='9' style='border-right: 1px solid black;'></td>
              <td colspan='6'>MR No./Date: ${data.VCHRNO}&nbsp;${this.transformDate(data.TRNDATE)}</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'></td>
              <td colspan='9' style='border-right: 1px solid black;'></td>
              <td colspan='6'>Gross Weight:${this.limitDecimal(this.grandTotal.TOTALWEIGHT)}</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'></td>
              <td colspan='9' style='border-right: 1px solid black;'></td>
              <td colspan='6'>Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>&nbsp;</td>
              <td colspan='9' style='border-right: 1px solid black;'>&nbsp;</td>
              <td colspan='6'>Truck No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>Pincode :</td>
              <td colspan='9' style='border-right: 1px solid black;'>Pincode :</td>
              <td colspan='6'>Driver No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>Mobile No :${isNullOrUndefined(data.BILLTOMOB) ? '' : data.BILLTOPAN}</td>
              <td colspan='9' style='border-right: 1px solid black;'>Mobile No:</td>
              <td colspan='6'>Delivery No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>GSTIN :</td>
              <td colspan='9' style='border-right: 1px solid black;'>GSTIN :</td>
              <td colspan='6'>Ref No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>PAN No :${isNullOrUndefined(data.BILLTOPAN) ? '' : data.BILLTOPAN}</td>
              <td colspan='9' style='border-right: 1px solid black;'>PAN No :</td>
              <td colspan='6'>Ref No.:</td>
          </tr>
          <tr>
              <td colspan='7' style='border-right: 1px solid black;'>State Code :</td>
              <td colspan='9' style='border-right: 1px solid black;'>State Code : </td>
              <td colspan='6'>Place of Supply:</td>
          </tr>
          <tr style='border: 1px solid black;'>
              <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
              <td style='border-right: 1px solid black;' colspan='2'><b>Material Description</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Qty</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Tot Dis</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>

              <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amount</b></td>
              <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
          </tr>
      </thead>
          `
            }
            else if (this.activeurlpath == 'add-debitnote-itembase') {

            } else if (this.activeurlpath == 'add-creditnote-itembase') {
                header = header + `
          <thead style='border: 1px solid black'>
                <tr>
                    <td colspan='7'></td>
                    <td colspan='9' style='text-align: center;'><b>${this.companyProfile.NAME}
                     <br>,${this.companyProfile.PLACE}, &nbsp;${this.companyProfile.ADDRESS} &nbsp;${this.companyProfile.ADDRESS2}, &nbsp;${this.companyProfile.STATE}
                     <br>
                     </b></td>
                    <td colspan='1'>&nbsp;</td>
                    <td colspan='5' style='text-align: left;'>Original for Recipient
                    <br> Duplicate for Supplier/Transporter
                    <br> Triplicate for Supplier</td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='7'>GSTIN:&nbsp;${this.companyProfile.GSTNO} <br> FSSAI:&nbsp;${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                    <td colspan='9' style='text-align: center;'>Tel No:&nbsp;${this.companyProfile.TELA}</td>
                    <td colspan='6' style='text-align: center;'>&nbsp;</td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='7'></td>
                    <td colspan='9' style='text-align: center;'><b>Credit Note</b></td>
                    <td colspan='6' style='text-align: center;'>User :&nbsp;${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black'>
                    <td colspan='2'>Buyer :</td>
                    <td colspan='5' style='border-right: 1px solid black;'>&${this.customerInfo[0].ACNAME}</td>
                    <td colspan='9' style='border-right: 1px solid black;'>Ref Inv no :${data.REFBILL}</td>
                    <td colspan='6'>Credit Note No./Date:${data.VCHRNO} &nbsp;/${this.transformDate(data.TRNDATE)}</td>
                </tr>
                <tr>
                    <td colspan='7' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : this.customerInfo[0].AREA},${this.customerInfo[0] == null ? '' : this.customerInfo[0].DISTRICT},${this.customerInfo[0] == null ? '' : this.customerInfo[0].ADDRESS}</td>
                    <td colspan='9' style='border-right: 1px solid black;'></td>
                    <td colspan='6'></td>
                </tr>
                <tr>
                <td colspan='2'>
                    State :
                <br>Pincode :
                <br>Mobile No :
                <br>GSTIN :
                <br>PAN No :</td>
                <td colspan='5' style='border-right: 1px solid black;'>
                        ${this.customerInfo[0].STATE}
                    <br>${this.customerInfo[0].POSTALCODE}
                    <br>${this.customerInfo[0].MOBILE}
                    <br>${this.customerInfo[0].GSTNO}
                    <br>${this.customerInfo[0].VATNO}
                </td>
                <td colspan='9' style='border-right: 1px solid black;'>Ref Inv Date : ${this.transformDate(data.TRN_DATE)}</td>
                    <td colspan='6'></td>
                </tr>

                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;' colspan='2'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;'><b>Pcs</b></td>
                    <td style='border-right: 1px solid black;'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;'><b>Tot Dis</b></td>
                    <td style='border-right: 1px solid black;'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;'><b>SGST Amount</b></td>
                    <td style='border-right: 1px solid black;'><b>Amount</b></td>
                </tr>
            </thead>
          `
            }
        }
        return header
    }




    body(data): string {

        var row = ""
        if (this.printMode == 1 || this.printMode == 12) {
            this.organisation_type = this.getOrgtypeBasedOnPartyType(data.PARTY_ORG_TYPE, this.customerInfo[0].GEO);
            if ((this.invoiceType == VoucherTypeEnum.TaxInvoice || this.invoiceType == VoucherTypeEnum.PerformaSalesInvoice) && this.organisation_type != 'distributor' && this.organisation_type != 'superdistributor' &&
                this.organisation_type != "superstockist" &&
                this.organisation_type != "fitindia" &&
                this.organisation_type.toLowerCase() != 'wdb' &&
                this.organisation_type.toLowerCase() != 'ssa' &&
                this.organisation_type.toLowerCase() != 'zcp') {

                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;

                    row = row + `<table style='width: 100%;font-size:9px;
                                        border-collapse: collapse;border-top: none;border-bottom: none'>
                                        <tbody>`;

                    row = row + ` <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>`;
                    if (this.companyProfile.COMPANYID != 'inotbhiwadi') {

                        row = row + ` <td colspan='4'> <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;"></td>`;
                    }
                    else {
                        row = row + ` <td colspan='4'></td>`;
                    }
                    row = row + ` <td colspan='6' style='text-align: center'> <strong>${this.companyProfile.NAME}</strong> </td>
                                        <td colspan='4'></td>
                                    </tr>

                                    <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                        <td colspan='4'></td>
                                        <td colspan='6' style='text-align: center'> ${this.companyProfile.ADDRESS}</td>
                                        <td colspan='4'></td>
                                    </tr>
                                    <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                        <td colspan='4'> </td>
                                        <td colspan='6' style='text-align: center'>Phno : ${this.companyProfile.TELA} ,&nbsp; E-mail: ${this.companyProfile.EMAIL} </td>
                                        <td colspan='4'></td>
                                    </tr>
                                    <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                        <td colspan='4'> </td>
                                        <td colspan='6' style='text-align: center'> GST No : ${this.companyProfile.GSTNO}<br/> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                                        <td colspan='4'></td>
                                    </tr>

                                    <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                                        <td colspan='4'></td>
                                        <td colspan='6' style='text-align: center'><b>${this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : this.invoiceType == VoucherTypeEnum.TaxInvoice ? 'TAX INVOICE' : 'PROFORMA INVOICE'} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}</b></td>
                                        <td colspan='4'></td>
                                    </tr>
                                    <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                                        <td colspan='4'>  <strong>Cust.Name :</strong> </td>
                                        <td colspan='6'>${(data.BILLTO == null) ? '' : data.BILLTO}</td>
                                        <td colspan='4'> <strong>INVOICE</strong></td>
                                    </tr>
                                    <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                        <td colspan='4'>  <strong>Address :</strong> </td>
                                        <td colspan='6'>${(data.BILLTOADD == null) ? '' : data.BILLTOADD}</td>
                                        <td colspan='4'> Invoice: ${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}</td>
                                    </tr>
                                    <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                        <td colspan='4'> </td>
                                        <td colspan='6' style='text-align: center'></td>
                                        <td colspan='4'> Date : ${this.transformDate(data.TRNDATE)}</td>
                                    </tr>
                                    <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                        <td colspan='4'> <strong>GST No :</strong></td>
                                        <td colspan='6' > ${(this.customerInfo == null || this.customerInfo[0] == null) ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</td>
                                        <td colspan='4'></td>
                                    </tr>
                                    <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-bottom:1px solid #5a5656;'>
                                        <td colspan='4'></td>
                                        <td colspan='6' style='text-align: center'></td>
                                        <td colspan='4'></td>
                                    </tr>

                                    <tr>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        S.NO
                                    </th>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        HSN
                                    </th>
                                    <th colspan='4'
                                        style='border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        ITEM
                                        NAME</th>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        QTY
                                    </th>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        RATE
                                    </th>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        Dis
                                        AMT</th>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        GST%
                                    </th>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        GST
                                        Amt</th>
                                    <th
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        CESS%
                                    </th>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        CESS Amt</th>
                                    <th
                                        style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                        AMOUNT
                                    </th>
                                    </tr>
                                `
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            row = row + `
                                            <tr>
                                                <td style='  border-right: 1px solid #5a5656;border-left: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}
                                                </td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE}</td>`;
                            if (this.companyProfile.COMPANYID == 'inotbhiwadi' || this.companyProfile.COMPANYID == 'inotho' || this.companyProfile.COMPANYID == 'inotalwar') {

                                row += ` 
                                                <td colspan='4' style='  border-right: 1px solid #5a5656;text-align:center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].DESCRIPTION}&nbsp;[${data.ProdList[this.arrayIndex].SELECTEDITEM.BARCODE}]</td>`;
                            }
                            else {
                                row += `
                                                <td colspan='4' style='  border-right: 1px solid #5a5656;text-align:center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].DESCRIPTION}</td>`;
                            }

                            row += `
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].RealQty}
                                                </td>`;
                            if (this.companyProfile.COMPANYID == 'gkboutlet1' || this.companyProfile.COMPANYID == 'gkboutlet2') {
                                row +=
                                    `<td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>`;
                            }
                            else {
                                row += `
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>`;
                            }


                            row += `
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].DISCOUNT)}
                                                </td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].GSTRATE}
                                                </td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].VAT)}</td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].INDCESS_PER}</td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                           
                            
                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            


                           </tr>
                                            `
                        }
                        this.arrayIndex = this.arrayIndex + 1;

                    }
                    row = row + `

                                <tr>
                                    <td
                                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                                    </td>
                                    <td
                                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                                    </td>
                                    <td colspan='4'
                                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                                        <strong>TOTAL</strong> </td>
                                    <td
                                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                                        ${data.TotalQuantity}</td>
                                    <td colspan='7'
                                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                                    </td>
                                </tr>
                                <tr style=' border-top: 1px solid  #5a5656;border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                    <td></td>
                                    <td></td>
                                    <td colspan='4'>No of item :${data.ProdList.length} <br><hr></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td colspan='2'>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                <td colspan='2'>Amount in Words :</td>
                                <td colspan='9'>${data.NETAMOUNTINWORD}</td>
                                <td colspan='3'></td>
                                
                                </tr>
                                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>`;
                    if (this.companyProfile.COMPANYID == 'inotbhiwadi' || this.companyProfile.COMPANYID == 'inotho' || this.companyProfile.COMPANYID == 'inotalwar') {
                        row += `<td colspan='2'>
                                    Declaration :
                                    </td>
                                    <td colspan='9'><br>
                                     ${isNullOrUndefined(this.companyProfile.Declaration) ? '' : this.companyProfile.Declaration}<br>
                                    </td>`;
                    }
                    else {
                        row += `<td colspan='2'></td>
                            < td colspan = '9'></td>`;
                    }

                    row += `<td colspan='2'>Net Amount :
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}

                                    Round Off:<br>
                                    Dis Amount:<br>
                                    Tax Amount (Inc):<br>
                                    Tot Cess:<br>
                                    Total:<br></td>
                                    <td>
                                    ${this.limitDecimal(data.FTOTAMNT)} <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_AMT + '<br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                        ${this.limitDecimal(data.ROUNDOFF)}<br>
                                        ${this.limitDecimal(data.DCAMNT)}<br>
                                        ${this.limitDecimal(data.FVATAMNT)}<br>
                                        ${this.limitDecimal(this.grandTotal.TOTALCESS)}<br>
                                        ${this.limitDecimal(data.NETAMNT)}<br></td>
                                </tr>`;
                    // if (this.companyProfile.COMPANYID == 'inotbhiwadi' || this.companyProfile.COMPANYID == 'inotho' || this.companyProfile.COMPANYID == 'inotalwar') {

                    //     row += `
                    //             <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    //                 <td colspan='2'>Declaration:</td>
                    //                 <td colspan='9'><br>${isNullOrUndefined(this.companyProfile.Declaration) ? '' : this.companyProfile.Declaration}</td>
                    //                 <td colspan='2'></td>
                    //                 <td></td>
                    //                 </tr>`;
                    // }

                    row += `
                                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                                    <td colspan='14'>&nbsp;</td>
                                </tr>
                                <tr style='border-left: 1px solid #5a5656;border: 1px solid #5a5656;'>
                                    <td colspan="6">&nbsp;</td>                                    
                                    <td colspan="5">* Thank You *</td>
                                    <td>&nbsp;</td>
                                    <td>Signature By</td>
                                    <td>&nbsp;</td>
                                </tr>`;

                    if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                    else {
                        row = row + `  <tr>
<td colspan='14'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                    }


                    row = row + `</tbody>
                    </table>

                `

                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                    <div class="pagebreak"></div>
                    `
                    }

                }

                if (!this.isPickingList && this.customerInfo.length && this.customerInfo[0].GEO && this.customerInfo[0].GEO.toLowerCase() == "fitindia" && this.invoiceType != VoucherTypeEnum.PerformaSalesInvoice) {
                    row = row + `

                        <div style="width:1000px; margin: auto;">
                        <table style="border:1px solid #000;width: 100%;" cellpadding="5" cellspacing="0">
                        <tr>
                        <td colspan="3"><span style="font-size: 48px; color: #5643CD; font-weight:bold;">PACKING SLIP</span></td>
                        </tr>
                        <tr>
                        <td colspan="3"><table style="width: 100%;" cellpadding="5" cellspacing="0">
                            <tr style="background-color:#65B7E5">
                            <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">BILL NO.</span></td>
                            <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">DATE</span></td>
                            <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">ORDER NUMBER</span></td>
                            <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">REMARKS</span></td>
                            </tr>
                            <tr style="background-color:#B6C8C9">
                            <td style="border:1px solid #000; height: 30px; ">${data.VCHRNO}</td>
                            <td style="border:1px solid #000; height: 30px; ">${this.transformDate(data.TRNDATE)}</td>
                            <td style="border:1px solid #000; height: 30px;">${data.REFORDBILL}</td>
                            <td style="border:1px solid #000; height: 30px;">${data.REMARKS}</td>
                            </tr>
                            </table></td>
                        </tr>
                        <tr>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">S.NO.</span></td>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">DESCRIPTION</span></td>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">QUANTITY</span></td>
                        </tr>`
                    for (let i in data.ProdList) {
                        row = row + `<tr>
                                    <td style="border:1px solid #000; height: 30px;">${this._transactionService.nullToZeroConverter(i) + 1}</td>
                                    <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].DESCRIPTION}</td>
                                    <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].RealQty}</td>
                                    </tr>`
                    }
                    row = row + `</table></div>`
                }


            }
            else if (this.activeurlpath == "StockSettlementEntry") {
                for (let i in data.ProdList) {

                    row = row +
                        `<tr>
                            <td colspan='1' style='border-left: 1px solid black;text-align: center;'>${this._transactionService.nullToZeroConverter(i) + 1}</td>
                            <td colspan='1' >${data.ProdList[i].MCODE}</td>
                            <td colspan='4' style='text-align: left;'>${data.ProdList[i].ITEMDESC}</td>
                            <td colspan='1'>${data.ProdList[i].AltQty}</td>
                            <td colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
                            <td colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
                            <td colspan='1'>${data.ProdList[i].ALTUNIT}</td>
                            <td colspan='1'>${this.limitDecimal(data.ProdList[i].MRP)}</td>
                            <td colspan='1'>${data.ProdList[i].GSTRATE}</td>
                            <td colspan='1'>${this.limitDecimal(data.ProdList[i].VAT)}</td>
                            <td colspan='1' style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[i].NETAMOUNT)}</td>
                        </tr>`
                }
            }
            else if (this.invoiceType == VoucherTypeEnum.StockSettlement) {
                for (let i in data.ProdList) {
                    row = row +
                        `<tr>
                    <td colspan='1' style='border-left: 1px solid black;text-align: center;'>${this._transactionService.nullToZeroConverter(i) + 1}</td>
                    <td colspan='1' >${data.ProdList[i].MCODE}</td>
                    <td colspan='4' style='text-align: left;'>${data.ProdList[i].ITEMDESC}</td>
                    <td colspan='1'>${data.ProdList[i].AltQty}</td>
                    <td colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
                    <td colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
                    <td colspan='1'>${data.ProdList[i].ALTUNIT}</td>
                    <td colspan='1'>${this.limitDecimal(data.ProdList[i].MRP)}</td>
                    <td colspan='1'>${data.ProdList[i].GSTRATE}</td>
                    <td colspan='1'>${this.limitDecimal(data.ProdList[i].VAT)}</td>
                    <td colspan='1' style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[i].NETAMOUNT)}</td>
                </tr>`
                }
            }
            else if (this.invoiceType == VoucherTypeEnum.PurchaseOrder) {
                for (let i in data.ProdList) {

                    row = row +
                        `<tr>
                            <td colspan='1' style='border-left: 1px solid black;text-align: center;'>${this._transactionService.nullToZeroConverter(i) + 1}</td>
                            <td colspan='1' >${data.ProdList[i].MCODE}</td>
                            <td colspan='${this.companyProfile.COMPANYID == "8888888" ? 4 : 3}' style='text-align: left;'>${data.ProdList[i].ITEMDESC}</td>
                            <td colspan='1'>${this.limitDecimal(data.ProdList[i].AltQty)}</td>
                            <td colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
                            <td colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
                            <td colspan='1'>${data.ProdList[i].ALTUNIT}</td>
                            <td colspan='1'>${this.limitDecimal(data.ProdList[i].RATE)}</td>`;
                    if (this.companyProfile.COMPANYID != "8888888") {
                        row = row + `<td colspan='1'>${this.limitDecimal(data.ProdList[i].MRP)}</td>`;
                    }
                    row = row + `<td colspan='1'>${data.ProdList[i].GSTRATE}</td>
                            <td colspan='1'>${this.limitDecimal(data.ProdList[i].VAT)}</td>
                            <td colspan='1' style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[i].NETAMOUNT)}</td>
                        </tr>`
                }
            }
            else if (this.invoiceType == VoucherTypeEnum.SalesOrder) {
                for (let i in data.ProdList) {

                    row = row + `
        <tr>
                <td colspan='1' style='border-left: 1px solid black;'>${this._transactionService.nullToZeroConverter(i) + 1}</td>
                <td colspan='1'>${data.ProdList[i].MCODE}</td>
                <td colspan='1'>${data.ProdList[i].ITEMDESC}</td>
                <td colspan='1'>${data.ProdList[i].AltQty.toFixed(2)}</td>
                <td colspan='1'>${data.ProdList[i].RealQty}</td>
                <td colspan='1'>${data.ProdList[i].Quantity}</td>
                <td colspan='1'>${data.ProdList[i].ALTUNIT}</td>
                <td colspan='1'>${this.limitDecimal(data.ProdList[i].MRP)}</td>
                <td colspan='1'>${data.ProdList[i].GSTRATE}</td>
                <td colspan='1'>${this.limitDecimal(data.ProdList[i].VAT)}</td>
                <td colspan='1' style='border-right: 1px solid black;text-align: right;'>${this.limitDecimal(data.ProdList[i].NETAMOUNT)}</td>
            </tr>
        `
                }
            } else if (this.invoiceType == VoucherTypeEnum.Purchase) {
                for (let i in data.ProdList) {

                    row = row +
                        `<tr>
        <td  colspan='1' style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(i) + 1}</td>
        <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[i].ITEMDESC}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].MCODE}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].SELECTEDITEM.HSNCODE}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].MRP)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].BATCH}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.transformDate(data.ProdList[i].MFGDATE)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.transformDate(data.ProdList[i].EXPDATE)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].ALTQTY_IN}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].ALTUNIT}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].RATE)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].DISCOUNT)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].TAXABLE)}</td>

          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].GSTRATE) / 2) : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].VAT) / 2) : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].GSTRATE) / 2) : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].VAT) / 2) : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? data.ProdList[i].GSTRATE : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(data.ProdList[i].VAT) : ""}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].NETAMOUNT)}</td>
      </tr>
        `
                }
            }
            else if (this.invoiceType == VoucherTypeEnum.MaterialReceipt) {
                for (let i in data.ProdList) {

                    row = row +
                        `<tr>
        <td  colspan='1' style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(i) + 1}</td>
        <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[i].ITEMDESC}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].MCODE}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].SELECTEDITEM.HSNCODE}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].MRP)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].BATCH}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.transformDate(data.ProdList[i].MFGDATE)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.transformDate(data.ProdList[i].EXPDATE)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].ALTQTY_IN}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].ALTUNIT}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].RATE)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].DISCOUNT)}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].TAXABLE)}</td>

          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].GSTRATE) / 2) : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].VAT) / 2) : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].GSTRATE) / 2) : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].VAT) / 2) : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? data.ProdList[i].GSTRATE : ""}</td>
          <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(data.ProdList[i].VAT) : ""}</td>
          <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].NETAMOUNT)}</td>
      </tr>
        `
                }
            }
            else if (this.activeurlpath == 'add-debitnote-itembase') {

            } else if (this.activeurlpath == 'add-creditnote-itembase') {
                for (let i in data.ProdList) {

                    row = row + `
        <tr>
        <td style='border-right: 1px solid black;border-left: 1px solid black;' colspan='1'>${this._transactionService.nullToZeroConverter(i) + 1}</td>
        <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[i].ITEMDESC}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].MCODE}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].SELECTEDITEM.HSNCODE}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].MRP)}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].BATCH}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${this.transformDate(data.ProdList[i].MFGDATE)}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${this.transformDate(data.ProdList[i].EXPDATE)}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].AltQty}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].REALQTY_IN}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[i].ALTUNIT}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].RATE)}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].DISCOUNT)}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].TAXABLE)}</td>
        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? data.ProdList[i].GSTRATE : ""}</td>
        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(data.ProdList[i].VAT) : ""}</td>
        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].GSTRATE) / 2) : ""}</td>
        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].VAT) / 2) : ""}</td>
        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].GSTRATE) / 2) : ""}</td>
        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[i].VAT) / 2) : ""}</td>
        <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[i].NETAMOUNT)}</td>
    </tr>
        `
                }
            }
            if ((this.invoiceType == VoucherTypeEnum.TaxInvoice || this.invoiceType == VoucherTypeEnum.PerformaSalesInvoice) && (
                this.organisation_type == 'superdistributor' ||
                this.organisation_type == "superstockist" ||
                this.organisation_type.toLowerCase() == 'wdb' ||
                this.organisation_type.toLowerCase() == 'ssa' ||
                this.organisation_type.toLowerCase() == 'zcp')) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table id="invoiceTable" style='width: 100%;font-size:10px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>`;

                    row = row + ` <tr>
                        <td colspan='6'>
                            <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                        </td>
                        <td colspan='16' style='text-align:center;max-width:180px;'>
                            <b>${this.companyProfile.NAME}</b><br>
                            <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                            <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                            <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                            ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                        </td>
                        <td colspan='2' style='text-align: left;'>&nbsp;</td>
                        <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='10'>
                                    CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                    GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO} <br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                    <td colspan='10' style='text-align: center;'></td>
                    <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
                    <td colspan='12' style='text-align: center;'><b>${this.invoiceType == VoucherTypeEnum.TaxInvoice ? (this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE') : "Performa Invoice"} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}<b></td>
                    <td colspan='4' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                    <td colspan='4' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='10' style='border-right: 1px solid black;'>Buyer:${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</td>
                    <td colspan='10' style='border-right: 1px solid black;'>Ship To:${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Invoice No./Date :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}/${this.transformDate(data.TRNDATE)}</td>
                </tr>

                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                    <td colspan='10' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                    <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                    <td colspan='10' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                        Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                    </td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                    <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Truck No. :${data.TransporterEway ? (data.TransporterEway.VEHICLENO == null ? '' : data.TransporterEway.VEHICLENO) : ''}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Driver No. :${data.TransporterEway ? (data.TransporterEway.DRIVERNO == null ? '' : data.TransporterEway.DRIVERNO) : ''}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                    <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename}`)}</td>
                    <td colspan='10' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME}`}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].CITY == null ? 'Un-Register' : this.customerInfo[0].CITY)}
                    </td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                    <td colspan='10' style='border-right: 1px solid black;'>Beat:${this.customerInfo[0] == null ? '' : (this.customerInfo[0].BEATNAME == null ? '' : `${this.customerInfo[0].BEATNAME}`)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N
                    </td>
                </tr>`

                    if (this.organisation_type == 'distributor') {
                        row = row + `
                    <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                    <td colspan='10' style='border-right: 1px solid black;'>DSM NAME:${data.AdditionalObj == null ? '' : (data.AdditionalObj.DSMNAME == null ? '' : data.AdditionalObj.DSMNAME)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                    </td>
                </tr>`
                    }

                    row = row + `
                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;' colspan='2'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>PDis %</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>P Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S Dis%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Othr Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CESS%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CESS Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                            <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                            <td style='border-right: 1px solid black;max-width:300px;' colspan='2'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].PrimaryDiscountPercent)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BasePrimaryDiscount)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].SecondaryDiscountPercent)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BaseSecondaryDiscount)}</td>
                            <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>


                            `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            }

                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                    <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;' colspan='2'>Page Sub-Total</td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePDisTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageSDisTotal)}</b></td>
                    <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                    <td style='border-right: 1px solid black;text-align:right'></td>
                    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(subPageCESSTotal)}</td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                 </tr>
                `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;' colspan='2'>Grand Total</td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pdistotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.sdistotal)}</b></td>
                                    <td style='border-right: 1px solid black;'><b>${this.limitDecimal(this.grandTotal.INDDISCOUNTTOTAL)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'></td>
                                    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(this.grandTotal.TOTALCESS)}</td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                                </tr>
                            `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='14'>&nbsp;</td>
                        </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                            <tr>
                                <td colspan="18"></td>
                                <td colspan='4'>
                                    <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                </td>
                                <td colspan='5'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        } else {
                            row = row + `
                            <tr>
                                <td colspan="18"></td>
                                <td rowspan="6" colspan='4'>
                                    <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                </td>
                                <td rowspan="6" colspan='5'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td rowspan="6" colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        }


                        if (this.companyProfile.GSTTYPE != 'Composite') {

                            for (let index in this.gstData) {
                                row = row + `
                        <tr>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                            <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                            <td colspan='14' style='border-right:1px solid black;'></td>
                        <tr>
                            `
                            }
                        }
                        row = row + `
                        <tr>
                        <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='26'>Remarks: ${data.REMARKS}</td>
                        <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                    </tr>
                    <tr style='border-top: 1px solid black;'>
                        <td colspan='24'>GST Amount : ${data.GSTINWORD}</td>
                        <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                    </tr>
                    <tr>
                        <td colspan='24'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                        <td colspan='4' style='border-right:1px solid black;'><br></td>
                    </tr>
                    <tr style='border-top: 1px solid black'>
                        <td colspan='28' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}

                        </td>
                    </tr>
                    <tr>

</tr>`



                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='28'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }
                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }

            }

            if ((this.invoiceType == VoucherTypeEnum.TaxInvoice || this.invoiceType == VoucherTypeEnum.PerformaSalesInvoice) && (this.organisation_type == 'distributor')) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPageONLYCLDTotal = 0, subPageONLYPCSTotal = 0, subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table id="invoiceTable" style='width: 100%;font-size:10px;
                border-collapse: collapse;border:1px solid black'>
                <tbody>`

                    row = row + `<tr>
                    <td colspan='6'>
                        <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                    </td>
                    <td colspan='16' style='text-align:center;max-width:180px;'>
                        <b>${this.companyProfile.NAME}</b><br>
                        <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                        <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                        <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                        ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                    </td>
                    <td colspan='2' style='text-align: left;'>&nbsp;</td>
                    <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='10'>
                                CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO} <br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                <td colspan='10' style='text-align: center;'></td>
                <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
            </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='8'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
                <td colspan='12' style='text-align: center;'><b>${this.invoiceType == VoucherTypeEnum.TaxInvoice ? (this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE') : "Performa Invoice"} :${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}<b></td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
            </tr>
            <tr style='border-top: 1px solid black;'>
                <td colspan='10' style='border-right: 1px solid black;'>Buyer:<b>${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</b></td>
                <td colspan='10' style='border-right: 1px solid black;'>Ship To:<b>${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</b></td>
                <td colspan='8' style='border-right: 1px solid black;'>Invoice No./Date :${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
            </tr>

            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                <td colspan='8' style='border-right: 1px solid black;'>
                    Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Truck No. :${data.TransporterEway ? (data.TransporterEway.VEHICLENO == null ? '' : data.TransporterEway.VEHICLENO) : ''}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Driver No. :${data.TransporterEway ? (data.TransporterEway.DRIVERNO == null ? '' : data.TransporterEway.DRIVERNO) : ''}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename}`)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME}`}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].CITY == null ? 'Un-Register' : this.customerInfo[0].CITY)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                <td colspan='10' style='border-right: 1px solid black;'>Beat:${this.customerInfo[0] == null ? '' : (this.customerInfo[0].BEATNAME == null ? '' : `${this.customerInfo[0].BEATNAME}`)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N
                </td>
            </tr>`

                    if (this.organisation_type == 'distributor') {
                        row = row + `
                <tr>
                <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                <td colspan='10' style='border-right: 1px solid black;'>DSM NAME:${data.AdditionalObj == null ? '' : (data.AdditionalObj.DSMNAME == null ? '' : data.AdditionalObj.DSMNAME)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>
                </td>
            </tr>`
                    }

                    row = row + `
            <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;' ><b>S.No.</b></td>
                <td style='border-right: 1px solid black;' colspan='7'><b>Material Description</b></td>
                <td style='border-right: 1px solid black;' ><b>Item Code</b></td>
                <td style='border-right: 1px solid black;' ><b>HSN/SAC</b></td>
                <td style='border-right: 1px solid black;' ><b>MRP</b></td>
        <!--    <td style='border-right: 1px solid black;' ><b>Batch No</b></td>
                <td style='border-right: 1px solid black;' ><b>Mfg</b></td>
                <td style='border-right: 1px solid black;' ><b>Exp</b></td> -->
                <td style='border-right: 1px solid black;' ><b>CLD</b></td>
                <td style='border-right: 1px solid black;' ><b>Pcs</b></td>
        <!--        <td style='border-right: 1px solid black;' ><b>UOM</b></td> -->
                <td style='border-right: 1px solid black;' ><b>Rate</b></td>
        <!--        <td style='border-right: 1px solid black;' ><b>PDis %</b></td> -->
                <td style='border-right: 1px solid black;' ><b>P Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>S Dis%</b></td>
                <td style='border-right: 1px solid black;' ><b>S Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>Othr Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>Taxable</b></td>
                <td style='border-right: 1px solid black;' ><b>IGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>IGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>CGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>CGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>SGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>SGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>CESS%</b></td>
                <td style='border-right: 1px solid black;' ><b>CESS Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>Amount</b></td>
            </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPageONLYCLDTotal = subPageONLYCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].CLD);
                            subPageONLYPCSTotal = subPageONLYPCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].PCS);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                        <tr style='border-top:1px solid black;'>
                        <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                        <td style='border-right: 1px solid black;max-width:300px;' colspan='7'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                    <!--    <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                        <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                        <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td> -->
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].CLD)}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].PCS}</td>
                    <!--     <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td> -->
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                    <!--    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].PrimaryDiscountPercent)}</td> -->
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BasePrimaryDiscount)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].SecondaryDiscountPercent)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BaseSecondaryDiscount)}</td>
                        <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>


                        `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                        <td style='border-right: 1px solid black;'></td>
                        <td style='border-right: 1px solid black;text-align:right'></td>
                        <td style='border-right: 1px solid black;'></td>
                        <td style='border-right: 1px solid black;text-align:right'></td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `
                            }

                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;' colspan='7'>Page Sub-Total</td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
              <!--  <td style='border-right: 1px solid black;'><b></b></td>
                <td style='border-right: 1px solid black;'><b></b></td>
                <td style='border-right: 1px solid black;'></td> -->
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageONLYCLDTotal)}</b></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageONLYPCSTotal)}</b></td>
            <!-- <td style='border-right: 1px solid black;'></td> -->
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right'></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePDisTotal)}</b></td>
            <!--    <td style='border-right: 1px solid black;text-align:right'></td> -->
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageSDisTotal)}</b></td>
                <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;' ></td>
                <td style='border-right: 1px solid black;text-align:right' ><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                <td style='border-right: 1px solid black;text-align:right'></td>
                <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(subPageCESSTotal)}</td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
             </tr>
            `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                            <tr style='border: 1px solid black;'>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;' colspan='7'>Grand Total</td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                   <!--            <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'></td> -->
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.onlycldtotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.onlypcstotal)}</b></td>
                                <!-- <td style='border-right: 1px solid black;'></td> -->
                                <td style='border-right: 1px solid black;'></td>
                    <!--            <td style='border-right: 1px solid black;text-align:right'></td> -->
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pdistotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.sdistotal)}</b></td>
                                <td style='border-right: 1px solid black;'><b>${this.limitDecimal(this.grandTotal.INDDISCOUNTTOTAL)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;' ></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'></td>
                                <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(this.grandTotal.TOTALCESS)}</td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                            </tr>
                        `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                    <tr>
                        <td colspan='2'>IGST%</td>
                        <td colspan='2'>IGST AMT</td>
                        <td colspan='2'>CGST%</td>
                        <td colspan='2'>CGST AMT</td>
                        <td colspan='2'>SGST %</td>
                        <td colspan='2'>SGST AMT</td>
                        <td colspan='2'>TAXABLE</td>
                        <td colspan='14'>&nbsp;</td>
                    </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan="18"></td>
                            <td colspan='4'>
                                <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                            </td>
                            <td colspan='5'>
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}

                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td  style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                            <br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}

                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                    `
                        } else {
                            row = row + `
                        <tr>
                            <td colspan="18"></td>
                            <td rowspan="6" colspan='4'>
                                <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                            </td>
                            <td rowspan="6" colspan='5'>
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td rowspan="6"  style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                            <br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                    `
                        }


                        if (this.companyProfile.GSTTYPE != 'Composite') {

                            for (let index in this.gstData) {
                                row = row + `
                    <tr>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                        <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                        <td colspan='14' style='border-right:1px solid black;'></td>
                    <tr>
                        `
                            }
                        }
                        row = row + `
                    <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan='26'>Remarks: ${data.REMARKS}</td>
                    <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='24'>GST Amount : ${data.GSTINWORD}</td>
                    <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                </tr>
                <tr>
                    <td colspan='24'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                    <td colspan='4' style='border-right:1px solid black;'><br></td>
                </tr>
                <tr style='border-top: 1px solid black;border-bottom: 1px solid black'>
                    <td colspan='28' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${isNullOrUndefined(this.companyProfile.Declaration) ? '' : this.companyProfile.Declaration}

                    </td>
                </tr>
                <tr>

</tr>`


                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='28'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }
                    }

                    row = row + ` </tbody>
        </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                        <div class="pagebreak"></div>
                        `
                    }
                }

            }
            if ((this.invoiceType == VoucherTypeEnum.TaxInvoice || this.invoiceType == VoucherTypeEnum.PerformaSalesInvoice) && this.organisation_type == 'fitindia') {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table id="invoiceTable" style='width: 100%;font-size:10px;
                border-collapse: collapse;border:1px solid black;'>
                <tbody>`;

                    row = row + `<tr>
                    <td colspan='4'>

                    ${this.companyProfile.ORG_TYPE.toLowerCase() == 'fitindia' ? '<img src="assets/img/Fit_India_Logo.png" alt="" style="height: 25px;">' : ''}

                    </td>
                    <td colspan='17' style='text-align:center;max-width:180px;'>
                        <b>${this.companyProfile.NAME}</b><br>
                        <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                        <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                        <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                        ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                    </td>
                    <td colspan='4' style='text-align: left;'></td>
                    <td colspan='4' style='text-align: left;'>
                    <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                    </td>
                    </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='10'>
                                CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO} <br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                <td colspan='10' style='text-align: center;'></td>
                <td colspan='9' style='text-align: right;border-right: 1px solid black;'><br>Original for Recipient</td>
            </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='8'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
                <td colspan='13' style='text-align: center;'><b>${this.invoiceType == VoucherTypeEnum.TaxInvoice ? (this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE') : "Performa Invoice"} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}<b></td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'> </td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'>Page : ${i}/${this.noOfInvoiceForA5}</td>
            </tr>
            <tr style='border-top: 1px solid black;'>
                <td colspan='10' style='border-right: 1px solid black;'>Buyer:${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Ship To:${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</td>
                <td colspan='9' style='border-right: 1px solid black;'>Invoice No./Date :<strong>${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}/${this.transformDate(data.TRNDATE)}</strong></td>
            </tr>

            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                <td colspan='9' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                <td colspan='9' style='border-right: 1px solid black;'>
                    Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                <td colspan='9' style='border-right: 1px solid black;'>Order No: ${data.JOBNO}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename == null ? '' : this.customerInfo[0].statename}`)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME == null ? '' : data.shipToDetail.STATENAME}`}</td>
                <td colspan='9' style='border-right: 1px solid black;'>Place of Supply :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename == null ? '' : this.customerInfo[0].statename}`)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>${isNullOrUndefined(this.customerInfo[0].GSTNO) ? '' : 'GST NO :'} ${isNullOrUndefined(this.customerInfo[0].GSTNO) ? '' : this.customerInfo[0].GSTNO}</td>
                <td colspan='10' style='border-right: 1px solid black;'>${isNullOrUndefined(this.customerInfo[0].GSTNO) ? '' : 'GST NO :'} ${isNullOrUndefined(this.customerInfo[0].GSTNO) ? '' : this.customerInfo[0].GSTNO}</td>
                <td colspan='9' style='border-right: 1px solid black;'>Reverse charge : N
                </td>
            </tr>`

                    row = row + `
            <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                <td style='border-right: 1px solid black;' colspan='7'><b>Material Description</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>HSN/SAC</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>BATCH</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>Qty</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>Dis %</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>Taxable</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>IGST Amt</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>CGST Amt</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>SGST Amt</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>Total Amt</b></td>
            </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                        <tr>
                        <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                        <td style='border-right: 1px solid black;max-width:300px;'colspan='7'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                        <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].Quantity)}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                        <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNTRATE)}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='1'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='1'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='1'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `

                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;' colspan='7'>Page Sub-Total</td>
                <td style='border-right: 1px solid black;' colspan='2'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;' '></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                <td style='border-right: 1px solid black;' colspan='1'></td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;' colspan='1'></td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;' colspan='1'</td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2''><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
             </tr>
            `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                            <tr style='border: 1px solid black;'>
                                <td style='border-right: 1px solid black;'  colspan='1'></td>
                                <td style='border-right: 1px solid black;' colspan='7'>Grand Total</td>
                                <td style='border-right: 1px solid black;' colspan='2'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;' ></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                <td style='border-right: 1px solid black;' colspan='1'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;' colspan='1'></td>
                                <td style='border-right: 1px solid black;text-align:right'colspan='2'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;' colspan='1'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                            </tr>
                        `
                        // End Of Page Grand Total

                        row = row + `
                        <tr>
                            <td colspan="20">
                            Total Tax : ${data.GSTINWORD} <br>
                            Invoice Total (In Words): ${data.NETAMOUNTINWORD}

                            </td>

                            <td colspan='6'>
                                Taxable Amt:
                                <br>
                                Total Tax:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                Invoice Total:
                                <br>
                                Total Saving:
                                </b>
                            </td>
                            <td colspan='3' style='text-align: right;border-right:1px solid black;' >
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>

                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                            ${this.limitDecimal(data.NETAMNT)}<br>
                            ${this.limitDecimal(data.DCAMNT)}
                            </b></td>
                        </tr>
                    `
                        row = row + `
                <tr>
                    <td colspan='29'>Remarks: ${data.REMARKS}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='20'>EOE</td>
                    <td colspan='9' style='text-align: right;'>
                    Authorized signatory</td>
                </tr>


                <tr>
                    <td colspan='29'></td>
                </tr>
                <tr>
                    <td colspan='29'><br><br></td>
                </tr>

                <tr>
                    <td colspan='20'></td>
                    <td colspan='9' style='text-align: right;'>
                   FOR ${this.companyProfile.NAME}</td>
                </tr>
                <tr style='border-top: 1px solid black'>
                    <td colspan='29' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration == null ? '' : this.companyProfile.Declaration}
                    </td>
                </tr>`


                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='29'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }
                    }

                    row = row + ` </tbody>
        </table>
        <div class="pagebreak"></div>`

                }

                if (!this.isPickingList && this.customerInfo.length && this.customerInfo[0].GEO && this.customerInfo[0].GEO.toLowerCase() == "fitindia" && this.invoiceType != VoucherTypeEnum.PerformaSalesInvoice) {
                    row = row + `
                        <div style="width:1000px; margin: auto;">
                        <table style="border:1px solid #000;width: 100%;" cellpadding="5" cellspacing="0">
                        <tr>
                        <td colspan="3"><span style="font-size: 48px; color: #5643CD; font-weight:bold;">PACKING SLIP</span></td>
                        </tr>
                        <tr>
                        <td colspan="3"><table style="width: 100%;" cellpadding="5" cellspacing="0">
                            <tr style="background-color:#65B7E5">
                            <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">BILL NO.</span></td>
                            <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">DATE</span></td>
                            <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">ORDER NUMBER</span></td>
                            <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">REMARKS</span></td>
                            </tr>
                            <tr style="background-color:#B6C8C9">
                            <td style="border:1px solid #000; height: 30px; ">${data.VCHRNO}</td>
                            <td style="border:1px solid #000; height: 30px; ">${this.transformDate(data.TRNDATE)}</td>
                            <td style="border:1px solid #000; height: 30px;">${data.REFORDBILL}</td>
                            <td style="border:1px solid #000; height: 30px;">${data.REMARKS}</td>
                            </tr>
                            </table></td>
                        </tr>
                        <tr>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">S.NO.</span></td>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">DESCRIPTION</span></td>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">QUANTITY</span></td>
                        </tr>`
                    for (let i in data.ProdList) {
                        row = row + `<tr>
                                    <td style="border:1px solid #000; height: 30px;">${this._transactionService.nullToZeroConverter(i) + 1}</td>
                                    <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].DESCRIPTION}</td>
                                    <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].RealQty}</td>
                                    </tr>`
                    }
                    row = row + `</table></div>`
                }

            }
            if (this.invoiceType == VoucherTypeEnum.BranchTransferOut) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table id="invoiceTable" style='width: 100%;font-size:10px;
                border-collapse: collapse;border:1px solid black;'>
                <tbody>
                <tr>
                    <td colspan='4'>
                    <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">

                    </td>
                    <td colspan='16' style='text-align:center;max-width:180px;'>
                        <b>${this.companyProfile.NAME}</b><br>
                        <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                        <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                        <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                        ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                    </td>
                    <td colspan='4' style='text-align: left;'></td>
                    <td colspan='4' style='text-align: left;'>
                    </td>
                    </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='10'>
                                CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
                <td colspan='10' style='text-align: center;'></td>
                <td colspan='8' style='text-align: right;border-right: 1px solid black;'><br>Original for Recipient</td>
            </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='8'></td>
                <td colspan='12' style='text-align: center;'><b>Transfer Out:${data.VCHRNO}<b></td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'> </td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'>Page : ${i}/${this.noOfInvoiceForA5}</td>
            </tr>
            <tr style='border-top: 1px solid black;'>
                <td colspan='10' style='border-right: 1px solid black;'>Buyer:${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Ship To:${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Invoice No./Date :<strong>${data.VCHRNO}/${this.transformDate(data.TRNDATE)}</strong></td>
            </tr>

            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                <td colspan='8' style='border-right: 1px solid black;'>
                    Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename == null ? '' : this.customerInfo[0].statename}`)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME == null ? '' : data.shipToDetail.STATENAME}`}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename == null ? '' : this.customerInfo[0].statename}`)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                <td colspan='10' style='border-right: 1px solid black;'></td>
                <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N
                </td>
            </tr>`

                    row = row + `
            <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                <td style='border-right: 1px solid black;' colspan='7'><b>Material Description</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>HSN/SAC</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>Qty</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>Dis %</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>Taxable</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>IGST Amt</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>CGST Amt</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>SGST Amt</b></td>
                <td style='border-right: 1px solid black;' colspan='2'><b>Total Amt</b></td>
            </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                        <tr>
                        <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                        <td style='border-right: 1px solid black;max-width:300px;'colspan='7'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                        <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].Quantity)}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                        <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNTRATE)}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='1'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='1'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='1'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right' colspan='2'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `

                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;' colspan='7'>Page Sub-Total</td>
                <td style='border-right: 1px solid black;' colspan='2'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;' '></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                <td style='border-right: 1px solid black;' colspan='1'></td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;' colspan='1'></td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;' colspan='1'</td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                <td style='border-right: 1px solid black;text-align:right' colspan='2''><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
             </tr>
            `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                            <tr style='border: 1px solid black;'>
                                <td style='border-right: 1px solid black;'  colspan='1'></td>
                                <td style='border-right: 1px solid black;' colspan='7'>Grand Total</td>
                                <td style='border-right: 1px solid black;' colspan='2'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;' ></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                <td style='border-right: 1px solid black;' colspan='1'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;' colspan='1'></td>
                                <td style='border-right: 1px solid black;text-align:right'colspan='2'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;' colspan='1'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='2'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                            </tr>
                        `
                        // End Of Page Grand Total

                        row = row + `
                        <tr>
                            <td colspan="20">
                            Total Tax : ${data.GSTINWORD} <br>
                            Invoice Total (In Words): ${data.NETAMOUNTINWORD}

                            </td>

                            <td colspan='5'>
                                Taxable Amt:
                                <br>
                                Total Tax:
                                <br>
                                Invoice Total:
                                <br>
                                Total Saving:
                                </b>
                            </td>
                            <td colspan='3' style='text-align: right;border-right:1px solid black;' >
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${this.limitDecimal(data.NETAMNT)}<br>
                            ${this.limitDecimal(data.DCAMNT)}
                            </b></td>
                        </tr>
                    `
                        row = row + `
                <tr>
                    <td colspan='28'>Remarks: ${data.REMARKS}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='20'>EOE</td>
                    <td colspan='8' style='text-align: right;'>
                    Authorized signatory</td>
                </tr>


                <tr>
                    <td colspan='28'></td>
                </tr>
                <tr>
                    <td colspan='28'><br><br></td>
                </tr>

                <tr>
                    <td colspan='20'></td>
                    <td colspan='8' style='text-align: right;'>
                   FOR ${this.companyProfile.NAME}</td>
                </tr>
                <tr style='border-top: 1px solid black'>
                    <td colspan='28' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration == null ? '' : this.companyProfile.Declaration}
                    </td>
                </tr>`
                    }

                    row = row + ` </tbody>
        </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                        <div class="pagebreak"></div>
                        `
                    }
                }

            }

            if (this.invoiceType == VoucherTypeEnum.StockIssue) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table style='width: 100%;font-size: 10px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>
                    <tr>
                        <td colspan='8'>
                            <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                        </td>
                        <td colspan='10' style='text-align:center;max-width:180px;'>
                            <b>${this.companyProfile.NAME}</b><br>
                            <b>${data.BILLTO == null ? '' : data.BILLTO + ','}${data.BILLTOADD == null ? '' : data.BILLTOADD}</b><br>
                            <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                            ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                        </td>
                        <td colspan='2' style='text-align: left;'>&nbsp;</td>
                        <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'>
                                    CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                    GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
                    <td colspan='8' style='text-align: center;'></td>
                    <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'> </td>
                    <td colspan='8' style='text-align: center;'><b>Delivery Chalan <b></td>
                    <td colspan='6' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                    <td colspan='2' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='16' style='border-right: 1px solid black;'>Ship To:${data.warehouseDetail.NAME == null ? '' : data.warehouseDetail.NAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Chalan No./Date :${data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
                </tr>

                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>${(data.warehouseDetail.ADDRESS == null ? '' : data.warehouseDetail.ADDRESS)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>Pincode :${(data.warehouseDetail.POSTALCODE == null ? '' : data.warehouseDetail.POSTALCODE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                        Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                    </td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>Mobile :  ${(data.warehouseDetail.MOBILE == null ? '' : data.warehouseDetail.MOBILE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Truck No. :</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>GSTIN :${(data.warehouseDetail.GSTNO == null ? '' : data.warehouseDetail.GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Driver No. :</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>PAN No : ${(data.warehouseDetail.VATNO == null ? '' : data.warehouseDetail.VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>State Code : ${data.warehouseDetail.STATE == null ? '' : `${data.warehouseDetail.STATE},${data.warehouseDetail.STATENAME}`}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Place of Supply : <br>Dispatch Point:
                    </td>
                </tr>

                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;max-width:200px;' colspan='5'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                            <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                            <td style='border-right: 1px solid black;' colspan='5'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltRate)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>

                             `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            }

                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                    <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;' colspan='5'>Page Sub-Total</td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                 </tr>
                `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;' colspan='5'>Grand Total</td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                                </tr>
                            `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='10'>&nbsp;</td>
                        </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {

                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td colspan='4'>
                                </td>
                                <td colspan='3'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        } else {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td rowspan="6" colspan='4'>
                                </td>
                                <td rowspan="6" colspan='3'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td rowspan="6" colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        }


                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            for (let index in this.gstData) {
                                row = row + `
                        <tr>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                            <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                            <td colspan='10' style='border-right:1px solid black;'></td>
                        <tr>
                            `
                            }
                        }
                        row = row + `
                        <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='22'>Remarks: ${data.REMARKS}</td>
                        <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                    </tr>
                    <tr style='border-top: 1px solid black;'>
                        <td colspan='20'>GST Amount : ${data.GSTINWORD}</td>
                        <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                    </tr>
                    <tr>
                        <td colspan='20'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                        <td colspan='4' style='border-right:1px solid black;'><br></td>
                    </tr>
                    <tr style='border-top: 1px solid black'>
                        <td colspan='24' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}
                        </td>
                    </tr>
                    <tr>

</tr>`
                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }

            }







            if (this.invoiceType == VoucherTypeEnum.DebitNote) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table id="invoiceTable" style='width: 100%;font-size:10px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>
                                <tr>
                                    <td colspan='7'></td>
                                    <td colspan='9' style='text-align: center;'><b>${this.companyProfile.NAME}</b></td>
                                    <td colspan='1'>&nbsp;</td>
                                    <td colspan='5' style='text-align: left;'>Original for Recipient</td>
                                </tr>
                                <tr>
                                    <td colspan='7'></td>
                                    <td colspan='9' style='text-align: center;'>${isNullOrUndefined(this.companyProfile.PLACE) ? '' : this.companyProfile.PLACE}, &nbsp;${this.companyProfile.ADDRESS} &nbsp;${this.companyProfile.ADDRESS2}, &nbsp;${this.companyProfile.STATE}</td>
                                    <td colspan='1'>&nbsp;</td>
                                    <td colspan='5' style='text-align: left;'>Duplicate for Supplier/Transporter</td>
                                </tr>
                                <tr>
                                    <td colspan='7'></td>
                                    <td colspan='9' style='text-align: center;'>${this.companyProfile.EMAIL}</td>
                                    <td colspan='1'>&nbsp;</td>
                                    <td colspan='5' style='text-align: left;'>Triplicate for Supplier</td>
                                </tr>
                                <tr style='border-bottom: 1px solid black'>
                                    <td colspan='7'>GSTIN: ${this.companyProfile.GSTNO}</td>
                                    <td colspan='9' style='text-align: center;'>${this.companyProfile.TELA}</td>
                                    <td colspan='6'></td>
                                </tr>
                                <tr style='border-bottom: 1px solid black'>
                                    <td colspan='7'></td>
                                    <td colspan='9' style='text-align: center;'><b>Debit Note</b></td>
                                    <td colspan='6'></td>
                                </tr>

                                <tr style='border-top: 1px solid black'>
                                    <td colspan='7' style='border-right: 1px solid black'>Supplier :&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</td>
                                    <td colspan='9' style='border-right: 1px solid black'>Ref Inv no :${data.REFORDBILL == null ? data.REFBILL : data.REFORDBILL}</td>
                                    <td colspan='6' style='border-right: 1px solid black'>Return No:${data.VCHRNO}</td>
                                </tr>
                                <tr>
                                    <td colspan='7' style='border-right: 1px solid black;'>Address1 :&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].AREA},${this.customerInfo[0] == null ? '' : this.customerInfo[0].DISTRICT},${this.customerInfo[0] == null ? '' : this.customerInfo[0].ADDRESS}</td>
                                    <td colspan='9' style='border-right: 1px solid black'>Ref Inv Date : ${this.transformDate(data.TRN_DATE)}</td>
                                    <td colspan='6'>Debit Note No./Date:${data.VCHRNO} &nbsp;/${this.transformDate(data.TRNDATE)}</td>
                                </tr>
                                <tr>
                                    <td colspan='7' style='border-right: 1px solid black;'>Address2 :&nbsp;</td>
                                    <td colspan='9' style='border-right: 1px solid black;'>&nbsp;</td>
                                    <td colspan='6'>Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}</td>
                                </tr>
                                <tr>
                                    <td colspan='7' style='border-right: 1px solid black;'>City :&nbsp;</td>
                                    <td colspan='9' style='border-right: 1px solid black;'>&nbsp;</td>
                                    <td colspan='6'>Truck No.:&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan='7' style='border-right: 1px solid black'>Pincode :&nbsp;</td>
                                    <td colspan='9' style='border-right: 1px solid black'>&nbsp;</td>
                                    <td colspan='6'>Driver No.:&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan='7' style='border-right: 1px solid black'>Mobile No :&nbsp;</td>
                                    <td colspan='9' style='border-right: 1px solid black'>&nbsp;</td>
                                    <td colspan='6'>Delivery No.:&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan='7' style='border-right: 1px solid black'>GSTIN :&nbsp;${this.customerInfo[0] == null ? '' : this.customerInfo[0].GSTNO}</td>
                                    <td colspan='9' style='border-right: 1px solid black'>&nbsp;</td>
                                    <td colspan='6'>Order No.:&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan='7' style='border-right: 1px solid black'>PAN No :&nbsp;</td>
                                    <td colspan='9' style='border-right: 1px solid black'>&nbsp;</td>
                                    <td colspan='6'>Supplier Ref.:&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan='7' style='border-right: 1px solid black'>State Code :&nbsp;</td>
                                    <td colspan='9' style='border-right: 1px solid black'>&nbsp;</td>
                                    <td colspan='6'>Place of Supply :&nbsp;</td>
                                </tr>
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                                    <td style='border-right: 1px solid black;' colspan='2'><b>Material Description</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Qty</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Tot Dis</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amount</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                                </tr>`



                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                                <td style='border-right: 1px solid black;border-left: 1px solid black;' colspan='1'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                                <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[this.arrayIndex].MCODE}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[this.arrayIndex].BC}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[this.arrayIndex].BATCH}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[this.arrayIndex].AltQty.toFixed(2)}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[this.arrayIndex].Quantity}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${data.ProdList[this.arrayIndex].RealQty}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[this.arrayIndex].DISCOUNT)}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>
                                <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : ""}</td>
                                <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : ""}</td>
                                <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : ""}</td>
                                <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : ""}</td>
                                <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? data.ProdList[this.arrayIndex].GSTRATE : ""}</td>
                                <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(data.ProdList[this.arrayIndex].VAT) : ""}</td>
                                <td style='border-right: 1px solid black;' colspan='1'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>`
                        }

                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                            <tr style='border: 1px solid black;'>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;' colspan='2'>Page Sub-Total</td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;' colspan='1'></td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</td>
                                <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                            </tr>`

                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `

                        <tr style='border: 1px solid black;'>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='2'><b>Grand Total</b></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                            <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                            <td style='border-right: 1px solid black;' colspan='1'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                            <td style='border-right: 1px solid black;' colspan='1'></td>
                            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                            <td style='border-right: 1px solid black;' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                        </tr>
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='4'></td>
                            <td colspan='3'>
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                            <br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                            `
                        // End Of Page Grand Total




                        for (let i in this.gstData) {
                            row = row + `
                                        <tr>
                                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[i].IGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[i].IGSTTOTAL) : this.limitDecimal(0)}</td>
                                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].CGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].CGSTTOTAL) : this.limitDecimal(0)}</td>
                                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].SGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].SGSTTOTAL) : this.limitDecimal(0)}</td>                    <td colspan='2'>${this.limitDecimal(this.gstData[i].taxable)}</td>
                                            <td colspan='8' style='border-right:1px solid black;'></td>
                                        <tr>
                            `
                        }
                        row = row + `
                            <tr>
                                <td colspan='20'>Remarks: ${data.REMARKS}</td>
                                <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                            </tr>
                            <tr style='border-top: 1px solid black;'>
                                <td colspan='20'>GST Amount : ${data.GSTINWORD}</td>
                                <td colspan='2' style='text-align: right;'>${this.companyProfile.NAME}</td>
                            </tr>
                            <tr>
                                <td colspan='20'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                                <td colspan='2' style='border-right:1px solid black;'>Signature</td>
                            </tr>`
                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }

            }
        }
        if (this.printMode == 3) {
            this.organisation_type = this.getOrgtypeBasedOnPartyType(data.PARTY_ORG_TYPE);
            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && this.organisation_type.toLowerCase() == 'retailer' && this.companyProfile.COMPANYID == "jashjyotpharma") {



                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    row = row + `<table style='width: 100%;font-size: 10px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>`;

                    row = row + `

                    <tr>
                    <td colspan='2'>
                        <img src="${this.setting.APPIMAGEPATH}" alt="" style="padding-left: 5px;height: 50px;">
                    </td>
                    <td colspan='8' style='text-align:center;max-width:180px;'>
                        <b>${this.companyProfile.NAME}</b><br>
                        <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS}</b><br>
                        ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.EMAIL == null ? '' : `, <b>E-mail:</b> ${this.companyProfile.EMAIL}`}
                    </td>
                    <td colspan='3' style='text-align: left;border-right: 1px solid black;'>
                    </td>
                   
                   
                </tr>

              
                <tr style='border: 1px solid #5a5656; border-bottom:none;'>
                    <td colspan='13'> <strong>Cust.Name : ${(data.BILLTO == null) ? '' : data.BILLTO}</strong> </td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='7'>  <strong>Address : ${(data.BILLTOADD == null) ? '' : data.BILLTOADD}</strong> </td>
                    <td colspan='6' style='text-align:right;'> Invoice: ${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}
                    <br> Date : ${this.transformDate(data.TRNDATE)}</td>
                </tr>                
                
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-bottom: 1px solid #5a5656;'>
                    <td colspan='13'> <strong>PAN : ${(this.customerInfo == null || this.customerInfo[0] == null) ? '' : (this.customerInfo[0].VAT == null ? '' : this.customerInfo[0].VAT)}</strong></td>
                </tr>
                </table>           
               
                    <table style='border-collapse: collapse;width: 100%;font-size:9px; border-top:1px solid #5a5656;border-left:1px solid #5a5656;border-right:1px solid #5a5656;border-bottom:1px solid #5a5656;'>
                        <thead style=' border-collapse: collapse; border:1px solid #5a5656;'>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                S.NO
                            </th>
                            <th
                                style='border-collapse: collapse;border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                PRODUCT
                                </th>
                            <th
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                HSN
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Batch No
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Exp Date
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                QTY
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                FREE QTY
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                MRP
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                RATE
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Dis %
                                </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Dis
                                AMT</th>
                            
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                AMOUNT
                            </th>
                        </thead>
                        <tbody
                        style:'border:1px solid #5a5656;border-collapse: collapse; text-align:center;'>
                            `;
                    let freeQuantity = 0;
                    for (j; j <= this.numberOfItemInA5; j++) {

                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            freeQuantity = freeQuantity + data.ProdList[this.arrayIndex].FreeQuantity;
                            row = row + `
                        <tr>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;border-left: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: justify;padding: 2.5px 5px;'>
                                ${isNullOrUndefined(data.ProdList[this.arrayIndex].DESCRIPTION) ? '' : data.ProdList[this.arrayIndex].DESCRIPTION} </td>                               
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${isNullOrUndefined(data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE) ? '' : data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].BATCH}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].RealQty}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].FreeQuantity}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].ALTRATE2)}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNTRATE)}
                            </td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].DISCOUNT)}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>                                
                        </tr>
                        
                        `
                        }
                        this.arrayIndex = this.arrayIndex + 1;

                    }
                    row = row +
                        `<tr style='border: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                          <td colspan = '4'></td>
                        <td colspan = '1'
                        style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; '>
                        <strong>TOTAL:</strong>
                        </td>
                        <td colspan = '1'
                        style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; '>${data.TotalQuantity}</td>
                        <td colspan='1' style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;' >${freeQuantity}</td>
                        <td colspan = '7' style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'></td>
                        </tr>
                        </tbody>
                        <tfoot style:' border: 1px solid #5a5656;text-align:right;'>
                        <tr>
                         <td colspan='3'style='text-align: left;'>No of item :  ${data.ProdList.length}</td>
                    
                    <td colspan='5' ></td>
                    <td colspan='3' style='text-align: right;'>Net Amount :
                    </td>
                    <td colspan='3' style='text-align: right;'>${this.limitDecimal(data.FTOTAMNT + data.FVATAMNT)} </td>
                    </tr>
                    
                <tr>
                    <td colspan='3' style='text-align:left;'>Amount in Words :   ${data.NETAMOUNTINWORD}</td>
                    <td colspan='5'></td>                                     
                    <td colspan='3' style='text-align:right;'>Dis Amount :  </td>
                    <td colspan='3' style='text-align:right;'>${this.limitDecimal(data.DCAMNT)}</td>
                </tr>                
                               
                <tr>
                    <td colspan='3'></td>
                    <td colspan='5'></td>
                    <td colspan='3' style='text-align: right;' ><strong>Total:</strong> </td>
                    <td colspan='3' style='text-align: right;'><strong>${this.limitDecimal(data.NETAMNT)}</strong></td>
                </tr>

                <tr>
                    <td colspan='3'>Bank details:
                    <br>Bank Name:
                    ${isNullOrUndefined(this.companyProfile.BankName) ? '' : this.companyProfile.BankName} 
                    <br>Bank Branch: ${isNullOrUndefined(this.companyProfile.BankBranch) ? '' : this.companyProfile.BankBranch} 
                    <br>Account No.: ${isNullOrUndefined(this.companyProfile.AccountNo) ? '' : this.companyProfile.AccountNo} 
                    <br>IFSC Code: ${isNullOrUndefined(this.companyProfile.IFSCCode) ? '' : this.companyProfile.IFSCCode} 
                    <br>Account Holder Name: ${isNullOrUndefined(this.companyProfile.AcountHolder) ? '' : this.companyProfile.AcountHolder}</td>
                    <td colspan='5'></td>
                    <td colspan='3' style='text-align: right;' ></td>
                    <td colspan='3' style='text-align: right;'><strong></td>
                </tr>

                <tr  style='border:1px solid #5a5656; text-align: center;' >
                    <td colspan="7">* Thank You *</td>
                   
                    <td colspan="7">Signature By</td>
                </tr>
                        

                        </tfoot>
                    </table>
                  <table>
                    
                
                
              
                `;

                    if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                    else {
                        row = row + `  <tr>
                <td colspan='14'>
                <img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
                ${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
                </tr>`;
                    }
                    row = row + `</tbody>
            </table>
                    `
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }




            }
            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && this.organisation_type.toLowerCase() == 'retailer' && this.companyProfile.COMPANYID != "jashjyotpharma") {

                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    row = row + `<table style='width: 100%;font-size:9px;
                    border-collapse: collapse;border-top: none;border-bottom: none; border-right: 1px solid #5a5656'>
                    <tbody>`;

                    row = row + `                   
                    

                    <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                    <td colspan='2' rowspan='3'>
                    <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 70px;">                        
                </td>
                    <td colspan="9"  style='text-align: center;'> <strong>${this.companyProfile.NAME}</strong> </td>
                    <td colspan='2' rowspan='3'>&nbsp;</td>
                </tr>

                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    
                    <td  colspan="9" style='text-align: center'> ${this.companyProfile.ADDRESS}</td>
                   
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                   
                    <td colspan="9" style='text-align: center'>Phno : ${this.companyProfile.TELA} ,&nbsp; E-mail: ${this.companyProfile.EMAIL} </td>
                   
                </tr>
                <tr style='border: 1px solid #5a5656; border-bottom:none;'>
                    <td colspan='13'> <strong>Cust.Name2 : ${(data.BILLTO == null) ? '' : data.BILLTO}</strong> </td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='7'>  <strong>Address : ${(data.BILLTOADD == null) ? '' : data.BILLTOADD}</strong> </td>
                    <td colspan='6' style='text-align:right;'> Invoice: ${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}
                    <br> Date : ${this.transformDate(data.TRNDATE)}</td>
                </tr>                
                
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-bottom: 1px solid #5a5656;'>
                    <td colspan='13'> <strong>PAN : ${(this.customerInfo == null || this.customerInfo[0] == null) ? '' : (this.customerInfo[0].VAT == null ? '' : this.customerInfo[0].VAT)}</strong></td>
                </tr>
                </table>           
               
                    <table style='border-collapse: collapse;width: 100%;font-size:9px; border-top:1px solid #5a5656;border-left:1px solid #5a5656;border-right:1px solid #5a5656;border-bottom:1px solid #5a5656;'>
                        <thead style=' border-collapse: collapse; border:1px solid #5a5656;'>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                S.NO
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                HSN
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Batch No
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Exp Date
                            </th>
                            <th 
                                style='border-collapse: collapse;border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                PRODUCT</th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                QTY
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                FREE QTY
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                MRP
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                RATE
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Dis %
                                </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Dis
                                AMT</th>
                            
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                AMOUNT
                            </th>
                        </thead>
                        <tbody
                        style:'border:1px solid #5a5656;border-collapse: collapse; text-align:center;'>
                            `;
                    let freeQuantity = 0;
                    for (j; j <= this.numberOfItemInA5; j++) {

                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            freeQuantity = freeQuantity + data.ProdList[this.arrayIndex].FreeQuantity;
                            row = row + `
                        <tr>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;border-left: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].BATCH}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: justify;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].DESCRIPTION}</td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].RealQty}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].FreeQuantity}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].ALTRATE2)}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNTRATE)}
                            </td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].DISCOUNT)}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>
                        
                        `
                        }
                        this.arrayIndex = this.arrayIndex + 1;

                    }
                    row = row +
                        `<tr style='border: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                          <td colspan = '4'></td>
                        <td colspan = '1'
                        style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; '>
                        <strong>TOTAL:</strong>
                        </td>
                        <td colspan = '1'
                        style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; '>${data.TotalQuantity}</td>
                        <td colspan='1' style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;' >${freeQuantity}</td>
                        <td colspan = '7' style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'></td>
                        </tr>
                        </tbody>
                        <tfoot style:' border: 1px solid #5a5656;text-align:right;'>
                        <tr>
                         <td colspan='3'style='text-align: left;'>No of item :  ${data.ProdList.length}</td>
                    
                    <td colspan='5' ></td>
                    <td colspan='3' style='text-align: right;'>Net Amount :
                    </td>
                    <td colspan='3' style='text-align: right;'>${this.limitDecimal(data.FTOTAMNT + data.FVATAMNT)} </td>
                    </tr>
                    
                <tr>
                    <td colspan='3' style='text-align:left;'>Amount in Words :   ${data.NETAMOUNTINWORD}</td>
                    <td colspan='5'></td>                                     
                    <td colspan='3' style='text-align:right;'>Dis Amount :  </td>
                    <td colspan='3' style='text-align:right;'>${this.limitDecimal(data.DCAMNT)}</td>
                </tr>                
                               
                <tr>
                    <td colspan='3'></td>
                    <td colspan='5'></td>
                    <td colspan='3' style='text-align: right;' ><strong>Total:</strong> </td>
                    <td colspan='3' style='text-align: right;'><strong>${this.limitDecimal(data.NETAMNT)}</strong></td>
                </tr>
                <tr  style='border:1px solid #5a5656; text-align: center;' >
                    <td colspan="7">* Thank You *</td>
                   
                    <td colspan="7">Signature By</td>
                </tr>
                        

                        </tfoot>
                    </table>
                  <table>
                    
                
                
              
                `;

                    if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                    else {
                        row = row + `  <tr>
                <td colspan='14'>
                <img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
                ${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
                </tr>`;
                    }
                    row = row + `</tbody>
            </table>
                    `
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }




            }


            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && this.organisation_type != 'distributor' && this.organisation_type != 'superdistributor' &&
                this.organisation_type != "superstockist" &&
                this.organisation_type != "fitindia" &&
                this.organisation_type.toLowerCase() != 'wdb' &&
                this.organisation_type.toLowerCase() != 'ssa' &&
                this.organisation_type.toLowerCase() != 'zcp' &&
                (this.companyProfile.GSTTYPE == null ? "" : this.companyProfile.GSTTYPE).toLowerCase() == "un-register") {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    row = row + `<table style='width: 100%;font-size:9px;
                border-collapse: collapse;border-top: none;border-bottom: none'>
                <tbody>`;

                    row = row + ` <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                <td colspan='6'> <img src="" alt="" style="height: 25px;"></td>
                <td colspan='6' style='text-align: center'> <strong>${this.companyProfile.NAME}</strong> </td>
                <td colspan='6'></td>
            </tr>

            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='6'></td>
                <td colspan='6' style='text-align: center'> ${this.companyProfile.ADDRESS}</td>
                <td colspan='6'></td>
            </tr>
            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='6'> </td>
                <td colspan='6' style='text-align: center'>Phno : ${this.companyProfile.TELA} ,&nbsp; E-mail: ${this.companyProfile.EMAIL} </td>
                <td colspan='6'></td>
            </tr>
          

            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                <td colspan='6'></td>
                <td colspan='6' style='text-align: center'><b>RETAIL INVOICE:${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}</b></td>
                <td colspan='6'></td>
            </tr>
            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                <td colspan='6'>  <strong>Cust.Name :</strong> </td>
                <td colspan='6'>${(data.BILLTO == null) ? '' : data.BILLTO}</td>
                <td colspan='6'> <strong>INVOICE</strong></td>
            </tr>
            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='6'>  <strong>Address :</strong> </td>
                <td colspan='6'>${(data.BILLTOADD == null) ? '' : data.BILLTOADD}</td>
                <td colspan='6'> Invoice: ${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}</td>
            </tr>
            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='6'> </td>
                <td colspan='6' style='text-align: center'></td>
                <td colspan='6'> Date : ${this.transformDate(data.TRNDATE)}</td>
            </tr>
          
            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-bottom:1px solid #5a5656;'>
                <td colspan='6'></td>
                <td colspan='6' style='text-align: center'></td>
                <td colspan='6'>User Name :${this.userProfile.username}</td>
            </tr>

            <tr>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                S.NO
              </th>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                HSN
              </th>
              <th colspan='4'
                style='border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                ITEM
                NAME</th>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                QTY
              </th>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                RATE
              </th>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                Dis
                AMT</th>
              <th
           
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                AMOUNT
              </th>
            </tr>
        `
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            row = row + `
                                            <tr>
                                                <td style='  border-right: 1px solid #5a5656;border-left: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}
                                                </td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE}</td>
                                                <td colspan='4' style='  border-right: 1px solid #5a5656;text-align: justify;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].DESCRIPTION}</td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].RealQty}
                                                </td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].DISCOUNT)}
                                                </td>
                                              
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                                            </tr>
                                            `
                        }
                        this.arrayIndex = this.arrayIndex + 1;

                    }
                    row = row + `

                <tr>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
                <td colspan='4'
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    <strong>TOTAL</strong> </td>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    ${data.TotalQuantity}</td>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
               
                <td style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>

                </td>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
            </tr>
            <tr style=' border-top: 1px solid  #5a5656;border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td></td>
                <td></td>
                <td colspan='4'>No of item :${data.ProdList.length} <br><hr></td>
                <td></td>
               
                <td colspan='2'>Net Amount :
                <br>
                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                Round Off:
                </td>
                <td>${this.limitDecimal(data.FTOTAMNT)} <br>
            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                    ${this.limitDecimal(data.ROUNDOFF)}
                </td>
            </tr>
            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='2'>Amount in Words :</td>
                <td colspan='5'>${data.NETAMOUNTINWORD}</td>
                <td colspan='2'>Dis Amount</td>
                <td>${this.limitDecimal(data.DCAMNT)}</td>
            </tr>
           
           
            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               
               
                <td></td>
                <td></td>
                <td colspan='2'>Total:</td>
                <td> ${this.limitDecimal(data.NETAMNT)}</td>
            </tr>
            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                
               
                <td>&nbsp;</td>
            </tr>
            <tr style='border-left: 1px solid #5a5656;border: 1px solid #5a5656;'>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              
               
                <td colspan="5">* Thank You *</td>
                <td>&nbsp;</td>
                <td>Signature By</td>
                <td>&nbsp;</td>
            </tr>`;

                    if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                    else {
                        row = row + `  <tr>
            <td colspan='10'>
            <img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
            ${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
            </tr>`;
                    }
                    row = row + `</tbody>
        </table>
                `
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                        <div class="pagebreak"></div>
                        `
                    }
                }

                if (!this.isPickingList && this.customerInfo.length && this.customerInfo[0].GEO && this.customerInfo[0].GEO.toLowerCase() == "fitindia") {
                    row = row + `
                        <div style="width:1000px; margin: auto;">
                        <table style="border:1px solid #000;width: 100%;" cellpadding="5" cellspacing="0">
                        <tr>
                        <td colspan="3"><span style="font-size: 48px; color: #5643CD; font-weight:bold;">PACKING SLIP</span></td>
                        </tr>
                        <tr>
                        <td colspan="3"><table style="width: 100%;" cellpadding="5" cellspacing="0">
                            <tr style="background-color:#65B7E5">
                            <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">BILL NO.</span></td>
                            <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">DATE</span></td>
                            <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">ORDER NUMBER</span></td>
                            <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">REMARKS</span></td>
                            </tr>
                            <tr style="background-color:#B6C8C9">
                            <td style="border:1px solid #000; height: 30px; ">${data.VCHRNO}</td>
                            <td style="border:1px solid #000; height: 30px; ">${this.transformDate(data.TRNDATE)}</td>
                            <td style="border:1px solid #000; height: 30px;">${data.REFORDBILL}</td>
                            <td style="border:1px solid #000; height: 30px;">${data.REMARKS}</td>
                            </tr>
                            </table></td>
                        </tr>
                        <tr>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">S.NO.</span></td>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">DESCRIPTION</span></td>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">QUANTITY</span></td>
                        </tr>`
                    for (let i in data.ProdList) {
                        row = row + `<tr>
                                    <td style="border:1px solid #000; height: 30px;">${this._transactionService.nullToZeroConverter(i) + 1}</td>
                                    <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].DESCRIPTION}</td>
                                    <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].RealQty}</td>
                                    </tr>`
                    }
                    row = row + `</table></div>`
                }


            }



            if ((this.invoiceType == VoucherTypeEnum.TaxInvoice) && (this.organisation_type == 'distributor')) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPageONLYCLDTotal = 0, subPageONLYPCSTotal = 0, subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table id="invoiceTable" style='width: 100%;font-size:10px;
                border-collapse: collapse;border:1px solid black'>
                <tbody>`

                    row = row + `<tr>
                    <td colspan='6'>
                        <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                    </td>
                    <td colspan='16' style='text-align:center;max-width:180px;'>
                        <b>${this.companyProfile.NAME}</b><br>
                        <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                        <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                        <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                        ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                    </td>
                    <td colspan='2' style='text-align: left;'>&nbsp;</td>
                    <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>
                    </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='10'>
                                CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}<br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                <td colspan='10' style='text-align: center;'></td>
                <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
            </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='8'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
                <td colspan='12' style='text-align: center;'><b>${this.invoiceType == VoucherTypeEnum.TaxInvoice ? (this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE') : "Performa Invoice"} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}<b></td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
            </tr>
            <tr style='border-top: 1px solid black;'>
                <td colspan='10' style='border-right: 1px solid black;'>Buyer:<b>${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</b></td>
                <td colspan='10' style='border-right: 1px solid black;'>Ship To:<b>${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</b></td>
                <td colspan='8' style='border-right: 1px solid black;'>Invoice No./Date :${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
            </tr>

            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                <td colspan='8' style='border-right: 1px solid black;'>
                    Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Truck No. :${data.TransporterEway ? (data.TransporterEway.VEHICLENO == null ? '' : data.TransporterEway.VEHICLENO) : ''}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Driver No. :${data.TransporterEway ? (data.TransporterEway.DRIVERNO == null ? '' : data.TransporterEway.DRIVERNO) : ''}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename}`)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME}`}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].CITY == null ? 'Un-Register' : this.customerInfo[0].CITY)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                <td colspan='10' style='border-right: 1px solid black;'>Beat:${this.customerInfo[0] == null ? '' : (this.customerInfo[0].BEATNAME == null ? '' : `${this.customerInfo[0].BEATNAME}`)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N
                </td>
             </tr>`

                    if (this.organisation_type == 'distributor') {
                        row = row + `
                <tr>
                <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                <td colspan='10' style='border-right: 1px solid black;'>DSM NAME:${data.AdditionalObj == null ? '' : (data.AdditionalObj.DSMNAME == null ? '' : data.AdditionalObj.DSMNAME)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>
                </td>
            </tr>`
                    }

                    row = row + `
            <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;' ><b>S.No.</b></td>
                <td style='border-right: 1px solid black;' colspan='7'><b>Material Description</b></td>
                <td style='border-right: 1px solid black;' ><b>Item Code</b></td>
                <td style='border-right: 1px solid black;' ><b>HSN/SAC</b></td>
                <td style='border-right: 1px solid black;' ><b>MRP</b></td>
        <!--    <td style='border-right: 1px solid black;' ><b>Batch No</b></td>
                <td style='border-right: 1px solid black;' ><b>Mfg</b></td>
                <td style='border-right: 1px solid black;' ><b>Exp</b></td> -->
                <td style='border-right: 1px solid black;' ><b>CLD</b></td>
                <td style='border-right: 1px solid black;' ><b>Pcs</b></td>
        <!--        <td style='border-right: 1px solid black;' ><b>UOM</b></td> -->
                <td style='border-right: 1px solid black;' ><b>Rate</b></td>
        <!--        <td style='border-right: 1px solid black;' ><b>PDis %</b></td> -->
                <td style='border-right: 1px solid black;' ><b>P Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>S Dis%</b></td>
                <td style='border-right: 1px solid black;' ><b>S Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>Othr Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>Taxable</b></td>
                <td style='border-right: 1px solid black;' ><b>IGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>IGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>CGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>CGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>SGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>SGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>CESS%</b></td>
                <td style='border-right: 1px solid black;' ><b>CESS Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>Amount</b></td>
            </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPageONLYCLDTotal = subPageONLYCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].CLD);
                            subPageONLYPCSTotal = subPageONLYPCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].PCS);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                        <tr style='border-top:1px solid black;'>
                        <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                        <td style='border-right: 1px solid black;max-width:300px;' colspan='7'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                    <!--    <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                        <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                        <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td> -->
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].CLD)}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].PCS}</td>
                    <!--     <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td> -->
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                    <!--    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].PrimaryDiscountPercent)}</td> -->
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BasePrimaryDiscount)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].SecondaryDiscountPercent)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BaseSecondaryDiscount)}</td>
                        <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>


                        `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                        <td style='border-right: 1px solid black;'></td>
                        <td style='border-right: 1px solid black;text-align:right'></td>
                        <td style='border-right: 1px solid black;'></td>
                        <td style='border-right: 1px solid black;text-align:right'></td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `
                            }

                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;' colspan='7'>Page Sub-Total</td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
              <!--  <td style='border-right: 1px solid black;'><b></b></td>
                <td style='border-right: 1px solid black;'><b></b></td>
                <td style='border-right: 1px solid black;'></td> -->
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageONLYCLDTotal)}</b></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageONLYPCSTotal)}</b></td>
            <!-- <td style='border-right: 1px solid black;'></td> -->
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right'></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePDisTotal)}</b></td>
            <!--    <td style='border-right: 1px solid black;text-align:right'></td> -->
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageSDisTotal)}</b></td>
                <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;' ></td>
                <td style='border-right: 1px solid black;text-align:right' ><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                <td style='border-right: 1px solid black;text-align:right'></td>
                <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(subPageCESSTotal)}</td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
             </tr>
            `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                            <tr style='border: 1px solid black;'>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;' colspan='7'>Grand Total</td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                   <!--            <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'></td> -->
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.onlycldtotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.onlypcstotal)}</b></td>
                                <!-- <td style='border-right: 1px solid black;'></td> -->
                                <td style='border-right: 1px solid black;'></td>
                    <!--            <td style='border-right: 1px solid black;text-align:right'></td> -->
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pdistotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.sdistotal)}</b></td>
                                <td style='border-right: 1px solid black;'><b>${this.limitDecimal(this.grandTotal.INDDISCOUNTTOTAL)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;' ></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'></td>
                                <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(this.grandTotal.TOTALCESS)}</td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                            </tr>
                        `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                    <tr>
                        <td colspan='2'>IGST%</td>
                        <td colspan='2'>IGST AMT</td>
                        <td colspan='2'>CGST%</td>
                        <td colspan='2'>CGST AMT</td>
                        <td colspan='2'>SGST %</td>
                        <td colspan='2'>SGST AMT</td>
                        <td colspan='2'>TAXABLE</td>
                        <td colspan='14'>&nbsp;</td>
                    </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan="18"></td>
                            <td colspan='4'>
                                <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                            </td>
                            <td colspan='5'>
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}

                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td  style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                            <br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}

                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                    `
                        } else {
                            row = row + `
                        <tr>
                            <td colspan="18"></td>
                            <td rowspan="6" colspan='4'>
                                <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                            </td>
                            <td rowspan="6" colspan='5'>
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td rowspan="6"  style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                            <br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                    `
                        }


                        if (this.companyProfile.GSTTYPE != 'Composite') {

                            for (let index in this.gstData) {
                                row = row + `
                    <tr>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                        <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                        <td colspan='14' style='border-right:1px solid black;'></td>
                    <tr>
                        `
                            }
                        }
                        row = row + `
                    <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan='26'>Remarks: ${data.REMARKS}</td>
                    <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='24'>GST Amount : ${data.GSTINWORD}</td>
                    <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                </tr>
                <tr>
                    <td colspan='24'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                    <td colspan='4' style='border-right:1px solid black;'><br></td>
                </tr>
                <tr style='border-top: 1px solid black;border-bottom: 1px solid black'>
                    <td colspan='28' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${isNullOrUndefined(this.companyProfile.Declaration) ? '' : this.companyProfile.Declaration}

                    </td>
                </tr>
                <tr>

</tr>`


                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='28'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }
                    }

                    row = row + ` </tbody>
        </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                        <div class="pagebreak"></div>
                        `
                    }
                }

            }






            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && (this.organisation_type == 'superdistributor' ||
                this.organisation_type == "superstockist" ||
                this.organisation_type.toLowerCase() == 'wdb' ||
                this.organisation_type.toLowerCase() == 'ssa' ||
                this.organisation_type.toLowerCase() == 'zcp')) {

                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table style='width: 100%;font-size: 8.5px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>`;




                    row = row + `<tr>
                        <td colspan='10'>
                            <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                        </td>
                        <td colspan='10' style='text-align:center;max-width:180px;'>
                            <b>${this.companyProfile.NAME}</b><br>
                            <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                            <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                            <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                            ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                        </td>
                        <td colspan='2' style='text-align: left;'>&nbsp;</td>
                        <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='10'>
                                    CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                    GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}<br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                    <td colspan='8' style='text-align: center;'></td>
                    <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                <td colspan='10'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
                <td colspan='10' style='text-align: center;'><b>${this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE'} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}<b></td>
                    <td colspan='4' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                    <td colspan='2' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='10' style='border-right: 1px solid black;'>Buyer:${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Ship To:${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Invoice No./Date :${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
                </tr>

                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                    <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                        Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                    </td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Truck No. :${data.TransporterEway ? (data.TransporterEway.VEHICLENO == null ? '' : data.TransporterEway.VEHICLENO) : ''}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Driver No. :${data.TransporterEway ? (data.TransporterEway.DRIVERNO == null ? '' : data.TransporterEway.DRIVERNO) : ''}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename}`)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME}`}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :
                    </td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Beat:${this.customerInfo[0] == null ? '' : (this.customerInfo[0].BEATNAME == null ? '' : `${this.customerInfo[0].BEATNAME}`)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N
                    </td>
                </tr>`

                    if (this.organisation_type == 'distributor') {
                        row = row + `
                    <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                    <td colspan='8' style='border-right: 1px solid black;'>DSM NAME:${data.AdditionalObj == null ? '' : (data.AdditionalObj.DSMNAME == null ? '' : data.AdditionalObj.DSMNAME)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                    </td>
                </tr>`
                    }

                    row = row + `
                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;max-width:200px;' colspan='2'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>P Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Othr Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CESS%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CESS Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                </tr>`

                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                            <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                            <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BasePrimaryDiscount)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BaseSecondaryDiscount)}</td>
                            <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>

                             `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                            </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            }


                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                    <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;' colspan='2'>Page Sub-Total</td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePDisTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageSDisTotal)}</b></td>
                    <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageCESSTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                 </tr>
                `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;' colspan='2'>Grand Total</td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pdistotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.sdistotal)}</b></td>
                                    <td style='border-right: 1px solid black;'><b>${this.limitDecimal(this.grandTotal.INDDISCOUNTTOTAL)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTALCESS)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                                </tr>
                            `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='12'>&nbsp;</td>
                        </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td colspan='4'>
                                    <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                </td>
                                <td colspan='5'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        } else {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td rowspan="6" colspan='4'>
                                    <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                </td>
                                <td rowspan="6" colspan='5'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td rowspan="6" colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        }

                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            for (let index in this.gstData) {
                                row = row + `
                        <tr>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                            <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                            <td colspan='12' style='border-right:1px solid black;'></td>
                        <tr>
                            `
                            }
                        }
                        row = row + `
                        <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='24'>Remarks: ${data.REMARKS}</td>
                        <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                    </tr>
                    <tr style='border-top: 1px solid black;'>
                        <td colspan='22'>GST Amount : ${data.GSTINWORD}</td>
                        <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                    </tr>
                    <tr>
                        <td colspan='22'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                        <td colspan='4' style='border-right:1px solid black;'><br></td>
                    </tr>
                    <tr style='border-top: 1px solid black'>
                        <td colspan='26' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}

                        </td>
                    </tr>
                    <tr>

</tr>`

                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='26'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }

                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }

            }
            if (this.invoiceType == VoucherTypeEnum.StockIssue) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table style='width: 100%;font-size: 9px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>
                    <tr>
                        <td colspan='8'>
                            <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                        </td>
                        <td colspan='10' style='text-align:center;max-width:180px;'>
                            <b>${this.companyProfile.NAME}</b><br>
                            <b>${data.BILLTO == null ? '' : data.BILLTO + ','}${data.BILLTOADD == null ? '' : data.BILLTOADD}</b><br>
                            <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                            ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                        </td>
                        <td colspan='2' style='text-align: left;'>&nbsp;</td>
                        <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'>
                                    CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                    GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
                    <td colspan='8' style='text-align: center;'></td>
                    <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'> </td>
                    <td colspan='8' style='text-align: center;'><b>Delivery Chalan <b></td>
                    <td colspan='6' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                    <td colspan='2' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='16' style='border-right: 1px solid black;'>Ship To:${data.warehouseDetail.NAME == null ? '' : data.warehouseDetail.NAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Chalan No./Date :${data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
                </tr>

                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>${(data.warehouseDetail.ADDRESS == null ? '' : data.warehouseDetail.ADDRESS)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>Pincode :${(data.warehouseDetail.POSTALCODE == null ? '' : data.warehouseDetail.POSTALCODE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                        Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                    </td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>Mobile :  ${(data.warehouseDetail.MOBILE == null ? '' : data.warehouseDetail.MOBILE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Truck No. :</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>GSTIN :${(data.warehouseDetail.GSTNO == null ? '' : data.warehouseDetail.GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Driver No. :</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>PAN No : ${(data.warehouseDetail.VATNO == null ? '' : data.warehouseDetail.VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>State Code : ${data.warehouseDetail.STATE == null ? '' : `${data.warehouseDetail.STATE},${data.warehouseDetail.STATENAME}`}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Place of Supply : <br>Dispatch Point:
                    </td>
                </tr>

                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;max-width:200px;' colspan='5'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                            <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                            <td style='border-right: 1px solid black;' colspan='5'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>


                             `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            }


                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                    <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;' colspan='5'>Page Sub-Total</td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                 </tr>
                `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;' colspan='5'>Grand Total</td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                                </tr>
                            `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='10'>&nbsp;</td>
                        </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td colspan='4'>
                                </td>
                                <td colspan='3'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                                `
                        } else {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td rowspan="6" colspan='4'>
                                </td>
                                <td rowspan="6" colspan='3'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td rowspan="6" colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>`
                        }

                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            for (let index in this.gstData) {
                                row = row + `
                        <tr>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                            <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                            <td colspan='10' style='border-right:1px solid black;'></td>
                        <tr>
                            `
                            }
                        }
                        row = row + `
                        <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='22'>Remarks: ${data.REMARKS}</td>
                        <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                    </tr>
                    <tr style='border-top: 1px solid black;'>
                        <td colspan='20'>GST Amount : ${data.GSTINWORD}</td>
                        <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                    </tr>
                    <tr>
                        <td colspan='20'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                        <td colspan='4' style='border-right:1px solid black;'><br></td>
                    </tr>
                    <tr style='border-top: 1px solid black'>
                        <td colspan='24' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}

                        </td>
                    </tr>
                    <tr>

</tr>`
                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }


            }
        }


        if (this.printMode == 2) {
            this.organisation_type = this.getOrgtypeBasedOnPartyType(data.PARTY_ORG_TYPE);
            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && this.organisation_type.toLowerCase() == 'retailer') {

                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    row = row + `<table style='width: 100%;font-size:9px;
                    border-collapse: collapse;border-top: none;border-bottom: none; border-right: 1px solid #5a5656'>
                    <tbody>`;

                    row = row + `
                    <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                   
                    <td colspan="13"  style='text-align: center;'> <strong>${this.companyProfile.NAME}</strong> </td>
                   
                </tr>

                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    
                    <td  colspan="13" style='text-align: center'> ${this.companyProfile.ADDRESS}</td>
                   
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                   
                    <td colspan="13" style='text-align: center'>Phno : ${this.companyProfile.TELA} ,&nbsp; E-mail: ${this.companyProfile.EMAIL} </td>
                   
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                   
                    <td  colspan="13" style='text-align: center'> GST No : ${this.companyProfile.GSTNO}<br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                   
                </tr>

                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                    <td colspan="13" style='text-align: center'><b>${this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE'} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}</b></td>
                </tr>
                <tr style='border: 1px solid #5a5656; border-bottom:none;'>
                    <td colspan='13'> <strong>Cust.Name : ${(data.BILLTO == null) ? '' : data.BILLTO}</strong> </td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='7'>  <strong>Address : ${(data.BILLTOADD == null) ? '' : data.BILLTOADD}</strong> </td>
                    <td colspan='6' style='text-align:right;'> Invoice: ${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}
                    <br> Date : ${this.transformDate(data.TRNDATE)}
                    <br> ${(this.customerInfo == null || this.customerInfo[0] == null) ? '' : (this.customerInfo[0].REMARKS == null ? '' : this.customerInfo[0].REMARKS)}
                    </td>
                </tr>                
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='13'> <strong>GST No : ${(this.customerInfo == null || this.customerInfo[0] == null) ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</strong></td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-bottom: 1px solid #5a5656;'>
                    <td colspan='13'> <strong>PAN : ${(this.customerInfo == null || this.customerInfo[0] == null) ? '' : (this.customerInfo[0].VAT == null ? '' : this.customerInfo[0].VAT)}</strong></td>
                </tr>
                </table>           
               
                    <table style='border-collapse: collapse;width: 100%;font-size:9px; border-top:1px solid #5a5656;border-left:1px solid #5a5656;border-right:1px solid #5a5656;border-bottom:1px solid #5a5656;'>
                        <thead style=' border-collapse: collapse; border:1px solid #5a5656;'>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                S.NO
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                HSN
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Batch No
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Exp Date
                            </th>
                            <th 
                                style='border-collapse: collapse;border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                PRODUCT</th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                QTY
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                FREE QTY
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                MRP
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                RATE
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Dis %
                                </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                Dis
                                AMT</th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                GST%
                            </th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                GST
                                Amt</th>
                            <th
                                style=' border-collapse: collapse; border:1px solid #5a5656; border-top: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>
                                AMOUNT
                            </th>
                        </thead>
                        <tbody
                        style:'border:1px solid #5a5656;border-collapse: collapse; text-align:center;'>
                            `
                    let freeQuantity: number = 0;
                    for (j; j <= this.numberOfItemInA5; j++) {

                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            freeQuantity = freeQuantity + data.ProdList[this.arrayIndex].FreeQuantity;
                            row = row + `
                        <tr>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;border-left: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].BATCH}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: centre;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].DESCRIPTION}</td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].Quantity}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${data.ProdList[this.arrayIndex].FreeQuantity}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].ALT_ORIGINALTRANRATE)}</td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNTRATE)}
                            </td>
                                <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].DISCOUNT)}
                            </td>                            
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].GSTRATE)}
                            </td>
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].VAT)}</td>
                        
                            <td style=' border-collapse: collapse; border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                ${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>
                        
                        `
                        }
                        this.arrayIndex = this.arrayIndex + 1;


                    }
                    row = row +
                        `<tr style='border: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                          <td colspan = '4'></td>
                        <td colspan = '1' style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; '>
                        <strong>TOTAL:</strong>
                        </td>
                        <td colspan = '1' style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>${data.TotalQuantity}</td>
                        <td colspan = '1'  style='border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px;'>${freeQuantity}</td>
                        <td colspan = '7'></td>
                        </tr>
                        </tbody>
                        <tfoot style:' border: 1px solid #5a5656;text-align:right;'>
                        <td colspan='8'>
                        <table style='border-collapse: collapse;width: 100%;font-size:9px;'>
                        <tr>
                         <td colspan='3'style='text-align: left;'>No of item :  ${data.ProdList.length}</td>
                    
                    <td colspan='5' ></td>
                  
                    </tr>
                    <tr>
                    <td colspan='3' style='text-align:left;'>Amount in Words :   ${data.NETAMOUNTINWORD}</td>
                    <td colspan='5'></td>
                    
                </tr>
               
              
                <tr>
                <td >TAXABLE</td>

                    <td >CGST%</td>
                    <td >CGST AMT</td>
                    <td >SGST %</td>
                    <td >SGST AMT</td>
                    <td >IGST%</td>
                    <td >IGST AMT</td>
                    <td ></td>
                </tr>`;
                    for (let index in this.gstData) {
                        row = row + `
            <tr>
            <td>${this.limitDecimal(this.gstData[index].taxable)}</td>

                <td >${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                <td>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                <td>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                <td>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                <td>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                <td>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                <td ></td>

                </tr>
                `
                    }
                    row = row + `   </table> </td>
                                               
                    <td colspan='6'>
                    <table style='border-collapse: collapse;width: 100%;font-size:9px;'>
                    <tr>
                    <td colspan='3' style='text-align: right;'>Net Amount :
                    </td>
                   
                    <td colspan='3' style='text-align: right;'>${this.limitDecimal(data.FTOTAMNT)} </td>
                    </tr>
                    <tr>
                    <td colspan='3' style='text-align:right;'>
                    Round Off:
                  </td>
                  <td colspan='3' style='text-align:right;'> ${this.limitDecimal(data.ROUNDOFF)}
                  </td>
                  </tr>
                    <tr>
                                                     
                        <td colspan='3' style='text-align:right;'>Dis Amount :  </td>
                        
                        <td colspan='3' style='text-align:right;'>${this.limitDecimal(data.DCAMNT)}</td>
                    </tr>
                    <tr >
                       
                        <td colspan='3' style='text-align:right;'>Tax Amount (Inc):</td>
    
                        <td colspan='3' style='text-align:right;'>${this.limitDecimal(data.FVATAMNT)}</td>
                    </tr>
                                   
                    <tr>
                       
                        <td colspan='3' style='text-align: right;' ><strong>Total:</strong> </td>
                        <td colspan='3' style='text-align: right;'><strong>${this.limitDecimal(data.NETAMNT)}</strong></td>
                    </tr>
                    </table>
                     </td>
                   
              
                <tr  style='border:1px solid #5a5656; text-align:left;' >
                    <td colspan="14"> Declaration: ${isNullOrUndefined(this.companyProfile.Declaration) ? '' : this.companyProfile.Declaration}
                    </td>
                </tr>
                        </tfoot>
                    </table>
                  <table>
              
                `;

                    if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                    else {
                        row = row + `  <tr>
                <td colspan='14'>
                <img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
                ${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
                </tr>`;
                    }
                    row = row + `</tbody>
            </table>
                    `
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }




            }




            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && this.organisation_type != 'distributor' && this.organisation_type != 'superdistributor' &&
                this.organisation_type != "superstockist" &&
                this.organisation_type != "fitindia" &&
                this.organisation_type.toLowerCase() != 'wdb' &&
                this.organisation_type.toLowerCase() != 'ssa' &&
                this.organisation_type.toLowerCase() != 'zcp' &&
                (this.companyProfile.GSTTYPE == null ? "" : this.companyProfile.GSTTYPE).toLowerCase() == "un-register") {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    row = row + `<table style='width: 100%;font-size:9px;
                border-collapse: collapse;border-top: none;border-bottom: none'>
                <tbody>`;

                    row = row + ` <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                <td colspan='6'> <img src="" alt="" style="height: 25px;"></td>
                <td colspan='6' style='text-align: center'> <strong>${this.companyProfile.NAME}</strong> </td>
                <td colspan='6'></td>
            </tr>

            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='6'></td>
                <td colspan='6' style='text-align: center'> ${this.companyProfile.ADDRESS}</td>
                <td colspan='6'></td>
            </tr>
            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='6'> </td>
                <td colspan='6' style='text-align: center'>Phno : ${this.companyProfile.TELA} ,&nbsp; E-mail: ${this.companyProfile.EMAIL} </td>
                <td colspan='6'></td>
            </tr>
          

            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                <td colspan='6'></td>
                <td colspan='6' style='text-align: center'><b>RETAIL INVOICE:${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}</b></td>
                <td colspan='6'></td>
            </tr>
            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                <td colspan='6'>  <strong>Cust.Name :</strong> </td>
                <td colspan='6'>${(data.BILLTO == null) ? '' : data.BILLTO}</td>
                <td colspan='6'> <strong>INVOICE</strong></td>
            </tr>
            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='6'>  <strong>Address :</strong> </td>
                <td colspan='6'>${(data.BILLTOADD == null) ? '' : data.BILLTOADD}</td>
                <td colspan='6'> Invoice: ${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}</td>
            </tr>
            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='6'> </td>
                <td colspan='6' style='text-align: center'></td>
                <td colspan='6'> Date : ${this.transformDate(data.TRNDATE)}</td>
            </tr>
          
            <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-bottom:1px solid #5a5656;'>
                <td colspan='6'></td>
                <td colspan='6' style='text-align: center'></td>
                <td colspan='6'>User Name :${this.userProfile.username}</td>
            </tr>

            <tr>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                S.NO
              </th>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                HSN
              </th>
              <th colspan='4'
                style='border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                ITEM
                NAME</th>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                QTY
              </th>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                RATE
              </th>
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                Dis
                AMT</th>
              <th
           
              <th
                style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                AMOUNT
              </th>
            </tr>
        `
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            row = row + `
                                            <tr>
                                                <td style='  border-right: 1px solid #5a5656;border-left: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}
                                                </td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE}</td>
                                                <td colspan='4' style='  border-right: 1px solid #5a5656;text-align: justify;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].DESCRIPTION}</td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].RealQty}
                                                </td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].DISCOUNT)}
                                                </td>
                                              
                                                <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                                            </tr>
                                            `
                        }
                        this.arrayIndex = this.arrayIndex + 1;

                    }
                    row = row + `

                <tr>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
                <td colspan='4'
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    <strong>TOTAL</strong> </td>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    ${data.TotalQuantity}</td>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
               
                <td style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>

                </td>
                <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
            </tr>
            <tr style=' border-top: 1px solid  #5a5656;border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td></td>
                <td></td>
                <td colspan='4'>No of item :${data.ProdList.length} <br><hr></td>
                <td></td>
               
                <td colspan='2'>Net Amount :
                <br>
                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                Round Off:
                </td>
                <td>${this.limitDecimal(data.FTOTAMNT)} <br>
            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                    ${this.limitDecimal(data.ROUNDOFF)}
                </td>
            </tr>
            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td colspan='2'>Amount in Words :</td>
                <td colspan='5'>${data.NETAMOUNTINWORD}</td>
                <td colspan='2'>Dis Amount</td>
                <td>${this.limitDecimal(data.DCAMNT)}</td>
            </tr>
           
           
            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               
               
                <td></td>
                <td></td>
                <td colspan='2'>Total:</td>
                <td> ${this.limitDecimal(data.NETAMNT)}</td>
            </tr>
            <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                
               
                <td>&nbsp;</td>
            </tr>
            <tr style='border-left: 1px solid #5a5656;border: 1px solid #5a5656;'>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              
               
                <td colspan="5">* Thank You *</td>
                <td>&nbsp;</td>
                <td>Signature By</td>
                <td>&nbsp;</td>
            </tr>`;

                    if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                    else {
                        row = row + `  <tr>
            <td colspan='10'>
            <img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
            ${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
            </tr>`;
                    }
                    row = row + `</tbody>
        </table>
                `
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                        <div class="pagebreak"></div>
                        `
                    }
                }

                if (!this.isPickingList && this.customerInfo.length && this.customerInfo[0].GEO && this.customerInfo[0].GEO.toLowerCase() == "fitindia") {
                    row = row + `
                        <div style="width:1000px; margin: auto;">
                        <table style="border:1px solid #000;width: 100%;" cellpadding="5" cellspacing="0">
                        <tr>
                        <td colspan="3"><span style="font-size: 48px; color: #5643CD; font-weight:bold;">PACKING SLIP</span></td>
                        </tr>
                        <tr>
                        <td colspan="3"><table style="width: 100%;" cellpadding="5" cellspacing="0">
                            <tr style="background-color:#65B7E5">
                            <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">BILL NO.</span></td>
                            <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">DATE</span></td>
                            <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">ORDER NUMBER</span></td>
                            <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">REMARKS</span></td>
                            </tr>
                            <tr style="background-color:#B6C8C9">
                            <td style="border:1px solid #000; height: 30px; ">${data.VCHRNO}</td>
                            <td style="border:1px solid #000; height: 30px; ">${this.transformDate(data.TRNDATE)}</td>
                            <td style="border:1px solid #000; height: 30px;">${data.REFORDBILL}</td>
                            <td style="border:1px solid #000; height: 30px;">${data.REMARKS}</td>
                            </tr>
                            </table></td>
                        </tr>
                        <tr>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">S.NO.</span></td>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">DESCRIPTION</span></td>
                        <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">QUANTITY</span></td>
                        </tr>`
                    for (let i in data.ProdList) {
                        row = row + `<tr>
                                    <td style="border:1px solid #000; height: 30px;">${this._transactionService.nullToZeroConverter(i) + 1}</td>
                                    <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].DESCRIPTION}</td>
                                    <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].RealQty}</td>
                                    </tr>`
                    }
                    row = row + `</table></div>`
                }


            }



            if ((this.invoiceType == VoucherTypeEnum.TaxInvoice) && (this.organisation_type == 'distributor')) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPageONLYCLDTotal = 0, subPageONLYPCSTotal = 0, subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table id="invoiceTable" style='width: 100%;font-size:10px;
                border-collapse: collapse;border:1px solid black'>
                <tbody>`

                    row = row + `<tr>
                    <td colspan='6'>
                        <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                    </td>
                    <td colspan='16' style='text-align:center;max-width:180px;'>
                        <b>${this.companyProfile.NAME}</b><br>
                        <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                        <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                        <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                        ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                    </td>
                    <td colspan='2' style='text-align: left;'>&nbsp;</td>
                    <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='10'>
                                CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}<br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                <td colspan='10' style='text-align: center;'></td>
                <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
            </tr>
            <tr style='border-bottom: 1px solid black'>
                <td colspan='8'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
                <td colspan='12' style='text-align: center;'><b>${this.invoiceType == VoucherTypeEnum.TaxInvoice ? (this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE') : "Performa Invoice"} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}<b></td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                <td colspan='4' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
            </tr>
            <tr style='border-top: 1px solid black;'>
                <td colspan='10' style='border-right: 1px solid black;'>Buyer:<b>${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</b></td>
                <td colspan='10' style='border-right: 1px solid black;'>Ship To:<b>${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</b></td>
                <td colspan='8' style='border-right: 1px solid black;'>Invoice No./Date :${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
            </tr>

            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                <td colspan='8' style='border-right: 1px solid black;'>
                    Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Truck No. :${data.TransporterEway ? (data.TransporterEway.VEHICLENO == null ? '' : data.TransporterEway.VEHICLENO) : ''}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Driver No. :${data.TransporterEway ? (data.TransporterEway.DRIVERNO == null ? '' : data.TransporterEway.DRIVERNO) : ''}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename}`)}</td>
                <td colspan='10' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME}`}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].CITY == null ? 'Un-Register' : this.customerInfo[0].CITY)}
                </td>
            </tr>
            <tr>
                <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                <td colspan='10' style='border-right: 1px solid black;'>Beat:${this.customerInfo[0] == null ? '' : (this.customerInfo[0].BEATNAME == null ? '' : `${this.customerInfo[0].BEATNAME}`)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N
                </td>
            </tr>`

                    if (this.organisation_type == 'distributor') {
                        row = row + `
                <tr>
                <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                <td colspan='10' style='border-right: 1px solid black;'>DSM NAME:${data.AdditionalObj == null ? '' : (data.AdditionalObj.DSMNAME == null ? '' : data.AdditionalObj.DSMNAME)}</td>
                <td colspan='8' style='border-right: 1px solid black;'>
                </td>
            </tr>`
                    }

                    row = row + `
            <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;' ><b>S.No.</b></td>
                <td style='border-right: 1px solid black;' colspan='7'><b>Material Description</b></td>
                <td style='border-right: 1px solid black;' ><b>Item Code</b></td>
                <td style='border-right: 1px solid black;' ><b>HSN/SAC</b></td>
                <td style='border-right: 1px solid black;' ><b>MRP</b></td>
        <!--    <td style='border-right: 1px solid black;' ><b>Batch No</b></td>
                <td style='border-right: 1px solid black;' ><b>Mfg</b></td>
                <td style='border-right: 1px solid black;' ><b>Exp</b></td> -->
                <td style='border-right: 1px solid black;' ><b>CLD</b></td>
                <td style='border-right: 1px solid black;' ><b>Pcs</b></td>
        <!--        <td style='border-right: 1px solid black;' ><b>UOM</b></td> -->
                <td style='border-right: 1px solid black;' ><b>Rate</b></td>
        <!--        <td style='border-right: 1px solid black;' ><b>PDis %</b></td> -->
                <td style='border-right: 1px solid black;' ><b>P Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>S Dis%</b></td>
                <td style='border-right: 1px solid black;' ><b>S Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>Othr Dis</b></td>
                <td style='border-right: 1px solid black;' ><b>Taxable</b></td>
                <td style='border-right: 1px solid black;' ><b>IGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>IGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>CGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>CGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>SGST%</b></td>
                <td style='border-right: 1px solid black;' ><b>SGST Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>CESS%</b></td>
                <td style='border-right: 1px solid black;' ><b>CESS Amt</b></td>
                <td style='border-right: 1px solid black;' ><b>Amount</b></td>
            </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPageONLYCLDTotal = subPageONLYCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].CLD);
                            subPageONLYPCSTotal = subPageONLYPCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].PCS);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                        <tr style='border-top:1px solid black;'>
                        <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                        <td style='border-right: 1px solid black;max-width:300px;' colspan='7'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                    <!--    <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                        <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                        <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td> -->
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].CLD)}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].PCS}</td>
                    <!--     <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td> -->
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                    <!--    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].PrimaryDiscountPercent)}</td> -->
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BasePrimaryDiscount)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].SecondaryDiscountPercent)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BaseSecondaryDiscount)}</td>
                        <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>


                        `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                        <td style='border-right: 1px solid black;'></td>
                        <td style='border-right: 1px solid black;text-align:right'></td>
                        <td style='border-right: 1px solid black;'></td>
                        <td style='border-right: 1px solid black;text-align:right'></td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `
                            }

                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;' colspan='7'>Page Sub-Total</td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
              <!--  <td style='border-right: 1px solid black;'><b></b></td>
                <td style='border-right: 1px solid black;'><b></b></td>
                <td style='border-right: 1px solid black;'></td> -->
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageONLYCLDTotal)}</b></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageONLYPCSTotal)}</b></td>
            <!-- <td style='border-right: 1px solid black;'></td> -->
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right'></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePDisTotal)}</b></td>
            <!--    <td style='border-right: 1px solid black;text-align:right'></td> -->
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageSDisTotal)}</b></td>
                <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                <td style='border-right: 1px solid black;' ></td>
                <td style='border-right: 1px solid black;text-align:right' ><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                <td style='border-right: 1px solid black;text-align:right'></td>
                <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(subPageCESSTotal)}</td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
             </tr>
            `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                            <tr style='border: 1px solid black;'>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;' colspan='7'>Grand Total</td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                   <!--            <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'></td> -->
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.onlycldtotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.onlypcstotal)}</b></td>
                                <!-- <td style='border-right: 1px solid black;'></td> -->
                                <td style='border-right: 1px solid black;'></td>
                    <!--            <td style='border-right: 1px solid black;text-align:right'></td> -->
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pdistotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.sdistotal)}</b></td>
                                <td style='border-right: 1px solid black;'><b>${this.limitDecimal(this.grandTotal.INDDISCOUNTTOTAL)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;' ></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'></td>
                                <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(this.grandTotal.TOTALCESS)}</td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                            </tr>
                        `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                    <tr>
                        <td colspan='2'>IGST%</td>
                        <td colspan='2'>IGST AMT</td>
                        <td colspan='2'>CGST%</td>
                        <td colspan='2'>CGST AMT</td>
                        <td colspan='2'>SGST %</td>
                        <td colspan='2'>SGST AMT</td>
                        <td colspan='2'>TAXABLE</td>
                        <td colspan='14'>&nbsp;</td>
                    </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan="18"></td>
                            <td colspan='4'>
                                <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                            </td>
                            <td colspan='5'>
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}

                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td  style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                            <br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}

                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                    `
                        } else {
                            row = row + `
                        <tr>
                            <td colspan="18"></td>
                            <td rowspan="6" colspan='4'>
                                <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                            </td>
                            <td rowspan="6" colspan='5'>
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td rowspan="6"  style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                            <br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                    `
                        }


                        if (this.companyProfile.GSTTYPE != 'Composite') {

                            for (let index in this.gstData) {
                                row = row + `
                    <tr>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                        <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                        <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                        <td colspan='14' style='border-right:1px solid black;'></td>
                    <tr>
                        `
                            }
                        }
                        row = row + `
                    <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="28" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan='26'>Remarks: ${data.REMARKS}</td>
                    <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='24'>GST Amount : ${data.GSTINWORD}</td>
                    <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                </tr>
                <tr>
                    <td colspan='24'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                    <td colspan='4' style='border-right:1px solid black;'><br></td>
                </tr>
                <tr style='border-top: 1px solid black;border-bottom: 1px solid black'>
                    <td colspan='28' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${isNullOrUndefined(this.companyProfile.Declaration) ? '' : this.companyProfile.Declaration}

                    </td>
                </tr>
                <tr>

</tr>`


                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='28'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }
                    }

                    row = row + ` </tbody>
        </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                        <div class="pagebreak"></div>
                        `
                    }
                }

            }






            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && (this.organisation_type == 'superdistributor' ||
                this.organisation_type == "superstockist" ||
                this.organisation_type.toLowerCase() == 'wdb' ||
                this.organisation_type.toLowerCase() == 'ssa' ||
                this.organisation_type.toLowerCase() == 'zcp')) {

                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table style='width: 100%;font-size: 8.5px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>`;




                    row = row + `<tr>
                        <td colspan='10'>
                            <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                        </td>
                        <td colspan='10' style='text-align:center;max-width:180px;'>
                            <b>${this.companyProfile.NAME}</b><br>
                            <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                            <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                            <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                            ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                        </td>
                        <td colspan='2' style='text-align: left;'>&nbsp;</td>
                        <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='10'>
                                    CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                    GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}<br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                    <td colspan='8' style='text-align: center;'></td>
                    <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                <td colspan='10'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
                <td colspan='10' style='text-align: center;'><b>${this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE'} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}<b></td>
                    <td colspan='4' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                    <td colspan='2' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='10' style='border-right: 1px solid black;'>Buyer:${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Ship To:${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Invoice No./Date :${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
                </tr>

                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                    <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                        Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                    </td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Truck No. :${data.TransporterEway ? (data.TransporterEway.VEHICLENO == null ? '' : data.TransporterEway.VEHICLENO) : ''}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Driver No. :${data.TransporterEway ? (data.TransporterEway.DRIVERNO == null ? '' : data.TransporterEway.DRIVERNO) : ''}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename}`)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME}`}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :
                    </td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Beat:${this.customerInfo[0] == null ? '' : (this.customerInfo[0].BEATNAME == null ? '' : `${this.customerInfo[0].BEATNAME}`)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N
                    </td>
                </tr>`

                    if (this.organisation_type == 'distributor') {
                        row = row + `
                    <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                    <td colspan='8' style='border-right: 1px solid black;'>DSM NAME:${data.AdditionalObj == null ? '' : (data.AdditionalObj.DSMNAME == null ? '' : data.AdditionalObj.DSMNAME)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                    </td>
                </tr>`
                    }

                    row = row + `
                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;max-width:200px;' colspan='2'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>P Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Othr Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CESS%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CESS Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                </tr>`

                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                            <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                            <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BasePrimaryDiscount)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BaseSecondaryDiscount)}</td>
                            <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>

                             `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                            </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            }


                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                    <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;' colspan='2'>Page Sub-Total</td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePDisTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageSDisTotal)}</b></td>
                    <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageCESSTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                 </tr>
                `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;' colspan='2'>Grand Total</td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pdistotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.sdistotal)}</b></td>
                                    <td style='border-right: 1px solid black;'><b>${this.limitDecimal(this.grandTotal.INDDISCOUNTTOTAL)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTALCESS)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                                </tr>
                            `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='12'>&nbsp;</td>
                        </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td colspan='4'>
                                    <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                </td>
                                <td colspan='5'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        } else {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td rowspan="6" colspan='4'>
                                    <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                </td>
                                <td rowspan="6" colspan='5'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td rowspan="6" colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        }

                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            for (let index in this.gstData) {
                                row = row + `
                        <tr>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                            <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                            <td colspan='12' style='border-right:1px solid black;'></td>
                        <tr>
                            `
                            }
                        }
                        row = row + `
                        <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='24'>Remarks: ${data.REMARKS}</td>
                        <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                    </tr>
                    <tr style='border-top: 1px solid black;'>
                        <td colspan='22'>GST Amount : ${data.GSTINWORD}</td>
                        <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                    </tr>
                    <tr>
                        <td colspan='22'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                        <td colspan='4' style='border-right:1px solid black;'><br></td>
                    </tr>
                    <tr style='border-top: 1px solid black'>
                        <td colspan='26' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}

                        </td>
                    </tr>
                    <tr>

</tr>`

                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='26'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }

                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }

            }
            if (this.invoiceType == VoucherTypeEnum.StockIssue) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table style='width: 100%;font-size: 9px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>
                    <tr>
                        <td colspan='8'>
                            <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                        </td>
                        <td colspan='10' style='text-align:center;max-width:180px;'>
                            <b>${this.companyProfile.NAME}</b><br>
                            <b>${data.BILLTO == null ? '' : data.BILLTO + ','}${data.BILLTOADD == null ? '' : data.BILLTOADD}</b><br>
                            <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                            ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                        </td>
                        <td colspan='2' style='text-align: left;'>&nbsp;</td>
                        <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'>
                                    CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                    GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
                    <td colspan='8' style='text-align: center;'></td>
                    <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'> </td>
                    <td colspan='8' style='text-align: center;'><b>Delivery Chalan <b></td>
                    <td colspan='6' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                    <td colspan='2' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='16' style='border-right: 1px solid black;'>Ship To:${data.warehouseDetail.NAME == null ? '' : data.warehouseDetail.NAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Chalan No./Date :${data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
                </tr>

                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>${(data.warehouseDetail.ADDRESS == null ? '' : data.warehouseDetail.ADDRESS)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>Pincode :${(data.warehouseDetail.POSTALCODE == null ? '' : data.warehouseDetail.POSTALCODE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                        Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                    </td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>Mobile :  ${(data.warehouseDetail.MOBILE == null ? '' : data.warehouseDetail.MOBILE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Truck No. :</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>GSTIN :${(data.warehouseDetail.GSTNO == null ? '' : data.warehouseDetail.GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Driver No. :</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>PAN No : ${(data.warehouseDetail.VATNO == null ? '' : data.warehouseDetail.VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>State Code : ${data.warehouseDetail.STATE == null ? '' : `${data.warehouseDetail.STATE},${data.warehouseDetail.STATENAME}`}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Place of Supply : <br>Dispatch Point:
                    </td>
                </tr>

                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;max-width:200px;' colspan='5'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                            <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                            <td style='border-right: 1px solid black;' colspan='5'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>


                             `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            }


                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                    <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;' colspan='5'>Page Sub-Total</td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                 </tr>
                `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;' colspan='5'>Grand Total</td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                                </tr>
                            `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='10'>&nbsp;</td>
                        </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td colspan='4'>
                                </td>
                                <td colspan='3'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                                `
                        } else {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td rowspan="6" colspan='4'>
                                </td>
                                <td rowspan="6" colspan='3'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td rowspan="6" colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>`
                        }

                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            for (let index in this.gstData) {
                                row = row + `
                        <tr>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                            <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                            <td colspan='10' style='border-right:1px solid black;'></td>
                        <tr>
                            `
                            }
                        }
                        row = row + `
                        <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='22'>Remarks: ${data.REMARKS}</td>
                        <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                    </tr>
                    <tr style='border-top: 1px solid black;'>
                        <td colspan='20'>GST Amount : ${data.GSTINWORD}</td>
                        <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                    </tr>
                    <tr>
                        <td colspan='20'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                        <td colspan='4' style='border-right:1px solid black;'><br></td>
                    </tr>
                    <tr style='border-top: 1px solid black'>
                        <td colspan='24' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}

                        </td>
                    </tr>
                    <tr>

</tr>`
                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }


            }
        }

        if (this.printMode == 13 || this.printMode == 14) {
            this.organisation_type = this.getOrgtypeBasedOnPartyType(data.PARTY_ORG_TYPE);
            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && this.organisation_type != 'distributor' && this.organisation_type != 'superdistributor' &&
                this.organisation_type != "superstockist" &&
                this.organisation_type != "fitindia" &&
                this.organisation_type.toLowerCase() != 'wdb' &&
                this.organisation_type.toLowerCase() != 'ssa' &&
                this.organisation_type.toLowerCase() != 'zcp') {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    row = row + `<table style='width: 100%;font-size:9px;
                    border-collapse: collapse;border-top: none;border-bottom: none'>
                    <tbody>`;

                    row = row + ` <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
              <!-- <td colspan='4'> <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;"></td> -->
                   <td colspan='4'></td>
                   <td colspan='6' style='text-align: center'> <strong>${this.companyProfile.NAME}</strong> </td>
                   <td colspan='4'></td>
                </tr>

                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='4'></td>
                    <td colspan='6' style='text-align: center'> ${this.companyProfile.ADDRESS}</td>
                    <td colspan='4'></td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='4'> </td>
                    <td colspan='6' style='text-align: center'>Phno : ${this.companyProfile.TELA} ,&nbsp; E-mail: ${this.companyProfile.EMAIL} </td>
                    <td colspan='4'></td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='4'> </td>
                    <td colspan='6' style='text-align: center'> GST No : ${this.companyProfile.GSTNO}<br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                    <td colspan='4'></td>
                </tr>

                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                    <td colspan='4'></td>
                    <td colspan='6' style='text-align: center'><b>${this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE'} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}</b></td>
                    <td colspan='4'></td>
                </tr>
                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-top: 1px solid #5a5656'>
                    <td colspan='4'>  <strong>Cust.Name :</strong> </td>
                    <td colspan='6'>${(data.BILLTO == null) ? '' : data.BILLTO}</td>
                    <td colspan='4'> <strong>INVOICE</strong></td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='4'>  <strong>Address :</strong> </td>
                    <td colspan='6'>${(data.BILLTOADD == null) ? '' : data.BILLTOADD}</td>
                    <td colspan='4'> Invoice: ${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}</td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='4'> </td>
                    <td colspan='6' style='text-align: center'></td>
                    <td colspan='4'> Date : ${this.transformDate(data.TRNDATE)}</td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='4'> <strong>GST No :</strong></td>
                    <td colspan='6' > ${(this.customerInfo == null || this.customerInfo[0] == null) ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='4'></td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='4'> <strong>PAN :</strong></td>
                    <td colspan='6' > ${(this.customerInfo == null || this.customerInfo[0] == null) ? '' : (this.customerInfo[0].PAN == null ? '' : this.customerInfo[0].PAN)}</td>
                    <td colspan='4'></td>
                </tr>
                <tr  style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;border-bottom:1px solid #5a5656;'>
                    <td colspan='4'></td>
                    <td colspan='6' style='text-align: center'></td>
                    <td colspan='4'>User Name :${this.userProfile.username}</td>
                </tr>

                <tr>
                  <th
                    style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    S.NO
                  </th>
                  <th
                    style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    HSN
                  </th>
                  <th colspan='3'
                    style='border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    ITEM
                    NAME</th>
                  <th
                    style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    QTY
                  </th>
                  <th
                  style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                  FREE QTY
                </th>
                  <th
                    style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    RATE
                  </th>
                  <th
                    style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    Dis
                    AMT</th>
                  <th
                    style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    GST%
                  </th>
                  <th
                    style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    GST
                    Amt</th>
                  <th
                  
                  <th
                    style='  border:1px solid #5a5656; border-top: none;text-align: center;padding-left: 5px;padding-right: 5px;'>
                    AMOUNT
                  </th>
                </tr>
            `
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            row = row + `
                                                <tr>
                                                    <td style='  border-right: 1px solid #5a5656;border-left: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                        ${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}
                                                    </td>
                                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                        ${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE}</td>
                                                    <td colspan='3' style='  border-right: 1px solid #5a5656;text-align: justify;padding: 2.5px 5px;'>
                                                        ${data.ProdList[this.arrayIndex].DESCRIPTION}</td>
                                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                        ${data.ProdList[this.arrayIndex].RealQty}
                                                    </td>
                                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                    ${data.ProdList[this.arrayIndex].FreeQuantity}
                                                   </td>
                                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                        ${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                        ${this.limitDecimal(data.ProdList[this.arrayIndex].DISCOUNT)}
                                                    </td>
                                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                        ${data.ProdList[this.arrayIndex].GSTRATE}
                                                    </td>
                                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                        ${this.limitDecimal(data.ProdList[this.arrayIndex].VAT)}</td>
                                                    
                                                    <td style='  border-right: 1px solid #5a5656;text-align: center;padding: 2.5px 5px;'>
                                                        ${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                                                </tr>
                                                `
                        }
                        this.arrayIndex = this.arrayIndex + 1;

                    }
                    row = row + `

                    <tr>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    </td>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    </td>
                    <td colspan='3'
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                        <strong>TOTAL</strong> </td>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                        ${data.TotalQuantity}</td>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    </td>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    </td>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    </td>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    </td>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    </td>
                    <td style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>

                    </td>
                    <td
                        style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                    </td>
                    <td
                    style='  border: 1px solid #5a5656;text-align: center;padding-left: 5px;padding-right: 5px; border-bottom: none;'>
                </td>
                </tr>
                <tr style=' border-top: 1px solid  #5a5656;border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td></td>
                    <td></td>
                    <td colspan='4'>No of item :${data.ProdList.length} <br><hr></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan='2'>Net Amount :
                    <br>
                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                    Round Off:
                    </td>
                    <td>${this.limitDecimal(data.FTOTAMNT)} <br>
                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                        ${this.limitDecimal(data.ROUNDOFF)}
                    </td>
                </tr>
                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td colspan='2'>Amount in Words :</td>
                    <td colspan='9'>${data.NETAMOUNTINWORD}</td>
                    <td colspan='2'>Dis Amount</td>
                    <td>${this.limitDecimal(data.DCAMNT)}</td>
                </tr>
                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan='2'>Tax Amount (Inc):</td>
                    <td>${this.limitDecimal(data.FVATAMNT)}</td>
                </tr>
                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan='2'>Tot Cess:</td>
                    <td>${this.limitDecimal(this.grandTotal.TOTALCESS)}</td>
                </tr>
                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan='2'>Total:</td>
                    <td> ${this.limitDecimal(data.NETAMNT)}</td>
                </tr>
                <tr style='border-left: 1px solid #5a5656;border-right: 1px solid #5a5656;'>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr style='border-left: 1px solid #5a5656;border: 1px solid #5a5656;'>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td colspan="5">* Thank You *</td>
                    <td>&nbsp;</td>
                    <td>Signature By</td>
                    <td>&nbsp;</td>
                </tr>`;

                    if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                    else {
                        row = row + `  <tr>
                <td colspan='14'>
                <img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
                ${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
                </tr>`;
                    }
                    row = row + `</tbody>
            </table>
                    `
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }

                if (!this.isPickingList && this.customerInfo.length && this.customerInfo[0].GEO && this.customerInfo[0].GEO.toLowerCase() == "fitindia") {
                    row = row + `
                            <div style="width:1000px; margin: auto;">
                            <table style="border:1px solid #000;width: 100%;" cellpadding="5" cellspacing="0">
                            <tr>
                            <td colspan="3"><span style="font-size: 48px; color: #5643CD; font-weight:bold;">PACKING SLIP</span></td>
                            </tr>
                            <tr>
                            <td colspan="3"><table style="width: 100%;" cellpadding="5" cellspacing="0">
                                <tr style="background-color:#65B7E5">
                                <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">BILL NO.</span></td>
                                <td style="border:1px solid #000;width: 20%;"><span style="font-size:20px; font-weight: bold; color: #fff;">DATE</span></td>
                                <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">ORDER NUMBER</span></td>
                                <td style="border:1px solid #000;width: 30%;"><span style="font-size:20px; font-weight: bold; color: #fff;">REMARKS</span></td>
                                </tr>
                                <tr style="background-color:#B6C8C9">
                                <td style="border:1px solid #000; height: 30px; ">${data.VCHRNO}</td>
                                <td style="border:1px solid #000; height: 30px; ">${this.transformDate(data.TRNDATE)}</td>
                                <td style="border:1px solid #000; height: 30px;">${data.REFORDBILL}</td>
                                <td style="border:1px solid #000; height: 30px;">${data.REMARKS}</td>
                                </tr>
                                </table></td>
                            </tr>
                            <tr>
                            <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">S.NO.</span></td>
                            <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">DESCRIPTION</span></td>
                            <td style="width: 33%;"><span style="font-size:24px; font-weight: bold;">QUANTITY</span></td>
                            </tr>`
                    for (let i in data.ProdList) {
                        row = row + `<tr>
                                        <td style="border:1px solid #000; height: 30px;">${this._transactionService.nullToZeroConverter(i) + 1}</td>
                                        <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].DESCRIPTION}</td>
                                        <td style="border:1px solid #000; height: 30px;">${data.ProdList[i].RealQty}</td>
                                        </tr>`
                    }
                    row = row + `</table></div>`
                }


            }

            if ((this.invoiceType == VoucherTypeEnum.TaxInvoice) && (this.organisation_type == 'distributor')) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPageONLYCLDTotal = 0, subPageONLYPCSTotal = 0, subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table id="invoiceTable" style='width: 100%;font-size:10px;
                border-collapse: collapse;border:1px solid black'>
                <tbody>`

                    row = row + ` 
            <tr style='border-top: 1px solid black;'>
                <td colspan='4' style='border-right: 1px solid black;'>
                ${this.setting.APPIMAGEPATH}<br>
                <b>${this.companyProfile.NAME}</b><br>
                        <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                        <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                        <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                        ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}<br>
                        CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                        GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}<br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}

               </td>
                <td colspan='5' style='border-right: 1px solid black;'>
                Ship To:<b>${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</b><br>
                ${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}<br>
                Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}<br>
                Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}<br>
                GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? 'Un-Register' : this.customerInfo[0].GSTNO)}<br>
                PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}<br>
                State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME}`}<br>
                Beat:${this.customerInfo[0] == null ? '' : (this.customerInfo[0].BEATNAME == null ? '' : `${this.customerInfo[0].BEATNAME}`)}<br>
                </td>
                <td colspan='4' style='border-right: 1px solid black;'>
                Invoice No./Date :${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}/${this.transformDate(data.TRNDATE)}<br>
                Place of Supply :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].CITY == null ? 'Un-Register' : this.customerInfo[0].CITY)}<br>
                </td>
            </tr>`

                    if (this.organisation_type == 'distributor') {
                        row = row + `
                <tr>
                <td colspan='4' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                <td colspan='5' style='border-right: 1px solid black;'>DSM NAME:${data.AdditionalObj == null ? '' : (data.AdditionalObj.DSMNAME == null ? '' : data.AdditionalObj.DSMNAME)}</td>
                <td colspan='4' style='border-right: 1px solid black;'>
                </td>
            </tr>`
                    }

                    row = row + `
            <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;' ><b>S.No.</b></td>
                <td style='border-right: 1px solid black;' ><b>Material Description</b></td>
                <td style='border-right: 1px solid black;' ><b>Item Code</b></td>
                <td style='border-right: 1px solid black;' ><b>HSN/SAC</b></td>
                <td style='border-right: 1px solid black;' ><b>MRP</b></td>
                <td style='border-right: 1px solid black;' ><b>Batch No</b></td>
                <td style='border-right: 1px solid black;' ><b>Mfg</b></td>
                <td style='border-right: 1px solid black;' ><b>Exp</b></td>
                <td style='border-right: 1px solid black;' ><b>CLD</b></td>
                <td style='border-right: 1px solid black;' ><b>Pcs</b></td>
        <!--        <td style='border-right: 1px solid black;' ><b>UOM</b></td> -->
                <td style='border-right: 1px solid black;' ><b>Rate</b></td>
        <!--        <td style='border-right: 1px solid black;' ><b>PDis %</b></td>-->
                <td style='border-right: 1px solid black;' ><b>Taxable</b></td>            
                <td style='border-right: 1px solid black;' ><b>Amount</b></td>
            </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPageONLYCLDTotal = subPageONLYCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].CLD);
                            subPageONLYPCSTotal = subPageONLYPCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].PCS);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                        <tr style='border-top:1px solid black;'>
                        <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                        <td style='border-right: 1px solid black;max-width:300px;'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                        <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                        <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td> 
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].CLD)}</td>
                        <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].PCS}</td>
                    <!--     <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td> -->
                        <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                    <!--    <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].PrimaryDiscountPercent)}</td> -->                        
                        <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>


                        `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {
                                row = row + `<td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                        </tr>  `
                            }

                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                <tr style='border: 1px solid black;'>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'>Page Sub-Total</td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;'><b></b></td>
                <td style='border-right: 1px solid black;'><b></b></td>
                <td style='border-right: 1px solid black;'></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageONLYCLDTotal)}</b></td>
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageONLYPCSTotal)}</b></td>
            <!-- <td style='border-right: 1px solid black;'></td> -->
                <td style='border-right: 1px solid black;'></td>
            <!--    <td style='border-right: 1px solid black;text-align:right'></td> -->
                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                <td style='border-right: 1px solid black;text-align:right' ><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
             </tr>
            `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                            <tr style='border: 1px solid black;'>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'>Grand Total</td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'><b></b></td>
                                <td style='border-right: 1px solid black;'></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.onlycldtotal)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.onlypcstotal)}</b></td>
                                <!-- <td style='border-right: 1px solid black;'></td> -->
                                <td style='border-right: 1px solid black;'></td>
                    <!--            <td style='border-right: 1px solid black;text-align:right'></td> -->
                                <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                <td style='border-right: 1px solid black;text-align:right' ><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                            </tr>
                        `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                    <tr>
                        <td colspan='1'>IGST%</td>
                        <td colspan='1'>IGST AMT</td>
                        <td colspan='1'>CGST%</td>
                        <td colspan='1'>CGST AMT</td>
                        <td colspan='1'>SGST %</td>
                        <td colspan='1'>SGST AMT</td>
                        <td colspan='2'>TAXABLE</td>
                        <td colspan='5' style='border-right: 1px solid black;text-align:right'>&nbsp;</td>
                    </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan="4"></td>
                            <td colspan='3'>
                                <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                            </td>
                            <td colspan='3'>
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}

                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td colspan="3" style='text-align: right;border-right:1px solid black;' >
                            <b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}<br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                    `
                        } else {
                            row = row + `
                        <tr>
                            <td colspan="4"></td>
                            <td colspan="3">
                                <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                            </td>
                            <td colspan="3">
                                <b>
                                Bill Disc:
                                <br>
                                Total Dis Amt:
                                <br>
                                Gross Amt:
                                <br>
                                Tax Amt:
                                <br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                Round Off:
                                <br>
                                Amount:
                                </b>
                            </td>
                            <td colspan="3"  style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                            <br>
                            ${this.limitDecimal(data.DCAMNT)}<br>
                            ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                            ${this.limitDecimal(data.VATAMNT)}<br>
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                            ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                            ${this.limitDecimal(data.ROUNDOFF)}<br>
                            ${this.limitDecimal(data.NETAMNT)}
                            </b></td>
                        </tr>
                    `
                        }


                        if (this.companyProfile.GSTTYPE != 'Composite') {

                            for (let index in this.gstData) {
                                row = row + `
                    <tr>
                        <td  colspan='1'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                        <td  colspan='1'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                        <td  colspan='1'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                        <td  colspan='1'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                        <td  colspan='1'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                        <td  colspan='1'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                        <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                        <td colspan='5' style='border-right:1px solid black;'></td>
                    <tr>
                        `
                            }
                        }
                        row = row + `
                    <tr>
                    <td colspan="13" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="13" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="13" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan='10'>Remarks: ${data.REMARKS}</td>
                    <td colspan='3' style='border-right:1px solid black;'>E&OE</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='10'>GST Amount : ${data.GSTINWORD}</td>
                    <td colspan='3' style='text-align: right;'>${this.companyProfile.NAME}</td>
                </tr>
                <tr>
                    <td colspan='10'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                    <td colspan='3' style='border-right:1px solid black;'><br></td>
                </tr>
                <tr style='border-top: 1px solid black;border-bottom: 1px solid black'>
                    <td colspan='13' style='border-right:1px solid black;'>
                    Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${isNullOrUndefined(this.companyProfile.Declaration) ? '' : this.companyProfile.Declaration}
                    </td>
                </tr>
                <tr>
                </tr>`

                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='13'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }
                    }

                    row = row + ` </tbody>
        </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                        <div class="pagebreak"></div>
                        `
                    }
                }

            }






            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && (this.organisation_type == 'superdistributor' ||
                this.organisation_type == "superstockist" ||
                this.organisation_type.toLowerCase() == 'wdb' ||
                this.organisation_type.toLowerCase() == 'ssa' ||
                this.organisation_type.toLowerCase() == 'zcp')) {

                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCESSTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table style='width: 100%;font-size: 8.5px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>`;




                    row = row + `<tr>
                        <td colspan='10'>
                            <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                        </td>
                        <td colspan='10' style='text-align:center;max-width:180px;'>
                            <b>${this.companyProfile.NAME}</b><br>
                            <b>${this.companyProfile.ADDRESS == null ? '' : this.companyProfile.ADDRESS + ','}${this.companyProfile.CITY == null ? '' : this.companyProfile.CITY}</b><br>
                            <b>${this.companyProfile.STATENAME == null ? '' : `${this.companyProfile.STATENAME}`}${this.companyProfile.PINCODE == null ? '' : `, ${this.companyProfile.PINCODE}`}${this.companyProfile.EMAIL == null ? '' : `, ${this.companyProfile.EMAIL}`} </b><br>
                            <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                            ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                        </td>
                        <td colspan='2' style='text-align: left;'>&nbsp;</td>
                        <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='10'>
                                    CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                    GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}<br> FSSAI:${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                    <td colspan='8' style='text-align: center;'></td>
                    <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                <td colspan='10'>${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : 'EWAY NO:')} ${data.TransporterEway == null ? '' : (data.TransporterEway.EWAYNO == null ? '' : data.TransporterEway.EWAYNO)} </td>
                <td colspan='10' style='text-align: center;'><b>${this.companyProfile.GSTTYPE == "Composite" ? 'composition taxable person, not eligible to collect tax on supplies <br/> Bill Of Supply' : 'TAX INVOICE'} :${(this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO)}<b></td>
                    <td colspan='4' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                    <td colspan='2' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='10' style='border-right: 1px solid black;'>Buyer:${this.customerInfo[0] == null ? '' : this.customerInfo[0].ACNAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Ship To:${data.shipToDetail.ACNAME == null ? '' : data.shipToDetail.ACNAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Invoice No./Date :${this.invoiceType == VoucherTypeEnum.TaxInvoice && this.setting.hideSuffixInBill ? data.CHALANNO : data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
                </tr>

                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>${this.customerInfo[0] == null ? '' : (this.customerInfo[0].AREA == null ? '' : `${this.customerInfo[0].AREA}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].DISTRICT == null ? '' : `${this.customerInfo[0].DISTRICT}`)}&nbsp;${this.customerInfo[0] == null ? '' : (this.customerInfo[0].ADDRESS == null ? '' : this.customerInfo[0].ADDRESS)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>${data.shipToDetail.AREA == null ? '' : `${data.shipToDetail.AREA},`}${data.shipToDetail.DISTRICT == null ? '' : `${data.shipToDetail.DISTRICT},`}${data.shipToDetail.ADDRESS == null ? '' : data.shipToDetail.ADDRESS}</td>
                    <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>Pincode :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].POSTALCODE == null ? '' : this.customerInfo[0].POSTALCODE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Pincode :${data.shipToDetail.PINCODE == null ? '' : data.shipToDetail.PINCODE}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                        Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                    </td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>Mobile :  ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].MOBILE == null ? '' : this.customerInfo[0].MOBILE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Mobile :  ${data.shipToDetail.MOBILE == null ? '' : data.shipToDetail.MOBILE}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Truck No. :${data.TransporterEway ? (data.TransporterEway.VEHICLENO == null ? '' : data.TransporterEway.VEHICLENO) : ''}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>GSTIN :${this.customerInfo[0] == null ? '' : (this.customerInfo[0].GSTNO == null ? '' : this.customerInfo[0].GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Driver No. :${data.TransporterEway ? (data.TransporterEway.DRIVERNO == null ? '' : data.TransporterEway.DRIVERNO) : ''}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>PAN No : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].VATNO == null ? '' : this.customerInfo[0].VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>State Code : ${this.customerInfo[0] == null ? '' : (this.customerInfo[0].STATE == null ? '' : `${this.customerInfo[0].STATE},${this.customerInfo[0].statename}`)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>State Code : ${data.shipToDetail.STATE == null ? '' : `${data.shipToDetail.STATE},${data.shipToDetail.STATENAME}`}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Place of Supply :
                    </td>
                </tr>
                <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Beat:${this.customerInfo[0] == null ? '' : (this.customerInfo[0].BEATNAME == null ? '' : `${this.customerInfo[0].BEATNAME}`)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Reverse charge : N
                    </td>
                </tr>`

                    if (this.organisation_type == 'distributor') {
                        row = row + `
                    <tr>
                    <td colspan='10' style='border-right: 1px solid black;'>&nbsp;&nbsp;</td>
                    <td colspan='8' style='border-right: 1px solid black;'>DSM NAME:${data.AdditionalObj == null ? '' : (data.AdditionalObj.DSMNAME == null ? '' : data.AdditionalObj.DSMNAME)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                    </td>
                </tr>`
                    }

                    row = row + `
                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;max-width:200px;' colspan='2'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>P Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Othr Dis</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CESS%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CESS Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                </tr>`

                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            subPageCESSTotal = subPageCESSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDCESS_AMT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                            <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                            <td style='border-right: 1px solid black;' colspan='2'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].RATE)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BasePrimaryDiscount)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].BaseSecondaryDiscount)}</td>
                            <td style='border-right: 1px solid black;text-align:right'> ${this.limitDecimal(data.ProdList[this.arrayIndex].INDDISCOUNT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>

                             `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                            </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_PER)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].INDCESS_AMT)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            }


                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                    <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;' colspan='2'>Page Sub-Total</td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePDisTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageSDisTotal)}</b></td>
                    <td style='border-right: 1px solid black;'><b>${this.limitDecimal(subPageINDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageCESSTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                 </tr>
                `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;' colspan='2'>Grand Total</td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pdistotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.sdistotal)}</b></td>
                                    <td style='border-right: 1px solid black;'><b>${this.limitDecimal(this.grandTotal.INDDISCOUNTTOTAL)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;' colspan='1'></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTALCESS)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                                </tr>
                            `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='12'>&nbsp;</td>
                        </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td colspan='4'>
                                    <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                </td>
                                <td colspan='5'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        } else {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td rowspan="6" colspan='4'>
                                    <b>${this.companyProfile.BankName == null ? "" : "Bank Name:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account No:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AccountNo} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "IFSC Code:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.IFSCCode} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Account Holder:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.AcountHolder} <br>
                                    <b>${this.companyProfile.BankName == null ? "" : "Branch:"}</b> ${this.companyProfile.BankName == null ? "" : this.companyProfile.BankName} <br>
                                </td>
                                <td rowspan="6" colspan='5'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td rowspan="6" colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                        `
                        }

                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            for (let index in this.gstData) {
                                row = row + `
                        <tr>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                            <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                            <td colspan='12' style='border-right:1px solid black;'></td>
                        <tr>
                            `
                            }
                        }
                        row = row + `
                        <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="26" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='24'>Remarks: ${data.REMARKS}</td>
                        <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                    </tr>
                    <tr style='border-top: 1px solid black;'>
                        <td colspan='22'>GST Amount : ${data.GSTINWORD}</td>
                        <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                    </tr>
                    <tr>
                        <td colspan='22'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                        <td colspan='4' style='border-right:1px solid black;'><br></td>
                    </tr>
                    <tr style='border-top: 1px solid black'>
                        <td colspan='26' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}

                        </td>
                    </tr>
                    <tr>

</tr>`

                        if (isNullOrUndefined(data.EINVOICEQRIMAGE) || data.EINVOICEQRIMAGE == "") { }
                        else {
                            row = row + `  <tr>
<td colspan='26'>
<img style='width: 200px;'  src='${data.EINVOICEQRIMAGE}' alt=''> <br>
${isNullOrUndefined(data.IRNNUMBER) ? '' : data.IRNNUMBER}                                            </td>
</tr>`;
                        }

                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }

            }
            if (this.invoiceType == VoucherTypeEnum.StockIssue) {
                for (let i = 1; i <= this.noOfInvoiceForA5; i++) {
                    var j = 1;
                    var subPagePDisTotal = 0, subPageSDisTotal = 0, subPageINDTotal = 0, subPageCLDTotal = 0, subPagePCSTotal = 0, subPageTaxableTotal = 0, subPageIGSTTotal = 0, subPageCGSTTotal = 0, subPageSGSTTotal = 0, subPageNetAmountTotal = 0
                    row = row + `<table style='width: 100%;font-size: 9px;
                    border-collapse: collapse;border:1px solid black'>
                    <tbody>
                    <tr>
                        <td colspan='8'>
                            <img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 25px;">
                        </td>
                        <td colspan='10' style='text-align:center;max-width:180px;'>
                            <b>${this.companyProfile.NAME}</b><br>
                            <b>${data.BILLTO == null ? '' : data.BILLTO + ','}${data.BILLTOADD == null ? '' : data.BILLTOADD}</b><br>
                            <b>${this.companyProfile.ADDRESS2 == null ? '' : this.companyProfile.ADDRESS2}</b><br>
                            ${this.companyProfile.TELA == null ? '' : `<b>Phone:</b>${this.companyProfile.TELA}`}${this.companyProfile.TELB == null ? '' : `, <b>Mobile:</b>${this.companyProfile.TELB}`}
                        </td>
                        <td colspan='2' style='text-align: left;'>&nbsp;</td>
                        <td colspan='4' style='text-align: left;border-right: 1px solid black;'>Original for Recipient <br>Duplicate for Supplier/Transporter <br>Triplicate for Supplier</td>                    </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'>
                                    CIN:&nbsp;${this.companyProfile.CIN == null ? '' : this.companyProfile.CIN}<br>
                                    GSTIN:&nbsp;${this.companyProfile.GSTNO == null ? '' : this.companyProfile.GSTNO}</td>
                    <td colspan='8' style='text-align: center;'></td>
                    <td colspan='8' style='text-align: center;border-right: 1px solid black;'></td>
                </tr>
                <tr style='border-bottom: 1px solid black'>
                    <td colspan='8'> </td>
                    <td colspan='8' style='text-align: center;'><b>Delivery Chalan <b></td>
                    <td colspan='6' style='text-align: right;border-right: 1px solid black;'> Page : ${i}/${this.noOfInvoiceForA5}</td>
                    <td colspan='2' style='text-align: right;border-right: 1px solid black;'> User :${this.userProfile.username}</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='16' style='border-right: 1px solid black;'>Ship To:${data.warehouseDetail.NAME == null ? '' : data.warehouseDetail.NAME}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Chalan No./Date :${data.VCHRNO}/${this.transformDate(data.TRNDATE)}</td>
                </tr>

                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>${(data.warehouseDetail.ADDRESS == null ? '' : data.warehouseDetail.ADDRESS)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'> Gross Weight:${this.limitDecimal(data.TOTALWEIGHT)}</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>Pincode :${(data.warehouseDetail.POSTALCODE == null ? '' : data.warehouseDetail.POSTALCODE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>
                        Net Weight:${this.limitDecimal(this.grandTotal.NETWEIGHT)}
                    </td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>Mobile :  ${(data.warehouseDetail.MOBILE == null ? '' : data.warehouseDetail.MOBILE)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Truck No. :</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>GSTIN :${(data.warehouseDetail.GSTNO == null ? '' : data.warehouseDetail.GSTNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Driver No. :</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>PAN No : ${(data.warehouseDetail.VATNO == null ? '' : data.warehouseDetail.VATNO)}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Order No: ${data.REFBILL == null ? '' : data.REFBILL}</td>
                </tr>
                <tr>
                    <td colspan='16' style='border-right: 1px solid black;'>State Code : ${data.warehouseDetail.STATE == null ? '' : `${data.warehouseDetail.STATE},${data.warehouseDetail.STATENAME}`}</td>
                    <td colspan='8' style='border-right: 1px solid black;'>Place of Supply : <br>Dispatch Point:
                    </td>
                </tr>

                <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;' colspan='1'><b>S.No.</b></td>
                    <td style='border-right: 1px solid black;max-width:200px;' colspan='5'><b>Material Description</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Item Code</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>HSN/SAC</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>MRP</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Batch No</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Mfg</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Exp</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CLD</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Pcs</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>UOM</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Rate</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Taxable</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>IGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>CGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST%</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>SGST Amt</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'><b>Amount</b></td>
                </tr>`
                    for (j; j <= this.numberOfItemInA5; j++) {
                        if (this.arrayIndex < this._transactionService.nullToZeroConverter(data.ProdList.length)) {
                            //start of calculation for page sub total
                            subPageCLDTotal = subPageCLDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].AltQty);
                            subPagePCSTotal = subPagePCSTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].RealQty);
                            subPageTaxableTotal = subPageTaxableTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].TAXABLE);
                            subPageIGSTTotal = subPageIGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT);
                            subPageCGSTTotal = subPageCGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageSGSTTotal = subPageSGSTTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2;
                            subPageNetAmountTotal = subPageNetAmountTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].NETAMOUNT);
                            subPagePDisTotal = subPagePDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BasePrimaryDiscount);
                            subPageSDisTotal = subPageSDisTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].BaseSecondaryDiscount);
                            subPageINDTotal = subPageINDTotal + this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].INDDISCOUNT);
                            //End of calculation for page sub total
                            row = row + `
                            <tr>
                            <td style='border-left: 1px solid black;border-right: 1px solid black;'>${this._transactionService.nullToZeroConverter(this.arrayIndex) + 1}</td>
                            <td style='border-right: 1px solid black;' colspan='5'>${data.ProdList[this.arrayIndex].ITEMDESC}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].MCODE}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE != null ? data.ProdList[this.arrayIndex].SELECTEDITEM.HSNCODE : ""}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].BATCH}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].MFGDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.transformDate(data.ProdList[this.arrayIndex].EXPDATE)}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].AltQty)}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].RealQty}</td>
                            <td style='border-right: 1px solid black;'>${data.ProdList[this.arrayIndex].ALTUNIT}</td>
                            <td style='border-right: 1px solid black;'>${this.limitDecimal(data.ProdList[this.arrayIndex].MRP)}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].TAXABLE)}</td>


                             `
                            if (this.companyProfile.GSTTYPE && this.companyProfile.GSTTYPE.toLowerCase() == "composite") {


                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;'></td>
                            <td style='border-right: 1px solid black;text-align:right'></td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            } else {
                                row = row + `<td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE)) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT)) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].GSTRATE) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(data.ProdList[this.arrayIndex].VAT) / 2) : 0}</td>
                            <td style='border-right: 1px solid black;text-align:right'>${this.limitDecimal(data.ProdList[this.arrayIndex].NETAMOUNT)}</td>
                            </tr>  `
                            }


                        }
                        this.arrayIndex = this.arrayIndex + 1;
                    }
                    // Start of page Sub total
                    row = row + `
                    <tr style='border: 1px solid black;'>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;' colspan='5'>Page Sub-Total</td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'><b></b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageCLDTotal)}</b></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPagePCSTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(subPageTaxableTotal)}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(subPageIGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageCGSTTotal) : 0}</b></td>
                    <td style='border-right: 1px solid black;' colspan='1'></td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b></b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(subPageSGSTTotal) : 0}</td>
                    <td style='border-right: 1px solid black;text-align:right' colspan='1'><b>${this.limitDecimal(subPageNetAmountTotal)}</b></td>
                 </tr>
                `
                    //End of page Sub total

                    // Start Grand Page total
                    if (i == this.noOfInvoiceForA5) {
                        row = row + `
                                <tr style='border: 1px solid black;'>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;' colspan='5'>Grand Total</td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'><b></b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.grandTotal.igsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.cgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;'></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.grandTotal.sgsttotal) : 0}</b></td>
                                    <td style='border-right: 1px solid black;text-align:right'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                                </tr>
                            `
                        // End Of Page Grand Total


                        //start of gst footer header
                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            row = row + `
                        <tr>
                            <td colspan='2'>IGST%</td>
                            <td colspan='2'>IGST AMT</td>
                            <td colspan='2'>CGST%</td>
                            <td colspan='2'>CGST AMT</td>
                            <td colspan='2'>SGST %</td>
                            <td colspan='2'>SGST AMT</td>
                            <td colspan='2'>TAXABLE</td>
                            <td colspan='10'>&nbsp;</td>
                        </tr>`
                        }
                        //End ofgst footer header
                        if (this.companyProfile.GSTTYPE == 'Composite') {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td colspan='4'>
                                </td>
                                <td colspan='3'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>
                                `
                        } else {
                            row = row + `
                            <tr>
                                <td colspan="16"></td>
                                <td rowspan="6" colspan='4'>
                                </td>
                                <td rowspan="6" colspan='3'>
                                    <b>
                                    Bill Disc:
                                    <br>
                                    Total Dis Amt:
                                    <br>
                                    Gross Amt:
                                    <br>
                                    Tax Amt:
                                    <br>
                                    Round Off:
                                    <br>
                                    Amount:
                                    </b>
                                </td>
                                <td rowspan="6" colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                                <br>
                                ${this.limitDecimal(data.DCAMNT)}<br>
                                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                                ${this.limitDecimal(data.VATAMNT)}<br>
                                ${this.limitDecimal(data.ROUNDOFF)}<br>
                                ${this.limitDecimal(data.NETAMNT)}
                                </b></td>
                            </tr>`
                        }

                        if (this.companyProfile.GSTTYPE != 'Composite') {
                            for (let index in this.gstData) {
                                row = row + `
                        <tr>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[index].IGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].CGSTTOTAL) : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTRATE) + '%' : 0}</td>
                            <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[index].SGSTTOTAL) : 0}</td>
                            <td colspan='2'>${this.limitDecimal(this.gstData[index].taxable)}</td>
                            <td colspan='10' style='border-right:1px solid black;'></td>
                        <tr>
                            `
                            }
                        }
                        row = row + `
                        <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan="24" style='text-align: right;border-right:1px solid black;'>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='22'>Remarks: ${data.REMARKS}</td>
                        <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                    </tr>
                    <tr style='border-top: 1px solid black;'>
                        <td colspan='20'>GST Amount : ${data.GSTINWORD}</td>
                        <td colspan='4' style='text-align: right;'>${this.companyProfile.NAME}</td>
                    </tr>
                    <tr>
                        <td colspan='20'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                        <td colspan='4' style='border-right:1px solid black;'><br></td>
                    </tr>
                    <tr style='border-top: 1px solid black'>
                        <td colspan='24' style='border-right:1px solid black;'>Declaration: We declare that this invoice shows the actual price of the goods described and that all particlars are true and correct.${this.companyProfile.Declaration}

                        </td>
                    </tr>
                    <tr>

</tr>`
                    }

                    row = row + ` </tbody>
            </table>`
                    if (i != this.noOfInvoiceForA5) {
                        row = row + `
                            <div class="pagebreak"></div>
                            `
                    }
                }


            }
        }
        return row;
    }



    footer(data): string {
        var footer = ""
        if (this.printMode == 1 || this.printMode == 12) {
            if (this.invoiceType == VoucherTypeEnum.TaxInvoice && this.companyProfile.ORG_TYPE != 'distributor' &&
                this.companyProfile.ORG_TYPE != 'superdistributor' &&
                this.companyProfile.ORG_TYPE != 'fitindia' &&
                this.companyProfile.ORG_TYPE.toLowerCase() != 'wdb' &&
                this.companyProfile.ORG_TYPE.toLowerCase() != 'ssa' &&
                this.companyProfile.ORG_TYPE.toLowerCase() != 'zcp') {



            }

            if (this.activeurlpath == "StockSettlementEntry") {
                footer = footer + `

          <tfoot style="border: 1px solid black">
                <tr>
                    <td colspan='1'>No of Items:</td>
                    <td colspan='2'>${data.ProdList.length}</td>
                    <td colspan='3'>&nbsp;</td>
                    <td colspan='1'>${this.grandTotal.cldtotal}</td>
                    <td colspan='1'>${this.grandTotal.pcstotal}</td>
                    <td colspan='1'>${this.grandTotal.pcstotal}</td>
                    <td colspan='3'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan='14'>Remarks:&nbsp;${data.REMARKS}</td>
                </tr>
                <tr>
                <td colspan='14'>&nbsp;</td>
            </tr>
            </tfoot>

          `
            }
            else
                if (this.invoiceType == VoucherTypeEnum.StockSettlement) {
                    footer = footer + `

          <tfoot style="border: 1px solid black">
                <tr>
                    <td colspan='1'>No of Items:</td>
                    <td colspan='2'>${data.ProdList.length}</td>
                    <td colspan='3'>&nbsp;</td>
                    <td colspan='1'>${this.grandTotal.cldtotal}</td>
                    <td colspan='1'>${this.grandTotal.pcstotal}</td>
                    <td colspan='1'>${this.grandTotal.pcstotal}</td>
                    <td colspan='3'>&nbsp;</td>
                </tr>
                <tr>
                    <td colspan='14'>Remarks:&nbsp;${data.REMARKS}</td>
                </tr>
                <tr>
                <td colspan='14'>&nbsp;</td>
            </tr>
            </tfoot>

          `
                }
                else if (this.invoiceType == VoucherTypeEnum.PurchaseOrder) {
                    footer = footer + `

          <tfoot style="border: 1px solid black">
                <tr>
                    <td colspan='2'>No of Items:</td>
                    <td colspan='1'>${data.ProdList.length}</td>
                    <td colspan='${this.companyProfile.COMPANYID == "8888888" ? 3 : 2}'>&nbsp;</td>
                    <td colspan='1'>${this.limitDecimal(this.grandTotal.cldtotal)}</td>
                    <td colspan='1'>${this.grandTotal.pcstotal}</td>
                    <td colspan='1'>${this.grandTotal.pcstotal}</td>
                    <td colspan='${this.companyProfile.COMPANYID == "8888888" ? 3 : 4}'>&nbsp;</td>
                    <td colspan='2' style='border-right: 1px solid black;'>Net Amount: ${this.limitDecimal(data.NETAMNT)}</td>
                </tr>
                <tr>
                    <td colspan='14' style='border-right: 1px solid black;'>Remarks:&nbsp;${data.REMARKS}</td>
                </tr>
                <tr>
                <td colspan='14' style='border-right: 1px solid black;'>T&C:&nbsp;${data.AdditionalObj == null ? "" : data.AdditionalObj.T_AND_C == null ? "" : data.AdditionalObj.T_AND_C}</td>
            </tr>
                <tr>
                <td colspan='14' style='border-right: 1px solid black;'>&nbsp;</td>
            </tr>
            </tfoot>

          `
                } else if (this.invoiceType == VoucherTypeEnum.SalesOrder) {
                    footer = footer + `
          <tfoot style='border: 1px solid black'>
          <tr>
          <td colspan='3'></td>
          <td colspan='1'><b>${this.limitDecimal(this.grandTotal.cldtotal)}</b></td>
          <td colspan='1'><b>${this.limitDecimal(this.grandTotal.pcstotal)}</b></td>
          <td colspan='4'>&nbsp;</td>
          <td colspan='1'><b></b></td>
          <td colspan='1' style='text-align: right;'><b>${this.limitDecimal(data.NETAMNT)}</b></td>
      }
      </tr>
      <tr style='border-top: 1px solid black;'>
          <td colspan='1'>Total Items:</td>
          <td colspan='1'>${data.ProdList.length}</td>
          <td colspan='7'></td>
          <td colspan='1'><b>TOTAL:</b></td>
          <td colspan='1' style='text-align: right;'></td>
      </tr>
      <tr>
          <td colspan='11'>Remarks:&nbsp;${data.REMARKS}</td>

      </tr>
      </foot>
         `
                } else if (this.invoiceType == VoucherTypeEnum.Purchase) {
                    footer = footer + `
                <tfoot style='border: 1px solid black;'>
                  <tr style='border-bottom: 1px solid black;'>
                  <tr>
                  <tr style='border: 1px solid black;'>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='2'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='2'><b>Grand Total</b></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                  </tr>
                  <tr>
                      <td colspan='2'>IGST%</td>
                      <td colspan='2'>IGST AMT</td>
                      <td colspan='2'>SGST %</td>
                      <td colspan='2'>SGST AMT</td>
                      <td colspan='2'>CGST%</td>
                      <td colspan='2'>CGST AMT</td>
                      <td colspan='2'>TAXABLE</td>
                      <td colspan='4'></td>
                      <td colspan='3'>
                          <b>
                          Bill Disc:
                          <br>
                          Total Dis Amt:
                          <br>
                          Gross Amt:
                          <br>
                          Tax Amt:
                          <br>
                          ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                          ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                          Round Off:
                          <br>
                          Amount:
                          </b>
                      </td>
                      <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                  <br>
                      ${this.limitDecimal(data.DCAMNT)}<br>
                      ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                      ${this.limitDecimal(data.VATAMNT)}<br>
                      ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                      ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                      ${this.limitDecimal(data.ROUNDOFF)}<br>
                      ${this.limitDecimal(data.NETAMNT)}
                  </b></td>
                  </tr>`

                    for (let i in this.gstData) {
                        footer = footer + `
                      <tr>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[i].IGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[i].IGSTTOTAL) : this.limitDecimal(0)}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].CGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].CGSTTOTAL) : this.limitDecimal(0)}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].SGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].SGSTTOTAL) : this.limitDecimal(0)}</td>
                          <td colspan='2'>${this.limitDecimal(this.gstData[i].taxable)}</td>
                          <td colspan='8' style='border-right:1px solid black;'></td>
                      <tr>
                          `
                    }

                    footer = footer +
                        `
                      <tr>
                          <td colspan='20'>Remarks: ${data.REMARKS}</td>
                          <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                      </tr>
                      <tr style='border-top: 1px solid black;'>
                          <td colspan='20'>GST Amount : ${data.GSTINWORD}</td>
                          <td colspan='2' style='text-align: right;'>${this.companyProfile.NAME}</td>
                      </tr>
                      <tr>
                          <td colspan='20'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                          <td colspan='2' style='border-right:1px solid black;'>Signature</td>
                      </tr>
                  </tfoot>
              `

                }
                else if (this.invoiceType == VoucherTypeEnum.MaterialReceipt) {
                    footer = footer + `
                <tfoot style='border: 1px solid black;'>
                  <tr style='border-bottom: 1px solid black;'>
                  <tr>
                  <tr style='border: 1px solid black;'>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='2'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='2'><b>Grand Total</b></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
                  <td style='border-right: 1px solid black;' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
                  </tr>
                  <tr>
                      <td colspan='2'>IGST%</td>
                      <td colspan='2'>IGST AMT</td>
                      <td colspan='2'>SGST %</td>
                      <td colspan='2'>SGST AMT</td>
                      <td colspan='2'>CGST%</td>
                      <td colspan='2'>CGST AMT</td>
                      <td colspan='2'>TAXABLE</td>
                      <td colspan='4'></td>
                      <td colspan='3'>
                          <b>
                          Bill Disc:
                          <br>
                          Total Dis Amt:
                          <br>
                          Gross Amt:
                          <br>
                          Tax Amt:
                          <br>
                          ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                          ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                          Round Off:
                          <br>
                          Amount:
                          </b>
                      </td>
                      <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
                  <br>
                      ${this.limitDecimal(data.DCAMNT)}<br>
                      ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                      ${this.limitDecimal(data.VATAMNT)}<br>
                      ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                      ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                      ${this.limitDecimal(data.ROUNDOFF)}<br>
                      ${this.limitDecimal(data.NETAMNT)}
                  </b></td>
                  </tr>`

                    for (let i in this.gstData) {
                        footer = footer + `
                      <tr>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[i].IGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[i].IGSTTOTAL) : this.limitDecimal(0)}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].CGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].CGSTTOTAL) : this.limitDecimal(0)}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].SGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                          <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].SGSTTOTAL) : this.limitDecimal(0)}</td>
                          <td colspan='2'>${this.limitDecimal(this.gstData[i].taxable)}</td>
                          <td colspan='8' style='border-right:1px solid black;'></td>
                      <tr>
                          `
                    }

                    footer = footer +
                        `
                      <tr>
                          <td colspan='20'></td>
                          <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                      </tr>
                      <tr style='border-top: 1px solid black;'>
                          <td colspan='20'>GST Amount : ${data.GSTINWORD}</td>
                          <td colspan='2' style='text-align: right;'>${this.companyProfile.NAME}</td>
                      </tr>
                      <tr>
                          <td colspan='20'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                          <td colspan='2' style='border-right:1px solid black;'>Signature</td>
                      </tr>
                  </tfoot>
              `

                }



                else if (this.activeurlpath == 'add-debitnote-itembase') {

                } else if (this.activeurlpath == 'add-creditnote-itembase') {
                    footer = footer + `
          <tfoot style='border: 1px solid black;'>
            <tr style='border-bottom: 1px solid black;'>
            <tr>
            <tr style='border: 1px solid black;'>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='2'></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='2'><b>Grand Total</b></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='1'>${this.grandTotal.cldtotal}</td>
            <td style='border-right: 1px solid black;' colspan='1'>${this.grandTotal.pcstotal}</td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
            <td style='border-right: 1px solid black;' colspan='1'><b>${this.limitDecimal(data.TOTALTAXABLE)}</b></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
            <td style='border-right: 1px solid black;' colspan='1'></td>
            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
            <td style='border-right: 1px solid black;' colspan='1'><b></b></td>
            <td style='border-right: 1px solid black;' colspan='1'><b>${this.limitDecimal(this.grandTotal.TOTNETAMOUNT)}</b></td>
            </tr>
            <tr>
                <td colspan='2'>IGST%</td>
                <td colspan='2'>IGST AMT</td>
                <td colspan='2'>SGST %</td>
                <td colspan='2'>SGST AMT</td>
                <td colspan='2'>CGST%</td>
                <td colspan='2'>CGST AMT</td>
                <td colspan='2'>TAXABLE</td>
                <td colspan='4'></td>
                <td colspan='3'>
                    <b>
                    Bill Disc:
                    <br>
                    Total Dis Amt:
                    <br>
                    Gross Amt:
                    <br>
                    Tax Amt:
                    <br>
                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS AMOUNT <br>'}
                    ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : 'TCS PERCENT <br>'}
                    Round Off:
                    <br>
                    Amount:
                    </b>
                </td>
                <td colspan='1' style='text-align: right;border-right:1px solid black;' ><b>${this.limitDecimal(data.TOTALFLATDISCOUNT)}
            <br>
                ${this.limitDecimal(data.DCAMNT)}<br>
                ${this.limitDecimal(data.TOTALTAXABLE)} <br>
                ${this.limitDecimal(data.VATAMNT)}<br>
                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : this.limitDecimal(data.AdditionalObj.TCS_AMT) + '<br>'}
                ${(isNullOrUndefined(data.AdditionalObj.TCS_AMT) || data.AdditionalObj.TCS_AMT == 0) ? '' : data.AdditionalObj.TCS_PER + '<br>'}
                ${this.limitDecimal(data.ROUNDOFF)}<br>
                ${this.limitDecimal(data.NETAMNT)}
            </b></td>
            </tr>`

                    for (let i in this.gstData) {
                        footer = footer + `
                <tr>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[i].IGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this.gstData[i].IGSTTOTAL) : this.limitDecimal(0)}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].CGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].CGSTTOTAL) : this.limitDecimal(0)}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].SGSTRATE) + '%' : this.limitDecimal(0) + '%'}</td>
                    <td  colspan='2'>${data.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this.gstData[i].SGSTTOTAL) : this.limitDecimal(0)}</td>                    <td colspan='2'>${this.limitDecimal(this.gstData[i].taxable)}</td>
                    <td colspan='8' style='border-right:1px solid black;'></td>
                <tr>
                    `
                    }

                    footer = footer +
                        `
                <tr>
                    <td colspan='20'>Remarks: ${data.REMARKS}</td>
                    <td colspan='2' style='border-right:1px solid black;'>E&OE</td>
                </tr>
                <tr style='border-top: 1px solid black;'>
                    <td colspan='20'>GST Amount : ${data.GSTINWORD}</td>
                    <td colspan='2' style='text-align: right;'>${this.companyProfile.NAME}</td>
                </tr>
                <tr>
                    <td colspan='20'>Net Amount (In Words): ${data.NETAMOUNTINWORD}</td>
                    <td colspan='2' style='border-right:1px solid black;'>Signature</td>
                </tr>
            </tfoot>
        `
                }
        }
        return footer
    }












    autorepeatableprint(invoiceData) {
        let data = `
        
                                    <!DOCTYPE html>
                            <html lang='en'>

                            <head>
                                <meta charset='UTF-8'>
                                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                                <title>Tax Invoice${invoiceData.VCHRNO}</title>
                                <style>
                                    thead {
                                        display: table-header-group;
                                    }

                                    tfoot {
                                        display: table-footer-group;
                                    }

                                    table {
                                        -fs-table-paginate: paginate;
                                    }
                                </style>
                            </head>

                            <body onload="window.print();window.close()">
                                <table style=' table-layout:fixed;border: 1px solid black;width: 100%;border-collapse: collapse;font-size: 14px;'>

                                    <colgroup>
                                        <col width='40px'>
                                        <col width='60px'>
                                        <col width='60px'>
                                        <col width='60px'>
                                        <col width='60px'>
                                        <col width='60px'>
                                        <col width='60px'>
                                        <col width='60px'>
                                    </colgroup>

                                    <thead>
                                    <tr>

                                    <td colspan='2' rowspan='5'><img src="${this.setting.APPIMAGEPATH}" alt="" style="height: 80px;"></td>
                                    <td colspan='3'></td>
                                    <td colspan='3'></td>

                                    </tr>
                                        <tr>
                                            <th colspan='4' style='text-align: center;'>Tax Invoice</th>
                                            <td colspan='2' style='text-align: left;'><b>GSTIN :</b>${this.companyProfile.GSTNO ? this.companyProfile.GSTNO : ''} <br> <b>FSSAI:</b> &nbsp;${this.companyProfile.FSSAI == null ? '' : this.companyProfile.FSSAI}</td>
                                        </tr>
                                        <tr>
                                            <th colspan='4' style='text-align: center;'>
                                                <h1 style='margin: 0;'> ${this.companyProfile.NAME ? this.companyProfile.NAME : ''} </h1>
                                            </th>
                                            <td colspan='2' style='text-align: left;'>
                                                    <b>Mobile:</b>${this.companyProfile.TELB ? this.companyProfile.TELB : ''}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan='4' style='text-align: center;'><b>${this.companyProfile.ADDRESS ? this.companyProfile.ADDRESS : ''} </b></td>
                                            <td colspan='2' style='text-align: left;'><b>State :</b>${this.companyProfile.STATENAME ? this.companyProfile.STATENAME : ''}</td>
                                        </tr>
                                        <tr>
                                            <td colspan='4' style='text-align: center;border-bottom: 1px solid black;'>${this.companyProfile.EMAIL ? this.companyProfile.EMAIL : ''}</td>
                                            <td colspan='2' style='text-align: left;border-bottom: 1px solid black;'><b>State Code :</b>${this.companyProfile.STATE ? this.companyProfile.STATE : ''}</td>
                                        </tr>
                                        <tr>
                                            <td colspan='6' style='text-align: left;;border-top: 1px solid black;'><b>To, M/s:</b> ${invoiceData.BILLTO ? invoiceData.BILLTO : ''}</td>
                                            <td colspan='2' style='text-align: left; border-left: 1px solid black;'><b>Invoice No :</b>${invoiceData.VCHRNO} </td>
                                        </tr>
                                        <tr>
                                            <td colspan='6' style='text-align: left;'><b>Address :</b> ${invoiceData.BILLTOADD ? invoiceData.BILLTOADD : ''}</td>
                                            <td colspan='2' style='text-align: left; border-left: 1px solid black;'><b>Invoice Date:</b> ${invoiceData.TRNDATE ? this.transformDate(invoiceData.TRNDATE) : ''}</td>
                                        </tr>
                                        <tr>
                                            <td colspan='6' style='text-align: left;border-bottom: 1px solid black; border-left: 1px solid black;'> <b>GSTIN :</b> ${this.customerInfo[0].GSTNO ? this.customerInfo[0].GSTNO : ''}</td>
                                            <th colspan='2' style='text-align: left;border-bottom: 1px solid black; border-left: 1px solid black;'>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style='border-right:1px solid black;text-align: left; border-bottom: 1px solid black;'>SNO</th>
                                            <th colspan='2' style='border-right:1px solid black;text-align: left; border-bottom: 1px solid black;'>Item Name</th>
                                            <th style='border-right:1px solid black;text-align: left; border-bottom: 1px solid black;'>HSN Code
                                            </th>
                                            <th style='border-right:1px solid black;text-align: center; border-bottom: 1px solid black;'>Qty
                                            </th>
                                            <th style='border-right:1px solid black;text-align: center; border-bottom: 1px solid black;'>Pkt
                                            </th>
                                            <th style='border-right:1px solid black;text-align: right; border-bottom: 1px solid black;'>Rate(kg)
                                            </th>
                                            <th style='border-right:1px solid black;text-align: right; border-bottom: 1px solid black;'>Total Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>`


            ;



        let bodyRows = '';



        invoiceData.ProdList.forEach((x, index) => {
            bodyRows = bodyRows + `
                                                    <tr>
                                                        <td style='border-right:1px solid black;text-align: left;'>${index + 1}</td>
                                                        <td colspan='2' style='border-right:1px solid black;text-align: left;'>${x.ITEMDESC}</td>
                                                        <td style='border-right:1px solid black;text-align: left;'>${x.SELECTEDITEM.HSNCODE ? x.SELECTEDITEM.HSNCODE : ''}</td>
                                                        <td style='border-right:1px solid black;text-align: center;'>${x.RealQty}</td>
                                                        <td style='border-right:1px solid black;text-align: center;'>${x.ALTUNIT}</td>
                                                        <td style='border-right:1px solid black;text-align: right;'>${this.limitDecimal(x.RATE)}</td>
                                                        <td style='border-right:1px solid black;text-align: right;'>${this.limitDecimal(x.NETAMOUNT)}</td>
                                                    </tr>            
       
                                `
        })

        bodyRows = bodyRows + `
                                                    <tr>
                                                        <td style='border-right:1px solid black;border-bottom:1px solid black;'></td>
                                                        <td style='border-right:1px solid black;border-bottom:1px solid black;'></td>
                                                        <td style='border-right:1px solid black;border-bottom:1px solid black;'></td>
                                                        <td style='border-right:1px solid black;border-bottom:1px solid black;'></td>
                                                        <td style='border-right:1px solid black;border-bottom:1px solid black;'></td>
                                                        <td style='border-right:1px solid black;border-bottom:1px solid black;'></td>
                                                        <td style='border-right:1px solid black;border-bottom:1px solid black;'></td>
                                                        <td style='border-right:1px solid black;border-bottom:1px solid black;'></td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colspan='6'>
                                                           <b> Dispatching Detai:</b>
                                                        </td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;'>
                                                            <b>Total</b></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;text-align:right'>${this.limitDecimal(invoiceData.TAXABLE)}</td>

                                                    </tr>
                                                    <tr>
                                                        <td colspan='6'>
                                                           <b> Loading Point:</b>
                                                        </td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;'>
                                                           <b> CGST@ %</b></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;text-align:right'>
                                                        ${invoiceData.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(invoiceData.VATAMNT / 2)) : ""}
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td colspan='6'> <b>Amount in word:</b> ${invoiceData.NETAMOUNTINWORD}</td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;'>
                                                            <b>SGST@ %</b></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;text-align:right'>
                                                        ${invoiceData.AdditionalObj.TRNTYPE != "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(invoiceData.VATAMNT / 2)) : ""}
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td colspan='6'></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;'>
                                                            <b>IGST@ %</b></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;text-align:right'>
                                                        ${invoiceData.AdditionalObj.TRNTYPE == "interstate" ? this.limitDecimal(this._transactionService.nullToZeroConverter(invoiceData.VATAMNT)) : ""}
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td colspan='6'>
                                                        <b> Make all Cheques payable to   </b><em>${this.companyProfile.NAME}</em>
                                                        

                                                        </td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;'>
                                                           <b> Dicount %</b></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;text-align:right'>
                                                        ${invoiceData.DCRATE}
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td colspan='6'>
                                                             <b>A/c No :</b> ${this.companyProfile.AccountNo ? this.companyProfile.AccountNo : ''} 
                                                        </td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;'>
                                                           <b> Discount Amt</b></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;text-align:right'>
                                                        ${this.limitDecimal(invoiceData.DCAMNT)}
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td colspan='6'>
                                                        <b>IFSC:</b> ${this.companyProfile.IFSCCode ? this.companyProfile.IFSCCode : ''}
                                                        </td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;'>
                                                            <b>Round Off</b></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;text-align:right'>
                                                        ${this.limitDecimal(invoiceData.ROUNDOFF)}
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td colspan='6'>
                                                        <b>Bank Name:</b> ${this.companyProfile.BankName ? this.companyProfile.BankName : ''}
                                                        </td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;'>
                                                            <b>Total Amount</b></td>
                                                        <td style='border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;text-align:right'>
                                                        ${invoiceData.NETAMNT}
                                                        </td>

                                                    </tr>

                                                    <tr>
                                                        <td colspan='5'> <b>Terms & Condition: All subject to Jaipur Jurisdiction</b> </td>
                                                        <td colspan='3' > <b>For:</b> <em>${this.companyProfile.NAME}</em></td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan='5'> 1. Freight will be paid by buyer at every condition. </td>
                                                        <td colspan='3' ></td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan='5'> 2. payment Schedule within 7 days on receipt of Goods </td>
                                                        <td colspan='3' ></td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan='5'> 3. 2% per month will be charge extra on delay of payments </td>
                                                        <td colspan='3'> <b>Authorise Signatory</b></td>
                                                    </tr>
                                                </tfoot>

                                            </table>
                                        </body>

                                        </html>
                                `



        return data + bodyRows;
    }


}

