import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";

// import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
// import {AddWarehouseService} from './addwarehouse.service'
import { Warehouse } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
@Component({
  selector: 'SchemeTableMaster',
  templateUrl: './SchemeTable.html',
  providers: [MasterRepo, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class SchemeTableMasterComponent {

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    // view: {
    //   viewButtonContent: 'View',
    //   saveButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    edit: {
      editButtonContent: '<button type="button" class="btn btn-info">Edit</button>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    columns: {
        NAME: {
        title: 'Name',
        type: 'string'
      },
      ADDRESS: {
        title: 'address',
        type: 'string'
      },
      PHONE: {
        title: 'phone',
        type: 'string'
      },
      DIVISIONNAME: {
        title: 'Division',
        type: 'string'
      },
      REMARKS:{
        title:'Remark',
        type:'string'
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(private masterService: MasterRepo, private router: Router, public dialog: MdDialog) {
    try {
      let data: Array<Warehouse> = [];
      this.masterService.getWarehouse()
        .subscribe(res => {
          data.push(<Warehouse>res);
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "warehouse-list - getWarehouse");
          console.log(error);
        }

        );

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  addNewWarehouse(): void {
    try {
      this.router.navigate(["./pages/masters/warehouse/add-warehouse", { mode: "add", returnUrl: this.router.url }]);

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
     this.router.navigate(["./pages/masters/warehouse/add-warehouse", { name: event.data.NAME, mode: "edit", returnUrl: this.router.url }]);
      
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
     this.router.navigate(["pages/masters/warehouse/add-warehouse", { name: event.data.NAME, mode: "view", returnUrl: this.router.url }]);

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