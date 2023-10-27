import { Component, ViewChild } from '@angular/core';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { FormControl } from "@angular/forms";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { PopBatchOldComponent } from "../../../../common/popupLists/PopBatchList/PopBatchOld.component";
import { AuthService } from '../../../../common/services/permission';
import { DecimalPipe } from '@angular/common';
import { ConfigBarCodeModel } from './configBarCode.model';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { isNumber } from 'util';
import { TypeaheadOptions } from 'ng2-bootstrap';
import { max } from 'lodash';

@Component({
    selector: 'config-bar-code',
    templateUrl: './configBarCode.html',
    styleUrls: ["../../../modal-style.css"]
})

export class ConfigBarCodeComponent {
    configbarCode: any = [];
    selectedBarCode : string ="";
    AddModeFlag: boolean =true;
    viewModeFlag: boolean = false;
    savebuttonStatus : boolean = true;
    addconfigbarCode : any = [];
    barCodeType : any =[];
    barCodeName : string ="";
    activeFlag :boolean = false;
    inactiveFlag :boolean = false;
    barcodeLen: number = 16;
    commingBarCodeLen : number = 0;
    

    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService, private alertService: AlertService, private _authService: AuthService,private loadingService: SpinnerService) {
}

    parameterType : any = [
        {name: "Item Code"},
        {name: "Unique barcode"},
        {name: "Selling rate"},
    ]

    setConfigStatus :any =[
        {name : "Y"},
        {name : "N"}
    ]

    onViewMode(){
        this.selectedBarCode = "";
        this.configbarCode = [];
        this.barCodeName = "";
        this.addconfigbarCode = [];
        this.AddModeFlag =false;
        this.viewModeFlag = true;
        this.savebuttonStatus = false;
        this.getAllconfigBarCode();
       // this.get();
    }
    onAddMode(){
        this.selectedBarCode = "";
        this.configbarCode = [];
        this.barCodeName = "";
        this.addconfigbarCode = [];
        this.AddModeFlag =true;
        this.viewModeFlag = false;
        this.savebuttonStatus = true;
        this.getAllbarCodeParameter();
    }
    changeType(){
        this.get();
    }
    numberOnly(event): boolean {
        let regex = /^[0-9]+$/;
        if (!regex.test(event.key)) {
        return false;
        }else{
           return true;
        }
      } 
      numberMinOnly(event,i,maxLength): boolean {
        let regex = /^[0-9]+$/;
        if (!regex.test(event.key)) {
        return false;
        }else{
            if(this.addconfigbarCode[i].ParaMaxLength == null){
                this.addconfigbarCode[i].ParaMaxLength = 0;
            }
            if(Number(this.addconfigbarCode[i].ParaMaxLength+event.key) > maxLength){
                alert('Max Length must be less than or equal to '+maxLength);
                this.addconfigbarCode[i].ParaMaxLength= maxLength;
               return false;
            }else{
                //console.log(this.addconfigbarCode[i].ParaMaxLength);
                this.addconfigbarCode[i].ParaMaxLength = Number(this.addconfigbarCode[i].ParaMaxLength)
               // console.log('less');
               // console.log(this.addconfigbarCode);
                return true;
                
        }
      } 
    }

    ngOnInit() {
        this.getAllbarCodeParameter()
    }

    getAllbarCodeParameter(){
        try{
            this.loadingService.show("Please wait...");
        var requestObject = {
            "mode": 'add',
            "ConfigParaTitle" : this.selectedBarCode
        }
        this.masterService.masterPostmethod('/getBarCodeParameter',JSON.stringify(requestObject)).subscribe(res=>{
          if(res.status =='ok'){
              this.loadingService.hide();
              this.addconfigbarCode = res.result;
             // console.log(this.addconfigbarCode);   
          }else{
            this.loadingService.hide();
          }
        })
    }catch(e){
        this.loadingService.hide();
    }
    }
    onSaveMode(){
        var myArr=[];
         if(this.barCodeName == undefined || this.barCodeName =="" || this.barCodeName == null){
            this.alertService.error("Enter Bar Code Name");
            return
        }
        if(this.addconfigbarCode[0].ParaOrder > 1){
            this.alertService.error("Item Code order must be 1");
            this.addconfigbarCode[0].ParaOrder = 1;
            return
        }
        try{
            var mySecArr=[];
            var loopCount = 1;
            this.commingBarCodeLen=0;
            this.addconfigbarCode.forEach((i ,index )=> {
                var jsdummy={};
                if(i.ParaStatus == "Y"){
                    this.commingBarCodeLen = this.commingBarCodeLen + parseInt(i.ParaMaxLength);
                    if(i.ParaMaxLength==0 || i.ParaMaxLength == "0" || i.ParaMaxLength==""||i.ParaMaxLength==null || i.ParaMaxLength==undefined){
                        i.ParaMaxLength = i.maxLength;
                    }if(i.ParaOrder==0 || i.ParaOrder == "0" || i.ParaOrder==""||i.ParaOrder==null || i.ParaOrder==undefined){
                        i.ParaOrder = loopCount;
                    }
                     jsdummy ={
                        "ParaMaxLength":Number(i.ParaMaxLength),
                        "ParaOrder":Number(i.ParaOrder),
                        "ParaStatus":i.ParaStatus,
                        "ParameterTitle":i.ParameterTitle,
                        "ParameterId":i.ParameterId,
                        "ConfigParaTitle": this.barCodeName,
                        "ParaRowno":i.ParaRowno
                    }
                    mySecArr.push(Number(i.ParaOrder));
                    myArr.push(jsdummy);
                    loopCount=loopCount+1;
                }
            });
            var myArr1=[];
         myArr1.push({"dataArray" : myArr,"ConfigParaTitle" : this.barCodeName,mode : "insert"});
           // console.log(myArr1);
            //console.log(myArr.length);
            // console.log(this.createSquenceArray(myArr.length));
            // console.log(mySecArr);
            let mySquArra = this.createSquenceArray(myArr.length);
           if(myArr.length==0){
                this.alertService.error("Choose any one Particular set data Y");
                return;
            }
            //console.log(this.commingBarCodeLen +'>'+ this.barcodeLen);
            if(this.commingBarCodeLen > this.barcodeLen){
                this.alertService.error("Max Length of EAN code is "+this.barcodeLen);
                return;
            }
            //console.log(myArr);
            if(mySecArr.sort().join(',')=== mySquArra.sort().join(',')){
                //console.log("sequnce match");
            }else{
                this.alertService.error("Missing number or Duplicate Order");
                return
            } 
            this.loadingService.show("Please wait.....");
            this.masterService.masterPostmethod('/addConfigParameter',JSON.stringify(myArr1)).subscribe(res => {
               // console.log(res);
                if(res.status == "ok"){
                    this.loadingService.hide();
                    if(res.message == "Duplicate code"){
                        this.alertService.warning("Duplicate code title");
                        //this.onAddMode();
                    }else{
                        this.alertService.success("Data Saved successfully");
                        this.onAddMode();
                    }
                }else{
                    this.loadingService.hide();
                }
            })
            
        }
        catch(e){
            this.alertService.error(e);
            this.loadingService.hide();
        }
        //console.log(this.addconfigbarCode);
        
    }

    createSquenceArray(n){
        return Array.from({length: n}, (_, i) => i + 1)
    }

    getAllconfigBarCode(){
        try{
            this.loadingService.show("Data loading.....")
            this.masterService.masterGetmethod('/getConfigBarCode').subscribe(res=>{
               if(res.status == 'ok'){
                this.loadingService.hide();
                //console.log(res.result);
                if(res.result.length > 0){
                    this.barCodeType = res.result;
                }else{
                    this.alertService.warning("No bar code configuration available");
                    this.onAddMode();
                }
               }
                this.loadingService.hide();
            })
        }catch(e){
            this.loadingService.hide();
        }
    }

    get(){
        this.configbarCode = [];
        this.activeFlag=false;
        this.inactiveFlag=false;
        if(this.viewModeFlag){
        if(this.selectedBarCode ==undefined || this.selectedBarCode == null || this.selectedBarCode == ""){
            this.alertService.warning('Select Bar Code Type');
            return;
        }
        var requestObject = {
            "mode":"view",
            "ConfigParaTitle" : this.selectedBarCode
        }
        try{
            this.loadingService.show("Please wait...");
        this.masterService.masterPostmethod('/getBarCodeParameter',JSON.stringify(requestObject)).subscribe(res =>{
            if(res.status == 'ok'){
                console.log(res);
                this.loadingService.hide();
                if(res.result[0].ConfigParaStatus=="Active"){
                    this.activeFlag=true;
                }else if(res.result[0].ConfigParaStatus=="Inactive"){
                    this.inactiveFlag =  true;
                }else{

                }
                this.configbarCode = res.result;
               // console.log(this.configbarCode);
            }else{
                this.loadingService.hide();
            }
        });
        //console.log(this.configbarCode);
    }
    catch(e){
        this.loadingService.hide();
    }
    }
}

updateStatus(){
    try{
        this.loadingService.show("Please wait....");
        var requestObject={
            "ConfigParaTitle" : this.selectedBarCode
        }
        this.masterService.masterPostmethod('/updateConfigParaStatus',JSON.stringify(requestObject)).subscribe(res=>{
            console.log(res);
            if(res.status == "ok"){
                this.loadingService.hide();
                this.activeFlag=true;
                this.inactiveFlag = false;
            }else{
                this.loadingService.hide();
            }
        })

    }catch(e){
        this.alertService.error(e);
        this.loadingService.hide();
    }
}

}