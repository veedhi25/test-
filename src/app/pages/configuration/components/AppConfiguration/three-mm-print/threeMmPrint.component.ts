import { Component, OnInit, HostListener, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterRepo } from '../../../../../common/repositories';
import { AlertService } from '../../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../../common/services/spinner/spinner.service';
import { ThreeMmPrint, ProfileName } from './threeMmPrint.interface';
import { ThreeMmPrintService } from './threeMmPrint.service';

@Component({
  selector: 'three-mm-print',
  templateUrl: './threeMmPrint.component.html',
  styleUrls: ['./threeMmPrint.component.css'],
  providers: [ThreeMmPrintService]
})

export class ThreeMmPrintComponent {
  headerSelectedValue: any = [];
  bodySelectedValue: any = [];
  footerSelectedValue: any = [];
  printformatList: any[] = [];
  multiselectSetting: any = {
    singleSelection: false,
    text: 'Select',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: false,
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
    labelKey: 'Name',
    primaryKey: 'Name',
    position: 'bottom'
  };

  ThreeMmPrints: Array<ThreeMmPrint> = [];

  public threeMmPrint: Array<ThreeMmPrint> = [];
  public HeaderSettingList = [
    {
      "Name": "Company Name"
    },
    {
      "Name": "TIN Number"
    },
    {
      "Name": "CIN Number"
    },
    {
      "Name": "VAT Number"
    },
    {
      "Name": "Phone Number"
    },
    {
      "Name": "Adresss"
    },
    {
      "Name": "Company Logo"
    },
    {
      "Name": "Separator"
    }
  ];

  public BodySettingList = [
    {
      "Name": "S No"
    },
    {
      "Name": "Item Name"
    },
    {
      "Name": "HSN Code"
    },
    {
      "Name": "Quantity"
    },
    {
      "Name": "Rate"
    },
    {
      "Name": "Net Amount"
    }
  ]

  public FooterSettingList = [
    {
      "Name": "No Of Items"
    },
    {
      "Name": "Quantity"
    },
    {
      "Name": "Total Quantity"
    },
    {
      "Name": "GST"
    },
    {
      "Name": "IGST"
    },
    {
      "Name": "Net Amount"
    },
  ]

  constructor(public masterService: MasterRepo, private router: Router, private alertService: AlertService,
    private ThreeMmPrintService: ThreeMmPrintService, private loadingService: SpinnerService) { }

  ngOnInit() {
    this.getAllPrintFormatforPrintTool();
  }
  onSettingRowClicked(index) {
    //this.activeRowIndex = index;
  }

  saveThreeMmPrint() {

  }

  initialiseDefaults() {

  }

  onBack() {
    this.router.navigate(['./pages/dashboard']);
  }

  @HostListener("document : keydown", ["$event"])
  updown($event: KeyboardEvent) {

  }

  onMultiSelect(event) {

  }

  printProfile: any;
  showProfileName: boolean = false;
  onAddNewProfile() {
    this.showProfileName = true
  }

  showDiv(value: string) {
    return this.headerSelectedValue.filter((e: any) => e.Name == value).length > 0
  }
  showBodySettingDiv(value: string) {
    return this.bodySelectedValue.filter((e: any) => e.Name == value).length > 0
  }
  showFooterSettingDiv(value: string) {
    return this.footerSelectedValue.filter((e: any) => e.Name == value).length > 0
  }


  getAllPrintFormatforPrintTool() {
    this.masterService.masterGetmethod("/getAllPrintFormatforPrintTool").subscribe((res) => {
      this.printformatList = res.result;
    })
  }

}