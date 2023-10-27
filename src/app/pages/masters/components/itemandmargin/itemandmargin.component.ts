import { Component, ViewChild } from '@angular/core';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { FileUploaderPopUpSettings, FileUploaderPopupComponent } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';

@Component(
  {
    selector: 'itemandmargin',
    templateUrl: './itemandmargin.component.html',

  }
)
export class ItemAndMarginComponent
 {
    @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
    fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
    

constructor(private alertService: AlertService){}

    ERP_BPOS_MAPPING_EXCEL()
    {
        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
        {
            title: "Item Master Upload",
            sampleFileUrl : `/downloadExcelFileitemMasterRuchiSoya`,  
            uploadEndpoints: `/masterImport/itemMasterRuchiSoya/nothing`,
            allowMultiple: false,
            acceptFormat: ".xlsx",
            filename:"RUCHISOYA_ItemMaster"
        });
    this.fileUploadPopup.show();
    }

    fileUploadSuccessStatus(event)
    {
        if(event.status=="error")
        {
            this.alertService.error(event.result);
        }
        else if(event.status=="ok")
        {
            this.alertService.success("Update Successfull...")
        }
        else{
            this.alertService.error(event);
        }
    }





    STOREOPENINGINFO() {
        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
            {
                title: "Margin Upload",
                sampleFileUrl: `/downloadExcelFilemarginRuchiSoya`,
                uploadEndpoints: `/marginRuchiSoya`,
                allowMultiple: false,
                acceptFormat: ".xlsx",
                filename: "RUCHISOYA_Margin"
            });
        this.fileUploadPopup.show();
    }


 }