import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'


import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { branchService } from './branch.service';
import { validateConfig } from '@angular/router/src/config';
import { AuthService } from '../../../../common/services/permission';

import { ProductHierarchy } from '../../../../common/interfaces/ProductHierarchy.interface';
import { GeographicalHierarchyService } from './geographical-hierarchy.service';
import { GeographicalHierarchy } from '../../../../common/interfaces/GeographicalHierarchy.interface';

@Component({
        selector: 'geographical-hierarchy',
        templateUrl: './geographical-hierarchy.component.html', 
        providers: [GeographicalHierarchyService],
       // styleUrls: ["../../../Style.css", './modals.scss'],
        styleUrls: ["../../../modal-style.css"],
 })  
export class GeographicalHierarchyComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') childModal: ModalDirective;
    viewMode = false;
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    modeTitle: string = '';
    geographicalHierarchyObj: GeographicalHierarchy = <GeographicalHierarchy>{};
    initialTextReadOnly: boolean = false;
    private returnUrl: string; 
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];
    chanels : any[] = [];
    routeNameList : any[] = [];
    pclist : any[] = [];
    showChanelOption = false; 
    userProfile:any=<any>{};
    isDisabled : boolean;

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

                this._GeographicalHierarchyservice.getGeographicalHierarchy(BID)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            console.log(data);
                            let  geographicalHierarchyObj=data.result;
                            console.log("geographical value"+geographicalHierarchyObj);
                            this.form.patchValue({
                                Id: geographicalHierarchyObj.Id,
                                Name: geographicalHierarchyObj.Name,
                               // Address: geographicalHierarchyObj.Address,
                                Parent: geographicalHierarchyObj.Parent,
                                PCL: geographicalHierarchyObj.PCL,
                                Type: geographicalHierarchyObj.Type,
                                Route: geographicalHierarchyObj.Route,
                                CODE: geographicalHierarchyObj.CODE

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
        protected _GeographicalHierarchyservice: GeographicalHierarchyService, 
        private router: Router, 
        private fb: FormBuilder,
        private _activatedRoute: ActivatedRoute) 
    {
        this.buildForm();
        this.getRouteMaster();
       //this.getParent(Type);
        //this.productHierarchyObj.type = ""; 
       // this.branchObj.TYPE = "sellable";
       // this.userProfile=authservice.getUserProfile();
    } 

    buildForm(){
        this.form = this.fb.group({
            Id: ["0"],
            Name: ["", Validators.required],
            Parent: [""],
            PCL: [""],
            Type: [""],
            Route: [""],
            CODE: [""]
            
          });
    }

    getParent(Type){
        //let Type: string = "";
        this.chanels = [];
        this._GeographicalHierarchyservice.getGeographicalHierarchyParent(Type).subscribe(
            (res) => {
               // console.log("Sales man"+JSON.stringify(res.result));
                this.chanels = res.result;
            }
        )
    }
    getProductCategory(){
        this.masterService.getAllProductCategoryLine().subscribe(
                  (res) => {
                      console.log("product category line"+JSON.stringify(res));
                      this.pclist = res;
                  }
              )
    }
    getRouteMaster(){
        this.routeNameList = [];
        this.masterService.getAllRouteMasterName().subscribe( 
            (res) =>{
                console.log("RouteName"+res);
                this.routeNameList = res;
            }
        )
    }    

    // getChanel(){
    //   this.masterService.getAllChanel().subscribe(
    //       (res) => {
    //           this.chanels = res;
              
    //       }
    //   )
    // }

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
            this.onsubmit();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    onsubmit() {
        try {
            let saveModel = Object.assign(this.geographicalHierarchyObj, {}, this.form.value)
            
            let sub = this._GeographicalHierarchyservice.saveGeographicalHeirarchy(this.mode, saveModel)
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
    onTypeChange(){
        this.getProductCategory();
        if(this.form.get("Type").value == 'RSM'){ 
            //this.form.get("PCL").disable()
            this.form.get("Parent").disable()
            //this.getProductCategory();
        }
        else{
            this.form.get("PCL").enable()
            this.form.get("Parent").enable()
        }
        if(this.form.get("Type").value == 'RSM') return;
        let Type= this.form.get("Type").value == 'SO' 
            ? 'ASM'
            :  'RSM'
        this.getParent(Type);

    }
    
    setProductCategoryLine($event){
        console.log($event);
        var asdf = this.chanels.filter(x => x.NAME == $event.target.value)[0]
        console.log("yo name"+JSON.stringify(asdf.PCL));
        this.form.patchValue({
            PCL : asdf.PCL
        })
        console.log("yo name2",this.form.get("PCL").value);
    }

}









