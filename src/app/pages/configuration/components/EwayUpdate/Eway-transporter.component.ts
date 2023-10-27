import { Component, Output, EventEmitter, ViewChild } from "@angular/core";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { MasterRepo } from "../../../../common/repositories";

@Component({
    selector: "eway-transporter",
    templateUrl: "./Eway-transporter.component.html",
})
export class EwayTransporterComponent {
    @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;
    isActive: boolean = false;
    TransporterList: any[] = [];
    public transporterData: TransporterDetail = <TransporterDetail>{};
    gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
    @Output() transporterDataEmitted = new EventEmitter();
    constructor(private alertService: AlertService,
        private loadingService: SpinnerService, private masteService: MasterRepo) {
        this.gridPopupSettings = Object.assign(new GenericPopUpSettings, masteService.getGenericGridPopUpSettings('Transporter'));
        this.initialiseDefaultValues()
    }

    show() {
        this.isActive = true;
    }
    initialiseDefaultValues() {
        this.transporterData.TRANSPORTERID = null
        this.transporterData.PERSON = null
        this.transporterData.DRIVERNO = null
        this.transporterData.DRIVERNAME = null
        this.transporterData.VEHICLENAME = null
        this.transporterData.TOTALBOX = null
        this.transporterData.TOTALWEIGHT = null
        this.transporterData.MODE = null
        this.transporterData.AMOUNT = null
        this.transporterData.LRDATE = new Date();
        this.transporterData.LRNO = null
        this.transporterData.TRANSPORTER = null
        this.transporterData.VEHICLENO = null
        this.transporterData.DISTANCE = null;
    }

    hide() {
        this.isActive = false;
        this.initialiseDefaultValues();
    }
    Update() {

        if (this.transporterData.DISTANCE == null || this.transporterData.DISTANCE == 0) {
            this.alertService.warning("Distance field is required!")
            return;
        }
        this.transporterDataEmitted.emit(this.transporterData);

    }



    onEnterTransporter() {
        this.loadingService.show("Getting data, please wait...");
        this.masteService.CHECKTRANSPORT().subscribe(res => {

            if (res.status == 'ok') {
                this.loadingService.hide();
                if (res.result.length > 1) {
                    this.genericGrid.show()
                }
                else {
                    var a = res.result[0];
                    this.transporterData.TRANSPORTER = a.NAME;
                }
            }
        })
    }
    onItemDoubleClick(event) {
        this.transporterData.TRANSPORTER = event.NAME;
        this.transporterData.TRANSPORTERID = event.GSTNO;
    }
}
export interface TransporterDetail {
    TRANSPORTERID: string;
    PERSON: string;
    DRIVERNO: string;
    DRIVERNAME: string;
    VEHICLENAME: string;
    TOTALBOX: string;
    TOTALWEIGHT: string;
    MODE: string;
    AMOUNT: string;
    LRDATE: Date | string;
    LRNO: string;
    TRANSPORTER: string;
    VEHICLENO: string;
    DISTANCE: number;

}


