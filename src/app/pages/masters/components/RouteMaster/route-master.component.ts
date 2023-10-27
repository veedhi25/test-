import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { RouteMasterService } from "./route-master.service";
import { RouteMaster } from "../../../../common/interfaces/RouteMaster.interface";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";

@Component({
  selector: "route-master",
  templateUrl: "./route-master.component.html",
  providers: [RouteMasterService],
  styleUrls: ["../../../modal-style.css"]
})
export class RouteMasterComponent implements OnInit, OnDestroy {
  showRoutePlan: boolean = false
  viewMode = false;
  mode: string = "add";
  modeTitle: string = "";
  routeMasterObj: RouteMaster = <RouteMaster>{};
  initialTextReadOnly: boolean = false;
  private returnUrl: string;
  form: FormGroup;
  private subcriptions: Array<Subscription> = [];
  chanels: any[] = [];
  showChanelOption = false;
  userProfile: any = <any>{};
  routeData: any
  listOfYear = []
  routePlan: any
  viewScheduleMode: boolean = false
  allRouteMasterList: any
  routeCode:any
  ngOnInit() {

    try {
      // this.getChanel();
      if (!!this._activatedRoute.snapshot.params["mode"]) {
        if (this._activatedRoute.snapshot.params["mode"] == "view") {
          this.viewMode = true;
        } else if (this._activatedRoute.snapshot.params["mode"] == "viewSchedule") {
          this._RouteMasterservice.getAllRouteMasterList().subscribe((res) => {
            this.allRouteMasterList = res
          })
          this.viewScheduleMode = true;
          this.modeTitle = "View and edit route schedule"

        } else if (this._activatedRoute.snapshot.params["mode"] == "add") {
          this.modeTitle = "Add Route schedule"
        }

      }
      if (!!this._activatedRoute.snapshot.params["returnUrl"]) {
        this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      }
      if (!!this._activatedRoute.snapshot.params["name"]) {
        let routeName: string = "";
        routeName = this._activatedRoute.snapshot.params["name"];
        this.loadingService.show("Getting data, Please wait...");
        this._RouteMasterservice.getRouteMaster(routeName).subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              this.routeData = data.result;
              this.form.patchValue({
                RouteCode: this.routeData.RouteCode,
                RouteName: this.routeData.RouteName,
                status: this.routeData.status,
                Sunday: this.routeData.Sunday,
                Monday: this.routeData.Monday,
                Tuesday: this.routeData.Tuesday,
                Wednesday: this.routeData.Wednesday,
                Thursday: this.routeData.Thursday,
                Friday: this.routeData.Friday,
                Saturday: this.routeData.Saturday,
              });
              if (this._activatedRoute.snapshot.params["mode"] == "edit") {
                this.modeTitle = "Edit Route Master";
              } else if (
                this._activatedRoute.snapshot.params["mode"] == "view"
              ) {
                this.modeTitle = "View Route Master";
              }
              this.mode = "edit";
              this.initialTextReadOnly = true;
            }
            else {
              this.mode = "";
              this.modeTitle = "Edit -Error in Route Master";
              this.initialTextReadOnly = true;
            }
          },
          error => {
            this.loadingService.hide();
            this.mode = "";
            this.modeTitle = "Edit2 -Error in Route Master";
            this.masterService.resolveError(error, " Route Master");
          }
        );
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected _RouteMasterservice: RouteMasterService,
    private router: Router,
    private fb: FormBuilder,
    private _activatedRoute: ActivatedRoute
  ) {
    this.buildForm();
    let currentYear = new Date().getFullYear()
    for (let i = 0; i < 50; i++) {
      this.listOfYear.push({
        year: currentYear++
      })
    }



  }

  buildForm() {
    this.form = this.fb.group({
      RouteName: ["", Validators.required],
      RouteCode: [''],
      status: [1],
      Sunday: [0, Validators.required],
      Monday: [0, Validators.required],
      Tuesday: [0, Validators.required],
      Wednesday: [0, Validators.required],
      Thursday: [0, Validators.required],
      Friday: [0, Validators.required],
      Saturday: [0, Validators.required]
    });
    this.onFormChanges();
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(() => {
      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });
  }

  getChanel() {
    this.masterService.getAllChanel().subscribe(res => {
      this.chanels = res;
    });
  }

  cancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  ngOnDestroy() {
    try {
      this.subcriptions.forEach(subs => {
        subs.unsubscribe();
      });
    } catch (ex) {
      this.alertService.error(ex);
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
      this.alertService.error(ex);
    }
  }

  editDisabled() {
    try {
      if (this.mode == "edit") {
        return "#EBEBE4";
      } else {
        return "";
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  onSave() {
    try {
      if (!this.form.valid) {
        this.alertService.info("All value should be valid");
        return;
      }
      this.onsubmit();
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  onsubmit() {
    try {
      let saveModel = Object.assign(this.routeMasterObj, {}, this.form.value);
      this.routeData = saveModel
      this.loadingService.show("Saving Data please wait...");
      let sub = this._RouteMasterservice
        .saveRouteMaster(this.mode, this.routeData)
        .subscribe(
          data => {
            this.loadingService.hide();
            if (data.status == "ok") {
              this.alertService.success("Data Saved Successfully");
              this.preventNavigationService.preventNavigation(false);
              this.routeCode =data.result2
              this.resolveRouteSchedule(data.result2)
              
            } else {
              if (data.result == "Duplicate_ID") {
                this.alertService.error(
                  "Can't save data! Duplicate Router Name"
                );
              }
              if (
                data.result._body ==
                "The ConnectionString property has not been initialized."
              ) {
                this.router.navigate(["/login", this.router.url]);
                return;
              }
              this.alertService.error(
                "Error in Saving Data:" + data.result._body
              );
              //console.log(data.result._body);
            }
          },
          error => {
            this.loadingService.hide();
            this.alertService.error(error);
          }
        );
      this.subcriptions.push(sub);
    } catch (e) {
      this.alertService.error(e);
    }
  }

  @ViewChild("loginModal") loginModal: ModalDirective;
  hideloginModal() {
    try {
      this.loginModal.hide();
    } catch (ex) {
      alert(ex);
    }
  }

  TypeChange(event) {
    // this.branchObj.TYPE = value
  }


  routePlanForm: FormGroup;
  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  public isCheked = new FormControl(1);
  @ViewChild('month') month: ElementRef;
  @ViewChild('year') year: ElementRef;
  dateArray: number[][] = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
  buildRoutePlanForm(data = null) {
    this.routePlanForm = this.fb.group({
      weeks: this.fb.array([])
    })
    let totalWeeks: Number = this.weeksInMOnth(this.currentYear, this.currentMonth)
    let firstDay = (new Date(this.currentYear, this.currentMonth)).getDay()
    this.month.nativeElement.value = Number(this.currentMonth)
    this.year.nativeElement.value = (this.currentYear.toString())
    let totalDaysinMonth = this.getTotalDaysInMonth(this.currentMonth, this.currentYear)
    let date = 1
    let formControl = this.routePlanForm.get('weeks') as FormArray;
    for (let i = 0; i < totalWeeks; i++) {

      formControl.push(this.getWeekFormRow(data[i]))
    }

    let index = 0;
    (<FormArray>this.routePlanForm.get('weeks'))
      .controls
      .forEach(control => {
        for (let j = 0; j < 7; j++) {
          if ((index === 0 && j < firstDay) || date > totalDaysinMonth) {
            let disabledKey = this.getDisabledKey(j)
            control.get(disabledKey).disable();

            this.dateArray[index][j] = 0;
          }
          else {
            this.dateArray[index][j] = date++;
          }

        }
        index++;
      })
  }

  getWeekFormRow(data): FormGroup {

    return this.fb.group({
      Sunday: [data ? data.Sunday : false],
      Monday: [data ? data.Monday : false],
      Tuesday: [data ? data.Tuesday : false],
      Wednesday: [data ? data.Wednesday : false],
      Thursday: [data ? data.Thursday : false],
      Friday: [data ? data.Friday : false],
      Saturday: [data ? data.Saturday : false]
    });
  }

  getDisabledKey(j: number): string {
    let disabledKey = "";
    if (j == 0) {
      disabledKey = "Sunday";
    }
    else if (j == 1) {
      disabledKey = "Monday";
    }
    else if (j == 2) {
      disabledKey = "Tuesday";
    }
    else if (j == 3) {
      disabledKey = "Wednesday";
    }
    else if (j == 4) {
      disabledKey = "Thursday";
    }
    else if (j == 5) {
      disabledKey = "Friday";
    }
    else if (j == 6) {
      disabledKey = "Saturday";
    }
    return disabledKey;
  }

  public next() {
    this.currentYear = (this.currentMonth == 11) ? Number(this.currentYear) + 1 : Number(this.currentYear);
    this.currentMonth = Number(Number(this.currentMonth) + 1) % 12;
    this.month.nativeElement.value = this.currentMonth
    this.year.nativeElement.value = this.currentYear
    this.resolveRouteSchedule(this.routeSelected?this.routeSelected.nativeElement.value:this.routeCode)

  }

  public previous() {
    this.currentYear = (this.currentMonth == 0) ? Number(this.currentYear) - 1 : Number(this.currentYear);
    this.currentMonth = (this.currentMonth == 0) ? Number(11) : Number(this.currentMonth) - 1;
    this.month.nativeElement.value = this.currentMonth
    this.year.nativeElement.value = this.currentYear
    this.resolveRouteSchedule(this.routeSelected?this.routeSelected.nativeElement.value:this.routeCode)

  }

  public jump() {
    this.currentMonth = this.month.nativeElement.value
    this.currentYear = this.year.nativeElement.value
    this.resolveRouteSchedule(this.routeSelected?this.routeSelected.nativeElement.value:this.routeCode)
  }

  public getTotalDaysInMonth(month, year) {
    return new Date(year, Number(month) + 1, 0).getDate();
  }

  public weeksInMOnth(year, month) {
    var firstOfMonth = new Date(year, month, 1).getDay();
    var totalDaysinMonth = this.getTotalDaysInMonth(this.currentMonth, this.currentYear)
    var result = 0
    if ((firstOfMonth == 5 && totalDaysinMonth == 30)) {
      result = 5
    } else if (firstOfMonth == 5 && totalDaysinMonth == 31) {
      result = 6
    } else if ((firstOfMonth == 6 && totalDaysinMonth == 30) || (firstOfMonth == 6 && totalDaysinMonth == 31)) {
      result = 6
    } else if (totalDaysinMonth == 28 || totalDaysinMonth == 29) {
      result = Math.floor(totalDaysinMonth / 7) + 1
    }
    else {
      result = Math.ceil(totalDaysinMonth / 7)
    }

    return result
  };




  public isPrevValid(year, month) {
    if (year == this.listOfYear[0].year && month == 0) {
      return true;
    } else {
      return false;
    }
  }

  public isNextValid(year, month) {
    if (year ==  this.listOfYear[this.listOfYear.length-1].year && month == 11) {
      return true;
    } else {
      return false;
    }
  }

  @ViewChild('routeSelected') routeSelected:ElementRef

  public saveRoutePlan() {
    let data = this.routePlanForm.value
    data.Year = this.currentYear
    data.Month = this.currentMonth
    data.RouteCode = this.routeSelected?this.routeSelected.nativeElement.value:this.routeCode
    this.loadingService.show("Please wait! Saving Route Schedule..")
    this._RouteMasterservice.saveRouteSchedule(data).subscribe((res) => {
        if(res.status=='ok'){
          this.loadingService.hide()
          this.alertService.success("Route schedule changed")
          this.resolveRouteSchedule(this.routeSelected?this.routeSelected.nativeElement.value:this.routeCode)
        }
    },error=>{
      this.alertService.error(error)
    })
  }


  public getRouteSchedule(event) {
    this.resolveRouteSchedule(event.target.value)
  }

  public resolveRouteSchedule(routeCode) {
    this._RouteMasterservice.getRouteSchedule(routeCode, this.currentYear, this.currentMonth).subscribe((res) => {
      this.routePlan = res.result;
      this.showRoutePlan = true
      setTimeout(() => {
        this.buildRoutePlanForm(res.result)
      }, 100);
    })
  }


}

