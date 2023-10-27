import { Component, ViewChild, OnInit } from "@angular/core";
import { Console } from "console";
import { xor } from "lodash";
import { Router } from '@angular/router';
import * as moment from 'moment'
import { MasterRepo } from "../../../common/repositories";
import { AlertService } from "../../../common/services/alert/alert.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { SpinnerService } from "../../../common/services/spinner/spinner.service";
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: "couponReport",
  templateUrl: "./couponReport.html",

})
export class CouponReportComponent implements OnInit {
  public couponReportDetails: any[];
  public couponMainArray: any[];
  public couponReportDetailsFilter: any[];
  public paginationRowCount: number = 10; //number of records in a page
  private loading: boolean;
  excelButtonstatus: boolean = true;
  public pageNumberArray: any[];
  public chkSelect: boolean;
  DialogMessage: string = " "
  checked?: boolean;
  isShown: boolean = true;
  selectedBillTo: boolean = true;
  public selectedMode: string = "";
  isShowExport: boolean = true;
  isShowDownload: boolean = false;
  public searchLocation: string;
  showTablestatus: boolean = false;
  public couponCount: number = 0;
  couponTotalAmount: number = 0;
  fileUrl;
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
  myModearr: any = [];
  constructor(private masterService: MasterRepo, private router: Router, private alertService: AlertService, private loadingService: SpinnerService, private sanitizer: DomSanitizer) {
  }
  modeStatus: any = [
    {
      name: "All",
      value: "all",
      checked: false
    },
    {
      name: "Reedem",
      value: "reedem",
      checked: false
    },
    {
      name: "Not Reedem",
      value: "notreedem",
      checked: false
    },
    {
      name: "Free To Use",
      value: "1",
      checked: false
    },

  ];

  getSelectedMode(val, flag) {
    if (flag) {
      this.unselectOthers(val);
    }
    if (val == "all" && flag) {
      this.couponReportDetailsFilter = this.couponMainArray;
    }
    else if (val == "reedem" && flag) {
      this.couponReportDetailsFilter = this.couponReportDetails.filter(e => e.UseFrequency == 1)
    }
    else if (val == "notreedem" && flag) {
      this.couponReportDetailsFilter = this.couponReportDetails.filter(e => (
        (e.IssuedTo != 'Coupon not assign') && (e.UseFrequency == 0)
      ))
    } else if (val == "1" && flag) {
      this.couponReportDetailsFilter = this.couponReportDetails.filter(e => ((e.IssuedTo == null) && e.FreetoUseByAnyone))
    }
    else {
      this.couponReportDetailsFilter = this.couponMainArray;
    }
    this.couponReportDetails = null;
    this.couponReportDetails = this.couponReportDetailsFilter;
    this.couponCount = this.couponReportDetails.length;
    this.getTotalAmount(this.couponReportDetails);
  }

  unselectOthers(val) {
    this.modeStatus.map((e) => {
      if (e.value != val) {
        
        e.checked = false;
      }
    })
  }




  ngOnInit() {
    this.get();
    //this.genericGridCustomer.show("", false, "");

  }

  getTotalAmount(mydata) {
    this.couponTotalAmount = 0;
    mydata.map(e => {
      this.couponTotalAmount = this.couponTotalAmount + parseInt(e.MaxDiscount);
    });
  }

  onExcelClicked() {
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(this.couponReportDetails));
    this.isShowDownload = true;
    this.isShowExport = false;
  }
  get() {
    this.loadingService.show('Loading data please wait....');
    this.masterService.masterGetmethod(`/getCouponReport`).subscribe(res => {
      this.loadingService.hide();
      if (res.status == "ok") {
        this.showTablestatus = true;
        this.couponMainArray = res.result;
        this.couponReportDetails = res.result;
        this.couponReportDetailsFilter = res.result;
        this.couponCount = this.couponReportDetails.length;
        this.getTotalAmount(this.couponReportDetails);
        //  console.log("this.couponReportDetailsFilter", this.couponReportDetailsFilter);
      } else {
        this.alertService.warning(res.message);
      }
    })
  }

  dateChanged(date) {


    if (this.selectedDate.startDate != null) {
      this.fromDate = moment(this.selectedDate.startDate).format('YYYY-MM-DD');
      this.toDate = moment(this.selectedDate.endDate).format('YYYY-MM-DD');
    }
    // console.log(this.fromDate +'='+this.toDate);

  }
  searchDivision(query: string) {

    this.couponReportDetails = this.couponReportDetailsFilter;
    if (query) {
      this.couponReportDetails = this.couponReportDetails.filter(p => {
        if (p.CouponListValue && p.CouponListValue.toLowerCase().includes(query.toLowerCase()) || p.CouponName && p.CouponName.toLowerCase().includes(query.toLowerCase()) || p.acid && p.acid.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
        return false;
      });
      //this.selectedVoucherList =  filteredParticipants;
    }
    else {
      this.couponReportDetails = this.couponReportDetailsFilter;
    }
    this.couponCount = this.couponReportDetails.length;
    this.getTotalAmount(this.couponReportDetails);
  }
}
