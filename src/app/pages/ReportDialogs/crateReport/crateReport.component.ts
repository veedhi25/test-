import { Component, ViewChild, OnInit } from "@angular/core";
import { Console } from "console";
import { xor } from "lodash";
import { Router } from '@angular/router';
import * as moment from 'moment'
import { MasterRepo } from "../../../common/repositories";
import { AlertService } from "../../../common/services/alert/alert.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { SpinnerService } from "../../../common/services/spinner/spinner.service";
@Component({
  selector: "crateReport",
  templateUrl: "./crateReport.html",

})
export class CrateReportComponent implements OnInit {
  @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
  @ViewChild("genericGridSupplier") genericGridSupplier: GenericPopUpComponent;
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  gridPopupSettingsForSupplier: GenericPopUpSettings = new GenericPopUpSettings();
  
  
  public crateReportDetails: any[];  
  public crateReportDetailsFilter: any[]; 
  public paginationRowCount : number=10; //number of records in a page
  private loading: boolean;
  excelButtonstatus : boolean = true;
  public pageNumberArray:any[];
  public  chkSelect:boolean;
  DialogMessage: string = " "
  checked?: boolean;
  isShown: boolean = true ;
  selectedBillTo  : boolean = true;
 public selectedMode : string ="";
 ACID : string ="";
 ACNAME :  string  = "";
 tableColumn : any = [];
 showTablestatus : boolean = false;
 public assignFlag : boolean = false;
 public returnFlag : boolean = false;
 fileLocationUrl;
 isShowExport:boolean = true;
 fileUrl;
    isShowDownload:boolean = false;
  public searchLocation:string;
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
  fromDate: string;
    toDate: string;
    ranges: any = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'Financial Year': [moment().set('date', 1).set('month', 3), moment().endOf('month').set('month', 2).add(1, 'year')],

  }
  myModearr : any= [];
  constructor(private masterService: MasterRepo, private router: Router, private alertService: AlertService,private loadingService: SpinnerService) {
    this.gridPopupSettingsForCustomer = Object.assign(new GenericPopUpSettings, {
      title: "Customers",
      apiEndpoints: `/getAccountPagedListByPType/PA/C`,
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
              key: "PRICELEVEL",
              title: "TYPE",
              hidden: false,
              noSearch: false
          }
      ]

  });
  this.gridPopupSettingsForSupplier = Object.assign(new GenericPopUpSettings, {
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
            key: "EMAIL",
            title: "EMAIL",
            hidden: false,
            noSearch: false
        }
    ]
});

  }

  
  accType: any = [
    {
      name: "Customer",
      value: "customer"
    },
    {
      name: "Supplier",
      value: "supplier"
    }
  ];

  modeStatus: any = [
    {
      name: "Assign",
      value: "AssignQuantity",
      checked: false
    },
    {
      name: "Return",
      value: "ReturnQuantity",
      checked: false
    },
    
  ];

  

  onChangeType(){
    this.ACID="";
      this.ACNAME="";
    if(this.selectedMode == ""){
      this.genericGridSupplier.hide();
      this.genericGridCustomer.hide();
    }
    else if(this.selectedMode == "customer"){
      this.genericGridSupplier.hide();
      this.genericGridCustomer.show("", false, "");
    }else if(this.selectedMode == "supplier"){
      this.genericGridCustomer.hide();
      this.genericGridSupplier.show("", false, "");
    }else{}
  }

  ngOnInit() {
    //this.get();
    //this.genericGridCustomer.show("", false, "");
   
  }
  
  dateChanged(date) {
   
   
    if (this.selectedDate.startDate != null) {
      this.fromDate = moment(this.selectedDate.startDate).format('YYYY-MM-DD');
      this.toDate = moment(this.selectedDate.endDate).format('YYYY-MM-DD');
  }
 // console.log(this.fromDate +'='+this.toDate);
  
  }
  getSelectedMode(event,val){
    let status=event.target.checked;
    status ? this.myModearr.push(val) : this.removeMode(val);
   //console.log(this.myModearr);
  }
  
  removeMode(val){
    let index = this.myModearr.indexOf(val);
    if (index > -1) {
      this.myModearr.splice(index, 1);
    };
  }

  onCustomerSelected(customer) {
    console.log(customer);
    this.setBillTovalue(customer.ACID,customer.ACNAME);
  }

  onSupplierSelected(supplier) {
    console.log(supplier);
    this.setBillTovalue(supplier.ACID,supplier.ACNAME);
  }

  setBillTovalue(acid,acname){
    this.ACID="";
    this.ACNAME="";
    this.ACID=acid;
    this.ACNAME=acname;
  }
  searchList() {
    if ((this.selectedMode) == "" || this.selectedMode == undefined) {
      this.alertService.error("Select Type");
      return;
  }
  if(this.ACID == null || this.ACID == undefined){
    this.alertService.error("Select customer or supplier");
    return;
  }
    if (this.selectedDate.startDate == null || this.selectedDate.startDate == undefined) {
      this.alertService.error("Date is required");
      return;
  }

  if(this.myModearr.length<=0){
      this.alertService.error("Choose Assign or return");
        return;
    }
    this.showTablestatus = false;
    this.tableColumn = [];
    this.assignFlag = false;
    this.returnFlag = false;
    this.excelButtonstatus = true;
    this.loadingService.show("Please wait...");
    //console.log(this.selectedMode);
    var requestObject={
      "ACIDTYPE":this.selectedMode,
      "ACID":this.ACID,
      //"modeStatus":this.myModearr.map(x=>`'${x}'`).toString(),
      "mode":this.myModearr.join(),
      "date1":this.fromDate,
      "date2":this.toDate
    }
    this.masterService.masterPostmethod('/getCrateReport',JSON.stringify(requestObject)).subscribe(res => {
      console.log(res);
      if (res.status == 'ok') {
        var cols;
        if(this.myModearr.length > 1){
          cols = [
          {colname : "Date"},
          {colname : "Assigned"},
          {colname : "Return"},
          ]
          this.tableColumn = cols;
          this.assignFlag = true;
          this.returnFlag = true;
        }else if(this.myModearr.length == 1){
          console.log(this.myModearr);
          if(this.myModearr[0]=="AssignQuantity"){
            this.assignFlag = true; 
            cols = [
              {colname : "Date"},
              {colname : "Assigned"}
            ]
            this.tableColumn = cols;
          }else{
            this.returnFlag = true;
            console.log('else true');
            cols = [
              {colname : "Date"},
              {colname : "Return"},
            ]
            this.tableColumn = cols;
          }
          
        }
        console.log(this.tableColumn);
        this.showTablestatus = true;
        this.crateReportDetails = res.result;
        this.crateReportDetailsFilter = res.result;
        this.loadingService.hide();
        this.excelButtonstatus = false;
       }
    });
    
  }
  

  searchDivision(query: string) {
 
    let filteredParticipants = [];
    this.crateReportDetails =  this.crateReportDetailsFilter;
    if (query) {
      this.crateReportDetails = this.crateReportDetails.filter(p => {
        if (p.CaretDate && p.CaretDate.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
   
        return false;
    });
    //this.selectedVoucherList =  filteredParticipants;
    }
    else
    {
      this.crateReportDetails =  this.crateReportDetailsFilter;

    }
 
  }

 

}
