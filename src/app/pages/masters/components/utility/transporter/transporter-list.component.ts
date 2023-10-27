import { Component, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from '../../../../modaldialogs/authorizationDialog/authorizationDialog.component';
import { ServerDataSource } from '../../../../../node_modules/ng2-smart-table/';
import { AppComponentBase } from '../../../../../app-component-base';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../../common/ims-grid/ims-grid.component';
@Component({
  selector: 'transporter-list',
  templateUrl: './transporter-list.component.html',
  styleUrls: ["../../../../modal-style.css"],
})
export class TransporterListComponent extends AppComponentBase {
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
    view: {
      viewButtonContent: '',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil" title="Edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '',
      //deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      NAME: {
        title: 'Name',
        type: 'string'
      },
      ADDRESS: {
        title: 'Address',
        type: 'string'
      },
      EMAIL: {
        title: 'Email',
        type: 'string'
      },
      PHONE: {
        title: 'Phone',
        type: 'string'
      },
      PANNO: {
        title: 'PAN No',
        type: 'string'
      },
      STATUS: {
        title: "Status",
        type: "boolean",
        valuePrepareFunction: value => {
          return value == 1 ? "Active" : "Inactive";
        },
        filter: {
          type: "list",
          config: {
            selectText: "select",
            list: [
              { value: 1, title: "Active" },
              { value: 0, title: "Inactive" }
            ]
          }
        }
      },
      TRANSMODE: {
        title: "Transport Mode",
        type: "boolean",
        valuePrepareFunction: value => {
          switch (value) {
            case 1:
              return "Road";


            case 2:
              return "Rail";

            case 3:
              return "Air";

            case 4:
              return "Ship";
            default:

              break;
          }
          // return value == 1 ? "Active" : "Inactive";
        },
        filter: {
          type: "list",
          config: {
            selectText: "Select",
            list: [
              { value: 1, title: "Road" },
              { value: 2, title: "Rail" },
              { value: 3, title: "Air" },
              { value: 4, title: "Ship" }
            ]
          }
        }
      }
    }
  };

  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  source: ServerDataSource;
  constructor(public injector: Injector, private _router: Router, public dialog: MdDialog) {
    super(injector)
    try {
      this.imsGridSettingsEntity = {

        title: "Customer",
        apiEndpoints: '/getAllTransporterPagedList/',
        pageSize: 10,
        showActionButton: true,
        columns: [
          {
            key: "NAME",
            title: "Name",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "300px"
          },
          {
            key: "ADDRESS",
            title: "ADDRESS",
            hidden: false,
            noSearch: false,
            width: "150px",
            type: "string"
          },
          {
            key: "EMAIL",
            title: "EMAIL",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "100px"
          },
          {
            key: "PHONE",
            title: "PHONE",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "100px"
          },
          {
            key: "PANNO",
            title: "PANNO",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "100px"
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
          },
          {
            key: "TRANSMODE",
            title: "Transport Mode",
            hidden: false,
            noSearch: false,
            width: "100px",
            type: "list",
            valuePrepareFunction: (value) => {
              return value == 1 ? "Road" : value == 2 ? "Rail" : value == 3 ? "Air" : value == 4 ? "Ship" : " ";
            },
            filter: {
              list: [
                {
                  value: 1,
                  title: "Road"
                },
                {
                  value: 2,
                  title: "Rail"
                },
                {
                  value: 3,
                  title: "Air"
                },
                {
                  value: 4,
                  title: "Ship"
                }
              ]
            }
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
      // let apiUrl = `${this.apiUrl}/getAllTransporterPagedList`;
      
      // this.source = new ServerDataSource(this._http,
      //   {
      //     endPoint: apiUrl,
      //     dataKey: "data",
      //     pagerPageKey: "currentPage",
      //     pagerLimitKey: "maxResultCount"
      //   });
    } catch (ex) {
      alert(ex);
    }
  }



  onAddClick() {
    try {
      this._router.navigate(["pages/masters/utility/transporter/add-transporter", { mode: "add", returnUrl: this._router.url }]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onEditClicked(event): void {
    try {
      this._router.navigate(["pages/masters/utility/transporter/add-transporter", { transporterId: event.data.TRANSPORTERID, mode: "edit", returnUrl: this._router.url }]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onViewClicked(event): void {
    try {
      this._router.navigate(["pages/masters/utility/transporter/add-transporter", { transporterId: event.data.TRANSPORTERID, mode: "view", returnUrl: this._router.url }]);
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