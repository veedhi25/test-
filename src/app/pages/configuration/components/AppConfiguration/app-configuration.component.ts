import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BooleanLiteral } from 'typescript';
import { CompanyTypeEnum } from '../../../../common/interfaces/TrnMain';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';

@Component(
  {
    selector: 'appconfiguration',
    templateUrl: './app-configuration.component.html',

  }
)

export class AppConfigurationComponent implements OnInit, AfterViewInit {
  supplierMasterList: any[] = [
    { label: 'Title', values: 'Title', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Phone', values: 'Phone', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Address1', values: 'Address1', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Address2', values: 'Address2', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'City', values: 'City', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'District', values: 'District', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Area', values: 'Area', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Postal Code', values: 'PostalCode', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Email', values: 'Email', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'GST Type', values: 'GSTType', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'GSTNO', values: 'GSTNO', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    // { label: 'Location Type', values: 'LocationType', selected: false, KeyType: 'SupplierMaster',formName:"Supplier" },
    { label: 'PANNO', values: 'PANNO', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'State', values: 'State', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Vat No', values: 'VATTNO', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Aadhar No', values: 'AadharNo', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    // { label: 'Invoice Type', values: 'InvoiceType', selected: false, KeyType: 'SupplierMaster',formName:"Supplier" },
    { label: 'Purchase Mode', values: 'PurhcaseMode', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Allow Credit', values: 'AllowCredit', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Credit Limit', values: 'CreditLimit', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Credit Days', values: 'CreditDays', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Currency', values: 'Currency', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Remarks', values: 'Remarsk', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'SalesMan', values: 'SalesMan', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Distance', values: 'Distance', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Integration Type', values: 'IntegrationType', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Status', values: 'Status', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'ERP Plant Code', values: 'ERPPlantCode', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Purchase Type', values: 'Purchase Type', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'JobWork', values: 'JobWork', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'PoSupplier', values: 'PoSupplier', selected: false, KeyType: 'SupplierMaster', formName: "Supplier" },
    { label: 'Drug License No 1', values: 'DLNO1', selected: false, KeyType: 'SupplierMaster', formName: 'Supplier' },
    { label: 'Drug License No 2', values: 'DLNO2', selected: false, KeyType: 'SupplierMaster', formName: 'Supplier' },
    { label: 'Drug License No 3', values: 'DLNO3', selected: false, KeyType: 'SupplierMaster', formName: 'Supplier' },
    { label: 'Drug License No 4', values: 'DLNO4', selected: false, KeyType: 'SupplierMaster', formName: 'Supplier' },

  ]

  customerMasterList = [
    { label: 'Title', values: 'Title', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Phone', values: 'Phone', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Address1', values: 'Address1', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Address2', values: 'Address2', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'City', values: 'City', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'VILLAGE', values: 'VILLAGE', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'VILLAGECODE', values: 'VILLAGECODE', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'KHASRA', values: 'KHASRA', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'KHASHRAAREA', values: 'KHASHRAAREA', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'District', values: 'District', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Area', values: 'Area', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'PostalCode', values: 'PostalCode', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Email', values: 'Email', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'GST Type', values: 'GSTType', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'GST No', values: 'GST No', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'PANNO', values: 'PANNO', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'VatNo', values: 'VATNO', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'AadharNo.', values: 'AadharNo', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Payment Mode', values: 'PaymentMode', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Allow Credit', values: 'AllowCredit', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Credit Limit', values: 'CreditLimit', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Credit Days', values: 'CreditDays', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Currency', values: 'Currency', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Discount%', values: 'DiscountPer', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    // { label: 'CustomerCategory', values: 'CustomerCategoruy', selected: false, KeyType: 'customerMaster',formName:'Customer' },
    { label: 'CustomerID', values: 'CustomerID', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Remarks', values: 'Remarks', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'SalesMan', values: 'SalesMan', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Distance', values: 'Distance', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Integration Type', values: 'IntegrationType', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Status', values: 'Status', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Transporter Name', values: 'TransporterName', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Anniversary', values: 'Anniversary', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Birthday', values: 'Birthday', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Price Level', values: 'Price Level', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Category', values: 'Category', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Sales Type', values: 'Sales Type', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Global Customer', values: 'GlobalCustomer', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Drug License No 1', values: 'DLNO1', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Drug License No 2', values: 'DLNO2', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Drug License No 3', values: 'DLNO3', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Drug License No 4', values: 'DLNO4', selected: false, KeyType: 'customerMaster', formName: 'Customer' },
    { label: 'Caste', values: 'Caste', selected: false, KeyType: 'customerMaster', formName: 'Customer' },

  ]
  itemMasterList = [
    { label: 'MCode', values: 'MCode', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Alias Code', values: 'Alias Code', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Discount', values: 'Discount', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Bar Code', values: 'Bar Code', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Product Name', values: 'Product Name', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Description', values: 'Description', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Manufacturer', values: 'Manufacturer', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Product Type', values: 'Product Type', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Base Unit', values: 'Base Unit', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Weight', values: 'Weight', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'MRP', values: 'MRP', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Selling Price', values: 'Selling Price', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Landing Price', values: 'Landing Price', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'GST', values: 'GST', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Warehouse', values: 'Warehouse', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'HSN Code', values: 'HSN Code', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Focus On Packing', values: 'FocusPacking', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Batch & Expiry', values: 'BatchExpiry', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Decimal Required Quantity', values: 'RequiredQTY', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Item Offer', values: 'ItemOffer', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Keep Focus Rate', values: 'FocusRate', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Sales Tax', values: 'SalesTax', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Inclusinve Tax', values: 'Inclusive', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Rack Number', values: 'RackNumber', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Price Level Formula', values: 'LevelFormula', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Supplier Name', values: 'Supplier', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'DRUG TYPE', values: 'DRUG TYPE', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Allow Negative', values: 'Allow Negative', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'PARENT', values: 'PARENT', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'NO OF SERIAL', values: 'NO OF SERIAL', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Discontinue', values: 'Discontinue', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'SHELFLIFE', values: 'SHELFLIFE', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Loyalty Allowed', values: 'Loyalty Allowed', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Cess', values: 'Cess', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Tax Slab', values: 'Tax Slab', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Restaurant Category', values: 'Restaurant Category', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'variant', values: 'variant', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Default Sell Unit', values: 'Default Sell Unit', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Default Purchase Unit', values: 'Default Purchase Unit', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Allow Indent Raise', values: 'Allow Indent Raise', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Can Sales', values: 'Can Sales', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Can Purchase', values: 'Can Purchase', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Maximum Stock', values: 'Maximum Stock', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Minimum Stock', values: 'Minimum Stock', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Minimum Order Qty', values: 'Minimum Order Qty', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Purchase Price', values: 'Purchase Price', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Wholesale Price', values: 'Wholesale Price', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },
    { label: 'Inter Company Price', values: 'Inter Company Price', selected: false, KeyType: 'itemMaster', formName: 'Product Master' },

  ]

  formName: string;
  valueFound: any = false;
  checked: any = true;
  public appConfigurationSettings: AppConfigurationInterface = new AppConfigurationInterface();
  showItemMaster: boolean = false;
  showCustomerMaster: boolean = false;
  showSupplierMaster: boolean = false;
  newItemMasterList: any[] = [];
  newArray: any[] = [];
  companynature: any[] = []
  multiselectSetting: any = {
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

  public warehouseList = [];
  constructor(public masterService: MasterRepo, private alertService: AlertService, private spinnerService: SpinnerService) {
    this.masterService.masterGetmethod_NEW("/getAllWarehouseList").subscribe((res) => {
      this.warehouseList = res;
      this.initialiseDefaults();
    }, error => {
      this.warehouseList = [];
    })
  }
  ngAfterViewInit() {

  }



  ngOnInit() {
    this.initializeKeySelect();
    this.masterService.masterGetmethod_NEW("/CompanyNature").subscribe((res) => {
      if (res.status = "ok") {
        this.companynature = res.result;
      } else {
        this.companynature = [];

      }
    }, error => {
      this.companynature = [];
    });
  }
  savedItemMasterSettings: any[] = [];
  savedCustomerMasterSettings: any[] = [];
  savedSalesInvoiceMasterSettings: any[] = [];
  savedSupplierMasterSettings: any[] = [];
  initialiseDefaults() {
    this.masterService.masterGetmethod("/getappconfiguration").subscribe((res) => {
      if (res.status == "ok") {
        this.appConfigurationSettings = <AppConfigurationInterface>(res.result);
        // console.log(this.appConfigurationSettings);
        this.functionKeySettingList.forEach(a => {
          this.appConfigurationSettings.funKeySetting.forEach(b => {
            if (a.label == b.label && a.formName == b.formName) {
              a.selected = b.selected;
            }
          })
        })
        this.appConfigurationSettings.funKeySetting.forEach(x => {
          if (x.KeyType == "itemMaster" && x.formName !== null) {
            this.savedItemMasterSettings.push(x);
          }
          if (x.KeyType == "SupplierMaster" && x.formName !== null) {
            this.savedSupplierMasterSettings.push(x);
          }
          if ((x.KeyType == "salesInvoiceInput" || x.KeyType == "salesInvoiceTable") && x.formName !== null) {
            this.savedSalesInvoiceMasterSettings.push(x);
          }
          if (x.KeyType == "customerMaster" && x.formName !== null) {
            this.savedCustomerMasterSettings.push(x);
          }

        })

        this.itemMasterList.forEach(a => {
          this.savedItemMasterSettings.forEach(b => {
            if (a.label == b.label && a.values == b.values) {
              a.selected = b.selected;
            }
          })
        })
        this.customerMasterList.forEach(a => {
          this.savedCustomerMasterSettings.forEach(b => {
            if (a.label == b.label && a.values == b.values) {
              a.selected = b.selected;
            }
          })
        })


        this.supplierMasterList.forEach(a => {
          this.savedSupplierMasterSettings.forEach(b => {
            if (a.label == b.label && a.values == b.values) {
              a.selected = b.selected;
            }
          })
        })

        if (this.appConfigurationSettings.SELECTEDWAREHOUSEFORITEMLOV != null && this.appConfigurationSettings.SELECTEDWAREHOUSEFORITEMLOV != "") {

          let warehouse = this.appConfigurationSettings.SELECTEDWAREHOUSEFORITEMLOV.split(',');
          this.appConfigurationSettings.WAREHOUSEFORITEMLOV = [];
          warehouse.forEach(x => {
            this.appConfigurationSettings.WAREHOUSEFORITEMLOV.push(this.warehouseList.filter(y => y.NAME == x)[0]);
          })

        }

      } else {
        this.alertService.error(res.message);
      }
    }, error => {
      this.alertService.error(error)
    })
  }

  cancelItemMaster() {
    this.showItemMaster = false;
  }
  cancelCustomerMaster() {
    this.showCustomerMaster = false;
  }
  cancelSupplierMaster() {
    this.showSupplierMaster = false;
  }


  onMultiSelect(event) {

  }

  saveMasterSettingConfiguration() {
    let _appsettingUrl: string = "/savemasterformconfigurations";
    let AllMasterFormKeySettingList: any[];
    AllMasterFormKeySettingList = [...this.itemMasterList];
    AllMasterFormKeySettingList.push(...this.supplierMasterList);
    AllMasterFormKeySettingList.push(...this.customerMasterList);
    //console.log(AllMasterFormKeySettingList.length);
    AllMasterFormKeySettingList.forEach(x => {
      delete x.show;
    });



    this.masterService.masterPostmethod(_appsettingUrl, AllMasterFormKeySettingList).subscribe((res) => {
      if (res.status == "ok") {
        this.spinnerService.hide();
        this.showItemMaster = false;
        this.showFunctionKeyPopUp = false;
        this.showMasterSettingPopUp = false;
        this.alertService.success(res.message);
      } else {
        this.spinnerService.hide();
        this.alertService.error(res.message);

      }
    }, error => {
      this.spinnerService.hide();
      this.alertService.error(error)
    })
    // console.log(this.itemMasterList.length);
    return;
  }

  saveAppConfiguration() {
    this.appConfigurationSettings.funKeySetting = this.functionKeySettingList;
    this.appConfigurationSettings.funKeySetting.forEach(x => {
      delete x.show;
    });

    if (this.appConfigurationSettings.WAREHOUSEWISESTOCKINITEMLOV) {
      if (!this.appConfigurationSettings.WAREHOUSEFORITEMLOV || this.appConfigurationSettings.WAREHOUSEFORITEMLOV.length == 0) {
        this.alertService.error("please select at least one warehouse for enabling warehouse wise stock in billing");
        return;
      }
    }

    if (!this.appConfigurationSettings.WAREHOUSEFORITEMLOV) {
      this.appConfigurationSettings.WAREHOUSEFORITEMLOV = [];
    }
    this.appConfigurationSettings.SELECTEDWAREHOUSEFORITEMLOV = this.appConfigurationSettings.WAREHOUSEFORITEMLOV.map(x => x.NAME).join(',')
    this.spinnerService.show("Saving application configurations. Please Wait.");
    this.masterService.masterPostmethod("/saveappconfiguration", this.appConfigurationSettings).subscribe((res) => {
      if (res.status == "ok") {
        this.spinnerService.hide();
        this.showItemMaster = false;
        this.showFunctionKeyPopUp = false;
        this.showMasterSettingPopUp = false;
        this.alertService.success(res.message);
      } else {
        this.spinnerService.hide();
        this.alertService.error(res.message);

      }
    }, error => {
      this.spinnerService.hide();
      this.alertService.error(error)
    })
  }

  openItemMaster() {
    this.showItemMaster = true;
  }
  openCustomerMaster() {
    this.showCustomerMaster = true;
  }
  openSupplierMaster() {
    this.showSupplierMaster = true;
  }



  enableMultiBusiness() {
    if (this.masterService.userProfile.username.toLowerCase() == "patanjali_user") {
      return true;

    } else {
      return false;
    }
  }
  isPatanjaliUser() {
    let currenuser: any = this.masterService.getCurrentUser();
    if (currenuser.username.toLowerCase() == "patanjali_user") {
      return true;

    } else {
      return false;
    }
  }

  changeCheckbox(item, event) {
    for (let a of this.itemMasterList) {
      if (a.label == item.label) {
        if (event.target.checked == true) {
          a.selected = true;
        }
        else {
          a.selected = false;
        }
      }
    }
    this.newItemMasterList.push(item)
  }

  showPickListOption() {
    if (this.masterService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "fitindia") {
      return true;
    }
    return false;
  }
  formNames: Array<FormName> = [
    { name: 'Sales Order' },
    { name: 'Proforma Invoice' },
    { name: 'DeliveryChallaan' },
    { name: 'Sales Invoice' },
    { name: 'Sales Return' },
    { name: 'Purchase Order' },
    { name: 'RFQ' },
    { name: 'Purchase Invoice' },
    { name: 'Material Receipt' },
    { name: 'Purchase Return' },
    { name: 'Stock Issue' },
    { name: 'Stock Settlement' },
    { name: 'Stock Settlement Approval' },
    { name: 'Inter Company Transfer In' },
    { name: 'Inter Company Transfer Out' },
    { name: 'Transfer In' },
    { name: 'Transfer Out' },
    { name: 'Opening Stock Entry' },
    { name: 'Repack Entry' }
  ];
  masterFormNames: Array<FormName> = [
    { name: 'Item Master', value: "itemMaster" },
    { name: 'Customer Master', value: "customerMaster" },
    { name: 'Supplier Master', value: "SupplierMaster" }
  ];

  showFunctionKeyPopUp: boolean = false;
  functionKeySettingList: FunSetting[] = [
    //Quotation Invoice
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Quotation Invoice', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Quotation Invoice', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Quotation Invoice', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Quotation Invoice', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Quotation Invoice', show: false },
    // { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Quotation Invoice', show: false },
    // { label: 'FROM PO', values: 'From po', selected: false, KeyType: 'func', formName: 'Quotation Invoice', show: false },
    // { label: 'IMPORT SO', values: 'Import so', selected: false, KeyType: 'func', formName: 'Quotation Invoice', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Quotation Invoice"
    },
    //sales order;
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Sales Order', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Sales Order', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Sales Order', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Sales Order', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Sales Order', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Sales Order', show: false },
    { label: 'FROM PO', values: 'From po', selected: false, KeyType: 'func', formName: 'Sales Order', show: false },
    { label: 'IMPORT SO', values: 'Import so', selected: false, KeyType: 'func', formName: 'Sales Order', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Sales Order"
    },

    //proforma invoice
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    // { label: 'F8 PRINT', values: 'Print', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    { label: 'FROM SO', values: 'From so', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Proforma Invoice"
    },

    //proforma invoice
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'DeliveryChallaan', show: false },
    // { label: 'F8 PRINT', values: 'Print', selected: false, KeyType: 'func', formName: 'Proforma Invoice', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'DeliveryChallaan', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'DeliveryChallaan', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'DeliveryChallaan', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'DeliveryChallaan', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'DeliveryChallaan', show: false },
    { label: 'FROM SO', values: 'From so', selected: false, KeyType: 'func', formName: 'DeliveryChallaan', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "DeliveryChallaan"
    },

    //sales invoice
    { label: 'F9 Load Cust Invoice', values: 'Load Cust Invoice', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'FROM SO', values: 'From so', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'Read Weight', values: 'Read Weight', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'Cancel SI', values: 'cancel si', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'From Proforma', values: 'From Proforma', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: '[ALT+N]New Cust', values: 'new cust', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'Load ItemImage', values: 'load itemimage', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'HOLD[ALT+C]', values: 'hold', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    { label: 'RECALL[ALT+R]', values: 'recall', selected: false, KeyType: 'func', formName: 'Sales Invoice', show: false },
    {
      label: "[ALT+T] Transport",
      values: "Transport",
      selected: true,
      KeyType: "func",
      formName: "Sales Invoice"
    },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Sales Invoice"
    },

    //sales return
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },
    { label: 'F8 PRINT', values: 'Print', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },
    { label: 'FROM DN', values: 'From dn', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },
    { label: 'CN TO CANCEL', values: 'cn to cancel', selected: false, KeyType: 'func', formName: 'Sales Return', show: false },

    // Purchase Order
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    { label: ' Import PO', values: 'Import PO', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    { label: 'Intend', values: 'Intend', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    { label: 'Import From SO', values: 'Import From SO', selected: false, KeyType: 'func', formName: 'Purchase Order', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Purchase Order"
    },

    // RFQ
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    { label: ' Import PO', values: 'Import PO', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    { label: 'Intend', values: 'Intend', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    { label: 'Import From SO', values: 'Import From SO', selected: false, KeyType: 'func', formName: 'RFQ', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "RFQ"
    },

    //purchase invoice
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'FROM MR', values: 'FROM MR', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'Supplier', values: 'supplier', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'F12 LOAD SAP', values: 'LOAD SAP', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'F2 IMPORT PI', values: 'Import PI', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'F7 FROM SI', values: 'FROM SI', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    { label: 'F9 Proforma Request', values: 'Proforma Request', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Purchase Invoice"
    },
    { label: 'FROM PO', values: 'From po', selected: false, KeyType: 'func', formName: 'Purchase Invoice', show: false },

    //Material Receipt
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'FROM MR', values: 'FROM MR', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'Supplier', values: 'supplier', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'F12 LOAD SAP', values: 'LOAD SAP', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'F2 IMPORT PI', values: 'Import PI', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'F7 FROM SI', values: 'FROM SI', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    { label: 'F9 Proforma Request', values: 'Proforma Request', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Material Receipt"
    },
    { label: 'FROM PO', values: 'From po', selected: false, KeyType: 'func', formName: 'Material Receipt', show: false },


    //purchase return starts
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    { label: 'IMPORT PR', values: 'IMPORT PR', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    { label: 'PR CANCEL', values: 'Pr cancel', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    { label: 'FROM CN', values: 'From cn', selected: false, KeyType: 'func', formName: 'Purchase Return', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Purchase Return"
    },

    //Inventory stock issue
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Stock Issue', show: false },
    { label: 'Issue To', values: 'Issue To', selected: false, KeyType: 'func', formName: 'Stock Issue', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Stock Issue', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Stock Issue', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Stock Issue', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Stock Issue', show: false },
    { label: '[ALT+T] Transport', values: 'Transport', selected: false, KeyType: 'func', formName: 'Stock Issue', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: "Stock Issue"
    },

    //STOCK SETTLEMENT
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Stock Settlement', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Stock Settlement', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Stock Settlement', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Stock Settlement', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Stock Settlement', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: 'Stock Settlement'
    },
    //STOCK SETTLEMENT APPROVAL
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Stock Settlement Approval', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Stock Settlement Approval', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Stock Settlement Approval', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Stock Settlement Approval', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Stock Settlement Approval', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: 'Stock Settlement Approval'
    },
    {
      label: "[ALT+U] UNAPPROVED LIST",
      values: "unapproved list",
      selected: false,
      KeyType: "func",
      formName: 'Stock Settlement Approval'
    },
    //openning stock entry
    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Opening Stock Entry', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Opening Stock Entry', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Opening Stock Entry', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Opening Stock Entry', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Opening Stock Entry', show: false },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Opening Stock Entry', show: false },
    { label: 'F2 IMPORT OP', values: 'Import OP', selected: false, KeyType: 'func', formName: 'Opening Stock Entry', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: 'Opening Stock Entry'
    },



    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Inter Company Transfer In', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Inter Company Transfer In', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Inter Company Transfer In', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Inter Company Transfer In', show: false },
    { label: 'From Transfer', values: 'From Transfer', selected: false, KeyType: 'func', formName: 'Inter Company Transfer In', show: false },
    { label: "F8 PRINT", values: "Print", selected: false, KeyType: "func", formName: 'Inter Company Transfer In' },
    { label: "F5 EDIT", values: "edit", selected: false, KeyType: "func", formName: 'Inter Company Transfer In', show: false },
    { label: "IR Cancel", values: "IR Cancel", selected: false, KeyType: "func", formName: 'Inter Company Transfer In', show: false },


    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Inter Company Transfer Out', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Inter Company Transfer Out', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Inter Company Transfer Out', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Inter Company Transfer Out', show: false },
    { label: "F8 PRINT", values: "Print", selected: false, KeyType: "func", formName: 'Inter Company Transfer Out' },
    { label: "F5 EDIT", values: "edit", selected: false, KeyType: "func", formName: 'Inter Company Transfer Out', show: false },
    { label: "IC Cancel", values: "IC Cancel", selected: false, KeyType: "func", formName: 'Inter Company Transfer Out', show: false },



    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Transfer In', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Transfer In', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Transfer In', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Transfer In', show: false },
    { label: 'From Transfer', values: 'From Transfer', selected: false, KeyType: 'func', formName: 'Transfer In', show: false },
    { label: "F8 PRINT", values: "Print", selected: false, KeyType: "func", formName: 'Transfer In' },


    { label: 'Hide Detail [F1]', values: 'Hide Detail', selected: false, KeyType: 'func', formName: 'Transfer Out', show: false },
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Transfer Out', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Transfer Out', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Transfer Out', show: false },
    { label: "F8 PRINT", values: "Print", selected: false, KeyType: "func", formName: 'Transfer Out' },
    { label: 'F5 EDIT', values: 'edit', selected: false, KeyType: 'func', formName: 'Transfer Out', show: false },




    //repack entry
    { label: 'F4 VIEW', values: 'view', selected: false, KeyType: 'func', formName: 'Repack Entry', show: false },
    { label: 'F3 RESET', values: 'reset', selected: false, KeyType: 'func', formName: 'Repack Entry', show: false },
    { label: 'F6 SAVE', values: 'save', selected: false, KeyType: 'func', formName: 'Repack Entry', show: false },
    { label: 'Products', values: 'Products', selected: false, KeyType: 'func', formName: 'Repack Entry', show: false },
    {
      label: "F8 PRINT",
      values: "Print",
      selected: false,
      KeyType: "func",
      formName: 'Repack Entry'
    },

  ];
  filteredFunctionKeySettingList: FunSetting[];
  selectedItem: string;

  openKeySetting() {
    this.showFunctionKeyPopUp = true;
    this.initializeKeySelect();
  }
  hideFunctionKeyPopUp() {
    this.showFunctionKeyPopUp = false;
    this.initialiseDefaults();
  }
  saveFunctionKeySetting() {
    this.showFunctionKeyPopUp = false;
  }

  onFunctionKeyChange(label: any) {
    this.functionKeySettingList.forEach(a => {
      if (a.label == label && a.formName == this.selectedItem) {
        a.selected = !a.selected;
      }
    })
  }

  onFormSelect(formName: string) {
    this.formName = formName;
    this.selectedItem = formName;
    this.functionKeySettingList.forEach(x => {
      if (x.formName == formName) {
        x.show = true;
      }
      else {
        x.show = false;
      }
    })
  }
  initializeKeySelect() {
    this.selectedItem = this.formName = "Sales Order";
    this.functionKeySettingList.forEach(x => {
      if (x.formName == this.selectedItem) {
        x.show = true;
      }
    })
  }
  showMasterSettingPopUp: boolean = false;
  openMasterPopupSetting() {
    this.showMasterSettingPopUp = true;
    this.initializeMasterFormSetting();
  }
  hideMasterSettingPopUp() {
    this.showMasterSettingPopUp = false;
  }
  selectedMasterForm: string;
  onMasterFormSelect(data: FormName) {
    this.selectedMasterForm = data.value;
    this.formName = data.name;
  }

  onCustomerMasterChange(item: MasterFormKeySetting) {
    // console.log(item);
    this.customerMasterList.forEach(a => {
      if (a.label == item.label && a.values == item.values) {
        a.selected = !a.selected;
      }
    })
  }
  onSupplierMasterChange(item: MasterFormKeySetting) {
    this.supplierMasterList.forEach(a => {
      if (a.label == item.label && a.values == item.values) {
        a.selected = !a.selected;
        // console.log("reached inside and value is",a);
      }
    })
  }
  onItemMasterChange(item: MasterFormKeySetting) {

    this.itemMasterList.forEach(a => {
      if (a.label == item.label && a.values == item.values) {
        a.selected = !a.selected;
        // console.log("reached inside and value is",a);
      }
    })
  }

  onShowPurchaseHistoryChange(value) {
    if (value == true) {
      this.appConfigurationSettings.SHOWPURCHASEHISTORY = 1;
    }
    else {
      this.appConfigurationSettings.SHOWPURCHASEHISTORY = 0;
    }

  }
  onShowShowDeliveryBoyChange(value) {
    if (value == true) {
      this.appConfigurationSettings.SHOWDELIVERYBOY = 1;
    }
    else {
      this.appConfigurationSettings.SHOWDELIVERYBOY = 0;
    }

  }
  onAllowExpireItemChange(value) {
    if (value == true) {
      this.appConfigurationSettings.ALLOWEXPIREDITEMINRETURN = 1;
    }
    else {
      this.appConfigurationSettings.ALLOWEXPIREDITEMINRETURN = 0;
    }
  }
  initializeMasterFormSetting() {
    this.selectedMasterForm = "itemMaster";

    this.masterService.masterGetmethod("/getmasterformsettingonly").subscribe((res) => {
      if (res.status == "ok") {
        let AllMasterFormSettingList = <MasterFormKeySetting[]>(res.result);
        AllMasterFormSettingList.forEach(x => {
          if (x.KeyType == "itemMaster" && x.formName !== null) {
            this.savedItemMasterSettings.push(x);
          }
          else if (x.KeyType == "customerMaster" && x.formName !== null) {
            this.savedCustomerMasterSettings.push(x);
          }
          else if (x.KeyType == "SupplierMaster" && x.formName !== null) {
            this.savedSupplierMasterSettings.push(x);
          }

        });
        this.itemMasterList.forEach(a => {
          this.savedItemMasterSettings.forEach(b => {
            if (a.label == b.label && a.values == b.values) {
              a.selected = b.selected;
            }
          })
        })
        this.customerMasterList.forEach(a => {
          this.savedCustomerMasterSettings.forEach(b => {
            if (a.label == b.label && a.values == b.values) {
              a.selected = b.selected;
            }
          })
        })

        this.supplierMasterList.forEach(a => {
          this.savedSupplierMasterSettings.forEach(b => {
            if (a.label == b.label && a.values == b.values) {
              a.selected = b.selected;
            }
          })
        })

      } else {
        this.alertService.error(res.message);
      }
    }, error => {
      this.alertService.error(error)
    });
    //
  }
}


export class AppConfigurationInterface {

  public NOOFDAYSFORPURCHASEEDIT: string;
  public NOOFDAYSFORBILLCANCEL: string;
  public NOOFDAYSFORCREDITNOTE: string;
  public NOOFDAYSFORPURCHASECANCEL: string;
  public NOOFDAYSFORBILLEDIT: string;
  public DEFAULTQUANTITY: string;
  public SHOWDSMONMANUALSO: number;
  public SHOWPRINTPREVIEW: string;
  public EnableParentMrpAsSalesRateOnEDI: string;
  public SHOWCOMBOITEMDETAILS: string;
  public SHOWPICKLISTONLY: string;
  public BUTTOMMARGIN: number;
  public LEFTMARGIN: number;
  public BATCHPREVIEW: string;
  public VALIDATEAADHARNO: string;
  public ALLOWEXPIREDITEMSALE: string;
  public CREATEVARIANTITEMONPRODUCTMASTER: string;
  public AUTOSCHEME: string;
  public ENABLEBILLREMINDER: string;
  public EnableDayStartDayClose: string;
  public SOTOSIITEMMERGE: string;
  public ENABLEMULTIBUSINESS: boolean;
  public POITEMMERGE: string;
  public ENABLETAXINVOICEMAIL: string;
  public ENABLEBILLLOCKING: string;
  public BarcodePrinter: string;
  public ENABLEAUTOALIASCODE: string;
  public ENABLECREDITNOTEMAIL: string
  public ENABLEPURCHASEMAIL: string;
  public ENABLEDEBITNOTEMAIL: string;
  public HIDEBATCH: string;
  public HideCostpriceInBatch: string;
  public ENABLEBATCHSRATE: string;
  public ENABLEEXPIREDRETURNINPURCHASE: string;
  public ENABLEINDENTDELIVERY: string;
  public ENABLEEXPIREDRETURNINSALES: string;
  public WAREHOUSEWISESTOCKINITEMLOV: string;
  public HIDEMFGDATE: string;
  public HIDEEXPDATE: string;
  public funKeySetting: FunSetting[];
  public itemMasterSetting: MasterFormKeySetting[];
  public customerMasterSetting: MasterFormKeySetting[];
  public supplierMasterSetting: MasterFormKeySetting[];
  public SalesInvoiceMasterSetting: MasterFormKeySetting[];
  public IsMRPBilling: boolean;
  public MRtoSI: boolean;
  public EnableFocusOnSalesManOnBilling: any;
  public disableRepeatProductInsale: boolean;
  public enableMultiSeriesInSales: boolean;
  public hideSuffixInBill: boolean;
  public enableMultiUnitOnSoToSI: boolean;
  public enableZeroStockItemLoadInSoToSI: boolean;
  public COMPANYNATURE: CompanyTypeEnum;
  public SHOWPURCHASEHISTORY: number;
  public ALLOWEXPIREDITEMINRETURN: number;
  public SHOWDELIVERYBOY: number;
  public AllowProductionQC: boolean;
  public TOTALNOOFUSER: number;
  public WAREHOUSEFORITEMLOV: any[];
  public SELECTEDWAREHOUSEFORITEMLOV: string;
  public ROUNDOFFLIMITERINSALES: string;
  public ENABLEROUNDOFFINSALES: string;
  public ROUNDOFFLIMITERINPURCHASE: string;
  public ENABLEROUNDOFFINPURCHASE: string;
  public EnableLiveChatBot: number;
  public EnableCustomSms: number;
  public PoNumberMandatoryFlag: number;
  public ENABLESESSIONMANAGEMENT: string;
  public ENABLEOFFLINESALE: number;
  public EnableBatchwiseItemSearch: boolean;
  public enableSupplierWiseTermsAndConditionInPO: boolean;
  public SORTINGBATCHSELECTIONFORSALES: string;
  public enableSchemeInSales: boolean;
  public enableAutoDebitNote: boolean;
  public enableAdvanceOptionInSalesOrder: boolean;
  public defaultCustomerAsLocal: boolean;
  public enableTranOfScheduledNarcoticDrugWithLicenseOnly: string;
  public IsEnableHCategory: boolean;
  public gstIncludedIndDiscountOnPurchase: boolean;
  public gstIncludedPrimaryDiscountOnPurchase: boolean;
  public gstIncludedSecondaryDiscountPurchase: boolean;
  public allowSupplierInIndent: string;
  public allowPhoneInCustomerLOV: string;

}

export class MasterFormKeySetting {
  public label: string;
  public values: string;
  public selected: boolean;
  public KeyType: string;
  public formName?: string;
  public show?: boolean;
}
export class FunSetting {
  public label: string;
  public values: string;
  public selected: boolean;
  public KeyType: string;
  public formName?: string;
  public show?: boolean;
}
export interface FormName {
  name: string;
  value?: string;
}
