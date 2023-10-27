import { Component, OnInit } from '@angular/core';
import { ColumnConfiguration, ColumnField } from '../../dynamicreportparam.component';

@Component({
  selector: 'ims-form-multi-select',
  template: `
    <label>{{ config.label }}</label>
    <angular4-multiselect [data]="config.options" [(ngModel)]="config[config.name]"
                  class="form-control" [settings]="config.multiSelectSetting"
                  (onSelect)="onMultiSelect($event)" (onDeSelect)="onMultiSelect($event)"
                  (onSelectAll)="onMultiSelect($event)" (onDeSelectAll)="onMultiSelect($event)">
                  </angular4-multiselect>
  `
})
export class ImsFormIMultiSelectComponent implements ColumnField {
  config: ColumnConfiguration;



  onMultiSelect = (event) => {

  }


}
