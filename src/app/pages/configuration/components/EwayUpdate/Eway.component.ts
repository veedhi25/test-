import { Component, ViewChild, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { EwayService, EwayArray } from './Eway.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Ewaypopupcomponent } from './Ewaypopup.component';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { AuthService } from '../../../../common/services/permission';
import { EwaypopupRowDataComponent } from './EwaypopupRowData.component';
import * as moment from 'moment';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { EwayTransporterComponent } from './Eway-transporter.component';
import { isNullOrUndefined } from 'util';
import { AppSettings } from '../../../../common/services';
@Component(
  {
    selector: 'EwayUpdate',
    templateUrl: './Eway.html',
    styleUrls: ["../../../modal-style.css", "./../../../../common/Transaction Components/_theming.scss"],
    providers: [EwayService],
  }
)
export class EwayComponent {
  @ViewChild("ewaypopup") ewaypopup: Ewaypopupcomponent;
  @ViewChild("rowdatapopup") rowdatapopup: EwaypopupRowDataComponent;
  @ViewChild("multiTransporter") multiTransporter: EwayTransporterComponent;
  @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  @Output()
  From: Date | string; //start date bind
  To: Date | string; //end date bind
  EwayObj: any = <any>{}
  activerowIndex: number = 0;
  multiVchrObj: any;
  downloadJsonHref: any;
  userProfile: any;
  constructor(private masterService: MasterRepo, private authservice: AuthService, private _activatedRoute: ActivatedRoute, private service: EwayService, private sanitizer: DomSanitizer, private alertService: AlertService,public appSetting:AppSettings,
    private loadingService: SpinnerService) {
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
    this.loadingService.show("Getting E-Way Bills, Please wait...");
    this.service.getAllTodaysEway().subscribe(res => {
      if (res.status == "ok") {
        if (res.result.length == 0) {
          this.alertService.info("No E-Way bills of today!")
        }
        this.service.ewayList = res.result;
        this.loadingService.hide();
      }
    }),
      error => {
        this.loadingService.hide();
        this.alertService.error("Error on getting data!")
        this.masterService.resolveError(error, "E-Way - Getting Bills");
      }
    this.multiVchrObj = '';
  }
  ngAfterViewInit() {
    this.userProfile = this.authservice.getUserProfile()
    //
    this.EwayObj.Location = this.userProfile.CompanyInfo.ADDRESS;
    this.EwayObj.Type = "Sale";
    this.EwayObj.Customer = "%"
  }
  setDate() {
    this.From = moment(this.EwayObj.from).format("MM-DD-YYYY");
  }
  endDate() {
    this.To = moment(this.EwayObj.to).format("MM-DD-YYYY");
  }

  update() {
    this.ewaypopup.show();
  }
  download_eway() {
    if (this.service.ewayList.filter(e => e.EWAYCHECK == true)[0] == null) {
      this.alertService.warning("Please select the Bill");
      return;
    }
    this.VoucherCollection();
    if (this.multiVchrObj == '') {
      this.alertService.warning("Please select E-Way Bills first!");
      return
    }
    
    this.loadingService.show("Preparing JSON..");
    this.service.getEwayJson(this.multiVchrObj).subscribe(res => {
      if (res.status == 'ok') {
        this.loadingService.hide();
        let results = JSON.parse(res.result);
        // this.alertService.success("JSON Download Completed!")
        var ewayJSON = JSON.stringify(results.result);
        var element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(ewayJSON));
        element.setAttribute('download', `EwayJSON${moment(new Date()).format("YYYYMMDDHHMMSS")}.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }),
      error => {
        this.loadingService.hide();
        this.alertService.error("Error on preparing JSON!")
        this.masterService.resolveError(error, "E-Way - Preparing JSON");
      }

  }


  onCustomerEnterCommand($event) {
    $event.preventDefault();
    this.genericGridCustomer.show();
  }




  onCustomerSelected(customer) {


    this.EwayObj.Customer = customer.ACID;
    this.EwayObj.CustomerName = customer.ACNAME;
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }




  ApplyEway() {
    this.loadingService.show("Getting E-Way Bills, Please wait...");
    this.service.getEwayFromDateRange(this.From, this.To, this.EwayObj.Type, this.EwayObj.Customer).subscribe(res => {
      this.loadingService.hide();
      if (res.status == "ok") {
        if (res.length == 0) {
          this.alertService.info("Cannot find Bills from Date Range!")
        }
        this.masterService.ShowMore = true;
        this.service.ewayList = res.result;
      }
      if (res.status == "error") {
        this.alertService.error(
          `Error in getting Eway Bills: ${res.result}`
        );
      }
    }),
      error => {
        this.loadingService.hide();
        this.alertService.error(
          `Error in getting Eway Bills: ${error.result._body}`
        );
      }
  }
  VoucherCollection() {
    this.multiVchrObj = ''
    for (var i of this.service.ewayList.filter(e => e.EWAYCHECK == true)) {
      this.multiVchrObj += i.VCHRNO + ',';
    }
  }
  vchrno: any;
  checkbox: any;

  RowTransporterClick(value) {
    this.service.selectedTransportObj = value;
    this.service.selectedTransportObj.LRDATE = isNullOrUndefined(value.LRDATE)?moment(new Date()).format("YYYY-MM-DD"):moment(value.LRDATE).format("YYYY-MM-DD");
    this.rowdatapopup.show();
  }




  addTransporter() {
    if (this.service.ewayList.filter(e => e.EWAYCHECK == true)[0] == null) {
      this.alertService.warning("Please select the Bill to update transporter information");
      return;
    } else {
      this.multiTransporter.show();
    }
  }


  updateTransporterInformation(data: any) {
    let tdata = <any>[]
    this.service.ewayList.forEach(e => {
      if (e.EWAYCHECK == true) {
        let t = Object.assign({},data);
        t.VCHRNO = e.VCHRNO;
        t.COUNTER = e.Counter;
        t.CUSTOMER = e.Customer;
        e.TRANSPORTER = t.TRANSPORTER;
        tdata.push(t);
      }
    });
    this.multiTransporter.hide();
    this.loadingService.show("Updating transporter information.Please wait.")
    this.masterService.masterPostmethod("/updateMultipleTransporter", tdata).subscribe((res) => {
      if (res.status == "ok") {
        this.loadingService.hide();
      } else {
        this.loadingService.hide();
        this.alertService.error(res.message)
      }
    }, error => {
      this.loadingService.hide();
    })
  }


}
