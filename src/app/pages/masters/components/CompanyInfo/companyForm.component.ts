import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, QueryList, ElementRef, ViewChildren, OnChanges } from '@angular/core';
import { Company } from "../../../../common/interfaces/CompanyInfo.interface";
import { CompanyService } from './company.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { MessageDialog } from './../../../modaldialogs/messageDialog/messageDialog.component';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';

@Component(
    {
        selector: 'CompanyFormSelector',
        templateUrl: './companyForm.component.html',

        providers: [CompanyService],
        styleUrls: ["../../../modal-style.css"],
    }
)
export class CompanyFormComponent implements OnInit, OnChanges {
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    @ViewChildren('nonWorkingDays') input: QueryList<ElementRef>;
    @Input() targetCompanyId: string | undefined;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    company: Company = <Company>{};
    router: Router;
    dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
    StateList: any[] = [];
    public nonWorkingDays: string[] = [];
    private returnUrl: string;
    private subcriptions: Array<Subscription> = [];
    trnMode: string = "";
    form: FormGroup;
    DialogMessage: string = "Saving data please wait ...";
    @ViewChild('childModal') childModal: ModalDirective;
    mode: string = "add";
    constructor(private masterService: MasterRepo, protected service: CompanyService, router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder, public dialog: MdDialog, private loadingService: SpinnerService, private alertService: AlertService) {

        this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "STATE",
            apiEndpoints: `/getStatesPagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "StateCode",
                    title: "State Code",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "StateName",
                    title: "State Name",
                    hidden: false,
                    noSearch: false
                }

            ]
        });
    }
    cancel() {
        try {
            this.router.navigate(["./pages/masters/CompanyInfo"]);
        } catch (ex) {
            this.alertService.error(ex);
        }
    }
    getTargetCompanyId() {
        if (typeof this.targetCompanyId == 'undefined' || this.targetCompanyId == null) {
            this.targetCompanyId = '';
        }
        return this.targetCompanyId;
    }
    loadData() {
        try {
            if (typeof this.targetCompanyId == 'undefined' || this.targetCompanyId == null || this.targetCompanyId == '-1') {
                this.targetCompanyId = '';
            }
            this.masterService.loadCompany(this.targetCompanyId).subscribe((data: Company) => {
                try {
                    this.form.patchValue({
                        INITIAL: data.INITIAL,
                        NAME: data.NAME,
                        ADDRESS: data.ADDRESS,
                        ADDRESS2: data.ADDRESS2,
                        TELA: data.TELA,
                        TELB: data.TELB,
                        VAT: data.VAT,
                        EMAIL: data.EMAIL,
                        FBDATE: data.FBDATE ? data.FBDATE.toString().substring(0, 10) : "",
                        FEDATE: data.FEDATE ? data.FEDATE.toString().substring(0, 10) : "",
                        FBDATE_BS: data.FBDATE_BS,
                        FEDATE_BS: data.FEDATE_BS,
                        ISBRANCH: data.ISBRANCH,
                        PhiscalID: data.PhiscalID,
                        STATENAME: data.STATENAME,
                        GSTNO: data.GSTNO,
                        PLACE: data.PLACE,
                        PINCODE: data.PINCODE,
                        ORGTYPE: data.ORG_TYPE,
                        STATE: data.STATE,
                        DLNO1: data.DLNO1,
                        DLNO2: data.DLNO2,
                        DLNO3: data.DLNO3,
                        DLNO4: data.DLNO4,
                        MERCHANTLEGALNAME: data.MERCHANTLEGALNAME,
                        CUSTOMERCODE: data.CUSTOMERCODE,
                        COMPANYID: data.COMPANYID,
                        CITY: data.CITY,
                        GSTTYPE: data.GSTTYPE,
                        CIN: data.CIN,
                        BankName: data.BankName,
                        AccountNo: data.AccountNo,
                        IFSCCode: data.IFSCCode,
                        AcountHolder: data.AcountHolder,
                        BankBranch: data.BankBranch,
                        Declaration: data.Declaration,
                        LastYearTurnOver: data.LastYearTurnOver,
                        COMPANYLIST: data.COMPANYLIST,
                        FSSAI: data.FSSAI
                    })
                    this.list = data.COMPANYLIST;
                    if (data.NonWorkingDays != null) {
                        this.nonWorkingDays = data.NonWorkingDays.split(',');
                    }


                }
                catch (ex) {
                    if (this.targetCompanyId) {
                    }
                    else {
                        this.alertService.error(ex);
                    }
                }
            })
        } catch (ex) {
            this.alertService.error(ex);
        }
    }
    ngOnChanges() {
        this.loadData();
    }
    ngOnInit() {
        try {
            this.form = this.fb.group({
                INITIAL: [''],
                NAME: ['', Validators.required],
                ADDRESS: [''],

                TELA: [''],
                TELB: [''],
                VAT: ['', Validators.required],
                EMAIL: [''],
                FBDATE: ['', Validators.required],
                FEDATE: ['', Validators.required],
                FBDATE_BS: [''],
                FEDATE_BS: [''],
                ISBRANCH: [''],
                PhiscalID: ['', Validators.required],
                ORGTYPE: ['', Validators.required],
                STATE: ['', Validators.required],
                GSTNO: [''],
                DLNO1: [''],
                DLNO2: [''],
                DLNO3: [''],
                DLNO4: [''],
                PINCODE: [''],
                PLACE: [''],
                ADDRESS2: [''],
                STATENAME: [''],
                MERCHANTLEGALNAME: [''],
                CUSTOMERCODE: [''],
                COMPANYID: [''],
                CITY: [''],
                GSTTYPE: [''],
                CIN: [''],
                BankName: [''],
                AccountNo: [''],
                IFSCCode: [''],
                AcountHolder: [''],
                BankBranch: [''],
                Declaration: [''],
                LastYearTurnOver: [0],
                NonWorkingDays: [''],
                COMPANYLIST: [''],
                FSSAI: [""]

            });
        } catch (ex) {
            this.alertService.error(ex);
        }
        this.loadData();
        this.outletconfigChild();
        //console.log("Test Connection");
    }
    list: any[] = [];
    onSateClicked() {
        this.genericGrid.show()
    }

    onCheckboxChange(e) {
        console.log(e);
        if (e.target.checked) {
            //this.nonWorkingDays.push(e.target.value);
            this.nonWorkingDays = [];
            this.nonWorkingDays.push(e.target.value);
        } else {
            const index: number = this.nonWorkingDays.indexOf(e.target.value);
            if (index !== -1) {
                this.nonWorkingDays.splice(index, 1);
            }
        };

    }

    onSaveClicked() {
        try {

            if ((this.form.controls['GSTTYPE'].value == 'Regular' || this.form.controls['GSTTYPE'].value == 'Composite') && (this.form.controls['GSTNO'].value == "" || this.form.controls['GSTNO'].value == null)) {
                this.alertService.error("GST NO is required");
                return;
            }
            if ((this.form.controls['VAT'].value) == "" || this.form.controls['VAT'].value == undefined) {
                this.alertService.error("PAN Number is required");
                return;
            }
            if (this.form.controls['Declaration'].value != null) {
                if ((this.form.controls['Declaration'].value).length > 400) {
                    this.alertService.error("Declaration Cannot be more than 400 character.");
                    return;
                }
            }
            if (this.form.controls['ADDRESS'].value != null) {
                if ((this.form.controls['ADDRESS'].value).length > 200) {
                    this.alertService.error("Adress Cannot be more than 200 character.");
                    return;
                }
            }
            if (this.form.controls['ADDRESS2'].value != null) {
                if ((this.form.controls['ADDRESS2'].value).length > 100) {
                    this.alertService.error("ADDRESS2 Cannot be more than 100 character.");
                    return;
                }
            }
            if (this.form.controls['TELB'].value != null) {
                if ((this.form.controls['TELB'].value).length > 10) {
                    this.alertService.error("Mobile Number must be 10 digit.");
                    return;
                }
            }
            if ((this.form.controls['PINCODE'].value) == "" || this.form.controls['PINCODE'].value == undefined) {
                this.alertService.error("PINCODE is required");
                return;
            }


            let comp = <Company>{}
            comp.INITIAL = this.form.value.INITIAL;
            comp.NAME = this.form.value.NAME;
            comp.ADDRESS = this.form.value.ADDRESS;
            comp.TELA = this.form.value.TELA;
            comp.TELB = this.form.value.TELB;
            comp.VAT = this.form.value.VAT;
            comp.FBDATE = this.form.value.FBDATE;
            comp.FEDATE = this.form.value.FEDATE;
            comp.PhiscalID = this.form.value.PhiscalID;
            comp.ORG_TYPE = this.form.value.ORGTYPE;
            comp.DLNO1 = this.form.value.DLNO1;
            comp.DLNO2 = this.form.value.DLNO2;
            comp.DLNO3 = this.form.value.DLNO3;
            comp.DLNO4 = this.form.value.DLNO4;
            comp.STATE = this.form.value.STATE;
            comp.GSTNO = this.form.value.GSTNO;
            comp.ADDRESS2 = this.form.value.ADDRESS2;
            comp.PLACE = this.form.value.PLACE;
            comp.STATE = this.form.value.STATE;
            comp.STATENAME = this.form.value.STATENAME;
            comp.CUSTOMERCODE = this.form.value.CUSTOMERCODE;
            comp.COMPANYID = this.form.value.COMPANYID;
            comp.CITY = this.form.value.CITY;
            comp.MERCHANTLEGALNAME = this.form.value.MERCHANTLEGALNAME;
            comp.PINCODE = this.form.value.PINCODE;
            comp.EMAIL = this.form.value.EMAIL;
            comp.GSTTYPE = this.form.value.GSTTYPE;
            comp.CIN = this.form.value.CIN;
            comp.BankName = this.form.value.BankName;
            comp.AccountNo = this.form.value.AccountNo;
            comp.IFSCCode = this.form.value.IFSCCode;
            comp.AcountHolder = this.form.value.AcountHolder;
            comp.BankBranch = this.form.value.BankBranch;
            comp.Declaration = this.form.value.Declaration;
            comp.COMPANYLIST = this.form.value.COMPANYLIST;
            comp.FSSAI = this.form.value.FSSAI;

            comp.NonWorkingDays = this.nonWorkingDays.join(",");
            comp.LastYearTurnOver = this.masterService.nullToZeroConverter(this.form.value.LastYearTurnOver);
            let stateCode = this.form.controls['STATE'].value;
            let parsedStateCode = Number(stateCode) > 9 ? "" + stateCode : "0" + stateCode;
            let gstno = this.form.controls['GSTNO'].value;
            if (this.form.controls['GSTTYPE'].value != "Un-Register") {
                if (parsedStateCode != (gstno.toString().substring(0, 2))) {
                    this.alertService.error("Invalid GST No.Please Verfiy the state and gst no");
                    return;
                }
            }
            if (typeof this.targetCompanyId == 'undefined' || this.targetCompanyId == null) {
                this.targetCompanyId = '';
            }
            this.loadingService.show("Saving Data please wait...");
            let sub = this.masterService.saveCompany(this.mode, comp, this.targetCompanyId)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.loadingService.hide();
                        this.alertService.success("Company Info Updates successfully...");
                    }
                    else {
                        this.loadingService.hide();
                        this.alertService.error(data._body);
                    }

                },
                    error => {
                        this.loadingService.hide();
                        this.alertService.error(error)
                    }
                );
            this.subcriptions.push(sub);
        }
        catch (e) {
            this.childModal.hide()
            this.alertService.error(e);
        }
    }


    dblClickPopupItem(event) {
        this.form.patchValue({
            STATE: event.StateCode,
            STATENAME: event.StateName
        });
    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            this.alertService.error(ex);
        }
    }
    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            this.alertService.error(ex);
        }
    }


    showTurnOverOption() {
        let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
        if (user.username.toLowerCase() == "patanjali_user") {
            return true;
        }

        return false;
    }

    outletconfigChild() {
        let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));

        // for (var i = 0; i < user.OutletPermissionSettings.length; i++) {
        //     if (user.OutletPermissionSettings[i].SettingTypeId == 2 && user.OutletPermissionSettings[i].CanUpdate == true) {
        //         return true;
        //     }
        // }
        // return false;
        return true;
    }

    // // outletconfigMenuWise() {
    // //     let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    // //     console.log(" user", user);
    // //     for (var i = 0; i < user.menuRights.length; i++) {
    // //         for (var j = 0; j < user.menuRights.right.length; j++)
    // //         {
    // //             if (user.menuRights[i].menu == "company-info" && user.menuRights[i].right[j] == "edit") {
    // //             
    // //                 return true;
    // //         }
    // //     }
    // //     }
    // //     return false;

    // // } 

    outletconfigParentandIndividual() {
        let user: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
        // if (user.CompanyInfo.isHeadoffice == 1 || user.CompanyInfo.companycode == null) {
        //     return true;
        // }
        return true;

    }
}