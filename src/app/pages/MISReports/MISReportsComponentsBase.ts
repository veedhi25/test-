import { Injector } from "@angular/core";
import { AppComponentBase } from "../../app-component-base";

export abstract class MISReportsComponentBase extends AppComponentBase {

    constructor(public injector: Injector) { 
        super(injector)
    }
    
public downloadReport(misReportName){

}
}