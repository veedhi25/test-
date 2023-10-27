
import { TransactionService } from "./transaction.service";
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";


@Component({
  selector: "scheme-offer",
  templateUrl: "./scheme.component.html",
})
export class SchemeComponent implements OnInit {
  @Input() activeIndex: number;
  @Input() showScheme: boolean = false;
  selectedRowIndex: number = 0;
  @Output() onSchemeApplyEmitted = new EventEmitter();
  constructor(public _trnMainService: TransactionService) {
  }

  ngOnInit() {
  }



  onSchemeApply() {
    this.onSchemeApplyEmitted.emit("apply");
    this._trnMainService.showSchemeOffer=false;
  }
  onSchemeCancel() {
    this.onSchemeApplyEmitted.emit("cancel");
    this._trnMainService.showSchemeOffer=false;
  }
}
