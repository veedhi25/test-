import { Component, OnInit, AfterViewInit, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { ItemPropertySettingService } from './ItemPropertySetting.service';
import { SpinnerService } from '../../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../../common/services/alert/alert.service';
import { MasterRepo } from '../../../../../common/repositories';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { Http } from '@angular/http';
import { GlobalState } from '../../../../../global.state';
import { ReportFilterService } from '../../../../../common/popupLists/report-filter/report-filter.service';
import { FormControl } from '@angular/forms';

@Component(
    {
        selector: 'item-property-setting',
        templateUrl: './ItemPropertySetting.component.html',
        styleUrls: ["../../../../Style.css"],
        providers: [ItemPropertySettingService],

    }
)
export class ItemPropertySettingComponent implements OnInit, AfterViewInit {
    isCentral: boolean = false;
    itemList: any[] = [];
    tabindex: string = "list";
    itemPropertySetting: string = "Item Property Setting"
    tempItemList: any[];
    selectedSapCode: string = "";
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    totalItems: any;
    // filter = new FormControl();
    filteredItemList: any[];



    constructor(public _http: Http, public _state: GlobalState, private itemservice: ItemPropertySettingService, private loadingSerive: SpinnerService, private alertService: AlertService, private masterService: MasterRepo) {
        if (this.masterService.userProfile.CompanyInfo.ORG_TYPE == 'central') {
            this.isCentral = true;
        }
        this.loadingSerive.show('Please wait, Fetching Data');
        try {
            this.loadData()
        }
        catch (ex) {
            alert(ex)
        }



        this.gridPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "SAP LIST",
            apiEndpoints: `/sapList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'SAPCODE',
                    title: 'SAP CODE',
                    hidden: false,
                    noSearch: false
                }
            ]
        })

    }
    ngOnInit() {
        this.itemList.forEach(x => {
            x.CANSALE = x.CANSALE ? true : false,
            x.CANPURCHASEINVOICE = x.CANPURCHASEINVOICE ? true : false,
                x.CANPURCHASE = x.CANPURCHASE ? true : false,
                x.SALERETURN = x.SALERETURN ? true : false,
                x.PURCHASERETURN = x.PURCHASERETURN ? true : false,
                x.TAXINCLUSIVE = x.TAXINCLUSIVE ? true : false,
                x.ALLOWNEGATIVE = x.ALLOWNEGATIVE ? "1" : "0",
                x.STOREPICKUP = x.STOREPICKUP ? true : false
        });
    }

    ngAfterViewInit() {

    }


    exportItemProperty() {
        this.loadingSerive.show("Downloading...");
        this.itemservice.downloadSampleFile("itempropertysettingdetail", "ItemPropertySetting").subscribe(
            data => {
                this.loadingSerive.hide();
                this.downloadFile(data);
            },
            error => {
                this.loadingSerive.hide();
            }
        );
    }
    downloadFile(response: any) {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(response.content);
        element.download = response.filename;
        document.body.appendChild(element);
        element.click();
    }

    loadData() {
        let url = this._state.getGlobalSetting("apiUrl");

        let apiUrl = `${url}/getItemProperty`;
        return this._http
            .get(apiUrl, this.masterService.getRequestOption())
            .map(res => res.json() || [])
            .subscribe(res => {
                this.totalItems = res ? res.totalCount : 0;
                this.itemList = res ? res.data : [];
                this.filteredItemList = Object.assign([], this.itemList)
                this.loadingSerive.hide()
            }, error => {
                this.alertService.error(error)
            });
    }

    saveItemProperty() {
        this.loadingSerive.show("please wait.Saving Item Property.");
        this.tempItemList = [];
        this.filteredItemList.forEach(x => {
            if (x.isChecked) {
                this.tempItemList.push({
                    MAXQTY: x.MAXQTY,
                    MINQTY: x.MINQTY,
                    MCODE: x.MCODE,
                    CANSALE: x.CANSALE ? true : false,
                    CANPURCHASEINVOICE: x.CANPURCHASEINVOICE ? true : false,
                    CANPURCHASE: x.CANPURCHASE ? true : false,
                    SALERETURN: x.SALERETURN ? true : false,
                    PURCHASERETURN: x.PURCHASERETURN ? true : false,
                    ALLOWNEGATIVE: x.ALLOWNEGATIVE == "1" ? true : false,
                    TAXINCLUSIVE: x.TAXINCLUSIVE ? true : false,
                    STOREPICKUP: x.STOREPICKUP ? true : false
                })
            }
        })
        this.masterService.masterPostmethod("/saveItemProperty", { SAPCODE: this.selectedSapCode, ISCENTRAL: this.isCentral, ItemProperty: this.tempItemList }).subscribe((res) => {
            this.loadingSerive.hide();
            this.alertService.success(res.message);
        }, () => {
            this.loadingSerive.hide();
        }, () => {
            this.loadingSerive.hide();
        })
    }


    showSapCode() {
        this.genericGrid.show();
    }


    onItemDoubleClick(event) {
        this.selectedSapCode = event.SAPCODE;
    }
}




