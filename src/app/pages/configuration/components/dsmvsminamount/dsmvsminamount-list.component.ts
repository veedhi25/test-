import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '../../../../app-component-base';
import {ServerDataSource} from '../../../../node_modules/ng2-smart-table/'
@Component({
  selector: 'dsmvsminamount-list',
  templateUrl: './dsmvsminamount-list.component.html',
})
export class DSMVsMinAmountListComponent extends AppComponentBase {

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    view: {
      viewButtonContent: '',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '',
      confirmDelete: true
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      DSMCODE: {
        title: 'DSM Code',
        type: 'string'
      },
      DSMNAME: {
        title: 'DSM Name',
        type: 'string'
      },
      MINAMT: {
        title: 'Minimum Amount',
        type: 'string'
      }
    }
  };

  source: ServerDataSource;
  constructor(public injector: Injector, private _router: Router) {
    super(injector)
    try {
      let apiUrl = `${this.apiUrl}/getMasterPagedListOfAny?tag=masterdsmlist`;
      this.source = new ServerDataSource(this._http,
        {
          endPoint: apiUrl,
          dataKey: "data",
          pagerPageKey: "currentPage",
          pagerLimitKey: "maxResultCount"
        });
    } catch (ex) {
      alert(ex);
    }
  }



  onEditClick(event): void {
    try {
      this._router.navigate(["pages/configuration/settings/beatvsmin", { dsmcode: event.data.DSMCODE, mode: "edit", returnUrl: this._router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }



}