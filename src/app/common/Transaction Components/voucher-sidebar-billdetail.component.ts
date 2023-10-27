import { TransactionService } from "./transaction.service";
import { Component, OnInit } from "@angular/core";
import { MasterRepo } from "../repositories/masterRepo.service";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { AlertService } from "../services/alert/alert.service";
import { AuthService } from "../services/permission/authService.service";
import { AppSettings } from "../services";
import { voucherseries, VoucherTypeEnum } from "../interfaces/TrnMain";
@Component({
  selector: "voucher-sidebar-billdetail",
  templateUrl: "./voucher-sidebar-billdetail.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class VoucherSidebarBillDetailComponent implements OnInit {

  hideShow: boolean = false;
  salesprefixes: voucherseries[] = [];
  constructor(
    public masterService: MasterRepo,
    public _trnMainService: TransactionService,
    private _hotkeysService: HotkeysService,
    private alertService: AlertService,
    private authservice: AuthService,
    public appSetting: AppSettings

  ) {
    this.masterService.getList({}, "/getVoucherSeries")
      .subscribe(res => {

        this._trnMainService.voucherSeries = res;
        if (this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.TaxInvoice) {
          this.salesprefixes = res.filter(x => x.vouchertype == VoucherTypeEnum.TaxInvoice);
        }
      }, error => {
        console.log("getting series error:", error._body);
      }
      )

  }

  ngOnInit() {

    this._hotkeysService.add(
      new Hotkey(
        "f10",
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          this.hideShow = !this.hideShow;
          return false;
        }
      )
    );
  }



  setTrnDate(value) {

    if (this.masterService.ValidateDate(value)) {
      this._trnMainService.TrnMainObj.TRNDATE = this.masterService.changeIMsDateToDate(value);
    } else {
      this.alertService.error(`Invalid date `);
    }

  }

  getTrnDate() {
    if (this._trnMainService.TrnMainObj.TRNDATE) {
      return this.masterService.customDateFormate(this._trnMainService.TrnMainObj.TRNDATE.toString());
    }
  }

}
