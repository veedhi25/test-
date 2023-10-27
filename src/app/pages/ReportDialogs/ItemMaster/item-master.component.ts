import {Component, Output, EventEmitter} from '@angular/core';
import { MasterRepo } from '../../../common/repositories';


@Component({
    selector:'item-master',
    templateUrl:'./item-master.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
  
})
export class ItemMasterReport{
 
 @Output() reportdataEmit = new EventEmitter();
    constructor(public masterService:MasterRepo ){ 
                       
    }
    onload()
    {
       this.DialogClosedResult("ok");
    }
    public DialogClosedResult(res) {
    this.reportdataEmit.emit({ status: res, data: {reportname:'ITEM MASTER',reportparam: {           
    } }});  
    }

      // Close Method
      closeReportBox(){
        this.DialogClosedResult("Error");
    }


}