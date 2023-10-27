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
  selector: "sales-man-type-list",
  templateUrl: "./sales-man-type-list.component.html",
  providers: [MasterRepo],
  styleUrls: ["../../../modal-style.css"]
})
export class SalesManTypeListComponent extends AppComponentBase {
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
      SalesmanTypeCode: {
        title: "Type Code",
        type: "string"
      },
      SalesmanTypeName: {
        title: "Sales Man Type Name",
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
    public injector : Injector
  ) {
    super(injector);
    try {
      let apiUrl = `${this.apiUrl}/getAllSalesmanTypePagedList`;
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
        "./pages/masters/sales-man-type/add-sales-man-type",
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
        "./pages/masters/sales-man-type/add-sales-man-type",
        { name: event.data.SalesmanTypeName, mode: "edit", returnUrl: this.router.url }
      ]); 
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate([
        "pages/masters/sales-man-type/add-sales-man-type",
        { name: event.data.SalesmanTypeName, mode: "view", returnUrl: this.router.url }
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
