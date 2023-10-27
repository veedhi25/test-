import { Component, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { FileUploaderPopUpSettings, FileUploaderPopupComponent } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';

@Component(
  {
    selector: 'deliveryordertransfer',
    templateUrl: './delivery-order-transfer.component.html',

  }
)
export class DeliveryOrderTransferComponent
 {
    @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
    fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
    

constructor(private alertService: AlertService){}

    ERP_BPOS_MAPPING_EXCEL()
    {
        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
        {
            title: "Delivery Order Transfer Upload",
            sampleFileUrl : `/downloadExcelFileDOT`,  
            uploadEndpoints: `/masterImport/deliveryordertransfer/nothing`,
            allowMultiple: false,
            acceptFormat: ".xlsx",
            filename:"DELIVERY_ORDER_TRANSFER"
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
                title: "Store Opening Info Upload",
                sampleFileUrl: `/downloadExcelFilestoreopening`,
                uploadEndpoints: `/masterImport/storeopeninginfo/nothing`,
                allowMultiple: false,
                acceptFormat: ".xlsx",
                filename: "STORE_OPENING_INFO"
            });
        this.fileUploadPopup.show();
    }


 }