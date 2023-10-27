import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import * as moment from 'moment'
@Component({
    selector: "quotation",
    templateUrl: "./quotation.component.html",
    providers: [TransactionService]
})
export class QuotationComponent {
    ItemList: any;
    QuotationMain: any;
    activerowIndex: number;
    constructor(
        private aroute: ActivatedRoute,
        private loadingService: SpinnerService,
        protected masterService: MasterRepo,
        private transactionService: TransactionService,
        private alertService: AlertService,
    ) {
        this.transactionService.initialFormLoad(65);
        
        this.aroute.queryParams.subscribe(params => {
            if (params.voucher) {
                let voucherNo = params.voucher;
                this.loadingService.show("Please wait.Getting Data...");
                this.masterService.masterGetmethod(`/loadRFQFromSenderDatabase?voucherNo=${voucherNo}&fromCompanyid=${params.FROMCOMPANY}`).subscribe(
                    (res) => {

                        this.loadingService.hide();
                        if (res.status == "ok") {
                            console.log(res.result);
                            this.QuotationMain = res.result;
                            this.ItemList = res.result.ItemList;
                            
                            this.transactionService.TrnMainObj.RFQValidity = res.result.RFQVALIDITY
                            this.transactionService.TrnMainObj.ExpDate = res.result.EXPECTEDDELIVERYDATE
                            this.transactionService.TrnMainObj.REFBILL = res.result.RFQNO
                            this.transactionService.TrnMainObj.REFBILLDATE = res.result.TRNDATE
                        }
                        else {
                            this.alertService.error(res.message);
                        }
                    },
                    (error) => {
                        this.alertService.error(error.message);
                    },
                    () => {
                    }
                );
            }
        });
    }

    transformDate(date) {
        return moment(date).format('YYYY/MM/DD')
    }
    OnQuantityEnter = (index: number) => {
        if (this.transactionService.nullToZeroConverter(this.ItemList[index].Indent) <= 0) {
            return false;
        } else {
            if (this.activerowIndex < this.ItemList.length) {
                this.activerowIndex = index + 1;
                let nextIndex = index + 1;
                setTimeout(() => {
                    if (document.getElementById("YourQuantity" + nextIndex)) {
                        document.getElementById("YourQuantity" + nextIndex).focus();
                    }
                }, 5);
            }
        }
    }
}