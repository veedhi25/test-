
import { MasterRepo } from './../../../../common/repositories/masterRepo.service';

import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'

import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';

import 'style-loader!./smartTables.scss';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { VehicleRegistrationService } from './vehicle.service';
@Component({
  selector: 'TableVehicleRegistration',
  templateUrl: './vehicleRegistrationTable.html',
  providers: [VehicleRegistrationService],
  styleUrls: ["../../../modal-style.css"],
})
export class TableVehicleRegistrationComponent {

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
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      // Id: {
      //   title: 'ID',
      //   type: 'number'
      // },
      DiscountName: {
        title: 'AccountName',
        type: 'string'
      },
      DateStart: {
        title: 'DateStart',
        type: 'number'
      },
      DateEnd: {
        title: 'DateEnd',
        type: 'string'
      },

    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private router: Router, private _authService: AuthService, public dialog: MdDialog,private masterService: MasterRepo) {
   
  }
  addNewAccount() {
    try {
      this.router.navigate(["/pages/configuration/NewVehicleRegistration", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["./pages/configuration/NewVehicleRegistration", { initial: event.data.DisID, mode: "edit",returnUrl: this.router.url }]);
        } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
     this.router.navigate(["./pages/configuration/NewVehicleRegistration", {initial: event.data.DisID, mode: "view", returnUrl: this.router.url }]);
    
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onDeleteConfirm(event): void {
    try {
      if (window.confirm('Are you sure you want to delete?')) {
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
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