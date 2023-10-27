import { Component, ContentChildren, QueryList, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { PHomeTab } from './PHomeTab';
import { Product } from '../../../../common/interfaces/ProductItem';
@Component({

    selector: 'hometabs',
    template: `
    <ul style="padding:0px">
      <li *ngFor="let tab of ProductHomeTabs;let i=index" [hidden]="!tab.active" style="float:inherit">
         <hometab [active]="tab.active" > 
        
          <productlist *ngIf="tab.name=='productlist'" [source]="source" (searchItemEmit)="searchItemEmitEvent($event)" (activeTabEmit)="activeTabEmitEvent($event)"></productlist>
          <addproductgroup *ngIf="tab.name=='addgroup'" [tab]="tab" [productObj]="productObj" (activeTabEmit)="activeTabEmitEvent($event)"></addproductgroup>     
          <addproductmaster *ngIf="tab.name=='addproduct'" [productObj]="productObj" [tab]="tab" [ProductHomeTabs]="ProductHomeTabs" (activeTabEmit)="activeTabEmitEvent($event)"></addproductmaster>
          </hometab>

      </li>
    </ul>
    <ng-content></ng-content>
  `,

    styles: [`<style>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333333;
}

li {
    float: left;
    list-style: none;
}

li a {
    display: block;
    color: white;
    text-align: center;
    padding: 5px;
    text-decoration: none;
}

li a:hover {
    background-color: #111111;
    cursor: pointer;
     cursor: hand;
}
</style>`]
})
export class PHomeTabs implements AfterContentInit {

    @ContentChildren(PHomeTab) tabs: QueryList<PHomeTab>;
    @Input('ProductHomeTabs') ProductHomeTabs: Array<any> = [];
    @Input() source;
    @Input() tab;
    @Input() productObj: Product;
    @Output() searchItemEmit = new EventEmitter();
    @Output() activeTabEmit=new EventEmitter();
    // contentChildren are set
    ngAfterContentInit() {
        try {
//if(!this.tabs)return;
            // get all active tabs
       //     let activeTabs = this.tabs.filter((tab) => tab.active);

            // if there is no active tab set, activate the first
        //    if (activeTabs.length === 0) {
          //      this.selectTab(this.tabs.first);
            //}
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    // selectTab(tab: PHomeTab) {
    //     try {
    //          if( !this.tabs && this.tabs.length==0) return;
    //         // deactivate all tabs
    //         this.tabs.toArray().forEach(tab => tab.active = false);
    //         // activate the tab the user has clicked on.
    //         tab.active = true;
    //     } catch (ex) {
    //         console.log(ex);
    //         alert(ex);
    //     }
    // }
    onTabClose(i){
        this.ProductHomeTabs.splice(i,1);
        if(this.ProductHomeTabs.length>0){
        this.ProductHomeTabs[this.ProductHomeTabs.length-1].active=true;
        }}
    searchItemEmitEvent(value) {
        this.searchItemEmit.emit(value);
    }
    activeTabEmitEvent(event){
        this.activeTabEmit.emit(event);
    }
}
