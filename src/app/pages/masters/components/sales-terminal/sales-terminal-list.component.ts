import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { SalesTerminal } from "./sales-terminal.interface";

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';

import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { SalesTerminalService } from './sales-terminal.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
@Component({
  selector: 'sales-terminal-list',
  templateUrl: './sales-terminal-list.template.html',
  providers: [SalesTerminalService, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class SalesTerminalListComponent {

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
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    // delete: {
    //   deleteButtonContent: '<i class="ion-trash-a"></i>',
    //   confirmDelete: true
    // },
    columns: {
      // id: {
      //   title: 'ID',
      //   type: 'number'
      // },
      INITIAL: {
        title: 'Terminal ID',
        type: 'string'
      },
      NAME: {
        title: 'Terminal Name',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private masterService: MasterRepo, private _authService: AuthService, private _salesTerminalService: SalesTerminalService, private _router: Router, public dialog: MdDialog) {
    try {
      let data: Array<SalesTerminal> = [];
      
      this.masterService.getSalesTerminal()
        .subscribe(res => {
          data.push(<SalesTerminal>res);
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "sales-terminal-list - getSalesTerminal");
        }

        );
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

  onAddClick() {
    try {
      this._router.navigate(["pages/masters/sales-terminal/add-sales-terminal", { mode: "add", returnUrl: this._router.url }])
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onEditClick(event): void {
    try {
      this._router.navigate(["pages/masters/sales-terminal/add-sales-terminal", { terminalId: event.data.INITIAL, mode: "edit", returnUrl: this._router.url }]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this._router.navigate(["pages/masters/sales-terminal/add-sales-terminal", { terminalId: event.data.INITIAL, mode: "view", returnUrl: this._router.url }]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
  
}