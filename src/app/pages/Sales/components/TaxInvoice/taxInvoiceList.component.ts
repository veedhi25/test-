import { Component } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ng2-bootstrap';
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { Router } from "@angular/router";
import 'style-loader!../salesinvoice/smartTables.scss';
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { AuthDialog } from "../../../modaldialogs/authorizationDialog/authorizationDialog.component";
import { CookieService } from 'angular2-cookie/core';
import { VoucherTypeEnum } from "../../../../common/interfaces/TrnMain";
@Component({
  selector: 'taxInvoiceList',
  template: `
  <div class="widgets">
 <div class ="row">
    
      <button type="button" class="btn btn-info" (click)="onAddClick($event)" style="margin-left:18px; margin-bottom:10px">Add Tax Invoice </button>
  </div>
  <div class="row">
    <ba-card title="SalesReturn" baCardClass="with-scroll">
      <ng2-smart-table [settings]="settings" [source]="source" (view)="onViewClick($event)" (edit)="onEditClick($event)" (deleteConfirm)="onDeleteConfirm($event)"></ng2-smart-table>
    </ba-card>
  </div>
 

</div>
`,
  providers: [AuthService],
  styleUrls: ["../../../modal-style.css"],
})
export class TaxInvoiceListComponent {
  childModal: any;
  DialogMessage: string;
  settings = {
    mode: 'external',
    add: {
      addButtonContent: '',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    view: {
      viewButtonContent: 'View',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '',
      confirmDelete: true
    },
    columns: {
      VCHRNO: {
        title: 'Voucher No.',
        type: 'string'
      },
      DIVISION: {
        title: 'Division',
        type: 'string'
      },
      TRNAC: {
        title: 'Trn. A/c',
        type: 'string'
      },
      PhiscalId: {
        title: 'Fiscal Year',
        type: 'string'
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("You are not authorized.");
  message$: Observable<string> = this.messageSubject.asObservable();

  constructor(private _authService: AuthService, private router: Router, private masterService: MasterRepo,
    public dialog: MdDialog, private _cookieService: CookieService) {
    try {
      let data: Array<any> = [];
      this.masterService.getTrnMainList("TI")
        .subscribe(res => {
          data.push(<any>res);
          this.source.load(data);
        }, error => {
          this.masterService.resolveError(error, "taxinvoice - getTrnMainList");
        });
    } catch (ex) {
      console.log(ex);
      alert(ex);

    }
  }
  setMode() { }
  onAddClick(event) {
    try {
      // if (this._authService.checkMenuRight("taxinvoice", "add") == true) {

        // this.router.navigate(["/pages/sales/salesinvoice/add-sales-invoice", { mode: "add", returnUrl: this.router.url }]);   
              this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { mode: "add", returnUrl: this.router.url,pmode:"p",vt:VoucherTypeEnum.TaxInvoice }]); 
            // }
      //  else {
      //   this.messageSubject.next("You are not authorized to add tax invoice.");
      //   this.openAuthDialog();
      // }


    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      if (this._authService.checkMenuRight("taxinvoice", "edit") == true) {
        this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { vchr: event.data.VCHRNO, returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "edit",pmode:"p",vt:VoucherTypeEnum.TaxInvoice  }]);
      } else {
        this.messageSubject.next("You are not authorized to edit tax invoice.");
        this.openAuthDialog();
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      if (this._authService.checkMenuRight("taxinvoice", "view") == true) {
        this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { vchr: event.data.VCHRNO, returnUrl: this.router.url, div: event.data.DIVISION, phiscal: event.data.PhiscalID, mode: "view",pmode:"p",vt:VoucherTypeEnum.TaxInvoice   }])
      } else {
        this.messageSubject.next("You are not authorized to view tax invoice.");
        this.openAuthDialog();
      }
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onDeleteConfirm(event): void { }

  openAuthDialog() {
    var message = { header: "Information", message: this.message$ };
    this.dialog.open(AuthDialog, { hasBackdrop: true, data: message });
  }
  onAddDirectTaxInvoiceClick(event){
    try{
 if (this._authService.checkMenuRight("taxinvoice", "add") == true) {
   this.router.navigate(["/pages/transaction/inventory/sales/salesinvoice/add-sales-invoice", { mode: "add", returnUrl: this.router.url,pmode:"c",vt:VoucherTypeEnum.TaxInvoice  }]);
 }
 else {
        this.messageSubject.next("You are not authorized to add tax invoice.");
        this.openAuthDialog();
      }
       } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
}
