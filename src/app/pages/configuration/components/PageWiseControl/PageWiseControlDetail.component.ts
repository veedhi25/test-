import { Component, ViewChild, OnInit } from "@angular/core";
import { Console } from "console";
import { xor } from "lodash";
import { MasterRepo } from "../../../../common/repositories";
import { Router } from '@angular/router';
@Component({
  selector: "PageWiseControl",
  templateUrl: "./PageWiseControlDetail.component.html",

})
export class PageWiseControlComponent implements OnInit {
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

  totalRec : number;
  page: number = 1;

  constructor(private masterService: MasterRepo, private router: Router) {
    this.get();
  }

  ngOnInit() {
    
  }
  onAddClick(): void {
    try {
      this.router.navigate([
        "/pages/configuration/settings/AddPageWiseControl"
      ]);
     
    } catch (ex) {
      alert(ex);
    }
  }

  onupdateClick(gateId): void {

    try {
      this.router.navigate([
        "/pages/configuration/settings/AddPageWiseControl",
        { mode: "edit", passId: gateId, returnUrl: this.router.url }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }

  onViewClick(gateId): void {
    try {
      this.router.navigate([
        "/pages/configuration/settings/AddPageWiseControl",
        { mode: "view", passId: gateId, returnUrl: this.router.url }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }


  get() {
  
    this.loading = true;
    this.masterService.getPageWiseControlListDetail('',1,this.paginationRowCount).subscribe(res => {
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
      this.masterService.getPageWiseControlListDetail('',pageIndex,this.paginationRowCount).subscribe(res => {
    
        this.locationListDetail = res.lstlocation;
        this.locationListDetailFilter = res.lstlocation;
      
      });
  }

  
}
