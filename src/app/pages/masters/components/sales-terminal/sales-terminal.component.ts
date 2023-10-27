import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from './../../../../common/services/common.service';
import { SalesTerminalService } from './sales-terminal.service';
import { SalesTerminal, CounterProduct } from './sales-terminal.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { IDivision, WAREHOUSE } from "../../../../common/interfaces/commonInterface.interface";
import { TerminalCategory } from "../../../../common/interfaces/terminal-category.interface";
import { Item } from '../../../../common/interfaces/ProductItem';
import { TAcList } from '../../../../common/interfaces/Account.interface';

@Component({
    selector: 'sales-terminal',
    templateUrl: "./sales-terminal.template.html",
    // styleUrls: ["./../../../../../assets/css/styles.css"],
    providers: [CommonService, SalesTerminalService],
    styles: [`
            .margin{
                margin-bottom: 10px;
            }
            .padding{
                padding-right: 0px;
            }
            th{
                font-weight: bold;
            }
            tbody:hover{
                background-color: #F8F8F8;
            }
            .scroll{
                overflow: scroll;
            }
            .modal-dialog.modal-sm{
                top: 45%;
                margin-top: 0px;
            }
    `]
})

export class SalesTerminalComponent implements OnInit, OnDestroy {
    public salesTerminal: SalesTerminal = <SalesTerminal>{};
    public wareHouseList: WAREHOUSE[] = [];
    public divisionList: IDivision[] = [];
    public terminalCategoryList: TerminalCategory[] = [];
    public accountList: TAcList[] = [];
    public productList: Item[] = [];
    selectedCP: CounterProduct = <CounterProduct>{};
    // public product: ProductType = <ProductType>{};
    public selectedProduct: Item = <Item>{};
    public mappedProducts: CounterProduct[] = [];
    viewMode = false;

    @ViewChild('childModal') childModal: ModalDirective;
    DialogMessage: string = "Saving data please wait ...";
    mode: string = "add";
    modeTitle: string = '';
    initialTextReadOnly: boolean = false;
    private returnUrl: string;
    rategroup: Array<any> = [];
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];


    constructor(private masterService: MasterRepo, private _salesTerminalService: SalesTerminalService, private _activatedRoute: ActivatedRoute, private _router: Router, private _fb: FormBuilder) {
        console.log({ route: this._activatedRoute.snapshot.params });
        // if(!!_activatedRoute.snapshot.params['terminalId']){
        //     this.salesTerminal.INITIAL = _activatedRoute.snapshot.params['terminalId'];
        //     this.salesTerminal.NAME = _activatedRoute.snapshot.params['terminalName'];
        // }
    }



    ngOnInit() {
        try {
            this.salesTerminal.PRODUCTS = [];
            this.masterService.getAcList().subscribe(res => { this.accountList.push(<TAcList>res); });
            this.masterService.getCounterProduct().subscribe(res => { this.productList.push(<Item>res); });
            this.masterService.getTerminalCategory().subscribe(res => { this.terminalCategoryList.push(<TerminalCategory>res); });
            this.masterService.getWarehouseList().subscribe(res => { this.wareHouseList.push(<WAREHOUSE>res); });
            this.masterService.getDivisions().subscribe(res => { this.divisionList= res; });
            // var newRow = <Product>{};
            // newRow.inputMode = true;.push(<WAREHOUSE>res);sz
            // newRow.editMode = false;
            // this.salesTerminal.product.push(newRow);
            let self = this;
            this.form = this._fb.group({
                INITIAL: ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.minLength(3)])],
                NAME: ['', Validators.required],
                // DIVISION: [''],
                WAREHOUSE: [''],
                CATEGORY: [''],
                REMARKS: [''],
                SALESAC: [''],
                VATAC: [''],
                CASHAC: [''],
                SRETURNAC: [''],
                DISCOUNTAC: [''],
                // product: ['', Validators.required],
            });
            console.log("check");
            console.log( this.masterService.getDivisions());
             
            //let initialControl: FormControl;
            if (!!this._activatedRoute.snapshot.params['mode']) {
                if (this._activatedRoute.snapshot.params['mode'] == "view") {
                    this.viewMode = true;
                    this.form.get('INITIAL').disable();
                    this.form.get('NAME').disable();
                   // this.form.get('DIVISION').disable();
                    this.form.get('WAREHOUSE').disable();
                    this.form.get('CATEGORY').disable();
                    this.form.get('REMARKS').disable();
                    this.form.get('SALESAC').disable();
                    this.form.get('VATAC').disable();
                    this.form.get('CASHAC').disable();
                    this.form.get('SRETURNAC').disable();
                    this.form.get('DISCOUNTAC').disable();
                }
            }

            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['terminalId']) {
                let initial = this._activatedRoute.snapshot.params['terminalId'];

                this._salesTerminalService.getSalesTerminal(initial)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            this.form.patchValue({
                                INITIAL: data.result.INITIAL,
                                NAME: data.result.NAME,
                                // DIVISION : data.result.DIVISION,
                                WAREHOUSE: data.result.WAREHOUSE,
                                CATEGORY: data.result.CATEGORY,
                                REMARKS: data.result.REMARKS,
                                SALESAC: data.result.SALESAC,
                                VATAC: data.result.VATAC,
                                CASHAC: data.result.CashAC,
                                SRETURNAC: data.result.SRETURNAC,
                                DISCOUNTAC: data.result.DISCOUNTAC,
                            }

                            );
                            this.salesTerminal.MGROUPLIST = data.result.MGROUPLIST;
                            if (this._activatedRoute.snapshot.params['mode'] == null) {
                                self.modeTitle = "Edit Sales Terminal";
                            } else if (this._activatedRoute.snapshot.params['mode'] == "view") {
                                self.modeTitle = "View Sales Terminal";
                            }
                            console.log(data);
                            self.mode = 'edit';
                            self.initialTextReadOnly = true;

                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit - Error in Sales Terminal";
                            this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 - Error in Sales Terminal";
                        this.masterService.resolveError(error, "sales-terminal - getSalesTerminal");
                    }
                    );
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add Sales Terminal";
                this.initialTextReadOnly = false;

            }


            //this.model.id = this.returnUrl;
            console.log(this.salesTerminal.INITIAL);

            let v = self.salesTerminal;

            console.log(v.INITIAL);
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
        try {
            //validate before Saving
            this.DialogMessage = "Saving Data please wait..."
            this.childModal.show();
            this.save();
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

    addRow() {
        try {
            // this.salesTerminal.product.forEach(x => x.inputMode=false);
            // var newRow = <Product>{};
            // newRow.inputMode = true;
            // newRow.editMode = false;
            //  var row = Object.assign({}, this.product)
            //  this.salesTerminal.PRODUCTS.push(row);


            if (this.selectedProduct == null) return;

            this.selectedCP.DESCA = this.selectedProduct.DESCA;
            this.selectedCP.PRODUCT = this.selectedProduct.MCODE;
            this.selectedCP.COUNTER = this.salesTerminal.INITIAL;
            // selectedCP.SN=
            if (this.salesTerminal.MGROUPLIST == null) { this.salesTerminal.MGROUPLIST = []; }
            this.salesTerminal.MGROUPLIST.push(this.selectedCP);
            this.selectedProduct = <Item>{};
            this.selectedCP = <CounterProduct>{};
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    removeRow(index) {
        try {
            // if (this.salesTerminal.product[index].inputMode == true && this.salesTerminal.product[index].editMode == false) {
            //     this.salesTerminal.product[index] = <Product>{};
            //     this.salesTerminal.product[index].inputMode = true;
            //     this.salesTerminal.product[index].editMode = false;
            // }else{
            this.salesTerminal.MGROUPLIST.splice(index, 1);
            // }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    // editRow(index) {
    //     this.salesTerminal.product[index].inputMode = true;
    //     this.salesTerminal.product[index].editMode = true;
    // }

    // saveRow(index) {
    //     this.salesTerminal.product[index].inputMode = false;
    //     this.salesTerminal.product[index].editMode = false;
    // }  

    save() {
        console.log(this.salesTerminal);
        try {
            // alert(this.form.value.WAREHOUSE);
            console.log("submit call");
            let salesTerminal = <SalesTerminal>{}
            salesTerminal.INITIAL = this.form.value.INITIAL;
            salesTerminal.NAME = this.form.value.NAME;
            // salesTerminal.DIVISION = this.form.value.DIVISION;
            salesTerminal.WAREHOUSE = this.form.value.WAREHOUSE,
                salesTerminal.CATEGORY = this.form.value.CATEGORY,
                salesTerminal.REMARKS = this.form.value.REMARKS,
                salesTerminal.SALESAC = this.form.value.SALESAC,
                salesTerminal.VATAC = this.form.value.VATAC,
                salesTerminal.CASHAC = this.form.value.CASHAC,
                salesTerminal.SRETURNAC = this.form.value.SRETURNAC,
                salesTerminal.DISCOUNTAC = this.form.value.DISCOUNTAC,

                console.log({ tosubmit: salesTerminal });

            let sub = this.masterService.saveSalesTerminal(this.mode, salesTerminal, this.salesTerminal.MGROUPLIST)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.DialogMessage = "Data Saved Successfully"
                        setTimeout(() => {
                            this.childModal.hide();

                            this._router.navigate([this.returnUrl]);
                        }, 1000)


                    }
                    else {

                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            this._router.navigate(['/login', this._router.url])
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
    back() {
        try {
            this._router.navigate([this.returnUrl]);
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
}