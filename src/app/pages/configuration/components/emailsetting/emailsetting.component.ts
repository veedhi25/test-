import { Component, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";

@Component({
    templateUrl: "./emailsetting.component.html",
    styleUrls: ["./emailsetting.component.css"]
})



export class EmailSettingComponent implements OnInit {

    emailObj: any = <any>{}

    constructor(private _alertService: AlertService, private _loadingService: SpinnerService, private _masterRepo: MasterRepo) {

        this._masterRepo.masterGetmethod_NEW("/getemaildetail").subscribe((res) => {
            if (res.status == "ok") {
                this.emailObj.EMAIL = res.result;
            }
        }, error => {

        })
    }



    ngOnInit() {

    }


    onSaveClicked() {
        this._loadingService.show("please wait while saving.....");
        this._masterRepo.masterPostmethod_NEW("/savealternatemail", {}).subscribe((res) => {
            if (res.status == "ok") {
                this._alertService.success("saved successfully");
                this._loadingService.hide();
            }
        }, error => {
            this._loadingService.hide();
        })
    }


}

