import { Component, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MasterRepo } from '../../../common/repositories';
import { Http } from '@angular/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ReportMainSerVice } from '../../Reports/Report.service';
import { TransactionService } from '../../../common/Transaction Components/transaction.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { DropdownSettings } from '../../../node_modules/angular4-multiselect-dropdown/index';
import { ItemAndMarginComponent } from '../../masters/components/itemandmargin/itemandmargin.component';

@Component({
  selector: 'MocWiseSales',
  templateUrl: './MocWiseSales.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class MocWiseSales {
  @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  public ACNAME: string = "";
  
  public selectedVoucherList = []
  public acidList = []
  @Output() reportdataEmit = new EventEmitter();
  listOfYear: any[] = [];
  public months: any[] = [];
 public selectedMonths=[];
 matrixSelectSetting: DropdownSettings = {
        singleSelection: false,
        text: 'Select',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'month',
        primaryKey: 'value',
        position: 'bottom'

    };
    


  constructor(public reportFilterService: ReportMainSerVice, public masterService: MasterRepo) { 

    let currentYear = new Date().getFullYear() - 1;
    for (let i = 0; i < 50; i++) {
      this.listOfYear.push({
        year: currentYear++
      })
    }

    this.gridPopupSettingsForCustomer = {
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
          key: "ACCODE",
          title: "CODE",
          hidden: false,
          noSearch: false
        }
      ]
    };


    //this.months = _.times(12).map(i => <any>{ month: moment().month(i).format("MMMM"), value: i+1 });
    this.months = _.times(12).map(i => <any>{ month: moment().month(i).format("MMMM"), value: i+1 });
    //this.userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
//console.log(this.months);
//{ month: , value:  }


  }
  onload() {
    let commaSeperatedMonths = '';
    this.selectedMonths.forEach(function(item,index){
        commaSeperatedMonths += item.value + ',';
    });
    if(commaSeperatedMonths.length > 0)
    {
      commaSeperatedMonths = commaSeperatedMonths.substring(0,commaSeperatedMonths.length-1);
    }
    else{
    var monthsArray = [];
    this.months.map(month=>{
    monthsArray.push(month.value);
    });
    commaSeperatedMonths =monthsArray.join(',');
    //console.log(commaSeperatedMonths);
        //commaSeperatedMonths +=


    }
    console.log(commaSeperatedMonths);
    this.reportFilterService.repObj.reportparam.MONTH = commaSeperatedMonths;
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
    //let currentDate = this.reportFilterService.calendarForm.value;
    //this.reportFilterService.repObj.reportparam.DATE1 = moment(currentDate.selectedDate.startDate).format('MM-DD-YYYY')
    //this.reportFilterService.repObj.reportparam.DATE2 = moment(currentDate.selectedDate.endDate).format('MM-DD-YYYY')
    //this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
    this.reportFilterService.repObj.reportparam.ACID = this.acidList.length ? this.acidList.join(",") : '%';
   // this.repObj.reportparam.acid = this.acidList.length ? this.acidList.join(",") : '%';
  }
  ngOnInit() {
  }


  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }


  onCustomerSelected(customer) {
    let x: any
    x = this.selectedVoucherList.filter(itm => itm.ACID == customer.ACID)
    if (x.length > 0) {
      return;
    }
    this.selectedVoucherList.push(customer)
    this.acidList.push(customer.ACID)
  }


  removeFromSelectedList(index) {
    this.selectedVoucherList.splice(index, 1)
    this.acidList.splice(index, 1)
  }


  preventInput($event) {
    $event.preventDefault();
    return false;
  }


  customerEnterCommand() {
    this.genericGridCustomer.show();
  }

  onMultiSelect(event) {

  }

}