import { TransactionService } from "./transaction.service";
import { Component, ViewChild } from '@angular/core';
import { MasterRepo } from './../repositories/masterRepo.service';
import { GenericPopUpComponent, GenericPopUpSettings } from "../popupLists/generic-grid/generic-popup-grid.component";
import { VoucherTypeEnum } from "../interfaces/TrnMain";



@Component({
  selector: "inv-params",
  styleUrls: ["../../pages/Style.css"],
  templateUrl: "./InventoryParameters.html",
})

export class InventoryParametersComponent {
  @ViewChild("genericGridCustomer") genericGridCustomer: GenericPopUpComponent;
  gridPopupSettingsForCustomer: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridWarehouse") genericGridWarehouse: GenericPopUpComponent;
  gridPopupSettingsForWarehouse: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGridRemarks") genericGridRemarks: GenericPopUpComponent;
  gridPopupSettingsForRemarks: GenericPopUpSettings = new GenericPopUpSettings();
  warehouseList: any = [];
  divisionlist: any = [];
  remarksList: any = [];
  constructor(public masterService: MasterRepo, private _trnMainService: TransactionService) {
    this.masterService.getWarehouseList().subscribe((res) => {
      this.warehouseList.push(res)
    })
    this.masterService.getAllDivisions().subscribe((res) => {
      this.divisionlist.push(res);
    })
  }

  ngOnInit() {
    this.gridPopupSettingsForCustomer = {
      title: `${this._trnMainService.TrnMainObj.VoucherType == VoucherTypeEnum.InterCompanyTransferIn ? 'Party List' : 'Party List'}`,
      apiEndpoints: `/getInterIntraParty`,
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
          key: "GEO",
          title: "TYPE",
          hidden: false,
          noSearch: false
        }
      ]
    };
    this.gridPopupSettingsForWarehouse = Object.assign(new GenericPopUpSettings, {
      title: "Warehouse",
      apiEndpoints: `/getAllWarehousePagedList`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: "NAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        }
      ]
    });

    this.masterService.getRemarksMaster(`/getRemarksPagedList`)
      .subscribe(res => {
        var remarklist = [];
        res.data.forEach(e => {
          if (e.remarksType == "stockissue") {
            remarklist.push(e)
          }
        });
        this.remarksList = remarklist;
      }
      );

  }
  FromWarehouseFieldDisabled(): boolean {
    if (this._trnMainService.TrnMainObj.ProdList != null) {
      if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
        return true;
      }
    }
    return false;
  }


  partyFieldChange() {
    this._trnMainService.TrnMainObj.PARAC = null;
    this._trnMainService.TrnMainObj.TRNAC = null;
    this._trnMainService.TrnMainObj.BILLTOADD = null;
    this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = null;
    this._trnMainService.TrnMainObj.TRNMODE = "credit";
    this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = null;
    this._trnMainService.TrnMainObj.CREDITDAYS = 0;
    this._trnMainService.TrnMainObj.BILLTO = null;

  }





  partyFieldDisabled(): boolean {
    if (this._trnMainService.TrnMainObj.ProdList != null) {
      if (this._trnMainService.TrnMainObj.ProdList.filter(x => x.MCODE != null).length > 0) {
        return true;
      }
    }
    return false;
  }



  partyTabCommand(e) {
    e.preventDefault();
    this.genericGridCustomer.show("", false, "");
  }



  partyEnterCommand(e) {
    e.preventDefault();
    this.genericGridCustomer.show("", false, "");
  }
  onCustomerSelected(customer) {
    this._trnMainService.TrnMainObj.AdditionalObj.BILLTOPAN = customer.VATNO;
    this._trnMainService.TrnMainObj.BILLTO = customer.ACNAME;
    this._trnMainService.TrnMainObj.PARAC = customer.ACID;
    this._trnMainService.TrnMainObj.TRNAC = customer.ACID;
    this._trnMainService.TrnMainObj.BILLTOADD = customer.ADDRESS;
    this._trnMainService.TrnMainObj.AdditionalObj.TRNTYPE = customer.PSTYPE == null ? "local" : customer.PSTYPE.toLowerCase();
    this._trnMainService.TrnMainObj.TRNMODE = (customer.PMODE == null || customer.PMODE == "") ? "credit" : customer.PMODE;
    this._trnMainService.TrnMainObj.PARTY_ORG_TYPE = customer.GEO;
    this._trnMainService.TrnMainObj.CREDITDAYS = this._trnMainService.TrnMainObj.AdditionalObj.CREDITDAYS = customer.CRPERIOD;
    this._trnMainService.TrnMainObj.INVOICETYPE = customer.CTYPE;
    this._trnMainService.TrnMainObj.CDRATE = customer.CDISCOUNT;
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }


  WarehouseEnterCommand(event) {
    this.genericGridWarehouse.show();
  }
  onWarehouseSelected(event) {
    this._trnMainService.TrnMainObj.MWAREHOUSE = event.NAME;
  }
  getRemarksSettings() {
    this.gridPopupSettingsForRemarks = {
      title: 'Remarks',
      apiEndpoints: `/getRemarksPagedList`,
      defaultFilterIndex: 0,
      showActionButton: true,
      actionKeys: [{
        icon: "fa fa-trash",
        text: "DELETE",
        title: "Click to hide invoice."
      }],
      columns: [
        {
          key: "remarks",
          title: "REMARKS",
          hidden: false,
          noSearch: false
        },
      ]
    };
  }
  onRemarksSelect() {
    let VT = this._trnMainService.TrnMainObj.VoucherType;
    if (VT != VoucherTypeEnum.StockIssue) {
      return;
    }
    else {
      this.getRemarksSettings();
      this.genericGridRemarks.show();

    }
  }
  onRemarksSelected(event) {
    this._trnMainService.TrnMainObj.REMARKS = event.remarks;
  }

  showRemarksForm: boolean = false;
  remarks: string;
  selectedremarks: string;
  addRemarks() {
    if (this._trnMainService.TrnMainObj.VoucherType == 5) {
      this.showRemarksForm = true;
    }
    else {
      return;
    }
  }
  closeRemarks() {
    if (this._trnMainService.TrnMainObj.VoucherType == 5) {
      this.showRemarksForm = false;
      this.remarks = '';
    }
    else {
      return;
    }
  }
  onSaveRemarks() {
    if (this.remarks == '' || this.remarks == undefined || !this.remarks) {
      alert("Remarks cannot be null");
      return;
    }
    this.masterService.saveRemarks(this.remarks, 'stockissue').subscribe((data: any) => {
      console.log("success");
      this.closeRemarks();
    });
  }

  onDeleteRemarks(event) {
    if (event.remarks == '' || event.remarks == undefined || !event.remarks) {
      alert("Selected Remarks cannot be null");
      return;
    }

    this.masterService.DeleteRemarks(event.remarks, 'stockissue').subscribe((data: any) => {
      this.closeRemarks();
      this.genericGridRemarks.refresh();
    });

  }


}
