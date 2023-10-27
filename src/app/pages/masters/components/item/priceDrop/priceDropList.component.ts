import { Component, Injector } from '@angular/core';
import { ServerDataSource } from '../../../../../node_modules/ng2-smart-table/';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { MasterRepo } from '../../../../../common/repositories/masterRepo.service';
import { AppComponentBase } from '../../../../../app-component-base';
import { SpinnerService } from '../../../../../common/services/spinner/spinner.service';
import { ItemPriceChangeService } from '../Item-Price-Change/itemPriceChange.service';
import { AlertService } from '../../../../../common/services/alert/alert.service';
@Component({
  selector: 'UnitListSelector',
  templateUrl: './priceDropList.component.html',
  styleUrls: ["../../../../modal-style.css"],
})
export class PriceDropListComponent extends AppComponentBase {
  source: ServerDataSource;
  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },

    edit: {
      editButtonContent: '<i class="fa fa-pencil" title="Edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    view: {
      viewButtonContent: '<i class="fa fa-refresh" title="Sync"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    pager: {
      display: true,
      perPage: 10
    },
    delete: '',
    columns: {
      remarks: {
        title: 'Tag',
        type: 'string'
      },
      edate: {
        title: 'Entry Date',
        type: 'string'
      },
      noofdays: {
        title: 'No of Days',
        type: 'string'
      },
      fromDate: {
        title: 'From Date',
        type: 'string'
      }
      ,
      toDate: {
        title: 'To Date',
        type: 'string'
      }


    }
  };
  constructor(public injector: Injector, private loadingSerive: SpinnerService, private alertService: AlertService,
    public router: Router, public dialog: MdDialog, private masterService: MasterRepo, public service: ItemPriceChangeService) {
    super(injector)
    try {
      let apiUrl = `${this.apiUrl}/getAllPriceDropsPaged`;
      this.source = new ServerDataSource(this._http,
        {
          endPoint: apiUrl,
          dataKey: "data",
          pagerPageKey: "currentPage",
          pagerLimitKey: "maxResultCount"
        });


    } catch (ex) {
      alert(ex);
    }
  }


  onEditClick(event): void {
    try {
      this.router.navigate(["./pages/masters/item/priceDrop/addPriceDrop", { tag: event.data.remarks, mode: "edit", returnUrl: this.router.url }]);

    } catch (ex) {
      alert(ex);
    }
  }

  onViewClicked(event) {
    this.loadingSerive.show("Syncing data please wait..")
    this.masterService.masterGetmethod_NEW(`/syncPriceDropToOutlet?priceId=${event.data.remarks}`).subscribe((res: any) => {
      this.loadingSerive.hide();
      if (res.status == "ok") {
        this.alertService.success("Success. Data sync initiated. It may take a while to reflect on all outlets.Please have patience.")
      }
    }, error => {
      this.loadingSerive.hide();
      this.alertService.error(error.statusText);
    })
  }

  AddNewPriceDrop() {
    try {

      this.router.navigate(["./pages/masters/item/priceDrop/addPriceDrop", { mode: "add", returnUrl: this.router.url }])

    } catch (ex) {
      alert(ex);
    }
  }

  syncPriceDropToOutlet() {
    this.loadingSerive.show("Syncing data please wait..")
    this.masterService.masterGetmethod_NEW("/syncPriceDropToOutlet").subscribe((res: any) => {
      this.loadingSerive.hide();
      if (res.status == "ok") {
        this.alertService.success("Success. Data sync initiated. It may take a while to reflect on all outlets.Please have patience.")
      }
    }, error => {
      this.loadingSerive.hide();
      this.alertService.error(error.statusText);
    })
  }

  enableSyncOutlet() {
    let userprofiles = this.masterService.userProfile;
    if (userprofiles && userprofiles.CompanyInfo.isHeadoffice == 1) {
      return true;
    }
    return false;
  }



}

