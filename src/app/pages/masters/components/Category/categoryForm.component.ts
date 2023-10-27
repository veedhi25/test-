import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MCAT } from "../../../../common/interfaces/Category.interface";
import { ModalDirective } from 'ng2-bootstrap'
import { CostCenter } from "../../../../common/interfaces/TrnMain";
import { AddCategoryService } from './addCategory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MockMasterRepo } from "../../../../common/repositories/MockmasterRepo.service";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { IDivision } from "../../../../common/interfaces/commonInterface.interface";

@Component(
    {
        selector: 'CategoryFormSelector',
        templateUrl: './categoryForm.component.html',

        providers: [AddCategoryService],
        styleUrls: ["../../../modal-style.css"],
    }
)


export class CategoryFormComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    modeTitle: string = '';
    menuCat: MCAT = <MCAT>{};
    menuCatList: MCAT[] = [];
    private hasGroup = false;
    router: Router;
    private hideparent = true;
    private hideAddNewbttn = true;
    c = true;
    initialTextReadOnly: boolean = false;
    private returnUrl: string;
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];




    // salesman:Salesman=<Salesman>{};
    ngOnInit() {
        try {
            let self = this;
            this.hideparent = false;
            this.form = this.fb.group({
                // PARENT: [''],
                menucat: ['', Validators.compose([Validators.required,])],
                parent: [''],
                newparent: [''],
            });
            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['menuID']) {
                let CategoryName: string = "";
                CategoryName = this._activatedRoute.snapshot.params['menuID'];

                this.service.getCategoryList(CategoryName)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            this.form.setValue({
                                parent: data.result.PARENT,
                                menucat: data.result.MENUCAT,
                                newparent: '',
                            });

                            this.mode = 'edit';
                            this.modeTitle = "Edit Category";
                            this.initialTextReadOnly = true;

                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in Category";
                            this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Category";
                        this.masterService.resolveError(error, "categoryForm - getCategoryList");
                    }
                    )
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add Category";
                this.initialTextReadOnly = false;

            }
            this.masterService.getCategory().subscribe(res => { this.menuCatList.push(<MCAT>res); });
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    constructor(protected masterService: MasterRepo, protected service: AddCategoryService, router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder) {
        this.router = router;
    }

    cancel() {
        try {
            this.router.navigate([this.returnUrl]);
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    AddNewParent() { //Parent ko Add
        try {
            this.c = false;
            this.hideparent = true;
            this.hideAddNewbttn = false;

            // this.parent=<Parent>{};
            // this.category.PARENT=null;
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    SaveNewParent() { //Parent ko save
        try {
            var v = this.form.get('newparent').value;
            this.menuCatList.push(<MCAT>{ MENUCAT: v, PARENT: '', TYPE: 'G' });
            this.c = true;
            this.hideparent = false;
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    CalcelNewPArent() {
        try {
            this.hideparent = false;
            this.hideAddNewbttn = true;
            this.c = true;
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
    onSave() {
        try {
            //validate before Saving
            this.DialogMessage = "Saving Data please wait..."
            this.childModal.show();
            this.onsubmit();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    onsubmit() {

        //  this.costCenter.TYPE="G";
        try {
            console.log("submit call");
            let menuCat = <MCAT>{}
            menuCat.MENUCAT = this.form.value.menucat;
            menuCat.PARENT = this.form.value.parent;
            menuCat.TYPE = "A"
            console.log({ tosubmit: MCAT });
            let sub = this.masterService.saveCategory(this.mode, menuCat)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();

                            this.router.navigate([this.returnUrl]);
                        }, 1000)


                    }
                    else {
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









