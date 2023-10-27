import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { salesOrganizationService } from './salesorganization.service';

@Component(
    {
        selector: 'sales-organization-selector',
        templateUrl: './salesorganization.component.html',
        providers: [salesOrganizationService],
        styleUrls: ["../../../modal-style.css"],
    }
)
export class SalesOrganization implements OnInit {
    @ViewChild('childModal') childModal: ModalDirective;
    salesOrganizationObj: SalesOrganization = <SalesOrganization>{};
   // router: Router;
    // salesman:Salesman=<Salesman>{};
    viewMode = false;
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    modeTitle: string = '';
    initialTextReadOnly: boolean = false;
    private returnUrl: string; 
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];
    chanels : any[] = [];
    showChanelOption = false; 
    userProfile:any=<any>{};


    ngOnInit() {
        try {
            if (!!this._activatedRoute.snapshot.params['mode']) {
                if (this._activatedRoute.snapshot.params['mode'] == "view") {
                    this.viewMode = true;

                }
            }
            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['chanelId']) {
                let BID: string = "";
                BID = this._activatedRoute.snapshot.params['chanelId'];

                this._chanelservice.getSalesOrganization(BID)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            console.log("chane data"+ JSON.stringify(data));
                            let salesOrganizationObj=data.result;

                            this.form.patchValue({
                                Name: salesOrganizationObj.Name,
                                Address: salesOrganizationObj.Address,
                                Parent: salesOrganizationObj.Parent,
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

    constructor(private masterService: MasterRepo,private router: Router,protected _chanelservice: salesOrganizationService, private _activatedRoute: ActivatedRoute, private fb: FormBuilder) {
        this.buildForm();
       
    }

    buildForm(){
        this.form = this.fb.group({
            Name: ['', Validators.required],
            Address: ['', Validators.required],
            //parentId: ['']
        });
    }

    cancel() {   
            try {
                this.router.navigate([this.returnUrl]);
            } catch (ex) {
                console.log(ex);
                alert(ex);
            }
    }

   // private returnUrl: string;
   // private subcriptions: Array<Subscription> = [];
    trnMode: string = "";
  //  form: FormGroup;


    onSave() {
        //validate before Saving
        this.DialogMessage = "Saving Data please wait..."
        this.childModal.show();
        this.onSaveClicked();
    }
    onSaveClicked() {
        try { 
            let saveModel = Object.assign(this.salesOrganizationObj, {}, this.form.value) 
            let sub = this.masterService.saveChanel(this.mode, saveModel)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        //Displaying dialog message for save with timer of 1 secs
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();
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
                        //Some other issues need to check
                        //this.DialogMessage = "Error in Saving Data:" + data.result._body;
                        this.DialogMessage = "Error in Saving Data:" +data.result;
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
            this.childModal.hide()
            alert(e);
        }


    }
    hideChildModal() {
        this.childModal.hide();
    }
    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        this.loginModal.hide();
    }
}