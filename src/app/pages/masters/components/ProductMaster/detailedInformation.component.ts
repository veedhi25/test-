import { Component, Input, ViewChild } from '@angular/core';
import { Product } from '../../../../common/interfaces/ProductItem';
import { AlternateUnit } from '../../../../common/interfaces/TrnMain';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { GenericPopUpComponent, GenericPopUpSettings } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
@Component({
  selector: "alternateunittabs",
  templateUrl:'./AlternateUnitTabComponent.html',

  styleUrls: ["../../../Style.css"],
})

export class AlternateUnitTabComponent {
  // BASEUNIT:string;
  Units: any[] = [];
  @Input() productObj: Product = <Product>{};
  CurAltUnit: AlternateUnit = <AlternateUnit>{};
  @Input() AlternateUnits: AlternateUnit[] = [];
  @ViewChild("genericUnitGrid") genericUnitGrid: GenericPopUpComponent;
  unitgridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  constructor(private masterService: MasterRepo,private _alertService:AlertService) {
    this.unitgridPopupSettings = {
      title: "UOM List",
      apiEndpoints: `/getUnitPagedList`,
      defaultFilterIndex: 0,
      columns: [
          {
              key: "UNITS",
              title: "Unit Of measurement",
              hidden: false,
              noSearch: false
          }

      ]
  };
  }

  onaltUnitClicked(){
    this.genericUnitGrid.show();
    return;
  }
  dblClickPopupItem(event) {
    this.CurAltUnit.ALTUNIT = event.UNITS;
    return;
}


  ngOnInit() {
    try {
      this.masterService.getUnits().subscribe(res => { this.Units.push(<any>res); });
    } catch (ex) {
     this._alertService.error(ex)
    }
    
    
  }

  AddAltUnit() {
    try {
      if ((this.AlternateUnits.filter(x => x.ALTUNIT == this.CurAltUnit.ALTUNIT)).length > 0) return;
      this.AlternateUnits.push(this.CurAltUnit);
      this.CurAltUnit = <AlternateUnit>{};
    } catch (ex) {
     this._alertService.error(ex)
    }
  }
  removeAU(index) {
    try {
      this.AlternateUnits.splice(index, 1);
    } catch (ex) {
     this._alertService.error(ex)
    }
  }
  editAU(index) {
    try {
      this.CurAltUnit = this.AlternateUnits[index];
      this.AlternateUnits.splice(index, 1);
    } catch (ex) {
     this._alertService.error(ex)
    }
  }
}