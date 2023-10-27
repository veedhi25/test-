import { Component, OnInit } from "@angular/core";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment'

@Component({
    selector: "sales-invoice-delivery",
    templateUrl: "./sales-invoice-delivery.component.html",
    providers: [TransactionService],
})
export class SalesOrderDeliveryComponent implements OnInit {
    public pageNumber = 1;
    public source: any;
    public Header = ["Invoice No", "Invoice Date", "Customer Name", "Invoice Amount", "Status"];

    calendarForm: FormGroup;
    ranges: any;
    filterparam: any = {
        from: "",
        to: ""
    };
    constructor(public masterService: MasterRepo, public _transactionService: TransactionService, private fb: FormBuilder, private alertService: AlertService, private loadingService: SpinnerService) {
        this.calendarForm = this.fb.group({
            selectedDate: [{
                startDate: moment(),
                endDate: moment()
            }, Validators.required],
        });
        this.ranges = this.masterService.dateFilterRange;
    }


    ngOnInit() {
        this.refresh();

    }

    load() {
        this.refresh();
    }


    onPageChangedEvent(pageNumber) {
        this.pageNumber = pageNumber
        this.refresh();
    }


    refresh() {
        let currentDate = this.calendarForm.value;
        this.filterparam.from = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY');
        this.filterparam.to = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY');
        this.loadingService.show("Please wait.Getting invoices.")
        this.masterService.masterPostmethod(`/getsalesinvoice?currentPage=${this.pageNumber}&maxResultCount=10`, this.filterparam).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.source = res.result;
            } else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error);
        }, () => {
            this.loadingService.hide();
        })
    }



    deliver() {
        if (this.source == null || this.source.data == null || !(this.source.data.length)) { return; }
        let checkedInvoices = [];
        for (var i of this.source.data.filter(x => x.isChecked)) {
            checkedInvoices.push(i);
        }
        if (!checkedInvoices.length) {
            this.alertService.warning("Please Select invoice to deliver");
            return;
        }
        this.loadingService.show("Please wait while delivering invoices.")
        this.masterService.masterPostmethod("/deliversalesinvoices", checkedInvoices).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.alertService.success(res.message);
                this.refresh();
            } else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();
            this.alertService.error(error);
        }, () => {
            this.loadingService.hide();
        })
    }
}
