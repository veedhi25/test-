import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { ActivatedRoute, Router } from "@angular/router";
import { Product, ItemRate, KotCategory, Model, Brand, RateDiscount, TBarcode } from '../../../../common/interfaces/ProductItem';
import { ProductType } from '../../../../common/interfaces/PType.interface';
import { Warehouse, AlternateUnit } from '../../../../common/interfaces/TrnMain';
import { TAcList } from '../../../../common/interfaces/Account.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { ProductMasterService } from './ProductMasterService';
import { Subscription } from "rxjs/Subscription";
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AuthService } from '../../../../common/services/permission';
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { ProductMasterTabComponent } from './productmasterTab';
import { DropdownSettings } from '../../../../node_modules/angular4-multiselect-dropdown/index'
import { FileUploaderService } from '../../../../common/popupLists/file-uploader/file-uploader-popup.service';
import { Console } from 'console';
// import { hcategorymasterService } from '../hcategory-master/hcategorymaster.service';
@Component({
    selector: "addproductmaster",
    templateUrl: "./addproducts.html",
    styleUrls: ["../../../Style.css", './modals.scss'],
    providers: [ProductMasterService],
})

export class AddProductComponent {
    @ViewChild('childModal') childModal: ModalDirective;
    @ViewChild('smBrand') public smBrand: ModalDirective;
    @ViewChild('smModel') public smModel: ModalDirective;
    @ViewChild('genericWarehouseGrid') genericWarehouseGrid: GenericPopUpComponent;
    genericWarehouseSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild(ProductMasterTabComponent) child: ProductMasterTabComponent;
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
    gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("repackItemGrid") repackItemGrid: GenericPopUpComponent;
    repackItemGridSettings: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    gridPopupSettingsForPType: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("genericGridPType") genericGridPType: GenericPopUpComponent;
    @ViewChild("genericTaxSlabGridEdit") genericTaxSlabGridEdit: GenericPopUpComponent;
    genericTaxSlabGridSettingsEdit: GenericPopUpSettings = new GenericPopUpSettings();

    public __SYSTEMSETTINGMENU: any = <any>{};

    matrixSelectSetting: any = {
        singleSelection: false,
        text: 'Select',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'NAME',
        primaryKey: 'NAME',
        position: 'bottom'

    };
    otherSelectSetting: any = {
        singleSelection: true,
        text: 'Select',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'NAME',
        primaryKey: 'NAME',
        position: 'bottom'

    };

    mode: string = "add";
    DialogMessage: string = "Saving data please wait ..."
    modeTitle: string = '';
    initialTextReadOnly: boolean = false;
    SetDIChecked: boolean = false;
    @Input() productObj: Product = <Product>{};
    @Input() MRP: any;

    Units: any[] = []
    RGLIST: ItemRate[] = [];
    MCatList: any[] = [];
    SupplierList: TAcList[] = [];
    PTypeList: ProductType[] = [];
    KotCategoryList: KotCategory[] = [];
    BrandList: Brand[] = [];
    ModelList: Model[] = [];
    parentItem: any;
    AllModelList: Model[] = [];
    WarehouseList: Warehouse[] = [];
    AlternateUnits: AlternateUnit[] = [];
    PBarCodeCollection: TBarcode[] = [];
    BrandModelList: any[] = [];
    SelectedModel: Model = <Model>{};
    private subcriptions: Array<Subscription> = [];
    @Input() tab: any = <any>{};
    @Input() ProductHomeTabs: any[];
    @Output() activeTabEmit = new EventEmitter();
    EnableMultiStockLevel: boolean;
    isDisabled: boolean;
    form: FormGroup;
    public appType;
    weightVolume: any;
    margin: number;
    marginPercent: number;
    BrandObject: any = <any>{};
    userProfile: any = <any>{};
    OrgType: string;
    MCat1List: any[] = [];
    MCat2List: any[] = [];
    MCat3List: any[] = [];
    categoryName: string = "";
    categoryType: string = "";
    public imageUrl: any;
    imageshowFlag: boolean = false;
    fileList: FileList = null;

    sellingPrice: number;

    CurAltUnit: AlternateUnit = <AlternateUnit>{};
    @ViewChild("genericUnitGrid") genericUnitGrid: GenericPopUpComponent;
    unitgridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("altgenericUnitGrid") altgenericUnitGrid: GenericPopUpComponent;
    altunitgridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @ViewChild("suppliergenericUnitGrid") suppliergenericUnitGrid: GenericPopUpComponent;
    suppliergridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    BULKparentItem: any;
    public setting: any;
    public categorywiseConfigurationdetails = <any>[];
    public lstItemGroup = <any>[];
    public lstHCategory = <any>[];
    variantCombination: any[] = [];
    enbaleVariantCombinationPopUp: boolean = false;
    formSetting: any[] = [];
    constructor(
        private _loadingService: SpinnerService,
        private _alertService: AlertService,
        private ProductService: ProductMasterService,
        private masterService: MasterRepo,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private authservice: AuthService,
        private _transactionService: TransactionService,
        private fileImportService: FileUploaderService,
        private fb: FormBuilder,
        // private _hcCategoryService:hcategorymasterService
    ) {

        this.setting = JSON.parse(localStorage.getItem("setting"))
        this.masterService.masterPostmethod_NEW("/getcategorywiseconfiguration", {}).subscribe((res) => {
            if (res.result && res.result.length) {
                this.categorywiseConfigurationdetails = res.result;


                this.categorywiseConfigurationdetails.forEach(x => {
                    x.SELECTEDMCAT = [];
                    if (x.hasOwnProperty("VARIANTVALUES")) {
                        let parsedCatValues = JSON.parse(x.VARIANTVALUES);
                        if (typeof parsedCatValues == "object" && parsedCatValues && parsedCatValues.length) {
                            x.VARIANTVALUES = parsedCatValues;
                        } else {
                            x.VARIANTVALUES = <any>[];
                        }
                    }
                });
            }

        }, error => {

        })





        this.userProfile = this.authservice.getUserProfile();
        this.OrgType = this.userProfile.CompanyInfo.ORG_TYPE;

        this.unitgridPopupSettings = {
            title: "UOM List",
            apiEndpoints: `/getUnitPagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "UNITS",
                    title: "Unit Of measurement",
                    hidden: false,
                    noSearch: false
                }

            ]
        };
        this.altunitgridPopupSettings = {
            title: "Alternate UOM List",
            apiEndpoints: `/getUnitPagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "UNITS",
                    title: "Unit Of measurement",
                    hidden: false,
                    noSearch: false
                }

            ]
        };

        this.genericWarehouseSettings = {
            title: "Warehouse List",
            apiEndpoints: `/getAllWarehousePagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "NAME",
                    title: "Warehouse List",
                    hidden: false,
                    noSearch: false
                }

            ]
        }

        this.gridPopupSettings = {
            title: "UOM List",
            apiEndpoints: `/getUnitPagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "UNITS",
                    title: "Unit Of measurement",
                    hidden: false,
                    noSearch: false
                }

            ]
        };
        this.gridPopupSettingsForCustomer = Object.assign(new GenericPopUpSettings, {
            title: "ITEMS",
            apiEndpoints: `/getMenuItemsPagedListScheme`,
            defaultFilterIndex: 1,
            columns: [
                {
                    key: "MENUCODE",
                    title: "MCODE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "DESCA",
                    title: "DESCA",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "BASEUNIT",
                    title: "BASEUNIT",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "BARCODE",
                    title: "BARCODE",
                    hidden: false,
                    noSearch: false
                }
            ]
        });
        this.repackItemGridSettings = Object.assign(new GenericPopUpSettings, {
            title: "ITEMS",
            apiEndpoints: `/getBulkMenuitemPagedList`,
            defaultFilterIndex: 1,
            columns: [
                {
                    key: "MENUCODE",
                    title: "MCODE",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "DESCA",
                    title: "DESCA",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "BASEUNIT",
                    title: "BASEUNIT",
                    hidden: false,
                    noSearch: false
                },
                {
                    key: "BARCODE",
                    title: "BARCODE",
                    hidden: false,
                    noSearch: false
                }
            ]
        });
        this.gridPopupSettingsForPType = {
            title: "Product Types",
            apiEndpoints: `/getPtypePagedList`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: "ptypename",
                    title: "PTYPE",
                    hidden: false,
                    noSearch: false
                }

            ]
        };
        this.masterService.getDivWiseWarehouseList().subscribe(
            (res) => {
                this.WarehouseList = res
            }
        )
        this.masterService.getMCatList().subscribe((res) => {
            this.MCatList.push(res);
        })
        this.genericTaxSlabGridSettingsEdit = {
            title: "Tax-Slab Rate",
            apiEndpoints: `/getMasterPagedListOfAny`,
            defaultFilterIndex: 0,
            columns: [
                {
                    key: 'TaxSlabName',
                    title: 'Name',
                    hidden: false,
                    noSearch: false
                },
                {
                    key: 'SlabRateId',
                    title: 'SlabRateId',
                    hidden: true,
                    noSearch: true
                }
            ]
        }

        if (localStorage.getItem("setting")) {
            this.__SYSTEMSETTINGMENU = JSON.parse(localStorage.getItem("setting"));
        }
    }



    onFileChange($event) {
        this.fileList = $event.target.files;
        let reader = new FileReader();
        let file = $event.target.files[0];
        if ($event.target.files && $event.target.files[0]) {
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imageUrl = reader.result;
                this.imageshowFlag = true;
            }
        }


    }
    LoadItemGroup(CategoryName: string) {
        this.ProductService.getItemGroupByCategoryName(CategoryName)
            .subscribe(
                data => {
                    if (data.status === "ok") {
                        var tdata = data.result;
                        tdata = tdata ? tdata : [];
                        this.lstItemGroup = tdata;
                        console.log("ItemGroupList By Category ", this.lstItemGroup);
                    }
                    else {
                        this.lstItemGroup = [];
                    }
                },
                error => {
                    alert(error.message);
                }
            );
        //lstItemGroup
    }

    LoadHierarchicalCategory() {
        this.ProductService.GethCategoryMasterList()
            .subscribe(
                data => {
                    if (data.status === "ok") {
                        var tdata = data.data;
                        // tdata = tdata ? tdata : [];
                        this.lstHCategory = tdata;
                        console.log("Here I am Hierarchical Category ", this.lstHCategory);
                    }
                    else {
                        this.lstHCategory = [];
                    }
                },
                error => {
                    alert(error.message);
                }
            );
        //lstItemGroup
    }


    onUnitClicked() {
        this.genericUnitGrid.show();
        return;
    }
    onaltUnitClicked() {
        this.altgenericUnitGrid.show();
        return;
    }

    changedPurchase(event) {
        this.productObj.PRATE_A = event;
    }


    onPTypeClicked() {
        this.genericGridPType.show();
    }
    dblClickUnitItem(event) {
        this.productObj.BASEUNIT = event.UNITS;
        return;
    }
    altdblClickPopupItem(event) {
        this.CurAltUnit.ALTUNIT = event.UNITS;
        return;
    }

    changedRequire(event) {
        this.productObj.RequiredQTY = event;
    }
    changedDiscount(event) {
        this.productObj.ItemRateDiscount = event;
    }
    changedOffer(event) {
        this.productObj.ItemOffer = event;
    }
    changedFocus(event) {
        this.productObj.focusRate = event;
    }
    changedLoyalty(event) {
        this.productObj.loyaltyAllowed = event;
    }

    //new GST
    changedTax($event) {
        this.productObj.SalesTax = $event
    }
    changedVAT($event) {
        this.productObj.VAT = $event
    }
    changedHSN($event) {
        this.productObj.HSNCode = $event
    }
    changedInclusive($event) {
        this.productObj.InclusiveOfTax = $event
    }
    changedGst($event) {
        this.productObj.GST = $event;
    }

    //new Others
    changedWarehouse($event) {
        this.productObj.WHOUSE = $event
    }
    changedRack($event) {
        this.productObj.RackNumber = $event
    }
    changedFormula($event) {
        this.productObj.PriceLevel = $event
    }
    changeGST() {
        this.child.changeMRPExclusive();
        this.child.changeSellingPriceExclusive();
        this.child.changeSellingPriceInclusive();
        this.child.changeLandingPriceInclusive();
        this.child.changeLandingPriceExclusive();
    }

    showPopup() {
        this.genericGridCustomer.show();
    }
    showRepackPopup() {
        this.repackItemGrid.show();
    }

    dblClickPopupItems(event) {
        this.productObj.PARENT = event.MCODE;
        this.parentItem = event.DESCA

    }
    dblClickwarehouseItems(event) {
        this.productObj.WHOUSE = event.NAME;

    }
    dblClickrepackItems(event) {
        this.productObj.BULKPARENT = event.MCODE;
        this.productObj.BULKparentItem = event.DESCA

    }

    changeNegative() {
        if (this.productObj.ALLOWNEGATIVE == true) {
            this.productObj.ALLOWNEGATIVE = 1
        }
        else {
            this.productObj.ALLOWNEGATIVE = 0
        }
    }

    saveCategory() {
        this.ProductService.saveCategory(this.categoryName, this.categoryType).subscribe((res) => {
            if (res.status == "ok") {
                ($('#myModal') as any).modal('hide');
                if (this.categoryType.toLowerCase() == "cat") {
                    this.MCatList = [];
                    this.masterService.getMCatList().subscribe(res => { this.MCatList.push(<any>res); });

                } else if (this.categoryType.toLowerCase() == "cat1") {
                    this.masterService.getMCat1List().subscribe(res => { this.MCat1List.push(<any>res); });
                } else if (this.categoryType.toLowerCase() == "cat2") {
                    this.masterService.getMCat2List().subscribe(res => { this.MCat2List.push(<any>res); });

                } else {
                    this.masterService.getMCat3List().subscribe(res => { this.MCat3List.push(<any>res); });
                }
                if (document.getElementById("catclosebtn") != null) {
                    document.getElementById("catclosebtn").click();
                }
            }
        }, error => {
            alert(error);
        })
    }

    AddAltUnit() {
        try {
            if ((this.AlternateUnits.filter(x => x.ALTUNIT == this.CurAltUnit.ALTUNIT)).length > 0) return;
            this.AlternateUnits.push(this.CurAltUnit);
            this.CurAltUnit = <AlternateUnit>{};
        } catch (ex) {
            this._alertService.error(ex)
        }
    }
    removeAU(index) {
        try {
            this.AlternateUnits.splice(index, 1);
        } catch (ex) {
            this._alertService.error(ex)
        }
    }
    editAU(index) {
        try {
            this.CurAltUnit = this.AlternateUnits[index];
            this.AlternateUnits.splice(index, 1);
        } catch (ex) {
            this._alertService.error(ex)
        }
    }

    ngOnInit() {
        //this.LoadHierarchicalCategory();

        this.formSetting = this._activatedRoute.snapshot.data.formSetting.result;

        try {
            this.masterService.getUnits().subscribe(res => { this.Units.push(<any>res); });
        } catch (ex) {
            this._alertService.error(ex)
        }

        this.form = this.fb.group({
            MENUCODE: ['', Validators.required]
        })


        try {
            this.mode = this.tab.mode;
            if (this.mode.toLowerCase() == "add" || this.mode.toLowerCase() == "new") {
                this.productObj.InclusiveOfTax = 1;
                this.productObj.BASEUNIT = "PCS";
                this.ProductService.getAutoGenerateMenuCode(0, 0).subscribe((res) => {
                    this.productObj.MCODE = res.result;
                })
                this.productObj.IsEditable = 0;
            }
            this.productObj.STATUS = 1;
            let self = this;
            this.productObj.ItemRateDiscount = <RateDiscount>{};
            this.productObj.MultiStockLevels = [];

            //for edit
            if (this.tab.mode != null && this.tab.mcode != null) {
                this._loadingService.show("Please wait.Loading Data")
                this.ProductService.getProductForEdit(this.tab.mcode)
                    .subscribe(data => {
                        if (data.status == 'ok') {
                            this.productObj = <Product>data.result;


                            this.imageUrl = "data:image/jpeg;base64," + this.productObj.ItemImageBase64;
                            this.imageshowFlag = true;

                            this.productObj.Par = data.result.Parent;
                            this.parentItem = data.result.Parent == null ? "" : data.result.Parent.DESCA;
                            this.productObj.BULKparentItem = data.result.BulkParentDetail == null ? "" : data.result.BulkParentDetail.DESCA;
                            this.productObj.PTYPE = data.result.ptypedetail ? data.result.ptypedetail.PTYPEID : '';
                            this.productObj.PTYPE_NAME = data.result.ptypedetail ? data.result.ptypedetail.PTYPENAME : '';
                            this.BrandObject = this.BrandList.filter(x => x.BrandId == data.result.BRAND)[0];

                            if (data.result.selectedCategoriesDetail && data.result.selectedCategoriesDetail.length) {
                                this.categorywiseConfigurationdetails.forEach(x => {
                                    let selectedCat = data.result.selectedCategoriesDetail.filter(y => y.VARIANT == x.VARIANT);
                                    x.SELECTEDMCAT = selectedCat.length ? selectedCat[0]==null?[]:selectedCat[0].SELECTEDMCAT : [];

                                });
                                let name = null;
                                let clN = this.categorywiseConfigurationdetails.find(emp => emp.VARIANTNAME === "category");
                                if (clN != null) {
                                    let smcat = clN.SELECTEDMCAT[0];
                                    if (smcat != null) {
                                        name = smcat.NAME;
                                    }

                                }
                                this.LoadItemGroup(name);
                            }

                            self.mode = 'edit';
                            self.modeTitle = "Edit Product";
                            self.initialTextReadOnly = true;
                            this.sellingPriceCalculationForLoad();
                            this._loadingService.hide();
                            if (this.productObj.IsEditable === null || this.productObj.IsEditable === undefined) {
                                this.productObj.IsEditable = 0;
                            }

                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in Product";
                            this.initialTextReadOnly = true;
                        }
                    }, error => {
                        this._loadingService.hide()
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Product";
                        this.masterService.resolveError(error, "addproducts (ProductMaster) - getProductForEdit");
                    }
                    );



                this.ProductService.getListFromKey('/GetAlternateUnitList/', this.tab.mcode)
                    .subscribe(data => {
                        if (data.status == "ok") {
                            let list = <any[]>data.result;
                            list.forEach(element => {
                                this.AlternateUnits.push(element);
                            });
                        }

                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Product";
                        this.masterService.resolveError(error, "addproducts (ProductMaster) - GetAlternateUnitListForEdit");
                    });
            }
            else {
                this.mode = "add";
                this.productObj.CANPURCHASE = "1";
                this.productObj.CANSALE = "1";
                this.modeTitle = "Add Product";
                this.initialTextReadOnly = false;
                this._loadingService.hide()

            }

        } catch (ex) {
            this._alertService.error(ex);
        }



    }

    ngOnDestroy() {
        try {
            this.subcriptions.forEach(subs => {
                subs.unsubscribe();

            });
        } catch (ex) {
            this._alertService.error(ex);
        }
    }

    onSave() {
        try {
            this.onSaveClicked();
        } catch (ex) {
            this._alertService.error(ex);
        }
    }



    marginCalculation() {
        this.margin = this.productObj.sellingPrice - this.productObj.PRATE_A;
        this.marginPercent = this.margin * 100 / this.productObj.PRATE_A;

    }
    changeMRP() {
        this.productObj.sellingPrice = this.productObj.MRP;
        this.marginCalculation()
    }

    changedGST(event) {
        console.log("changedGST", event);
        this.productObj.GST = event;
    }

    changedSPemit(event) {

        this.productObj.sellingPrice = event;
    }

    onSaveClicked() {
        try {
            this.productObj.PCL = "PCL002";
            this.productObj.TYPE = "A";
            this.productObj.PARENT = (this.productObj.PARENT == null || this.productObj.PARENT == null) ? 'PRG99999999' : this.productObj.PARENT;
            this.productObj.LEVELS = 0;
            this.productObj.DIV = this.masterService.userProfile.division;
            this.SetDIChecked = true;
            if (this.productObj.GST == null) { this._alertService.error("GST is Required"); return; }
            if (this.productObj.CESS < 0 || this.productObj.CESS > 100) {
                this._alertService.error("Cess% value must be between 0 and 100");
                return;
            }

            this.productObj.GST = this._transactionService.nullToZeroConverter(this.productObj.GST);

            if (this.setting.ENABLEAUTOALIASCODE == 0 && (this.productObj.MENUCODE == "" || this.productObj.MENUCODE == null || this.productObj.MENUCODE == undefined)) {
                this._alertService.error("Product Code is required")
                return
            } else if (this.productObj.DESCA == "" || this.productObj.DESCA == null || this.productObj.DESCA == undefined) {
                this._alertService.error("Product Name is required")
                return
            }


            this.sellingPriceCalculation();

            if (this.masterService.nullToZeroConverter(this.productObj.PTYPE) == 6 && this.masterService.nullToZeroConverter(this.productObj.NOOFSERIAL == 0)) {
                this._alertService.error("Please select no of serial for serialized items.");
                return;
            }





            if (this.productObj.PTYPE == 8) {
                if (this.masterService.isValidString(this.productObj.BULKPARENT) == false) {
                    this._alertService.error("Please select parent for child item.");
                    return;
                }
            }



            if (this.setting.CREATEVARIANTITEMONPRODUCTMASTER) {
                let array_of_arrays = [];
                this.categorywiseConfigurationdetails.forEach(x => {
                    let cat = [];
                    x.SELECTEDMCAT.forEach(y => {
                        y.VARIANTID = x.VARIANT;
                        cat.push(y)
                    });
                    if (cat.length) {
                        array_of_arrays.push(cat);
                    }
                });
                this.variantCombination = this.combineArrays(array_of_arrays);
                this.variantCombination.forEach(x => {
                    let barcode = "";
                    x.variantdetail = [];
                    let z = {};
                    x.combination.forEach(element => {
                        barcode = barcode + (element.VARIANTBARCODE == null || element.VARIANTBARCODE == "") ? element.CODE : element.VARIANTBARCODE;
                        z[element.VARIANTID] = element;
                    });
                    x.variantdetail = z;
                    x.BARCODE = this.productObj.MCODE + barcode;

                    x.MRP = this.productObj.MRP;
                    x.PRATE = this.productObj.PRATE_A;
                    if (this.productObj.variantCombinationDetail != null && this.productObj.variantCombinationDetail.length > 0) {
                        let VariantMrp = this.productObj.variantCombinationDetail.filter(a => a.BARCODE == x.BARCODE && a.MCODE == x.MCODE)[0];
                        if (VariantMrp != null) { x.MRP = VariantMrp.MRP; x.PRATE = VariantMrp.PRATE; }
                    }
                });
                this.enbaleVariantCombinationPopUp = this.variantCombination.length ? true : false;
            } else {
                this._loadingService.show("Please wait! Saving Product");
                if (this.fileList != null) {
                    this.updateItemimg();
                } else {
                    this.saveItemData();
                }

            }
        }
        catch (e) {
            alert(e);
        }
    }

    updateItemimg() {
        let fileformData: FormData = new FormData();
        let file: File = this.fileList[0];
        fileformData.append(`file`, file, file.name);
        this.fileImportService.importSelectedFiles('/updateItemimg', fileformData)
            .subscribe(
                res => {
                    //console.log(res);
                    if (res.status == "ok") {
                        this.productObj.PATH = res.result;
                        this.saveItemData();
                    } else {
                        this._loadingService.hide();
                        this._alertService.warning(res.result);
                    }
                    //  console.log(res);
                },
                error => {
                    console.log(error);

                }
            );
    }

    saveItemData() {
        let P: any = this.productObj;
        P.Parent = null;
        let sub = this.masterService.saveProduct(this.mode, P, this.RGLIST, this.AlternateUnits, this.PBarCodeCollection, this.BrandModelList, this.categorywiseConfigurationdetails, [])
            .subscribe(data => {
                this._loadingService.hide();
                //console.log("response data",data);
                if (data.status == 'ok') {
                    this.productObj.MENUCODE = '';
                    this.productObj.MCODE = '';
                    this.productObj.DESCA = '';
                    this.productObj.DESCB = '';
                    this.productObj.BRANDCODE = '';
                    this.productObj.GWEIGHT = 0;
                    this.productObj.SHELFLIFE = 0;
                    this._loadingService.hide()
                    this._alertService.success("Saved Successfully")
                    this.routeToHome();
                }
                else {
                    //alert(data.result);
                    //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
                    if (data.result._body == "The ConnectionString property has not been initialized.") {
                        this._loadingService.hide()
                        this.router.navigate(['/login', this.router.url])
                        return;
                    }
                    //Some other issues need to check
                    this._loadingService.hide()
                    this._alertService.error(data.result._body)
                }
            },
                error => {
                    this._loadingService.hide()
                    this._alertService.error(error)
                }
            );
        this.subcriptions.push(sub);
    }



    onvariantcombinationapply() {
        let P: any = this.productObj;
        P.Parent = null;
        let sub = this.masterService.saveProduct(this.mode, P, this.RGLIST, this.AlternateUnits, this.PBarCodeCollection, this.BrandModelList, this.categorywiseConfigurationdetails, this.variantCombination)
            .subscribe(data => {
                if (data.status == 'ok') {

                    this.productObj.MENUCODE = '';
                    this.productObj.MCODE = '';
                    this.productObj.DESCA = '';
                    this.productObj.DESCB = '';
                    this.productObj.BRANDCODE = '';
                    this.productObj.GWEIGHT = 0;
                    this.productObj.SHELFLIFE = 0;
                    this._loadingService.hide()
                    this._alertService.success("Saved Successfully")
                    this.routeToHome();
                }
                else {
                    //alert(data.result);
                    //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
                    if (data.result._body == "The ConnectionString property has not been initialized.") {
                        this._loadingService.hide()
                        this.router.navigate(['/login', this.router.url])
                        return;
                    }
                    //Some other issues need to check
                    this._loadingService.hide()
                    this._alertService.error(data.result._body)
                }
            },
                error => {
                    this._loadingService.hide()
                    this._alertService.error(error)
                }
            );
        this.subcriptions.push(sub);
    }






    onCancel() {
        try {
            this.routeToHome();
        } catch (ex) {
            this._alertService.error(ex)
        }
    }
    routeToHome(savedValue = null, mode = null) {
        let homeTab: any = <any>{};
        homeTab.name = 'productlist';
        // homeTab.selectedNode = this.tab.selectedNode;
        homeTab.active = true;
        homeTab.mode = mode;
        homeTab.from = "product";
        homeTab.savedValue = savedValue;
        this.activeTabEmit.emit(homeTab);
    }
    SaveBrand(Brand) {

    }
    SaveModel(Model, selectBId) {
        try {
            var Br = <Model>{ ModelName: Model, BrandId: selectBId };
            this.ProductService.saveModel(Br).subscribe(data => {
                if (data.status == 'ok') {
                    this.ModelList.push(<Model>data.result);
                    this.smModel.hide();
                }
            });
        } catch (ex) {
            this._alertService.error(ex);
        }
    }

    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            this._alertService.error(ex);
        }
    }
    hideChildModal() {
        try {
            this.childModal.hide();
        } catch (ex) {
            this._alertService.error(ex);
        }

    }
    changeDisStat() {

        if (this.productObj.DISMODE == "NONDISCOUNT") {
            this.isDisabled = true;
            this.productObj.DISAMOUNT = null;
            this.productObj.DISRATE = null;
        }
        else {
            this.isDisabled = false;
        }
    }

    sellingPriceCalculation() {
        if (this.productObj.InclusiveOfTax == 1) {
            this.productObj.RATE_A = this.masterService.nullToZeroConverter(this.productObj.sellingPrice) / (1 + (this.masterService.nullToZeroConverter(this.productObj.GST) / 100));
            this.productObj.IN_RATE_A = this.masterService.nullToZeroConverter(this.productObj.sellingPrice);

            this.productObj.RATE_B = this.masterService.nullToZeroConverter(this.productObj.wholesalePrice) / (1 + (this.masterService.nullToZeroConverter(this.productObj.GST) / 100));
            this.productObj.IN_RATE_B = this.masterService.nullToZeroConverter(this.productObj.wholesalePrice);

            this.productObj.RATE_C = this.masterService.nullToZeroConverter(this.productObj.intercompanyPrice) / (1 + (this.masterService.nullToZeroConverter(this.productObj.GST) / 100));
            this.productObj.IN_RATE_C = this.masterService.nullToZeroConverter(this.productObj.intercompanyPrice);
        }
        else {
            this.productObj.RATE_A = this.masterService.nullToZeroConverter(this.productObj.sellingPrice)
            this.productObj.IN_RATE_A = this.masterService.nullToZeroConverter(this.productObj.sellingPrice) + (this.masterService.nullToZeroConverter(this.productObj.GST) * this.masterService.nullToZeroConverter(this.productObj.sellingPrice) / 100);

            this.productObj.RATE_B = this.masterService.nullToZeroConverter(this.productObj.wholesalePrice)
            this.productObj.IN_RATE_B = this.masterService.nullToZeroConverter(this.productObj.wholesalePrice) + (this.masterService.nullToZeroConverter(this.productObj.GST) * this.masterService.nullToZeroConverter(this.productObj.wholesalePrice) / 100);

            this.productObj.RATE_C = this.masterService.nullToZeroConverter(this.productObj.intercompanyPrice)
            this.productObj.IN_RATE_C = this.masterService.nullToZeroConverter(this.productObj.intercompanyPrice) + (this.masterService.nullToZeroConverter(this.productObj.GST) * this.masterService.nullToZeroConverter(this.productObj.intercompanyPrice) / 100);
        }
    }
    sellingPriceCalculationForLoad() {
        if (this.productObj.InclusiveOfTax == 1) {
            this.productObj.sellingPrice = this.productObj.IN_RATE_A;
            this.productObj.wholesalePrice = this.productObj.IN_RATE_B;
            this.productObj.intercompanyPrice = this.productObj.IN_RATE_C;

        }
        else {
            this.productObj.sellingPrice = this.productObj.RATE_A;
            this.productObj.wholesalePrice = this.productObj.RATE_B;
            this.productObj.intercompanyPrice = this.productObj.RATE_C;
        }
    }

    dblClickPopupPType(event) {
        console.log(event);
        this.productObj.PTYPE_NAME = event.ptypename;
        this.productObj.PTYPE = event.ptypeid;
        return;
    }


    onMultiSelect(event) {
        console.log('CategoryOnChanges ',
            this.categorywiseConfigurationdetails.
                find(emp => emp.VARIANTNAME === "category").SELECTEDMCAT[0].NAME);

        this.LoadItemGroup(this.categorywiseConfigurationdetails.
            find(emp => emp.VARIANTNAME === "category").SELECTEDMCAT[0].NAME);
    }

    changeInclusive() { }







    combineArrays(array_of_arrays) {
        if (!array_of_arrays) {
            return [];
        }

        if (!Array.isArray(array_of_arrays)) {
            return [];
        }

        if (!array_of_arrays.length) {
            return [];
        }

        for (let i = 0; i < array_of_arrays.length; i++) {
            if (!Array.isArray(array_of_arrays[i]) || !array_of_arrays[i].length) {
                return [];
            }
        }


        let variant_generator = new Array(array_of_arrays.length);
        variant_generator.fill(0);
        let output = [];
        let newCombination = this.generateVariantCombination(variant_generator, array_of_arrays);
        output.push(newCombination);
        while (this.variant_generator_increment(variant_generator, array_of_arrays)) {
            newCombination = this.generateVariantCombination(variant_generator, array_of_arrays);
            output.push(newCombination);
        }
        return output;
    }


    generateVariantCombination(variant_generator, array_of_arrays) {
        let s_output = {};
        s_output['combination'] = [];
        for (let i = 0; i < variant_generator.length; i++) {
            s_output['combination'].push(array_of_arrays[i][variant_generator[i]]);
        }
        return s_output;


    }

    variant_generator_increment(variant_generator, array_of_arrays) {
        for (let i_variant_generator_digit = variant_generator.length - 1; i_variant_generator_digit >= 0; i_variant_generator_digit--) {

            let max = array_of_arrays[i_variant_generator_digit].length - 1;

            if (variant_generator[i_variant_generator_digit] + 1 <= max) {
                // increment, and you're done...
                variant_generator[i_variant_generator_digit]++;
                return true;
            }
            else {
                if (i_variant_generator_digit - 1 < 0) {
                    // No more digits left to increment, end of the line...
                    return false;
                }
                else {
                    // Can't increment this digit, cycle it to zero and continue
                    // the loop to go over to the next digit...
                    variant_generator[i_variant_generator_digit] = 0;
                    continue;
                }
            }
        }

    }





    onTaxSlabEnterKey() {
        this.genericTaxSlabGridEdit.show("", false, "getslabrates");
    }


    dblClicktaxSlabRateEdit = (data) => {

        this.productObj.TaxSlabName = data.TaxSlabName
        this.productObj.SlabRateId = data.SlabRateId
    }

    keydownSupplier() {
        this.suppliergridPopupSettings = Object.assign(new GenericPopUpSettings, {
            title: "Supplier",
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
                    key: "ERPPLANTCODE",
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
                    key: "PRICELEVEL",
                    title: "TYPE",
                    hidden: false,
                    noSearch: false
                }
            ]
        });
        this.suppliergenericUnitGrid.show();
    }

    supplierdblClickPopupItem(event) {
        this.productObj.SupplierName = event.ACNAME;
        this.productObj.SUPCODE = event.ACID;
    }
    supplierchangeevent() {
        this.productObj.SupplierName = null;
        this.productObj.SUPCODE = null;

    }
}