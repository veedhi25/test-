import { Component, Input } from '@angular/core';

@Component({
    selector: 'hometab',
    styles: [`
    .pane{
      padding-left: 20px;
      padding-top: 0px;
      padding-right: 0px;
      padding-bottom: 0px;
    }
  `],
    template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class PHomeTab {
    @Input('tabTitle') title: string;
    @Input() active = false;
}