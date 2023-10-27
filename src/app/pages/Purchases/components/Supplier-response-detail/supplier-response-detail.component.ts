import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import * as moment from 'moment';
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";


class ForQuantity {
    supplierId: string;
    ItemCode: string;
    WantQty: number;

    constructor() {
        console.log('in for quantity constructor')
        this.ItemCode = '';
        this.supplierId = '';
        this.WantQty = 0;
    }
};
export interface qp {
    check: boolean;
    SupplierCOMPANYID: string;
    Mcode: string;
    ItemName: string;
    Quantity: string;
    OrderQuantity: Date;
    DeliveryDate: string;
    ItemRate: string;
    Dcrate: number;
    Dcamnt: number;
    DueDays: number;
    Rating: string;
    ItemRemarks: string;
    Supplieracid: string;
    SupplierName: string;
    AltUnit: string;
    NetAmount: number;

}

@Component({
    selector: 'supplier-response-detail',
    templateUrl: './supplier-response-detail.component.html'

})
export class SupplierResponseDetailComponent {


    @ViewChild("fileUploadPopupQT") fileUploadPopupQT: FileUploaderPopupComponent;
    fileUploadPopupSettingsQT: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

    SubmittedSuppliers: any[];
    RemainingSuppliers: any[];
    rfqno: string = "";
    SuppliersData: any;
    SubmittedQuotations: qp[] = [];
    ViewSubmittedQuotations: boolean = false;
    AllQuantities: ForQuantity[] = [];
    currentIndex: number = 0;

    constructor(private _masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService, private route: Router, private aroute: ActivatedRoute

    ) {

        console.log(this.route)
        this.aroute.params.subscribe(params => {
            console.log(params)
            if (params.rfqno) {
                this.rfqno = params.rfqno;
                console.log(this.rfqno);
                this.getRfqSupplierList(this.rfqno)
            }
            else {
                this.alertService.error('Please Select Rfqno First');
                return;
            }
        },
            (error) => {
                this.alertService.error(error)
            }
        );
    }

    FileUploadedQT(response) {
        if (response.status == 'ok') {
            //api to process uploaded file
            this.getRfqSupplierList(this.rfqno)
        }
        else {
            if (response.result == null && response.status == "error") {
                this.alertService.error(response.message)
            }
            else {
                this.alertService.error(response);
            }
        }
    }
    UploadExcel(i, supplier) {
        console.log('supplier', supplier)
        console.log('', supplier.supplieracid)
        this.fileUploadPopupSettingsQT = Object.assign(new FileUploaderPopUpSettings(),
            {
                title: "Import Quotation Invoice",
                uploadEndpoints: `/importFileForSave/QuotationInvoice/${this.rfqno}/${supplier.acid}`,
                sampleFileUrl: `/downloadSample/importFileForSave/QuotationInvoice/${this.rfqno}/${supplier.acid}`,
                allowMultiple: false,
                acceptFormat: ".CSV,.xlsx",
                filename: "QI_SampleFile"
            });

        this.fileUploadPopupQT.show();
    }
    //get list of all suppliers from Supplier rfq list for particular supplier
    getRfqSupplierList(rfqno) {
        this._masterService.masterGetmethod(`/getRfqSupplierList/?rfqno=${this.rfqno}`).subscribe(
            res => {
                if (res.status == "ok") {
                    this.SuppliersData = res.result;
                    this.SubmittedSuppliers = this.SuppliersData.SubmittedVendors
                    this.RemainingSuppliers = this.SuppliersData.NotRespondedVendors
                }
                else {
                    this.alertService.error(res.status)
                }
            },
            (error) => {
                this.alertService.error(error)
            }
        )
    }
    resendRFQ(i, supplier) {
        console.log('supplier', supplier)
        this._masterService.
            masterGetmethod(`/ResendRFQ?rfqno=${this.rfqno}&supplierid=${supplier.erpplantcode}&supplieracid=${supplier.acid}`).
            subscribe(
                res => {
                    if (res.status == 'ok') {
                        console.log(res);
                        res.result.forEach(e => {
                            this.alertService.error(`erpplantcode: ${e.Companyid} and errorMessage: ${e.ErrorMessage}`);
                        });

                    }
                    else {
                        if (res.result == null && res.status == "error") {
                            this.alertService.error(res.message)
                        }
                    }
                }
            )
    }
    CompareSubmittedQuotations() {
        var body = {
            SubmittedSuppliers:
                this.SubmittedSuppliers,
            rfqno: this.rfqno
        }

        this._masterService.masterPostmethod(`/GetAllSubmittedQuotations`, body).subscribe(
            res => {
                if (res.status == 'ok') {
                    this.ViewSubmittedQuotations = true
                    console.log(res);
                    console.log(this.ViewSubmittedQuotations)
                    res.result.lqm.forEach(s => {
                        s.ProdList.forEach(p => {
                            var e: qp = {
                                check: false,
                                SupplierCOMPANYID: s.COMPANYID,
                                Mcode: p.MCODE,
                                ItemName: p.ITEMDESC,
                                Quantity: p.QUANTITY,
                                OrderQuantity: p.ORDERQTY,
                                DeliveryDate: s.DELIVERYDATE,
                                ItemRate: p.RATE,
                                DueDays: s.CRPERIOD,
                                Rating: 'rating',
                                ItemRemarks: p.REMARKS,
                                Dcrate: p.DCRATE,
                                Dcamnt: p.DCAMNT,
                                Supplieracid: s.PARAC,
                                SupplierName: s.ACNAME,
                                AltUnit: p.ALTUNIT,
                                NetAmount: p.NETAMOUNT

                            }
                            this.SubmittedQuotations.push(e)

                        });
                        res.result.qfe.forEach(p => {
                            var e: qp = {
                                check: false,
                                SupplierCOMPANYID: '',
                                Mcode: p.Mcode,
                                ItemName: p.ItemDesc,
                                Quantity: p.Quantity,
                                OrderQuantity: p.OrderQty,
                                DeliveryDate: p.DeliveryDate,
                                ItemRate: p.rate,
                                Dcrate: p.DCRate,
                                Dcamnt: p.DCAmnt,
                                DueDays: p.CrPeriod,
                                Rating: 'rating',
                                ItemRemarks: p.Remarks,
                                Supplieracid: p.SupplierAcid,
                                SupplierName: p.SupplierName,
                                AltUnit: p.PackingSize,
                                NetAmount: p.NetAmount

                            }
                            this.SubmittedQuotations.push(e)
                        }

                        )
                    })


                }
            }
        )
    }
    transformDate(date) {
        return moment(date).format('YYYY/MM/DD')
    }
    getQuantity(event, itemcode: string) {
        try {
            console.log('getQuantity')
            console.log(event, '')
            console.log(this.AllQuantities)
            console.log(itemcode)
            if (this.AllQuantities != null) {
                this.AllQuantities.forEach(x => {
                    if (x.ItemCode == itemcode && x.supplierId == event.COMPANYID) {
                        if (x.WantQty != null) {
                            console.log(x.WantQty, 'x.WantQty')
                            return x.WantQty
                        }
                        else {
                            throw new Error(`Invalid Quantity For : ${itemcode} `);
                        }
                    }
                });
            }

            throw new Error(`Invalid ItemCode : ${itemcode} `);
        }
        catch (err) {
            console.error(err);
        }

        return 0;
    }
    setQuantity(event, itemcode: string, qty: number) {
        console.log('setQuantity')
        console.log(itemcode, qty)
        this.AllQuantities.forEach(x => {
            if (x.ItemCode == itemcode && x.supplierId == event.COMPANYID) {
                x.WantQty = qty;
                console.log(x.WantQty, 'WantQty')
            }
        });
    }
    CreatePO(event) {
        var body = {
            list: [],
            rfqno: this.rfqno
        }
        console.log(this.SubmittedQuotations)
        this.SubmittedQuotations.forEach(x => {
            if (x.check == true) {
                body.list.push(x)
            }
        })
        this._masterService.masterPostmethod(`/SaveApprovedQuotationsForPO`, body).subscribe(
            res => {
                if (res.Status == "ok") {
                    this.alertService.success(res.message)
                }
                else {
                    console.log(res.message)
                    this.alertService.error(res.message)
                }
            },
            error => {
                this.alertService.error(error)
            }
        );
    }

    resendMailAndEdiToAll() {
        var body: any;
        console.log('this.RemainingSuppliers', this.RemainingSuppliers);
        var errors: any[];
        let count = 0;
        body = {
            rfqno: this.rfqno,
            SupplierList: this.RemainingSuppliers
        };
        this._masterService.masterPostmethod(`/ResendRFQToMultipleVendors`, body).subscribe(
            res => {

                if (res.status == 'ok') {
                    console.log(res);
                    errors = res.result;
                    var errorString = "";
                    res.result.forEach(e => async function () {
                        count = count + 1;
                        console.log(count);
                        errorString = errorString + ", " + `erpplantcode: ${e.Companyid} and errorMessage: ${e.ErrorMessage}`;

                    });
                    this.alertService.error(errorString)
                    console.log('outside of loop', count);
                }
                else {
                    if (res.result == null && res.status == "error") {
                        this.alertService.error(res.message)
                    }
                    res.result.forEach(e => {
                        this.alertService.error(`erpplantcode: ${e.Companyid} and errorMessage: ${e.ErrorMessage}`);
                    });
                }
            }
        );
        if (errors != null && errors.length > 0) {
            errors.forEach(e => async function () {
                count = count + 1;
                console.log(count);
                await this.alertService.error(`erpplantcode: ${e.Companyid} and errorMessage: ${e.ErrorMessage}`)
            });
        }


    }


}