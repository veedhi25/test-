import { Injector, ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ServerDataSource } from '../../../../../node_modules/ng2-smart-table/';
import { BehaviorSubject, Observable } from "rxjs";
import { AppComponentBase } from "../../../../../app-component-base";

import { Loyalty } from "../../../../../common/interfaces/loyalty.interface";
import { MasterRepo } from "../../../../../common/repositories";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../../common/popupLists/file-uploader/file-uploader-popup.component";

@Component({
  templateUrl: './loyalty-list.component.html'
})
export class LoyaltyListComponent extends AppComponentBase {
  source: ServerDataSource;
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();
  loyaltyList: Loyalty[];
  viewLoyalty = false;
  view: boolean[] = [false];
  categoryList: any;

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

  constructor(public injector: Injector, private _router: Router, private masterService: MasterRepo, private loadingService: SpinnerService, private alertService: AlertService) {
    super(injector);
    try {
      let apiUrl = `${this.apiUrl}/getAllLoyalty`;
      this.source = new ServerDataSource(this._http,
        {
          endPoint: apiUrl,
          dataKey: "data",

        });
    }
    catch (ex) {
      alert(ex);
    }

  }

  ngOnInit() {
    this.fileUploadPopupSettings = {
      title: "Import Loyalty",
      uploadEndpoints: `/masterImport/Loyalty/nothing`,
      sampleFileUrl: `/downloadSampleFile/loyalty`,
      allowMultiple: false,
      acceptFormat: ".csv",
      filename: 'Loyalty'
    };
  }





  onLoyaltyImport() {
    this.fileUploadPopup.show();
  }

  viewRange(i: number) {
    this.view[i] = !this.view[i];
  }

  onAddClick() {
    try {
      this._router.navigate(["pages/masters/utility/loyalty/add-loyalty", { mode: "add", returnUrl: this._router.url }])
    }
    catch (ex) {
      alert(ex);

    }

  }

  onViewLoyalty() {
    this.loadingService.show("Please wait...");
    try {
      this.masterService.masterGetmethod('/getAllLoyalty').subscribe(
        (res) => {
          this.loadingService.hide();
          if (res.status == "ok") {
            if (res.result != null) {

              this.loyaltyList = res.result;
              this.viewLoyalty = true
            }
            else {
              this.alertService.error("no loyalty available");
              this.loyaltyList = res.result;
              this.viewLoyalty = false
            }
          }
        },
        (error) => {
        }
      );

    }
    catch (error) {
    }
  }

  EditLoyalty(event) {
    this._router.navigate(["pages/masters/utility/loyalty/add-loyalty", { mode: "edit", returnUrl: this._router.url, LCODE: event }])

  }
  DeleteLoyalty(LCODE) {
    this.masterService.masterGetmethod(`/deleteLoyalty/?lcode=${LCODE}`).subscribe(
      res => {
        if (res.status == "ok") {
          alert(res.message);
          this.onViewLoyalty();
        }
        else {
          alert(res.message);
        }
      },
      error => {
        alert(error);
      },
      () => {

      }

    );
  }

  fileUploadSuccessStatus(response) {
    if (response.status == "ok") {
      this.alertService.success(`Uploaded successfully.${response.result.result}`);
    } else {
      let abc = JSON.parse(response.result._body)
      this.alertService.error(abc.result)
    }
  }
}






