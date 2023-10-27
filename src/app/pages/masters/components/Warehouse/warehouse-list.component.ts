import { Component, Injector } from "@angular/core";
import { ServerDataSource } from "../../../../node_modules/ng2-smart-table/";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from "@angular/router";
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from "../../../../app-component-base";
import { AlertService } from "../../../../common/services/alert/alert.service";

@Component({
  selector: "warehouse-list",
  templateUrl: "./warehouse-list.component.html",
  providers: [MasterRepo],
  styleUrls: ["../../../modal-style.css"]
})
export class WarehouseListComponent extends AppComponentBase {
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
      NAME: {
        title: "Name",
        type: "string"
      },
      ADDRESS: {
        title: "address",
        type: "string"
      },
      PHONE: {
        title: "phone",
        type: "string"
      },
      DIVISIONNAME: {
        title: "Division",
        type: "string"
      },
      REMARKS: {
        title: "Remark",
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
    public injector: Injector,
    private alertService: AlertService
  ) {
    super(injector);
    try {
      let apiUrl = `${this.apiUrl}/getAllWarehousePagedList`;
      this.source = new ServerDataSource(this._http, {
        endPoint: apiUrl,
        dataKey: "data",
        pagerPageKey: "currentPage",
        pagerLimitKey: "maxResultCount"
      });
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  addNewWarehouse(event): void {
    try {
      this.router.navigate([
        "./pages/configuration/org-master/warehouse/add-warehouse",
        { mode: "add", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  onEditClick(event): void {
    if (event.data.ISDEFAULT == "T") {
      this.alertService.warning("Main Warehouse is not editable.");
      return;
    }
    try {
      this.router.navigate([
        "./pages/configuration/org-master/warehouse/add-warehouse",
        { name: event.data.NAME, mode: "edit", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate([
        "pages/configuration/org-master/warehouse/add-warehouse",
        { name: event.data.NAME, mode: "view", returnUrl: this.router.url }
      ]);
    } catch (ex) {
      this.alertService.error(ex);
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
