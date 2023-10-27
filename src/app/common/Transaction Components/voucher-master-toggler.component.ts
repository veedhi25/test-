import { Component, OnInit, HostListener, ChangeDetectorRef } from "@angular/core";
import { MasterRepo } from "../repositories/masterRepo.service";
;

@Component({
  selector: "voucher-master-toggler",
  templateUrl: "./voucher-master-toggler.component.html",
  styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class VoucherMasterTogglerComponent implements OnInit {
  constructor(
    public masterService: MasterRepo,
    public cd:ChangeDetectorRef
  ) {
    this.masterService.ShowMore = true;
  }

  ngOnInit() { }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ShowMore() {
    this.masterService.ShowMore = !this.masterService.ShowMore;
  }

  nullToZeroConverter(value) {
    if (value == undefined || value == null || value == "") {
      return 0;
    }
    return parseFloat(value);
  }


  @HostListener("document : keydown", ["$event"])
  handleKeyDownboardEvent($event: KeyboardEvent) {
    if ($event.code == "F1") {
      $event.preventDefault();
      this.ShowMore();
    }
  }
}
