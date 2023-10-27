import { Component, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { FileUploaderPopUpSettings, FileUploaderPopupComponent } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';

@Component(
    {
        selector: 'ErpMapConfiguration',
        templateUrl: './ErpMapConfiguration.component.html',

    }
)
export class ErpMapConfigurationComponent {
    @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
    fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();


    constructor(private alertService: AlertService, private transactionService: TransactionService) { }




    showsuppliermapping() {
        if (this.transactionService.userProfile.username.toUpperCase() == "ADMIN" ||this.transactionService.userProfile.username.toUpperCase() == "PATANJALI_USER" || this.transactionService.userProfile.username.toUpperCase() == "PATANJALI_SUPPORT") {
            return true;
        } else {
            return false;
        }
    }
    ERP_BPOS_MAPPING_EXCEL() {
        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
            {
                title: "ERP BPOS Upload",
                sampleFileUrl: `/downloadExcelsFilesBposErpMap`,
                uploadEndpoints: `/uploadExcelsFilesBposErpMap`,
                allowMultiple: false,
                acceptFormat: ".xlsx",
                filename: "ERP_BPOS_MAPPING"
            });
        this.fileUploadPopup.show();
    }
    SUPPLIER_BPOS_MAPPING_EXCEL() {
        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
            {
                title: "Supplier Mapping Upload",
                sampleFileUrl: `/downloadExcelFilesBposSupplierMap`,
                uploadEndpoints: `/uploadExcelsFilesBposSupplierMap`,
                allowMultiple: false,
                acceptFormat: ".xlsx",
                filename: "ERP_SUPPLIER_MAPPING"
            });
        this.fileUploadPopup.show();
    }
    INCENTIVE_BPOS_MAPPING_EXCEL() {
        this.fileUploadPopupSettings = 
            {
                title: "Incentive Slab Mapping Upload",
                sampleFileUrl: `/downloadExcelFilesBposIncentiveSlab`,
                uploadEndpoints: `/uploadExcelsFilesBposIncentiveSlab`,
                allowMultiple: false,
                acceptFormat: ".xlsx",
                filename: "ERP_INCENTIVE_SLAB_MAPPING"
            };
        this.fileUploadPopup.show();
    }
    AUTOCNDN_BPOS_MAPPING_EXCEL() {
        this.fileUploadPopupSettings = 
            {
                title: "AUTO CNDN SD Mapping Upload",
                sampleFileUrl: `/downloadExcelFilesBposcndnsd`,
                uploadEndpoints: `/uploadExcelsFilesBposcndnsd`,
                allowMultiple: false,
                acceptFormat: ".xlsx",
                filename: "ERP_CNDN_SD_MAPPING"
            };
        this.fileUploadPopup.show();
    }

    fileUploadSuccessStatus(event) {
        console.log("sss", event);
        if (event.status == "error") {
            this.alertService.error(event.result._body);
        }
        else if (event.status == "ok") {
            this.alertService.success("Update Successfull...")
        }
        else {
            this.alertService.error(event);
        }
    }
}