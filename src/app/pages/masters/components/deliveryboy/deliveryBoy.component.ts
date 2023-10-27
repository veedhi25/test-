import { Component, Injector, ViewChild } from '@angular/core';
import { AuthService } from "../../../../common/services/permission/authService.service";
import 'style-loader!./smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table';
import { AppComponentBase } from '../../../../app-component-base';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../common/ims-grid/ims-grid.component';



@Component({
  selector: 'deliveryBoyList',
  templateUrl: './deliveryBoy.component.html',
  //   providers: [AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class DeliveryBoyComponent extends AppComponentBase {
  @ViewChild("accountGenericGrid") genericGrid: IMSGridComponent;
  PType: string;
  imsGridSettingsEntity: IMSGridSettings = new IMSGridSettings();
  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    // view: {
    //   viewButtonContent: 'View',
    //   saveButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: ' ',
      confirmDelete: true
    },
    columns: {
      ACNAME: {
        title: 'Name',
        type: 'string'
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private masterService: MasterRepo, private router: Router, public injector: Injector) {
    super(injector);
    this.imsGridSettingsEntity = {

      title: "Customer",
      apiEndpoints: '/DeliveryBoyPagedList/',
      pageSize: 10,
      showActionButton: true,
      columns: [
        {
          key: "ACNAME",
          title: "Name",
          hidden: false,
          noSearch: false,
          type: "string",
          width: "300px"
        },

      ],
      actionKeys: [
        {
          text: "Edit",
          title: "Edit",
          icon: "fa fa-edit",
          type: ActionKeyMaster.EDIT,
          hidden: false
        },
        // {
        //     text: "Click to delete customer",
        //     title: "Delete Customer",
        //     icon: "fad fa-trash text-danger",
        //     type: ActionKeyMaster.DELETE
        // },
        {
          text: "View",
          title: "View",
          icon: "fa fa-eye",
          type: ActionKeyMaster.VIEW,
          hidden: false
        },
      ]
    };
    // this.masterService.masterGetmethod_NEW("/DeliveryBoyList").subscribe((res) => {
    //   if (res.status == "ok") {
    //     this.source.load(res.result);
    //   } else {
    //     this.source.load([])
    //   }

    // })
  }


  onAddClick(event): void {
    try {
      this.router.navigate(["./pages/masters/deliveryBoyList/addDeliveryBoy", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }
  onAccountDelete(event): void {
    try {
      if (window.confirm('Are you sure you want to delete?')) {
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    } catch (ex) {
      alert(ex);
    }
  }

  onViewClicked(event): void {
    try {
      this.router.navigate(["./pages/masters/deliveryBoyList/addDeliveryBoy", { ACID: event.data.ACID, mode: "view", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }

  onEditClicked(event): void {
    try {
      this.router.navigate(["./pages/masters/deliveryBoyList/addDeliveryBoy", { ACID: event.data.ACID, mode: "edit", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }


}