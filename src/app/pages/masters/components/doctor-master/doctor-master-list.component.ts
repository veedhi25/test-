import { Component, Injector } from '@angular/core';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import * as XLSX from 'xlsx';
import _ from "lodash";
import { ViewChild } from '@angular/core';
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { AppComponentBase } from '../../../../app-component-base';
import { ActionKeyMaster, IMSGridComponent, IMSGridSettings } from '../../../../common/ims-grid/ims-grid.component';


@Component({
    selector: 'doctor-master-list',
    templateUrl: './doctor-master-list.component.html',
})


export class DoctorMasterListComponent extends AppComponentBase {
    @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
    @ViewChild("accountGenericGrid") genericGrid: IMSGridComponent;
    imsGridSettingsEntity: IMSGridSettings = new IMSGridSettings();
    fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
    // PType: string;
    // partyName: string;
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
            deleteButtonContent: '',
            confirmDelete: true
        },
        columns: {
            ACID: {
                title: 'ID',
                type: 'string'
            },
            ACNAME: {
                title: 'NAME',
                type: 'string'
            },
            MOBILE: {
                title: 'Mobile',
                type: 'string'
            },

            EMAIL: {
                title: 'Email',
                type: 'string'
            }
        }
    };

    source: LocalDataSource = new LocalDataSource();
    showBulkUpload: boolean = false;
    bulkButtonstatus: boolean = false;
    saveButtonstatus: boolean = false;
    exportButtonstatus: boolean = false;
    arrayBuffer: any;
    mysheetData: any;
    submitBulkUploadButton: boolean = true;
    filesupplierArr: any;
    fileitemArr: any;
    excelFile: string = "";

    constructor(private router: Router, public dialog: MdDialog, public masterService: MasterRepo, private alertService: AlertService, private loadingService: SpinnerService, public injector: Injector) {
        super(injector);
        try {
            this.imsGridSettingsEntity = {

                title: "Customer",
                apiEndpoints: '/getDoctorPagedList/',
                pageSize: 10,
                showActionButton: true,
                columns: [
                    {
                        key: "ACID",
                        title: "ID",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "300px"
                    },
                    {
                        key: "ACNAME",
                        title: "NAME",
                        hidden: false,
                        noSearch: false,
                        width: "150px",
                        type: "string"
                    },
                    {
                        key: "MOBILE",
                        title: "Mobile",
                        hidden: false,
                        noSearch: false,
                        type: "string",
                        width: "100px"
                    },
                    {
                        key: "EMAIL",
                        title: "Email",
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
            // this.masterService.masterGetmethod_NEW("/getDoctorList").subscribe((res) => {
            //     if (res.status == "ok") {
            //         this.source.load(res.result);
            //     } else {
            //         this.source.load([])
            //     }

            // })



        } catch (ex) {
            alert(ex);
        }
    }



    onAddClick(): void {
        try {
            this.router.navigate(["./pages/masters/doctor-master/new", { mode: "add", returnUrl: this.router.url }]);
        } catch (ex) {
            alert(ex);
        }
    }

    onBulkUploadClicked() {
        // this.showBulkUpload = true;
        // this.bulkButtonstatus = true;
        // this.saveButtonstatus = true;

        this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
            {
                title: "Doctor Master",
                sampleFileUrl: ``,
                uploadEndpoints: `/masterImport/Doctor Master/nothing`,
                allowMultiple: false,
                acceptFormat: ".csv"
            });
        this.fileUploadPopup.show();
    }

    onCloseBulk() {
        this.showBulkUpload = false;
        this.bulkButtonstatus = false;
        this.saveButtonstatus = false;
    }

    fileUploadSuccessStatus(response) {
        if (response.status == "ok") {
            this.alertService.success("Upload Successfully")
        }
        else if (response.status == "error" || response.status == "errorfile") {
            this.alertService.error(`Errors:${response.result}`);
        }
        else {
            this.alertService.error("Could not uploaded")
        }
    }

    onFileSelect(event) {
        this.submitBulkUploadButton = true;
        this.mysheetData = [];
        this.fileitemArr = [];
        this.filesupplierArr = [];
        let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            if (!_.includes(af, file.type)) {
                alert('Only EXCEL Docs Allowed!');
            } else {
                //this.importerForm.get('myfile').setValue(file);
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = (e) => {
                    this.arrayBuffer = fileReader.result;
                    var data = new Uint8Array(this.arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary" });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.mysheetData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                    console.log(this.mysheetData);
                    if (this.mysheetData.length > 0) {
                        if (this.mysheetData[0].hasOwnProperty("Supplier") && this.mysheetData[0].hasOwnProperty("ItemName") && this.mysheetData[0].hasOwnProperty("ItemMCODE")) {
                            this.submitBulkUploadButton = false;
                            for (let a = 0; a < this.mysheetData.length; a++) {
                                let supname = this.mysheetData[a].Supplier;
                                let itemcode = this.mysheetData[a].ItemMCODE;
                                if (!this.filesupplierArr.includes(supname)) {
                                    this.filesupplierArr.push(supname);
                                }
                                if (!this.fileitemArr.includes(itemcode)) {
                                    this.fileitemArr.push(itemcode);
                                }
                            }
                            // console.log(this.filesupplierArr);
                            // console.log(this.fileitemArr);
                        } else {
                            this.alertService.error('Excel file does not contain defined format');
                            this.submitBulkUploadButton = true;
                            this.excelFile = "";
                        }

                    } else {
                        this.alertService.error('Choose excel file that contain data');
                        this.submitBulkUploadButton = true;
                        this.excelFile = "";

                    }
                }
            }
        }
    }

    ExportDoctorToExcel() {
        this.masterService.downloadDoctorCSV().subscribe(
            data => {
                this.loadingService.hide();
                this.downloadFile(data);
            },
            error => {
                this.loadingService.hide();
            }
        );
    }
    downloadFile(response: any) {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(response.content);
        element.download = response.filename;
        document.body.appendChild(element);
        element.click();

    }



    onEditClicked(event) {

        try {

            let acid = event.data.ACID
            this.router.navigate(["./pages/masters/doctor-master/new", { mode: "edit", ACID: acid, returnUrl: this.router.url }]);

        } catch (ex) {
            alert(ex);
        }
    }
    onViewClicked(event) {

        try {

            let acid = event.data.ACID
            this.router.navigate(["./pages/masters/doctor-master/new", { mode: "view", ACID: acid, returnUrl: this.router.url }]);

        } catch (ex) {
            alert(ex);
        }
    }

}