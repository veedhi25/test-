import {
	Component,
	OnInit,
	OnDestroy,
	ViewChild,
	ElementRef,
	EventEmitter
} from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import {
	Warehouse,
	ExcelImportConfig
} from "../../../../common/interfaces/TrnMain";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { ExcelImportService } from "./excel-import-config.service";
import { isNull } from "util";
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from "../../../../common/popupLists/file-uploader/file-uploader-popup.component";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { result } from "lodash";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";

@Component({
	selector: "excel-import-congig",
	templateUrl: "./excel-import-config.component.html",
	styleUrls: ['../../../Reports/reportStyle.css'],
	providers: [ExcelImportService]
})
export class ExcelImportConfigComponent implements OnInit, OnDestroy {
	@ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
	gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();

	@ViewChild("fileSelect") fileSelector_Import: ElementRef;

	@ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
	fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();

	excelImportConfig: ExcelImportConfig[] = [];
	initialTextReadOnly: boolean = false;
	form: FormGroup;
	private subcriptions: Array<Subscription> = [];
	modeTitle: string;
	masterList: string[];
	warehouseList: string[];

	selectedMasterName: string;
	selectedWarehouseName: string;
	activeurlpath: string;

	importErrorList: any[] = []
	supplierAcid: string = "DEFAULT";
	supplierName: string = "DEFAULT";

	constructor(
		private preventNavigationService: PreventNavigationService,
		private alertService: AlertService,
		private loadingService: SpinnerService,
		protected masterService: MasterRepo,
		protected service: ExcelImportService,
		private router: Router,
		public _activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		public _trnMainService: TransactionService
	) { }

	ngOnInit() {
		try {
			this.resetConfig();
			this.onFormChanges();
			this.getAllMasterList();
			this.getAllWarehouseList();
		} catch (ex) {
			console.log(ex);
			this.alertService.error(ex);
		}


		this.gridPopupSettingsForSupplier = {
			title: "Suppliers",
			apiEndpoints: `/getAccountPagedListByPType/PA/V`,
			defaultFilterIndex: 0,
			columns: [
				{
					key: "ACNAME",
					title: "NAME",
					hidden: false,
					noSearch: false
				},
				{
					key: "customerID",
					title: "CODE",
					hidden: false,
					noSearch: false
				},
				{
					key: "ADDRESS",
					title: "ADDRESS",
					hidden: false,
					noSearch: false
				},
				{
					key: "GEO",
					title: "TYPE",
					hidden: false,
					noSearch: false
				},
				{
					key: "MOBILE",
					title: "MOBILE",
					hidden: true,
					noSearch: false
				}
			]
		}


	}


	showImportScheme() {
		this.activeurlpath = this._activatedRoute.snapshot.url[0].path;
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Import Scheme",
				//  sampleFileUrl : `/downloadSampleFile/`,  
				uploadEndpoints: `/InsertPrimarySecondarySchemes`,
				allowMultiple: false,
				acceptFormat: ".csv"
			});
		this.fileUploadPopup.show();
	}


	UpdateSchemeImport() {

		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Update Scheme",
				sampleFileUrl: `/downloadSampleFile/`,
				uploadEndpoints: `/UpdatePrimarySecondarySchemes`,
				allowMultiple: false,
				acceptFormat: ".csv"
			});
		this.fileUploadPopup.show();
	}


	showImportMargin() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Import Margin",
				// sampleFileUrl : `/downloadSampleFile`,  
				uploadEndpoints: `/insertMargins`,
				allowMultiple: false,
				acceptFormat: ".csv"
			});
		this.fileUploadPopup.show();
	}

	UpdateMarginImport() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "update Margin",
				// sampleFileUrl : `/downloadSampleFile`,  
				uploadEndpoints: `/UpdateMargins`,
				allowMultiple: false,
				acceptFormat: ".xlsx"
			});

		this.fileUploadPopup.show();
	}

	fileUploadSuccessStatus(response) {
		if (response.status == "ok") {
			this.alertService.success("Upload Successfully")
		}
		else if (response.status == "error") {
			this.alertService.error(`Errors:${response.result}`);
		}
		else {
			this.alertService.error("Could not uploaded")
		}
	}

	fileUploadSuccess(uploadedResult) {
		if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
			return;
		}

		if (uploadedResult.status == "ok") {
			let productList = uploadedResult.result;
			this._trnMainService.TrnMainObj.ProdList = productList
			for (let i in this._trnMainService.TrnMainObj.ProdList) {
				this._trnMainService.setAltunitDropDownForView(i);
				this._trnMainService.getPricingOfItem(i, "", false);
				this._trnMainService.TrnMainObj.ProdList[i].inputMode = false;
				this._trnMainService.TrnMainObj.ProdList[i].VCHRNO = this._trnMainService.TrnMainObj.VCHRNO;
				//this._trnMainService.TrnMainObj.ProdList[i].MFGDATE= ((this._trnMainService.TrnMainObj.ProdList[i].MFGDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].MFGDATE.toString().substring(0, 10));
				//this._trnMainService.TrnMainObj.ProdList[i].EXPDATE= ((this._trnMainService.TrnMainObj.ProdList[i].EXPDATE == null) ? "" : this._trnMainService.TrnMainObj.ProdList[i].EXPDATE.toString().substring(0, 10));         

			}

			// var ZeroStockedProduct=this._trnMainService.TrnMainObj.ProdList.filter(x=>x.SELECTEDITEM.STOCK<=0);
			//this._trnMainService.TrnMainObj.ProdList=this._trnMainService.TrnMainObj.ProdList.filter(x=>x.SELECTEDITEM.STOCK>0);

			// this._trnMainService.ReCalculateBill();  
			this._trnMainService.ReCalculateBillWithNormal();
		}
	}

	createFormItem(data: ExcelImportConfig): FormGroup {
		return this.fb.group({
			ImportName: [data.ImportName],
			ColumnName: [data.ColumnName],
			MappingName: [data.MappingName],
			SNO: [data.SNO],
			ColumnSize: [data.ColumnSize],
			DataType: [data.DataType],
			ColumnValue: [data.ColumnValue],
			Mandatory: [{ value: data.Mandatory, disabled: true }],
			AddToSheet: [data.AddToSheet],
			PARAC: [data.PARAC]
		});
	}

	addItemsToForm(): void {
		this.form = this.fb.group({
			items: this.fb.array([])
		});
		let items = this.form.get("items") as FormArray;
		this.excelImportConfig.forEach(data => {
			items.push(this.createFormItem(data));
		});
	}

	onFormChanges(): void {
		this.form.valueChanges.subscribe(val => {
			if (this.form.dirty)
				this.preventNavigationService.preventNavigation(true);
		});
	}

	cancel() {
		try {
			this.router.navigate(["/pages/dashboard"]);
		} catch (ex) {
			console.log(ex);
			this.alertService.error(ex);
		}
	}

	ngOnDestroy() {
		try {
			this.subcriptions.forEach(subs => {
				subs.unsubscribe();
			});
		} catch (ex) {
			console.log(ex);
			this.alertService.error(ex);
		}
	}

	onSave() {
		try {
			//validate before Saving
			if (!this.form.valid) {
				this.alertService.info(
					"Invalid Request, Please enter all required fields."
				);
				return;
			}
			this.onsubmit();
		} catch (ex) {
			this.alertService.error(ex);
		}
	}


	showCustomerUpdate() {

		if (this._trnMainService.userProfile.username.toLowerCase() == 'patanjali_user' || this._trnMainService.userProfile.username.toLowerCase() == 'patanjali_support') {
			return true;
		} else {
			return false;
		}
	}

	onsubmit() {
		try {
			let saveModel = this.form.get("items").value;
			if (saveModel == null || saveModel.length == 0) {
				return;
			}

			if (this.supplierAcid != null && this.supplierAcid != "" && this.supplierAcid != undefined) {
				saveModel.map(x => x.PARAC = this.supplierAcid);
			}
			this.loadingService.show("Saving Config. Please Wait...");
			let sub = this.service.saveConfig(saveModel).subscribe(
				data => {
					this.loadingService.hide();
					if (data.status == "ok") {
						this.alertService.success("Config Saved Successfully");
						this.preventNavigationService.preventNavigation(false);
					} else {
						if (
							data.result._body ==
							"The ConnectionString property has not been initialized."
						) {
							this.router.navigate(["/login", this.router.url]);
							return;
						}
						this.alertService.error(
							`Error in Saving Data: ${data.result._body}`
						);
					}
				},
				error => {
					this.loadingService.hide();
					this.alertService.error(error);
				}
			);
			this.subcriptions.push(sub);
		} catch (e) {
			this.alertService.error(e);
		}
	}

	getAllMasterList() {
		this.masterService.getAllExcelImportMasterList().subscribe(
			data => {
				this.masterList = data;
				let i = this.masterList.indexOf('Stock Update');
				this.masterList.splice(i, 1);
				if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE != 'central') {
					const index = this.masterList.indexOf('Item Master');
					this.masterList.splice(index, 1);
				}
				if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == 'superdistributor' && (this._trnMainService.userProfile.username.toLowerCase() != 'patanjali_user' && this._trnMainService.userProfile.username.toLowerCase() != 'patanjali_support' && this._trnMainService.userProfile.username.toLowerCase() != "supplychain")) {
					const index = this.masterList.indexOf('Customer Master');
					this.masterList.splice(index, 1);
				}
			},
			error => {
				this.masterList = [];
			}
		);
	}
	getAllWarehouseList() {
		this.masterService.getAllWarehouseLists().subscribe(
			data => {
				this.warehouseList = data;
				// if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE != 'central') {
				// 	const index = this.warehouseList.indexOf('NAME');
				// 	this.warehouseList.splice(index, 1);
				// }
			},
			error => {
				this.warehouseList = [];
			}
		);
	}
	loadConfig() {
		if (
			!this.selectedMasterName ||
			this.selectedMasterName == null ||
			this.selectedMasterName == undefined ||
			this.selectedMasterName == ""
		) {
			this.alertService.info("Please Select a Master");
			return;
		}
		this.loadingService.show("Loading Config. Please Wait...");
		this.service.loadConfig(this.selectedMasterName, this.supplierAcid).subscribe(
			data => {
				this.loadingService.hide();
				this.excelImportConfig = data;
				this.addItemsToForm();
			},
			error => {
				this.loadingService.hide();
				this.excelImportConfig = [];
			}
		);
	}

	downloadConfigCSV() {
		if (
			!this.selectedMasterName ||
			this.selectedMasterName == null ||
			this.selectedMasterName == undefined ||
			this.selectedMasterName == ""
		) {
			this.alertService.info("Please Select a Master");
			return;
		}
		this.loadingService.show("Downloading...");
		if (this.selectedMasterName == "Item Master") {
			this.masterService.downloadExcelOrCsvFiles('/downloadExcelsFiles?filename=Item Master', 'Item Master', 'xlsx')
				.subscribe(
					data => {
						this.loadingService.hide();
						this.masterService.downloadFile(data);
					},
					(error) => {
						console.log(error);
						this.alertService.error(error._body);
						this.loadingService.hide();
					}
				);
		} else {
			this.service.downloadConfigCSV(this.selectedMasterName,this.supplierAcid).subscribe(
				data => {
					this.loadingService.hide();
					this.downloadFile(data);
				},
				error => {
					this.loadingService.hide();
				}
			);
		}

	}

	downloadFile(response: any) {
		const element = document.createElement("a");
		element.href = URL.createObjectURL(response.content);
		element.download = response.filename;
		document.body.appendChild(element);
		element.click();
	}

	fileList: FileList = null;
	onFileChange($event) {
		this.fileList = $event.target.files;

	}

	clearFile() {
		this.fileList = null;
	}

	importConfig() {
		if (this.fileList == null || this.fileList.length == 0) {
			this.alertService.info("Please Select File.");
			return;
		}

		if (this.selectedMasterName == null || this.selectedMasterName == "") {
			this.alertService.info("Please Select Master.");
			return;
		}

		if (this.fileList.length > 0) {
			let file: File = this.fileList[0];
			let formData: FormData = new FormData();
			formData.append("config", file, file.name);

			this.loadingService.show("Uploading. Please Wait...this may take some time");
			this.service.importConfig(formData, this.selectedMasterName, this.selectedWarehouseName).subscribe(
				result => {

					this.loadingService.hide();

					if (result.status == "ok") {
						this.alertService.success("Request Successful");
						this.selectedMasterName = "";
						this.fileList = null;
						this.fileSelector_Import.nativeElement.value = null;
					} else if (result.status == "errorfile") {
						this.alertService.error("Error list are on :" + result.message + " Note: please verify errors on 'Status' column and Save only those data again!");
					} else if (result.status == "error") {
						this.alertService.error("Error list are on :" + result.message);
					}
					else {
						this.alertService.error(result.result);
					}
				},
				error => {
					this.loadingService.hide();
					this.alertService.error(error);
				}
			);
		}
	}

	resetConfig() {
		this.form = this.fb.group({
			items: this.fb.array([])
		});

		this.excelImportConfig = [];
		this.selectedMasterName = "";
		this.importErrorList = [];
		this.preventNavigationService.preventNavigation(false);
		this.supplierAcid = "DEFAULT";
		this.supplierName = "DEFAULT";
	}

	MandatoryChanged($event, index: number) {
		let items = this.form.get("items") as FormArray;
		if (!$event.target.checked) return;
		items.at(index).patchValue({
			AddToSheet: true
		});
	}

	AddToSheetChanged($event, index: number) {
		let items = this.form.get("items") as FormArray;
		if (!items.controls[index].get("Mandatory").value) return true;

		items.at(index).patchValue({
			AddToSheet: true
		});
	}

	onLoadMaster() {
		if (this.selectedMasterName == null || this.selectedMasterName == "") {
			this.alertService.info("Please Select Master.");
			return;
		}
		this.loadingService.show("Loading Master Data. Please Wait...");
		this.service.loadImportErrorList(this.selectedMasterName)
			.subscribe(
				res => {
					this.loadingService.hide();
					this.importErrorList = res;
					// console.log(this.importErrorList);
				}, error => {
					this.loadingService.hide();
					this.alertService.error("No Data Found");
					console.log(error);
				});
	}

	onLoadMargin() {

	}

	onSaveMaster() {
		if (this.selectedMasterName == null || this.selectedMasterName == "") {
			this.alertService.info("Please Select Master.");
			return;
		}
		this.loadingService.show("Saving Master Data. Please Wait...");
		this.service.saveCorrectedList(this.importErrorList, this.selectedMasterName)
			.subscribe(
				res => {
					this.loadingService.hide();
					this.alertService.success("Successfully Saved.")
					// console.log(this.importErrorList);
				}, error => {
					this.loadingService.hide();
					this.alertService.error("No Data Found");
					console.log(error);
				});
	}

	@ViewChild("loginModal") loginModal: ModalDirective;
	hideloginModal() {
		try {
			this.loginModal.hide();
		} catch (ex) {
			console.log(ex);
			this.alertService.error(ex);
		}
	}

	ProductUpload() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Product Upload",
				// sampleFileUrl : `/downloadSampleFile`,  
				uploadEndpoints: `/masterImport/Item Master/nothing`,
				allowMultiple: false,
				acceptFormat: ".xlsx"
			});
		this.fileUploadPopup.show();
	}


	ItemListUpload() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Item List Upload",
				// sampleFileUrl : `/downloadSampleFile`,  
				uploadEndpoints: `/masterImport/retialer ItemList/nothing`,
				allowMultiple: false,
				acceptFormat: ".xlsx"
			});
		this.fileUploadPopup.show();
	}


	stockUpload() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Stock Update",
				uploadEndpoints: `/masterImport/StockUpdate/nothing`,
				allowMultiple: false,
				acceptFormat: ".csv"
			});
		this.fileUploadPopup.show();
	}
	updatePhiscalInventoryUpload() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Update Physical Inventory",
				uploadEndpoints: `/masterImport/updatePhiscalInventory/nothing`,
				allowMultiple: false,
				acceptFormat: ".csv"
			});
		this.fileUploadPopup.show();
	}






	expired() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Damaged and Expired",
				uploadEndpoints: `/masterImport/ExpiredDamaged/nothing`,
				allowMultiple: false,
				acceptFormat: ".csv"
			});
		this.fileUploadPopup.show();
	}
	transferout() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Transfer Out",
				uploadEndpoints: `/masterImport/transferout/nothing`,
				sampleFileUrl: '/downloadExcelsFilesTransferOut',
				allowMultiple: false,
				acceptFormat: ".xlsx",
				filename: "TRANSFER_OUT"
			});
		this.fileUploadPopup.show();
	}
	updateItemPropertySetting(type: string) {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Item Property Setting",
				uploadEndpoints: `/masterImport/itempropertysetting/${type}`,
				allowMultiple: false,
				acceptFormat: ".csv"
			});
		this.fileUploadPopup.show();
	}




	updateCustomer() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Customer Update",
				uploadEndpoints: `/masterImport/updateCustomer/nothing`,
				allowMultiple: false,
				acceptFormat: ".xlsx"
			});
		this.fileUploadPopup.show();
	}


	downloadStockUpdate() {
		this.loadingService.show("Downloading...");
		this.service.downloadSampleFile("damagedandexpired", "StockUpdate").subscribe(
			data => {
				this.loadingService.hide();
				this.downloadFile(data);
			},
			error => {
				this.loadingService.hide();
			}
		);
	}
	downloadupdatePhiscalInventoryUpdate() {
		this.loadingService.show("Downloading...");
		this.service.downloadSampleFile("downloadupdatePhiscalInventoryUpdate", "Phiscal Inventory Update").subscribe(
			data => {
				this.loadingService.hide();
				this.downloadFile(data);
			},
			error => {
				this.loadingService.hide();
			}
		);
	}


	downloadtransferout() {
		this.loadingService.show("Downloading...");
		this.service.downloadSampleFile("transferOutExcelUpload", "transferOutExcelUpload").subscribe(
			data => {
				this.loadingService.hide();
				this.downloadFile(data);
			},
			error => {
				this.loadingService.hide();
			}
		);
	}
	downloadItemPropertSetting() {
		this.loadingService.show("Downloading...");
		this.service.downloadSampleFile("itempropertysetting", "ItemPropertySetting").subscribe(
			data => {
				this.loadingService.hide();
				this.downloadFile(data);
			},
			error => {
				this.loadingService.hide();
			}
		);
	}
	downloadCustomer() {
		this.loadingService.show("Downloading...");
		this.masterService.updateCustomer().subscribe(
			data => {
				this.loadingService.hide();
				this.downloadFile(data);
			},
			error => {
				this.loadingService.hide();
			}
		);
	}
	updateState() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "State Upload",
				uploadEndpoints: `/masterImport/insertState/nothing`,
				allowMultiple: false,
				acceptFormat: ".xlsx"
			});
		this.fileUploadPopup.show();
	}
	downloadState() {
		this.loadingService.show("Downloading...");
		this.masterService.updateState().subscribe(
			data => {
				this.loadingService.hide();
				this.downloadFile(data);
			},
			error => {
				this.loadingService.hide();
			}
		);
	}
	updateDistrict() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "District Upload",
				uploadEndpoints: `/masterImport/insertDistrict/nothing`,
				allowMultiple: false,
				acceptFormat: ".xlsx"
			});
		this.fileUploadPopup.show();
	}
	downloadDistrict() {
		this.loadingService.show("Downloading...");
		this.masterService.updateDistrict().subscribe(
			data => {
				this.loadingService.hide();
				this.downloadFile(data);
			},
			error => {
				this.loadingService.hide();
			}
		);
	}


	scheme() {
		this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
			{
				title: "Scheme",
				uploadEndpoints: `/masterImport/Scheme Master/nothing`,
				sampleFileUrl: '/downloadSampleFile/scheme',
				allowMultiple: false,
				acceptFormat: ".xlsx",
				filename: "Scheme"
			});
		this.fileUploadPopup.show();
	}

	onSelectSupplierForMaster(event) {
		this.genericGridSupplier.show();
	}


	onSupplierSelected = (data: any) => {
		this.supplierAcid = data.ACID;
		this.supplierName = data.ACNAME;
	}
}
