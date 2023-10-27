import {Component, Output, EventEmitter, Input} from '@angular/core';
import { Product } from '../../../../common/interfaces/ProductItem';
import { MasterRepo } from '../../../../common/repositories';
import { ProductMasterService } from './ProductMasterService';

@Component({
    selector: 'category-tab',
    templateUrl: './category-tab.component.html',
    styleUrls: ["../../../Style.css"]
})

export class CategoryTabComponent{
    @Input() productObj: Product = <Product>{};
    MCat1List: any[] = [];
    MCat2List: any[] = [];
    MCat3List: any [] = [];
    categoryName: string = "";
    categoryType: string = "";

    @Output() changecat1Emit = new EventEmitter();
    @Output() changecat2Emit = new EventEmitter();
    @Output() changecat3Emit = new EventEmitter();

    constructor( private masterService: MasterRepo, private ProductService: ProductMasterService ){
        this.masterService.getMCat1List().subscribe( (res) => { 
            this.MCat1List.push(res);
         } )
         this.masterService.getMCat2List().subscribe( (res) => {
             this.MCat2List.push(res);
         } )
         this.masterService.getMCat3List().subscribe( (res) => {
             this.MCat3List.push(res);
         } )

         
    }

    saveCategory() {
        this.ProductService.saveCategory(this.categoryName, this.categoryType).subscribe((res) => {
            if (res.status == "ok") {
                if (this.categoryType.toLowerCase() == "cat1") {
                    this.masterService.getMCat1List().subscribe(res => { this.MCat1List.push(<any>res); });
                } else if (this.categoryType.toLowerCase() == "cat2") {
                    this.masterService.getMCat2List().subscribe(res => { this.MCat2List.push(<any>res); });

                } else {
                    this.masterService.getMCat3List().subscribe(res => { this.MCat3List.push(<any>res); });
                }
                if (document.getElementById("catclosebtn") != null) {
                    document.getElementById("catclosebtn").click();
                }
            }
        }, error => {
            alert(error);
        })
    }

    changecat1(){
        this.changecat1Emit.emit();
    }
    changecat2(){}
    changecat3(){}
}