import { Component, ViewChild } from '@angular/core';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { BarCodeModel } from './bar-code.model';
import { FormControl } from "@angular/forms";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { PopBatchOldComponent } from "../../../../common/popupLists/PopBatchList/PopBatchOld.component";
import { AuthService } from '../../../../common/services/permission';
import { DecimalPipe } from '@angular/common';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'bar-code',
    templateUrl: './bar-code.component.html',
    styleUrls: ["../../../modal-style.css"],
    providers: [DatePipe]
})

export class BarCodeComponent {

    @ViewChild('genericGridBarcode') genericGridBarcode: GenericPopUpComponent;
    @ViewChild('genericGrid') genericGrid: GenericPopUpComponent;
    @ViewChild(PopBatchOldComponent) batchlistChild: PopBatchOldComponent;
    gridPopupSettingsForBarcode: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    barcodeModels: BarCodeModel[] = [];
    barcodeModelsPrint: BarCodeModel[] = [];
    activerowIndex: number = 0;
    showStockedQuantityOnly = 0;
    public promptPrintDevice: boolean = false;
    public printControl = new FormControl(0);
    AlternateUnits: any[] = [];
    private companyProfile: any
    private userProfile: any;
    configCodeParams: any = [];
    itemVariantDetails: any = [];
    showTransactionType: boolean = false;
    selectTransType: string = "";
    public selectAllitem: boolean = false;
    responseData: any = [];
    externalBarcodePrintProfile: any[] = [];
    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService, private alertService: AlertService, private _authService: AuthService, private loadingService: SpinnerService, private datePipe: DatePipe) {

        this.userProfile = this._authService.getUserProfile();

        this.externalBarcodePrintProfile = (this.userProfile.printDeviceSetting ? this.userProfile.printDeviceSetting : []).
            filter(x => x.profileTypeLabel == "barcode setting");
        this.companyProfile = this.userProfile.CompanyInfo;

        this.newRow(this.activerowIndex);

        this.gridPopupSettingsForBarcode = Object.assign(new GenericPopUpSettings, {
            Title: 'ITEMS',
            // apiEndpoints: ``,
            apiEndpoints: `/getMenuitemWithStockPagedList/${this.showStockedQuantityOnly}/${'all'}/${'NO'}/${this._trnMainService.userProfile.userWarehouse}`,
            defaultFilterIndex: 0,
            columns: [{
                key: 'MCODE',
                title: 'Code',
                hidden: false,
                noSearch: false
            },
            {
                key: 'DESCA',
                title: 'Name',
                hidden: false,
                noSearch: false
            },
            {
                key: 'STOCK',
                title: 'Stock',
                hidden: false,
                noSearch: false
            }
            ]
        })
    }
    limitDecimal(value: number) {
        return new DecimalPipe('en-US').transform(value, '1.2-2')
    }

    loadTransType() {
        this.showTransactionType = true;
    }
    onClose() {
        this.showTransactionType = false;
    }

    onTransactionClick() {
        this.genericGrid.hide();
        let val = this.selectTransType;
        //  console.log(val);
        if (val == "") {
            this.alertService.error("Select Type");
            return;
        }
        if (val == "PI") {
            this.gridPopupSettings = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings(val));
            this.genericGrid.show("", false, "viewForPurchaseInvoice");
        }
        if (val == "OP") {
            this.gridPopupSettings = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings(val));
            this.genericGrid.show("", false, "viewForOpeningStock");
        }
        if (val == "PD") {
            this.gridPopupSettings = Object.assign(new GenericPopUpSettings, this.masterService.getGenericGridPopUpSettings(val));
            this.genericGrid.show();
        }

    }

    public headCustomize(data) {
        let thead = "";
        thead = thead + `
                  <thead>
                    <tr>
                      <td></td>
                    </tr>
                  </thead>`

        return thead
    }

    getSelectAllRecord() {
        if (this.selectAllitem) {
            this.barcodeModels.forEach(el => {
                el.checkFlagEAN = 1;
            });
        } else {
            this.barcodeModels.forEach(el => {
                el.checkFlagEAN = 0;
            });
        }

    }
    style1: any = "";
    public bodyCustomize(data) {
        console.log("data", data);
        let body = `<tbody><tr>
        <td style=''>
        <div class="row"`;
        let j = 0;

        // console.log(data[j].barcodeImage);
        // for (let bar of this.barcodeModels) {
        //     for (let i = 0; i < bar.PrintedQTY; i++) {
        //         body = body + `<div class="col-sm-6" style="font-family:arial;font-size:10px;font-weight:bold;">
        //         <b>${this.companyProfile.NAME}</b>${bar.Item}<br>MRP:${bar.MRP},Exp:${bar.ExpDate},<br>
        //         <img src ="${data[j].barcodeImage}" style="height:25px; width:100px; padding:2px 0; mode:svg;"/>
        //         <br>Batch:${bar.Batch}, S.P:${bar.Rate}</div>
        //     <p style="page-break-before: always">`

        //     }
        //     j++;
        // }




        this.barcodeModelsPrint = this.barcodeModels.filter(e => e.checkFlagEAN);
        console.log("barcodeModelsPrint", this.barcodeModelsPrint);
        for (let bar of this.barcodeModelsPrint) {

            //24mmX25mm
            if (this.printControl.value == 0 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    body = body + `<div class="page-break" style="font-size:6.5pt;">
                    <b>${this.companyProfile.NAME}</b>${bar.Item}<br>MRP:${bar.MRP},Exp:${bar.ExpDate.toString().substring(0, 10)},<br>
                    <img src ="${data[j].barcodeImage}" style="height:30px; width:100px; padding:1px 0; mode:svg;"/>
                    <br>Bt:${bar.Batch}, S.P:${this.limitDecimal(Number(bar.Rate))}</div>`
                    body = body + '';
                }
            }

            //76mmX38mm
            else if (this.printControl.value == 1 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                this.style1 = ` <style type = "text/css">
                @page { size:76mm 50mm; margin: 0.5mm;}

                    </style>`;
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    var variants = <any>{};
                    if (typeof (bar.VARIANTDETAIL) == "string") {
                        variants = JSON.parse(bar.VARIANTDETAIL);
                    }
                    else {
                        variants = bar.VARIANTDETAIL;
                    }
                    if (variants == null) { variants = <any>{}; }
                    body = body + `<div style="font-size:12pt;font-family: Arial; -ms-transform: rotate(90deg);
                        transform: rotate(90deg); height:180px; position: relative; right:-90px" >
                        <b>${variants.CATEGORY_6 == null ? '' : variants.CATEGORY_6.NAME} ${variants.CATEGORY_5 == null ? '' : variants.CATEGORY_5.NAME} ${bar.Item} </b><br><br>
                        <span><b>${variants.CATEGORY_4 == null ? '' : variants.CATEGORY_4.VARIANTNAME}</b></span> : ${variants.CATEGORY_4 == null ? '' : variants.CATEGORY_4.NAME} <br>
                        <b>${variants.CATEGORY_5 == null ? '' : variants.CATEGORY_5.VARIANTNAME} : </b>  ${variants.CATEGORY_5 == null ? '' : variants.CATEGORY_5.NAME} <br>
                        <span style="font-size:6pt; display:block;">Net Quantity 1 N (ONE)</span>
                        <span style="font-size:6pt; font-weight:700;">Month & Year of <br/>Manufacture and Packing </br>
                        <b>${(this.datePipe.transform(new Date(), "yyyy-MM-dd"))}</b></span></br>
                        <b>MRP : Rs. ${bar.MRP} </b></br>
                        <span style="font-size:6pt; font-weight:700;">(inclusive of all taxes)</span> <br>
                        <span style="font-size:8pt;"><b>Hsncode :</b>  ${bar.HSNCODE}</span><br>
                        <span style="font-size:5pt">MFG & MKT BY </span></br>
                        <b><span style="font-size:5pt !important;">${this.companyProfile.NAME}</span></b></br>
                        <img src ="${data[j].barcodeImage}" style="height:75px; width:175px; padding:1px 0; mode:svg;"/>
                        </div>`
                    body = body + '';
                    // <span style="font-size:7pt;><b>HSN CODE : ${this._trnMainService.batchlist[0].HSNCODE}</b></span> </br>
                }
            }
            //38mmX38mm
            else if (this.printControl.value == 2 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                this.style1 = ` <style type = "text/css">
                    @page { size:38mm 38mm; margin: 1mm;}
                    @media print {
                    .twoCol:nth-child(2){margin-right:0 !important;}
                    .threeCol:nth-child(3){margin-right:0 !important;}
                    }
                    </style>`;
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    //  var variants=JSON.parse(bar.VARIANTDETAIL);
                    //   
                    body = body + `<div style="font-size:7pt; text-align:center; postion:absolute; top:50%; left:50%; " >
                        <b>${this.companyProfile.NAME}</b> <br/> <br/>
                        </b>${bar.Item}<br/>
                        MRP : Rs. ${bar.MRP} <br>
                        Our Price : ${this.limitDecimal(Number(bar.Rate))}<br/>
                        Exp : ${bar.ExpDate.toString().substring(0, 10)}      <br>
                        <img src ="${data[j].barcodeImage}" style="height:60px; width:100px; padding:1px 0; mode:svg;"/>
                       </div><p style="page-break-before: always">`
                    body = body + '';
                }
            }

            // 50/25 yghyper
            else if (this.printControl.value == 6 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                this.style1 = ` <style type = "text/css">
                    @page { size:80mm 45mm; margin: 0.5mm;}                   
                    </style>`;
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    body = body + `<div style="font-size:14pt; text-align:center; postion:absolute; top:50%; left:50%; font-family: Arial; font-weight:700; " >
                        <b>${this.companyProfile.NAME}</b> <br/>
                        </b>${bar.Item}<br/>
                        MRP : Rs. ${bar.MRP} <br>
                        Our Price : ${this.limitDecimal(Number(bar.Rate))}<br/>
                        Exp : ${bar.ExpDate.toString().substring(0, 10)}      <br>
                        <img src ="${data[j].barcodeImage}" style="height:100px; width:450px; padding:1px 0; mode:svg;"/>
                       </div><p style="page-break-before: always">`
                    body = body + '';
                }
            }

            //34/20 shreekrishna
            else if (this.printControl.value == 7 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                console.log(bar.CONFACTOR, "barcodecon")
                this.style1 = ` <style type = "text/css">
                    @page { size:270mm 43mm; margin: .5mm;} 
                     @media print {
                    .threeCol:nth-child(2){margin-left:20px !important;}
                    .threeCol:nth-child(2n+1){margin-left:65px !important;}
                    }
                    </style>`;
                let PbreakerCounter = 1;
                body = body + `<div class="page-break" style="display:flex;flex:wrap;">`
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    body = body + `<div class="threeCol"  style="font-size:16.8pt; max-width:calc(100%); min-width(100%); padding-left:10px; padding-top:5px; font-family: Arial; font-weight:700;">
                        <b>${this.companyProfile.NAME}</b> <br/>
                        ${bar.Item} <br/> 
                   MRP : Rs. ${(bar.ALTUNIT.toLowerCase() == 'pcs') ? bar.MRP : bar.CONFACTOR * bar.MRP} &nbsp; &nbsp;
                        Qty: ${bar.CONFACTOR} <br> 
                      
                        <img src ="${data[j].barcodeImage}" style="height:68px; width:280px; padding:1px 0; mode:svg;"/>
                       </div><p style="page-break-before: always">`
                    body = body + '';
                    if (i % 3 == 0) {
                        body = body + ' </div> <p style="page-break-before: always">';
                        body = body + `<div style="display:flex;flex:wrap;">`
                    }
                    if (i == bar.PrintedQTY) {
                        body = body + '</div> <p style="page-break-before: always">';
                    }
                }
            }

            //38mmX25mm
            else if (this.printControl.value == 5 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                this.style1 = ` <style type = "text/css">
                    @page { size:38mm 25mm; margin: 0.5mm;}                    
                    </style>`;
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    body = body + `<div style="font-size:8pt; text-align:center; padding-top:5px; font-family: Arial; font-weight:700;" >
                        <b>${this.companyProfile.NAME}</b> <br/>
                        </b>${bar.Item}<br/>
                        MRP : Rs. ${bar.MRP} <br>
                        Our Price : ${this.limitDecimal(Number(bar.Rate))}<br/>
                        Exp : ${bar.ExpDate.toString().substring(0, 10)}      <br>
                        <img src ="${data[j].barcodeImage}" style="height:60px; width:200px; padding:1px 0; mode:svg;"/>
                       </div><p style="page-break-before: always">`
                    body = body + '';
                }
            }

            //38mmX25mm two bar code
            else if (this.printControl.value == 3 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                this.style1 = ` <style type = "text/css">
                    @page { size:76mm 25mm; margin: 0.5mm;}
                    @media print {
                    .twoCol:nth-child(2){margin-left:100px !important;}
                    }
                    </style>`;
                let PbreakerCounter = 1;
                body = body + `<div class="page-break" style="display:flex;flex:wrap;">`;
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    body = body + `<div class="twoCol" style="max-width:calc(100%); min-width(100%); padding-top:10px; margin-left:10px; font-size:13pt; font-family: Arial; font-weight:700;">
                                <b style="font-size:16pt;">${this.companyProfile.NAME}</b><br/> <BR>
                                <img src ="${data[j].barcodeImage}" style="height:60px; width:250px; padding:1px 0; mode:svg;"/> <br/>
                                <b> ${bar.Item} </b><br/>
                                <b>MRP : </b> ${bar.MRP} <br/>`;
                                if( this.userProfile.CompanyInfo.COMPANYID.toLowerCase()!="shopaholic"){
                                body=body+`  <b> BEST BEFORE </b>`;
                                }
                                body=body+` <br/>
                               <b>PKT :  ${(this.datePipe.transform(new Date(), "yyyy-MM-dd"))}</b>
                                 </div> `
                    if (i % 2 == 0) {
                        body = body + ' </div> <p style="page-break-before: always">';
                        body = body + `<div style="display:flex;flex:wrap;">`
                    }
                    if (i == bar.PrintedQTY) {
                        body = body + '</div> <p style="page-break-before: always">';
                    }
                }
            }

            //50mmX38mm two bar code
            else if (this.printControl.value == 8 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                this.style1 = ` <style type = "text/css">
                    @page { size:120mm 39mm; margin: 0.0mm;}
                    @media print {
                    .twoCol:nth-child(2){margin-left:80px !important;}
                    }
                    </style>`;
                let PbreakerCounter = 1;
                body = body + `<div class="page-break" style="display:flex;flex:wrap;">`
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    body = body + `<div class="twoCol" style="max-width:calc(100%); min-width(100%); padding-top:10px; margin-left:20px; font-size:12pt; font-family: Arial; font-weight:600;">
                                <b>${this.companyProfile.NAME}</b><br/>
                                <b> ${bar.Item} </b><br/>
                                <b style="font-size:15pt">MRP :  ${bar.MRP}</b><br/>
                                <img src ="${data[j].barcodeImage}" style="height:60px; width:180px; padding:1px 0; mode:svg;"/> <br/>
                            <br/>
                                 </div> `
                    if (i % 2 == 0) {
                        body = body + ' </div> <p style="page-break-before: always">';
                        body = body + `<div style="display:flex;flex:wrap;">`
                    }
                    if (i == bar.PrintedQTY) {
                        body = body + '</div> <p style="page-break-before: always">';
                    }
                }
            }

            //50mmX25mm
            else if (this.printControl.value == 4 && (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true)) {
                console.log("50*25");
                this.style1 = ` <style type = "text/css">
            @page { size:200mm 50mm; margin: 0.2mm;}
            @media print {
            .twoCol:nth-child(2){margin-left:180px !important;}
            .threeCol:nth-child(3){margin-right:0 !important;}
            }
            </style>`;
                let PbreakerCounter = 1;
                body = body + `<div class="page-break" style="display:flex;flex:wrap; align-items:align-items:flex-start;  margin-bottom:10px !important;">`
                for (let i = 1; i <= bar.PrintedQTY; i++) {
                    var variants = <any>{};
                    if (typeof (bar.VARIANTDETAIL) == "string") {
                        variants = JSON.parse(bar.VARIANTDETAIL);
                    }
                    else {
                        variants = bar.VARIANTDETAIL;
                    }
                    if (variants == null) {
                        variants = <any>{};
                    }
                    body = body + `<div class="twoCol" style="max-width:calc(100%); min-width(100%); margin-left:50px; padding-top:20px; font-size:22pt; font-family: Arial;">
                        <b><span style="font-size:21pt;">${this.companyProfile.NAME}</span></b><br/>
                        <b>${variants.CATEGORY_3 == null || undefined ? '' : variants.CATEGORY_3.NAME} </b>  <br/>
                        <b> Style :</b>  <b> ${bar.Item.substring(0, 12)} </b><br/>
                        <b>MRP : </b>  <b>${bar.MRP}</b>
                        <b><span style="padding-left:20px;">${variants.CATEGORY_4 == null ? '' : variants.CATEGORY_4.VARIANTNAME} : </b><b> ${variants.CATEGORY_4.NAME}</b></span><br/>
                       <img src ="${data[j].barcodeImage}" style="height:100px; width:450px; padding:1px 0; mode:svg;"/>
                         </div>`
                    if (i % 2 == 0) {
                        body = body + ' </div> <p style="page-break-before: always">';
                        body = body + `<div style="display:flex;flex:wrap;">`
                    }
                    if (i == bar.PrintedQTY) {
                        body = body + '</div><p style="page-break-before: always">';
                    }
                }
            }
            j++;
        }

        //two-bar-code-in-a-row

        // for (let bar of this.barcodeModels) {
        //     let PbreakerCounter = 1;
        //     body = body + `<div class="page-break" style="display:flex;flex:wrap;">`
        //     for (let i = 1; i <= bar.PrintedQTY; i++) {

        //         body = body + `<div class="twoCol" style="max-width:calc(50% - 20px); min-width(50% - 20px); margin-bottom:30px; margin-right:30px; font-size:13pt; padding-left:1rem;"><b>${this.companyProfile.NAME}</b>${bar.Item}<br>MRP:${bar.MRP},Exp.:${bar.ExpDate},<br>
        //             <img src ="${data[j].barcodeImage}" style="height:50px; width:180px; padding:3px 0; mode:svg;"/>
        //             <br>Bt:${bar.Batch}, S.P.:${this.limitDecimal(Number(bar.Rate))}</div>`
        //         if (i % 2 == 0) {
        //             body = body + '</div>';
        //             body = body + `<div class="page-break" style="display:flex;flex:wrap;">`
        //         }
        //         if (i == bar.PrintedQTY) {
        //             body = body + '</div>';
        //         }
        //     }
        //     j++;
        // }


        //three-bar-code-in-a-row

        // for (let bar of this.barcodeModels) {
        //     let PbreakerCounter = 1;
        //     body = body + `<div class="page-break" style="display:flex;flex:wrap;">`
        //     for (let i = 1; i <= bar.PrintedQTY; i++) {

        //         body = body + `<div class="threeCol" style="max-width:calc(33% - 20px); min-width(33% - 20px); margin-bottom:30px; margin-right:30px; font-size:13pt; padding-left:1rem;"><b>${this.companyProfile.NAME}</b>${bar.Item}<br>MRP:${bar.MRP},Exp.:${bar.ExpDate},<br>
        //             <img src ="${data[j].barcodeImage}" style="height:50px; width:180px; padding:3px 0; mode:svg;"/>
        //             <br>Bt:${bar.Batch}, S.P.:${this.limitDecimal(Number(bar.Rate))}</div>`
        //         if (i % 3 == 0) {
        //             body = body + '</div>';
        //             body = body + `<div class="page-break" style="display:flex;flex:wrap;">`
        //         }
        //         if (i == bar.PrintedQTY) {
        //             body = body + '</div>';
        //         }
        //     }
        //     j++;
        // }
        return body + `</div></td>
        </tr> </tbody>`

    }

    private footerCustomize(data) {

        let tfoot = ""
        tfoot = tfoot + `
                        <tfoot>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        </tfoot>`

        return tfoot;

    }


    printBarcode(loadSheetData) {

        let popupWin;
        let tableData = `
        <style>

        </style>
        <table *ngIf="itemDetail" style='font-size: 10px;
                border-collapse: collapse;border-top: none;'>`
        let head = "";
        let body = `<p style="page-break-before: always">` + this.bodyCustomize(loadSheetData)

        // console.log(body);
        let footer = "";
        tableData = tableData + head + body + footer
        popupWin = window.open('', '_blank', 'top=-10px,left=0,height=auto,width=auto');
        popupWin.document.write(this.style1 + `
            <html> <head>
            <title>Load Sheet</title>
            <style>
            td{
              padding:2px;
            }
            </style>
            </head>
            <body onload="window.print();window.close()">
            ${tableData}

            </body>
              </html>`
        );
        popupWin.document.close();
    }



    print(barcodeList: any[] = [], barcodeModels: any[] = [], printFrom: number = 0) {
        console.log("bar code model in array ", this.barcodeModels);

        //option for exterbracode design print
        let isCustomizedPrintDesignerPrint = false;
        if (this.externalBarcodePrintProfile != null && this.externalBarcodePrintProfile.length > 0) {
            let printfor = this.externalBarcodePrintProfile.find(x => x.controlValue == this.printControl.value);
            if (printfor != null) {
                if (printfor.isCustomizedPrintDesignerPrint == true) {
                    let checkedbarcodelist = this.barcodeModels.filter(r => r.checkFlagEAN == true || r.checkFlagEAN == 1);
                    if (checkedbarcodelist.length == 0) { this.alertService.info("Please check for printing barcodes.."); return; }
                    this.loadingService.show("Downloading Sample. Please Wait...");

                    this.masterService.downloadRdlcPdf([{
                        printControlValue: printfor.controlValue,
                        barcodemodelForPrint: checkedbarcodelist,
                        companyId: this._trnMainService.TrnMainObj.COMPANYID

                    }], '/webHtmlDesignerPdfBarcode', printfor.profileNameLabel)
                        .subscribe(
                            (data: any) => {
                                this.loadingService.hide();
                                // this.masterService.downloadFile(data);
                                const blobUrl = URL.createObjectURL(data.content);
                                const iframe = document.createElement('iframe');
                                iframe.style.display = 'none';
                                iframe.src = blobUrl;
                                document.body.appendChild(iframe);
                                iframe.contentWindow.print();

                            },
                            (error) => {
                                this.alertService.error(error._body);
                                this.loadingService.hide();
                            }
                        );
                    return;
                };
            }
        }

        this.promptPrintDevice = false;
        var itemCodeList = [];
        for (let bar of this.barcodeModels) {
            if (bar.checkFlagEAN == 1 || bar.checkFlagEAN == true) {
                itemCodeList.push(bar.BarCode);
            }
        }

        if (printFrom == 1) {
            if (barcodeList.length) itemCodeList = barcodeList;
            if (barcodeModels.length) this.barcodeModels = barcodeModels;
        }


        this.masterService.getBarcode(itemCodeList.filter(x => x != null && x != "")).subscribe((resdata) => {
            setTimeout(() => {
                this.printBarcode(resdata);
            }, 1000);

        });
    }

    onPrint() {

        var count = 0;
        var barcount = 0;
        this.barcodeModels.forEach(r => {
            if (r.checkFlagEAN == 1 || r.checkFlagEAN == true) {
                if (r.BarCode == "" || r.BarCode == null || r.BarCode == undefined) {
                    barcount = barcount + 1;
                }
                count = count + 1;
            }
        })
        if (count == 0) {
            this.alertService.warning("Choose at least one item"); return;
        }
        if (barcount > 0) {
            this.alertService.warning("Generate barcode first"); return;
        }
        this.promptPrintDevice = true;

    }

    printSeletcted() {
        this.print();
    }

    cancelprint() {
        this.promptPrintDevice = false;
    }

    onItemSelect(event, bar) {

        this.barcodeModels[this.activerowIndex].Code = event.MCODE;
        this.barcodeModels[this.activerowIndex].Item = event.DESCA;
        this.barcodeModels[this.activerowIndex].Stock = event.Quantity;
        if (event.InclusiveOfTax == 1) {
            this.barcodeModels[this.activerowIndex].Rate = event.IN_RATE_A;

        }
        else {
            this.barcodeModels[this.activerowIndex].Rate = event.RATE;

        }
        this.barcodeModels[this.activerowIndex].MRP = event.MRP;
        this.barcodeModels[this.activerowIndex].CONFACTOR = event.CONFACTOR;
        this.barcodeModels[this.activerowIndex].ALTUNIT = event.ALTUNIT;
        this.barcodeModels[this.activerowIndex].BarCode = event.BARCODE;
        this.masterService.focusAnyControl('batch' + this.activerowIndex);
    }

    genBarCode() {
        var count = 0;
        if (this.barcodeModels[0].Code == null || this.barcodeModels[0].Code == "" || this.barcodeModels[0].Code == undefined) {
            this.alertService.warning("Load item first");
            return;
        }
        this.barcodeModels.forEach(r => {
            if (r.checkFlagEAN == 1) {
                count = count + 1;
            }
        })
        if (count == 0) {
            this.alertService.warning("Check at least one item");
            return;
        }
        var context = this;
        this.barcodeModels.forEach(function (it, i) {
            if (it.checkFlagEAN == 1) {

                context.generateString(context.responseData[i], i);
            }
        })
    }

    onItemDoubleClick(event) {
        console.log("click double click");
        this.barcodeModels = [];
        this.barcodeModels.push(<BarCodeModel>{})
        this.loadingService.show("Please wait while loading invoice details");
        this.masterService.LoadTransaction(event.VCHRNO, event.DIVISION, event.PhiscalID, "VIEW").subscribe(
            data => {

                if (data.status == "ok") {
                    this.loadingService.hide();
                    var count = 0;
                    this.responseData = data.result.ProdList;
                    data.result.ProdList.forEach(el => {
                        this.activerowIndex = count;
                        if (this.activerowIndex > 0) {
                            this.barcodeModels.push(<BarCodeModel>{})
                        }


                        if (this.getBarcode(el, this.activerowIndex) == el.BC) {
                            this.barcodeModels[this.activerowIndex].BarCode = el.BC;
                            this.barcodeModels[this.activerowIndex].checkFlagEAN = true;
                        }
                        this.barcodeModels[this.activerowIndex].Code = el.MCODE;
                        this.barcodeModels[this.activerowIndex].Item = el.SELECTEDITEM.DESCA;
                        this.barcodeModels[this.activerowIndex].Batch = el.BATCH;
                        this.barcodeModels[this.activerowIndex].Stock = el.Quantity;
                        this.barcodeModels[this.activerowIndex].QTY = el.Quantity;
                        this.barcodeModels[this.activerowIndex].ExpDate = el.EXPDATE;
                        this.barcodeModels[this.activerowIndex].Rate = el.SPRICE;
                        this.barcodeModels[this.activerowIndex].MRP = el.MRP;
                        this.barcodeModels[this.activerowIndex].CONFACTOR = el.CONFACTOR;
                        //this.barcodeModels[this.activerowIndex].BarCode = el.BarCode;
                        this.barcodeModels[this.activerowIndex].PrintedQTY = el.Quantity;
                        //this.barcodeModels[this.activerowIndex].checkFlagEAN = el.checkFlagEAN;
                        this.barcodeModels[this.activerowIndex].VARIANTLIST = el.VARIANTLIST;
                        this.barcodeModels[this.activerowIndex].VARIANTDETAIL = el.VARIANTLIST;
                        this.barcodeModels[this.activerowIndex].VCHRNO = el.VCHRNO;
                        this.barcodeModels[this.activerowIndex].UUID = el.UUID;
                        this.barcodeModels[this.activerowIndex].BCODEID = el.BCODEID;
                        this.barcodeModels[this.activerowIndex].PhiscalID = el.PhiscalID;
                        this.barcodeModels[this.activerowIndex].PRATE = el.PRATE;
                        this.barcodeModels[this.activerowIndex].MFGDATE = el.MFGDATE;
                        this.barcodeModels[this.activerowIndex].DIVISION = el.DIVISION;
                        this.barcodeModels[this.activerowIndex].UNIT = el.UNIT;
                        this.barcodeModels[this.activerowIndex].ALTUNIT = el.ALTUNIT;
                        this.barcodeModels[this.activerowIndex].BID = el.BATCHID;
                        this.barcodeModels[this.activerowIndex].HSNCODE = el.SELECTEDITEM.HSNCODE;
                        this.barcodeModels[this.activerowIndex].Sno = this.activerowIndex + 1;
                        //this.generateString(el);
                        this.masterService.focusAnyControl('batch' + this.activerowIndex);
                        count = count + 1;
                        this.showTransactionType = false;

                    });
                    this.selectTransType = "";
                    // console.log("load value ",this.barcodeModels);
                    this.selectTransType = "";
                } else {
                    this.loadingService.hide();
                }
            },
            error => {
                this.loadingService.hide();
                this.alertService.error(error._body);
            },
            () => {
                this.loadingService.hide();
            }
        );
    }

    deleteRow(i) {
        if (confirm("Are you sure u you want to delete the Row?")) {
            if (this.barcodeModels.length == 1) {
                this.barcodeModels.splice(i, 1);
                // console.log(this.activerowIndex);
                this.newRow(i)
            } else {
                this.barcodeModels.splice(i, 1)
            }
            ///if(this.barcodeModels.length){}
        }
    }

    emptyRow(i) {
        this.barcodeModels[i].Code = "";
        this.barcodeModels[i].Item = "";
        this.barcodeModels[i].Batch = "";
        this.barcodeModels[i].Stock = "";
        this.barcodeModels[i].QTY = null;
        this.barcodeModels[i].ExpDate = null;
        this.barcodeModels[i].Rate = "";
        this.barcodeModels[i].MRP = null;
        this.barcodeModels[i].BarCode = "";
        this.barcodeModels[i].ConvType = "";
        this.barcodeModels[i].PrintedQTY = null;
        this.barcodeModels[i].VARIANTDETAIL = "";
    }

    keyPressOnly(event) {
        if (event.keyCode == 13 || event.keyCode == 9) {
            this.codeEnter();
        }
        else {
            event.preventDefault();
            return true;
        }
    }

    newRow(i) {
        let emptyRow = <BarCodeModel>{};
        this.activerowIndex = i;

        if (this.barcodeModels.some(
            x => x.Code == ""
        )) {
            return false;
        }

        emptyRow.Code = "";
        emptyRow.Item = "";
        emptyRow.Rate = "";
        emptyRow.QTY = null;
        emptyRow.ExpDate = null;
        emptyRow.Stock = "";
        emptyRow.MRP = null;
        emptyRow.BarCode = "";
        emptyRow.ConvType = "";
        emptyRow.PrintedQTY = null;

        this.barcodeModels.push(emptyRow);

        setTimeout(() => {
            this.masterService.focusAnyControl('code' + this.activerowIndex);
        }, 500);


    }

    saveRow(event, bar, i) {

        if (bar.Code == "") {
            return false;
        }
        else {

            this.newRow(i + 1);
        }

    }

    codeEnter() {

        this.genericGridBarcode.show();
    }

    rateEnter() {
        this.masterService.focusAnyControl('stock' + this.activerowIndex);
    }
    qtyEnter() {
        this.masterService.focusAnyControl('stock' + this.activerowIndex);
    }
    expdateEnter() {
        this.masterService.focusAnyControl('stock' + this.activerowIndex);
    }
    stockEnter() {
        this.masterService.focusAnyControl('mrp' + this.activerowIndex);
    }
    mrpEnter() {
        this.masterService.focusAnyControl('barcode' + this.activerowIndex);
    }
    barcodeEnter() {
        this.masterService.focusAnyControl('convtype' + this.activerowIndex);
    }
    convtypeEnter() {
        this.masterService.focusAnyControl('printedqty' + this.activerowIndex);
    }

    ngOnInit() {
        this.masterService.invoiceDetailSubject.subscribe((res) => {
            let params = {
                supcode: 'all',
                showstockqty: 1,
                warehouse: this._trnMainService.userProfile.userWarehouse,
                mcode: res.MCODE,
                prefix: this._trnMainService.TrnMainObj.VoucherAbbName,
                itemDivision: this._trnMainService.TrnMainObj.itemDivision,
                mcat: this._trnMainService.TrnMainObj.customerMCAT,

            }

            // this.masterService.masterPostmethod("/getItemDetailFromCode", params).subscribe((res) => {
            //     if (res.status == "ok") {
            //         this.dblClickPopupItem(res.result);
            //     } else if (res.status == "error") {
            //         this.alertService.error(res.result);
            //     }
            // });
        })
        this.getconfigParameter();
    }
    BatchTabClick(index) {
        this.itemVariantDetails = [];
        this.activerowIndex = index;
        this.masterService.RemoveFocusFromAnyControl("batch" + this.activerowIndex);
        let warehouse = this._trnMainService.userProfile.userWarehouse;
        this.masterService
            .masterPostmethod("/getBatchListOfItem", {
                mcode: this.barcodeModels[index].Code,
                //voucherprefix: this._trnMainService.TrnMainObj.VoucherPrefix,
                voucherprefix: 'TI',
                warehouse: warehouse
            })
            .subscribe(
                res => {
                    if (res.status == "ok") {
                        var varientdetails = JSON.parse(res.result);

                        // console.log('variantforbarcode--'varientdetails[0].VARIANTDETAIL);
                        //this.itemVariantDetails = JSON.parse(res.result.VARIANTDETAIL);
                        // console.log(this.itemVariantDetails);
                        this._trnMainService.batchlist = JSON.parse(res.result);
                        if (this._trnMainService.batchlist.length == 1 && this._trnMainService.AppSettings.ENABLEBATCHPREVIEW == "DISABLESINGLEBATCHPREVIEW") {
                            this.returnBatch(this._trnMainService.batchlist[0]);
                        }
                        else {
                            this.masterService.PlistTitle = "batchListold";
                        }

                    } else {
                        this.alertService.error("Error on getting BatchList Of Item ")
                    }
                },
                error => {
                    this.alertService.error(error)
                }
            );
        return false;
    }


    returnBatch(value) {
        this.barcodeModels[this.activerowIndex].Batch = value.BATCH;
        this.barcodeModels[this.activerowIndex].MRP = value.MRP;
        this.barcodeModels[this.activerowIndex].ExpDate = value.EXPIRY;
        this.barcodeModels[this.activerowIndex].PrintedQTY = value.STOCK;
        this.barcodeModels[this.activerowIndex].BCODEID = value.BCODEID;

        this.barcodeModels[this.activerowIndex].VARIANTDETAIL = JSON.stringify(value.VARIANTDETAIL);
        if (value.InclusiveOfTax == 1) {
            this.barcodeModels[this.activerowIndex].Rate = value.IN_RATE_A;
        }
        else {
            this.barcodeModels[this.activerowIndex].Rate = value.RATE_A;
        }
        let rate1 = Number(this.barcodeModels[this.activerowIndex].Rate);
        let rate2 = 0;
        this.masterService.focusAnyControl('rate' + this.activerowIndex);
        this.masterService.PlistTitle = "";
        this.responseData[this.activerowIndex] = value;
    }

    dblClickPopupBatch(value) {

        // console.log("batch double click value ", value);
        //console.log(value.VARIANTDETAIL);
        //this.generateString(value,this.activerowIndex);
        this.returnBatch(value);

    }

    model1Closed() {
        this.masterService.PlistTitle = "";
    }



    onSave() {
        var count = 0;
        var barcount = 0;
        var itemforSave = [];
        console.log("bar code MOdel data ", this.barcodeModels);
        // return;
        this.barcodeModels.forEach((r, i) => {
            console.log(r.VARIANTLIST);
            if (r.checkFlagEAN == 1 || r.checkFlagEAN == true) {
                if (r.BarCode != "" && r.BarCode != null && r.BarCode != undefined) {
                    barcount = barcount + 1;
                    if (r.VARIANTDETAIL != null || r.VARIANTDETAIL != null) {
                        r.VARIANTLIST = JSON.stringify(r.VARIANTLIST);
                        r.VARIANTDETAIL = JSON.stringify(r.VARIANTDETAIL);
                    }
                    itemforSave.push(r);
                }
                count = count + 1;
            }
        })
        if (count == 0) {
            this.alertService.warning("Choose at least one item"); return;
        }
        if (barcount == 0) {
            this.alertService.warning("Generate barcode first"); return;
        }
        try {
            this.loadingService.show("Please wait....");
            console.log(itemforSave);
            this.masterService.masterPostmethod('/addIteminBarCode', JSON.stringify(itemforSave)).subscribe(res => {
                if (res.status == "ok") {
                    this.loadingService.hide();
                    this.alertService.warning(res.message);
                }
                else {
                    this.loadingService.hide();

                    this.alertService.error(res.result);
                }
            });
        }
        catch (e) {
            this.loadingService.hide();
            console.log(e);
        }

    }

    // generateString(val, ind) {
    //     
    //     console.log(val);
    //     var valKey = [];
    //     var variantKey = [];
    //     var barcodeString = [];
    //     valKey = Object.keys(val);
    //     if (val.VARIANTDETAIL == null || val.VARIANTDETAIL == undefined) {
    //         // this.alertService.warning("Bar code not generated. Due to variant not available");
    //         // return;
    //     } else {
    //         this.itemVariantDetails = val.VARIANTDETAIL;
    //         variantKey = Object.keys(val.VARIANTDETAIL);
    //     }

    //     // if(this.itemVariantDetails.length <= 0){
    //     //     this.alertService.warning("Bar code not generated");
    //     // }else{

    //     //  console.log(this.configCodeParams);
    //     this.configCodeParams.forEach((cp) => {

    //         if (cp.VARIANTNAME == null || cp.VARIANTNAME == "" || cp.VARIANTNAME == undefined) {
    //             for (let a = 0; a < valKey.length; a++) {
    //                 if (cp.DbColumn.includes(valKey[a])) {
    //                     var bcodeval;
    //                     if (val[valKey[a]] == "" || val[valKey[a]] == null) { } else {
    //                         if (val[valKey[a]].length < cp.ParaMaxLength) {
    //                             //console.log('string length short');
    //                             bcodeval = this.zeroPad(val[valKey[a]], cp.ParaMaxLength);
    //                         } else {
    //                             //console.log(val[valKey[a]]);
    //                             bcodeval = val[valKey[a]].toString().slice(-parseInt(cp.ParaMaxLength));
    //                         }
    //                         barcodeString.push(bcodeval.replace(/[^A-Z0-9]/ig, ""));
    //                     }
    //                 } else { }
    //             }

    //         } else {
    //             for (let a = 0; a < variantKey.length; a++) {
    //                 if (cp.ParameterTitle == variantKey[a]) {
    //                     let bcodeval = val.VARIANTDETAIL[variantKey[a]].VARIANTBARCODE.toString().slice(-parseInt(cp.ParaMaxLength));
    //                     barcodeString.push(this.zeroPad(bcodeval, cp.ParaMaxLength).replace(/[^A-Z0-9]/ig, ""));
    //                 }
    //             }
    //         }
    //         // console.log(this.barcodeString);

    //         // console.log(this.barcodeString.join(''));
    //         if (barcodeString.length > 0) {
    //             this.barcodeModels[ind].BarCode = barcodeString.join('');
    //             this.barcodeModels[ind].ConfigParaTitle = this.configCodeParams[0].ConfigParaTitle;
    //             //        this.loadingService.show("Code Generated Please Wait...");
    //             //        this.masterService.masterGetmethod(`/getGenerateConfigCode?barCodeString=${this.barcodeString.join('')}`).subscribe(res=>{
    //             //            if(res.status == 'ok'){
    //             //                this.loadingService.hide();
    //             //            }
    //             //        })

    //         } else {

    //         }

    //     });
    //     //console.log(this.configCodeParams);
    //     //}

    // }

    generateString(val, ind) {
        //
        val['Sno'] = (ind + 1).toString();
        console.log("input array ", val);
        var valKey;
        var variantKey = [];
        var barcodeString = [];
        valKey = Object.keys(val);
        // console.log("val key ", valKey);
        if (!valKey.includes('VARIANTLIST')) {
            if (valKey.includes('VARIANTDETAIL')) {
                val.VARIANTLIST = val.VARIANTDETAIL;
            }
        }

        if ((val.VARIANTLIST == null || val.VARIANTLIST == undefined)) {
            // this.alertService.warning("Bar code not generated. Due to variant not available");
            // return;
        } else {
            this.itemVariantDetails = val.VARIANTLIST;
            variantKey = Object.keys(val.VARIANTLIST);
        }





        // if(this.itemVariantDetails.length <= 0){
        //     this.alertService.warning("Bar code not generated");
        // }else{

        console.log("config bar code params ", this.configCodeParams);
        this.configCodeParams.forEach((cp) => {

            if (cp.VARIANTNAME == null || cp.VARIANTNAME == "" || cp.VARIANTNAME == undefined) {
                console.log("dbname ", cp.DbColumn);
                for (let a = 0; a < valKey.length; a++) {
                    if (cp.DbColumn.includes(valKey[a])) {
                        var bcodeval;
                        if (val[valKey[a]] == "" || val[valKey[a]] == null) { } else {
                            if (val[valKey[a]].length < cp.ParaMaxLength) {
                                //console.log('string length short');
                                bcodeval = this.zeroPad(val[valKey[a]], cp.ParaMaxLength);
                            } else {
                                //console.log(val[valKey[a]]);
                                bcodeval = val[valKey[a]].toString().slice(-parseInt(cp.ParaMaxLength));
                            }
                            barcodeString.push(bcodeval.replace(/[^A-Z0-9]/ig, ""));
                        }
                    } else { }
                }

            } else {
                for (let a = 0; a < variantKey.length; a++) {
                    if (cp.ParameterTitle == variantKey[a]) {

                        console.log("variantbarcode", val.VARIANTLIST[variantKey[a]].VARIANTBARCODE);
                        let bcodeval = val.VARIANTLIST[variantKey[a]].VARIANTBARCODE.toString().replace(/[^A-Z0-9]/ig, "").slice(-parseInt(cp.ParaMaxLength));
                        barcodeString.push(this.zeroPad(bcodeval, cp.ParaMaxLength).replace(/[^A-Z0-9]/ig, ""));
                    }
                }
            }
            // console.log(this.barcodeString);

            // console.log(this.barcodeString.join(''));
            if (barcodeString.length > 0) {
                this.barcodeModels[ind].BarCode = barcodeString.join('');
                this.barcodeModels[ind].ConfigParaTitle = this.configCodeParams[0].ConfigParaTitle;
                //        this.loadingService.show("Code Generated Please Wait...");
                //        this.masterService.masterGetmethod(`/getGenerateConfigCode?barCodeString=${this.barcodeString.join('')}`).subscribe(res=>{
                //            if(res.status == 'ok'){
                //                this.loadingService.hide();
                //            }
                //        })

            } else {

            }

        });
        //console.log(this.configCodeParams);
        //}

    }

    getBarcode(val, ind) {
        var barcode = "";
        val['Sno'] = (ind + 1).toString();
        console.log("input array ", val);
        var valKey;
        var variantKey = [];
        var barcodeString = [];
        valKey = Object.keys(val);
        // console.log("val key ", valKey);
        if (!valKey.includes('VARIANTLIST')) {
            if (valKey.includes('VARIANTDETAIL')) {
                val.VARIANTLIST = val.VARIANTDETAIL;
            }
        }

        if ((val.VARIANTLIST == null || val.VARIANTLIST == undefined)) {
            // this.alertService.warning("Bar code not generated. Due to variant not available");
            // return;
        } else {
            this.itemVariantDetails = val.VARIANTLIST;
            variantKey = Object.keys(val.VARIANTLIST);
        }


        // if(this.itemVariantDetails.length <= 0){
        //     this.alertService.warning("Bar code not generated");
        // }else{

        console.log("config bar code params ", this.configCodeParams);
        this.configCodeParams.forEach((cp) => {

            if (cp.VARIANTNAME == null || cp.VARIANTNAME == "" || cp.VARIANTNAME == undefined) {
                console.log("dbname ", cp.DbColumn);
                for (let a = 0; a < valKey.length; a++) {
                    if (cp.DbColumn.includes(valKey[a])) {
                        var bcodeval;
                        if (val[valKey[a]] == "" || val[valKey[a]] == null) { } else {
                            if (val[valKey[a]].length < cp.ParaMaxLength) {
                                //console.log('string length short');
                                bcodeval = this.zeroPad(val[valKey[a]], cp.ParaMaxLength);
                            } else {
                                //console.log(val[valKey[a]]);
                                bcodeval = val[valKey[a]].toString().slice(-parseInt(cp.ParaMaxLength));
                            }
                            barcodeString.push(bcodeval.replace(/[^A-Z0-9]/ig, ""));
                        }
                    } else { }
                }

            } else {
                for (let a = 0; a < variantKey.length; a++) {
                    if (cp.ParameterTitle == variantKey[a]) {

                        console.log("variantbarcode", val.VARIANTLIST[variantKey[a]].VARIANTBARCODE);
                        let bcodeval = val.VARIANTLIST[variantKey[a]].VARIANTBARCODE.toString().replace(/[^A-Z0-9]/ig, "").slice(-parseInt(cp.ParaMaxLength));
                        barcodeString.push(this.zeroPad(bcodeval, cp.ParaMaxLength).replace(/[^A-Z0-9]/ig, ""));
                    }
                }
            }
            // console.log(this.barcodeString);

            // console.log(this.barcodeString.join(''));
            if (barcodeString.length > 0) {
                barcode = barcodeString.join('');
            } else {

            }

        });
        return barcode;
        //console.log(this.configCodeParams);
        //}

    }

    zeroPad(num, len) {
        return num.toString().padStart(len, "0");
    }

    onKeydownOnBatch(event) {
        if (event.key === "Enter" || event.key === "Tab") { }
        else {
            event.preventDefault();
        }
    }

    BatchEnter(index) {
        this.BatchTabClick(index);
        return false;
    }

    getconfigParameter() {
        try {
            this.masterService.masterGetmethod('/selectDetailsofCode').subscribe(res => {
                if (res.status == "ok") {
                    this.configCodeParams = res.result;
                    console.log("this.configCodeParams", this.configCodeParams);
                } else {
                    this.alertService.warning("Config Code bar code for generate item bar code")
                }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

}

function moment(arg0: Date) {
    throw new Error('Function not implemented.');
}
