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
        selector: 'stateEntrySelector',
        templateUrl: './StateEntry.html',
        styleUrls: ["../../../modal-style.css"],
    }
)
export class  StateFormComponent {

    mode: string = "add";
    unit: Unit = <Unit>{};
    router: Router; 
    modeTitle:string="Add State";
    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];
    trnMode: string = "";
    form: FormGroup; 
    viewMode: boolean;

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
    }

    ngOnInit() {
        this.form = this.fb.group({
            StateCode:[''],
            StateName: ['', [Validators.required]],
            STATUS : [1],
            InputStateCode: [],
        });  
        this.onFormChangeChanges();
        if(this.mode=="edit")
        {
           this.modeTitle="Edit State";
            this.loadingService.show("Loading Data please wait...") 
            let statecode= this._activatedRoute.snapshot.params['id'];
    
            this.masterService.masterPostmethod("/getState",{StateCode:statecode})
                .subscribe(data => {
                    this.loadingService.hide();
                    if (data.status == 'ok') { 
                       this.form.patchValue({
                           StateCode:data.result.StateCode,
                           StateName:data.result.StateName,
                           InputStateCode:data.result.InputStateCode,
                           STATUS:data.result.STATUS
                       });
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
        if(!this.form.valid){
            this.alertService.info("please, enter all required fields");
            return;
        }
        this.loadingService.show("Saving Data please wait...") 
        this.onSaveClicked();
    }
    
    onSaveClicked() {
        try {
             var data={STATUS:this.form.value.STATUS,StateName:this.form.value.StateName,StateCode:this.form.value.StateCode,InputStatecode:this.form.value.InputStateCode};
            let sub = this.masterService.masterPostmethod("/saveState", { mode: this.mode, data: data })
                .subscribe(data => {
                    this.loadingService.hide();
                    if (data.status == 'ok') { 
                        this.alertService.success("State Saved Successfully");
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
    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        this.loginModal.hide();
    }
}