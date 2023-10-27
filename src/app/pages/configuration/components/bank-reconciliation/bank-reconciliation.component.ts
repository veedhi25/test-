import { Component, ViewChild, ElementRef, PLATFORM_ID, Inject } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import * as moment from 'moment';
import { BankReconciliationService } from "./bank-reconciliation.service";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { BankReconciliation, Reconcile } from "../../../../common/interfaces/bank-reconciliation.interface";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: 'bank-reconciliation',
    templateUrl: './bank-reconciliation.component.html',
    providers: [BankReconciliationService],
    styleUrls: ["../../../Style.css"]

})

export class BankReconciliationComponent{

    @ViewChild("bankReconciliationGeneric")bankReconciliationGeneric : GenericPopUpComponent;
    gridbankReconciliationPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
   
    bankReconciliationObj: BankReconciliation = new BankReconciliation();

    reconcileListObj: Reconcile = new Reconcile();

    public selectedValue: any;
    public reconcileList: Reconcile[] = [];


    @ViewChild('bankInput')bankInput ;

    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    alwaysShowCalendars: boolean = true;
    
    locale = {
        format: 'DD/MM/YYYY',
        direction: 'ltr', // could be rtl
        weekLabel: 'W',
        separator: ' - ', // default is ' - '
        cancelLabel: 'Cancel', // detault is 'Cancel'
        applyLabel: 'Okay', // detault is 'Apply'
        clearLabel: 'Clear', // detault is 'Clear'
        customRangeLabel: 'Custom Range',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: 0 // first day is monday
    }
    
    constructor(@Inject(PLATFORM_ID) private platformId: Object, public masterService: MasterRepo, private bankReconciliationService:BankReconciliationService )
     {
        this.masterService.ShowMore = true;
        this.selectedDate = {
            startDate: moment(),
            endDate: moment()
        }

        this.gridbankReconciliationPopupSettings = Object.assign(new GenericPopUpSettings,{
            title: "Bank Account Name ",
            apiEndpoints: `/getBankListPagedList`,
            defaultFilterIndex : 0,
            columns: [
              {
                key: "ACID",
                title: "Account No.",
                hidden: false,
                noSearch: false
              },
              {
                key: "ACNAME",
                title: "Account Name",
                hidden: false,
                noSearch: false
              }
     
          ]
          });

     }


     onItemDoubleClick(event){
         
         this.selectedValue = event;

        this.bankReconciliationObj.ACNAME = this.selectedValue.ACNAME;
        this.bankReconciliationObj.ACID = this.selectedValue.ACID;
        this.bankReconciliationObj.DIV = 'MMX';

        console.log("bankReconciliationObj ACID"+this.bankReconciliationObj.ACID);
     }


    onSaveExcelClick()
    {

    }

    onLoadClick(){
        this.bankReconciliationService.getBankReconcileList(this.bankReconciliationObj)
        .subscribe((res) => {
            //console.log("Reconciliation List"+JSON.stringify(res.result));
            var reconcileResult = res.result;
            if(res.status == 'ok'){

            }else{
                
            }

            this.reconcileList = res.result
            this.buildCheckBox()
            
        })
    }
    buildCheckBox() {
        for(let i in this.reconcileList){
            this.reconcileList[i].isChecked=false
        }
    }

    onSaveClick(){
        //console.log("checked value"+this.reconcileList);

        for(let i in this.reconcileList){

            if(this.reconcileList[i].isChecked == false){
                this.reconcileList.splice(Number(i),0)

            }
        }

       
        //console.log("list reconcile"+JSON.stringify(this.reconcileList.filter(x => x.isChecked==true)));

    this.bankReconciliationService.saveBankReconciliation(this.reconcileList.filter(x=>x.isChecked==true));
    }

    dateChanged(){
        this.bankReconciliationObj.DATE1 = moment(this.selectedDate.startDate).format('YYYY-MM-DD HH:mm:ss')
        this.bankReconciliationObj.DATE2 = moment(this.selectedDate.endDate).format('YYYY-MM-DD HH:mm:ss')
    }

    onBankReconciliationPopUPTab(){
        this.bankReconciliationGeneric.show();
    }

    itemChecked(event,i:any){  
        if(event.target.checked){
            
                document.getElementById("bankDate"+i).focus();
             
          
        }else{
           
                document.getElementById("bankDate"+i).blur();
             
            
        }             
    }
}