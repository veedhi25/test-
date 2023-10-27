import { Component, OnInit } from '@angular/core';
import { ColumnConfiguration, ColumnField } from '../../dynamicreportparam.component';

@Component({
  selector: 'ims-form-input',
  template: `
    <label>{{ config.label }}</label>
    <input class="form-control"
        type="text"
        [attr.placeholder]="config.placeholder"
        [(ngModel)]="config[config.name]">


  `
})
export class ImsFormInputComponent implements ColumnField {
 config : ColumnConfiguration;
  

}
