import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TAcList } from "../../../../common/interfaces/Account.interface";
import { TrnMain } from "../../../../common/interfaces";
import { MasterRepo } from "../../../../common/repositories";
import { TransactionService } from '../../../../common/Transaction Components/transaction.service';
import { SettingService } from '../../../../common/services';



@Component({
    selector: "trnmain-purchaseorder-entry",
    styleUrls: ["../../../Style.css"],
    templateUrl: "./purchaseordercomponents.html",
})

export class TrnMainPurchaseOrderComponent implements OnDestroy {
    @ViewChild("focusInitial") el : ElementRef;
    TrnMainForm: FormGroup;
    PurchaseAcList: TAcList[] = [];
    accountListSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>([]);
    AccountList: Observable<TAcList[]> = this.accountListSubject.asObservable();
    SupplierList: TAcList[] = [];
    CashList: TAcList[] = [];
    BankList: TAcList[] = [];
    AppSettings;
    RETTO: string;
    TrnMainObj: TrnMain = <TrnMain>{};
    paymentmodelist:any[]=[];
    constructor(public masterService: MasterRepo, public _trnMainService: TransactionService, private _fb: FormBuilder, private router: Router, private arouter: ActivatedRoute, private setting: SettingService) {
        this.AppSettings = this.setting.appSetting;
        this.TrnMainObj = _trnMainService.TrnMainObj;
        this.masterService.ShowMore==true
        this.el;
    }
    ngAfterViewInit(){
        // this.el.nativeElement.focus();       
    }
 
    ngOnInit() {
        this._trnMainService.supplierwiseItem=0;
        this.TrnMainForm = this._fb.group({
            TRNMODE: ['', Validators.required],
          //  RETTO: ['', Validators.required],
            TRNAC: ['', Validators.required],
            PARAC: [''],
            WAREHOUSE: [this.setting.appSetting.DefaultWarehouse, Validators.required],        
            DeliveryDate:[''],
            EXRATE:[''],
            REMARKS: [''],
            ItemOptions:[0]
           
        });
        this.masterService.refreshTransactionList();
        this.masterService.getSupplierList().subscribe(res => {
             this.SupplierList = res;
        },
            error => {
                this.masterService.resolveError(error, 'trnmain-purchaseorder-getSupplierList');
            }, () => {
              //  this.TrnMainObj.TRNMODE="credit"; 
              //  this.radioTrnModeChange(this.TrnMainObj.TRNMODE)
             });
      
      
        if (this.TrnMainObj.Mode == "VIEW") {
            this.TrnMainForm.get('TRNMODE').disable();
          //  this.TrnMainForm.get('RETTO').disable();
            this.TrnMainForm.get('TRNAC').disable();
            this.TrnMainForm.get('PARAC').disable();
            this.TrnMainForm.get('WAREHOUSE').disable();
           
            this.TrnMainForm.get('REMARKS').disable();
           
        }

       

        this.TrnMainForm.valueChanges.subscribe(form => {
            this.TrnMainObj.TRNMODE = form.TRNMODE;
            this.TrnMainObj.DeliveryDate = form.DeliveryDate;
            this.TrnMainObj.TRNAC = form.TRNAC;
            this.TrnMainObj.PARAC = form.PARAC;         
            this.TrnMainObj.REMARKS = form.REMARKS;
            this._trnMainService.Warehouse = form.WAREHOUSE;
            this._trnMainService.supplierwiseItem=form.ItemOptions;

        });

        if (this.TrnMainObj.Mode == "EDIT" || this.TrnMainObj.Mode == "VIEW") {
            this._trnMainService.loadDataObservable.subscribe(data => {
                try {
                    var warehouse: string;
                    if (data.ProdList[0] != null) {
                        warehouse = data.ProdList[0].WAREHOUSE;
                    } else {
                        warehouse = null;
                    }
                    this.TrnMainForm.patchValue({
                        TRNMODE: data.TRNMODE,
                        DeliveryDate: data.DeliveryDate,
                        TRNAC: data.TRNAC,
                        PARAC: data.PARAC,                       
                        WAREHOUSE: warehouse,                      
                        REMARKS: data.REMARKS
                  
                    });
                  
                } catch (e) {
                    console.log({ errorOnLoad: e });
                }
            });
        }
        this.undo();    
    }


    undo() {
        this.TrnMainForm.patchValue({ TRNMODE: "credit" });
        this.TrnMainObj.TRNMODE = "credit";
    }
    // accountchange(value) {
   
    //     if (this.TrnMainObj.TRNMODE = "credit") {
    //         var s = this.SupplierList.filter(x => x.ACID == this.TrnMainObj.TRNAC)[0];
    //         if (s) {
    //             this.TrnMainObj.BILLTO = s.ACNAME;
    //             this.TrnMainObj.BILLTOADD = s.ADDRESS;
    //             this.TrnMainObj.BILLTOMOB = s.PHONE;
    //         }
    //     }
    // }
    ItemListingFilterChange(value)
    {
       
       // if(value=='supplierwise'){
       // this._trnMainService.supplierwiseItem=1;
       // }else{ this._trnMainService.supplierwiseItem=0;}
       // console.log("filterchange",this._trnMainService.supplierwiseItem);
    }
    supplierchange(value) {
        this.TrnMainObj.BILLTO = this.SupplierList.filter(x => x.ACID == this.TrnMainObj.TRNAC)[0].ACNAME;

    }
    ngOnDestroy() {
        try {

        }
        catch (ex) {
            
        }
    }
}
