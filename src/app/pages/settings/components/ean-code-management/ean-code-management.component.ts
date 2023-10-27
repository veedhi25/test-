import { Component, ViewChild } from '@angular/core';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { EanCodeModel } from './ean-code-management.model';
import { FormControl } from "@angular/forms";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component({
    selector: 'ean-code-management',
    templateUrl: './ean-code-management.component.html',
    styleUrls: ["../../../modal-style.css"]
})

export class EanCodeComponent {

    @ViewChild('genericGridBarcode') genericGridBarcode: GenericPopUpComponent;
    gridPopupSettingsForBarcode: GenericPopUpSettings = new GenericPopUpSettings();

    barcodeModels: EanCodeModel[] = [];
    activerowIndex: number = 0;
    showStockedQuantityOnly = 0;
    public promptPrintDevice: boolean = false;
    public printControl = new FormControl(0);
    AlternateUnits: any[] = [];


    public ITEMCODE: string;
    public ITEMDESC: string;

    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService, private alertService: AlertService, private loadingService: SpinnerService) {

        this.gridPopupSettingsForBarcode = Object.assign(new GenericPopUpSettings, {
            Title: 'ITEMS',
            apiEndpoints: `/getMenuitemWithStockPagedList/0/${'all'}/${'NO'}/${this._trnMainService.userProfile.userWarehouse}`,
            defaultFilterIndex: 0,
            columns: [{
                key: 'MCODE',
                title: 'Code',
                hidden: false,
                noSearch: false
            },
            {
                key: 'DESCA',
                title: 'Name',
                hidden: false,
                noSearch: false
            },
            {
                key: 'STOCK',
                title: 'Stock',
                hidden: false,
                noSearch: false
            }
            ]
        })
    }


    onItemSelect(event, bar) {
        this.ITEMCODE = event.MCODE;
        this.ITEMDESC = event.DESCA;

        this.loadingService.show("Please Wait While getting barcode details.");
        this.masterService.masterGetmethod_NEW(`/GetProductBarcodeByMCode/${this.ITEMCODE}`).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                if (res.result && res.result.length) {
                    this.barcodeModels = res.result;
                    this.newRow(this.barcodeModels.length + 1);
                } else {
                    this.barcodeModels =[];
                    this.newRow(0);
                }
            } else {
                this.loadingService.hide();
            }
        }, error => {
            this.loadingService.hide();
        })

    }



    newRow(i) {
        let emptyRow = <EanCodeModel>{};
        this.activerowIndex = i;

        if (this.barcodeModels.some(
            x => x.MCODE == ""
        )) {
            return false;
        }

        emptyRow.MCODE = this.ITEMCODE;
        emptyRow.ItemName = this.ITEMDESC;
        emptyRow.BCODE = "";
        this.barcodeModels.push(emptyRow);

        setTimeout(() => {
            this.masterService.focusAnyControl('bcode' + this.activerowIndex);
        }, 500);


    }

    onSaveClicked() {
        this.loadingService.show("Please wait while saving barcode details.");
        this.masterService.masterPostmethod_NEW("/saveBarcodeDetails", this.barcodeModels).subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.ITEMCODE = null;
                this.ITEMDESC = null;
                this.barcodeModels = [];
            } else {
                this.loadingService.hide();

            }
        }, err => {
            this.loadingService.hide();

        })
    }

    codeEnter() {
        this.genericGridBarcode.show();
    }


    barcodeEnter() {
        this.masterService.focusAnyControl('convtype' + this.activerowIndex);
    }

    ngOnInit() {

    }




    onBarcodeEnter(index: number) {
        let nullbarcodeExist = this.barcodeModels.some(s => s.BCODE == "" || s.BCODE == null);
        if (nullbarcodeExist) return;
        this.newRow(index + 1)
    }



}