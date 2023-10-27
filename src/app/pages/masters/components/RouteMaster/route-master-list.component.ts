import { Component, Injector } from "@angular/core";
import { ServerDataSource } from "../../../../node_modules/ng2-smart-table/";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from "@angular/router";
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from "../../../../app-component-base";

@Component({
  selector: "route-master-list",
  templateUrl: "./route-master-list.component.html",
  providers: [MasterRepo],
  styleUrls: ["../../../modal-style.css"]
})
export class RouteMasterListComponent extends AppComponentBase {
  settings = {
    mode: "external",
    add: {
      addButtonContent: "",
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
    // view: {
    //   viewButtonContent: 'View',
    //   saveButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    edit: {
      editButtonContent:
        '<button type="button" class="btn btn-info">Edit</button>',
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
      RouteCode: {
        title: "Route Code",
        type: "string"
      },
      RouteName: {
        title: "Route Name",
        type: "string"
      },
      status: {
        title: "Status",
        type: "boolean",
        valuePrepareFunction: value => {
          return value == 1 ? "Active" : "InActive";
        },
        filter: {
          type: "list",
          config: {
            selectText: "select",
            list: [
              { value: 1, title: "Active" },
              { value: 0, title: "InActive" }
            ]
          }
        }
      }
    }
  };
  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    "You are not authorized."
  );
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(
    //private _authService: AuthService,
    private router: Router,
    public dialog: MdDialog,
    public injector: Injector
  ) {
    super(injector);
    try {
      let apiUrl = `${this.apiUrl}/getAllRouteMasterPagedList`;
      this.source = this.source = new ServerDataSource(this._http, {
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
  addNewProductHierarchy(): void {
    try {
      this.router.navigate([
        "./pages/masters/routemaster/add-routemaster",
        { mode: "add", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate([
        "./pages/masters/routemaster/add-routemaster",
        { name: event.data.RouteName, mode: "edit", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onViewClick(): void {
    try {
      this.router.navigate([
        "./pages/masters/add-routemaster",
        { mode: "view", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onDeleteConfirm(event): void {
    if (window.confirm("Are you sure you want to delete?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }




  viewSchedule() {
    try {
      this.router.navigate([
        "./pages/masters/routemaster/add-routemaster",
        { mode: "viewSchedule", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }
}
