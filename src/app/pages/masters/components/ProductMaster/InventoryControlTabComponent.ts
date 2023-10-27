import { Component, Input } from '@angular/core';
import { Product, MultiStockLevel } from '../../../../common/interfaces/ProductItem';
import { Warehouse } from '../../../../common/interfaces/TrnMain';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';

@Component({
    selector: "inventorycontroltab",
    template: `
          <div style="margin-left:5px">
          
            <div style="float:left">
             <fieldset style="width: 310px;height: 250px">
               <div>
                   <label style="width:105px">Re-Order Level :</label>
                   <input type="text" style="width:100px;text-align: right" [(ngModel)]="productObj.ROLEVEL">
                   <input type="text" style="width:50px" [(ngModel)]="productObj.BASEUNIT" readonly>
               </div>
               <div> 
                   <label style="width:105px">Min Stock Level :</label>
                   <input type="text" style="width:100px;text-align: right" [(ngModel)]="productObj.MINLEVEL">
                   <input type="text" style="width:50px" [(ngModel)]="productObj.BASEUNIT" readonly>
               </div>
               <div>
                   <label style="width:105px">Max Stock Level :</label>
                   <input type="text" style="width:100px;text-align: right" [(ngModel)]="productObj.MAXLEVEL">
                   <input type="text" style="width:50px" [(ngModel)]="productObj.BASEUNIT" readonly>
               </div>
               <fieldset style="width: 280px;height: 130px">
               <div style="width:300px">
                   <label style="width: 270px;height: 20px"><input  type="checkbox" style="vertical-align: middle" (change)="$event.target.checked?(productObj.MINWARN=1):(productObj.MINWARN=0)" [checked]="productObj.MINWARN==1">Do not issue stock after Min Stock Level.</label> 
                   <label style="width: 270px;height: 20px"><input  type="checkbox" style="vertical-align: middle" (change)="$event.target.checked?(productObj.ROWARN=1):(productObj.ROWARN=0)" [checked]="productObj.ROWARN==1">Warn when stock reaches Re-Order Level.</label> 
                   <label style="width: 270px;height: 20px"><input  type="checkbox" style="vertical-align: middle" (change)="$event.target.checked?(productObj.MAXWARN=1):(productObj.MAXWARN=0)" [checked]="productObj.MAXWARN==1">Warn when stock reaches Max Stock Level.</label> 
                   <label style="width: 270px;height: 20px"><input  type="checkbox" style="vertical-align: middle" (change)="$event.target.checked?(productObj.ZEROROLEVEL=1):(productObj.ZEROROLEVEL=0)" [checked]="productObj.ZEROROLEVEL==1">Take zero stock as Re-Order Level.</label> 
               </div>
               </fieldset>
                </fieldset>
            </div>
            
            <div style="float:left;width:460px">
               <label style="width: 300px;height: 20px"><input  type="checkbox" style="vertical-align: middle"  [checked]="EnableMultiStockLevel" (change)="WarehouseWiseInventory($event.target.checked)">Enable Warehouse Wise Inventory Control Setting</label> 
               <fieldset *ngIf="EnableMultiStockLevel==true" style="width: 460px;height: 230px">
               <div>
                  <div>
                      <label style="width:105px">Warehouse:</label>
                     <select  style="width:320px" [(ngModel)]="MSLevel.WAREHOUSE">
                     <option *ngFor="let w of WarehouseList" [ngValue]="w.NAME">{{w.NAME}}</option></select>
                  </div>
                   <div>
                     <label style="width:105px">Re-Order Level :</label>
                     <input type="text" style="width:70px;text-align: right" [(ngModel)]="MSLevel.ROLEVEL">
                     <input type="text" style="width:30px" [(ngModel)]="productObj.BASEUNIT" readonly>
                     <label style="width:105px">Min Stock Level :</label>
                     <input type="text" style="width:70px;text-align: right" [(ngModel)]="MSLevel.MINLEVEL">
                     <input type="text" style="width:30px" [(ngModel)]="productObj.BASEUNIT" readonly>
                  </div>
                   <div>
                     <label style="width:105px">Max Stock Level :</label>
                     <input type="text" style="width:70px;text-align: right" [(ngModel)]="MSLevel.MAXLEVEL">
                     <input type="text" style="width:30px" [(ngModel)]="productObj.BASEUNIT" readonly>
                     <button style="height:23px;width: 60px;vertical-align: middle;margin-left:60px" (click)="AddMultiStock()">Add</button>
                  </div>

                   <Table id="BlueHeaderResizableTable">
                    <div style="height:30px;width:450px;">
                      <tr>
                          <th style="width:150px">Warehouse</th>
                         <th style="width:85px">Re-Order</th>
                         <th style="width:85px">Min Stock</th>
                         <th style="width:85px">Max Stock</th>
                         <th></th>
                     </tr>
                     </div>
                      <div style="height:90px;width:450px;overflow:auto;scrollbar-3dlight-color:#FFFFFF;scrollbar-arrow-color:#000000;scrollbar-base-color:#FF9999;scrollbar-darkshadow-color:#000000;scrollbar-face-color:#000000;scrollbar-highlight-color:#000000;scrollbar-shadow-color:#0033CC;">
                     <tr *ngFor="let msl of productObj.MultiStockLevels;let i=index">
                         <td style="width:150px">{{msl.WAREHOUSE}}</td>
                         <td style="width:85px">{{msl.ROLEVEL}}</td>
                         <td style="width:85px">{{msl.MINLEVEL}}</td>
                         <td style="width:85px">{{msl.MAXLEVEL}}</td>
                         <td><button class="glyphicon glyphicon-remove" (click)="removeMSLevel(i)"></button></td>
                     </tr>
                     </div>
                 </Table>
               </div>
                 </fieldset>
            </div>
          
          </div>`,
    styleUrls: ["../../../Style.css"],
})

export class InventoryControlTabComponent {
    @Input() productObj: Product = <Product>{};
    WarehouseList: Warehouse[] = [];
    @Input() EnableMultiStockLevel: boolean = false;
    MSLevel: MultiStockLevel = <MultiStockLevel>{};

    constructor(private masterService: MasterRepo) {

    }

    ngOnInit() {
        try {
            this.masterService.getWarehouseList().subscribe(res => { this.WarehouseList.push(<Warehouse>res); });
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }


    AddMultiStock() {
        try {
            if (this.MSLevel.WAREHOUSE == null || (this.productObj.MultiStockLevels.filter(x => x.WAREHOUSE == this.MSLevel.WAREHOUSE)).length > 0) return;
            if (this.productObj.MultiStockLevels == null) this.productObj.MultiStockLevels = [];
            this.productObj.MultiStockLevels.push(this.MSLevel);
            this.MSLevel = <MultiStockLevel>{};
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    removeMSLevel(index) {
        try {
            this.productObj.MultiStockLevels.splice(index, 1);
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    WarehouseWiseInventory(value: boolean) {
        try {
            if (value == true) { this.EnableMultiStockLevel = true; }
            else {
            this.EnableMultiStockLevel = false;
                this.productObj.MultiStockLevels = [];
            }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
}