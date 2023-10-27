import {Component, Output, EventEmitter} from '@angular/core';
import { MasterRepo } from '../../../common/repositories';


@Component({
    selector:'PRICELIST',
    templateUrl:'./PRICELIST.component.html',
    styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
    // styleUrls:['../MasterDialogReport/Report.css']
  
})
export class PRICELIST{
 
 @Output() reportdataEmit = new EventEmitter();
    constructor(public masterService:MasterRepo ){ 
                       
    }
    onload()
    {
       this.DialogClosedResult("ok");
    }
    public DialogClosedResult(res) {
    this.reportdataEmit.emit({ status: res, data: {reportname:'PRICELIST',reportparam: {           
    } }});  
    }

      // Close Method
      closeReportBox(){
        this.DialogClosedResult("Error");
    }


}