import { Component, OnInit, HostListener, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { DeviceSetting, ProfileName } from './devicesetting.interface';
import { DeviceSettingService } from './deviceSetting.service';

@Component({
  selector: 'device-setting',
  templateUrl: './devicesetting.component.html',
  styleUrls: ['./devicesetting.component.css'],
  providers: [DeviceSettingService]
})

export class DeviceSettingComponent {
  showDeviceSettingPopUp: boolean = false;
  filter: any;
  selectedRowIndex: number;
  searchByName: string = "searchByName";
  activeRowIndex: number = 0;
  formList: Array<DeviceSetting> = [
    { profileTypeLabel: 'Sales Order', profileTypeValue: "sales order" },
    { profileTypeLabel: 'Proforma Invoice', profileTypeValue: "proforma invoice" },
    { profileTypeLabel: 'Sales Invoice', profileTypeValue: "sales invoice" },
    { profileTypeLabel: 'Sales Return', profileTypeValue: "sales return" },
    { profileTypeLabel: 'Purchase Order', profileTypeValue: "purchase order" },
    { profileTypeLabel: 'RFQ', profileTypeValue: "RFQ" },
    { profileTypeLabel: 'Purchase Return', profileTypeValue: "purchase return" },
    { profileTypeLabel: 'Purchase Invoice', profileTypeValue: "purchase invoice" },
    { profileTypeLabel: 'Stock Issue', profileTypeValue: "stock issue" },
    { profileTypeLabel: 'Stock Settlement', profileTypeValue: "stock settlement" },
    { profileTypeLabel: 'Stock Settlement Approval', profileTypeValue: "stock settlement approval" },
    { profileTypeLabel: 'Opening Stock Entry', profileTypeValue: "opening stock entry" },
    { profileTypeLabel: 'Repack Entry', profileTypeValue: "repack entry" },
    { profileTypeLabel: 'Inter Company Transfer In', profileTypeValue: "inter company transfer in" },
    { profileTypeLabel: 'Inter Company Transfer Out', profileTypeValue: "inter company transfer out" },
    { profileTypeLabel: 'Transfer In', profileTypeValue: "transfer in" },
    { profileTypeLabel: 'Transfer Out', profileTypeValue: "transfer out" }
  ];


  deviceSettings: Array<DeviceSetting> = [];

  profilesList: Array<ProfileName> = [{
    profileNameLabel: "[ALT+1]POS Printer [3mm]",
    profileNameValue: "[ALT+1]POS Printer [3mm]",
    controlValue: 0
  },
  {
    profileNameLabel: "POS Printer without GST [3mm]",
    profileNameValue: "POS Printer without GST [3mm]",
    controlValue: 5
  },
  {
    profileNameLabel: "POS Printer Matrix [3mm]",
    profileNameValue: "POS Printer Matrix [3mm]",
    controlValue: 58
  },
  {
    profileNameLabel: "POS Printer [2mm]",
    profileNameValue: "POS Printer [2mm]",
    controlValue: 6
  },
  {
    profileNameLabel: "[ALT+2]Laser printer[A4]",
    profileNameValue: "[ALT+2]Laser printer[A4]",
    controlValue: 1
  },
  {
    profileNameLabel: "[ALT+3]A5 print",
    profileNameValue: "[ALT+3]A5 print",
    controlValue: 2,
  },
  {
    profileNameLabel: "Customized KW print",
    profileNameValue: "Customized KW print",
    controlValue: 10,
  },
  {
    profileNameLabel: "Customized ITC print",
    profileNameValue: "Customized ITC print",
    controlValue: 11
  },
  {
    profileNameLabel: "Download Excel File",
    profileNameValue: "Download Excel File",
    controlValue: 12
  },
  {
    profileNameLabel: "A4 Ashoka Wholesale",
    profileNameValue: "A4 Ashoka Wholesale",
    controlValue: 13
  },
  {
    profileNameLabel: "A5 Ashoka Wholesale",
    profileNameValue: "A5 Ashoka Wholesale",
    controlValue: 14
  },
  {
    profileNameLabel: "3mm Html Without GST",
    profileNameValue: "3mm Html Without GST",
    controlValue: 20
  },
  {
    profileNameLabel: "N.Tax Invoice [A4]",
    profileNameValue: "Neelam Enterprises Format",
    controlValue: 100
  }
  ];
  private deviceSettingList: Array<DeviceSetting> = [];
  constructor(private router: Router, private alertService: AlertService,
    private deviceSettingService: DeviceSettingService, private loadingService: SpinnerService) { }

  ngOnInit() {
    this.initialiseDefaults();
  }
  onSettingRowClicked(index) {
    this.activeRowIndex = index;
  }





  saveDeviceSetting() {
    this.loadingService.show("Saving data. Please wait....");



    this.deviceSettings.forEach(x => {
      let p = this.profilesList.filter(y => y.profileNameValue == x.profileNameValue);
      if (p && p.length) {

        x.controlValue = p[0].controlValue
      }
    })
    this.deviceSettingService.saveDeviceSetting(this.deviceSettings).subscribe((data: any) => {
      if (data.status == "ok") {
        this.loadingService.hide();
        this.alertService.success("Data saved successfully.");
        this.initialiseDefaults();
      }
      else {
        this.alertService.error(data.result);
      }


    })
  }

  initialiseDefaults() {
    this.loadingService.show("Getting data. Please wait....")
    this.deviceSettingService.getDeviceSetting().subscribe((data: any) => {
      if (data.status == "ok") {
        if (data.result && data.result.length) {
          this.deviceSettings = data.result;
        } else {
          this.deviceSettingList = [];
          this.addNewRow(0);
        }
        this.loadingService.hide();
      }
    });
  }
  closeDeviceSettingPopUp() {
    this.showDeviceSettingPopUp = false;
  }
  RowClickEvent(index) {
    this.selectedRowIndex = index;
  }


  dblClickProfile(value: ProfileName) {
    this.deviceSettings[this.activeRowIndex].profileNameLabel = value.profileNameLabel;
    this.deviceSettings[this.activeRowIndex].profileNameValue = value.profileNameValue;
    this.showDeviceSettingPopUp = false;
  }
  onShowPopUp(setting: DeviceSetting, event) {
    event.preventDefault();
    this.showDeviceSettingPopUp = true;
  }

  onBack() {
    this.router.navigate(['./pages/dashboard']);
  }






  addNewRow = (currentIndex: number) => {

    let newRow = <DeviceSetting>{};
    this.deviceSettings.push(newRow);
  }


  onFormChange = (currentIndex: number) => {
    let x = this.formList.filter(x => x.profileTypeLabel == this.deviceSettings[currentIndex].profileTypeLabel);
    this.deviceSettings[currentIndex].profileTypeValue = x[0].profileTypeValue;
  }




  onchangeDefaultPrint = (currentIndex: number, event) => {
    let selectedPrintProfile = this.deviceSettings[currentIndex];
    this.deviceSettings.filter(x => x.profileNameValue != selectedPrintProfile.profileNameValue && x.profileTypeValue == selectedPrintProfile.profileTypeValue).forEach(x => {
      x.DefaultPrint = false;
    })
  }






  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) {
    if (($event.code === "ArrowDown") && this.showDeviceSettingPopUp == true) {
      $event.preventDefault();
      if (this.selectedRowIndex == null) { this.selectedRowIndex = 0 };
      this.selectedRowIndex = this.selectedRowIndex + 1;
      if (this.selectedRowIndex > (this.profilesList.length - 1)) this.selectedRowIndex = this.profilesList.length - 1;
    }
    else if (($event.code === "ArrowUp" && this.showDeviceSettingPopUp == true)) {
      $event.preventDefault();
      if (this.selectedRowIndex == null) { this.selectedRowIndex = 0 };
      this.selectedRowIndex = this.selectedRowIndex - 1;
      if (this.selectedRowIndex < 0) this.selectedRowIndex = 0;
    }

    if (($event.code === "Enter" || $event.code == "NumpadEnter") && this.showDeviceSettingPopUp == true) {
      $event.preventDefault();
      if (this.selectedRowIndex != null) {
        if (this.profilesList[this.selectedRowIndex] != null) {
          this.dblClickProfile(this.profilesList[this.selectedRowIndex]);
        }
      }
    }

  }
}


