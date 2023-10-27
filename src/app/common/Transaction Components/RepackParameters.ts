import { TransactionService } from "./transaction.service";
import { Component, ViewChild } from '@angular/core';
import { MasterRepo } from '../repositories/masterRepo.service';
import { GenericPopUpComponent, GenericPopUpSettings } from "../popupLists/generic-grid/generic-popup-grid.component";
import { VoucherTypeEnum } from "../interfaces/TrnMain";



@Component({
  selector: "repack-params",
  styleUrls: ["../../pages/Style.css"],
  templateUrl: "./RepackParameters.html",
})

export class RepackParametersComponent {


  constructor(public masterService: MasterRepo, private _trnMainService: TransactionService) {

  }

  ngOnInit() {


  }


}
