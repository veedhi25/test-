import { Component, Output} from "@angular/core";
import { MasterRepo } from "../../../../../common/repositories/masterRepo.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AlertService } from "../../../../../common/services/alert/alert.service";
import { SchemeService } from "../SchemeService";
import { Scheme } from "../../../../../common/interfaces/Scheme";
import { EventEmitter } from "events";
@Component({
  selector: "SchemeSubTypeExclusion",
  templateUrl: "./SchemeSubTypeExclusion.html",

  providers: [SchemeService],
  styleUrls: ["../../../../modal-style.css"]
})
export class SchemeSubTypeExclusionComponent{
  @Output() SchemeSubTypeData = new EventEmitter();
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
        SUBTYPE: [""],
        CHANNEL: [""],
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

  GetSchemeSubType(){
    this.SchemeSubTypeData.emit(this.form.value)
  }

}
