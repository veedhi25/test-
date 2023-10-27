import { Component, ViewChild, OnInit } from "@angular/core";
import { Console } from "console";
import { xor } from "lodash";
import { MasterRepo } from "../../../../common/repositories";
import { Router } from '@angular/router';
@Component({
  selector: "reportschedulerlisting",
  templateUrl: "./reportschedulerDetails.html",

})
export class ReportSchedulerDetails implements OnInit {
  public treeItem: string;
  public companyList: any[];
  public GrnList: any[];
  public reportSchedulerDetails: any[];
  public reportSchedulerDetailsFilter: any[];
  public ItemWiseLoc: any[];
  public list: any[];
  public listPageCount: any[];

  public paginationRowCount: number = 10; //number of records in a page
  private loading: boolean;
  public pageNumberArray: any[];
  public chkSelect: boolean;
  PageSize: number = 10;
  totalPageCount: number;
  DialogMessage: string = " "
  checked?: boolean;
  isShown: boolean = true;
  selectedData: string;
  errorList: string;
  startIndex: number;
  className: string;
  public searchLocation: string;
  constructor(private masterService: MasterRepo, private router: Router) {
    this.get();
  }

  ngOnInit() {

  }
  onAddClick(): void {
    try {
      this.router.navigate([
        "/pages/sms/reportscheduler",
        //{ mode: "addlocation", returnUrl: this.router.url }
      ]);
      /*this.router.navigate([
        "/pages/wms/addlocation",
        { mode: "addlocation", returnUrl: this.router.url }
      ]);
      */
    } catch (ex) {
      alert(ex);
    }
  }

  onupdateClick(gateId): void {

    try {
      this.router.navigate([
        "/pages/sms/reportscheduler",
        { mode: "edit", passId: gateId, returnUrl: this.router.url }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }

  onViewClick(gateId): void {
    try {
      this.router.navigate([
        "/pages/sms/reportscheduler",
        { mode: "view", passId: gateId, returnUrl: this.router.url }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }


  get() {
    this.loading = true;
    this.masterService.masterGetmethod(`/getReportSchedulerAsync?pageNo=1&pageSize=${this.paginationRowCount}`).subscribe(res => {
      console.log("getReportSchedulerAsync", res);

      this.reportSchedulerDetails = res.result;
      this.reportSchedulerDetailsFilter = res;

      if (this.reportSchedulerDetailsFilter.length > 0) {
        this.getArrayFromNumber(this.reportSchedulerDetails[0].countRecord);
      }
      this.loading = false;

    });

  }

  searchDivision(query: string) {

    let filteredParticipants = [];
    this.reportSchedulerDetails = this.reportSchedulerDetailsFilter;
    if (query) {
      this.reportSchedulerDetails = this.reportSchedulerDetails.filter(p => {
        if (p.ASSIGN_REPORT && p.ASSIGN_REPORT.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
        if (p.REPORT_NAME && p.REPORT_NAME.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
        if (p.STATUS_TYPE && p.STATUS_TYPE.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }

        return false;
      });
      //this.selectedVoucherList =  filteredParticipants;
    }
    else {
      this.reportSchedulerDetails = this.reportSchedulerDetailsFilter;

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
}
