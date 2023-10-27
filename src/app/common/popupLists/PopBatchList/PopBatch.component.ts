import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, OnChanges } from '@angular/core';
import { MasterRepo } from '../../repositories';
import { TransactionService } from '../../Transaction Components/transaction.service';

@Component(
    {
        selector: 'PBatchList',
        templateUrl: './PopBatch.html',
        styleUrls: ["../../../pages/Style.css", "../pStyle.css"],

    }
)
export class PopBatchComponent implements OnChanges {
    @Input() title: string;
    @Input() tabindex;
    @Input() inputSearch: string;
    @Output() dbClickEvent = new EventEmitter();
    @Output() BatchClosedClick = new EventEmitter();
    @Output() searchItem = new EventEmitter();
    @Output() returnBatchValue = new EventEmitter();
    @Output() multiBatchScheme = new EventEmitter();
    @ViewChild("BatchEntry") _BE: ElementRef;
    @ViewChild("SearchBox") _Search: ElementRef;

    /** Object Declaration  */
    selectPopupRowList: Function;
    selectedRow: number;
    selectedRowIndex: number;
    isFocus: boolean = true;

    /** List Declaration  */
    p: number[] = [];
    setClickedRow: Function;
    BatchObj: any = <any>{};
    BatchList: any[] = [];
    @Input() BList: any[] = [];
    unitList: any[] = [];
    @Input() voucherType: any;
    @Input() activerowIndex: number;
    @Input() AlternateUnits: any[] = [];
    keys: string[];
    headerKeys: string[];
    public NOOFQTY: number;
    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService) {
        this.selectedRowIndex = 0;
        this.setClickedRow = function (index) {
            this.selectedRow = index;
        }
    }
    ngAfterViewInit() {
    }
    ngOnInit() {

    }
    SelectUnit() {
        this.BatchObj.UNIT = this.BatchObj.ALTUNITObj.ALTUNIT;
        this.BatchObj.PRATE = this.BatchObj.ALTUNITObj.PRATE;
        this.BatchObj.SRATE = this.BatchObj.ALTUNITObj.RATE;
    }
    pagingChange(value) {
        this.p[this.tabindex] = value;
    }
    setFocus() {
    }
    SearchList(value) {
    }



    PopupItemListRowClick(index) {
        this.selectedRowIndex = index;
    }

    itemBatchClosed() {
        this.BatchClosedClick.emit();
    }
    keydownClick() {

    }
    AddNewBatch() {
    }

    tabClick() {
        this.returnBatchValue.emit(this.BatchObj);
    }
    clickPlusButton() {
        this.tabClick()
    }
    clickButtonClick() {
        if (this.BatchObj.BATCH == null) {
            alert("Please enter Batch no.");
            return;
        }
        else if (this.BatchObj.MFGDATE > this.BatchObj.EXPIRY
        ) {
            alert("Manufacture date cannot be greater than Expiry date!!")
            return;
        }
        else if (this.BatchObj.SRATE > this.BatchObj.MRP) {
        }
        else if (this.BatchObj.MFGDATE == null || this.BatchObj.EXPIRY == null) {
            alert("MFGDate and ExpDate cannot be empty!")
            return;
        }
        this.tabClick()


    }
    RowClickEvent(index) {
        this.selectedRowIndex = index;
    }


    onQuantityDown() {
        if (this.NOOFQTY > this.BList.length) {
            return false;
        } else {
            return true;
        }
    }

    OnEnterOnQuantity() {
        if (this.NOOFQTY <= 0) return;
        if (this.NOOFQTY > this.BList.length) return;
        let value = this.BList.slice(0, this.NOOFQTY)
        this.dbClickEvent.emit({ type: "MULTIPLE_BATCH_SELECTION", batchList: value, NOOFQTY: this.NOOFQTY })
    }


    dblClickBatchObj(value) {
        this.dbClickEvent.emit(value)
    }
    MultiBatchEntryClicked() {
        var filteredList = this.BList.filter(x => x.tQuantity > 0);
        var firstBatch = filteredList[0];
        if (firstBatch == null) { alert("Row with valid Quantity not detected..."); return; }
        if (filteredList.filter(x => x.SCHEME.schemeID != firstBatch.SCHEME.schemeID)[0] != null) {
            alert("Can not Choose multi batch of different Scheme...");
            return;
        }
        if (filteredList.filter(x => x.STOCK < x.tQuantity)[0] != null) {
            alert("Exceed Quantity than Stock detected...");
            return;
        }
        this.multiBatchScheme.emit(filteredList);
    }
    @HostListener("document : keydown", ["$event"])
    updown($event: KeyboardEvent) {

        if (this.selectedRowIndex == null) this.selectedRowIndex = 0;

        if ($event.code === "ArrowDown") {
            this.selectedRowIndex = this.selectedRowIndex + 1;
            if (this.selectedRowIndex > (this.BList.length - 1)) this.selectedRowIndex = this.BList.length - 1;
        }
        else if ($event.code === "ArrowUp") {
            this.selectedRowIndex = this.selectedRowIndex - 1;
            if (this.selectedRowIndex < 0) this.selectedRowIndex = 0;
        }
        if ($event.code === "Enter" || $event.code == "NumpadEnter") {
            if (this.selectedRowIndex != null) {
                if (this.BList[this.selectedRowIndex] != null) {
                    this.dblClickBatchObj(this.BList[this.selectedRowIndex]);
                }
            }
        } else if ($event.code === "Escape") {
            this.itemBatchClosed();
        }


    }


    ngOnChanges(changes: any) {
        if (changes && changes.BList) {
            this.BList = changes.BList.currentValue;
            this.keys = [];
            this.headerKeys = [];
            this.BList.forEach(x => {
                if (x.hasOwnProperty("VARIANTDETAIL") && x.VARIANTDETAIL != null) {

                    x.VARIANTDETAIL = JSON.parse(x.VARIANTDETAIL);
                } else {
                    x['VARIANTDETAIL'] = null;
                }
            });

            this.BList.forEach(batch => {
                for (var attribute in batch.VARIANTDETAIL) {
                    if (this.headerKeys.indexOf(this._trnMainService.getVariantNameFromId(attribute)) == -1 && ['QTY', 'PRATE', 'MRP', 'SRATE','BARCODE','BATCH'].indexOf(attribute) == -1) {
                        this.headerKeys.push(this._trnMainService.getVariantNameFromId(attribute))
                    }
                    if (this.keys.indexOf(attribute) == -1 && ['QTY', 'PRATE', 'MRP', 'SRATE','BARCODE','BATCH'].indexOf(attribute) == -1) {
                        this.keys.push(attribute)
                    }
                }
            })
        }
    }

    getAttributeValues = (BObject, key): string => {
        if (BObject.VARIANTDETAIL != null && BObject.VARIANTDETAIL[key] && BObject.VARIANTDETAIL[key].hasOwnProperty("NAME")) {
            return BObject.VARIANTDETAIL[key].NAME;

        } else {
            return "";
        }
    }
}