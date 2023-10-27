import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter, Input } from "@angular/core";
import * as moment from 'moment'
import { MasterRepo } from "../../repositories";
import { Observable, Subscriber } from "rxjs";
import { AlertService } from "../../services/alert/alert.service";

@Component({
  selector: "report-filter",
  templateUrl: "./report-filter.component.html",
  // styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class ReportFilterComponent implements OnInit {
  private isActive: boolean = false

  @ViewChild('division') division: ElementRef
  @ViewChild('voucherType') voucherType: ElementRef
  @ViewChild('showNarration') showNarration: ElementRef
  @Output() filterEmiiter = new EventEmitter()
  @Input() reportType: string
  ReportFilterObj: ReportFilterOption = <ReportFilterOption>{}
  selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
  alwaysShowCalendars: boolean = true;

  locale = {
    format: 'DD/MM/YYYY',
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' - ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom Range',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: 0 // first day is monday
  }
  private divisionList = []
  private vouchertypeList = []
  constructor(private _masterRepo: MasterRepo, private _alertService: AlertService) {
    this._masterRepo.getAllDivisions().subscribe((res) => {
      this.divisionList.push(res)
    })
    // this._masterRepo.getAllVoucherType().subscribe((res) => {
    //   this.vouchertypeList.push(res)

    // })
    this.selectedDate = {
      startDate: moment(),
      endDate: moment()
    }
  }
  ngOnInit() {
    this.ReportFilterObj.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.ReportFilterObj.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
  }

  dateChanged(date) {
    this.ReportFilterObj.DATE1 = moment(this.selectedDate.startDate).format('MM-DD-YYYY')
    this.ReportFilterObj.DATE2 = moment(this.selectedDate.endDate).format('MM-DD-YYYY')
  }
  divisionChanged() {
    this.ReportFilterObj.DIV = this.division.nativeElement.value
  }

  showNarrationChanged() {
    this.ReportFilterObj.SHOWNARRATION = this.showNarration.nativeElement.value
  }


  voucherTypeChanged() {
    this.ReportFilterObj.VTYPE = this.voucherType.nativeElement.value
  }


  setVoucherName(id: string) {
    this.ReportFilterObj.VOUCHERNAME="All"
    this.vouchertypeList.forEach(x => {
      if (x.VOUCHER_ID == id) {
        this.ReportFilterObj.VOUCHERNAME = x.VOUCHER_TYPE
      }
    })
  }



  show() {
    this.isActive = true
  }

  popupClose() {
    this.isActive = false;
  }

  accodeChanged(value: string) {
    let item = this._masterRepo.accountList.find(x => x.ACCODE == value);
    this.ReportFilterObj.ACCNAME = '';
    if (item) {
      value = item.ACNAME;
      this.ReportFilterObj.ACCNAME = value;
    }
  }


  itemChanged(value: any) {
    if (typeof (value) === "object") {
      this.ReportFilterObj.ACCNAME = value.ACNAME;
      this.ReportFilterObj.ACCODE = value.ACCODE;
      this.ReportFilterObj.ACID = value.ACID;
    }
  }


  dropListItem = (keyword: any): Observable<Array<any>> => {

    return new Observable((observer: Subscriber<Array<any>>) => {
      this._masterRepo.getAccount("from partyreport").map(res => {

        return res.filter(x => x.ACID.substring(0, 2).toUpperCase() != 'PA' && x.TYPE == 'A');
      }).map(data => {
        return data.filter(ac => ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1 && ac.TYPE == 'A');
      }
      ).subscribe(res => { observer.next(res); })
    }).share();
  }


  applyClicked() {

    this.ReportFilterObj.DIV = this.division.nativeElement.value
    if (this.reportType == "Ledger Voucher") {
      if ('ACID' in this.ReportFilterObj) {
        this.filterEmiiter.emit(this.ReportFilterObj)
      } else {
        this._alertService.error("No Account Selected")
      }
    } else if (this.reportType == 'Voucher Register' || this.reportType =='Day Book') {
      this.setVoucherName(this.voucherType.nativeElement.value)
      this.ReportFilterObj.VTYPE = this.voucherType.nativeElement.value
      this.ReportFilterObj.SHOWNARRATION = this.showNarration.nativeElement.value
      this.filterEmiiter.emit(this.ReportFilterObj)
    }
  }
}



export interface ReportFilterOption {
  DATE1: string,
  DATE2: string,
  ACID: string,
  DIV: string,
  ACCNAME: string,
  ACCODE: string,
  SHOWNARRATION: boolean,
  VTYPE: string,
  VOUCHERNAME: string,
  showZeroBalance: boolean

}