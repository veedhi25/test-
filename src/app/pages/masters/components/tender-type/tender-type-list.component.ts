import { Component, Injector, ViewChild } from '@angular/core';
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../common/ims-grid/ims-grid.component';

@Component({
  selector: 'tender-type-list-selector',
  templateUrl: './tender-type-list.component.html',
  styleUrls: ["../../../modal-style.css"],
})
export class TenderTypeListComponent extends AppComponentBase {
  @ViewChild("accountGenericGrid") genericGrid: IMSGridComponent;
  PType: string;
  imsGridSettingsEntity: IMSGridSettings = new IMSGridSettings();

  settings = {
    mode: 'external',
    actions: {
      position: 'right'
    },
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
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      PAYMENTMODENAME: {
        title: 'Name',
        type: 'string'
      },
      MODE: {
        title: 'Type',
        type: 'string'
      },
      STATUS: {
        title: 'Status',
        type: 'string;',
        valuePrepareFunction: (value) => { return value == 1 ? 'Active' : 'InActive'; },
        filter: {
          type: 'list',
          config: {
            selectText: 'Show all',
            list: [
              { value: 1, title: 'Active' },
              { value: 0, title: 'InActive' },
            ]
          }
        }
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
    public injector: Injector
  ) {
    super(injector);
    try {
      this.imsGridSettingsEntity = {
        title: "Customer",
        apiEndpoints: '/getAllTenderTypePagedList/',
        pageSize: 10,
        showActionButton: true,
        columns: [
          {
            key: "PAYMENTMODENAME",
            title: "Name",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "300px"
          },
          {
            key: "MODE",
            title: "Type",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "300px"
          },
          {
            key: "STATUS",
            title: "STATUS",
            hidden: false,
            noSearch: false,
            width: "100px",
            type: "list",
            valuePrepareFunction: (value) => {
              return value == 1 ? "Active" : "Inactive";
            },
            filter: {
              list: [
                {
                  value: 1,
                  title: "Active"
                },
                {
                  value: 0,
                  title: "InActive"
                }
              ]
            }
          }
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
      // let apiUrl = `${this.apiUrl}/getAllTenderTypePagedList`;
      // this.source =  this.source = new ServerDataSource(this._http, 
      //   { endPoint: apiUrl, 
      //     dataKey : "data", 
      //     pagerPageKey : "currentPage",
      //     pagerLimitKey : "maxResultCount"
      //   }); 

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  addNewTednerType(): void {
    try {

      this.router.navigate(["./pages/masters/tendertype/add-tendertype", { mode: "add", returnUrl: this.router.url }])

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClicked(event): void {
    try {
      
      this.router.navigate(["./pages/masters/tendertype/add-tendertype", { tenderTypeId: event.data.PAYMENTMODEID, mode: "edit", returnUrl: this.router.url }]);

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClicked(event): void {
    try {
      this.router.navigate(["./pages/masters/tendertype/add-tendertype", { tenderTypeId: event.data.PAYMENTMODEID, mode: "view", returnUrl: this.router.url }]);
      // this.router.navigate(["pages/masters/Branch", { name: event.data.BRANCHID, mode: "view", returnUrl: this.router.url }]);
      // if (this._authService.checkMenuRight("BranchList", "view") == true) {
      //   this.router.navigate(["./pages/masters/Branch", { mode: "view", returnUrl: this.router.url }])
      // } else {
      //   this.messageSubject.next("You are not authorized to View new company.");
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