import {
  Component, EventEmitter, Input, Output, Pipe, PipeTransform
} from "@angular/core";
import { VoucherTypeEnum } from "../../interfaces/TrnMain";
import { MasterRepo } from "../../repositories";
import { AlertService } from "../../services/alert/alert.service";
import { SpinnerService } from "../../services/spinner/spinner.service";
import { TransactionService } from "../../Transaction Components/transaction.service";
import { UserWiseTransactionFormConfigurationService } from "./user-wise-transaction-form-configuration.service";

@Component({
  selector: "user-wise-transaction-form-configuration",
  templateUrl: "./user-wise-transaction-form-configuration.component.html",
})
export class UserWiseTransactionFormConfigurationComponent {


  isActive: boolean = false;
  columnsList: { formName: string; voucherType: VoucherTypeEnum; columns: { LABELVALUE: string; HEADERKEY: string; CONTROLVALUE: boolean; CONTROLID: string; ISFOCUS: boolean; ISMANDATORY: boolean; FOCUSTO: string, SHOWFOCUS: boolean }[]; };
  @Output() updateGridConfigAfterSave = new EventEmitter();


  constructor(private _alertService: AlertService, private _spinnerService: SpinnerService, private _confService: UserWiseTransactionFormConfigurationService, private _masterRepo: MasterRepo) {

  }




  show = (voucherType: VoucherTypeEnum) => {


    this._masterRepo.masterGetmethod_NEW(`/getGridConfiguration?voucherType=${voucherType}`).subscribe((res) => {
      if (res.status == "ok") {
        this.columnsList = res.result;
        this.isActive = true;
        ($('#userwisetransactionconf') as any).modal('show');

      } else {
        let list: any = this._confService.resolveAndLoadConfiguration(voucherType);
        for (let e of list) {
          if (e.ISFOCUS == undefined) {
            e.ISFOCUS = true
          }
        }
        this.columnsList = list;
        this.isActive = true;
        ($('#userwisetransactionconf') as any).modal('show');
      }
    }, error => {

    });

  }
  hide = () => {

    this.isActive = false;
    ($('#userwisetransactionconf') as any).modal('hide');

  }


  onSaveClicked = () => {
    this._spinnerService.show("please wait while Saving grid Configuration");
    this._masterRepo.masterPostmethod_NEW("/savegridconfiguration", this.columnsList).subscribe((res) => {
      if (res.status == "ok") {
        this._spinnerService.hide();
        this._alertService.success("saved Successfully.");
        ($('#userwisetransactionconf') as any).modal('hide');
        this.updateGridConfigAfterSave.emit(this.columnsList.columns);

      } else {
        this._spinnerService.hide();
        this._alertService.error(res.result);
      }
    }, error => {
      this._spinnerService.hide();
      this._alertService.success(error._body);
    })
  }


}




@Pipe({
  name: 'filterFocusOption',
  pure: true
})
export class FilterOptionFocus implements PipeTransform {
  constructor(public _trnMainService: TransactionService) {
  }




  transform(columnsList: any[], columnName: string,): any[] {


    return columnsList.slice(columnsList.findIndex(x => x.LABELVALUE == columnName) + 1).filter(x => x.SHOWFOCUS == true);
  }



}
