import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Channel } from '../../../../common/interfaces/channel.interface';
import { ChannelService } from './channel.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { PreventNavigationService } from '../../../../common/services/navigation-perventor/navigation-perventor.service';
import { AuthService } from '../../../../common/services/permission';


@Component({
    selector: 'channel',
    templateUrl: './channel.component.html',
    providers: [ChannelService],
    styleUrls: ["../../../modal-style.css"],
})
export class ChannelComponent implements OnInit, OnDestroy {
    viewMode = false;
    mode: string = "add";
    modeTitle: string = '';
    channelObj: Channel = <Channel>{};
    initialTextReadOnly: boolean = false;
    private returnUrl: string;
    form: FormGroup;
    private subcriptions: Array<Subscription> = [];
    ChannelList: any[] = [];
    showChanelOption = false;
    userProfile: any = <any>{};
    Channeltype: any;
    ngOnInit() {
        try {
            this.getParent();
            // this.getChanel();


        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    constructor(
        private loadingService: SpinnerService,
        private alertService: AlertService,
        private preventNavigationService: PreventNavigationService,
        protected masterService: MasterRepo,
        protected _Channelservice: ChannelService,
        private router: Router,
        private fb: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        public authservice: AuthService
    ) {
        this.buildForm();

        this.Channeltype = 'Channel';
        this.userProfile = this.authservice.getUserProfile()
       
    }
    ngAfterViewInit() {
        if (!!this._activatedRoute.snapshot.params['returnUrl']) {
            this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
        }
        if (!!this._activatedRoute.snapshot.params['ChannelCode']) {
            let ChannelCode: string = "";
            ChannelCode = this._activatedRoute.snapshot.params['ChannelCode'];

            this._Channelservice.getChanel(ChannelCode)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        console.log(data);
                        let channelObj = data.result;
                        if (channelObj.ChannelType == 'Channel') {
                            this.Channeltype = 'Channel';
                            this.form.patchValue({
                                ChannelCode: channelObj.ChannelCode,
                                ChannelName: channelObj.ChannelName,
                                ChannelType: channelObj.ChannelType,
                                STATUS: channelObj.STATUS

                            })
                        }
                        else {
                            this.Channeltype = 'Sub-Channel';
                            var a: any = <any>{}


                            this.form.patchValue({
                                ChannelCode: channelObj.ChannelCode,
                                ChannelSubTypeCode: channelObj.ChannelSubTypeCode,
                                ParentChannelCode: channelObj.ParentChannelCode,
                                ChannelName: channelObj.ChannelName,
                                ChannelType: channelObj.ChannelType,
                                STATUS: channelObj.STATUS,
                                
                            })


                        }



                        if (this._activatedRoute.snapshot.params['mode'] == "edit") {
                            this.modeTitle = "Edit Channel";
                            this.DisabledonEdit();
                            this.form.get('ChannelType').disable();
                           

                        } else if (this._activatedRoute.snapshot.params['mode'] == "view") {
                            this.modeTitle = "View Channel";
                        }
                        this.mode = 'edit';
                        this.initialTextReadOnly = true;
                        this.form.get('ChannelType').disable();
                        this.form.get('ParentChannelCode').disable();
                        this.form.get('ChannelName').disable();
                        this.form.get('STATUS').disable();

                    }
                    else {
                        this.mode = '';
                        this.modeTitle = "Edit -Error in Channel";
                        this.initialTextReadOnly = true;
                    }
                }, error => {
                    this.mode = '';
                    this.modeTitle = "Edit2 -Error in Channel";
                    this.masterService.resolveError(error, "Channel");
                }
                )
        }
        else {
            this.mode = "add";
            this.modeTitle = "Add Channel";
            this.initialTextReadOnly = false;

        }
    }
    buildForm() {
        this.form = this.fb.group({
            ChannelSubTypeCode: ["0"],
            ChannelName: ["", Validators.required],
            ChannelType: ["", Validators.required],
            STATUS: [1],
            ChannelCode: [0],
            ParentChannelCode: [''],
            CreateBy: ['']
        });
    }

    getParent() {
        this.masterService.getAllChannelParent().subscribe(
            (res) => {
                this.ChannelList = res;
            }
        )
    }

    // getChanel(){
    //   this.masterService.getAllChanel().subscribe(
    //       (res) => {
    //           this.chanels = res;

    //       }
    //   )
    // }




    cancel() {
        try {
            this.router.navigate([this.returnUrl]);
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    ngOnDestroy() {
        try {
            //if(this.subitSubscription)
            //  this.subitSubscription.unsubscribe();
            this.subcriptions.forEach(subs => {
                subs.unsubscribe();
            });
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    disabled() {
        try {
            if (this.viewMode == true) {
                return "#EBEBE4";
            } else {
                return "";
            }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    DisabledonEdit() {
        try {
           {
                return "#EBEBE4";
            } 
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    onSave() {
        try {
            if (!this.form.valid) {
                this.alertService.info(
                    "Invalid Request, Please enter all required fields."
                );
                return;
            }


            
            this.loadingService.show("Saving data, please wait...");
            this.form.patchValue({ CreateBy: this.userProfile.username })
            
            this.onsubmit();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    onsubmit() {
        try {

            let saveModel = Object.assign(this.channelObj, {}, this.form.value)
            
            let sub = this._Channelservice.saveChanel(this.mode, saveModel)
                .subscribe(data => {
                    if (data.status == 'ok') {
                        this.alertService.success("Data Saved Successfully");
                        this.preventNavigationService.preventNavigation(false);
                        setTimeout(() => {
                            this.router.navigate([this.returnUrl]);
                        }, 1000);

                    }
                    else {
                        this.loadingService.hide();
                        if (data.result._body == "The ConnectionString property has not been initialized.") {
                            this.router.navigate(['/login', this.router.url])
                            return;
                        }
                        this.alertService.error(
                            `Error in Saving Data: ${data.result._body}`
                        );
                    }
                },
                    error => {
                        this.loadingService.hide();
                        this.alertService.error(error);
                    });
            this.subcriptions.push(sub);
        }
        catch (e) {
            alert(e);
        }
    }

    @ViewChild('loginModal') loginModal: ModalDirective;
    hideloginModal() {
        try {
            this.loginModal.hide();
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }
    TypeChange(event) {
        
        // this.branchObj.TYPE = value
    }
    ChangeChannelType() {
        if (this.form.value.ChannelType == 'Sub-Channel') {
            this.Channeltype = 'Sub-Channel';
        }
        else {

            this.Channeltype = 'Channel';
        }
    }


}









