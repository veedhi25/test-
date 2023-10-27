import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PoplistComponent } from '../PopItemList/PopItems.component';
import { Scheme } from './Scheme';
import { SchemeList } from './Scheme';
import { PopCategoryComponent } from '../../../common/popupLists/PopupCategoryList/PopCategory.component';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { MasterRepo } from '../../../common/repositories';
import { AlertService } from '../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { PopupClientSidePaginatedComponent } from '../../../common/popupLists/popupClientSidePaginated/popupClientSidePaginated';


@Component({
  selector: "SchemeMaster",
  templateUrl: "./SchemeMaster.html",
  styleUrls: ["../modal-style.css"]
})
export class SchemeComponent {
  bulkObj: any;
  DialogMessage: string = "Saving";
  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild("showList") showList: ElementRef;
  @ViewChild("showCat") showCat: ElementRef;
  @ViewChild("showQtyRange") showQtyRange: ElementRef;

  @ViewChild(PoplistComponent) itemListChild: PoplistComponent;
  @ViewChild(PopCategoryComponent) PopCatChild: PopCategoryComponent;
  @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("popUpOfferFamily") popUpOfferFamily: PopupClientSidePaginatedComponent;
  gridPopupSettingsForOfferFamily: GenericPopUpSettings = new GenericPopUpSettings();
  mode: string = "";
  SchemeObj: Scheme = <Scheme>{};
  saveItemList: any[] = [];
  getScheduleList: any = [];
  private returnUrl: string;
  isCategory = false;
  CategoryList: any[] = [];
  AllItemList: any[] = [];
  flag: string = "";
  enableTable = false;
  showRate: boolean = true;
  showAmount: boolean = false;
  DiscountRateType: number = 0;
  showQty: boolean = false;
  disableOfferOn: boolean = false;
  modeTitle: string;
  disableOnView: boolean = false;
  offerFamilyList: any[] = [];
  outletList: any[] = [];
  multiselectOutLetSetting: any = {
    singleSelection: false,
    text: 'Select Outlets',
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
    labelKey: 'COMPANYID',
    primaryKey: 'COMPANYID',
    position: 'bottom'

  };
  @ViewChild("genericGridDiscountedItem") genericGridDiscountedItem: GenericPopUpComponent;
  gridPopupSettingsForDiscountedItem: GenericPopUpSettings = new GenericPopUpSettings();
  constructor(
    private masterRepo: MasterRepo,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private loadingService: SpinnerService) {

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
    })


    this.SchemeObj.outletList =[];


    this.masterRepo.masterGetmethod_NEW("/getoutlets").subscribe((res) => {

      if (res.status == "ok") {
        this.outletList = res.result;
      }
    })




  }

  ngOnInit() {
    this.SchemeObj = <Scheme>{};
    this.SchemeObj.SchemeList = [];
    this.isCategory = false;
    this.addRow();
    this.mode = "add";
    this.enableTable = false;
    this.masterRepo.getAllSchedule()
      .subscribe(res => {
        this.getScheduleList = res ? res : [];
      }
      );
    this.SchemeObj.OfferOn = "rate";
    this.showRate = true;
    this.showAmount = false;
    this.showQty = false;
    this.disableOfferOn = false;
    this.masterRepo.getListOfAny("/getschemeOfferFamily").subscribe(res => { this.offerFamilyList = res ? res : []; });
    try {
      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }
      if (!!this._activatedRoute.snapshot.params["schemeID"]) {
        let schemeID = this._activatedRoute.snapshot.params["schemeID"];
        var schemeType = this._activatedRoute.snapshot.params["schemeType"];
        this.loadingService.show("Getting Data, please wait...");
        this.masterRepo.getSchemeByID(schemeID, schemeType).subscribe(
          (data: any) => {
            this.loadingService.hide();
            if (data.status == "ok") {
              let schemeMaster = data.result;
              this.loadSchemeData(schemeMaster);

              if (this._activatedRoute.snapshot.params["mode"] === "edit") {
                this.modeTitle = "Edit Scheme";
              } else if (this._activatedRoute.snapshot.params["mode"] === "view") {
                this.modeTitle = "View Scheme";
              }

              this.mode = "edit";
            } else {
              this.mode = "";
              this.modeTitle = "Edit- Error in Scheme ";
              this.alertService.error("Falied to load data.")
            }
          }, error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2- Error in Loading Data ";
            this.alertService.error("Failed to load data.")

          }
        );

      } else {
        this.mode = "add";
        this.modeTitle = "Add Scheme";

      }
      if (!!this._activatedRoute.snapshot.params["mode"]) {
        if (this._activatedRoute.snapshot.params["mode"] == "view") {
          this.disableOnView = true;
        }
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  loadSchemeData(schemeMaster) {
    this.SchemeObj = schemeMaster;
    //  this.SchemeObj.DisID = schemeMaster.DisID;
    //  this.SchemeObj.SchemeName = schemeMaster.SchemeName;
    //  this.SchemeObj.ScheduleID = schemeMaster.ScheduleID;
    //  this.SchemeObj.SchemeType = schemeMaster.SchemeType;
    //  this.SchemeObj.OfferOn = schemeMaster.Offeron;
    this.enableTable = true;
    if (schemeMaster.SchemeType === "bydiscount") {
      this.SchemeObj.DiscountType = schemeMaster.DiscountType;
      this.flag = schemeMaster.DiscountType;
    } else if (schemeMaster.SchemeType === "bybulk") {
      this.flag = "Bulk";
    } else if (schemeMaster.SchemeType === "byslabdiscount") {
      this.flag = "TotalAmount";
    }

    if (schemeMaster.Offeron == "rate") {
      this.showRate = true;
      this.showAmount = false;
      this.showQty = false;
    } else if (schemeMaster.Offeron == "amount") {
      this.showRate = false;
      this.showAmount = true;
      this.showQty = false;
    } else if (schemeMaster.Offeron == "quantity") {
      this.showRate = false;
      this.showAmount = false;
      this.showQty = true;
    }




  }

  ngAfterViewInit() {

  }

  showPopup() {
    this.genericGridCustomer.show();
  }





  DiscountTypeChangeEvent() {
    this.disableOfferOn = false;
    this.SchemeObj.SchemeList = [];
    this.addRow();
  }
  selectedDiscountType: any;

  comboGrpAmt = false;
  comboGrpRate = false;




  addRow() {
    try {
      var newRow = <SchemeList>{};
      this.SchemeObj.SchemeList.push(newRow);
    } catch (ex) {
      alert(ex);
    }
  }


  activerowIndex: number = 0;
  PlistTitle: string;

  /** Key Event/ Tab Event / EnterEvent */

  CatkeyEvent(index) {
    this.PlistTitle = "Category List";
    this.activerowIndex = index;
    this.disableOfferOn = true;
    this.flag = "Category";
    this.gridPopupSettingsForCustomer = {
      title: "Category",
      apiEndpoints: `/getMenuitemPagedListForScheme/Category`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "variantname",
          title: "Category Type",
          hidden: false,
          noSearch: false
        },
        {
          key: "category",
          title: "Category",
          hidden: false,
          noSearch: false
        }

      ]
    };
    this.genericGridCustomer.show(this.SchemeObj.SchemeList[index].Mcode);
  }

  groupKeyEvent(index) {
    this.activerowIndex = index;
    this.disableOfferOn = true;
    this.gridPopupSettingsForCustomer = {
      title: "Group",
      apiEndpoints: '/getMenuitemPagedListForScheme/MGroup',
      defaultFilterIndex: 1,
      columns: [

        {
          key: "MENUCODE",
          title: "MENU CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "DESCA",
          title: "NAME",
          hidden: false,
          noSearch: false
        },

      ]
    };
    this.genericGridCustomer.show();
    // this.addRow();
  }

  parentKeyEvent(index) {
    this.activerowIndex = index;
    this.disableOfferOn = true;
    this.gridPopupSettingsForCustomer = {
      title: "Parent",
      apiEndpoints: '/getMenuitemPagedListForScheme/Parent',
      defaultFilterIndex: 1,
      columns: [

        {
          key: "MENUCODE",
          title: "MENU CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "DESCA",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "PARENT",
          title: "PARENT",
          hidden: false,
          noSearch: false
        }

      ]
    };
    this.genericGridCustomer.show();
  }

  itemKeyEvent(index) {
    this.activerowIndex = index;
    this.disableOfferOn = true;
    this.flag = "Item";
    this.gridPopupSettingsForCustomer = {
      title: "Item list",
      apiEndpoints: '/getMenuitemPagedListForScheme/Item',
      defaultFilterIndex: 1,
      columns: [
        {
          key: "MENUCODE",
          title: "MENU CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "DESCA",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "PARENT",
          title: "PARENT",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.genericGridCustomer.show();
  }

  ItemkeyEvent(index) {
    this.PlistTitle = "Item List";
    this.activerowIndex = index;
    this.Model1open();
    return false;
  }

  nextRow(i) {
    this.addRow();
    let nextindex = this.activerowIndex + 1;


    switch (this.SchemeObj.DiscountType) {
      case 'MCAT':
        setTimeout(() => {
          this.masterRepo.focusAnyControl('category' + nextindex);

        }, 200);
        break;

      case 'MGroup':
        setTimeout(() => {
          document.getElementById('groupCode' + nextindex).focus();
        }, 200);
        break;

      case 'Parent':
        setTimeout(() => {
          document.getElementById('parentCode' + nextindex).focus();
        }, 200);
        break;

      case 'Mcode':
        setTimeout(() => {
          this.masterRepo.focusAnyControl('itemCode' + nextindex);
        }, 200);
        break;

      case 'Bulk':
        setTimeout(() => {
          document.getElementById('bulkItemCode' + nextindex).focus();
        }, 200);
        break;

      case 'TotalAmount':
        setTimeout(() => {
          document.getElementById('gtamount' + nextindex).focus();
          this.activerowIndex++;
        }, 200);
        break;
      default:
        if (this.SchemeObj.SchemeType == 'bybulk') {
          setTimeout(() => {
            this.masterRepo.focusAnyControl('itemCode' + nextindex);
            this.activerowIndex++;
          }, 200);




        }

        break;
    }

  }


  /**Popup Event */
  Model1open() {
    switch (this.PlistTitle) {
      case "Item List":
        this.showList.nativeElement.style.display = 'block';
        if (this.flag == "MGroup") {
          this.PlistTitle = "Main-Group-List"

        }
        else if (this.flag == "Parent") {
          this.PlistTitle = "Parent-List"

        }
        else if (this.flag == "Bulk" || this.flag == "Mcode") {

        }

        break;
      case "Category List":
        this.PopCatChild.getCatList();
        break;

    }
  }
  RangeQtyClose() {
    this.showQtyRange.nativeElement.style.display = 'none';
  }


  dblClickPopupItem(value) {

    if (this.flag == "customerpopup") {
      if (this.SchemeObj.CustomerType == "onCustomerCategory") {
        this.SchemeObj.Account = value.CATEGORY_NAME;
        this.SchemeObj.AccountName = value.CATEGORY_NAME;
      }
      else if (this.SchemeObj.CustomerType == "onCustomer") {
        this.SchemeObj.Account = value.ACID;
        this.SchemeObj.AccountName = value.ACNAME;
      }
      this.flag = null;
    }
    else if (this.flag == "Item") {
      this.SchemeObj.SchemeList[this.activerowIndex].MENUCODE = value.MENUCODE;
      this.SchemeObj.SchemeList[this.activerowIndex].DESCA = value.DESCA;
      this.SchemeObj.SchemeList[this.activerowIndex].Mcode = value.MCODE;
      this.SchemeObj.SchemeList[this.activerowIndex].Parent = value.PARENT;
      if (this.SchemeObj.SchemeType == "bybulk" || this.SchemeObj.SchemeType == "bybulkonanotheritem") {
        document.getElementById('buyingQty' + this.activerowIndex).focus();

      }
      else {
        this.focusToOffer();
      }
    }
    else if (this.flag == "Category") {
      this.SchemeObj.SchemeList[this.activerowIndex].MCategory = value.category;
      this.focusToOffer();
    }
    else if (this.SchemeObj.SchemeType == 'bybulk') {
      this.SchemeObj.SchemeList[this.activerowIndex].MENUCODE = value.MENUCODE;
      this.SchemeObj.SchemeList[this.activerowIndex].DESCA = value.DESCA;
      this.SchemeObj.SchemeList[this.activerowIndex].Mcode = value.MCODE;
      this.SchemeObj.SchemeList[this.activerowIndex].Parent = value.PARENT;
      this.masterRepo.focusAnyControl('buyingQty' + this.activerowIndex);

    }
  }

  TableRowclick(i) {
    this.activerowIndex = i
  }

  itemListClosed() {
    document.getElementById('tempBatch').style.display = 'none';
  }



  dblClickCategoryItem(value) {

    this.SchemeObj.SchemeList[this.activerowIndex].MCategory = value.MENUCAT;
    this.ItemkeyEvent(this.activerowIndex);
  }
  onSaveClicked() {
    if (this.SchemeObj.SchemeName == null || this.SchemeObj.ScheduleID == null) {
      this.alertService.warning("Scheme or schedule name is empty");
      return;
    }
    this.removeInvalidRows();
    this.submitSave();

  }
  submitSave() {
    this.loadingService.show("Saving Scheme, Please wait...");
    this.masterRepo.saveScheme(this.mode, this.SchemeObj).subscribe(data => {
      if (data.status == 'ok') {
        this.loadingService.hide();
        this.alertService.success("Scheme Saved Successfully !")
        this.SchemeObj = <Scheme>{};
        this.SchemeObj.SchemeList = [];
        this.router.navigate([this.returnUrl]);
      }
      else {
        this.loadingService.hide();
        console.log(data);
        this.alertService.error(data.result._body)
      }
    });
  }

  RangeList: any[] = []
  LoadRangeQty(value) {
    this.RangeList = value;
    this.RangeQtyClose();
  }



  onEnter() {
    this.disableOfferOn = true;
  }

  validateRows(value) {

    if (value.DESCA == null) {
      alert("Please add particulars");
      return;
    }
    if (value.DisRate == null) {
      alert("Please add Discount");
      return;
    }

    if (value.DiscountRateType == null) {
      alert("Please choose Discount Type");
      return;
    }
    this.addRow();
    var nextindex = this.activerowIndex + 1;
    var elmnt = document.getElementById("sno" + this.activerowIndex);
    setTimeout(() => {
      if (document.getElementById('menucode' + nextindex) != null) {
        document.getElementById('menucode' + nextindex).focus();
      }
    }, 500);

  }

  focusOnDisItemCode() {
    if (this.SchemeObj.SchemeType == "bybulkonanotheritem") {
      this.masterRepo.focusAnyControl('disitemCode' + this.activerowIndex);
    }
    else {
      this.focusToOffer();
    }
  }
  focusToOffer() {

    if (this.SchemeObj.OfferOn == "rate") {
      this.masterRepo.focusAnyControl('rate' + this.activerowIndex);
    } else if (this.SchemeObj.OfferOn == "amount") {
      this.masterRepo.focusAnyControl('amount' + this.activerowIndex);
    } else if (this.SchemeObj.OfferOn == "quantity") {
      this.masterRepo.focusAnyControl('qty' + this.activerowIndex);

    }
  }

  focusTolessthan() {
    document.getElementById('ltamount' + this.activerowIndex).focus();
  }

  focustoGiftVou() {
    document.getElementById('giftVoucher' + this.activerowIndex).focus();
  }

  focusToPart() {
    if (this.flag == "Bulk" || this.flag == "TotalAmount") {
      document.getElementById('particulars' + this.activerowIndex).focus();
    }
  }

  deleteRow() {
    if (confirm('Are you sure u you want to delete the Row?')) {
      this.SchemeObj.SchemeList.splice(this.activerowIndex, 1);
      if (this.SchemeObj.SchemeList.length === 0) {
        this.addRow();
      }
    }
  }



  cancel() {

    this.router.navigate(['./pages/configuration/scheme/schemeList']);

  }

  removeInvalidRows() {
    let validScheme = [];
    for (var s of this.SchemeObj.SchemeList) {
      if (s.Mcode == null && s.MCategory == null && this.SchemeObj.SchemeType != "byslabbilldiscount") { }
      else {
        validScheme.push(s);
      }
    }
    this.SchemeObj.SchemeList = validScheme;
    //   if(this.SchemeObj.DiscountType=='Mcode')
    //   {
    //     this.SchemeObj.SchemeList = this.SchemeObj.SchemeList.filter(x=> x.Mcode !== null);
    //   }
    // if(this.SchemeObj.DiscountType == "MCAT"){
    //   this.SchemeObj.SchemeList = this.SchemeObj.SchemeList.filter(x=> x.MCategory !== null);
    // }

  }
  CustomerTypeCodeEvent() {
    if (this.SchemeObj.CustomerType == null || this.SchemeObj.CustomerType == "") { this.alertService.info("Please choose Customer Type"); return; }
    if (this.SchemeObj.CustomerType == "onCustomer") {
      this.gridPopupSettingsForCustomer = {
        title: "Customer",
        apiEndpoints: '/getAccountPagedListByPType/PA/C',
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
          }
          ,
          {
            key: "GEO",
            title: "TYPE",
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    else if (this.SchemeObj.CustomerType == "onCustomerCategory") {
      this.gridPopupSettingsForCustomer = {
        title: "Customer Category",
        apiEndpoints: '/getCustomerCategoryPagedList',
        defaultFilterIndex: 0,
        columns: [
          {
            key: "CATEGORY_NAME",
            title: "Name",
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    this.flag = "customerpopup";
    this.genericGridCustomer.show();
  }
  accountnamechanges() {
    this.SchemeObj.Account = null;;
    this.SchemeObj.AccountName = null;
  }
  schemeTypeChange() {
    this.masterSchemeChangeParameter();
    if (this.SchemeObj.SchemeType == 'byslabdiscount') {
      this.SchemeObj.slabDiscountType = 'quantityRange';
    }
    else if (this.SchemeObj.SchemeType == 'byslabbilldiscount') {
      this.SchemeObj.slabDiscountType = 'amountRange';
    }
    else {
      this.SchemeObj.slabDiscountType = null;
    }
    if (this.SchemeObj.SchemeType != 'byslabbilldiscount') {
      this.SchemeObj.DiscountType = 'Mcode';
    }
  }
  discountTypeChange() {
    this.masterSchemeChangeParameter();
    this.SchemeObj.OfferOn = 'rate'

  }
  masterSchemeChangeParameter() {
    this.enableTable = true;
    this.SchemeObj.SchemeList = [];
    this.SchemeObj.VAT = 0;
    this.addRow();
    // if(this.SchemeObj.SchemeType=='byslabdiscount')
    // {
    //   this.SchemeObj.slabDiscountType='quantityRange';
    // }
  }
  offerFamilyEnterKryEvent() {
    this.gridPopupSettingsForOfferFamily = Object.assign(new GenericPopUpSettings, {
      title: "Offer Family",

      defaultFilterIndex: 0,
      columns: [
        {
          key: "name",
          title: "Name",
          hidden: false,
          noSearch: false
        },
        {
          key: "discountType",
          title: "Discount Type",
          hidden: false,
          noSearch: false
        },
        {
          key: "offerOn",
          title: "Offer On",
          hidden: false,
          noSearch: false
        }
      ]
    });
    this.masterRepo.RemoveFocusFromAnyControl("offerfamilyinput");
    this.popUpOfferFamily.show(this.offerFamilyList);
  }
  dblClickPopupOfferFamily(value) {
    this.SchemeObj.offerFamily = value.name;
    this.SchemeObj.SchemeType = value.schemeType;
    this.SchemeObj.DiscountType = value.discountType;
    this.SchemeObj.OfferOn = value.offerOn;
    this.masterSchemeChangeParameter();
  }

  disitemKeyEvent(index) {
    this.activerowIndex = index;
    this.disableOfferOn = true;
    this.flag = "Item";
    this.gridPopupSettingsForDiscountedItem = {
      title: "Item list",
      apiEndpoints: '/getMenuitemPagedListForScheme/Item',
      defaultFilterIndex: 0,
      columns: [

        {
          key: "MENUCODE",
          title: "MENU CODE",
          hidden: false,
          noSearch: false
        },
        {
          key: "DESCA",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "PARENT",
          title: "PARENT",
          hidden: false,
          noSearch: false
        }

      ]
    };
    this.genericGridDiscountedItem.show();

  }

  dblClickPopupDiscountedItem(value) {
    this.SchemeObj.SchemeList[this.activerowIndex].DisItemName = value.DESCA;
    this.SchemeObj.SchemeList[this.activerowIndex].DisItemCode = value.MCODE;


    this.focusToOffer();

  }

  onMultiSelect(event) {

  }
}
