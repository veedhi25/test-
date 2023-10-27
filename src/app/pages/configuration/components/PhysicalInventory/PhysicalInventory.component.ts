import { Component, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Http, Response, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment'
import { Subject } from 'rxjs';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { AuthService } from '../../../../common/services/permission';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GlobalState } from '../../../../global.state';
@Component(
    {
        selector: 'PhysicalInventory',
        templateUrl: './PhysicalInventory.component.html',       
    }
)
export class PhysicalInventorycomponent {
    
  ItemList: any[] = [];

    constructor(private fb: FormBuilder, 
        private masterService: MasterRepo,
        private spinnerService:SpinnerService,
        private alertService:AlertService,
        private http: Http,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private state: GlobalState) {
      
    }
    
    loadInvoices() {
      let filterParam = {      
    }
      this.spinnerService.show("Please wait while getting data.");
      this.masterService.masterPostmethod("/getAllMenuitemWithMCodeWiseStock",filterParam).subscribe((res)=>{
          this.spinnerService.hide();
          if(res.status=="ok"){
              this.ItemList = res.result;
          }else{
              this.alertService.error(res.message);
          }
      },error=>{
          this.spinnerService.hide();
          this.alertService.error(error);
      })
  }

  onSelectAll = (event) => {
      if (event.target.checked) {
          this.ItemList.forEach(x => x.STATUS = true);
      } else {
          this.ItemList.forEach(x => x.STATUS = false);
      }
  }


  updateInventorySelection(){
      let filterParam = this.ItemList.filter(x=>x.STATUS==true);
      this.spinnerService.show("Please wait while generating E-invoice.It may take a while.");
      this.masterService.masterPostmethod("/updatePhysicalInventoryItemSelection",filterParam).subscribe((res)=>{
          this.spinnerService.hide();
          if(res.status=="ok"){
              this.alertService.success(res.message);
          }else{
              this.alertService.error(res.message);
          }
      },error=>{
          this.spinnerService.hide();
          this.alertService.error(error);
      })
  }
}