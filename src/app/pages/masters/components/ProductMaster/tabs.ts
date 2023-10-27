import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Tab } from './tab';

@Component({
    selector: 'tabs',
    template: `
    <ul class="nav nav-tabs" style="margin-left:15px;margin-right:20px">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active" >
        <a style="margin-right:10px">{{tab.title}}</a>
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
export class Tabs implements AfterContentInit {

    @ContentChildren(Tab) tabs: QueryList<Tab>;

    // contentChildren are set
    ngAfterContentInit() {
        try {
            // get all active tabs
            let activeTabs = this.tabs.filter((tab) => tab.active);

            // if there is no active tab set, activate the first
            if (activeTabs.length === 0) {
                this.selectTab(this.tabs.first);
            }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    selectTab(tab: Tab) {
        try {
            // deactivate all tabs
            this.tabs.toArray().forEach(tab => tab.active = false);
            // activate the tab the user has clicked on.
            tab.active = true;
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

}
