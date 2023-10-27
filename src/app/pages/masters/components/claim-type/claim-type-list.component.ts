import { Component, Injector } from "@angular/core";
import { ServerDataSource } from "../../../../node_modules/ng2-smart-table/";
import "style-loader!./smartTables.scss";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from "@angular/router";
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from "../../../../app-component-base";

@Component({
  selector: "claim-type-list",
  templateUrl: "./claim-type-list.component.html",
  providers: [MasterRepo],
  styleUrls: ["../../../modal-style.css"]
})
export class ClaimTypeListComponent extends AppComponentBase {
  settings = {
    mode: "external",
    add: {
      addButtonContent: "",
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
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
      ClaimTypeCode: {
        title: "Type Code",
        type: "string"
      },
      ClaimTypeName: {
        title: "Claim Type Name",
        type: "string"
      },
      STATUS: {
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
    private router: Router,
    public dialog: MdDialog,
    public injector: Injector
  ) {
    super(injector);
    try {
      let apiUrl = `${this.apiUrl}/getAllClaimTypePagedList`;
      this.source = new ServerDataSource(this._http, {
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
  addNewSalesManType(): void {
    try {
      this.router.navigate([
        "./pages/masters/claim-type/add-claim-type",
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
        "./pages/masters/claim-type/add-claim-type",
        {
          name: event.data.ClaimTypeName,
          mode: "edit",
          returnUrl: this.router.url
        }
      ]);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate([
        "pages/masters/claim-type/add-claim-type",
        {
          name: event.data.ClaimTypeName,
          mode: "view",
          returnUrl: this.router.url
        }
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
}
