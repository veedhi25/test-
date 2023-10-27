import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'


import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { productHierarchyService } from './productHierarchy.service';
import { ProductHierarchy } from '../../../../common/interfaces/ProductHierarchy.interface';

@Component({
        selector: 'productHierarchy',
        templateUrl: './productHierarchy.component.html', 
        providers: [productHierarchyService],
        styleUrls: ["../../../modal-style.css"],
 })  
export class ProductHierarchyComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') childModal: ModalDirective;
    viewMode = false;
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    modeTitle: string = '';
    productHierarchyObj: ProductHierarchy = <ProductHierarchy>{};
    initialTextReadOnly: boolean = false;
    private returnUrl: string; 
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];
    chanels : any[] = [];
    showChanelOption = false; 
    userProfile:any=<any>{};
    ngOnInit() {
        try {
           // this.getChanel();
            if (!!this._activatedRoute.snapshot.params['mode']) {
                if (this._activatedRoute.snapshot.params['mode'] == "view") {
                    this.viewMode = true;

                }
            }
            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['Id']) {
                let BID: string = "";
                BID = this._activatedRoute.snapshot.params['Id'];

                this._productHierarchyservice.getProductHierarchy(BID)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            console.log(data);
                            let  productHierarchyObj=data.result;
                            
                            this.form.patchValue({
                                Id: productHierarchyObj.Id,
                                Name: productHierarchyObj.Name,
                                Address: productHierarchyObj.Address,
                                Parent: productHierarchyObj.Parent,
                            })


                            if (this._activatedRoute.snapshot.params['mode'] == null) {
                                this.modeTitle = "Edit Branch";
                            } else if (this._activatedRoute.snapshot.params['mode'] == "view") {
                                this.modeTitle = "View Branch";
                            }
                            this.mode = 'edit';
                            this.initialTextReadOnly = true;

                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in Company Hierarchy";
                            this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Branch";
                        this.masterService.resolveError(error, "Company Hierarchy - getBranch");
                    }
                    )
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add Company";
                this.initialTextReadOnly = false;

            }

        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    constructor(
        protected masterService: MasterRepo,
        protected _productHierarchyservice: productHierarchyService, 
        private router: Router, 
        private fb: FormBuilder,
        private _activatedRoute: ActivatedRoute) 
    {
        this.buildForm();
        this.getParent();
        //this.productHierarchyObj.type = ""; 
       // this.branchObj.TYPE = "sellable";
       // this.userProfile=authservice.getUserProfile();
    } 

    buildForm(){
        this.form = this.fb.group({
            Id: [0],
            Name: ["", Validators.required],
            Parent: [""],
            
          });
    }
    getParent(){
        this.masterService.getAllProductHierarchyParent().subscribe(
            (res) => {
                this.chanels = res;
            }
        )
    }


    getChanel(){
      this.masterService.getAllChanel().subscribe(
          (res) => {
              this.chanels = res;
              
          }
      )
    }

 

    cancel() {
        try {
            this.router.navigate([this.returnUrl]);
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    ngOnDestroy() {
        try {
            //if(this.subitSubscription)
            //  this.subitSubscription.unsubscribe();
            this.subcriptions.forEach(subs => {
                subs.unsubscribe(); 
            });
        } catch (ex) {
            console.log(ex);
            alert(ex);
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
            alert(ex);
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
            alert(ex);
        }
    }

    onSave() {
        try {
            //validate before Saving
            this.DialogMessage = "Saving Data please wait..."
            this.childModal.show(); 
            if(!this.form.valid) {
                this.DialogMessage = "All value should be valid" 
                setTimeout(() => {
                    this.childModal.hide();  
                }, 2000)
                return;
            } 
          //  this.branchObj.PARENTBRANCHID=this.userProfile.CompanyInfo.BRANCHID;
            this.onsubmit();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    onsubmit() {
        try {
            let saveModel = Object.assign(this.productHierarchyObj, {}, this.form.value)
            
            let sub = this._productHierarchyservice.saveProductHeirarchy(this.mode, saveModel)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();

                            this.router.navigate([this.returnUrl]);
                            
                        }, 1000)

                    }
                    else {
                        if (data.result == "Duplicate_ID") {
                            this.DialogMessage = "Can't save data! Duplicate BranchId"
                            setTimeout(() => {
                                this.childModal.hide();

                                this.router.navigate([this.returnUrl]);
                            }, 1000)
                        }
                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }
                        this.DialogMessage = "Error in Saving Data:" + data.result._body;
                        console.log(data.result._body);
                        setTimeout(() => {
                            this.childModal.hide();
                        }, 3000)
                    }
                },
                    error => { alert(error) }
                );
            this.subcriptions.push(sub);
        }
        catch (e) {
            alert(e);
        }
    }
    
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    TypeChange(event){
        
       // this.branchObj.TYPE = value
    }

    typechange(value)
    {
       console.log("chefkc",this.productHierarchyObj,value); 
    }
}









