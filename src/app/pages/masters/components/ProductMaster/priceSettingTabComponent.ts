import { Component, Input, ViewChild } from '@angular/core';
import { Product, ItemRate, RateGroup } from '../../../../common/interfaces/ProductItem';

import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { SettingService, AppSettings } from "../../../../common/services/index";
import { ModalDirective } from 'ng2-bootstrap';
@Component({
    selector: "pricesettingtab",
    templateUrl: "./priceSettingTabComponent.html",
    styleUrls: ["../../../Style.css"],
})

export class PriceSettingTabComponent {
    @Input() productObj: Product = <Product>{};
    @ViewChild('childModal') childModal: ModalDirective;

    AppSettings: AppSettings;
    RGroupList: RateGroup[] = [];

    DialogMessage: String;

    ItemRateVisible: boolean = false;
    RateTypeName: string;
    Unit: string;
    RateType: string;
    ItemRateObj: ItemRate = <ItemRate>{};
    ItemRateList: ItemRate[] = [];
    @Input() RGLIST: ItemRate[] = [];
    constructor(private masterService: MasterRepo, private setting: SettingService) {
        try {
            this.AppSettings = setting.appSetting;
            this.productObj.VAT=1;
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    ngOnInit() {
        try {
            this.masterService.getRGroupList().subscribe(res => { this.RGroupList.push(<RateGroup>res); });
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }


    backClick() {
        try {
            this.ItemRateVisible = false;
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    clearClick() {
        try {
            for (var i in this.ItemRateList) {
                this.RGLIST.splice(this.RGLIST.findIndex(x => x.RATEID == this.ItemRateList[i].RATEID && x.RATETYPE == this.ItemRateList[i].RATETYPE), 1);
            }
            this.ItemRateList = [];
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    addItemRate() {
        try {
            if ((this.ItemRateList.filter(x => x.RATEID == this.ItemRateObj.RateGroup.RID)).length > 0) return;
            this.ItemRateObj.RATEID = this.ItemRateObj.RateGroup.RID;
            this.ItemRateObj.RATETYPE = this.RateType;
            this.RGLIST.push(this.ItemRateObj);
            this.ItemRateList.push(this.ItemRateObj);
            this.ItemRateObj = <ItemRate>{};
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    removeItemRate(index) {
        try {
            var rg = this.ItemRateList[index];
            this.ItemRateList.splice(index, 1);
            this.RGLIST.splice(this.RGLIST.findIndex(x => x.RATEID == rg.RATEID && x.RATETYPE == rg.RATETYPE), 1);
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    SetItemRateClick(option) {
        if(this.RGLIST.length>0){
            for(let rg of this.RGLIST)
            {
                if(rg.RateGroup==null){
                    rg.RateGroup=this.RGroupList.filter(r=>r.RID==rg.RATEID)[0];
                }
            }
        }
        try {
            this.ItemRateVisible = true;
            this.Unit = this.productObj.BASEUNIT;
            if (option == "SRate") {

                this.RateType = "1";
                this.RateTypeName = "Retail Sales Rate";

            }
            else if (option == "WRate") {
                this.RateType = "2";
                this.RateTypeName = "Whole Sale Rate";
            }
            else if (option == "ICRate") {
                this.RateType = "3";
                this.RateTypeName = "Intercompany Sale Rate";
            }

            var list = this.RGLIST.filter(x => x.RATETYPE == this.RateType);
            if (list.length > 0) { this.ItemRateList = list; }
            else { this.ItemRateList = []; }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    CheckSalesPrice(){
        if(this.productObj.RATE_A <  this.productObj.PRATE_A || this.productObj.RATE_B <  this.productObj.PRATE_A ||this.productObj.RATE_C <  this.productObj.PRATE_A  ){
            this.DialogMessage='sales rate should be greater than purchase rate';
            this.childModal.show();
             setTimeout(function() {
                 this.childModal.hide();
             },3000)
        }
    }
    hideChildModal(){
        this.childModal.hide();
    }

}