import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterRepo } from '../../../../common/repositories';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
@Component({
    selector: 'add-deliveryBoy',
    templateUrl: './addDeliveryBoy.component.html',
    providers: [],

})

export class AddDeliveryBoyComponent implements OnInit {
    DialogMessage: string = "Saving data please wait ..."
    mode: string = "add";
    viewMode = false;
    modeTitle: string = '';
    deliveryBoYObj = <any>{};
    private returnUrl: string;
    rategroup: Array<any> = [];
    constructor(private loadingService: SpinnerService, private alertService: AlertService, private router: Router, private activatedRoute: ActivatedRoute, public masterService: MasterRepo) {

    }
    ngOnInit() {
        try {
            if (!!this.activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this.activatedRoute.snapshot.params['returnUrl'];

            }
            if (!!this.activatedRoute.snapshot.params['ACID']) {
                this.deliveryBoYObj.ACID = this.activatedRoute.snapshot.params['ACID'];

            }
            if (!!this.activatedRoute.snapshot.params['mode']) {
                this.deliveryBoYObj.MODE = this.activatedRoute.snapshot.params['mode'];
            }
            else {
                this.deliveryBoYObj.MODE = "add";
                this.modeTitle = "Add Delivery Boy";
            }


            if (this.deliveryBoYObj.MODE == "edit") {
                this.masterService.getAllAccount(this.deliveryBoYObj.ACID).subscribe((res) => {
                    if (res.status = "ok") {
                        let mode = this.deliveryBoYObj.MODE;
                        this.deliveryBoYObj = res.result;
                        this.deliveryBoYObj.MODE = mode;
                    }
                })
            }
            else if (this.deliveryBoYObj.MODE == "view") {
                this.masterService.getAllAccount(this.deliveryBoYObj.ACID).subscribe((res) => {
                    if (res.status = "ok") {
                        let mode = this.deliveryBoYObj.MODE;
                        this.deliveryBoYObj = res.result;
                        this.deliveryBoYObj.MODE = mode;
                    }
                })
            }
        } catch (ex) {
            alert(ex);
        }

    }

    onSave() {
        //validate before Saving
        try {
            if (this.deliveryBoYObj.MODE.toUpperCase() == "VIEW") {
                alert("Cannot save in view mode");
                return;
            }
            this.onsubmit();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    onsubmit() {
        try {

            this.loadingService.show("Saving data.Please Wait")
            this.masterService.saveDeliveryBoyMaster(this.deliveryBoYObj).subscribe((res: any) => {
                if (res.status == "ok") {
                    this.loadingService.hide();
                    this.cancel();
                } else {
                    this.loadingService.hide();
                    this.alertService.error(res.result);
                }
            }, error => {
                this.loadingService.hide();
                this.alertService.error(error._body);
            })
        }
        catch (e) {
            alert(e);
        }
    }
    cancel() {
        try {
            this.router.navigate([this.returnUrl]);
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

}