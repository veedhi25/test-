import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from "@angular/core";
import { Salesman } from "../../../../common/interfaces/commonInterface.interface";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators} from "@angular/forms";
import { ModalDirective } from "ng2-bootstrap";
import { AddSalesmanService } from "./addSalesman.service";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { CustomValidators } from "../../../../common/validators/custom-validators";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { SettingService } from "../../../../common/services";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";

@Component({
  selector: "salesmanSelector",
  templateUrl: "./FormSaleman.component.html",

  providers: [AddSalesmanService, MasterRepo, TransactionService],
  styleUrls: ["../../../modal-style.css"]
})
export class FormSalemanComponent implements OnInit, OnDestroy {
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  salesman: Salesman = <Salesman>{};
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  form: FormGroup;
  private subcriptions: Array<Subscription> = [];
  salesmanTypeList: any[] = [];
  showStockedQuantityOnly: number = 0;

  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  public itemDetailIndex = 0;
  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    private service: AddSalesmanService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public _trnMainService: TransactionService,
  ) {    
     this.gridPopupSettings = {
      title: "ITEMS",
      apiEndpoints: `/getMenuitemWithStockPagedList/0/${'all'}/${'NO'}/${this._trnMainService.userProfile.userWarehouse}`,
      defaultFilterIndex: 0,
      columns: [
          {
              key: 'DESCA',
              title: 'DESCRIPTION',
              hidden: false,
              noSearch: false
          },
          {
              key: 'MENUCODE',
              title: 'ITEM CODE',
              hidden: false,
              noSearch: false
          },
          {
              key: 'STOCK',
              title: 'STOCK',
              hidden: false,
              noSearch: false
          }
          ,
          {
              key: 'MRP',
              title: 'MRP',
              hidden: false,
              noSearch: false
          }
          ,
          {
              key: 'BARCODE',
              title: 'BARCODE',
              hidden: true,
              noSearch: false
          }
      ]
    };
  }

  ngOnInit() {
    try {
      let self = this;
      this.form = this.fb.group({
        SALESMANID: ["0"],
        COMMISION: [0],
        NAME: [""],
        MOBILE: [""],
        EMAIL: [""],
        SALESMANTYPECODE: [""],
        STATUS: [1]
      });
      this.salesman.mappedItemList = [];
      this.addNewProductMappedList(0);
      this.onFormChanges();  
      this.getSalesmanType();
      if (!!this.activatedRoute.snapshot.params["mode"]) {
        if (this.activatedRoute.snapshot.params["mode"] == "view") {
          this.viewMode = true;
        }
      }
      if (!!this.activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this.activatedRoute.snapshot.params["returnUrl"];
      }
      if (!!this.activatedRoute.snapshot.params["salesid"]) {
        let salesmanID = this.activatedRoute.snapshot.params["salesid"];
        this.loadingService.show("Getting data, Please wait...");
        this.service.getSalesman(salesmanID).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {

              this.form.patchValue({
                SALESMANID: data.result.SALESMANID,
                COMMISION: data.result.COMMISION,
                NAME: data.result.NAME,
                ADDRESS: data.result.ADDRESS,
                MOBILE: data.result.MOBILE,
                EMAIL: data.result.EMAIL,
                SALESMANTYPECODE: data.result.SALESMANTYPECODE,
                STATUS: data.result.STATUS
              });
              if(data.result.mappedItemList!= null && data.result.mappedItemList != []){
                var  i=0;
                this.salesman.mappedItemList=[];
                for(let item of data.result.mappedItemList){
                  this.itemDetailIndex=i;
                  let newProdItem = <any>{};
                  newProdItem.MCODE = item.MCODE;
                  newProdItem.DESCA = item.DESCA;
                  this.salesman.mappedItemList.push(newProdItem);              
                  i++;
                } 
                this.addNewProductMappedList(this.itemDetailIndex);
              }

              if (this.activatedRoute.snapshot.params["mode"] == null) {
                this.modeTitle = "Edit Salesman";
              } else if (
                this.activatedRoute.snapshot.params["mode"] == "view"
              ) {
                this.modeTitle = "View Salesman";
              }

              self.mode = "edit";
              self.initialTextReadOnly = true;
            } else {
              this.mode = "";
              this.modeTitle = "Edit -Error in Salesman";
              this.initialTextReadOnly = true;
            }
          },
          error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2 -Error in Salesman";
            this.masterService.resolveError(error, "FormSaleman - getSalesman");
          }
        );
      } else {
        this.mode = "add";
        this.modeTitle = "Add Salesman";
        this.initialTextReadOnly = false;
      }
      let v = self.salesman;
    } catch (ex) {
      alert(ex);
    }
  
  }
 
  getSalesmanType() {
    this.masterService.getAllSalesManTypeList().subscribe(
      data => {
        this.salesmanTypeList = data;  
      },
      () => {
        this.salesmanTypeList = [];
      }
    );
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });
  }

  disabled() {
    try {
      if (this.viewMode == true) {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  editDisabled() {
    try {
      if (this.mode == "edit") {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      alert(ex);
    }
  }

  changeToArray(data) {
    try {
      if (data) {
        let retData: Array<any> = [];
        retData.concat([], data);
        return retData;
      }
      return [];
    } catch (ex) {
      alert(ex);
    }
  }

  onSave() {
    try {
      //validate before Saving
      if (!this.form.valid) {
        this.alertService.error("All fields are required");
      }

      this.onsubmit();
    } catch (ex) {
      alert(ex);
    }
  }

  cancel() {
    try {
      this.router.navigate(["./pages/masters/salesman"]);
    } catch (ex) {
      alert(ex);
    }
  }

  salesbttnClick() {
  }
  onsubmit() {
    try {
      let saveModel = Object.assign(<Salesman>{}, this.form.value);
      saveModel.STATUS = saveModel.STATUS ? 1 : 0;     
      this.loadingService.show("Saving data, Please wait...");  
      if(this.masterService.userSetting.COMPANYNATURE==1){
        this.salesman.mappedItemList.forEach(element => {
          element.COMMISION = saveModel.COMMISION,
          element.SALESMANNAME = saveModel.NAME,
          element.STATUS = saveModel.STATUS
        });   
      }else{
        this.salesman.mappedItemList=[];
      }
      saveModel.mappedItemList = this.salesman.mappedItemList.filter(a=>a.MCODE !=null &&a.MCODE !=""); 
      let sub = this.masterService.saveSalesman(this.mode, saveModel).subscribe(
        data => {
          this.loadingService.hide();
          if (data.status == "ok") {
            //Displaying dialog message for save with timer of 1 secs
            if (this.mode == "edit") {
              this.alertService.success("Data Updated Successfully");
            } else {
              this.alertService.success("Data Saved Successfully");
            }
            this.preventNavigationService.preventNavigation(false);
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 1000);
          } else {
            //alert(data.result);
            //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
            if (
              data.result._body ==
              "The ConnectionString property has not been initialized."
            ) {
              this.router.navigate(["/login", this.router.url]);
              return;
            }
            //Some other issues need to check
            this.alertService.error(
              "Error in Saving Data:" + data.result._body
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
  onCancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  @ViewChild("loginModal") loginModal: ModalDirective;
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  onMcodeEnterEvent = (event, index: number): void => {
    event.preventDefault();
    if (this.viewMode == true) 
      return;
    this.genericGrid.show();
    this.itemDetailIndex = index;
}

  dblClickPopupItem = (value): void => {
    if (this.salesman.mappedItemList.some(x => x.MCODE == value.MCODE)) 
    {  
      this.alertService.error("Item Already added !!"); 
      return;
    }
    this.salesman.mappedItemList[this.itemDetailIndex].MCODE = value.MCODE;
    this.salesman.mappedItemList[this.itemDetailIndex].DESCA = value.DESCA;
    
    this.addNewProductMappedList(this.itemDetailIndex);
  }

  removeItemFromList = (index): void => {
    if (this.viewMode == true) 
      return;
    this.salesman.mappedItemList.splice(index, 1)
  }


  addNewProductMappedList = (index: number): boolean => {
    if (this.viewMode == true) 
      return;
      if (this.salesman.mappedItemList.some(x => x.MCODE == null || x.MCODE == "" || x.MCODE == undefined)) { return false; }
      let newProdItem = <any>{};
      newProdItem.MCODE = "";
      newProdItem.DESCA = "";
      this.salesman.mappedItemList.push(newProdItem);

      let nextIndex = index + 1;
      this.itemDetailIndex = nextIndex;
      setTimeout(() => this.masterService.focusAnyControl("mcode" + nextIndex));
      return true;
  }
}
