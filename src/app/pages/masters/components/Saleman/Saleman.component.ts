import { Component, Injector, ViewChild } from "@angular/core";
import { ServerDataSource } from "../../../../node_modules/ng2-smart-table/";
import { AddSalesmanService } from "./addSalesman.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from "../../../../app-component-base";
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from "../../../../common/ims-grid/ims-grid.component";

@Component({
  selector: "salesman",
  templateUrl: "./SalemanList.component.html",
  providers: [AddSalesmanService],
  styleUrls: ["../../../modal-style.css"]
})
export class SalesmanComponent extends AppComponentBase {
  @ViewChild("accountGenericGrid") genericGrid: IMSGridComponent;
  PType: string;
  imsGridSettingsEntity: IMSGridSettings = new IMSGridSettings();
  settings = {
    mode: "external",
    actions: {
      position: 'right'
    },
    add: {
      addButtonContent: "",
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },

    edit: {
      editButtonContent: '<i class="fa fa-pencil" title="Edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
    delete: {
      deleteButtonContent: " ",
      confirmDelete: true
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      // SALESMANID: {
      //   title: 'Id',
      //   type: 'number'
      // },
      NAME: {
        title: "Salesman Name",
        type: "string"
      },
      SALESMANTYPECODE: {
        title: "Beat",
        type: "string"
      },
      OPBAL: {
        title: "Commission",
        type: "number"
      },
      MOBILE: {
        title: "Mobile",
        type: "number"
      },
      EMAIL: {
        title: "Email",
        type: "string"
      }
    }
  };

  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    "You are not authorized."
  );
  message$: Observable<string> = this.messageSubject.asObservable();
  mappedMcode: string = "";

  constructor(
    private masterService: MasterRepo,
    protected csservice: AddSalesmanService,
    private router: Router,
    public dialog: MdDialog,
    public injector: Injector
  ) {
    super(injector);
    try {
      this.imsGridSettingsEntity = {

        title: "Customer",
        apiEndpoints: `/getSalesmanPagedList/0`,
        pageSize: 10,
        showActionButton: true,
        columns: [
          {
            key: "NAME",
            title: "Salesman Name",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "300px"
          },
          {
            key: "SALESMANTYPECODE",
            title: "Beat",
            hidden: false,
            noSearch: false,
            width: "150px",
            type: "string"
          },
          {
            key: "COMMISION",
            title: "Commission",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "100px"
          },
          {
            key: "MOBILE",
            title: "Mobile",
            hidden: false,
            noSearch: false,
            type: "string",
            width: "100px"
          },
          {
            key: "EMAIL",
            title: "Email",
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
      // let apiUrl = `${this.apiUrl}/getSalesmanPagedList`;
      // this.source = this.source = new ServerDataSource(this._http, {
      //   endPoint: apiUrl,
      //   dataKey: "data",
      //   pagerPageKey: "currentPage",
      //   pagerLimitKey: "maxResultCount"
      // });

      // let data: Array<any> = [];
      // this.masterService.getSalesman()
      //   .subscribe(res => {
      //     data.push(<any>res);
      //     data.forEach(d=>{d.DOB=d.DOB==null?d.DOB:d.DOB.substring(0, 10)});
      //     this.source.load(data);
      //   }, error => {
      //     this.masterService.resolveError(error, "Saleman - getSalesman");
      //   }

      //   );
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  AddSaleman() {
    try {
      this.router.navigate([
        "./pages/masters/salesman/add-salesman",
        { mode: "add", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onEditClicked(event): void {
    try {

      this.router.navigate([
        "./pages/masters/salesman/add-salesman",
        {
          salesid: event.data.SALESMANID,
          mode: "edit",
          returnUrl: this.router.url
        }
      ]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onViewClicked(event): void {
    try {
      this.router.navigate([
        "./pages/masters/salesman/add-salesman",
        {
          salesid: event.data.SALESMANID,
          mode: "view",
          returnUrl: this.router.url
        }
      ]);
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
