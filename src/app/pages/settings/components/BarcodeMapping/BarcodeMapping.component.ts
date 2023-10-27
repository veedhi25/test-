import { Component, ViewChild, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { ModalDirective } from 'ng2-bootstrap';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as XLSX from 'xlsx';
import _ from "lodash";
@Component({
  selector: "barcodeMapping",
  templateUrl: "./BarcodeMapping.html",


})
export class BarcodeMappingComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;
  SCHID: string = "";
  isReadonly = true;
  mode: string = "add";
  public loading: boolean = false;
  isShownupdate: boolean = false;
  isShownsave: boolean = true;

  public mySupplier: any[];
  public mySupplierFilter: any[];
  public myBarcode: any[];
  public myBarcodeFilter: any[];
  public itemCategory: any[];
  public myItem: any = [];
  public barcodeType: any = [];
  public myItemFilter: any = [];
  public selectAllSup: boolean = false;
  public selectAllitem: boolean = false;
  supPageno: number = 1;
  supageSize: number = 20;
  menuPageNo: number = 1;
  menuPageSize: number = 20;
  catPageNo: number = 1;
  catPageSize: number = 20;
  public selectedType: string = "";
  checkSupplierArr: any = [];
  checkBarCodeArr: any = [];
  checkItemArr: any = [];
  showBulkUpload: boolean = false;
  bulkButtonstatus: boolean = false;
  saveButtonstatus: boolean = false;
  arrayBuffer: any;
  mysheetData: any;
  submitBulkUploadButton: boolean = true;
  filesupplierArr: any;
  fileitemArr: any;
  excelFile: string = "";


  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo, private fb: FormBuilder,
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {
    this.mode = this._activatedRoute.snapshot.params["mode"];
    this.SCHID = this._activatedRoute.snapshot.params["passId"];
    this.get();
  }

  allType: any = [
    {
      name: "Page",
      value: "Page"
    },
    {
      name: "Item",
      value: "Item"
    },

  ]
  allPages: any = [
    {
      itemCheck: 0,
      MCODE: "Item master"
    },
    {
      itemCheck: 0,
      MCODE: "sale Invoice"
    },

  ]




  getBarcodes() {
    try {
      this.loading = true;
      this.loadingService.show("Loading Data please wait...");
      let url = `/selectAllBarcodewithCheck`;
      this.masterService.masterGetmethod(url)
        .subscribe(data => {
          //console.log(data);
          if (data.status == 'ok') {
            this.loading = false;
            this.loadingService.hide();
            this.myBarcode = data.result;
            this.myBarcodeFilter = data.result;

          } else {
            this.loadingService.hide();
            this.alertService.error(data.result);

          }
        });
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  changeType() {
    this.selectAllitem = false;
    if (this.selectedType == "Page") {
      this.myItem = this.allPages;
    } else {
      this.getItemForBarcodes();
    }

  }
  getItemForBarcodes() {
    try {

      this.loading = true;
      this.loadingService.show("Loading Data please wait...");
      let url = `/selectAllitemwithCheck`;
      this.masterService.masterGetmethod(url)
        .subscribe(data => {
          //  console.log(data);

          if (data.status == 'ok') {
            this.loading = false;
            this.loadingService.hide();
            this.myItem = data.result;
            this.myItemFilter = data.result;


          } else {
            this.loadingService.hide();
            this.alertService.error(data.result);

          }
        });
    } catch (ex) {
      this.alertService.error(ex);
    }
  }


  get() {


    this.getBarcodes();


  }

  searchSupplier(query: string) {
    this.mySupplier = this.mySupplierFilter;
    if (query) {
      try {
        this.loading = true;
        this.loadingService.show("Loading Data please wait...");
        let url = `/searchSuppliervsItem?dataMode=supplier&queryString=${query}&selectedCat=all`;
        this.masterService.masterGetmethod(url)
          .subscribe(data => {
            if (data.status == 'ok') {
              this.loading = false;
              this.loadingService.hide();
              this.mySupplier = data.result;
              this.mySupplierFilter = data.result;

            } else {
              this.loadingService.hide();
              this.alertService.error(data.result);

            }
          });
        //console.log(this.myReportList);

      } catch (ex) {
        this.alertService.error(ex);
      }
    }
    else {
      this.getSupplier(this.supPageno, this.supageSize);
    }
  }
  getSupplier(supPageno: number, supageSize: number) {
    throw new Error("Method not implemented.");
  }
  searchItem(query: string) {
    if (this.selectedType == "Item") {
      this.myItem = this.myItemFilter;
      if (query) {
        try {
          this.loading = true;
          this.loadingService.show("Loading Data please wait...");
          let url = `/searchItemMcodewithCheck?modeString=${query}`;
          this.masterService.masterGetmethod(url)
            .subscribe(data => {
              // console.log(data);

              if (data.status == 'ok') {
                this.loading = false;
                this.loadingService.hide();
                this.myItem = data.result;
                this.myItemFilter = data.result;


              } else {
                this.loadingService.hide();
                this.alertService.error(data.result);

              }
            });
          //console.log(this.myReportList);

        } catch (ex) {
          this.alertService.error(ex);
        }
      }
    }
    else {
      this.getItemForBarcodes();
    }
  }

  getSelectAllRecord(event) {
    if (event == "sup") {
      if (this.selectAllSup == true) {
        for (var i = 0; i < this.mySupplier.length; i++) {
          this.mySupplier[i].supCheck = true;
        }
      }
      else {
        for (var i = 0; i < this.mySupplier.length; i++) {
          this.mySupplier[i].supCheck = false;
        }
      }
    } else if (event == "item") {
      if (this.selectAllitem == true) {
        for (var i = 0; i < this.myItem.length; i++) {
          this.myItem[i].itemCheck = true;
        }
      }
      else {
        for (var i = 0; i < this.myItem.length; i++) {
          this.myItem[i].itemCheck = false;
        }
      }
    } else { }
  }

  preventInput($event) {
    $event.preventDefault();
    return false;

  }
  counter(i: number) {
    return new Array(i);
  }


  ngOnInit() {


  }



  hideChildModal() {
    try {
      this.childModal.hide();
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  @ViewChild('loginModal') loginModal: ModalDirective;
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      this.alertService.error(ex);
    }
  }




  onSaveClicked(action) {
    try {
      this.checkBarCodeArr = [];
      this.checkItemArr = [];
      for (let a = 0; a < this.myBarcode.length; a++) {
        if (this.myBarcode[a].supCheck == true) {
          this.checkBarCodeArr.push(this.myBarcode[a].ConfigParaTitle);
        }
        if (this.checkBarCodeArr.length > 1) {
          this.alertService.warning("Please select one bar code at a time ");
          return;
        }
      }
      for (let a = 0; a < this.myItem.length; a++) {
        if (this.myItem[a].itemCheck == true) {
          this.checkItemArr.push(this.myItem[a].MCODE);
        }
      }
      if (this.checkBarCodeArr.length == 0) {
        this.alertService.error("Check at least one bar code ");
        return;
      }
      if (this.checkItemArr.length == 0) {
        this.alertService.error("Check at least one item");
        return;
      }

      var requestOject = {
        "ConfigParaTitle": this.checkBarCodeArr.join(),
        "MappingCode": this.checkItemArr.join(),
        "MappingType": this.selectedType
      }
      // console.log(requestOject);
      this.loading = true;
      this.loadingService.show("Loading Data please wait...");
      this.masterService.masterPostmethod("/mappingBarCode", JSON.stringify(requestOject))
        .subscribe(data => {
          //  console.log(data);

          if (data.status == 'ok') {
            this.loading = false;
            this.loadingService.hide();
            this.alertService.success("Data  Added successfully");
            this.clearText();

          } else {
            this.loadingService.hide();
            this.alertService.error(data.result);

          }
        });
      //console.log(this.myReportList);

    } catch (ex) {
      this.loadingService.hide();
      this.alertService.error(ex);

    }

  }





  clearText() {
    this.isShownupdate = false;
    this.isShownsave = true;
    this.mySupplier = [];
    this.itemCategory = [];
    this.myItem = [];

    //this.selectAll= false;
    this.checkSupplierArr = [];
    this.checkItemArr = [];
    this.get();

  }

}
