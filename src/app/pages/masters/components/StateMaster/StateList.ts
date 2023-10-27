import { Component, Injector } from "@angular/core";
import { ServerDataSource } from "../../../../node_modules/ng2-smart-table/";
import { Router } from "@angular/router";
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from "../../../../app-component-base";
import { AlertService } from "../../../../common/services/alert/alert.service";

@Component({
  selector: "state-list",
  templateUrl: "./StateList.html",
  styleUrls: ["../../../modal-style.css"]
})
export class StateListComponent extends AppComponentBase {
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
      deleteButtonContent: "",
      confirmDelete: true
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      StateCode: {
        title: "State Code",
        type: "string"
      },
      StateName: {
        title: "State Name",
        type: "string"
      },
      STATUS: {
        title: "Status",
        type: "string",
        valuePrepareFunction: value => {
          return value == 1 ? "Active" : "InActive";
        },
        filter: {
          type: "list",
          config: {
            selectText: "Show all",
            list: [
              { value: 0, title: "InActive" },
              { value: 1, title: "Active" }
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
    public injector: Injector,
    private alertService: AlertService
  ) {
    super(injector);
    try {
      let apiUrl = `${this.apiUrl}/getAllStatePagedList`;
      this.source = this.source = new ServerDataSource(this._http, {
        endPoint: apiUrl,
        dataKey: "data",
        pagerPageKey: "currentPage",
        pagerLimitKey: "maxResultCount"
      });
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  addNewState(): void {
    try {
      this.router.navigate([
        "./pages/masters/statelist/addstate",
        { mode: "add", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate([
        "./pages/masters/statelist/addstate",
        { mode: "edit", id: event.data.StateCode, returnUrl: this.router.url }
      ]);
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  onViewClick(): void {
    try {
      this.router.navigate([
        "./pages/masters/statelist/addstate",
        { mode: "view", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
}
