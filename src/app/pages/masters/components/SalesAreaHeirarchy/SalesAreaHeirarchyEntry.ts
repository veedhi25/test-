import { Component, ViewChild } from '@angular/core';
import { Unit } from "../../../../common/interfaces/Unit.interface";
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { PreventNavigationService } from '../../../../common/services/navigation-perventor/navigation-perventor.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component(
    {
        selector: 'salesareaEntrySelector',
        templateUrl: './SalesAreaHeirarchyEntry.html',
        styleUrls: ["../../../modal-style.css"],
    }
)
export class  SalesAreaFormComponent {

    mode: string = "add";
    unit: Unit = <Unit>{};
    router: Router; 
    modeTitle:string="Add Sales Area";
    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];
    trnMode: string = "";
    form: FormGroup; 
    viewMode: boolean;
    salesAreaTypeList:any[]=[];
    salesAreaList:any[]=[];
PCLList:any[]=[];
PCL:string;
    constructor(private masterService: MasterRepo,
        private preventNavigation : PreventNavigationService,
        private loadingService : SpinnerService,
        private alertService: AlertService,
        router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder) {
        this.router = router;
        if (!!this._activatedRoute.snapshot.params['returnUrl']) {
            this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
        }
        if (!!this._activatedRoute.snapshot.params['mode']) {
            this.mode = this._activatedRoute.snapshot.params['mode'];
        } 
       
        this.masterService.masterGetmethod("/getActiveSalesAreaTypeList")
        .subscribe(res => {
            if (res.status == "ok") {
                this.salesAreaTypeList = JSON.parse(res.result);
            }
            else {
                console.log("error on getting salesareatypelist " + res.result);
            };

        }, error => {
                console.log("error on getting salesareatypelist ", error);
            }
        );
        this.masterService.masterGetmethod("/getActivePCLList")
        .subscribe(res => {
            if (res.status == "ok") {
                this.PCLList = JSON.parse(res.result);
            }
            else {
                console.log("error on getting pcllist " + res.result);
            };

        }, error => {
                console.log("error on getting pcllist ", error);
            }
        );
    }

    ngOnInit() {
        this.form = this.fb.group({
            SalesAreaCode:[''],
            SalesAreaName: ['', [Validators.required]],
            ParentSalesAreaCode:[''],
            SalesAreaTypeCode:['',[Validators.required]],
            SalesAreaAddress:[''],
            PCL:[''],
            STATUS : [1],
        });  
        this.onFormChangeChanges();
        if(this.mode=="edit" || this.mode=="view")
        {
           this.modeTitle="Edit Sales Area"
            this.loadingService.show("Loading Data please wait...") 
            let salesareacode= this._activatedRoute.snapshot.params['id'];
    
            this.masterService.masterPostmethod("/getSalesArea",{SalesAreaCode:salesareacode})
                .subscribe(data => {
                    this.loadingService.hide();
                    if (data.status == 'ok') { 
                       this.form.patchValue({
                           SalesAreaCode:data.result.SalesAreaCode,
                           SalesAreaName:data.result.SalesAreaName,
                           ParentSalesAreaCode:data.result.ParentSalesAreaCode,
                           SalesAreaTypeCode:data.result.SalesAreaTypeCode,
                           SalesAreaAddress:data.result.SalesAreaAddress,
                           PCL:data.result.PCL,                        
                           STATUS:data.result.STATUS
                       });
                       this.SalesAreaTypeChange();
                       this.parentChangeEvent(data.result.ParentSalesAreaCode);
                        this.preventNavigation.preventNavigation(false);
                     
                    }
                    else {
                       
                        if (data.result._body == "The ConnectionString property has not been initialized.") {              
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }
                      
                        this.alertService.error( "Error in getting Data:" +data.result._body);
                        
                    }
                },
                error => {
                    this.alertService.error(error); }
                );
         
        }
    } 

    onFormChangeChanges(): void {
        this.form.valueChanges.subscribe(() => {  
            if(this.form.dirty) this.preventNavigation.preventNavigation(true);
        });
    }

    cancel() { 
        this.router.navigate([this.returnUrl]); 
    } 
     
    onSave() { 
        this.form.patchValue({PCL:this.PCL});
        if(!this.form.valid){
            this.alertService.info("please, enter all required fields");
            return;
        }
        if(this.form.value.ParentSalesAreaCode=="" || this.form.value.ParentSalesAreaCode==null)
        {

        }
        else
        {
            this.form.patchValue({PCL:this.salesAreaList.filter(x=>x.SalesAreaCode==this.form.value.ParentSalesAreaCode)[0].PCL});
        }
        this.loadingService.show("Saving Data please wait...") 
        this.onSaveClicked();
    }
    
    onSaveClicked() {
        try {
            
            let sub = this.masterService.masterPostmethod("/saveSalesArea", { mode: this.mode, data: this.form.value })
                .subscribe(data => {
                    this.loadingService.hide();
                    if (data.status == 'ok') { 
                        this.alertService.success("Sales Area Saved Successfully");
                        this.preventNavigation.preventNavigation(false);
                        setTimeout(() => { 
                            this.router.navigate([this.returnUrl]);
                        }, 1000) 
                    }
                    else {
                        //alert(data.result);
                        //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            //
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }
                      
                        this.alertService.error( "Error in Saving Data:" +data.result._body);
                        //console.log(data.result._body); 
                    }
                },
                error => {
                    this.alertService.error(error); }
                );
            this.subcriptions.push(sub);
        }
        catch (e) { 
            //alert(e);
        } 
    } 
    disabled() {
        try {
          if (this.mode == 'view') {
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
      SalesAreaTypeChange()
      {
        this.masterService.masterGetmethod("/getTypeWiseActiveSalesAreaList/"+this.form.value.SalesAreaTypeCode)
        .subscribe(res => {
            if (res.status == "ok") {
                this.salesAreaList = JSON.parse(res.result);
            }
            else {
                console.log("error on getting salesarealist " + res.result);
            };

        }, error => {
                console.log("error on getting salesarealist ", error);
            }
        );

      }
      PCLChangeEvent(value)
      {
          this.PCL=value;
      }
      parentChangeEvent(value)
      {
        
         this.PCL= this.salesAreaList.filter(x=>x.SalesAreaCode==value)[0].PCL;
         this.form.get("PCL").disable();
        this.form.patchValue({PCL:this.PCL});  

      }
    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        this.loginModal.hide();
    }
}