import { TransactionService } from "./transaction.service";
import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from '@angular/forms';
import { MasterRepo } from './../repositories/masterRepo.service';
import { SettingService } from './../services';
import { TrnMain, VoucherTypeEnum } from "../interfaces/TrnMain";



@Component({
    selector: "trnmainmasterparam",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"],
    templateUrl: "./TrnmainMasterParameters.html",
})

export class TrnMainMasterParametersComponent implements OnDestroy {
    TrnMainForm: FormGroup;
    TrnMainObj:TrnMain;
    VoucherType:VoucherTypeEnum;
    constructor(public masterService: MasterRepo, public _trnMainService: TransactionService,   public _fb: FormBuilder,   public router: Router,   public arouter: ActivatedRoute,   public setting: SettingService) {
       this.TrnMainObj=_trnMainService.TrnMainObj;
       
    }
    ngAfterViewInit(){
       
    }
      
        
    
    ngOnInit() {      
        this.TrnMainForm = this._fb.group({
            VCHRNO: [''],
            CHALANNO: [''],
            TRNDATE: [''],
            BSDATE: [''],
            TRN_DATE: [''],
            BS_DATE: [''],
            DIVISION: [''],
            TRNMODE: [''],
            REFBILL: [''],
            RETTO: [''],
            TRNAC: [''],
            PARAC: [''],
            COSTCENTER: [''],
            MWAREHOUSE: [''],
            CHEQUENO: [''],
            CHEQUEDATE: [''],
            FCurrency:[''],
            EXRATE:[''],
            REMARKS: [''],
            CREDITDAYS:[''],
            ROUNDOFF:[''],
            BILLTO: [''],
            BILLTOMOB: [''],
            BILLTOADD: [''],
            BILLTOTEL: [''],
            BALANCE:['']
        });

        this.TrnMainForm.valueChanges.subscribe(form => {
            this.TrnMainObj.VCHRNO=form.VCHRNO;
            this.TrnMainObj.CHALANNO=form.CHALANNO;
            this.TrnMainObj.TRNDATE=form.TRNDATE;
            this.TrnMainObj.BSDATE=form.BSDATE;
            this.TrnMainObj.TRN_DATE=form.TRN_DATE;
            this.TrnMainObj.BS_DATE=form.BS_DATE;
            this.TrnMainObj.DIVISION=form.DIVISION;
            this.TrnMainObj.TRNMODE = form.TRNMODE;
            this.TrnMainObj.REFBILL=form.REFBILL;
            this.TrnMainObj.RETTO = form.RETTO;
            this.TrnMainObj.TRNAC = form.TRNAC;
            this.TrnMainObj.PARAC = form.PARAC;
            this.TrnMainObj.COSTCENTER = form.COSTCENTER;
            this.TrnMainObj.MWAREHOUSE=form.MWAREHOUSE;
            this.TrnMainObj.CHEQUENO = form.CHEQUENO;
            this.TrnMainObj.CHEQUEDATE = form.CHEQUEDATE;
            this.TrnMainObj.FCurrency=form.FCurrency;
            this.TrnMainObj.EXRATE=form.EXRATE;
            this.TrnMainObj.REMARKS = form.REMARKS;         
            this.TrnMainObj.CREDITDAYS=form.CREDITDAYS;
            this.TrnMainObj.ROUNDOFF=form.ROUNDOFF;
          this.TrnMainObj.BILLTO=form.BILLTO;
          this.TrnMainObj.BILLTOADD=form.BILLTOADD;
          this.TrnMainObj.BILLTOMOB=form.BILLTOMOB;
          this.TrnMainObj.BILLTOTEL=form.BILLTOTEL;
           this.TrnMainObj.BALANCE=form.BALANCE;
        });
    }


    undo() {
         }
    ngOnDestroy() {
        try {

        }
        catch (ex) {
            
        }
    }
  

}
