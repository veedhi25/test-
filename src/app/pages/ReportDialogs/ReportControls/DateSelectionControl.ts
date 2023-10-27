import {NgaModule} from '../../../theme/nga.module';
import {Component, Inject, ComponentFactoryResolver, Input, Output, EventEmitter} from '@angular/core';
import { Observable } from "rxjs/Observable";


@Component({
    selector:'dateselectioncontrol',
    template: `  <div >
    <div class="smalllabeldiv">
        <label class="smallBoldLabel">{{datelabel}}(AD)</label>
    </div>
    <div>
        <input type="date" style="width:250px;height:25px;text-align:center" [(ngModel)]="DATE" (ngModelChange)="dateChange()" (change)="changeAccountReportDate($event.target.value,'AD')"
        />
    </div>
    </div>
    <div >
       
    <div class=" smalllabeldiv">
        <label class="smallBoldLabel">{{datelabel}}(BS)</label>
    </div>
    <div>
        <input  style="width:250px;height:25px;text-align:center"  [(ngModel)]="BSDATE"
             type="text" (change)="changeAccountReportDate($event.target.value,'BS')"
            (click)="clickDate($event.target.value)" placeholder="yyyy-mm-dd" />
    </div>
    </div>
`,
styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],
})
export class DateSelectionControl{
    @Input()  DATE:any;
    BSDATE:any;
    @Input() datelabel:string="DATE1";
    @Output() dateEmit = new EventEmitter();
 ReportParameters:any=<any>{};
 activeurlpath:string;

    constructor(){
       // this.ReportParam.DATE1=this.DATE;
        //=new Date("2019-01-01").toJSON().split('T')[0];
        this.DATE=new Date().toJSON().split('T')[0];

        this.changeAccountReportDate(this.DATE,"AD");
        
    }
    changeAccountReportDate(value, format: string) {
        if(value==null)return;
        try{
                var adbs = require("ad-bs-converter");
                if (format == "AD") {
                    var adDate = value;
                    if (value.indexOf("-") != -1) {
                        adDate = (value.replace("-", "/")).replace("-", "/");
                    }
                    else {
                        adDate = value.replace(/(..).(..).(....)/, "$3/$1/$2");
                        this.DATE = value.replace(/(..).(..).(....)/, "$3-$1-$2");
                        this.dateemit(this.DATE);
                    }
                    var bsDate = adbs.ad2bs(adDate);
                    this.BSDATE = bsDate.en.year + '-' + bsDate.en.month + '-' + (bsDate.en.day == '1' || bsDate.en.day == '2' || bsDate.en.day == '3' || bsDate.en.day == '4' || bsDate.en.day == '5' || bsDate.en.day == '6' || bsDate.en.day == '7' || bsDate.en.day == '8' || bsDate.en.day == '9' ? '0' + bsDate.en.day : bsDate.en.day);
                }
                else if (format == "BS") {
                    var bsDate = (value.replace("-", "/")).replace("-", "/");
                    var adDate = adbs.bs2ad(bsDate);
                     this.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
                     this.dateemit(this.DATE);
                }
             
            }catch(ex){}
            }
            clickDate(value) {
                if (value != null && value != 0) {
                    var adbs = require("ad-bs-converter");
                    var bsDate = (value.replace("-", "/")).replace("-", "/");
                    var adDate = adbs.bs2ad(bsDate);
                 this.DATE = (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
                 this.dateemit(this.DATE);
                  
                }
            }
    dateemit(value)
    {
       this.dateEmit.emit(value);
    }
    
    dateChange(){
        this.dateEmit.emit(this.DATE);
    }
}