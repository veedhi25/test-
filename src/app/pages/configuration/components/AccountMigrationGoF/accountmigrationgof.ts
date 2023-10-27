import { Component, ViewChild, Output, ElementRef } from '@angular/core';
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
@Component(
  {
    selector: 'accountmigrationgof',
    templateUrl: './accountmigrationgof.html',
    styleUrls: ["../../../modal-style.css", "./../../../../common/Transaction Components/_theming.scss"],
   
  }
)
export class AccountMigrationComponent
 {
    @ViewChild("fileSelect") fileSelector_Import: ElementRef;

	@ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
	fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
    constructor(private masterService: MasterRepo, private authservice: AuthService, private _activatedRoute: ActivatedRoute,private sanitizer: DomSanitizer, private alertService: AlertService,
        private loadingService: SpinnerService)
        {

        }

        Migration(tag)
        {
        
            this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Account Ledger",
				uploadEndpoints: `/accountMigrationofgofrugal/`+tag,
				allowMultiple: false,
				acceptFormat: ".xlsx"
			});
		this.fileUploadPopup.show();
        }
        UpdateBatch()
        {
            this.masterService.updatebatchMigration().subscribe(res => {
                if (res.status == "ok") {
                   this.alertService.success("success");
                }
                else {
                    this.alertService.error(res);
                   // alert("Failed "+res);
                    console.log(res);
                }
            },error=>
            {
                this.alertService.error(error);
                console.log(error);
            });;
        }
        fileUploadSuccessStatus(event)
        {
            console.log("sss",event);
            if(event.status=="error")
            {
                this.alertService.error(event.result);
            }
            else if(event.status=="ok")
            {
                this.alertService.success("Data Migration Successfull...")
            }
            else{
                this.alertService.error(event);
            }
        }
 }