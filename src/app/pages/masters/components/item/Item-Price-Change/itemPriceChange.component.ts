import { Component } from '@angular/core';
import { MasterRepo } from '../../../../../common/repositories';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { ItemPriceChangeService } from './itemPriceChange.service';
import { SpinnerService } from '../../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../../common/services/alert/alert.service';
import { TransactionService } from '../../../../../common/Transaction Components/transaction.service';
import * as moment from 'moment'
@Component(
    {
        selector: 'item-price-change',
        templateUrl: './itemPriceChange.component.html',
        styleUrls: ["../../../../modal-style.css"],
    }
)
export class ItemPriceChangeForm {
    stateList: any
    itemPriceChangeForm: FormGroup;
    modeTitle: string = '';
    DESCA: string = ""
    private returnUrl: string;
    mode: string = "add";
    initialTextReadOnly: boolean = false;
    viewMode = false;
    company: string = ""
    batchlist: any;
    PlistTitle: string;
    formModel = {
        MCODE: "",
        STATE: "",
        COSTPRICE: 0,
        SELLINGPRICE: "",
        LANDINGCOST: 0,
        MRP: 0,
        BATCH: "",
        BATCHID: "",
        MFGDATE: "",
        EXPDATE: ""


    }

    constructor(public _transactionService: TransactionService, private loadingSerive: SpinnerService, protected masterService: MasterRepo, protected service: ItemPriceChangeService, private router: Router, private _activatedRoute: ActivatedRoute, private fb: FormBuilder, private alertService: AlertService) {
        this.itemPriceChangeForm = this.fb.group({
            formFields: this.fb.array([])
        })
        this.masterService.getState().subscribe(res => {
            this.stateList = res.result
        })

    }

    ngOnInit() {

        try {

            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['menuCode']) {
                let MenuCode: string = "";
                let mCode: string = ""
                MenuCode = this._activatedRoute.snapshot.params['menuCode'];
                mCode = this._activatedRoute.snapshot.params['mCode']
                this.DESCA = this._activatedRoute.snapshot.params['DESCA']
                this.service.getItemDetailForPriceChange(MenuCode, mCode).subscribe(
                    (response) => {
                        let data = response.result.data[0]
                        // this.addFormDetails(response.result.data)
                        this.formModel.COSTPRICE = data.COSTPRICE
                        this.formModel.SELLINGPRICE = data.SELLINGPRICE
                        this.formModel.MCODE = data.MCODE
                        this.formModel.STATE = data.STATE
                        this.formModel.LANDINGCOST = data.LANDINGCOST
                        this.formModel.MRP = data.MRP
                        this.company = response.result.company
                    }, err => {

                    }
                )
            }

        } catch (ex) {
            alert(ex);
        }
    }

    onSave() {


        if (this._transactionService.nullToZeroConverter(this.formModel.MRP) < this._transactionService.nullToZeroConverter(this.formModel.COSTPRICE)) {
            this.alertService.error("MRP Cannot be less than Cost Price");
            return;

        }
        if (this._transactionService.nullToZeroConverter(this.formModel.SELLINGPRICE) > this._transactionService.nullToZeroConverter(this.formModel.MRP)) {
            this.alertService.error("SELLINGPRICE Cannot be more than MRP");
            return;

        }
        this.loadingSerive.show("Please wait.Updating Item Price List!")
        this.service.addItemPrice(this.formModel).subscribe(
            (res) => {
                if (res.status == "ok") {
                    this.loadingSerive.hide()
                    this.alertService.success("Price Change Successfully");
                    this.router.navigate(["./pages/masters/item/itempricechange"]);

                }
                else if (res.status == "error") {
                    this.loadingSerive.hide()
                    this.alertService.error("Error" + res.result);
                }

            }, err => {

                this.loadingSerive.hide();
                this.alertService.error(err._body);

            }
        )

        // }


    }
    cancel() {
        this.router.navigate(["./pages/masters/item/itempricechange"]);
    }

    batchTabClick() {
        let warehouse = this._transactionService.userProfile.userWarehouse;
        this.masterService.masterPostmethod("/getBatchListOfItem", {
            mcode: this._activatedRoute.snapshot.params['mCode'],
            onlynonexpireditem: 1,
            warehouse: warehouse
        }).subscribe(
            res => {
                if (res.status == "ok") {
                    this.masterService.RemoveFocusFromAnyControl("batchChoose");
                    this.batchlist = JSON.parse(res.result);

                    this.PlistTitle = "Batch List";

                } else {
                    this.alertService.error("Error on getting BatchList Of Item ")
                }
            },
            error => {
                this.alertService.error(error)
            }
        );
    }

    dblClickPopupBatch(event) {
        this.formModel.BATCH = event.BATCH
        this.formModel.BATCHID = event.ID
        // this.formModel.MFGDATE = moment(event.MFGDATE).format('DD-MM-YYYY')
        this.formModel.EXPDATE = event.EXPIRY;
        this.formModel.MFGDATE = event.MFGDATE;
        this.formModel.COSTPRICE = event.PRATE
        this.formModel.SELLINGPRICE = event.BATCHSELLARATE
        this.formModel.MRP = event.MRP;
        this.formModel.LANDINGCOST = event.PRATE;

        this.PlistTitle = "";
    }

    batchTabClose() {
        this.PlistTitle = "";
    }



}