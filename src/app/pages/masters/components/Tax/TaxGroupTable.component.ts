import { Component, Injector } from '@angular/core';
 
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';

@Component({
  selector: 'tax-group-list',
  templateUrl: './TaxGroupTable.html',
  styleUrls: ["../../../modal-style.css"],
})
export class TaxGroupTableComponent extends AppComponentBase {

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
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      MCODE: {
        title: 'MCODE',
        type: 'string'
      },
      DESCRIPTION: {
        title: 'Item Name',
        type: 'string'
      },
      TAXGROUP: {
        title: 'TAXGROUP',
        type: 'string'
      },
      STATE: {
        title: 'STATE',
        type: 'string'
      },
      TAX: {
        title: 'TAX',
        type: 'string'
      },
      STATUS: {
        title: 'STATUS',
        type: 'string'
      }
    }
  };

  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(public injector: Injector, public router: Router, public dialog: MdDialog) {
    super(injector);
    try {
      let apiUrl = `${this.apiUrl}/getAllTAXPagedList`
      this.source = new ServerDataSource(this._http,
        {
          endPoint: apiUrl,
          dataKey: "data",
          pagerPageKey: "currentPage",
          pagerLimitKey: "maxResultCount"
        });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  addTAX(): void {
    try {
      this.router.navigate(["./pages/masters/TaxGroupTable/addTaxGroup", { mode: "add", returnUrl: this.router.url }]);

      // if (this._authService.checkMenuRight("salesman", "add") == true) {
      //   this.router.navigate(["./pages/masters/warehouse/add-warehouse", { mode: "add", returnUrl: this.router.url }]);
      // } else {
      //   this.messageSubject.next("You are not authorized Add Warehouse.");
      //   this.openAuthDialog();
      // } 


    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["./pages/masters/TaxGroupTable/addTaxGroup", { ID: event.data.ID, mode: "edit", returnUrl: this.router.url }]);

      // if (this._authService.checkMenuRight("salesman", "edit") == true) {
      //   this.router.navigate(["./pages/masters/warehouse/add-warehouse", { name: event.data.NAME, mode: "edit", returnUrl: this.router.url }]);
      // } else {
      //   this.messageSubject.next("You are not authorized Edit.");
      //   this.openAuthDialog();
      // } 

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["./pages/masters/TaxGroupTable/addTaxGroup", { ID: event.data.ID, mode: "view", returnUrl: this.router.url }]);

      // if (this._authService.checkMenuRight("salesman", "view") == true) {
      //   this.router.navigate(["pages/masters/warehouse/add-warehouse", { name: event.data.NAME, mode: "view", returnUrl: this.router.url }]);
      // } else {
      //   this.messageSubject.next("You are not authorized view.");
      //   this.openAuthDialog();
      // } 

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

}