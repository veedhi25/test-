import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import * as moment from 'moment'
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
@Component(
    {
        selector: 'einvoice',
        templateUrl: './EInvoice.component.html',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => EInvoiceComponent),
                multi: true
            }
        ]

    }
)
export class EInvoiceComponent {

    calendarForm: FormGroup;
    invoiceType: string = "TI";
    invoiceStatus: string = "pending";
    DATE1: string | Date;
    DATE2: string | Date;
    INVOICELIST: any[] = [];
    constructor(private fb: FormBuilder, private masterService: MasterRepo, private spinnerService: SpinnerService, private alertService: AlertService) {
        this.calendarForm = this.fb.group({
            selectedDate: [{
                startDate: moment(),
                endDate: moment()
            }, Validators.required],
        });

        this.loadInvoices();
    }


    onInvoiceStatusChange() {
        this.loadInvoices();
    }

    loadInvoices() {
        let currentDate = this.calendarForm.value;
        this.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY');
        this.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY');
        let filterParam = {
            INVOICETYPE: this.invoiceType,
            FROM: this.DATE1,
            TO: this.DATE2,
            INVOICESTATUS: this.invoiceStatus
        }
        this.spinnerService.show("Please wait while getting data.");
        this.masterService.masterPostmethod("/getinvoicelistforeinvoice", filterParam).subscribe((res) => {
            this.spinnerService.hide();
            if (res.status == "ok") {
                this.INVOICELIST = res.result;
            } else {
                this.alertService.error(res.message);
            }
        }, error => {
            this.spinnerService.hide();
            this.alertService.error(error);
        })
    }

    onSelectAll = (event) => {
        if (event.target.checked) {
            this.INVOICELIST.forEach(x => x.STATUS = true);
        } else {
            this.INVOICELIST.forEach(x => x.STATUS = false);
        }
    }


    generateEInvoice() {
        let filterParam = this.INVOICELIST.filter(x => x.STATUS == true);
        this.spinnerService.show("Please wait while generating E-invoice.It may take a while.");
        this.masterService.masterPostmethod("/generateeinvoice", filterParam).subscribe((res) => {
            this.spinnerService.hide();
            if (res.status == "ok") {
                this.alertService.success(res.message);
            } else {
                this.alertService.error(res.result.message);
            }
        }, error => {
            this.spinnerService.hide();
            this.alertService.error(error);
        })
    }


  
}