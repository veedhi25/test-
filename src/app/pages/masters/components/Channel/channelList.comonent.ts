import { Component, Injector } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!./smartTables.scss';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AppComponentBase } from '../../../../app-component-base';
@Component({
  selector: 'ChanneListSelector',
  templateUrl: './channelList.component.html',
  styleUrls: ["../../../modal-style.css"],
})
export class ChannelListComponent extends AppComponentBase{
  router: Router;

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    view: {
      viewButtonContent: 'View',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: 'Edit',
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
      // CHANELID: {
      //   title: 'Id',
      //   type: 'string'
      // },
      ChannelName:{
          title: 'Name',
          type: 'string'
      },
      ChannelType:{
        title: 'ChannelType',
        type: 'string'
    },
      STATUS:{
        title: 'STATUS',
        type: 'string'
    }

    }
  };

  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(public injector : Injector, 
    // private _authService: AuthService,
     router: Router, public dialog: MdDialog, private masterService: MasterRepo) {
    super(injector)
    try {
      this.router = router;

      let apiUrl = `${this.apiUrl}/getAllChanelPagedList`;
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
  }

  AddChanel() {
    try {
      this.router.navigate(["./pages/masters/channel/add-chanel", { mode: "add", returnUrl: this.router.url }]);
      
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["./pages/masters/channel/add-chanel", { ChannelCode: event.data.ChannelCode, mode: "edit", returnUrl: this.router.url }]);
    
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onViewClick(event): void {
    try {
     this.router.navigate(["./pages/masters/channel/add-chanel", { ChannelCode: event.data.ChannelCode, mode: "view", returnUrl: this.router.url }]);


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

