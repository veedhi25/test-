import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AddDivisionService } from './addDivision.service';
import { IDivision } from "../../../../common/interfaces/commonInterface.interface";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { GlobalState } from '../../../../../app/global.state';
import { MasterRepo } from '../../../../common/repositories';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
@Component({
    selector: 'add-division',
    templateUrl: './addDivision.component.html',
    providers: [AddDivisionService],
    styles: [`
        input{
            color: black;
        }
        .modal-dialog.modal-sm{
            top: 45%;
            margin-top: 0px;
        }
    `],
})

export class AddDivision implements OnInit, OnDestroy {
    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    viewMode = false;
    modeTitle: string = '';
    division: IDivision = <IDivision>{};
    initialTextReadOnly: boolean = false;
    model = {
        id: '',
        initial: '',
        description: '',
        rategroupId: 0
    }
    private returnUrl: string;
    rategroup: Array<any> = [];
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];
    units: any[] = [];
    prefixList: any[] = [];
    constructor(private loadingService: SpinnerService, private addDivisionService: AddDivisionService, private _authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder, public masterService: MasterRepo, private state: GlobalState) {

        this.masterService.masterGetmethod_NEW("/VoucherSeriresList").subscribe((res) => {
            this.prefixList = res.result && res.result.length ? res.result : [];
        })

    }
    ngOnInit() {
        try {

            let self = this;
            this.form = this.fb.group({
                ID: [''],
                INITIAL: ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.minLength(3)])],
                NAME: ['', Validators.required],
                RATEGROUPID: [''],
                DEFAULTBILLUNIT: [""],
                BILLPREFIX: [""],

            });
            //let initialControl: FormControl;
            if (!!this.activatedRoute.snapshot.params['mode']) {
                if (this.activatedRoute.snapshot.params['mode'] == "view") {
                    this.viewMode = true;
                    this.form.get('RATEGROUPID').disable();
                    this.form.get('INITIAL').disable();
                    this.form.get('ID').disable();
                    this.form.get('NAME').disable();
                }
            }

            if (!!this.activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this.activatedRoute.snapshot.params['returnUrl'];

            }
            if (!!this.activatedRoute.snapshot.params['initial']) {
                let initial = this.activatedRoute.snapshot.params['initial'];

                this.addDivisionService.getDivision(initial)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            this.form.setValue({
                                ID: data.result.ID || '',
                                INITIAL: data.result.INITIAL,
                                NAME: data.result.NAME,
                                RATEGROUPID: data.result.RATEGROUPID || 0,
                                DEFAULTBILLUNIT: data.result.DEFAULTBILLUNIT,
                                BILLPREFIX: data.result.BILLPREFIX,
                            });
                            if (this.activatedRoute.snapshot.params['mode'] == null) {
                                self.modeTitle = "Edit Company";
                                if (this._authService.checkMenuRight("divisions", "edit") == false) {
                                    this.router.navigate(['pages/masters/divisions/']);
                                }
                            } else if (this.activatedRoute.snapshot.params['mode'] == "view") {
                                self.modeTitle = "View Company";
                                if (this._authService.checkMenuRight("divisions", "view") == false) {
                                    this.router.navigate(['pages/masters/divisions/']);
                                }
                            }
                            self.mode = 'edit';
                            self.initialTextReadOnly = true;

                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in Division";
                            this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Division";
                        this.masterService.resolveError(error, "addDivision - getDivision");
                    }
                    )
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add Company";
                this.initialTextReadOnly = false;

            }


            this.masterService.masterGetmethod_NEW("/getUnits").subscribe((res) => {
                this.units = res;
            }, err => {
                this.units = [];
            })
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

    changeToArray(data) {
        try {
            console.log(data);
            if (data) {
                let retData: Array<any> = [];
                retData.concat([], data);
                return retData;
            }
            return [];
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    onSave() {
        //validate before Saving
        try {

            this.onsubmit();
        } catch (ex) {
            console.log(ex);
            alert(ex);
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
    onsubmit() {
        try {
            let division = <IDivision>{}
            division.INITIAL = this.form.value.INITIAL;
            division.NAME = this.form.value.NAME;
            division.RATEGROUPID = this.form.value.RATEGROUPID;
            division.DEFAULTBILLUNIT = this.form.value.DEFAULTBILLUNIT;
            division.BILLPREFIX = this.form.value.BILLPREFIX;
            division.ID = this.form.value.ID;
            division.Mode = this.mode;
            this.loadingService.show("Saving Data. Please Wait")
            let sub = this.masterService.saveDivision(division)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.loadingService.hide();
                        this.router.navigate([this.returnUrl]);
                    }
                    else {
                        this.loadingService.hide();
                    }
                },
                    error => { this.loadingService.hide(); alert(error) }
                );
            this.subcriptions.push(sub);
        }
        catch (e) {
            alert(e);
        }
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
    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
}