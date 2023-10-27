import { Component, Injector, ViewChild } from '@angular/core';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { AppComponentBase } from '../../../../app-component-base';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../common/ims-grid/ims-grid.component';

@Component({
  selector: "transferPLedgertable",
  templateUrl: "transferpartyledgertable.component.html",
})
export class TransferPartyLedgerTableComponent extends AppComponentBase {
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
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '',
      confirmDelete: true
    },
    columns: {
      ACNAME: {
        title: 'NAME',
        type: 'string'
      },
      shortname: {
        title: 'Short Name',
        type: 'string'
      },
      ACCODE: {
        title: 'SAPCODE',
        type: 'string'
      },
      Address: {
        title: 'ADDRESS',
        type: 'string'
      },
      GSTNO: {
        title: 'GST No',
        type: 'string'
      },

      ISACTIVE: {
        title: 'STATUS',
        type: 'string',
        valuePrepareFunction: (value) => { return value == true ? 'Active' : 'InActive'; },
        filter: {
          type: 'list',
          config: {
            selectText: 'Show all',
            list: [
              { value: true, title: 'Active' },
              { value: false, title: 'InActive' },
            ]
          }
        }
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private router: Router, public masterService: MasterRepo, public injector: Injector) {
    super(injector);
    this.getInterCompanyTransferPartyList();
    this.imsGridSettingsEntity = {

      title: "Customer",
      apiEndpoints: '/getInterCompanyTransferPartyPagedList/',
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
        {
          key: "shortname",
          title: "Short Name",
          hidden: false,
          noSearch: false,
          width: "150px",
          type: "string"
        },
        {
          key: "ACCODE",
          title: "SAPCODE",
          hidden: false,
          noSearch: false,
          type: "string",
          width: "100px"
        },
        {
          key: "Address",
          title: "ADDRESS",
          hidden: false,
          noSearch: false,
          type: "string",
          width: "100px"
        },
        {
          key: "GSTNO",
          title: "GST No",
          hidden: false,
          noSearch: false,
          type: "string",
          width: "100px"
        },
        {
          key: "ISACTIVE",
          title: "STATUS",
          hidden: false,
          noSearch: false,
          width: "100px",
          type: "list",
          valuePrepareFunction: (value) => {
            return value == 1 ? "Active" : "Inactive";
          },
          filter: {
            list: [
              {
                value: 1,
                title: "Active"
              },
              {
                value: 0,
                title: "InActive"
              }
            ]
          }
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
  }

  setMode() {
    try {

    } catch (ex) {
      alert(ex);
    }
  }




  getInterCompanyTransferPartyList() {
    let data: Array<any> = [];
    this.masterService.getInterCompanyTransferPartyList().subscribe(res => {
      if (res.status == "ok") {
        data = res.result;
        this.source.load(data);
      }
    });
  }
  onAddClick(): void {
    try {
      this.router.navigate(["./pages/masters/tPartyLedger/tCustomer"]);
    } catch (ex) {
      alert(ex);
    }
  }




  onEditClicked(event) {

    try {

      let acid = event.data.ACID;
      this.router.navigate(["./pages/masters/tPartyLedger/tCustomer", { mode: "EDIT", ACID: acid }]);
    } catch (ex) {
      alert(ex);
    }
  }
  onViewClicked(event) {

    try {

      let acid = event.data.ACID;
      this.router.navigate(["./pages/masters/tPartyLedger/tCustomer", { mode: "VIEW", ACID: acid }]);
    } catch (ex) {
      alert(ex);
    }
  }

}
