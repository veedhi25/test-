import { Component, Input, ViewChild } from '@angular/core';
import { Product, TBarcode, BarcodeDetail } from '../../../../common/interfaces/ProductItem';

import { TAcList } from '../../../../common/interfaces/Account.interface';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { SettingService, AppSettings } from '../../../../common/services';
import { ModalDirective } from 'ng2-bootstrap'
import { IDivision } from '../../../../common/interfaces/commonInterface.interface';
@Component({
  selector: "barcodetab",
  template: `<div style="margin-left:5px">
                <label style="width:60px">Barcode :</label>
                <input type="text" style="width:250px" [(ngModel)]="PBarCode.BCODE">
                 <label style="width:40px">Unit :</label>
                <select  style="width:100px" [(ngModel)]="PBarCode.UNIT">
                <option *ngFor="let u of Units" [ngValue]="u.UNITS">{{u.UNITS}}</option></select>
                 <label style="width:80px">Sales Rate :</label>
                <input type="text" style="width:100px" [(ngModel)]="PBarCode.SRATE">
                 <button style="height:28px;width: 26px;vertical-align: middle" (click)="smBarcodeshow()" >...</button>

<div bsModal #smBarcode="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close" (click)="smBarcode.hide()" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Barcode Additional Info</h4>
      </div>
      <div class="modal-body">
        <fieldset style="width: 750px;height: 100px">
       <label >Supplier :</label>
       <select style="width:350px" [(ngModel)]="PBarCode.SupplierAccount" (change)="supplierChangeEvent()">
       <option *ngFor="let s of SupplierList" [ngValue]="s">{{s.ACNAME}}</option></select>
        <label *ngIf="AppSettings.GblAUTOBARCODEFROMPURCHASE==1">Invoice No :</label>
       <input *ngIf="AppSettings.GblAUTOBARCODEFROMPURCHASE==1" style="width:130px" type="text" [(ngModel)]="PBarCode.INVNO">
        <label >Batch No :</label>
       <input style="width:120px" type="text" [(ngModel)]="PBarCode.BATCHNO">
        <label >Expiry Date :</label>
       <input style="width:130px" type="date" [(ngModel)]="PBarCode.EXPIRY">
        <label *ngIf="AppSettings.GblDivisionWiseBarcodeListing==1" >Division :</label>
       <select *ngIf="AppSettings.GblDivisionWiseBarcodeListing==1" style="width:130px" [(ngModel)]="PBarCode.Division" (change)="divChangeEvent()">
          <option *ngFor="let d of DivisionList" [ngValue]="d">{{d.NAME}}</option></select>
       </fieldset>
       <fieldset *ngIf="AppSettings.GblEnableBarcodeDetails==1"  style="width: 750px;height: 230px">
        <legend style="width: 100px;margin: 0px"> <label style="width: 110px;font-size: 13px;height: 20px">Barcode Details</label> </legend>
      <div style="height:200px;overflow:auto;scrollbar-3dlight-color:#FFFFFF;scrollbar-arrow-color:#000000;scrollbar-base-color:#FF9999;scrollbar-darkshadow-color:#000000;scrollbar-face-color:#000000;scrollbar-highlight-color:#000000;scrollbar-shadow-color:#0033CC;">
        <tr *ngFor="let bd of BCodeDetails">
        <label *ngIf="bd.DATA_TYPE=='varchar' || bd.DATA_TYPE==null" style="margin:10px">{{bd.COLUMN_NAME}}:</label>
        <input *ngIf="bd.DATA_TYPE=='varchar' || bd.DATA_TYPE==null" style="width:200px;margin:10px" type="text" [(ngModel)]="bd.VALUE">
        
        <label *ngIf="bd.DATA_TYPE=='date'" style="margin:10px">{{bd.COLUMN_NAME}}:</label>
        <input *ngIf="bd.DATA_TYPE=='date'" style="width:200px;margin:10px" type="date" [(ngModel)]="bd.VALUE">
        <label *ngIf="bd.DATA_TYPE=='bit'" style="width: 200px;height: 20px;margin:10px"><input  type="checkbox" style="vertical-align: middle"  [checked]="bd.VALUE">{{bd.COLUMN_NAME}}</label> 
       </tr>
       </div>
       </fieldset>
      </div>
      <div class="modal-footer">
        <button class="btn btn-info confirm-btn" (click)="smBarcodeSave()">Save changes</button>
      </div>
    </div>
  </div>
</div>

                
                 <button style="height:28px;width: 60px;vertical-align: middle;margin-left:20px" (click)="AddBCode()">Add</button>
              </div>
               <Table id="BlueHeaderResizableTable" style="margin-left:5px">
                 <div style="height:30px;width:800px;">
           <tr>
            <th style="width:150px">Barcode</th>
            <th style="width:50px">Unit</th>
            <th style="width:100px">Price</th>
            <th style="width:100px">Supplier</th>
            <th style="width:100px">Expiry Date</th>
            <th style="width:100px" *ngIf="AppSettings.GblDivisionWiseBarcodeListing==1">Division</th>
            <th style="width:120px">Remarks</th>
            <th></th>
            </tr>
            </div>
             <div style="height:150px;width:800px;overflow:auto;scrollbar-3dlight-color:#FFFFFF;scrollbar-arrow-color:#000000;scrollbar-base-color:#FF9999;scrollbar-darkshadow-color:#000000;scrollbar-face-color:#000000;scrollbar-highlight-color:#000000;scrollbar-shadow-color:#0033CC;">
            <tr *ngFor="let b of PBarCodeCollection;let i=index;">
                <td style="width:150px">{{b.BCODE}}</td>
                <td style="width:50px">{{b.UNIT}}</td>
                <td style="width:100px">{{b.SRATE | number : '1.2-2'}}</td>
                <td style="width:100px">{{b.SupplierAccount.ACNAME}}</td>
                <td style="width:100px">{{b.EXPIRY}}</td>
                <td *ngIf="AppSettings.GblDivisionWiseBarcodeListing==1" style="width:100px">{{b.Division.NAME}}</td>
                <td style="width:120px">{{b.REMARKS}}</td>
                <td><button class="glyphicon glyphicon-remove" (click)="removeMSLevel(i)">
                </button>
                <button class="glyphicon glyphicon-edit" (click)="editMSLevel(i)">
                </button></td>
                </tr>
                </div>
        </Table>`,
  styleUrls: ["../../../Style.css"],
})

export class BarcodeTabComponent {
  @ViewChild('smBarcode') public smBarcode: ModalDirective;
  @Input() productObj: Product = <Product>{};
  @Input() AppSettings: AppSettings;
  PBarCode: TBarcode = <TBarcode>{};
  @Input() PBarCodeCollection: TBarcode[] = [];
  BCodeDetails: BarcodeDetail[] = [];
  SupplierList: TAcList[] = [];
  DivisionList: IDivision[] = [];
  Units: any[] = [];

  constructor(private masterService: MasterRepo, private setting: SettingService) {
    try {
      this.AppSettings = this.setting.appSetting;
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  ngOnInit() {
    try {
      this.PBarcodeInitialize();
      this.masterService.getUnits().subscribe(res => { this.Units.push(<any>res); });
      // this.masterService.getSupplierList().subscribe(res => { this.SupplierList=res; });
      this.masterService.getDivisions().subscribe(res => { this.DivisionList=res; });
      this.masterService.getBCodeDetails().subscribe(res => { this.BCodeDetails.push(<BarcodeDetail>res); });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  supplierChangeEvent() {
    try {
      this.PBarCode.SUPCODE = this.PBarCode.SupplierAccount.ACID;
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  divChangeEvent() {
    try {
      this.PBarCode.DIV = this.PBarCode.Division.INITIAL;
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  PBarcodeInitialize() {
    try {
      this.PBarCode = <TBarcode>{};
      this.PBarCode.Division = <IDivision>{};
      this.PBarCode.SupplierAccount = <TAcList>{};
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  AddBCode() {
    try {
      if (this.PBarCode.Division == null) { this.PBarCode.Division = <IDivision>{} }
      if (this.PBarCode.SupplierAccount == null) { this.PBarCode.SupplierAccount = <TAcList>{} }
      this.PBarCodeCollection.push(this.PBarCode);
      this.PBarcodeInitialize();
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  removeMSLevel(index) {
    try {
      this.PBarCodeCollection.splice(index, 1);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  editMSLevel(index) {
    try {
      this.PBarCode = this.PBarCodeCollection[index];
      this.PBarCode.Division = this.DivisionList.filter(x => x.INITIAL == this.PBarCode.DIV)[0];
      this.PBarCode.SupplierAccount = this.SupplierList.filter(x => x.ACID == this.PBarCode.SUPCODE)[0];
      this.PBarCodeCollection.splice(index, 1);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  smBarcodeshow() {
    try {
      console.log(this.PBarCodeCollection);
      console.log(this.PBarCode);
      this.BCodeDetails = this.PBarCode.BCodeDetails;
      console.log(this.BCodeDetails);
      this.smBarcode.show();
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  
  smBarcodeSave() {
    try {
      this.PBarCode.BCodeDetails = this.BCodeDetails;
      this.smBarcode.hide();
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
}