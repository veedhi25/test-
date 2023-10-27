import {Component, Output, EventEmitter} from '@angular/core';
import { MasterRepo } from '../../../common/repositories';


@Component({
    selector:'OUTLETLIST',
    templateUrl:'./OUTLETLIST.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
  
})
export class OUTLETLIST{
 
 @Output() reportdataEmit = new EventEmitter();
    constructor(public masterService:MasterRepo ){ 
                       
    }
    onload()
    {
       this.DialogClosedResult("ok");
    }
    public DialogClosedResult(res) {
    this.reportdataEmit.emit({ status: res, data: {reportname:'OUTLETLIST',reportparam: {           
    } }});  
    }

      // Close Method
      closeReportBox(){
        this.DialogClosedResult("Error");
    }


}