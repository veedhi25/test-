import { Component, Injector } from '@angular/core';
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';
@Component({
  selector: 'sales-organization-list-selector',
  templateUrl: './salesorganizationList.component.html',
  styleUrls: ["../../../modal-style.css"],
})
export class SalesOrganizationListComponent extends AppComponentBase{
  router: Router;

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
    pager:{
      display:true,
      perPage:10
    },
    columns: {
      Name: {
        title: 'Name',
        type: 'string'
      },
      Address:{
          title: 'Address',
          type: 'string'
      },
      Parent:{
          title: 'Parent',
          type: 'string'
      }

    }
  };

  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(public injector : Injector, 
    // private _authService: AuthService,
     router: Router, public dialog: MdDialog) {
    super(injector)
    try {
      this.router = router;

      let apiUrl = `${this.apiUrl}/getAllSalesOrganizationPagedList`;
      //let apiUrl = `${this.apiUrl}/getAllMenuItemPaged`;

      this.source =  this.source = new ServerDataSource(this._http, 
        { endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        });

       

      // let data = [];
      // this.masterService.getAllUnitList().subscribe(p => {
      //   data.push(<any>p);
      //   this.source.load(data);
      // }, error => {
      //   var err = error.json();
      //   alert(err);
      // }, () => {
      //   this.masterService._Units = data;
      // })

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  AddSalesOrganization() {
    try {
      this.router.navigate(["./pages/masters/salesorganization/add-salesorganization", { mode: "add", returnUrl: this.router.url }]);
      
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["./pages/masters/salesorganization/add-salesorganization", { chanelId: event.data.Id, mode: "edit", returnUrl: this.router.url }]);
    
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onViewClick(event): void {
    try {
     this.router.navigate(["./pages/masters/inventory-info/unit-list/add-unit-list", { unitList: event.data.UNITID, mode: "view", returnUrl: this.router.url }]);

      if (this._authService.checkMenuRight("unit-list", "view") == true) {
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

