import { Component, ViewChild, OnInit, ComponentFactoryResolver } from "@angular/core";
import { Console } from "console";
import { xor } from "lodash";
import { MasterRepo } from "../../../../common/repositories";
import { NavigationEnd, Router } from '@angular/router';
import { forEachLeadingCommentRange } from "typescript";
@Component({
  selector: "ControlAccessPageWise",
  templateUrl: "./ControlAccessPageWiseDetail.component.html",

})
export class ControlAccessPageWiseDetailComponent implements OnInit {
  public treeItem: string;
  public companyList: any[];
  public GrnList: any[];  
  public locationListDetail: any[];  
  public locationListDetailFilter: any[];  
  public ItemWiseLoc: any[];  
  public list: any[];
  public listPageCount:any[];

  public paginationRowCount : number=10; //number of records in a page
  private loading: boolean;
  public pageNumberArray:any[];
  public  chkSelect:boolean;
  PageSize :number=10;
  totalPageCount:number;
  DialogMessage: string = " "
  checked?: boolean;
  isShown: boolean = true ; 
  selectedData:string;
  errorList:string;
  startIndex:number;
  className:string;
  public searchLocation:string;
public child_domainId:string="0";
public Controlpage_Name:string="0";
  totalRec : number;
  page: number = 1;

  public parentDomainlist = [];
  public childDomainlist = [];
  public pageNameList = [];
  currentRoute: string;
  constructor(private masterService: MasterRepo, private router: Router) {

    this.currentRoute = router.url;     
   // this.get();
  }

  ngOnInit() {
    this.masterService.getChildDomainList().subscribe(data => {
     
      this.childDomainlist = data.lstChildDomain;
    });
    this.masterService.getPageNameList().subscribe(data => {
     console.log(data);
      this.pageNameList = data;
    });

  

  }
  

  get() {
  
   
  
  
  }

    searchLocationList(){
    
      let _searchText = this.searchLocation;
     this.locationListDetail =  this.locationListDetailFilter;

      if(_searchText !='')
      {
        this.locationListDetail =this.locationListDetail.filter(x => x.PageName.toLowerCase().includes(_searchText.toLowerCase())
        || x.ControlText.toLowerCase().includes(_searchText.toLowerCase())
        || x.ControlType.toLowerCase().includes(_searchText.toLowerCase())
        );
      }
      else
      {
        this.locationListDetail =  this.locationListDetailFilter;
      }
    
    }

    getArrayFromNumber(length) {
      
      if (length % this.paginationRowCount === 0) {
          this.pageNumberArray = Array.from(Array(Math.floor(length / this.paginationRowCount)).keys());
      } else {
          this.pageNumberArray = Array.from(Array(Math.floor(length / this.paginationRowCount) + 1).keys());
      }
      this.startIndex = 1;
      return this.pageNumberArray;
  }

  updateIndex(pageIndex) {
      this.startIndex = pageIndex;
      this.masterService.getPageWiseControlListDetail(this.Controlpage_Name,pageIndex,this.paginationRowCount).subscribe(res => {
    
        this.locationListDetail = res.lstlocation;
        this.locationListDetailFilter = res.lstlocation;
      
      });
  }

  getSelectAllRecord(){
  
    for(var i=0; i<this.locationListDetail.length;i++)
    {
     
        if(this.locationListDetail[i].checkAccess == false)
        {
          this.locationListDetail[i].checkAccess =  true;
        }
        else
        {
          this.locationListDetail[i].checkAccess =  false;
        }
    }
   
  }

  changePageWiseList(e)
{
  this.Controlpage_Name = e;
  console.log(this.Controlpage_Name);
  this.loading = true;
  this.masterService.getPageWiseControlListDetail(this.Controlpage_Name, 1,this.paginationRowCount).subscribe(res => {
    console.log(res);
    this.locationListDetail = res.lstData;
    this.locationListDetailFilter = res.lstData;
 
    if( this.locationListDetailFilter.length > 0)
    {
      this.totalRec = this.locationListDetailFilter[0].countRecord;
    }
    else
    {
      this.totalRec  = 0;
    }

  
    this.loading = false;
 
  });
}

SaveRecord() {
 
  var errorList;
  let ResultData ="";
 var _accessList = '';
 var _selectLoc = '';
 var _consumeQty = '';
  
if(this.locationListDetail == undefined || this.locationListDetail == null)
{
  alert('No Record Found.');
}
else
{
  for(var i=0; i<this.locationListDetail.length;i++)
  {
      if(this.locationListDetail[i].checkAccess == true)
      {
        _accessList +=',' + this.locationListDetail[i].PageWiseId;
      }
  }

  if(_accessList.toString() =='')
     alert('Please Select any one record.');


}
  
if(this.Controlpage_Name == undefined || this.Controlpage_Name == ''
 || this.Controlpage_Name == '0')
    alert('Please Select Page Name.');
 else if(this.child_domainId == undefined || this.child_domainId == ''
  || this.child_domainId == '0')
  alert('Please Select Child Domain.');
else
  {
    this.loading = true;
    var requestObject = JSON.stringify({
      "ChildDomainName": this.child_domainId,
      "PageWiseId": _accessList
    });
    this.masterService.saveRecordCommonPageWiseControl(requestObject).subscribe(res => {
    console.log('result');
    console.log(res.result);
      if(res.result=='Add Data Successfully')
      {
      
        this.loading = false;
      }
      else
      {
       alert(res.result);
       this.loading = false;
      }
     });

   
  }
}
  
}
