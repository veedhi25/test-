import { Component, Input, ViewChild } from '@angular/core';
import { Model, Brand } from '../../../../common/interfaces/ProductItem';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { ProductMasterService } from './ProductMasterService';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: "bmtab",
  template: ` <div class="row" style="margin-left:5px">
    <label >Brand</label>
    <select  style="width:150px" [(ngModel)]="SelectedBrand" (ngModelChange)="BrandChangeEvent(SelectedBrand)">
      <option *ngFor="let bl of BrandList" [ngValue]="bl">{{bl.BrandName}}</option>
    </select>
    <button    style="height:28px;width: 26px;vertical-align: middle" (click)="smBrand.show()">+</button>
</div>
<div bsModal #smBrand="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close" aria-label="Close" (click)="smBrand.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Add Brand</h4>
      </div>
      <div class="modal-body">
       <label >Brand Name</label>
       <input style="width:130px" type="text" [(ngModel)]="BName">
      </div>
      <div class="modal-footer">
        <button class="btn btn-info confirm-btn" (click)="SaveBrand(BName)" [disabled]="BName==null || BName==''">Save </button>
      </div>
    </div>
  </div>
</div>
<div class="row" style="margin-left:5px">
    <label >Model</label>
    <select  style="width: 150px" [(ngModel)]="SelectedModel">
      <option *ngFor="let ml of ModelList" [ngValue]="ml">{{ml.ModelName}}</option>
    </select>
    <button  style="height:28px;width: 26px;vertical-align: middle" (click)="smModel.show()">+</button>
    <button style="height:28px;width: 60px;vertical-align: middle;margin-left:20px" (click)="AddBM(SelectedBrand,SelectedModel)" [disabled]="SelectedModel.ModelId==null">Add</button> 
</div>
<div bsModal #smModel="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close" aria-label="Close" (click)="smModel.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Add Model</h4>
      </div>
      <div class="modal-body">
        <label >Brand Name</label>
     <select  style="width:130px" [(ngModel)]="SelectedDialogBrand">
      <option *ngFor="let bl of BrandList" [ngValue]="bl.BrandId">{{bl.BrandName}}</option>
    </select>
        <label >Model Name</label>
       <input style="width:130px" type="text" [(ngModel)]="MName">
      </div>
      <div class="modal-footer">
        <button class="btn btn-info confirm-btn" (click)="SaveModel(MName,SelectedDialogBrand)" [disabled]="SelectedDialogBrand==null|| MName==null || MName==''">Save</button>
      </div>
    </div>
  </div>
</div>
 
   <Table id="BlueHeaderResizableTable" style="margin-left:5px">
                 <div style="height:30px;width:600px;">
           <tr>
            <th style="width:30px">SNo</th>
            <th style="width:200px">Brand</th>
            <th style="width:200px">Model</th>
            <th style="width:50px"></th>
            </tr>
            </div>
             <div style="height:150px;width:600px;overflow:auto;scrollbar-3dlight-color:#FFFFFF;scrollbar-arrow-color:#000000;scrollbar-base-color:#FF9999;scrollbar-darkshadow-color:#000000;scrollbar-face-color:#000000;scrollbar-highlight-color:#000000;scrollbar-shadow-color:#0033CC;">
            <tr *ngFor="let b of BrandModelList;let i=index;">
                <td style="width:30px">{{i+1}}</td>
                <td style="width:200px">{{b.BrandName}}</td>
                <td style="width:200px">{{b.ModelName}}</td>            
                <td style="width:50px"><button class="glyphicon glyphicon-remove" (click)="removeBM(i)">
                </button>
                </td>
                </tr>
                </div>
        </Table>
  `,
  styleUrls: ["../../../Style.css"],
})

export class BrandModelTabComponent {
  @ViewChild('smBrand') public smBrand: ModalDirective;
  @ViewChild('smModel') public smModel: ModalDirective;
  BrandList: Brand[] = [];
  ModelList: Model[] = [];
  AllModelList: Model[] = [];
  @Input() BrandModelList: any[] = [];
  SelectedModel: Model = <Model>{};
  SelectedBrand: Brand = <Brand>{};
  constructor(private masterService: MasterRepo, private productservice: ProductMasterService) { }
  ngOnInit() {
    try {
      this.masterService.getBrandList().subscribe(res => { this.BrandList.push(<Brand>res); });
      this.masterService.getModelList().subscribe(res => { this.AllModelList.push(<Model>res); });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  AddBM(SelectedBrand: Brand, SelectedModel: Model) {
    try {
      if ((this.BrandModelList.filter(x => x.ModelId == SelectedModel.ModelId)).length > 0) { console.log("already exist"); return; }
      this.BrandModelList.push({
        BrandId: SelectedBrand.BrandId,
        BrandName: SelectedBrand.BrandName,
        ModelId: SelectedModel.ModelId,
        ModelName: SelectedModel.ModelName
      });
      console.log("Added");
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  removeBM(index) {
    try {
      this.BrandModelList.splice(index, 1);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  SaveBrand(Brand) {
    try {
      var Br = <Brand>{ BrandName: Brand };
      this.productservice.saveBrand(Br).subscribe(data => {
        if (data.status == 'ok') {
          this.BrandList.push(<Brand>data.result);
          this.smBrand.hide();
        }
      });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  SaveModel(Model, selectBId) {
    try {
      var Br = <Model>{ ModelName: Model, BrandId: selectBId };
      this.productservice.saveModel(Br).subscribe(data => {
        if (data.status == 'ok') {
          this.ModelList.push(<Model>data.result);
          this.smModel.hide();
        }
      });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  BrandChangeEvent(selectedbrand) {
    try {
      this.ModelList = this.AllModelList.filter(x => x.BrandId == selectedbrand.BrandId);
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
}