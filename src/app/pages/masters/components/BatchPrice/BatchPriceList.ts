import { Component, Injector } from '@angular/core';
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!../../smartTables.scss';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';
import { AlertService } from '../../../../common/services/alert/alert.service';

@Component({
  selector: 'batchprice-list',
  templateUrl: './BatchPriceList.html',
  styleUrls: ["../../../modal-style.css"],
})
export class BatchPriceListComponent extends AppComponentBase{

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    view: {
      viewButtonContent: 'View',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<button type="button" class="btn btn-info">Edit</button>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '',
      confirmDelete: true
    },
    pager:{
      display:true,
      perPage:10
    },
    columns: {
      DESCA: {
        title: 'Item',
        type: 'string'
      },
      BCODE: {
        title: 'Barcode',
        type: 'string'
      },
      BATCHCODE: {
        title: 'Batch Code',
        type: 'string'
      }, 
      MRP: {
        title: 'MRP',
        type: 'string'
      }
    }
  };
  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(
    //private _authService: AuthService, 
    private router: Router, 
    public dialog: MdDialog,
    public injector : Injector,
    private alertService: AlertService
    ) {
      super(injector);
    try { 
      let apiUrl = `${this.apiUrl}/getAllBatchPricePagedList`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        }); 
     
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  addNewBatch(): void {
    try {
     
        this.router.navigate(["./pages/masters/batchpricinglist/addbatch", { mode: "add", returnUrl: this.router.url }])
     
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  onEditClick(event): void {
    try {
     
        this.router.navigate(["./pages/masters/batchpricinglist/addbatch", { mode: "edit",id:event.data.ID, returnUrl: this.router.url }])
   
    
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  onViewClick(event): void {
    try {
        this.router.navigate(["./pages/masters/batchpricinglist/addbatch", { mode: "view",id:event.data.ID, returnUrl: this.router.url }]) 
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
  
}