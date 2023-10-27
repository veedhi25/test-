import { Component, ViewChild, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MasterRepo } from "../../../../../common/repositories";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { TransactionService } from "../../../../../common/Transaction Components/transaction.service";

@Component({
  selector: "denomination",
  templateUrl: "./denomination.html",
  providers: [TransactionService],
  styles: [
    `
    .GRNPopUp tbody tr:hover {
      background-color: #e0e0e0;
    }
    .GRNPopUp tr.active td {
      background-color: #123456 !important;
      color: white;
    }
    .modal-dialog.modal-md {
      top: 45%;
      margin-top: 0px;
    }

    .modal-dialog.modal-sm {
      top: 45%;
      margin-top: 0px;
    }

    .table-summary > tbody > tr > td {
      font-size: 12px;
      font-weight: bold;
    }

    .table-summary > tbody > tr > td:first-child {
      text-align: left !important;
    }
    `
  ]
})
export class DenominationComponent implements OnInit, OnChanges {
  denoArray: any[] = [];
  denoList: any;
  total: number = 0;
  @Output() denominationEvent = new EventEmitter<any>();
  @Input() ExistingDenomination: any[] = [];
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private loadingService: SpinnerService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.ExistingDenomination != undefined && this.denoList != undefined) {
      
      this.denoList.map(d => {
        d.qty = 0;
      });
      this.denoList.map(a => {
        this.ExistingDenomination.map(b => {
          if (b.BASEVALUE == a.basevalue) {
            a.qty = b.QTY;

          }
        });
        this.calculateDenomination();
      });

    }
  }

  ngOnInit() {
    this.getDenoList();
  }
  getDenoList() {
    this.masterService.getDenominationList().subscribe((res: any) => {
      this.denoList = res.result;
    })
  }

  calculateDenomination() {
    this.total = 0;
    for (let d of this.denoList) {
      d.amount = this.masterService.nullToZeroConverter(d.qty) * this.masterService.nullToZeroConverter(d.basevalue);
      this.total = this.total + d.amount;
    }
    this.denominationEvent.emit(this.denoList)
  }
}
