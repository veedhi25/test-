import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { AddCostCenterService } from './addCostCenter.service';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { CostCenter } from "../../../../common/interfaces/TrnMain";
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
@Component({
  selector: 'CostCenterListSelector',
  templateUrl: './costCenterList.component.html',
  providers: [AddCostCenterService, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class CostCenterListComponent {
  costCenter: CostCenter = <CostCenter>{};

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

      CostCenterName: {
        title: 'CostCenter Name',
        type: 'string'
      },
      PARENT: {
        title: 'Parent Name',
        type: 'string'
      },
      DIVISION: {
        title: 'Division',
        type: 'string'
      },

    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private masterService: MasterRepo, private _authService: AuthService, protected csservice: AddCostCenterService, private router: Router, public dialog: MdDialog) {
    try {
      let data: Array<CostCenter> = [];
      
      this.masterService.getAllCostCenter()
        .subscribe(res => {
          data.push(<CostCenter>res);
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "costCenterList - getAllCostCenter");
          console.log(error);
        }

        );

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  AddCostCenter() {
    try {
     this.router.navigate(["./pages/masters/cost-center/add-cost-center", { mode: "add", returnUrl: this.router.url }]);
      
      // if (this._authService.checkMenuRight("cost-center", "add") == true) {
      //   this.router.navigate(["./pages/masters/cost-center/add-cost-center", { mode: "add", returnUrl: this.router.url }])
      // } else {
      //   this.messageSubject.next("You are not authorized to Add Category.");
      //   this.openAuthDialog();
      // } 

   
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
     // this.router.navigate(["./pages/masters/cost-center/add-cost-center", { costcenterName: event.data.CostCenterName, division: event.data.DIVISION, mode: "edit", returnUrl: this.router.url }]);
      if (this._authService.checkMenuRight("cost-center", "add") == true) {
        this.router.navigate(["./pages/masters/cost-center/add-cost-center", { costcenterName: event.data.CostCenterName, division: event.data.DIVISION, mode: "edit", returnUrl: this.router.url }]);
      } else {
        this.messageSubject.next("You are not authorized to Edit.");
        this.openAuthDialog();
      } 

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
     // this.router.navigate(["./pages/masters/cost-center/add-cost-center", { costcenterName: event.data.CostCenterName, mode: "view", returnUrl: this.router.url }]);
      
      if (this._authService.checkMenuRight("cost-center", "view") == true) {
        this.router.navigate(["./pages/masters/cost-center/add-cost-center", { costcenterName: event.data.CostCenterName, division: event.data.DIVISION, mode: "view", returnUrl: this.router.url }]);
      } else {
        this.messageSubject.next("You are not authorized to View.");
        this.openAuthDialog();
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

