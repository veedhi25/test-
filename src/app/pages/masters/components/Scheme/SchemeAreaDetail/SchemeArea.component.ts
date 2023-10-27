import { Component, Output } from "@angular/core";
import { MasterRepo } from "../../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SchemeService } from "../SchemeService";
import { Scheme } from "../../../../../common/interfaces/Scheme";
import { EventEmitter } from "events";
@Component({
  selector: "SchemeArea",
  templateUrl: "./SchemeArea.html",

  providers: [SchemeService],
  styleUrls: ["../../../../modal-style.css"]
})
export class SchemeAreaComponent {
  @Output() SchemeAreaData = new EventEmitter();
  viewMode = false;
  initialTextReadOnly: boolean = false;
  form: FormGroup;
  MCODE: any;
  SCHEME: Scheme = <Scheme>{};

  constructor(
    private alertService: AlertService,
    protected masterService: MasterRepo,
    protected service: SchemeService,
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    try {
      this.form = this.fb.group({
        AREA: [""],
        AREATYPE: [""],
        BUDGET: [0],
      });



    } catch (ex) {
      console.log(ex);
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
      console.log(ex);
      this.alertService.error(ex);
    }
  }
  GetSchemeArea(){
    this.SchemeAreaData.emit(this.form.value)
  }

}
