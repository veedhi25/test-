import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import { Warehouse } from "../../../../common/interfaces/TrnMain";
import { AddWarehouseService } from "./addWarehouse.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PreventNavigationService } from "../../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { OrganizationType } from "../../../../../common/interfaces/organization-type.interface";
import { OrganizationHierarchyService } from "../organization-hierarchy.service";
import { OrganizationHierarchy } from "../../../../../common/interfaces/organization-hierarchy.interface";



@Component({
  selector: "add-organization-hierarchy-selector",
  templateUrl: "./add-organization-hierarchy.component.html",

  providers: [OrganizationHierarchyService],
  styleUrls: ["../../../../modal-style.css"]
})
export class OrganizationHierarchyFormComponent implements OnInit, OnDestroy {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  organizationHierarchy: OrganizationHierarchy = <OrganizationHierarchy>{};
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  form: FormGroup;
  pclist : any[] = [];
  chanels : any[] = [];
  orgTypeList: any [] = [];
  private subcriptions: Array<Subscription> = [];

  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected service: OrganizationHierarchyService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    
  ) {
    this.getProductCategoryLine();
    this.getParent();
    this.getOrganizationType();
  }

  ngOnInit() {
    try {
      this.form = this.fb.group({
        OrgCode: [""],
        OrgName:["",[Validators.required]],
        ParentOrgCode: [""],
        PCL: [""],
        OrgAddress:[""],
        SAPCode: [""],
        Status:[1],
        orgType:[""]

      });

      this.onFormChanges();
      
      if (!!this._activatedRoute.snapshot.params["mode"]) {
        if (this._activatedRoute.snapshot.params["mode"] == "view") {
          this.viewMode = true;
          this.form.get("NAME").disable();
          this.form.get("ADDRESS").disable();
          this.form.get("PHONE").disable();
          this.form.get("REMARKS").disable();
        }
      }
      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }
      if (!!this._activatedRoute.snapshot.params["orgCode"]) {
        let orgCode: string = "";
        orgCode = this._activatedRoute.snapshot.params["orgCode"];
        this.loadingService.show("Getting data, Please wait...");
        this.service.getOrganizationHierarchy(orgCode).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              console.log(data);
              this.form.patchValue({

                OrgCode: data.result.OrgCode,
                OrgName: data.result.OrgName,
                ParentOrgCode: data.result.ParentOrgCode,
                PCL: data.result.PCL,
                OrgAddress: data.result.OrgAddress,
                SAPCode: data.result.SAPCode,
                Status: data.result.Status,
                orgType: data.result.orgType

              });

              if (this._activatedRoute.snapshot.params["mode"] == null) {
                this.modeTitle = "Edit Organization Hierarchy";
              } else if (
                this._activatedRoute.snapshot.params["mode"] == "view"
              ) {
                this.modeTitle = "View Organization Hierarchy";
              }
              this.mode = "edit";
              this.initialTextReadOnly = true;
            } else {
              this.mode = "";
              this.modeTitle = "Edit -Error in Organization Hierarchy";
              this.initialTextReadOnly = true;
            }
          },
          error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2 -Error in Organization Hierarchy";
            this.masterService.resolveError(error, "OrganizationHierarchy - getOrganizationHierarchy");
          }
        );
      } else {
        this.mode = "add";
        this.modeTitle = "Add Organization Hierarchy";
        this.initialTextReadOnly = false;
      }
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  // getOrganizationType(): void{
  //   this.orgTypeList = [];
  //   this.masterService.masterGetmethod("/getAllOrganizationTypeList")
  //   .subscribe(res => {
  //       if (res.status == "ok") {
  //           this.orgTypeList = res
  //       }
  //       else {
  //           console.log("error on getting organization type list " + res);
  //       };

  //   }, error => {
  //           console.log("error on getting organization type list ", error);
  //       }
  //   );
  // }


  onFormChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });
  }

  cancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  disabled() {
    try {
      if (this.viewMode == true) {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  editDisabled() {
    try {
      if (this.mode == "edit") {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  onSave() {
    try {
      //validate before Saving
      if (!this.form.valid) {
        this.alertService.info(
          "Invalid Request, Please enter all required fields."
        );
        return;
      }
      this.onsubmit();
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }

  onsubmit() {
    try {
   
      let saveModel = Object.assign(<OrganizationHierarchy>{}, this.form.value); 
      this.loadingService.show("Saving data, please wait...");
      let sub = this.masterService
        .saveOrganizationHierarchy(this.mode, saveModel) 
        .subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              this.alertService.success("Data Saved Successfully");
              this.preventNavigationService.preventNavigation(false);
              setTimeout(() => {
                this.router.navigate([this.returnUrl]);
              }, 1000);
            } else {
              if (
                data.result._body ==
                "The ConnectionString property has not been initialized."
              ) {
                this.router.navigate(["/login", this.router.url]);
                return;
              }
              this.alertService.error(
                `Error in Saving Data: ${data.result._body}`
              );
            }
          },
          error => {
            this.loadingService.hide();
            this.alertService.error(error);
          }
        );
      this.subcriptions.push(sub);
    } catch (e) {
      this.alertService.error(e);
    }
  }

  getParent(){
   
    this.chanels = [];
    this.service.getOrganizationHierarchyParent().subscribe(
        (res) => {
        
            this.chanels = res;
        }
    )
}

getOrganizationType(){
  this.orgTypeList = [];
  this.service.getOrganizationList().subscribe(
    (res) =>{
      this.orgTypeList = res;
    }
  )
}

  getProductCategoryLine(){
    this.masterService.getAllProductCategoryLine().subscribe(
              (res) => {
                //  console.log("product category line"+JSON.stringify(res));
                  this.pclist = res;
                  if(this.pclist.length){
                    this.form.patchValue({
                      PCL : this.pclist[0].PCL
                    });
                  }
              }
          )
} 

onParentChange($event){
  var asdf = this.chanels.filter(x => x.OrgCode == $event.target.value)[0]
 // console.log("pcl value"+JSON.stringify(asdf.PCL));
  this.form.patchValue({
      PCL: asdf.PCL
  })

}

  @ViewChild("loginModal") loginModal: ModalDirective;
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  }
}
