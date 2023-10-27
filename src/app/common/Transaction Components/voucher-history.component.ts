
import { TransactionService } from "./transaction.service";
import { Component, OnInit, Input } from "@angular/core";
import { TrnMain, VoucherTypeEnum } from "./../interfaces/TrnMain";
import { FormGroup } from "@angular/forms";
import { MasterRepo } from "./../repositories/masterRepo.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "voucher-history",
  templateUrl: "./voucher-history.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class VoucherHistoryComponent implements OnInit {
  @Input() activeIndex: number;
  transactionType: string; //for salesmode-entry options
  mode: string = "NEW";
  product: string = 'Parle G';
  modeTitle: string = "";
  TrnMainObj: TrnMain = <TrnMain>{};
  form: FormGroup;
  AppSettings;
  pageHeading: string;
  showOrder = false;
  voucherType: VoucherTypeEnum;
  subscriptions: any[] = [];
  tempWarehouse: any;
  userProfile: any = <any>{};


  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService

  ) {

  }

  ngOnInit() {
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

  isminimized: boolean = false;


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

}
