import { Component, ViewChild } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

import { Category } from '../../../../common/interfaces/categorymaster.interface';
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';

@Component(
    {
        selector: 'categorymaster',
        templateUrl: './categorymaster.component.html',
        styleUrls: ['./categorymaster.component.scss']
    }
)
export class CategoryMasterComponent {
    activerowIndex: number = 0;
    categoryObj: Category = <Category>{};
    categoryList: Array<Category> = [];
    catLists: any[] = [];
    userProfile: any = <any>{};
    isHeadoffice: string;
    CNAME: string;
    @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
    fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
    constructor(private masterService: MasterRepo,
        private alertService: AlertService,
        private loadingService: SpinnerService,
    ) {

        this.getInitialValues();
        this.userProfile = this.masterService.userProfile;
        this.isHeadoffice = this.userProfile.CompanyInfo.isHeadoffice;
        this.CNAME = this.userProfile.CompanyInfo.companycode;
    }



    getInitialValues = (): void => {
        this.masterService.masterPostmethod_NEW("/getcategorywiseconfiguration", {}).subscribe((res) => {
            this.catLists = res.result;
        }, error => {

        })
    }

    onSaveClicked = (): void => {
        this.loadingService.show("Saving Data.Please wait.");
        this.masterService.masterPostmethod_NEW("/savecategorywiseconfigurationdetail", this.categoryList).subscribe((res) => {
            this.loadingService.hide();
            this.getInitialValues();
            this.onReset();
        }, err => {
            this.loadingService.hide();
        })

    }


    onBrandChange = (value): void => {
        this.categoryList = [];
        this.catLists.forEach(X => {
            if (X.VARIANTNAME == value) {
                this.categoryList = JSON.parse(X.VARIANTVALUES);
            }
        });

        if (this.categoryList == null) {
            this.categoryList = [];
        }
        let currentCatlist = [];
        this.categoryList.forEach(x => {

            currentCatlist.push(this.masterService.nullToZeroConverter(x.CODE));
        })

        if (!currentCatlist.length) {
            this.categoryObj.CODE = "1";
            return;
        }
        this.categoryObj.CODE = `${Math.max(...currentCatlist) + 1}`;



    }

    onReset = (): void => {
        this.categoryObj = <Category>{};
        this.categoryList = [];
    }

    onAddCategory = (): void => {

        if (!this.categoryList) this.categoryList = [];
        if (this.categoryList.some(x => (x.CODE == this.categoryObj.CODE || x.NAME === this.categoryObj.NAME) && x.VARIANTNAME == this.categoryObj.VARIANTNAME)) return;
        this.categoryObj.VARIANTBARCODE = padStart(this.categoryObj.CODE, 3);
        let x = {
            CODE: this.categoryObj.CODE,
            VARIANTBARCODE: this.categoryObj.VARIANTBARCODE,
            ALIASCODE: this.categoryObj.ALIASCODE,
            VARIANTNAME: this.categoryObj.VARIANTNAME,
            NAME: this.categoryObj.NAME
        }
        this.categoryList.push(x);
        this.categoryObj.CODE = null;
        this.categoryObj.NAME = null;
        this.masterService.focusAnyControl("code");
        function padStart(value, length) {
            return (value.toString().length < length) ? padStart("0" + value, length).toString() : value.toString();
        }

        let currentCatlist = [];
        this.categoryList.forEach(x => {

            currentCatlist.push(this.masterService.nullToZeroConverter(x.CODE));
        })

        this.categoryObj.CODE = `${Math.max(...currentCatlist) + 1}`;

    }


    onSynctoCategory = (): void => {
        this.loadingService.show("Syncing items.Please wait.....");
        this.masterService.masterGetmethod_NEW("/syncCategoryParentTochild").subscribe((res) => {
            if (res.status == "ok") {
                this.loadingService.hide();
                this.alertService.info(res.result.message);
            }
            else {
                this.loadingService.hide();
                this.alertService.info(res.result.message);

            }
        }, error => {
            this.loadingService.hide();
            this.alertService.info(error.statusText);


        })
    }




    ImportProductCategoryFromExcel() {
        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
            {
                title: "Import Products Category",
                sampleFileUrl: `/downloadExcelsFiles?filename=RetailerItemVariantDetails`,
                uploadEndpoints: `/masterImport/ItemVariantMaster/nothing`,
                allowMultiple: false,
                acceptFormat: ".xlsx",
                filename: "ItemsCategorySample"
            });
        this.fileUploadPopup.show();
    }

    fileUploadSuccess(uploadedResult) {
        try {
            if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
                return;
            }

            if (uploadedResult.status == "ok") {
                this.alertService.success("Uploaded SucessFul");
            }
            else {
                this.alertService.error(uploadedResult.result);
            }
        } catch (ex) {
            this.alertService.error(ex);
        }
    }


}
