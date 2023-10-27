import { Component,Injector,Input } from "@angular/core";
import { MasterRepo } from "./../../../../common/repositories/masterRepo.service";

import { LocalDataSource } from "../../../../node_modules/ng2-smart-table/";
import "style-loader!./smartTables.scss";

import { AddUserService } from "./adduser.service";
import { Router } from "@angular/router";
import { AppComponentBase } from "../../../../app-component-base";
@Component({
  selector: "user-list",
  templateUrl: "./userList.component.html",
  providers: [AddUserService]
})
export class UserList extends AppComponentBase {
  @Input() targetCompanyId: string | undefined;
  query: string = "";
  roleList: any;

  settings = {
    mode: "external",
    add: {
      addButtonContent: "Add",
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
    actions: {
      position: 'right'
    },	
    edit: {
      editButtonContent: '<i class="fa fa-pencil" title="Edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a" title="Delete"></i>',
      confirmDelete: true
    },
    columns: {
      username: {
        title: "User Name",
        type: "text"
      },
      email: {
        title: "Email",
        type: "text"
      },
      role: {
        title: "Role",
        type: "text"
      }
    }
  };
  roleSettings = {
    mode: "external",
    add: {
      addButtonContent: "",
      createButtonContent: "",
      cancelButtonContent: ""
    },
    actions: {
      position: 'right'
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil" title="Edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>'
    },
    delete: {
      deleteButtonContent: ""
    },
    columns: {
      rolename: {
        title: "Role Name",
        type: "text"
      },
      role: {
        title: "Role",
        type: "text"
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  roleSource: LocalDataSource = new LocalDataSource();

  constructor(
    private adduserService: AddUserService,
    private router: Router,
    private masterService: MasterRepo,public injector: Injector) {
      super(injector);
    try {
      if(typeof this.targetCompanyId =='undefined' || this.targetCompanyId == null || this.targetCompanyId =='-1'){
        this.targetCompanyId='';
    }
      let data: Array<any> = [];
      this.adduserService
        .getUserListFortargetCompanyId(this.targetCompanyId)
        .flatMap(d => d || [])
        .subscribe(
          res => {
            data.push(<any>res);
            this.source.load(data);
          },
          error => {
            this.masterService.resolveError(error, "userList - getUserList");
          }
        );

      let roleData: Array<any> = [];
      this.adduserService.getRoleListFortargetCompanyId(this.targetCompanyId).subscribe(res => {
        this.roleSource.load(res.result);
      });
    } catch (ex) {
      alert(ex);
    }
  }

  onAddClick(): void {
    try {
      //this.divService.create();
      this.router.navigate([
        "/pages/configuration/userManager/adduser",
        { mode: "user", returnUrl: this.router.url,targetCompanyId:this.targetCompanyId  }
      ]);
      //window.alert("test add");
    } catch (ex) {
      alert(ex);
    }
  }
  onDeleteConfirm(event): void {
    if(!this.outletconfigUserManagementDeleteChild() && !this.outletconfigParentandIndividual())
    {
      alert("You are not configured for this option.");
    //  
      return;
    }
    if (window.confirm("Are you sure you want to inactive this user?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEditClick(event): void {
    try {
    //  
       
      if(!this.outletconfigUserManagementUpdateChild() && !this.outletconfigParentandIndividual())
      {
        alert("You are not configured for this option.");
      //  
        return;
      }
      this.router.navigate([
        "pages/configuration/userManager/adduser",
        { mode: "edit", user: event.data.username, returnUrl: this.router.url,targetCompanyId:this.targetCompanyId }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }

  addRole(): void {
    try {
      this.router.navigate([
        "/pages/configuration/userManager/adduser",
        { mode: "role", returnUrl: this.router.url,targetCompanyId:this.targetCompanyId }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }

  onRoleEditClick(event) {
    try {
      // if(!this.outletconfigUserManagementUpdateChild() && !this.outletconfigParentandIndividual())
      // {
      //   alert("You are not configured for this option.");
      // //  
      //   return;
      // }
      console.log(event);
      this.router.navigate([
        "/pages/configuration/userManager/adduser",
        { mode: "editRole", rolename: event.data.rolename, returnUrl: this.router.url,targetCompanyId:this.targetCompanyId }
      ]);
    } catch (error) {
      alert(error);
    }
  }

   getTargetCompanyId() {
        if (typeof this.targetCompanyId == 'undefined' || this.targetCompanyId == null) {
            this.targetCompanyId = '';
        }
        return this.targetCompanyId;
    }

    ngOnChanges(){
      try {
        console.log("targetCompanyIdUserList",this.targetCompanyId);
        if(typeof this.targetCompanyId =='undefined' || this.targetCompanyId == null || this.targetCompanyId =='-1'){
          this.targetCompanyId='';
      }
        let data: Array<any> = [];
        this.adduserService
          .getUserListFortargetCompanyId(this.targetCompanyId)
          .flatMap(d => d || [])
          .subscribe(
            res => {
              data.push(<any>res);
              this.source.load(data);
            },
            error => {
              this.masterService.resolveError(error, "userList - getUserList");
            }
          );
  
        let roleData: Array<any> = [];
        this.adduserService.getRoleListFortargetCompanyId(this.targetCompanyId).subscribe(res => {
          this.roleSource.load(res.result);
        });
      } catch (ex) {
        alert(ex);
      }
  }

  // ngOnInit(){
  //   
  // }
  //*ngIf="(outletconfigUserManagementCreateChild() || outletconfigParentandIndividual())"
}
