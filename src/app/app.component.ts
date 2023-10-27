import { Component } from '@angular/core';

import { GlobalState } from './global.state';
import { BaThemePreloader, BaThemeSpinner } from './theme/services';
import { Http } from '@angular/http'
import 'style-loader!./app.scss';
import 'style-loader!./theme/initial.scss';






/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {

  isMenuCollapsed: boolean = false;
  constructor(private _state: GlobalState,
    private _spinner: BaThemeSpinner,
    private http: Http) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this.http.get("/appConfig.json")
      .map(res => res.json())
      .subscribe(data => {
        this._state.setGlobalSetting("apiUrl", [data.apiUrl])
        this._state.setGlobalSetting("imageServer", [data.imageServer])
      }, () => {
        //this._state.setGlobalSetting("apiUrl", ["http://appretailer.sahakari.patanjaliayurved.org/retailerposmain/api"])
        this._state.setGlobalSetting("apiUrl", ["http://localhost:8020/api"])

      });

    // this.startTimer();
  }

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then(() => {
      this._spinner.hide();
    });
  }

}
