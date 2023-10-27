import { Component, ViewChild, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { FormGroup, FormControl, FormBuilder, Validators,AbstractControl } from '@angular/forms';
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
  selector: "suppliervsitem",
  templateUrl: "./suppliervsitem.html",
  

})
export class SuppliervsItemComponent implements OnInit {
  private subcriptions: Array<Subscription> = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  form: FormGroup;
  SCHID: string="";
  isReadonly = true;
  mode : string= "add";
  public loading: boolean=false;
  isShownupdate : boolean =false;
   isShownsave : boolean =true;
  
   public mySupplier: any[];
   public mySupplierFilter: any[];
   public myBarcode: any[];
   public myBarcodeFilter: any[];
   public itemCategory : any[];
   public myItem : any=[];
   public myItemFilter : any=[];
   public selectAllSup:boolean = false;
   public selectAllitem:boolean = false;
    supPageno :  number =1;
    supageSize :  number =20;
    menuPageNo :  number =1;
    menuPageSize :  number =20;
    catPageNo : number =1;
    catPageSize :  number =20;
    public selectedCategory :  string ="all";
    checkSupplierArr : any = [];
    checkItemArr : any = [];
    showBulkUpload : boolean = false;
    bulkButtonstatus : boolean = false;
    saveButtonstatus : boolean = false;
    arrayBuffer: any;
    mysheetData : any;
    submitBulkUploadButton : boolean = true;
    filesupplierArr : any;
    fileitemArr : any;
    excelFile : string ="";
   
  
  @ViewChild('childModal') childModal: ModalDirective;


  constructor(private masterService: MasterRepo, private fb: FormBuilder, 
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute,public dialog: MdDialog, private loadingService: SpinnerService) {
      this.mode = this._activatedRoute.snapshot.params["mode"];
      this.SCHID = this._activatedRoute.snapshot.params["passId"];
      this.get();
  }

  onFileSelect(event) {
    this.submitBulkUploadButton = true;
    this.mysheetData=[];
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
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
      var bstr = arr.join("");    
      var workbook = XLSX.read(bstr, {type:"binary"});    
      var first_sheet_name = workbook.SheetNames[0];    
      var worksheet = workbook.Sheets[first_sheet_name];    
     this.mysheetData = XLSX.utils.sheet_to_json(worksheet,{raw:true});
     console.log(this.mysheetData);
     if(this.mysheetData.length>0){
       if(this.mysheetData[0].hasOwnProperty("Supplier") && this.mysheetData[0].hasOwnProperty("ItemName") && this.mysheetData[0].hasOwnProperty("ItemMCODE")){
        this.submitBulkUploadButton=false;
        for(let a = 0;a<this.mysheetData.length; a++){
          let supname = this.mysheetData[a].Supplier;
          let itemcode = this.mysheetData[a].ItemMCODE;
          if(!this.filesupplierArr.includes(supname)){
            this.filesupplierArr.push(supname);
          }
          if(!this.fileitemArr.includes(itemcode)){
            this.fileitemArr.push(itemcode);
          }
        }
        console.log(this.filesupplierArr);
        console.log(this.fileitemArr);
       }else{
        this.alertService.error('Excel file does not contain defined format');
        this.submitBulkUploadButton=true;
        this.excelFile = "";
       }
       
     }else{
      this.alertService.error('Choose excel file that contain data');
      this.submitBulkUploadButton=true;
      this.excelFile = "";

     }
      }    
    }
  }
  }

  saveBulkUpload(){
    if(confirm('Are you sure you want to submit Excel file data')){
      if(this.filesupplierArr.length<=0 || this.fileitemArr.length <= 0){
        this.alertService.error("Data saved choose another file");
        return;
      }
      this.submitBulkUploadButton=true;
      try{
        var requestOject = {
          "Mode" : "0",
          "MapID" : "-1",
          "ACID" : this.filesupplierArr.join(),
          "MCODE" : this.fileitemArr.join(),
          "MappingStatus": "1",
          "MappingType" : "item"
        }
        this.loading = true;
   this.loadingService.show("Loading Data please wait...");
   this.masterService.masterPostmethod("/addSuppliervsItem",JSON.stringify(requestOject))
  .subscribe(data => {
  //  console.log(data);
    
    if (data.status == 'ok') {
    this.loading = false;
     this.loadingService.hide();
     this.alertService.success(data.result);
     this.filesupplierArr=[];
     this.fileitemArr = [];
     this.submitBulkUploadButton=false;
     this.excelFile = "";

    } else {
      this.loadingService.hide();
      this.alertService.error(data.result);
      this.submitBulkUploadButton=false;
      this.excelFile = "";
      this.filesupplierArr=[];
     this.fileitemArr = [];
   
  }
  });
      }catch(e){
        this.loadingService.hide();
  this.alertService.error(e);
  this.submitBulkUploadButton=false;
      }
    }
  }
  onBulkUploadClicked(){
    this.showBulkUpload = true;
    this.bulkButtonstatus = true;
    this.saveButtonstatus = true;

  }

  onCloseBulk(){
    this.showBulkUpload = false;
    this.bulkButtonstatus = false;
    this.saveButtonstatus = false;
  }
  
getSupplier(supPageno,supageSize){
  try{
    this.loading = true;
     this.loadingService.show("Loading Data please wait...");
     let url=`/getAllsupplier?pageNo=${supPageno}&pageSize=${supageSize}`;
    this.masterService.masterGetmethod(url)
    .subscribe(data => {
      //console.log(data);
      if (data.status == 'ok') {
      this.loading = false;
       this.loadingService.hide();
       this.mySupplier=data.result;
       this.mySupplierFilter=data.result;

      } else {
        this.loadingService.hide();
        this.alertService.error(data.result);
     
    }
    });

    //console.log(this.myReportList);
   
  }catch(ex){
    this.alertService.error(ex);
  }
}
changeCategory(){
  this.selectAllitem=false;
  this.getMenuItem(this.menuPageNo,this.menuPageSize,this.selectedCategory);
}
getMenuItem(menuPageNo,menuPageSize,selectedCategory){
  try{
    this.loading = true;
     this.loadingService.show("Loading Data please wait...");
     let url=`/getAllmenuItem?pageNo=${menuPageNo}&pageSize=${menuPageSize}&dataMode=item&selectedCat=${selectedCategory}`;
    this.masterService.masterGetmethod(url)
    .subscribe(data => {
    //  console.log(data);
      
      if (data.status == 'ok') {
      this.loading = false;
       this.loadingService.hide();
       this.myItem=data.result;
       this.myItemFilter= data.result;
     

      } else {
        this.loadingService.hide();
        this.alertService.error(data.result);
     
    }
    });
    //console.log(this.myReportList);
   
  }catch(ex){
    this.alertService.error(ex);
  }
}

getItemCategory(catPageNo,catPageSize){
  try{
    this.loading = true;
     this.loadingService.show("Loading Data please wait...");
     let url=`/getAllmenuItem?pageNo=${catPageNo}&pageSize=${catPageSize}&dataMode=cat&selectedCat=all`;
    this.masterService.masterGetmethod(url)
    .subscribe(data => {
      if (data.status == 'ok') {
       // console.log(data);
      this.loading = false;
       this.loadingService.hide();
       this.itemCategory = data.result;
     

      } else {
        this.loadingService.hide();
        this.alertService.error(data.result);
     
    }
    });
    //console.log(this.myReportList);
   
  }catch(ex){
    this.alertService.error(ex);
  }
}

get(){
  this.getSupplier(this.supPageno,this.supageSize);
  this.getMenuItem(this.menuPageNo,this.menuPageSize,this.selectedCategory);
  this.getItemCategory(this.catPageNo,this.catPageSize);
 

}

searchSupplier(query: string) {
  this.mySupplier =  this.mySupplierFilter;
  if (query) {
    try{
      this.loading = true;
       this.loadingService.show("Loading Data please wait...");
       let url=`/searchSuppliervsItem?dataMode=supplier&queryString=${query}&selectedCat=all`;
      this.masterService.masterGetmethod(url)
      .subscribe(data => {
        if (data.status == 'ok') {
        this.loading = false;
         this.loadingService.hide();
         this.mySupplier=data.result;
         this.mySupplierFilter=data.result;
  
        } else {
          this.loadingService.hide();
          this.alertService.error(data.result);
       
      }
      });
      //console.log(this.myReportList);
     
    }catch(ex){
      this.alertService.error(ex);
    }
  }
  else
  {
    this.getSupplier(this.supPageno,this.supageSize);
}
}
searchItem(query: string) {
 this.myItem =  this.myItemFilter;
  if (query) {
    try{
      this.loading = true;
       this.loadingService.show("Loading Data please wait...");
       let url=`/searchSuppliervsItem?queryString=${query}&dataMode=item&selectedCat=${this.selectedCategory}`;
      this.masterService.masterGetmethod(url)
      .subscribe(data => {
       // console.log(data);
        
        if (data.status == 'ok') {
        this.loading = false;
         this.loadingService.hide();
         this.myItem=data.result;
         this.myItemFilter= data.result;
       
  
        } else {
          this.loadingService.hide();
          this.alertService.error(data.result);
       
      }
      });
      //console.log(this.myReportList);
     
    }catch(ex){
      this.alertService.error(ex);
    }
  }
  else
  {
    this.getMenuItem(this.menuPageNo,this.menuPageSize,this.selectedCategory);
  }
}

getSelectAllRecord(event){
  if(event=="sup"){
  if(this.selectAllSup == true)
  {
    for(var i=0; i<this.mySupplier.length;i++)
    {
          this.mySupplier[i].supCheck =  true;
    }
  }
  else
  {
    for(var i=0; i<this.mySupplier.length;i++)
    {
          this.mySupplier[i].supCheck =  false;
    }
  }
}else if(event=="item"){
  if(this.selectAllitem == true)
  {
    for(var i=0; i<this.myItem.length;i++)
    {
          this.myItem[i].itemCheck =  true;
    }
  }
  else
  {
    for(var i=0; i<this.myItem.length;i++)
    {
          this.myItem[i].itemCheck =  false;
    }
  }
}else{}
}

preventInput($event)
{
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
  try{
  this.checkSupplierArr=[];
  this.checkItemArr = [];
 for(let a = 0; a < this.mySupplier.length; a++){
  if(this.mySupplier[a].supCheck == true)
  {
    this.checkSupplierArr.push(this.mySupplier[a].ACID);
  }
 }
 for(let a = 0; a < this.myItem.length; a++){
  if(this.myItem[a].itemCheck == true)
  {
    this.checkItemArr.push(this.myItem[a].MCODE);
  }
 }
 if(this.checkSupplierArr.length==0){
  this.alertService.error("Check at least one supplier");
      return;
 }
 if(this.checkItemArr.length==0){
  this.alertService.error("Check at least one item");
      return;
 }

 var requestOject = {
   "Mode" : "0",
   "MapID" : "-1",
   "ACID" : this.checkSupplierArr.join(),
   "MCODE" : this.checkItemArr.join(),
   "MappingStatus": "1",
   "MappingType" : "item"
 }
// console.log(requestOject);
 this.loading = true;
   this.loadingService.show("Loading Data please wait...");
   this.masterService.masterPostmethod("/addSuppliervsItem",JSON.stringify(requestOject))
  .subscribe(data => {
  //  console.log(data);
    
    if (data.status == 'ok') {
    this.loading = false;
     this.loadingService.hide();
     this.alertService.success("Add data successfully");
   this.clearText();

    } else {
      this.loadingService.hide();
      this.alertService.error(data.result);
   
  }
  });
  //console.log(this.myReportList);
 
}catch(ex){
  this.loadingService.hide();
  this.alertService.error(ex);
  
}
  
}





clearText()
{
  this.isShownupdate =false;
   this.isShownsave =true;
  this.mySupplier=[];
  this.itemCategory=[];
   this.myItem=[];
   
  //this.selectAll= false;
  this.checkSupplierArr =[];
  this.checkItemArr =[];
  this.get();

}

}
