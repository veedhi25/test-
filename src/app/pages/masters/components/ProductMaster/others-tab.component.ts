import { Component, Output, EventEmitter, Input, ViewChild } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { Warehouse, AlternateUnit } from '../../../../common/interfaces/TrnMain';
import { Product } from "../../../../common/interfaces/ProductItem";
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';

@Component({
    selector: 'others-tab',
    templateUrl: './others-tab.component.html',
    styleUrls: ["../../../Style.css"]
})

export class OthersTabComponent{

    @Input() productObj: Product = <Product>{};
    WarehouseList: Warehouse[] = [];

    @ViewChild('genericWarehouseGrid') genericWarehouseGrid: GenericPopUpComponent;
    genericWarehouseSettings: GenericPopUpSettings = new GenericPopUpSettings();

    @Output() changeWarehouseEmit = new EventEmitter();
    @Output() changeRackEmit = new EventEmitter();
    @Output() changeFormulaEmit = new EventEmitter();

    constructor(
        private masterService: MasterRepo
    ){
        this.masterService.getDivWiseWarehouseList().subscribe(
            (res) => {
                this.WarehouseList = res;
            }
        )

        this.genericWarehouseSettings = {
            title: "Warehouse List",
            apiEndpoints: `/getAllWarehousePagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "NAME",
                    title: "Warehouse List",
                    hidden: false,
                    noSearch: false
                }

            ]
        }
    }

    changeWarehouse(){
        this.changeWarehouseEmit.emit(this.productObj.WHOUSE)
    }
    changeRack(){
        this.changeRackEmit.emit(this.productObj.RackNumber)
    }
    changeFormula(){
        this.changeFormulaEmit.emit(this.productObj.PriceLevel);
    }

    dblClickPopupItems(event){
        this.productObj.WHOUSE = event;
    }
}