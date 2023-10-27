import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Product } from '../../../../common/interfaces/ProductItem';
import { SettingService, AppSettings } from "../../../../common/services/index";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { ProductMasterService } from './ProductMasterService';
import { Warehouse } from '../../../../common/interfaces/TrnMain';
import { ModalDirective } from 'ng2-bootstrap'

@Component({
    selector: "addproductgroup",
    template: `
    <div class="modal fade" bsModal #childModal="bs-modal" style="top:0" [config]="{backdrop: 'static'}" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" aria-label="Close" (click)="hideChildModal()">
          <span aria-hidden="true">&times;</span>
          
        </button>
                        <h4 class="modal-title">Information</h4>
                    </div>
                    <div class="modal-body">
                        {{DialogMessage}}
                    </div>
                    <!--<div class="modal-footer">
                        <button class="btn btn-info confirm-btn" (click)="hideChildModal()">Save changes</button>
                        <button class="btn btn-info confirm-btn" type="button" (click)=onsubmit()>Save</button>
                    </div>!-->

                </div>
            </div>
        </div>
     <div style="margin-top:-32px">
        <ba-card title="Add Product Group" baCardClass="with-scroll">
    
    <form class="form-horizontal">
  <div class="form-group row">
    <label for="MG"  class="col-sm-4 col-md-4 form-control-label" style="width:190px">Major Group</label>
    <div class="col-sm-8 col-md-8">
       <input type="text" id="MG" name="MG" style="width:inherit" [(ngModel)]="productObj.MajorGroup.DESCA" readonly placeholder="Major Group Generate from tree">
    </div>
  </div>
  <div class="form-group row">
    <label for="PG" class="col-sm-4 form-control-label"  style="width:190px">Product Group</label>
    <div class="col-sm-8">
       <input type="text" id="PG" name="PG" style="width:inherit" [(ngModel)]="productObj.Par.DESCA" readonly placeholder="Product Group Generate From Tree">
    </div>
  </div>
   <div class="form-group row" *ngIf="productObj.PARENT=='MI'"> 
    <label for="GC" class="col-sm-4 form-control-label" style="width:190px" >Group Code</label>
    <div class="col-sm-8">
       <input type="number" id="GC" name="GC" style="width:inherit" [(ngModel)]="productObj.FCODE"  placeholder="Group Code">
    </div>
  </div>
   <div class="form-group row">
    <label for="GN"  class="col-sm-4 form-control-label" style="width:190px">Group Name</label>
    <div class="col-sm-8">
       <input type="text" id="GN" name="GN" style="width:inherit" [(ngModel)]="productObj.DESCA"  placeholder="Group Name">
    </div>
  </div>
   <div class="form-group row">
    <label for="RMG" class="col-sm-4 form-control-label" style="width:190px">Recommended Margin (%)</label>
    <div class="col-sm-8">
       <input type="text" id="RMG" name="RMG" style="width:inherit" [(ngModel)]="productObj.RECRATE"  placeholder="Recommended Margin (%)">
    </div>
  </div>
   <div class="form-group row">
    <label for="C" class="col-sm-4 form-control-label" style="width:190px">Category</label>
    <div class="col-sm-8">
       <select id="C" name="C" [(ngModel)]="productObj.MCAT" style="width:inherit" >
          <option *ngFor="let mc of MCatList" [ngValue]="mc.MENUCAT">{{mc.MENUCAT}}</option></select>
    </div>
  </div>
   <div class="form-group row" *ngIf="AppSettings.GblEnableMCat1==1">
    <label for="C" class="col-sm-4 form-control-label" style="width:190px">Category 1</label>
    <div class="col-sm-8">
       <select id="C" name="C" [(ngModel)]="productObj.MCAT1" style="width:inherit" >
         <option *ngFor="let mc1 of MCat1List" [ngValue]="mc1">{{mc1}}</option></select>
    </div>
  </div>
   <div class="form-group row" *ngIf="AppSettings.GblItemWiseWarehouse!=0">
    <label for="W" class="col-sm-4 form-control-label" style="width:190px">Warehouse</label>
    <div class="col-sm-8">
       <select id="W" name="W" [(ngModel)]="productObj.WHOUSE" style="width:inherit" >
        <option *ngFor="let w of WarehouseList" [ngValue]="w.NAME">{{w.NAME}}</option></select>
    </div>
  </div>
 
  <div class="form-group row">
    <div class="offset-sm-3 col-sm-9">
      <button type="submit " class="btn btn-info" (click)="onSave()" [disabled]="(productObj.PARENT=='MI' && (productObj.FCODE==null ||productObj.FCODE<0)) || productObj.DESCA==null || productObj.DESCA==''">Save</button>
     <button type="button " class="btn btn-info " (click)=onCancel()>Cancel</button>
    </div>
  </div>
</form>
</ba-card>
</div>
    `,
    styleUrls: ["../../../Style.css", './modals.scss'],
    providers: [ProductMasterService],
})

export class AddProductGroupComponent {
    @ViewChild('childModal') childModal: ModalDirective;
    @Input() tab: any = <any>{};
    @Input() ProductHomeTabs: any[];
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    modeTitle: string = '';
    @Input() productObj: Product = <Product>{};
    WarehouseList: Warehouse[] = [];
    MCatList: any[] = [];
    MCat1List: any[] = [];
    AppSettings: AppSettings;

    @Output() activeTabEmit = new EventEmitter();
    constructor(private ProductService: ProductMasterService, private masterService: MasterRepo, private router: Router, private activatedRoute: ActivatedRoute, private setting: SettingService) {
        try {
            this.AppSettings = this.setting.appSetting;
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    ngOnInit() {
        try {
            this.masterService.getWarehouseList().subscribe(res => { this.WarehouseList.push(<Warehouse>res); });
            this.masterService.getMCatList().subscribe(res => { this.MCatList.push(<any>res); });
            //  this.masterService.getMCat1List().subscribe(res=>{this.MCat1List.push(<any>res); });

            this.productObj.Par = <Product>{};
            this.productObj.MajorGroup = <Product>{};
            if (!!this.activatedRoute.snapshot.params['returnUrl']) {
            }
            //getting parent and majorgroup for new product group insert
            // if (!!this.activatedRoute.snapshot.params['SI']) {
            //     var selectedGMcode = this.activatedRoute.snapshot.params['SI'];

            if (this.tab.mode == "add") {
                if (this.tab.selectedNode == null || this.tab.selectedNode.id == null) {
                    this.productObj.PARENT = 'MI';
                    return;
                }
                this.ProductService.getInitialValuesForNewProduct(this.tab.selectedNode.id)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            this.productObj.Par = <Product>data.result.parent;
                            this.productObj.MajorGroup = <Product>data.result.majorgroup;
                            this.productObj.PARENT = this.productObj.Par.MCODE;

                            if (this.productObj.MajorGroup == null) { this.productObj.MajorGroup = <Product>{}; }
                        }
                    }
                    , error => {
                        // this.router.navigate([this.returnUrl]);
                        this.masterService.resolveError(error, "addproductGroup (ProductMaster) - getInitialValuesForNewProduct");
                        console.log(error);
                    }
                    );
            }
            else if (this.tab.mode == "edit") {
                console.log('Here I am Edit Product');
                this.ProductService.getProductForEdit(this.tab.selectedEditNode.id)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            this.productObj = data.result;
                            this.productObj.Par = data.result.Parent;
                            if(this.productObj.Par==null){this.productObj.Par=<any>{};}
                            // this.productObj.MajorGroup = data.result.MajorGroup;
                            // this.productObj.FCODE = data.result.FCODE;
                            // this.productObj.DESCA = data.result.DESCA;
                            // this.productObj.RECRATE = data.result.RECRATE;
                            // this.productObj.MCAT = data.result.MCAT;
                            // this.productObj.MCAT1 = data.result.MCAT1;
                            // this.productObj.WHOUSE = data.result.WHOUSE;
                            // this.productObj.PARENT=data.result.PARENT;
                            // this.productObj.MCODE=data.result.MCODE;
                            // this.productObj.MENUCODE=data.result.MENUCODE;
                            this.mode = 'edit';
                            this.modeTitle = "Edit Product";
                            //  this.initialTextReadOnly = true;
                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in Product";
                            // this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Product";
                        this.masterService.resolveError(error, "addproducts (ProductMaster) - getProductForEdit");
                    }
                    );
            }

        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    onSave() {
        this.DialogMessage = "Saving Data please wait..."
        this.childModal.show();
        try {
            console.log("saving productgroup");
            if (this.tab.mode == "add") {
                this.productObj.LEVELS = (this.productObj.Par.LEVELS == null ? 0 : this.productObj.Par.LEVELS) + 1;
            }

            this.productObj.TYPE = "G";
            this.productObj.MGROUP = this.productObj.MajorGroup.MCODE;
            let P:any=this.productObj;
            P.Parent=null;
            // this.subcriptions.push(sub);
        }
        catch (e) {
            alert(e);
        }
    }
    onCancel() {
        try {
            this.routeToHome();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    routeToHome(savedValue = null, mode = null) {
        let homeTab: any = <any>{};
        // homeTab.id = UUID.UUID();
        homeTab.name = 'productlist';
        homeTab.selectedNode = this.tab.selectedNode;
        homeTab.active = true;
        homeTab.mode = mode;
        homeTab.from = "group";
        homeTab.savedValue = savedValue;
        this.activeTabEmit.emit(homeTab);
    }
}