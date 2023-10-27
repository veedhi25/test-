import { Component, Injector, ViewChild } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { DivisionService } from './divisions.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { IDivision } from '../../../../common/interfaces/commonInterface.interface';
import { AppComponentBase } from '../../../../app-component-base';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../common/ims-grid/ims-grid.component';


@Component({
  selector: 'divisions',
  templateUrl: './divisions.component.html',
  providers: [DivisionService],
  styleUrls: ["../../../modal-style.css"],
})
export class Divisions extends AppComponentBase {
  @ViewChild("accountGenericGrid") genericGrid: IMSGridComponent;
  PType: string;
  imsGridSettingsEntity: IMSGridSettings = new IMSGridSettings();

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
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    columns: {
      INITIAL: {
        title: 'Abb Value',
        type: 'string'
      },
      NAME: {
        title: 'Name',
        type: 'string'
      },
      ID: {
        title: 'id',
        type: 'string'
      },
      DESCRIPTION: {
        title: 'Rate Group',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private masterService: MasterRepo, private divService: DivisionService, private router: Router, public dialog: MdDialog, public injector: Injector) {
    super(injector);
    try {
      this.imsGridSettingsEntity = {

        title: "Customer",
        apiEndpoints: '/getDivisionPagedList/',
        pageSize: 10,
        showActionButton: true,
        columns: [
          {
            key: "INITIAL",
            title: "Abb Value",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "300px"
          },
          {
            key: "NAME",
            title: "Name",
            hidden: false,
            noSearch: false,
            width: "150px",
            type: "string"
          },
          {
            key: "ID",
            title: "ID",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "100px"
          },
          {
            key: "Rate Group",
            title: "Rate Group",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "100px"
          },
        ],
        actionKeys: [
          {
            text: "Edit",
            title: "Edit",
            icon: "fa fa-edit",
            type: ActionKeyMaster.EDIT,
            hidden: false
          },
          // {
          //     text: "Click to delete customer",
          //     title: "Delete Customer",
          //     icon: "fad fa-trash text-danger",
          //     type: ActionKeyMaster.DELETE
          // },
          {
            text: "View",
            title: "View",
            icon: "fa fa-eye",
            type: ActionKeyMaster.VIEW,
            hidden: false
          },
        ]
      };
      // let data: Array<IDivision> = [];
      
      // this.masterService.getAllDivisions()
      //   .subscribe(res => {
      //     data.push(<IDivision>res);
      //     this.source.load(data);
      //   }, error => {
      //     this.masterService.resolveError(error, "divisions - getDivisions");
      //   }

      //   );
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  setMode() {
    try {
      this.divService.create();
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onAddClick(event): void {
    try {
      this.router.navigate(["./pages/masters/divisionList/adddivisionList", { mode: "add", returnUrl: this.router.url }]);
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

  onViewClicked(event): void {
    try {
      this.router.navigate(["./pages/masters/divisionList/adddivisionList", { initial: event.data.INITIAL, mode: "view", returnUrl: this.router.url }]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onEditClicked(event): void {
    try {
      this.router.navigate(["./pages/masters/divisionList/adddivisionList", { initial: event.data.INITIAL, name: event.data.NAME, mode: "edit", returnUrl: this.router.url }]);
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
    /*public actions: Array<PageAction> = [];
private router: Router;
constructor(router: Router) {
super();
let self: Divisions = this;
self.router = router;
self.model = new DivisionsModel(self.i18nHelper);
//self.registerEvent(self.model.event)
self.loadDivisions();
this.model.addPageAction(new PageAction("btnAddDivision", "masters.divisions.addDivisionAction", () => self.onAddNewDivisionClicked()));

}

onAddNewDivisionClicked() {
this.router.navigate([route.division.addDivision.name]);
}

onEditDivisionClicked(event: any) {
this.router.navigate([route.division.editDivision.name, { id: event.item.initial }]);
}

onDeleteDivisionClicked(event: any) {
let self: Divisions = this;
divisionsService.delete(event.item.id).then(function () {
self.loadDivisions();
});

}
private loadDivisions() {
let self: Divisions = this;
divisionsService.getDivision().then(function (items: Array<any>) {

self.model.importDivisions(items);
});
}
}*/