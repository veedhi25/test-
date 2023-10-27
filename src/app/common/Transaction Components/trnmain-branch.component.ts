import { TransactionService } from "./transaction.service";
import { Component } from '@angular/core';
import { TrnMain } from './../interfaces/TrnMain';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterRepo } from './../repositories/masterRepo.service';
import { IDivision } from './../interfaces'
import { SettingService } from './../services'


@Component({
    selector: "trnmain-branch",
    styleUrls: ["../../pages/Style.css"],
    templateUrl: "./trnmain-branch.component.html",
})

export class TrnMainBranchComponent {
    TrnMainForm: FormGroup;
    AppSettings;
    TrnMainObj: TrnMain = <TrnMain>{};
    divisionList: IDivision[] = [];
    settlementList:any[]=[];
    constructor(public masterService: MasterRepo, private _trnMainService: TransactionService,
        private _fb: FormBuilder, private setting: SettingService) {
        this.AppSettings = this.setting.appSetting;
        this.TrnMainObj = _trnMainService.TrnMainObj;
        if(this.TrnMainObj.VoucherType==9){
            this.settlementList=[];
            this.masterService.getSettlementMode()
            .subscribe(data=>{
               
                this.settlementList.push(data);
            })
        }
    }

    ngOnInit() {
        this.masterService.refreshTransactionList();
        this.TrnMainForm = this._fb.group({
            COSTCENTER: ['', Validators.required],
            BILLTOADD: ['', Validators.required],
            WAREHOUSE: ['', Validators.required],
            REMARKS: [''],
            SettleMode:[''],
        });

        if (this.TrnMainObj.Mode == "VIEW") {
            this.TrnMainForm.get('BILLTOADD').disable();
            this.TrnMainForm.get('COSTCENTER').disable();
            this.TrnMainForm.get('WAREHOUSE').disable();
            this.TrnMainForm.get('REMARKS').disable();
            this.TrnMainForm.get('SettleMode').disable();
        }

        this.TrnMainForm.valueChanges.subscribe(form => {
            this._trnMainService.Warehouse= form.WAREHOUSE;
            this.TrnMainObj.BILLTOADD = form.BILLTOADD;
            this.TrnMainObj.COSTCENTER = form.COSTCENTER;
            this.TrnMainObj.REMARKS = form.REMARKS;
            
        });

        if (this.TrnMainObj.Mode == "EDIT" || this.TrnMainObj.Mode == "VIEW") {
            this._trnMainService.loadDataObservable.subscribe(data => {
                try {
                    var warehouse: string;
                    if(data.ProdList[0] != null){
                        warehouse = data.ProdList[0].WAREHOUSE;
                    }else{
                        warehouse = null;
                    }
                    if(this.TrnMainObj.VoucherType==9){
                        this.settlementList=[];
                        this.masterService.getSettlementMode()
                        .subscribe(data=>{
                            this.settlementList.push(data);
                        },error=>{alert(error)},()=>{
                    //  console.log("settlecheck",this.settlementList,data.TRNMODE);
                            this.TrnMainForm.patchValue({SettleMode:this.settlementList.filter(d=>d.DESCRIPTION== data.TRNMODE)[0]});
                            this.SettlementChange();
                        })
                    }
                 //  
                  //  let c =this.settlementList.filter(d=>d.DESCRIPTION== data.TRNMODE);
                  //  
                 
                    this.TrnMainForm.patchValue({
                        COSTCENTER: data.COSTCENTER,
                        BILLTOADD: data.BILLTOADD,
                        REMARKS: data.REMARKS,
                        WAREHOUSE: warehouse,
                        // SettleMode:c,
                       })
                      } catch (e) {
                    console.log({ errorOnLoad: e });
                }
            });
        }

    }

    changeBranch(){
        console.log(this.TrnMainObj.DIVISION);
        this.masterService.divisionList$.subscribe(data => {
            this.divisionList = data;
        });
        if(this.TrnMainForm.get('BILLTOADD').value == this.TrnMainObj.DIVISION){
            // this.divisionList.splice(this.divisionList.findIndex(d =>d.INITIAL == this.TrnMainObj.DIVISION), 1);
            var division =this.divisionList[this.divisionList.findIndex(d =>d.INITIAL == this.TrnMainObj.DIVISION)].NAME;
            alert("(" + division + ") branch has already been selected in division above, please select a different branch.");
            this.TrnMainForm.patchValue({
                BILLTOADD: '',
            })
        }
    }

    // private resolevError(error: Error) {
    //     if (error.message == 'The ConnectionString property has not been initialized.') {
    //         this.router.navigate(["/login", { returnUrl: this.router.url }]);
    //     }
    //     else {
    //         alert(error.message);
    //     }
    // }
    SettlementChange(){
     //   console.log("settleChece",this.TrnMainForm.value.SettleMode.DECREASE);
        this._trnMainService.SettlementNo=this.TrnMainForm.value.SettleMode.DECREASE;
        this._trnMainService.TrnMainObj.TRNMODE=this.TrnMainForm.value.SettleMode.DESCRIPTION;
        }

}
