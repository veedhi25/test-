import { Component, Input, OnChanges, OnInit } from "@angular/core";

@Component({
    exportAs: 'dynamicForm',
    selector: 'dynamicreportparam',
    template: '<div><ng-container *ngFor="let field of config;" imsdynamicField [config]="field"></ng-container></div>',
    styleUrls: ['./dynamicreportparam.component.scss']
})



export class DynamicReportParam implements OnChanges, OnInit {


    @Input() config: ColumnConfiguration[] = [];
    constructor() { }

    ngOnInit() {

    }
    ngOnChanges(changes) {
        this.config.forEach(column => {
            column[column.name] = column.value ? column.value : this.getDefaultValuesForInputType(column.type)
        })
    }



    getDefaultValuesForInputType = (inputType: string): any => {
        if (inputType.toLowerCase() == "multiselect") {
            return [];
        } else {
            return ''
        }
    }

}






export interface ColumnField {
    config: ColumnConfiguration,
}



export interface ColumnConfiguration {
    disabled?: boolean,
    label?: string,
    name: string,
    options?: string[],
    placeholder?: string,
    type: string,
    value?: any,
    inputname?: string,
    inputid?: string,
    cssClass?: string,
    apiEndPoint?: string,
    multiSelectSetting?: any;
}