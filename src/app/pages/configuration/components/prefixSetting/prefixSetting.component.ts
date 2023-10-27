
import {Component} from '@angular/core';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';


@Component({
    selector: 'prefixSetting',
    templateUrl: './prefixSetting.component.html',
    // styleUrls: ['./prefixSetting.component.styl']
})

export class PrefixSettingComponent {
  PrefixSettingObj:PrefixSetting=<PrefixSetting>{};

  Prefix:string;
  SeriesName: string;
  public prefixList: PrefixSetting[];
  rowIndex = 0;



  constructor(
    public masterService: MasterRepo,
    public alertService: AlertService,
    public loadingService: SpinnerService
  ){

    this.prefixList = [] as Array< PrefixSetting>;

    }

  addVoucher(){
    if(this.Prefix == null || this.Prefix == '' || this.Prefix == undefined){
      this.alertService.warning('Please enter the prefix and Series name');
    }else{
      this.prefixList.push({
        vseries_id: this.Prefix,
        vseries_name: this.SeriesName,
        voucher_id: "TI",
        vouchertype:"14"
    });
    }
    this.Prefix='',
    this.SeriesName=''

    // console.log('value',this.prefixList);
  }

  rowClick(x){
    this.rowIndex=x;
    console.log(x);
  }

  Delete(x) {
    this.prefixList.splice(x);

  }
  saveVoucher(){
    this.loadingService.show("SAVING DATA");
    this.masterService.masterPostmethod_NEW("/updateVoucherSeriesList",this.prefixList).subscribe((data:any)=>{
      if(data.status== "ok"){
        this.loadingService.hide();
        this.alertService.success(data.result);
      }else{
        this.loadingService.hide();
        this.alertService.error('Saving Failed');
      }
  })
  }

ngOnInit(){
  this.masterService.masterGetmethod_NEW("/VoucherSeriresList").subscribe((data:any)=>{
    this.prefixList = data.result;
  })


}

}
export interface PrefixSetting{
  voucher_id: string;
  vseries_name: string;
  vseries_id:string;
  vouchertype:string;
}
