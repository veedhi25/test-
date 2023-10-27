import { Subject } from 'rxjs/Subject';
import { Component, ViewChild, Injector } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, TreeComponent } from 'angular-tree-component';
import { LocalDataSource, ServerDataSource } from '../../../../node_modules/ng2-smart-table/';
import 'style-loader!../Companies/smartTables.scss';
import { ProductMasterService } from './ProductMasterService';
import { SettingService, AppSettings } from "../../../../common/services/index";
import { Observable } from "rxjs/Observable";
import { ContextMenuComponent } from 'ngx-contextmenu';
import { AppComponentBase } from '../../../../app-component-base';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { FileUploaderPopupComponent, FileUploaderPopUpSettings } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { Product, RateDiscount } from '../../../../common/interfaces/ProductItem';

const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
    click: (tree, node, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
    }
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => node.setActiveAndVisible()
    //[KEYS.ENTER]: (tree, node, $event) =>  alert(`This is ${node.data.name}`)
  }
};

@Component({
  selector: "products",
  templateUrl: "./products.html",
  // styleUrls: ["../../../Style.css",'./modals.scss'],
  providers: [ProductMasterService, AuthService],
  styleUrls: ["../../../modal-style.css"],

})

export class ProductsComponent extends AppComponentBase {

  @ViewChild("fileUploadPopup") fileUploadPopup: FileUploaderPopupComponent;
  fileUploadPopupSettings: FileUploaderPopUpSettings = new FileUploaderPopUpSettings();
  private _treeEnable: Boolean = true;
  public get treeEnable(): Boolean { return this._treeEnable; }
  public set treeEnable(value: Boolean) { this._treeEnable = value; }
  public selectedNode: any;
  public nodes: any[] = [];
  @ViewChild(TreeComponent)
  public tree: TreeComponent;
  source: LocalDataSource = new LocalDataSource();
  AppSettings: AppSettings;
  productObj: Product = <Product>{};
  ProductHomeTabs: any[] = [];
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
  loadListSubject: Subject<any> = new Subject<any>();
  loadList$: Observable<any> = this.loadListSubject.asObservable();
  public homeTab: any = <any>{}
  menudata = [];
  userProfile: any = <any>{};
  orgType: any;
  isHeadoffice: any;
  CNAME: any;
  modeForHideAddProduct: any;
  // from='productmaster';

  // private userProfile: any;
  // private companyProfile: any;
  private reportHeaders: any[] = ['Product Code', 'Product Name', 'Mother Pack', 'Brand', 'Business Unit', 'Base Unit', 'Weight', 'Unit', 'Shelf Life', 'Description', 'Status', 'Alternate Unit', 'Conversion Factor', 'MRP', 'Selling Price', 'Approval'];
  private reportBody: any[] = ['MENUCODE', 'DESCA', 'MotherPack', 'Brand', 'BusinessUnit', 'BASEUNIT', 'GWEIGHT', 'Weighable', 'SHELFLIFE', 'Description', 'STATUS', 'ALTUNIT', 'CONFACTOR', 'MRP', 'SellingPrice', 'APPROVAL'];
  public reportData: any[] = [];

  constructor(private _alertService: AlertService,
    public injector: Injector,
    private MasterRepo: MasterRepo,
    public _authService: AuthService,
    // private router: Router,
    private ProductService: ProductMasterService,
    private setting: SettingService,
    private loadingService: SpinnerService
  ) {
    super(injector)
    this.userProfile = this._authService.getUserProfile();
    this.orgType = this.userProfile.CompanyInfo.ORG_TYPE;
    this.isHeadoffice = this.userProfile.CompanyInfo.isHeadoffice;
    this.CNAME = this.userProfile.CompanyInfo.companycode;
    try {
      this.AppSettings = this.setting.appSetting;
      this.InilizedProductObj();
      let data = [];

      let apiUrl = `${this.apiUrl}/GetAllProduct`;
      this.source = this.source = new ServerDataSource(this._http,
        {
          endPoint: apiUrl,
          dataKey: "data",
          pagerPageKey: "currentPage",
          pagerLimitKey: "maxResultCount"
        });
      // this.ProductService.GetAllProducts()
      // .subscribe(res => {
      //   data.push(<any>res);
      //   this.MasterRepo.PartialProductList.push(<any>res);
      //   console.log("from api");
      //   this.source.load(data);
      // }
      // );
      this.onMenuClick("productlist");
    } catch (ex) {
      this._alertService.error(ex)
    }


  }
  ngOnInit() {
    this.fileUploadPopupSettings = Object.assign(new FileUploaderPopUpSettings(),
      {
        title: "Import Products",
        sampleFileUrl: `/downloadExcelsFiles?filename=RetailerItemsSample`,
        uploadEndpoints: `/masterImport/RetailerItemMaster/nothing`,
        allowMultiple: false,
        acceptFormat: ".xlsx",
        filename: "RetailerItemsSample"
      });
  }
  InilizedProductObj() {
    this.productObj = <Product>{};
    this.productObj.PARENT = 'MI';
    this.productObj.Par = <Product>{};
    this.productObj.MajorGroup = <Product>{};
    this.productObj.ItemRateDiscount = <RateDiscount>{};
    this.productObj.MultiStockLevels = [];
    this.productObj.VAT = 0;

  }
  getChildren(node: any) {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(this.asyncChildren.map((c) => {
          return Object.assign({}, c, {
            hasChildren: node.level < 5
          });
        })), 1000);
      });
    } catch (ex) {
      this._alertService.error(ex)
    }
  }
  asyncChildren = [
    {
      name: 'child2.1',
      subTitle: 'new and improved'
    }, {
      name: 'child2.2',
      subTitle: 'new and improved2'
    }
  ];
  addNode(node) {
    try {
      //console.log(tree.treeModel.getFocusedNode());
      //  let node = Object.assign({}, this.tree.treeModel.getFocusedNode().data);
      // node.name = "next child";
      // node.uuid = "1005"
      // console.log(node);
      //tree.treeModel.getFocusedNode().data.children.push(node);
      var fNode = this.tree.treeModel.getFocusedNode();
      if (fNode == null) {
        //save on root
        this.tree.treeModel.nodes.push(node);
      }
      else {
        this.tree.treeModel.getFocusedNode().data.children.push(node);
      }
      this.tree.treeModel.update();
    } catch (ex) {
      this._alertService.error(ex)
    }
  }
  public printIt(barcode) {
    try {
      //alert("reached printIT")
      let printContents, popupWin;
      printContents = barcode;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1500px');
      // popupWin.document.open();
      popupWin.document.write(`
      <html>
          <head>                  
              <style>
                  .InvoiceHeader{
            text-align:center;
            font-weight:bold
        }
        p
        {
            height:5px;
        }
        table{
            margin:5px
        }
        .summaryTable{
            float: right;
            border: none;
        }

        .summaryTable  td{
            text-align:right;
            border:none;
        }

        .itemtable{
            border: 1px solid black;
            border-collapse: collapse;
        }
        .itemtable th{                
            height:30px;
            font-weight:bold;
        }
        .itemtable th, td {               
            border: 1px solid black;
            padding:2px;

        }
              </style>
          </head>
          <body onload="window.print();window.close()">
          <div>
          ${printContents}
          </div>
          </body>
      </html>`
      );
      popupWin.document.close();
    }
    catch (ex) {
      //this.alertService.error(ex)
    }
  }
  childrenCount(node: TreeNode): string {
    try {
      return node && node.children ? `(${node.children.length})` : '';
    } catch (ex) {
      this._alertService.error(ex)
    }
  }

  filterNodes(text, tree) {
    try {
      tree.treeModel.filterNodes(text, true);
    } catch (ex) {
      this._alertService.error(ex)
    }
  }

  activateSubSub(tree) {
    try {
      // tree.treeModel.getNodeBy((node) => node.data.name === 'subsub')
      tree.treeModel.getNodeById('PRG57952')
        .setActiveAndVisible();
    } catch (ex) {
      this._alertService.error(ex)
    }
  }


  customTemplateStringOptions = {
    // displayField: 'subTitle',
    isExpandedField: 'expanded',
    idField: 'uuid',
    getChildren: this.getChildren.bind(this),
    actionMapping,
    allowDrag: false
  }
  onEvent($event) {
  }

  searchItemEmitEvent(value) {
    this.activateSubSub(this.tree);
    var searchNode = this.tree.treeModel.getNodeById('PRG4047P');
    if (searchNode != null) {
      this.tree.treeModel.getNodeById("PRG4047P").expanded;
    }
  }
  AddItem() { }

  onselect(tree, $event) {
    try {
      //$event.stopPropagation();

      this.source = new LocalDataSource();
      this.selectedNode = tree.treeModel.getFocusedNode().data;
      this.loadListSubject.next(this.selectedNode);
      // var childproductList = this.MasterRepo.PartialProductList.filter(p => p.PARENT == this.selectedNode.id);
      // if (childproductList.length > 0) {
      //   console.log("from array");
      //   this.source.load(childproductList);
      // }
      // else {
      //   let data = [];
      //   this.ProductService.getParentWiseProduct(this.selectedNode.id)
      //     .subscribe(res => {
      //       data.push(<any>res);
      //       this.MasterRepo.PartialProductList.push(<any>res);
      //       console.log("from api");
      //       this.source.load(data);
      //     }
      //     );
      // }
    } catch (ex) {
      console.log(ex);
      this._alertService.error(ex)
    }
  }
  go($event) {
    try {
      $event.stopPropagation();
    } catch (ex) {
      this._alertService.error(ex)
    }
  }

  onTreeEnable(value: boolean) {
    try {
      this.treeEnable = value;
    } catch (ex) {
      this._alertService.error(ex)
    }
  }

  onMenuClick(name) {
    this.homeTab.name = name;
    this.homeTab.selectedNode = this.selectedNode;
    this.homeTab.mode = name == 'productlist' ? 'List' : "add";
    this.homeTab.active = true;
    this.ProductHomeTabs = [];
    let i = this.ProductHomeTabs.push(this.homeTab);
    //this.selectTab(i - 1);
  }
  activeTabEmitEvent(event) {
    this.homeTab.mode == event.mode
    this.ProductHomeTabs = [];
    this.modeForHideAddProduct = event.mode

    this.ProductHomeTabs.push(event);
    if (event.savedValue != null && event.mode == "add") {
      if (event.from == "group") {
        let addnode = { id: event.savedValue.MCODE, name: event.savedValue.DESCA, menucode: event.savedValue.MENUCODE, children: [] };
        this.addNode(addnode);
        this.InilizedProductObj();
      }
      else if (event.from == "product") {
        let addproduct = { MCODE: event.savedValue.MCODE, MENUCODE: event.savedValue.MENUCODE, DESCA: event.savedValue.DESCA, BASEUNIT: event.savedValue.BASEUNIT, PARENT: event.savedValue.PARENT };
        this.MasterRepo.PartialProductList.push(addproduct);
        var childproductList = this.MasterRepo.PartialProductList.filter(p => p.PARENT == this.selectedNode.id);
        if (childproductList.length > 0) {
          this.source.load(childproductList);
        }
        this.InilizedProductObj();
      }
    }
    else if (event.savedValue != null && event.mode == "edit") {
      if (event.from == "product") {
        let addproduct = { MCODE: event.savedValue.MCODE, MENUCODE: event.savedValue.MENUCODE, DESCA: event.savedValue.DESCA, BASEUNIT: event.savedValue.BASEUNIT, PARENT: event.savedValue.PARENT };
        this.MasterRepo.PartialProductList.splice(this.MasterRepo.PartialProductList.findIndex(x => x.MCODE == addproduct.MCODE), 1);
        this.MasterRepo.PartialProductList.push(addproduct);
      }
      else if (event.from == "group") {
        // this.tree.treeModel.getFocusedNode().data.name=event.savedValue.DESCA;
        if (this.MasterRepo.ProductGroupTree.length > 0) {
          this.loopingtreeForEdit(this.MasterRepo.ProductGroupTree, event.savedValue.MCODE, event.savedValue.DESCA);
          this.nodes = this.MasterRepo.ProductGroupTree;
        }
      }
    }
  }
  loopingtreeForEdit(list, key, replacedName) {
    for (let i of list) {
      if (i.id == key) {
        i.name = replacedName;
        break;
      }
      else {
        this.loopingtreeForEdit(i.children, key, replacedName)
      }

    }
  }
  // selectTab(i) {
  //    deactivate all tabs
  //   if (!this.ProductHomeTabs && this.ProductHomeTabs.length == 0) return;
  //   this.ProductHomeTabs.forEach(item => item.active = false);
  //   let item = this.ProductHomeTabs[i];
  //   if (item) {
  //     item.active = true;
  //   }
  // }
  public contextMenuActions = [
    {
      html: (item) => `Edit`,
      tag: 'edit',
      enabled: (item) => true,
      visible: (item) => true,
    },
    {
      divider: true,
      visible: true,
    },
    {
      html: (item) => `Delete`,
      tag: 'delete',
      enabled: (item) => true,
      visible: (item) => true,
    },
  ];

  contextMenuClick(selecteddata, selectedmenu) {
    if (selectedmenu.tag == "edit") {
      let activeTab: any = <any>{};
      activeTab.name = "addgroup";
      activeTab.selectedEditNode = selecteddata;
      activeTab.mode = "edit";
      activeTab.active = true;
      this.ProductHomeTabs = [];
      let i = this.ProductHomeTabs.push(activeTab);
    }
    else if (selectedmenu.tag == "delete") {

    }
  }

  fileEvent($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.ProductService.getUploadFile(formData);

    }


  }
  SelectedNodeFromBrand(value) {
    if (value.TYPE == 'BRAND') {
      this.loadListSubject.next(value);
    }
  }

  excelReportNameProvide(): string {
    var excelReportName = 'productmaster-report';
    return excelReportName;
  }

  ExportReportInExcel() {
    this.loadingService.show("Downloading Sample. Please Wait...");

    this.MasterRepo.downloadExcelOrCsvFiles('/downloadExcelsFiles?filename=RetailersItems', 'RetailersItems', 'xlsx')
      .subscribe(
        data => {
          this.loadingService.hide();
          this.MasterRepo.downloadFile(data);
        },
        (error) => {
          console.log(error);
          this._alertService.error(error._body);
          this.loadingService.hide();
        }
      );
  }


  excelDownloadFromHtml_manualTable(menudata) {
    try {

      this.reportData = this.menudata[0];
      let table = '<table style="border: thin solid black;">  <thead>   <tr>';
      for (let column1 of this.reportHeaders) {
        table += '<th style="border: thin solid black;">' + column1 + '</th>';
      };
      table += '</tr> </thead>';
      table += '<tbody>';

      for (let row of this.reportData) {
        table += '<tr>';
        for (let column1 of this.reportBody) {
          var v = row[column1];
          if (v == null) v = "";
          table += '<td style="border: thin solid black;">' + v + '</td>';
        };

        '</tr>';
      };

      table += '</tbody></table>';
      var Ht = table;
      var blob = new Blob([Ht], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      var blobUrl = URL.createObjectURL(blob);
      var downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = this.excelReportNameProvide() + ".xlsx";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (ex) { alert(ex) };
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
    this.activeTabEmitEvent(homeTab);
  }
  ImportProductFromExcel() {
    this.fileUploadPopup.show();
  }
  fileUploadSuccess(uploadedResult) {
    try {
      if (!uploadedResult || uploadedResult == null || uploadedResult == undefined) {
        return;
      }

      if (uploadedResult.status == "ok") {
        this._alertService.success("Uploaded SucessFul");
      }
      else {
        this._alertService.error(uploadedResult.result);
      }
    } catch (ex) {
      this._alertService.error(ex);
    }
  }

  SyncProductFromMobile() {
    this.loadingService.show("Syncing Please Wait...");
    try {
      this.MasterRepo.masterGetmethod("/menuitemSyncFromMobile").subscribe((res) => {
        if (res.status == "ok") {
          this.loadingService.hide();
          alert("success");
        }
        else {
          this.loadingService.hide();
          alert(res.result);
        }
      });
    } catch (ex) {
      this.loadingService.hide();
      alert(ex);
    }
  }



  onSyncCentral = (): void => {
    this.loadingService.show("Syncing items.Please wait.....");
    this.MasterRepo.masterGetmethod("/syncMenuItemICT").subscribe((res) => {
      if (res.status == "ok") {
        this.loadingService.hide();
        this._alertService.info(res.message);
      }
      else {
        this.loadingService.hide();
        this._alertService.info(res.result);

      }
    }, error => {
      this.loadingService.hide();

    })
  }



  onSynctoCentral = (): void => {
    this.loadingService.show("Syncing items.Please wait.....");
    this.MasterRepo.masterGetmethod("/syncMenuItemITC").subscribe((res) => {
      if (res.status == "ok") {
        this.loadingService.hide();
        this._alertService.info(res.result);
      }
      else {
        this.loadingService.hide();
        this._alertService.info(res.result);

      }
    }, error => {
      this.loadingService.hide();

    })
  }

  

}