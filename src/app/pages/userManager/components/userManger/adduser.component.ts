import { Component, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PAGES_MENU } from "../../../../../app/pages/pages.menu";
import * as _ from "lodash";
import { Routes, ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray
} from "@angular/forms";
import "style-loader!./grid.scss";
import { AddUserService } from "./adduser.service";
import { EditPasswordValidator } from "../../../../theme/validators";
import { ModalDirective } from "ng2-bootstrap";
import { Warehouse, Division } from "../../../../common/interfaces/TrnMain";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AuthService } from "../../../../common/services/permission";

@Component({
  selector: "user-manager",
  templateUrl: "./adduser.component.html",
  providers: [AddUserService]
})
export class AddUser implements OnInit {
  @ViewChild("childModal") childModal: ModalDirective;
  @ViewChild("loginModal") loginModal: ModalDirective;
  DialogMessage: string = "Saving data please wait ...";
  mode: string = "add"; //mode of the form add or edit
  modeTitile: string = "Add user";
  userForm: FormGroup; //main form
  userMenuList = []; //list data menulist of user
  items = []; //converted array of usermenu from main menu
  userRightList = []; //list of rights of user or empty {right,description,value,valutype}
  userType: string = "group"; //default user type ie, usergroup or user
  warehouseList: Warehouse[] = [];
  divisionWarehouseList: Warehouse[] = [];
  divisionList: Division[] = [];
  private returnUrl: string;
  private user: string;
  private targetCompanyId : string;
  private roleList: any;
  private rights: TransactionColumnSetting[] = [];
  public loggedInuserDetail: any = {};
  androidBillRights: any[] = [];
  userProfile: any;


  constructor(
    private loadingService: SpinnerService,
    private alertService: AlertService,
    private masterService: MasterRepo,
    private fb: FormBuilder,
    private addUserService: AddUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _authUserService: AuthService
  ) {
    try {
      //getting parameter passed
      this.userProfile = this._authUserService.getUserProfile();
      this.loggedInuserDetail = JSON.parse(localStorage.getItem("USER_PROFILE"));
      this.returnUrl = this.activatedRoute.snapshot.params["returnUrl"] || "";
      this.mode = this.activatedRoute.snapshot.params["mode"];
      this.userType = this.activatedRoute.snapshot.params["group"] || "";
      this.user = this.activatedRoute.snapshot.params["user"];
      this.targetCompanyId = this.activatedRoute.snapshot.params["targetCompanyId"];
      this.masterService.refreshTransactionList();
      this.masterService.getWarehouseFortargetCompanyId(this.targetCompanyId).subscribe(res => {
        this.warehouseList.push(<Warehouse>res);
      });
      this.masterService.getAllDivisionsFortargetCompanyId(this.targetCompanyId).subscribe(res => {
        this.divisionList.push(<Division>res);
      });
      this.addUserService.getRoleListFortargetCompanyId(this.targetCompanyId).subscribe(res => {
        this.roleList = res.result;
      });
    } catch (ex) {
      alert(ex);
    }
  }
  public roleForm: FormGroup;
  ngOnInit() {
    console.log("targetCompanyIdAddUser",this.targetCompanyId);
    try {
      this.userForm = this.fb.group({
        username: ["", [Validators.required]],
        password: ["", Validators.compose([EditPasswordValidator.validate(this.mode)])],
        email: ["", [Validators.required]],
        phone: ["", [Validators.required]],
        division: [""],
        warehouse: [""],
        role: [""],
        allowAppBilling: [false],
        allowIndentDeliveryToHQ: [false],
        allowIndentApprovalToHQ: [false],
        allowPhysicalInventoryAppAccess: [false],
        allowPhysicalInventoryAppReportAccess: [false],
        AllowStockSettlementApprovalApp: [false]
      });
      this.roleForm = this.fb.group({
        role: new FormControl("A", [Validators.required]),
        roleName: new FormControl("", [Validators.required]),
        menuRights: this.fb.array([]),
        userRights: this.fb.array([])
      });
      //
      if (this.mode == "edit") {
        this.modeTitile = "Editing User";
        this.addUserService.getUserProfileFortargetCompanyId(this.user,this.targetCompanyId).subscribe(data => {
          if (data.status == "ok") {
            this.userForm.controls["username"].patchValue(data.result.username);
            this.userForm.controls["email"].patchValue(data.result.email);
            this.userForm.controls["phone"].patchValue(data.result.phone);
            this.userForm.controls["role"].patchValue(data.result.role);
            this.userForm.controls["division"].patchValue(data.result.division);
            this.userForm.controls["allowAppBilling"].patchValue(data.result.allowAppBilling);
            this.userForm.controls["allowIndentApprovalToHQ"].patchValue(data.result.allowIndentApprovalToHQ)
            this.userForm.controls["allowIndentDeliveryToHQ"].patchValue(data.result.allowIndentDeliveryToHQ)
            this.userForm.controls["allowPhysicalInventoryAppAccess"].patchValue(data.result.allowPhysicalInventoryAppAccess);
            this.userForm.controls["allowPhysicalInventoryAppReportAccess"].patchValue(data.result.allowPhysicalInventoryAppReportAccess);
            this.userForm.controls["AllowStockSettlementApprovalApp"].patchValue(data.result.AllowStockSettlementApprovalApp);
            this.userForm.controls["warehouse"].patchValue(
              data.result.warehouse
            );
          }
        });

      } else if (this.mode == "user") {
        this.modeTitile = "Add User";

      }
      else if (this.mode == "role" || this.mode == "editRole") {

        let convertedMenuObject: Routes = _.cloneDeep(<Routes>PAGES_MENU);
        convertedMenuObject.forEach(route => {
          route.children.forEach(child => {
            this._convertObjectToItem(child, this.items, 1);
          });
        });
        if (this.mode == "role") {

          this.modeTitile = "Add Role";
          this.initUserMenu();
          this.getInitialUserRights();
        } else if (this.mode == "editRole") {
          this.modeTitile = "Edit Role";
          this.getRoleDetail(this.activatedRoute.snapshot.params["rolename"]);
        }

      }
    } catch (ex) {
      alert(ex);
    }
  }
  //initializing the menu contols
  initUserMenu() {
    try {
      const control = <FormArray>this.roleForm.controls["menuRights"];
      this.items.forEach((usermenu: userMenu) => {
        let fgroup = this.fb.group({
          title: new FormControl({ value: usermenu.title, disabled: true }),
          path: new FormControl(usermenu.path),
          view: new FormControl(false),
          add: new FormControl(false),
          edit: new FormControl(false),
          delete: new FormControl(false),
          print: new FormControl(false),
          import: new FormControl(false),
          export: new FormControl(false),
          post: new FormControl(false)
        });

        control.push(fgroup);
      });
    } catch (ex) {
      alert(ex);
    }
  }
  //property maping
  public checkboxPropertiesMapping = {
    model: "value",
    value: "right",
    label: "description",
    baCheckboxClass: "class"
  };
  //initializing user rights controls in formgroup
  initUserRights() {
    try {
      const control = <FormArray>this.roleForm.controls["userRights"];
      let fgroup;
      this.userRightList
        .map(right => {
          right.valueType = right.data_type;
          if (right.valueType == "tinyint") {
            right.value = right.value == 0 ? false : true;
          } else if (
            right.valueType == "numeric" ||
            right.valueType == "decimal" ||
            right.valueType == "float"
          ) {
            if (right.value == "") right.value = 0;
          } else {
            if (right.value == null || right.value == "") {
              right.value = "";
            }
          }
          return right;
        })
        .forEach(right => {
          fgroup = this.fb.group({
            path: new FormControl({ value: right.description, disabled: true }),
            right: right.right,
            value: right.value,
            valueType: [right.data_type]
          });

          control.push(fgroup);
        });
    } catch (ex) {
      alert(ex);
    }
  }

  //DIVISIONLIST TO SELECT
  setDivisionList() { }

  //conversion function to from menuobject to array
  protected _convertObjectToItem(
    object,
    items: Array<userMenu>,
    level: number,
    parent?: any
  ): void {
    try {
      let item: userMenu = <userMenu>{};
      if (object.data && object.data.menu) {
        level = level + 2;
        item.path = object.path;
        item.title = Array(level).join("  ") + object.data.menu.title;
        item.add = false;
        item.delete = false;
        item.edit = false;
        item.print = false;
        item.export = false;
        item.import = false;
        item.view = true;
        item.post = false;
        items.push(item);

      }
      if (object.data && object.children && object.children.length > 0) {
        object.children.forEach(child => {
          // items[0].hide=true;
          this._convertObjectToItem(child, items, level + 1);
        });
      }
    } catch (ex) {
      alert(ex);
    }
  }
  saveData(data: any) {
    try {
      data.targetCompanyId=this.targetCompanyId;
      if (this.mode == "user" || this.mode == "edit") {
        this.addUserService.saveUser(data).subscribe(
          data => {
            if (data.status == "ok") {
              if (this.mode == "user") {
                this.alertService.success("User created successfully");
              } else if (this.mode == "edit") {
                this.alertService.success("User updated successfully");
              }
              this.router.navigate([this.returnUrl]);
            } else {
              if (
                data.result._body ==
                "The ConnectionString property has not been initialized."
              ) {
                this.loginModal.show();
                return;
              }
              this.alertService.error(
                "Error in saving data:",
                data.result._body
              );
            }
          },
          Error => {
            try {
              if (Error.status != 200) {
                this.alertService.error(Error.json());
              }
            } catch (e) {
              this.alertService.error(e);
            }
          }
        );
      } else if (this.mode == "role" || this.mode == "editRole") {
        // for (let x of this.rights) {
        //   x.status = x.status ? 1 : 0;
        // }
        //  data.transactionRightsJson = this.rights;
        this.loadingService.show("Saving data please wait....");
        data.androidBillRights = this.androidBillRights;
        this.addUserService.saveRole(data).subscribe(res => {
          this.loadingService.hide();
          this.alertService.success(res.result);
          this.router.navigate([this.returnUrl]);
        }, error => {
          this.loadingService.hide();
          this.alertService.error(error);
        });
      }
    } catch (ex) {
      alert(ex);
      this.DialogMessage = ex;
      setTimeout(() => {
        this.childModal.hide();
      }, 3000);
    }
  }

  onSubmit() {
    let canSubmit: boolean = false;
    if (this.mode == "user") {
      if (this.userForm.valid) {
        canSubmit = true;
      }
    } else if (this.mode == "role" || this.mode == "editRole") {
      if (this.roleForm.valid) {
        canSubmit = true;
      }
    } else if (this.mode == "edit") {
      canSubmit = true;
    }

    if (canSubmit) {
      try {
        let data = this.prepareToSave();
        if (data) {
          this.saveData(data);
        }
      } catch (ex) {
        this.alertService.warning(ex);
      }
    } else {
      this.alertService.warning("Please Fill all the required fields");
    }
  }

  findMenuRights(menuname: string, menus: any, rt: string): boolean {
    try {
      let men = menus.filter(x => x.menu == menuname)[0];
      if (men != null) {
        return men.right.indexOf(rt) > -1;
      }

      return false;
    } catch (ex) {
      alert(ex);
    }
  }

  prepareToSave() {
    let saveObj: any;
    try {
      if (this.mode == "user") {
        if (
          this.userForm.controls["username"].status == "INVALID" ||
          this.userForm.controls["password"].status == "INVALID" ||
          this.userForm.controls["email"].status == "INVALID" ||
          this.userForm.controls["phone"].status == "INVALID" ||
          this.userForm.controls["role"].status == "INVALID" ||
          this.userForm.controls["division"].status == "INVALID" ||
          this.userForm.controls["warehouse"].status == "INVALID"
        ) {
          return null;
        }
        saveObj = {
          username: this.userForm.controls["username"].value,
          password: this.userForm.controls["password"].value,
          email: this.userForm.controls["email"].value,
          phone: this.userForm.controls["phone"].value,
          role: this.userForm.controls["role"].value,
          division: this.userForm.controls["division"].value,
          warehouse: this.userForm.controls["warehouse"].value,
          allowAppBilling: this.userForm.controls["allowAppBilling"].value,

          allowPhysicalInventoryAppAccess: this.userForm.controls["allowPhysicalInventoryAppAccess"].value,
          allowIndentDeliveryToHQ: this.userForm.controls["allowIndentDeliveryToHQ"].value,
          allowIndentApprovalToHQ: this.userForm.controls["allowIndentApprovalToHQ"].value,
          allowPhysicalInventoryAppReportAccess: this.userForm.controls["allowPhysicalInventoryAppReportAccess"].value,
          AllowStockSettlementApprovalApp: this.userForm.controls["AllowStockSettlementApprovalApp"].value,
        };
      } else if (this.mode == "edit") {
        saveObj = {
          username: this.userForm.controls["username"].value,
          password: this.userForm.controls["password"].value,
          email: this.userForm.controls["email"].value,
          phone: this.userForm.controls["phone"].value,
          role: this.userForm.controls["role"].value,
          division: this.userForm.controls["division"].value,
          warehouse: this.userForm.controls["warehouse"].value,
          allowAppBilling: this.userForm.controls["allowAppBilling"].value,
          allowPhysicalInventoryAppAccess: this.userForm.controls["allowPhysicalInventoryAppAccess"].value,
          allowIndentDeliveryToHQ: this.userForm.controls["allowIndentDeliveryToHQ"].value,
          allowIndentApprovalToHQ: this.userForm.controls["allowIndentApprovalToHQ"].value,
          allowPhysicalInventoryAppReportAccess: this.userForm.controls["allowPhysicalInventoryAppReportAccess"].value,
          AllowStockSettlementApprovalApp: this.userForm.controls["AllowStockSettlementApprovalApp"].value,
        };
      } else if (this.mode == "role" || this.mode == "editRole") {
        if (
          this.roleForm.controls["role"].status == "INVALID" ||
          this.roleForm.controls["roleName"].status == "INVALID"
        ) {
          return null;
        }

        let ctl = this.roleForm.value.menuRights;
        let mRights = [];
        ctl.forEach(menu => {
          let rights = [];
          for (var prop in menu) {
            if (typeof menu[prop] === "boolean") {
              if (menu[prop] == true) {
                rights.push(prop);
              }
            }
          }
          if (rights.length > 0) {
            mRights.push({ menu: menu["path"], right: rights });
          }
        });
        let uRights = [];
        this.roleForm.value.userRights.forEach(right => {
          if (right.valueType == "tinyint") {
            if (right.value == true) {
              right.value = 1;
            } else {
              right.value = 0;
            }
          }
          if (
            right.valueType == "numeric" ||
            right.valueType == "decimal" ||
            right.valueType == "float"
          ) {
            if (right.value == "") right.value = 0;
            if (Number(right.value) == NaN) right.value = 0;
          }
          uRights.push(right);
        });
        saveObj = {
          role: this.roleForm.controls["role"].value,
          roleName: this.roleForm.controls["roleName"].value,
          menuRights: mRights,
          userRights: uRights
        };
      }
      if (this.mode == "edit") {
        return { mode: "edit", data: saveObj };
      } else if (this.mode == "user") {
        return { mode: "user", data: saveObj };
      } else if (this.mode == "role") {
        return { mode: "role", data: saveObj };
      } else if (this.mode == "editRole") {
        return { mode: "editRole", data: saveObj };
      }
    } catch (ex) {
      alert(ex);
    }
  }

  hideChildModal() {
    try {
      this.childModal.hide();
    } catch (ex) {
      alert(ex);
    }
  }
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      alert(ex);
    }
  }
  back() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      alert(ex);
    }
  }

  changeDivision(value) {
    this.divisionWarehouseList = this.warehouseList.filter(
      res => res.DIVISION == value
    );
  }

  public getRoleDetail(rolename: string) {
    this.loadingService.show("Please wait! Getting Role Detail");
    this.addUserService.getRoleFortargetCompanyId(rolename,this.targetCompanyId).subscribe(res => {
      this.roleForm.controls["roleName"].patchValue(res.result.rolename);
      this.userRightList = res.result.userRights;
      if (res.result.transactionRights != null) {
        this.rights = res.result.transactionRights.length ? res.result.transactionRights : this.rights;
      }
      this.initUserRights();
      this.initUserMenuForEditRole(res.result.menuRights);
      if (res.result2 != null) {
        this.androidBillRights = res.result2;
      }
      this.loadingService.hide()
    });
  }

  public initUserMenuForEditRole(menuRights: any) {
    try {
      const control = <FormArray>this.roleForm.controls["menuRights"];
      let fgroup: FormGroup;

      this.items.forEach(usermenu => {
        fgroup = this.fb.group({
          title: new FormControl({
            value: usermenu.title,
            disabled: true
          }),
          path: new FormControl(usermenu.path),
          view: new FormControl(
            this.findMenuRights(usermenu.path, menuRights, "view")
          ),
          add: new FormControl(
            this.findMenuRights(usermenu.path, menuRights, "add")
          ),
          edit: new FormControl(
            this.findMenuRights(usermenu.path, menuRights, "edit")
          ),
          delete: new FormControl(
            this.findMenuRights(usermenu.path, menuRights, "delete")
          ),
          print: new FormControl(
            this.findMenuRights(usermenu.path, menuRights, "print")
          ),
          import: new FormControl(
            this.findMenuRights(usermenu.path, menuRights, "import")
          ),
          export: new FormControl(
            this.findMenuRights(usermenu.path, menuRights, "export")
          ),
          post: new FormControl(
            this.findMenuRights(usermenu.path, menuRights, "post")
          )
        });
        control.push(fgroup);
      });
    } catch (ex) {
      alert(ex);
    }
  }


  onRoleParentChecked(index, event) {
    this.roleForm.get('menuRights')['controls'][index].get('view').patchValue(!(this.roleForm.get('menuRights')['controls'][index].get('view').value))
    this.roleForm.get('menuRights')['controls'][index].get('add').patchValue(!(this.roleForm.get('menuRights')['controls'][index].get('add').value))
    this.roleForm.get('menuRights')['controls'][index].get('edit').patchValue(!(this.roleForm.get('menuRights')['controls'][index].get('edit').value))
    this.roleForm.get('menuRights')['controls'][index].get('delete').patchValue(!(this.roleForm.get('menuRights')['controls'][index].get('delete').value))
    this.roleForm.get('menuRights')['controls'][index].get('print').patchValue(!(this.roleForm.get('menuRights')['controls'][index].get('print').value))

  }
  androidMenuHearCheck(values) {
    for (var m of this.androidBillRights) {
      if (m.MenuName == values.MenuName) {
        for (var c of m.childMenus) {
          c.IsEnable = m.IsEnable;
        }
      }
    }
  }
  public getInitialUserRights() {
    this.loadingService.show("Please wait! Getting Role Detail");
    this.masterService.masterGetmethod("/getInitialUserRights").subscribe(res => {
      this.userRightList = res['result']
      this.initUserRights();
      this.loadingService.hide();
    }, error => {
      this.loadingService.hide();

    });

    this.addUserService.getAndroidMennus().subscribe(res => {
      this.androidBillRights = res;
    });
  }


}

export interface userMenu {
  title: string;
  path: string;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  print: boolean;
  import: boolean;
  export: boolean;
  post: boolean;
}
export interface TransactionColumnSetting {
  NAME: string;
  status: number;
}
