import { Component, ViewChild, Output, ElementRef, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { EwayService, EwayArray } from './Eway.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Ewaypopupcomponent } from './Ewaypopup.component';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { AuthService } from '../../../../common/services/permission';

import * as moment from 'moment';
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import { AppComponentBase } from '../../../../app-component-base';
@Component(
  {
    selector: 'datamigrationgof',
    templateUrl: './dataMigrationGof.html',
    styleUrls: ["../../../modal-style.css", "./../../../../common/Transaction Components/_theming.scss"],

  }
)
export class DataMigrationComponent extends AppComponentBase {
  source1: ServerDataSource;
  ShowUploadButtons: boolean = false;
  settings=<any>{};
  tagList = [{
    'TagNameValue': 'directsales',
    'TagName': 'Sales Migration'
  },
  {
    'TagNameValue': 'directsalesreturn',
    'TagName': 'Sales Return Migration'
  },
  {
    'TagNameValue': 'directpurchase',
    'TagName': 'Purchase Migration'
  },
  {
    'TagNameValue': 'directpurchasereturn',
    'TagName': 'Purchase Return Migration'
  }
  ];
  selectedPhiscalid: string;
  selectedTagName: string = 'directsalesreturn';

  @ViewChild("fileSelect") fileSelector_Import: ElementRef;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
  constructor(public injector: Injector, public masterService: MasterRepo, private authservice: AuthService, private _activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer, private alertService: AlertService,
    private loadingService: SpinnerService) {
    super(injector);
    //console.log('in constructor');
    //console.log(this.tagList);
    try {
      //console.log('in constructortry');
      let apiUrl1 = `${this.apiUrl}/loadupdatedinventory/` + 'directsalesreturn';
      this.source1 = new ServerDataSource(this._http, {
        endPoint: apiUrl1,
        dataKey: "data",
        pagerPageKey: "currentPage",
        pagerLimitKey: "maxResultCount"
      });

      this.settings= {
        mode: "external",
        actions: false,
        columns: {
          'SR date': {
            title: 'SR date'
          },
          'Customer Name': {
            title: 'Customer Name'
          },
          'Customer Code': {
            title: 'Customer Code'
          },
          'Mobile Number': {
            title: 'Mobile Number'
          },
          'Item Code': {
            title: 'Item Code'
          },
          'item name': {
            title: 'item name'
          }
        }
      };
      //console.log(this.source1);
    } catch (ex) {
      //console.log('in constructorcatch');
      this.alertService.error(ex);
    }

  }
  changeSource(event) {
    if (this.selectedTagName == "directpurchase") {
      let settings2 = {
        mode: "external",
        actions: false,
        columns: {
          'BillDate': {
            title: 'SR date'
          },
          'SupplierName': {
            title: 'Supplier Name'
          },
          'SupplierCode': {
            title: 'Supplier Code'
          },
          'MobileNumber': {
            title: 'Mobile Number'
          },
          'ItemCode': {
            title: 'Item Code'
          },
          'item name': {
            title: 'item name'
          }
        }
      };
      this.settings = Object.assign({}, settings2);
    } else if (this.selectedTagName == "directsalesreturn") {
      let settings2 = {
        mode: "external",
        actions: false,
        columns: {
          'SR date': {
            title: 'SR date'
          },
          'Customer Name': {
            title: 'Customer Name'
          },
          'Customer Code': {
            title: 'Customer Code'
          },
          'Mobile Number': {
            title: 'Mobile Number'
          },
          'Item Code': {
            title: 'Item Code'
          },
          'item name': {
            title: 'item name'
          }
        }
      };
      this.settings = Object.assign({}, settings2);
    } else if (this.selectedTagName == "directsales") {
      let settings2 = {
        mode: "external",
        actions: false,
        columns: {
          'BillDate': {
            title: 'SR date'
          },
          'CustomerName': {
            title: 'Customer Name'
          },
          'CustomerCode': {
            title: 'Customer Code'
          },
          'MobileNumber': {
            title: 'Mobile Number'
          },
          'ItemCode': {
            title: 'Item Code'
          },
          'item name': {
            title: 'item name'
          }
        }
      };
      this.settings = Object.assign({}, settings2);
    }
    if (this.selectedTagName == "directpurchasereturn") {
      let settings2 = {
        mode: "external",
        actions: false,
        columns: {
          'PRDate': {
            title: 'PR date'
          },
          'SupplierName': {
            title: 'Supplier Name'
          },
          'SupplierCode': {
            title: 'Supplier Code'
          },
          'MobileNumber': {
            title: 'Mobile Number'
          },
          'ItemCode': {
            title: 'Item Code'
          },
          'item name': {
            title: 'item name'
          }
        }
      };
      this.settings = Object.assign({}, settings2);
    } 
    let apiUrl1 = `${this.apiUrl}/loadupdatedinventory/` + this.selectedTagName;
    this.source1 = new ServerDataSource(this._http, {
      endPoint: apiUrl1,
      dataKey: "data",
      pagerPageKey: "currentPage",
      pagerLimitKey: "maxResultCount"
    });
  }
  Migration(tag) {

    // if(this.selectedPhiscalid==null || this.selectedPhiscalid=='')
    // {
    //     this.alertService.warning("Please select Phiscal year first");
    //     return;
    // }
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Product Upload",
        uploadEndpoints: `/datamigrationofgofrugal/` + tag + '?phiscalid=' + this.selectedPhiscalid,
        sampleFileUrl: `/downloadExcelsFiles?filename=`+tag,
        allowMultiple: false,
        acceptFormat: ".xlsx",
        filename: 'datamigration_' + tag
      });
    this.fileUploadPopup.show();
  }
  UpdateBatch() {
    this.masterService.updatebatchMigration().subscribe(res => {
      if (res.status == "ok") {
        this.alertService.success("success");
      }
      else {
        this.alertService.error(res);
        // alert("Failed "+res);
        console.log(res);
      }
    }, error => {
      this.alertService.error(error);
      console.log(error);
    });;
  }
  fileUploadSuccessStatus(event) {
    if (event.status == "error") {
      this.alertService.error(event.result);
    }
    else if (event.status == "ok") {
      this.alertService.success("Data Migration Successfull...")
    }
    else {
      this.alertService.error(event);
    }
  }

  
}
