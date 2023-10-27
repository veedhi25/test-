import { Component, Injector } from '@angular/core';
import { AuthService } from "../../../../common/services/permission/authService.service"; 
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';

@Component({
  selector: 'brand-list-selector',
  templateUrl: './brand-list.component.html',
  providers: [MasterRepo],
  styleUrls: ["../../../modal-style.css"],
})
export class BrandListComponent extends AppComponentBase{

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
      editButtonContent: '',
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
      BrandName: {
        title: 'Name',
        type: 'string'
      },
      TYPE: {
        title: 'Type',
        type: 'string',
        valuePrepareFunction: (value) => { 
          if(value == 'DIVISION'){
          value='Business Group';
        } 
        else if(value == 'VERTICAL'){
          value='Business Unit';
        } 
        else if(value == 'Brand'){
          value='Brand';
        } 
        return value;
      },
            
      },
      BRANDCODE: {
        title: 'Level',
        type: 'string;'
        
      },
      PCL: {
        title: 'product category line',
        type: 'string;'
      }
      // STATUS: {
      //   title: 'Status',
      //   type: 'string;',
      //   valuePrepareFunction: (value) => { return value==1?'Active':'InActive'; },
      //   filter: {
      //     type: 'list',
      //       config: {
      //         selectText: 'Show all',
      //           list: [
      //             { value: 1, title: 'Active' },
      //             { value: 0, title: 'InActive' },
      //           ]
      //         }
      //       }
      // }
  
      
    }
  };
  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  constructor(
    //private _authService: AuthService, 
    private router: Router, 
    public dialog: MdDialog,
    public injector : Injector
    ) {
      super(injector);
    try { 
      let apiUrl = `${this.apiUrl}/getAllBrandPagedList`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        }); 
     
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  addNewBrand(): void {
    try {
     
        this.router.navigate(["./pages/masters/brand/add-brand", { mode: "add", returnUrl: this.router.url }])
 
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  // onEditClick(event): void {
  //   try {
  //   this.router.navigate(["./pages/masters/brand/add-brand", { brandId: event.data.BrandId, mode: "edit", returnUrl: this.router.url }]);
      
  //   } catch (ex) {
  //     console.log(ex);
  //     alert(ex);
  //   }
  // }

  onViewClick(event): void {
    try {
     // this.router.navigate(["pages/masters/Branch", { name: event.data.BRANCHID, mode: "view", returnUrl: this.router.url }]);
     this.router.navigate(["./pages/masters/brand/add-brand", { BrandName: event.data.BrandName, mode: "view", returnUrl: this.router.url }]);
    
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