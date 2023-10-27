
import { TransactionService } from "./transaction.service";
import {Component,OnInit,Input,OnChanges} from "@angular/core";
import {VoucherTypeEnum} from "../interfaces/TrnMain";
import { MasterRepo } from "../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "sales-history",
  templateUrl: "./sales-history.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class SalesHistoryComponent implements OnInit, OnChanges {
  @Input() activeIndex: number;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};
  isminimized: boolean = false;

  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService

  ) {

  }

  ngOnInit() {
  }

  ngOnChanges(currentChanges) {
    this.activeIndex = currentChanges.activeIndex.currentValue;

  }

  OnMiniMizeClick() {
    this.isminimized = !this.isminimized;

    if (this.isminimized) {
      document.getElementById("history-main-layer").style.bottom = "20vh";
      document.getElementById("history-main--detail-layer").style.height = "70vh";

    } else {
      document.getElementById("history-main-layer").style.bottom = "5vh";
      document.getElementById("history-main--detail-layer").style.height = "20vh";


    }
  }

  ngOnDestroy() {
    try {
      this.subscriptions.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    } catch (ex) {
      console.log({ OnDestroyVoucherDate: ex });
    }
  }
  onKeydownPreventEdit(event) {

    event.preventDefault();


  }
}
