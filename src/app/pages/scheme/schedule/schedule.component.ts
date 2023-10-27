import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ScheduleService } from './schedule.service'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from 'ng2-bootstrap';
// import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { Schedule } from "../../../common/interfaces/Schedule.interface";
import { MasterRepo } from '../../../common/repositories';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
@Component(
    {
        selector: 'schedule',
        templateUrl: './schedule.component.html',
        styleUrls: ["../modal-style.css"],
        providers: [ScheduleService],
    }
)
export class scheduleComponent {
    DialogMessage: string = "Saving";
    @ViewChild('childModal') childModal: ModalDirective;

    selectedValues: string[] = [];
    schedule: Schedule = <Schedule>{};
    private subcriptions: Array<Subscription> = [];
    form: FormGroup;
    dayselect: any;
    daySun: boolean;
    dayMon: any;
    dayTue: any;
    dayWed: any;
    dayThu: any;
    dayFri: any;
    daySat: any;
    private returnUrl: string;
    modeTitle: string = '';
    id: any;
    invalidDates: Array<Date>;
    viewMode = false;
    daywise: boolean = true;
    happyhour: boolean;

    constructor(private alertService: AlertService, private spinnerService: SpinnerService, protected masterService: MasterRepo, private fb: FormBuilder, private _activatedRoute: ActivatedRoute, private service: ScheduleService, private router: Router) {
        this.modeTitle = "Schedule";
    }

    ngOnInit() {
        try {
            let self = this;
            this.form = this.fb.group({
                disid: [''],
                discountname: ['', Validators.required],
                startdate: ['', Validators.required],
                enddate: ['', Validators.required],
                starttime: ['', Validators.required],
                endtime: ['', Validators.required],
                sun: [true],
                mon: [true],
                tue: [true],
                wed: [true],
                thu: [true],
                fri: [true],
                sat: [true],
            });
            if (!!this._activatedRoute.snapshot.params['mode']) {
                if (this._activatedRoute.snapshot.params['mode'] == "view") {
                    this.viewMode = true;
                    this.daywise = false;
                    this.form.get('discountname').disable();
                    this.form.get('startdate').disable();
                    this.form.get('enddate').disable();
                    this.form.get('starttime').disable();
                    this.form.get('endtime').disable();
                    this.form.get('sun').disable();
                    this.form.get('mon').disable();
                    this.form.get('tue').disable();
                    this.form.get('wed').disable();
                    this.form.get('thu').disable();
                    this.form.get('fri').disable();
                    this.form.get('sat').disable();
                }
            }
            if (!!this._activatedRoute.snapshot.params['returnUrl']) {
                this.returnUrl = this._activatedRoute.snapshot.params['returnUrl'];
            }
            if (!!this._activatedRoute.snapshot.params['initial']) {
                let Initial: string = "";
                Initial = this._activatedRoute.snapshot.params['initial'];
                this.daywise = false;
                this.id = Initial;
                this.form.reset();
                this.service.getEditSchedule(Initial)
                    .subscribe(data => {
                        if (data.status == 'ok') {

                            var dayweek: any[];
                            dayweek = data.result.DayOfWeek.split(",")
                            if (dayweek.indexOf("SU".toUpperCase()) > -1 == true) {
                                this.form.patchValue({ sun: true })
                            }
                            if (dayweek.indexOf("MO".toUpperCase()) > -1 == true) {
                                this.form.patchValue({ mon: true })
                            }
                            if (dayweek.indexOf("TU".toUpperCase()) > -1 == true) {
                                this.form.patchValue({ tue: true })
                            }
                            if (dayweek.indexOf("WE".toUpperCase()) > -1 == true) {
                                this.form.patchValue({ wed: true })
                            }
                            if (dayweek.indexOf("TH".toUpperCase()) > -1 == true) {
                                this.form.patchValue({ thu: true })
                            }
                            if (dayweek.indexOf("FR".toUpperCase()) > -1 == true) {
                                this.form.patchValue({ fri: true })
                            }
                            if (dayweek.indexOf("SA".toUpperCase()) > -1 == true) {
                                this.form.patchValue({ sat: true })
                            }

                            this.form.patchValue({
                                discountname: data.result.DiscountName,
                                startdate: data.result.DateStart.substring(0, 10),
                                enddate: data.result.DateEnd.substring(0, 10),
                                starttime: data.result.TimeStart.split('T')[1],
                                endtime: data.result.TimeEnd.split('T')[1],


                            });

                            if (this._activatedRoute.snapshot.params['mode'] == "edit") {
                                this.modeTitle = "Edit Schedule";
                            } else if (this._activatedRoute.snapshot.params['mode'] == "view") {
                                this.modeTitle = "View Schedule";
                            }
                            this.mode = 'edit';
                        }
                        else {
                            this.mode = '';
                            this.modeTitle = "Edit -Error in Schedule";
                        }
                    }, error => {
                        this.mode = '';
                        this.modeTitle = "Edit2 -Error in Schedule";
                        this.masterService.resolveError(error, "Schedule - getSchedule");
                    }
                    )
            }
            else {
                this.mode = "add";
                this.modeTitle = "Add Schedule";
                this.daywise = true;
                this.happyhour = false;
                this.disableWeekdays();

            }
        } catch (ex) {
            alert(ex);
        }
    }

    onSave() {
        try {
            this.onSaveClicked();
        } catch (ex) {
            alert(ex);
        }
    }
    mode: string = "add";
    onSaveClicked() {
        try {

            let d = this.getdaysList();
            let sched = <Schedule>{}
            if (this.mode == 'edit') {
                sched.DisId = this.id
            }
            sched.DiscountName = this.form.value.discountname;
            sched.DateStart = this.form.value.startdate;
            sched.DateEnd = this.form.value.enddate;
            sched.DayOfWeeK = d;
            sched.TimeStart = this.form.value.starttime;
            sched.TimeEnd = this.form.value.endtime;



            if (!sched.DiscountName || !sched.DiscountName) {
                this.alertService.error("Please provide Schedule name");
                return;
            }
            if (!sched.DateStart || !sched.DateEnd) {
                this.alertService.error("Please provide valid Schedule start and end date");
                return;
            }


            this.spinnerService.show("Saving Data. Please Wait........")
            this.masterService.saveschedule(this.mode, sched)
                .subscribe(data => {
                    this.spinnerService.hide();
                    if (data.status == 'ok') {

                        if (data.result == 'NameFound') {
                            alert("Cannot save duplicate name.");
                            this.form.patchValue({ discountname: "", })
                        }
                    }

                },
                    error => {
                        alert(error);
                        this.spinnerService.hide();
                    }
                );
            this.router.navigate(['./pages/configuration/scheme/scheduleTable'])
        }
        catch (e) {
            alert(e);
        }



    }


    cancel() {
        try {
            this.router.navigate(["./pages/configuration/scheme/scheduleTable"])
        }
        catch (ex) { }
    }

    reset() {
        this.form.reset();
        this.disableWeekdays();
    }

    daywiseChange(event) {
        if (event.target.checked === false) {
            this.daywise = true;
            this.disableWeekdays();
        }
        else {
            this.daywise = false;
            this.form.get('sun').enable();
            this.form.get('mon').enable();
            this.form.get('tue').enable();
            this.form.get('wed').enable();
            this.form.get('thu').enable();
            this.form.get('fri').enable();
            this.form.get('sat').enable();
        }
    }

    happyHourChange(event) {
        if (event.target.checked === true) {
            this.happyhour = true;
            this.form.patchValue({
                starttime: "00:00",
                endtime: "00:00"
            })
        }
        else {
            this.happyhour = false;
            this.form.patchValue({
                starttime: "",
                endtime: ""
            })
            this.form.get('starttime').enable();
            this.form.get('endtime').enable();
        }
    }

    disableWeekdays() {
        this.form.patchValue({
            sun: true,
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true,
            sat: true
        })
    }

    removeStart() {
        this.form.patchValue({ starttime: '', });
    }
    removeEnd() {
        this.form.patchValue({ endtime: '' });
    }
    onClickBack() {
        this.router.navigate(["./pages/configuration/scheme/scheduleTable"]);
    }
    getdaysList() {
        let days = "";
        if (this.form.value.sun == true) { days = "SU,"; }
        if (this.form.value.mon == true) { days += "MO,"; }
        if (this.form.value.tue == true) { days += "TU,"; }
        if (this.form.value.wed == true) { days += "WE,"; }
        if (this.form.value.thu == true) { days += "TH,"; }
        if (this.form.value.fri == true) { days += "FR,"; }
        if (this.form.value.sat == true) { days += "SA,"; }

        return days;
    }
}