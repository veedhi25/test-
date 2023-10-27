import { Component, ViewChild } from '@angular/core';
import { Unit } from "../../../../common/interfaces/Unit.interface";
import { UnitService } from './unit.service'
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
        selector: 'UnitFormSelector',
        templateUrl: './unitForm.component.html',
        providers: [UnitService],
        styleUrls: ["../../../modal-style.css"],
    }
)
export class UnitFormComponent {

    mode: string = "add";
    unit: Unit = <Unit>{};
    router: Router; 

    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];
    trnMode: string = "";
    form: FormGroup; 

    constructor(private masterService: MasterRepo,
        private preventNavigation : PreventNavigationService,
        private alert : AlertService,
        private loadingService : SpinnerService,
        protected service: UnitService,
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
            UNITS: ['', [Validators.required]],
        });  
        this.onFormChangeChanges();
        if (!!this._activatedRoute.snapshot.params['unitList']) {
            
            this.form.patchValue({
                UNITS:this._activatedRoute.snapshot.params['unitList'] ,
            });  
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
        let unit = <any>{}
        unit = this._activatedRoute.snapshot.params['unitList']
        if(!this.form.valid){
            this.alert.info("please, enter all required fields");
            return;
        }
        this.loadingService.show("Saving Data please wait...") 
        this.onSaveClicked(unit);
    }
    
    onSaveClicked(unit : string) {
        try {
            console.log("submit call",this.masterService._Units);
            let units = <any>{}
            units.UNITS = this.form.value.UNITS;
            let sub = this.masterService.saveUnit(this.mode, units, unit)
                .subscribe(data => {
                    this.loadingService.hide();
                    if (data.status == 'ok') { 
                        this.alert.success("Data Saved Successfully");
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
                      
                        this.alert.error( "Error in Saving Data:" +data.result)
                        //console.log(data.result._body); 
                    }
                },
                error => { alert(error) }
                );
            this.subcriptions.push(sub);
        }
        catch (e) { 
            //alert(e);
        } 
    } 

    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        this.loginModal.hide();
    }
}