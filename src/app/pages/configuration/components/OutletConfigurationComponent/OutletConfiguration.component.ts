import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component({
    selector: 'outlet-configuration',
    templateUrl: './OutletConfiguration.component.html'
})

export class OutletConfigurationComponent {
    multiselectSetting: any = {
        singleSelection: false,
        text: 'Select',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'COMPANYID',
        primaryKey: 'COMPANYID',
        position: 'bottom'

    };
    outletListForNegativeBilling: any[] = [];
    outletList: any[] = [];
    permissionArray : any =[];
    outletMain: OutletConfiguration = <OutletConfiguration>{};
    activeRowIndex: number = 0;
    activeRowIndexPriceChange: number = 0;
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    @ViewChild("genericGrid_itempricechange") genericGrid_itempricechange: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    selectedOutletForCompanyConfig:string ="-1";
    priceChangeOutlets:OutletPriceConfiguration = <OutletPriceConfiguration>{};
    constructor(private masterRepo: MasterRepo, private alertService: AlertService, private spinnerService: SpinnerService) {

        this.initialiseForm();
        this.gridPopupSettings = {
            title: "ITEMS",
            apiEndpoints: `/getAllMenuItemPaged`,
            defaultFilterIndex: 0,
            columns: [

                {
                    key: 'MENUCODE',
                    title: 'ITEM CODE',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'DESCA',
                    title: 'DESCRIPTION',
                    hidden: false,
                    noSearch: false
                },

                {
                    key: 'MRP',
                    title: 'MRP',
                    hidden: false,
                    noSearch: false
                }
                ,
                {
                    key: 'BARCODE',
                    title: 'BARCODE',
                    hidden: false,
                    noSearch: false
                }

            ]
        };

        this.masterRepo.masterGetmethod_NEW("/getoutlets").subscribe((res: any) => {
            if (res.status == "ok") {
                this.outletList = res.result;
            } else {
                this.alertService.error(res.message);
            }
        }, error => {
            this.alertService.error(error._body);
        })
        this.getoutletsettings();
        this.getOutletPermissionSetting();

    }


    onMultiSelect(event) {

    }


    initialiseForm() {
        this.outletListForNegativeBilling = [];
        this.outletMain.outletList = [];
        this.outletMain.prodList = [];
        this.priceChangeOutlets=<OutletPriceConfiguration>{};
        this.priceChangeOutlets.prodList=[];
        this.addNewRowPrintChange(0);
         this.addNewRow(0);
    }


    getoutletsettings() {
        this.masterRepo.masterGetmethod_NEW("/getoutletsettings").subscribe((res: any) => {
            if (res.status == "ok" && res.result && res.result.length) {
                this.outletListForNegativeBilling = res.result;
            }
        }, error => {

        })
    }

    getOutletPermissionSetting(){
        this.masterRepo.masterGetmethod(`/getOutletPermissionSetting`).subscribe(res=>{
            if(res.status=="ok"){
                this.permissionArray= res.result;
            }
            console.log(res);
        })
    }

    addNewRow(index) {
        let prod = <outletProdList>{};

        this.outletMain.prodList.push(prod);
        this.activeRowIndex = index;
        setTimeout(() => {
            document.getElementById(`mcode${this.activeRowIndex}`).focus();
        }, 10);
    }
    addNewRowPrintChange(index) {
        let prod = <outletItemPriceProdList>{};

        this.priceChangeOutlets.prodList.push(prod);
        this.activeRowIndexPriceChange = index;
        setTimeout(() => {
            document.getElementById(`mcode${this.activeRowIndexPriceChange}`).focus();
        }, 10);
    }

    onItemSelect(index) {
        this.activeRowIndex = index;
        this.genericGrid.show();
    }

    onItemSelectpriceChange(index) {
        this.activeRowIndexPriceChange = index;
        this.genericGrid_itempricechange.show();
    }
    dblClickPopupItem(event) {
        if (this.outletMain.prodList.some(x => x.MCODE == event.MCODE)) {
            document.getElementById(`mcode${this.activeRowIndex}`).focus();
            return;
        }


        this.outletMain.prodList[this.activeRowIndex].MCODE = event.MCODE;
        this.outletMain.prodList[this.activeRowIndex].MENUCODE = event.MENUCODE;
        this.outletMain.prodList[this.activeRowIndex].ITEMDESC = event.DESCA;
        this.outletMain.prodList[this.activeRowIndex].ALLOWNEGATIVE = false;
        this.outletMain.prodList[this.activeRowIndex].CANSALE = true;
        this.outletMain.prodList[this.activeRowIndex].CANPURCHASE = true;
        var nextIndex = this.activeRowIndex + 1;
        this.addNewRow(nextIndex);

    }
   
    dblClickPopupItem_itempricechange(event) {
        if (this.priceChangeOutlets.prodList.some(x => x.MCODE == event.MCODE)) {
            document.getElementById(`mcode${this.activeRowIndexPriceChange}`).focus();
            return;
        }


        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].MCODE = event.MCODE;
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].MENUCODE = event.MENUCODE;
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].ITEMDESC = event.DESCA;
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].IN_RATE_A = event.IN_RATE_A;
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].MRP = event.MRP;
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].RATE_A = event.RATE_A;
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].InclusiveOfTax = event.InclusiveOfTax;
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].GST = event.GST;

        if(event.InclusiveOfTax==1){
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].SELLINGPRICE=event.IN_RATE_A;
        }
        else
        {
        this.priceChangeOutlets.prodList[this.activeRowIndexPriceChange].SELLINGPRICE=event.RATE_A;

        }
        setTimeout(() => {
            this.masterRepo.focusAnyControl('mrp'+this.activeRowIndexPriceChange);
           
        }, 10);

    }
    mrpenterkey(i)
    {
        this.masterRepo.focusAnyControl('sellingprice'+i);

    }
    pricechangeNexRow(index)
    {
        
        var nextIndex = index + 1;
        this.addNewRowPrintChange(nextIndex);
    }
    saveInventoryConfiguration() {


        if (this.outletMain.outletList.length == 0) {
            this.alertService.error("Please select at least one outlet to save configuration.");
            return;
        }
        let validProductlist = this.outletMain.prodList.filter(x => x.MCODE != "" && x.MCODE != null && x.MCODE != undefined);

        if (validProductlist.length == 0) {
            this.alertService.error("Please select at least product to save configuration.");
            return;
        }



        this.spinnerService.show("Please wait while saving outlet configurations");
        this.outletMain.prodList = this.outletMain.prodList.filter(x => x.MCODE != "" && x.MCODE != null && x.MCODE != undefined);
        this.masterRepo.masterPostmethod_NEW("/saveOutletInventoryConfiguration", this.outletMain).subscribe((res: any) => {
            if (res.status == "ok") {
                this.spinnerService.hide();
                this.alertService.success(res.message);
                this.initialiseForm();
            }
        }, error => {
            this.spinnerService.hide();
            this.alertService.error(error.statusText);
        })
    }
    loadSavedOutletConfiguration() {


        if (this.outletMain.outletList.length == 0) {
            this.alertService.error("Please select at least one outlet to load configuration.");
            return;
        }

        this.spinnerService.show("Please wait whole loading outlet configurations");
        this.masterRepo.masterPostmethod_NEW("/loadSavedOutletConfiguration", this.outletMain).subscribe((res: any) => {
            if (res.status == "ok") {
                this.spinnerService.hide();
                this.alertService.success(res.message);
                this.outletMain.prodList = res.result;
                this.addNewRow(this.outletMain.prodList.length)
            }
        }, error => {
            this.spinnerService.hide();
            this.alertService.error(error.statusText);
        })
    }


    saveOutletSetting() {
        if (this.outletListForNegativeBilling.length == 0) {
            this.alertService.error("Please select at least one outlet to save setting.");
            return;
        }

        this.masterRepo.masterPostmethod_NEW("/saveoutletsettings", this.outletListForNegativeBilling).subscribe((res: any) => {
            if (res.status == "ok") {
                this.spinnerService.hide();
                this.alertService.success(res.message);
                this.initialiseForm();
                this.getoutletsettings();
            }
        }, error => {
            this.spinnerService.hide();
            this.alertService.error(error.statusText);
        })
    }


    controlInventory(control: string) {
        this.spinnerService.show("Please wait while updating data.")
        this.masterRepo.masterPostmethod_NEW(`/allinventoryControl/${control}`, this.outletMain).subscribe((res) => {
            if (res.status = "ok") {
                this.spinnerService.hide();
                this.alertService.success("successfully updated");
            }
        }, error => {
            this.spinnerService.hide();
            this.alertService.error(error.statusText)
        })
    }
    SyncPriceToOutlet()
    {
        
        if (this.priceChangeOutlets.outletList.length == 0) {
            this.alertService.error("Please select at least one outlet to save configuration.");
            return;
        }
        let validProductlist = this.priceChangeOutlets.prodList.filter(x => x.MCODE != "" && x.MCODE != null && x.MCODE != undefined);

        if (validProductlist.length == 0) {
            this.alertService.error("Please select at least product to save configuration.");
            return;
        }
        for(let p of this.priceChangeOutlets.prodList){
            if (p.InclusiveOfTax == 1) {
                p.RATE_A = this.masterRepo.nullToZeroConverter(p.SELLINGPRICE) / (1 + (this.masterRepo.nullToZeroConverter(p.GST) / 100));
                p.IN_RATE_A = this.masterRepo.nullToZeroConverter(p.SELLINGPRICE);
    
               
            }
            else {
               p.RATE_A = this.masterRepo.nullToZeroConverter(p.SELLINGPRICE)
               p.IN_RATE_A = this.masterRepo.nullToZeroConverter(p.SELLINGPRICE) + (this.masterRepo.nullToZeroConverter(p.GST) * this.masterRepo.nullToZeroConverter(p.SELLINGPRICE) / 100);
    
               
            }
        
        }

        this.spinnerService.show("Please wait while saving outlet configurations");
        this.priceChangeOutlets.prodList = this.priceChangeOutlets.prodList.filter(x => x.MCODE != "" && x.MCODE != null && x.MCODE != undefined);
        this.masterRepo.masterPostmethod_NEW("/saveOutletItemPriceConfiguration", this.priceChangeOutlets).subscribe((res: any) => {
            if (res.status == "ok") {
                this.spinnerService.hide();
                this.alertService.success(res.message);
                this.initialiseForm();
            }
        }, error => {
            this.spinnerService.hide();
            this.alertService.error(error.statusText);
        })

    }
}









export interface OutletConfiguration {
    outletList: any[];
    prodList: outletProdList[]
}


export interface outletProdList {
    MCODE: string;
    MENUCODE: string;
    ITEMDESC: string;
    ALLOWNEGATIVE: string | boolean;
    CANSALE: string | boolean;
    CANPURCHASE: string | boolean;
}
export interface OutletPriceConfiguration {
    outletList: any[];
    prodList: outletItemPriceProdList[]
}
export interface outletItemPriceProdList
{
    MCODE: string;
    MENUCODE: string;
    ITEMDESC: string;
    RATE_A:number;
    IN_RATE_A:number;
    InclusiveOfTax:number;
    MRP:number;
    SELLINGPRICE:number;
    GST:number;
}