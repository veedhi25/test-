import { style } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { MessageDialog } from './../../../modaldialogs/messageDialog/messageDialog.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectItem } from 'primeng/primeng';
import { GroupParty } from './partyLedger.service';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { TreeViewPartyervice } from './partyledger.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AcListTree, TAcList } from "../../../../common/interfaces/Account.interface";
import { AuthService } from '../../../../common/services/permission';

@Component(
    {
        selector: 'addPartyLedgerSelector',
        templateUrl: 'addpartyledger.component.html',
        //  [(ngModel)]="PARENTACNAME"
        // [(ngModel)]="RootName"
        providers: [TreeViewPartyervice],
        styles: [`input:disabled, select:disabled, textarea:disabled {
    cursor: not-allowed !important;
    color: black !important;
    background-color: #EBEBE4 !important;
}

button:disabled{
    cursor: not-allowed !important;
}`]

    }
)
export class AddPartyLedgerComponent {
    @Output('onClose') onClose = new EventEmitter();
    @Input('acid') ACID: string;
    @Input() rootID: string;
    @Input() Title: string = '';
    @Input() mode: string;
    @Input() grp: string;
    @ViewChild('childModal') childModal: ModalDirective;
    @Output() SavePartyEmit = new EventEmitter();
    selectednode: any;
    parentid: any;
    majorparent: any;
    majorParentAcList: any[] = [];
    acParentList: any[] = [];
    PARENTACNAME: string;
    RootName: string;
    acListtree: AcListTree = <AcListTree>{};
    ledgerAcObj: TAcList = <TAcList>{};
    ledgerAcList: TAcList[];
    private returnUrl: string;
    router: Router;
    form: FormGroup;
    viewMode = false;
    DialogMessage: string = "Saving data please wait ..."
    private subcriptions: Array<Subscription> = [];
    initialTextReadOnly = false;
    ID: string = '';
    modeTitle: string;
    parentGroup: GroupParty;
    acGroups: any[] = [];
    dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
    actype: string = '';
    disableActype: boolean = false;
    lastParentID: string;
    userProfile: any;
    constructor(protected MasterService: MasterRepo, private PartyService: TreeViewPartyervice, router: Router, private _activatedRoute: ActivatedRoute, private _fb: FormBuilder, public dialog: MdDialog, private _authService: AuthService) {
        this.router = router;

        // this.service.getNewValues(selectL)
        //     .subscribe(data => {
        //         if (data.status == 'ok') {

        //             this.ledgerAcObj.PARENT = data.result.parent.ACID;
        //             this.PARENTACNAME = data.result.parent.ACNAME;
        //             this.ledgerAcObj.PType = data.result.parent.PType;
        //         }

        //     }
        //     , error => {
        //         this.router.navigate([this.returnUrl]);
        //         console.log(error);
        //     }
        //     );
        this.userProfile = this._authService.getUserProfile();
    }

    ngOnInit() {
        this.form = this._fb.group({
            majorparent: [''],
            parentid: [''],
            ACNAME: ['', Validators.required],
            Ptype: [''],
            MAPID: [''],
            ADDRESS: ['', Validators.required],
            PHONE: [''],
            FAX: [''],
            EMAIL: [''],
            VATNO: ['', Validators.required],
            ACCODE: ['', Validators.required],
            CRLIMIT: ['', Validators.required],
            isNotActive: ['']
        })
        this.getGroups();
        // this.MasterService.getAllAccount().subscribe(res => { this.ledgerAcList.push(<TAcList>res); });
        this.MasterService.getpartyListTree()
            .subscribe(data => {
                let l = data.filter(x => x.PARENTID == 'PA');
                this.majorParentAcList = l;
                if (!!this._activatedRoute.snapshot.params['Par']) {
                    this.majorparent = this._activatedRoute.snapshot.params['Par'];
                    this.form.get('majorparent').setValue(this.majorparent);
                    this.majorgroupChange();
                }

                if (this.mode == 'edit' || this.mode == 'view') {
                    this.mode == 'edit' ? this.modeTitle = "Edit Party Ledger" : this.modeTitle = "View Party Ledger"
                    this.MasterService.getAllAccount(this.ACID)
                        .subscribe(data => {
                            if (data.status == 'ok') {
                                this.form.get('ACNAME').setValue(data.result.ACNAME);
                                this.form.get('ADDRESS').setValue(data.result.ADDRESS);
                                this.form.get('PHONE').setValue(data.result.PHONE);
                                this.form.get('FAX').setValue(data.result.FAX);
                                this.form.get('EMAIL').setValue(data.result.EMAIL);
                                this.form.get('VATNO').setValue(data.result.VATNO);
                                this.form.get('ACCODE').setValue(data.result.ACCODE);
                                this.form.get('CRLIMIT').setValue(data.result.CRLIMIT);
                                this.form.get('Ptype').setValue(data.result.PType);
                            }

                        },

                        );
                }

            });
        if (this.mode == 'view') {
            this.form.get('ACNAME').disable();
            this.form.get('ADDRESS').disable();
            this.form.get('PHONE').disable();
            this.form.get('FAX').disable();
            this.form.get('EMAIL').disable();
            this.form.get('VATNO').disable();
            this.form.get('ACCODE').disable();
            this.form.get('CRLIMIT').disable();
            this.form.get('Ptype').disable();
        }




        if (this.Title == "AddLedger") {
            this.modeTitle = "Add Party Ledger";
        }
        else if (this.Title == "AddGroup") {
            this.modeTitle = "Add Party Group";
        }


    }


    majorgroupChange() {
        this.filter(this.form.get('majorparent').value);


    }

    filter(majorparent) {
        this.MasterService.getpartyListTree().subscribe(data => {
            var f = data.filter(x => x.ACID == majorparent)[0];
            if (f != null) { this.acParentList = f.children; }
        });
    }
    SumbitSave() {
        this.dialogMessageSubject.next("Saving Data please wait...");
        var dialogRef = this.dialog.open(MessageDialog, { hasBackdrop: true, data: { header: 'Information', message: this.dialogMessage$ } })
        if (this.form.value.VATNO) {
            
            var pno = parseFloat(this.form.value.VATNO);
            if (pno.toString().length != 9) {
                alert("PAN No is not correct");
                dialogRef.close();
                return;
            }
        }
        try {
            if (!this.parentGroup) throw new Error("Parent is missing");

            let al = <TAcList>{};
            if (this.Title == 'AddLedger' || this.mode == 'edit' && this.grp == 'A') {
                al.TYPE = "A"
                al.CRLIMIT = this.form.value.CRLIMIT;
            }
            else {
                al.CRLIMIT = 0;
                al.TYPE = "G"
            }
            al.ACNAME = this.form.value.ACNAME,
                al.PARENT = this.parentGroup.ACID;
            al.MAPID = "N",
                al.ADDRESS = this.form.value.ADDRESS,
                al.PHONE = this.form.value.PHONE,
                al.FAX = this.form.value.FAX,
                al.EMAIL = this.form.value.EMAIL,
                al.VATNO = this.form.value.VATNO,

                al.ACCODE = this.form.value.ACCODE,
                al.PType = this.form.value.Ptype,
                al.ISACTIVE = this.form.value.isNotActive;
            al.ACID = this.parentGroup.ACID;
            al.DIV = this.userProfile.userDivision;
            if (this.mode == 'edit') {
                al.ACID = this.ACID;
                console.log({ ACID: al.ACID });
                console.log({ ID: this.ID });
            }
            console.log({ partyLedger: al });
            let sub = this.MasterService.saveAccount(this.mode, al)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        //Displaying dialog message for save with timer of 1 secs
                        
                        var selNode = {}

                        if (this.grp == 'A') {
                            al.ACID = data.result.acid;
                            this.MasterService.PartialAccountList.push(al);
                            selNode = { type: 'A', value: al };
                            
                        }
                        else {
                            selNode = { type: 'G', lastparent: this.lastParentID, value: { ACID: data.result.acid, ACNAME: al.ACNAME, PARENT: null, PARENTID: al.PARENTID, children: [] } };
                        }

                        this.SavePartyEmit.emit(selNode);
                        this.dialogMessageSubject.next("Data Saved Successfully")
                        setTimeout(() => {
                            dialogRef.close();
                            this.onClose.emit(true);

                            // this.router.navigate([this.returnUrl]);
                        }, 1000)


                    }
                    else {
                        //alert(data.result);
                        //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }
                        //Some other issues need to check
                        this.dialogMessageSubject.next("Error in Saving Data:" + data.result._body);
                        console.log(data.result._body);
                        setTimeout(() => {
                            dialogRef.close();
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
    cancel() {
        this.onClose.emit(true);
    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    changePtype(value) {
        this.form.get('Ptype').patchValue(value);
    }
    public onGrpChange(event, i, selected) {
        try {
            if (selected) {
                // this.actype = selected.ACTYPE
                // this.changeACtype(selected.ACTYPE);
                // this.disableActype == true;
                //latest selected 
                this.parentGroup = selected;
            }


            //let newGroup: GroupAccounts = event.value;
            console.log({ onGrpChangeEvent: event, eventIndex: i, selected: selected });
            let opt: SelectItem[] = [];
            var ind = i;

            if (event) {
                if (this.acGroups.length > ind + 1) {
                    this.acGroups.splice(ind + 1, this.acGroups.length - 1)
                }
                console.log({ GroupchageEvent: event, value: event.value.ACNAME });
                this.lastParentID = event.value.ACID;
                this.PartyService.getChildrenGroups(event.value.ACID)
                    .flatMap(data => data)
                    .subscribe(data => {
                        console.log({ children: data });
                        if (data.TYPE == 'G')
                            opt.push({ label: data.ACNAME, value: data });

                    }, Error =>{ console.log({ groupchangeError: Error })}
                    , () => {
                        if (opt.length > 0) {
                            this.acGroups.push({ group: event.value.ACNAME, value: event.value, options: opt });
                        }

                            //this.groupListSubject.next(subjectData);
                            // console.log({ negroup2: { group: event.value.ACNAME, value: event.value, options: opt }, subjectData2: subjectData });
                        }
                    );
            }

        }
        catch (ex) {
            
        }

    }
    getGroups() {
        //FIRST GET THE MAIN GROUP
        // this.hasSubLedger = 0;
        // this.changehassubEvent(false);
        // this.disableHassubledger = false;
        
        this.actype = '';
        this.disableActype = false;
        this.acGroups = [];
        this.getMainGroup();
        if (!this.ACID) return;
        console.log({ acid: this.ACID });
        this.PartyService.getParentGroups(this.ACID)
            .flatMap(data => data)
            .subscribe(data => {
                try {
                    data.SELECTEDGROUPAC = data.CHILDLIST.find(itm => itm.ACID == data.SELECTEDGROUP);
                    this.parentGroup = data.SELECTEDGROUPAC;
                    
                    // if (data.SELECTEDGROUPAC.HASSUBLEDGER == 1 && this.hasSubLedger == 0) {
                    //     this.hasSubLedger = 1;
                    //     this.changehassubEvent(true);
                    //     this.disableHassubledger = true;
                    //     
                    // }
                    let opt: SelectItem[] = [];
                    data.CHILDLIST.forEach(child => {
                        opt.push({ label: child.ACNAME, value: child });
                    });
                    this.acGroups.push({ group: data.ACNAME, value: data, options: opt });
                }
                catch (ex) {
                    
                }
            }, error => { console.log({ getgroupError: error }) }
                , () => {
                    if (this.acGroups.length > 1) {
                        let selectedGroup = this.acGroups[0].options.find(itm =>
                            itm.value.ACID == this.acGroups[1].value.ACID
                        )
                        if (selectedGroup) {
                            this.acGroups[0].value.SELECTEDGROUPAC = selectedGroup.value;
                        }
                        console.log({ selectedGroupValue: selectedGroup.value });
                        // if (selectedGroup.value.Ptype) {
                        //     alert("REACHED")
                        //     this.actype = selectedGroup.value.Ptype
                        //     this.changePtype(selectedGroup.value.Ptype);
                        //     this.disableActype == true;
                        // }
                        // console.log({groupTofind:this.acGroups[1],options:this.acGroups[0].options,selected:this.acGroups[0].value.SELECTEDGROUPAC,selected2:this.acGroups[1].value.SELECTEDGROUPAC})
                    
                    console.log({ selectedGroupValue: selectedGroup.value });
                    // if (selectedGroup.value.Ptype) {
                    //     alert("REACHED")
                    //     this.actype = selectedGroup.value.Ptype
                    //     this.changePtype(selectedGroup.value.Ptype);
                    //     this.disableActype == true;
                    // }
                    
                }
            }); 

        return;
    }
    getMainGroup() {
        let opt: SelectItem[] = [];
        this.PartyService.getTopGroups()
            .flatMap(data => data)
            .subscribe(data => {
                opt.push({ label: data.ACNAME, value: data })
            });
        this.acGroups.push({ group: 'Main Group', value: { ACNAME: 'MAIN GROUP', ACID: null, PARENT: null }, options: opt });
    }
    clickedNotActive(value) {
        if (this.form == null) { return }
        this.form.get('isNotActive').patchValue(value);
    }
    NotActive() {

    }
}