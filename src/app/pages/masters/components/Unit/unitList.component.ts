import { Component, Injector } from '@angular/core';
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { UnitService } from './unit.service'
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { AppComponentBase } from '../../../../app-component-base';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';

@Component({
  selector: 'UnitListSelector',
  templateUrl: './unitList.component.html',
  providers: [UnitService],
  styleUrls: ["../../../modal-style.css"],
})
export class UnitListComponent extends AppComponentBase{
  router: Router;

  settings = {
    mode: 'external',
    actions: {
      position: 'right'
    },
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    
    edit: {
      editButtonContent: '<i class="fa fa-pencil" title="Edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    pager:{
      display:true,
      perPage:10
    },
    columns: {
      // DESCA: {
      //   title: 'Unit',
      //   type: 'string'
      // },
      UNITS: {
        title: 'Unit',
        type: 'string'
      },

      // UNIT: {
      //   title: 'Unit',
      //   type: 'string'
      // },
    }
  };

  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();


  constructor(public injector : Injector, protected service: UnitService, 
    // private _authService: AuthService,
     router: Router, public dialog: MdDialog) {
       
    super(injector)
    try {
      this.router = router;

      let apiUrl = `${this.apiUrl}/getUnitPagedList`;
      //let apiUrl = `${this.apiUrl}/getAllMenuItemPaged`;
      this.source =  this.source = new ServerDataSource(this._http, 
        { endPoint: apiUrl, 
          dataKey : "data", 
          pagerPageKey : "currentPage",
          pagerLimitKey : "maxResultCount"
        });

      // let data = [];
      // this.masterService.getAllUnitList().subscribe(p => {
      //   data.push(<any>p);
      //   this.source.load(data);
      // }, error => {
      //   var err = error.json();
      //   alert(err);
      // }, () => {
      //   this.masterService._Units = data;
      // })

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
    this.gridPopupSettings = {
      title: "UOM List",
      apiEndpoints: `/getUnitPagedList`,
      defaultFilterIndex: 0,
      columns: [
          {
              key: "UNITS",
              title: "Unit Of measurement",
              hidden: false,
              noSearch: false
          }

      ]
  };
  }

  AddUnit() {
    try {
      this.router.navigate(["./pages/masters/inventory-info/unit-list/add-unit-list", { mode: "add", returnUrl: this.router.url }]);
      // if (this._authService.checkMenuRight("unit-list", "add")) {
        // this.router.navigate(["./pages/masters/unit-list/add-unit-list", { mode: "add", returnUrl: this.router.url }])}
      // } else {
      //   this.messageSubject.next("You are not authorized to Add Unit.");
      //   this.openAuthDialog();
      // }

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      
      this.router.navigate(["./pages/masters/inventory-info/unit-list/add-unit-list", { unitList: event.data.UNITS, mode: "edit", returnUrl: this.router.url }]);
      // if (this._authService.checkMenuRight("unit-list", "edit") == true) {
      // } else {
      //   this.messageSubject.next("You are not authorized to Edit.");
      //   this.openAuthDialog();
      // }

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onViewClick(event): void {
    try {
     this.router.navigate(["./pages/masters/inventory-info/unit-list/add-unit-list", { unitList: event.data.UNITS, mode: "view", returnUrl: this.router.url }]);

      if (this._authService.checkMenuRight("unit-list", "view") == true) {
      } else {
        this.messageSubject.next("You are not authorized to View.");
        this.openAuthDialog();
      }


    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }

}

