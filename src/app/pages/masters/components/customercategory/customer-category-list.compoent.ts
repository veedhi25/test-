import { Component, Injector, ViewChild } from '@angular/core';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from '@angular/router';
import { CustomerCategoryService } from './customer-category.service';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../common/ims-grid/ims-grid.component';
import { AppComponentBase } from '../../../../app-component-base';



@Component({
  selector: 'customer-category-list',
  templateUrl: './customer-category-list.component.html',
})
export class CustomerCategoryListComponent extends AppComponentBase {
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
    view: {
      viewButtonContent: '<i class="fa fa-eye" title="View"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
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
    columns: {
      CATEGORY_NAME: {
        title: 'NAME',
        type: 'Name'
      },
      COMPANYID: {
        title: 'Company',
        type: 'Company'
      },
      DIVISION: {
        title: 'Division',
        type: 'Division'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private router: Router, private service: CustomerCategoryService, public injector: Injector) {
    super(injector);
    this.imsGridSettingsEntity = {

      title: "Customer",
      apiEndpoints: '/getAllCustomerCategoryPaged/',
      pageSize: 10,
      showActionButton: true,
      columns: [
        {
          key: "CATEGORY_NAME",
          title: "Name",
          hidden: false,
          noSearch: false,
          type: "string",
          width: "300px"
        },
        {
          key: "COMPANYID",
          title: "Company",
          hidden: false,
          noSearch: false,
          width: "150px",
          type: "string"
        },
        {
          key: "DIVISION",
          title: "Division",
          hidden: false,
          noSearch: false,
          type: "string",
          width: "100px"
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
    // this.service.getAllCustomerCategory().subscribe((res) => {
    //   this.source.load(res);
    // }, error => {
    //   alert(error);
    // })

  }

  onAddClick(): void {
    try {
      this.router.navigate(["./pages/masters/PartyLedger/customercategoryList/addCategory", { mode: "NEW", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }

  onViewClicked(event) {
    try {
      console.log("view");
      this.router.navigate(["./pages/masters/PartyLedger/customercategoryList/addCategory", { name: event.data.CATEGORY_NAME, mode: "VIEW", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }

  onEditClicked(event): void {
    try {
      this.router.navigate(["./pages/masters/PartyLedger/customercategoryList/addCategory", { name: event.data.CATEGORY_NAME, mode: "EDIT", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }


}
