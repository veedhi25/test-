import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomerItemMappingService } from "./customer-item-mapping.service";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../../common/services/spinner/spinner.service";


@Component({
  selector: "customer-item-mapping",
  templateUrl: "./customer-item-mapping.component.html",
  providers: [CustomerItemMappingService]
})
export class CustomerItemMappingComponent implements OnInit {
  @ViewChild("genericGridCusItmMapping") genericGridCusItmMapping: GenericPopUpComponent;
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  public modeTitle: string = "Customer Item Mapping"
  private customerItemMappingForm: FormGroup
  private verticalList
  selectedVerticalList = [];
  private mode: string = ""
  isDistributorSelected: boolean = false
  constructor(private _fb: FormBuilder, private service: CustomerItemMappingService, private loadingService: SpinnerService
    , private alertService: AlertService) {
    this.service.getVerticals().subscribe(res => {
      this.verticalList = res.data
    })

    this.customerItemMappingForm = this._fb.group({
      DBCODE: ['', Validators.required],
      DBNAME: [''],
      VerticalList: ['', Validators.required],
      mode: [],
      SDCODE: [''],
      SPDNAME: [{ value: '', disabled: true }]
    })

    this.gridPopupSettings = Object.assign(new GenericPopUpSettings,{
      title: "Distributor Lists",
      apiEndpoints: `/getDistributorPagedList`,
      defaultFilterIndex : 1,
      columns: [
        {
          key: "OrgCode",
          title: "Org Code.",
          hidden: false,
          noSearch: false
        },
        {
          key: "OrgName",
          title: "Org Name",
          hidden: false,
          noSearch: false
        },
        {
          key: "SuperDistributorName",
          title: "SuperDistributor Name",
          hidden: false,
          noSearch: false
        },
        {
          key: "OrgAddress",
          title: "Org Address",
          hidden: false,
          noSearch: false
        },
        {
          key: "PCL",
          title: "PCL",
          hidden: true,
          noSearch: false
        }

      ]
    });


  }

  ngOnInit() {

  }


  showLoadFromDistributorPopup() {
    this.genericGridCusItmMapping.show()
  }

  onDistributorClicked(event) {
    
    try {
      this.service.getCustomerItemMappingForDistributor(event.OrgCode).subscribe(res => {

        if (res.data.length) {
          this.mode = "edit"
          this.selectedVerticalList = res.data
        } else {
          this.selectedVerticalList=[]
          this.mode = "add"
        }
      })

      this.customerItemMappingForm.patchValue(
        {
          DBCODE: event.OrgCode,
          DBNAME: event.OrgName,
          SDCODE: event.ParentOrgCode,
          SPDNAME: event.SuperDistributorName
        }
      )
      this.isDistributorSelected = true
    }
    catch (ex) {
      this.alertService.warning(ex)
    }
  }


  addToSelectedVerticalList(index) {
    try {
      let selectedItem = this.verticalList[index];
      if (!selectedItem || selectedItem == null || selectedItem == undefined || selectedItem.length) { return; }
      var duplicateIndex = this.selectedVerticalList.findIndex(x => x.BrandId == selectedItem.BrandId);
      if (duplicateIndex > -1) {
        this.alertService.warning(this.verticalList[index].BrandName + " is already selected. Please Select another");
        this.customerItemMappingForm.controls['VerticalList'].reset();
        return;
      }
      else {
        this.selectedVerticalList.push(this.verticalList[index]);
        this.customerItemMappingForm.controls['VerticalList'].reset();
      }
    }
    catch (ex) {
      this.alertService.error(ex);
    }
  }



  preventKeyPress() {
    return false

  }

  onSave() {
    this.customerItemMappingForm.patchValue(
      {
        mode: this.mode,
      }
    )
    try {
      if (!this.customerItemMappingForm.controls['DBCODE'].valid || !this.selectedVerticalList.length) {
        this.alertService.info(
          "Invalid Request, Please enter all required fields."
        );
        return;
      } else {
        this.customerItemMappingForm.patchValue({
          VerticalList: this.selectedVerticalList
        })
        this.onsubmit();
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }



  onsubmit() {
    
    try {
      this.loadingService.show("Saving data, please wait...");
      this.service.SaveCustomerItemMapping(this.customerItemMappingForm.value).subscribe((res) => {
        
        if (res.status == "ok") {
          this.loadingService.hide()
          this.alertService.success("Data Saved Successfully");
          this.cancel()

        } else {
          this.loadingService.hide()
          this.alertService.warning(res.result.statusText);

        }
      })
    } catch (e) {
      this.alertService.error(e);
    }
  }



  removeFromSelectedVerticals(index) {
    this.selectedVerticalList.splice(index, 1)
  }
  cancel() {
    this.customerItemMappingForm.reset()
    this.selectedVerticalList = []
    this.isDistributorSelected = false
    this.mode = ""
  }

}
