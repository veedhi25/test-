import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ServerDataSource } from '../../../../../node_modules/ng2-smart-table/';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { MasterRepo } from '../../../../../common/repositories/masterRepo.service';
import { AppComponentBase } from '../../../../../app-component-base';
import { SpinnerService } from '../../../../../common/services/spinner/spinner.service';
import { ItemPriceChangeService } from './itemPriceChange.service';
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from '../../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { AlertService } from '../../../../../common/services/alert/alert.service';
@Component({
  selector: 'UnitListSelector',
  templateUrl: './itemPriceList.component.html',
  styleUrls: ["../../../../modal-style.css"],
})
export class ItemPriceChangeFormComponent extends AppComponentBase {
  source: ServerDataSource;
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
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      BARCODE: {
        title: 'Barcode',
        type: 'string'
      },
      MENUCODE: {
        title: 'Menu Code',
        type: 'string'
      },
      DESCA: {
        title: 'Item Name',
        type: 'string'
      },
      STAMP: {
        title: 'Updated Time',
        type: 'string'
      }


    }
  };
  constructor(public injector: Injector, private loadingSerive: SpinnerService, private alertService: AlertService,
    public router: Router, public dialog: MdDialog, private masterService: MasterRepo, public service: ItemPriceChangeService) {
    super(injector)
    try {
      let apiUrl = `${this.apiUrl}/getAllMenuItemPaged`;
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
      this.router.navigate(["./pages/masters/item/itempricechange/edit-price", { DESCA: event.data.DESCA, mCode: event.data.MCODE, menuCode: event.data.MENUCODE, mode: "edit", returnUrl: this.router.url }]);

    } catch (ex) {
      alert(ex);
    }
  }
  @ViewChild("fileSelect") fileSelector_Import: ElementRef;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

  updatePriceChange() {
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "update Margin",
        uploadEndpoints: `/masterImport/ItemPriceChange/nothing`,
        allowMultiple: false,
        sampleFileUrl: `/downItemPriceChangeSample`,
        acceptFormat: ".xlsx",
        filename: "BatchPriceChange"
      });

    this.fileUploadPopup.show();
  }

  fileUploadSuccessStatus(response) {
    
    if (response.status == "ok") {
      this.alertService.success(`successfully updated.${response.result.result}`)
    } else {
      let abc = JSON.parse(response.result._body)
      this.alertService.error(abc.result)
    }
  }

}

