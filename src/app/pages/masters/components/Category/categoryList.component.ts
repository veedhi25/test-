import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap'

//import { SmartTablesService } from './smartTables.service';
// import { LocalDataSource } from 'ng2-smart-table';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { AddCategoryService } from './addCategory.service'
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { MCAT } from "../../../../common/interfaces/Category.interface";
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
@Component({
  selector: 'categoryListSelector',
  templateUrl: './categoryList.component.html',
  providers: [AddCategoryService, AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class CategoryListComponent {

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
      editButtonContent: '<button type="button" class="btn btn-info">Edit</button>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    columns: {

      MENUCAT: {
        title: 'CATEGORY NAME',
        type: 'string'
      },
      PARENT: {
        title: 'CATEGORY GROUP',
        type: 'string'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private masterService: MasterRepo, private _authService: AuthService, protected csservice: AddCategoryService, private router: Router, public dialog: MdDialog) {
    try {
      let data: Array<MCAT> = [];
      
      this.masterService.getAllCategory()
        .subscribe(res => {
          data.push(<MCAT>res);
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "categoryList - getAllCategory");
        }

        );
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }

  }

  AddCategory() {
    try {
     // this.router.navigate(["./pages/masters/category/add-category", { mode: "add", returnUrl: this.router.url }]);
     
    //  if (this._authService.checkMenuRight("category", "add") == true) {
      this.router.navigate(["./pages/masters/category/add-category", { mode: "add", returnUrl: this.router.url }])
    // } else {
     // this.messageSubject.next("You are not authorized to add new Category.");
    //  this.openAuthDialog();
  //  } 

     
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      //this.router.navigate(["./pages/masters/category/add-category", { menuID: event.data.MENUCAT, mode: "edit", returnUrl: this.router.url }]);
      
      if (this._authService.checkMenuRight("category", "edit") == true) {
        this.router.navigate(["./pages/masters/category/add-category", { mode: "edit", returnUrl: this.router.url }])
      } else {
        this.messageSubject.next("You are not authorized to Edit Category.");
        this.openAuthDialog();
      } 

    
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onViewClick(event): void {
    try {
     // this.router.navigate(["./pages/masters/category/add-category", { menuID: event.data.MENUCAT, mode: "view", returnUrl: this.router.url }]);
      
      if (this._authService.checkMenuRight("category", "view") == true) {
        this.router.navigate(["./pages/masters/category/add-category", { mode: "view", returnUrl: this.router.url }])
      } else {
        this.messageSubject.next("You are not authorized to View Category.");
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

