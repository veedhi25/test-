import { Component } from '@angular/core';
import {TransactionService} from './transaction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from "../repositories/masterRepo.service";

@Component({
    selector: "creditnode-mode",
    template: `
        <form [formGroup]="cnModeForm">
            <input type="radio" formControlName="cnMode" value="delivery" style="height:13px; margin-top:3px;" (change)="radioTrnModeChange($event.target.value)"><label style="vertical-align: text-top; margin-left:5px;">Dispatch</label>
            <input type="radio" formControlName="cnMode" value="cash" style="height:13px; margin-left:15px;" (change)="radioTrnModeChange($event.target.value)"><label style="vertical-align: text-top; margin-left:5px;">Cash</label>
        </form>
    `,
})

export class CreditNoteModeComponent{
    cnModeForm: FormGroup;
    constructor(  public _trnMainService: TransactionService,   public _fb: FormBuilder,public masterService: MasterRepo) {

    }

    ngOnInit() {
        this.cnModeForm = this._fb.group({
            cnMode: ['', Validators.required],
        });
        
  this.cnModeForm.patchValue({cnMode:'delivery'});
  this._trnMainService.cnMode="delivery";
        if (this._trnMainService.TrnMainObj.Mode == "VIEW") {
            this.cnModeForm.get('cnMode').disable();
        }

        this.cnModeForm.valueChanges.subscribe(form => {
            this._trnMainService.cnMode = form.cnMode;
            console.log(this._trnMainService.cnMode);
        });

        if (this._trnMainService.TrnMainObj.Mode == "EDIT" || this._trnMainService.TrnMainObj.Mode == "VIEW") {

        }

    }
    

    radioTrnModeChange(){
        this._trnMainService.cnMode = this.cnModeForm.get('cnMode').value;

       
    }
}