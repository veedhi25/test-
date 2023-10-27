import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { AuthService } from "./../../../../common/services/permission/authService.service";
import { ModalDirective } from 'ngx-bootstrap'
import { LocalDataSource } from '../../../../node_modules/ng2-smart-table/';
import { ProductMasterService } from './ProductMasterService';
import { Http } from '@angular/http';
import { ServerDataSource } from "../../../../node_modules/ng2-smart-table/";
import { AlertService } from '../../../../common/services/alert/alert.service';
import { MdDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AppComponentBase } from "../../../../app-component-base";
import { MasterRepo } from '../../../../common/repositories';



@Component({
  selector: "productlist",
  template: `
  <!-- <div style="margin-top:-70px"> -->
    <!-- <div style="display: inline-block;width:35%"> -->
                        <!-- <input #searchInput ngui-auto-complete  [source]="dropListItem.bind(this)"  max-num-list="25" 
                                style="height:23px;min-width:372px"  list-formatter="DESCA"  [(ngModel)]="selectedItem"
                                name="DescA" display-property-name="DESCA" placeholder="Search Items Through Name">-->
                             <!-- <input type="text" class="ng-untouched ng-pristine ng-valid"  style="height:25px;min-width:100%;font-size: 13px;border: 1px solid #cbcbcb;border-radius: 3px;"   [(ngModel)]="searchWord" placeholder="search item(shows top 25 matching item)" (keyup.enter)="onSearchClick($event.target.value)"> -->
                        <!-- </div> -->
                         <!-- <button type="button" class="btn btn-info" (click)="onSearchClick(searchWord)">Search</button> -->
                         <div class="widgets">
  <div class="row">
    
    <ba-card title="Products" baCardClass="with-scroll">
      <ng2-smart-table [settings]="settings" [source]="source1" (edit)="onEditClick($event)" (delete)="onDeleteConfirm($event)" (view)="onViewClick($event)"></ng2-smart-table>
    </ba-card>
  </div>
</div>
  <!-- </div> -->
  <div class="modal fade" bsModal #childModal="bs-modal" [config]="{backdrop: 'static'}" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" aria-label="Close" (click)="hideChildModal()">
          <span aria-hidden="true">&times;</span>
          
        </button>
                        <h4 class="modal-title">Information</h4>
                    </div>
                    
                    <div class="modal-body">
                      <div class="modal-title glyphicon glyphicon-warning-sign" style="display:inline-block"></div>
                        {{DialogMessage}}
                    </div>
                    <!--<div class="modal-footer">
                        <button class="btn btn-info confirm-btn" (click)="hideChildModal()">Save changes</button>
                        <button class="btn btn-info confirm-btn" type="button" (click)=onsubmit()>Save</button>
                    </div>!-->

                </div>
            </div>
        </div>
                   `,
  // styleUrls: ["../../../Style.css",'./modals.scss'],
  providers: [AuthService, ProductMasterService],
  styleUrls: ["../../../modal-style.css"],

})

export class ProductListComponent extends AppComponentBase {
  @ViewChild('childModal') childModal: ModalDirective;
  //  @Output() searchItemEmit = new EventEmitter();
  @Output() activeTabEmit = new EventEmitter();
  DialogMessage: string = "You are not authorized";
  source1: ServerDataSource;
  @Input() source: LocalDataSource;




  settings = {
    mode: "external",
    add: {
      addButtonContent: '',
    },
    view: {
      viewButtonContent: '<i class="fa fa-eye" title="View"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil" title="Edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: '',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel'
    },
    columns: {
      MENUCODE: {
        title: 'Item Code',
        type: 'number'
      },
      DESCA: {
        title: 'Item Name',
        type: 'string'
      },
      BASEUNIT: {
        title: 'Unit',
        type: 'string'
      }
    }
  };


  constructor(public _authService: AuthService, private ProductService: ProductMasterService,
    private router: Router,
    public dialog: MdDialog,
    public injector: Injector,
    private alertService: AlertService,
    private masterRepo: MasterRepo) {
    super(injector);
    try {

      let apiUrl = `${this.apiUrl}/GetAllProduct`;
      this.source1 = new ServerDataSource(this._http, {
        endPoint: apiUrl,
        dataKey: "data",
        pagerPageKey: "currentPage",
        pagerLimitKey: "maxResultCount"
      });
    } catch (ex) {
      this.alertService.error(ex);
    }

  }
  ngAfterViewInit() {

  }

  isHQ() {
    let userprofiles = this.masterRepo.userProfile;
    if (userprofiles.CompanyInfo.companycode) {
      if (userprofiles && userprofiles.CompanyInfo.isHeadoffice == 1) { 
        return true;
      } else {
        return false
      }
    }
    return true;
  }


  AddItem() {

    try {

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  AddGroup() {
    try {
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }
  onDeleteConfirm(event): void {
    console.log("Delete Event In Console");

    var image = `<img  src="${event.data.barCodeImage}"/>`;
    console.log(image);
    this.printIt(image)
  }
  public printIt(barcode) {
    try {
      //alert("reached printIT")
      let printContents, popupWin;
      printContents = barcode;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1500px');
      // popupWin.document.open();
      popupWin.document.write(`
      <html>
          <head>                  
              <style>
                  .InvoiceHeader{
            text-align:center;
            font-weight:bold
        }
        p
        {
            height:5px;
        }
        table{
            margin:5px
        }
        .summaryTable{
            float: right;
            border: none;
        }

        .summaryTable  td{
            text-align:right;
            border:none;
        }

        .itemtable{
            border: 1px solid black;
            border-collapse: collapse;
        }
        .itemtable th{                
            height:30px;
            font-weight:bold;
        }
        @media print {  
          @page {
            size: 63mm 102mm; /* landscape */
            size:portrait;
            overflow: hidden;
            /* you can also specify margins here: */
           
         
        }
}
html, body {
  height:100%; 
  margin: 0 !important; 
  padding: 0 !important;
  overflow: hidden;
}
        .itemtable th, td {               
            border: 1px solid black;
            padding:2px;

        }
              </style>
          </head>
          <body style='width: 100%;height:100%;' onload="window.print();window.close()">${printContents}
          </body>
      </html>`
      );
      popupWin.document.close();
    }
    catch (ex) {
      //this.alertService.error(ex)
    }
  }
  onEditClick(event): void {
    try {


      if (!this.isHQ()) return;
      let homeTab: any = <any>{};
      homeTab.name = 'addproduct';
      homeTab.mcode = event.data.MCODE;
      homeTab.mode = "edit";
      homeTab.active = true;
      this.activeTabEmit.emit(homeTab);

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      // if (this._authService.checkMenuRight("productmaster", "view") == true) {
      let homeTab: any = <any>{};
      homeTab.name = 'addproduct';
      homeTab.mcode = event.data.MCODE;
      homeTab.mode = "view";
      homeTab.active = true;
      this.activeTabEmit.emit(homeTab);

    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

  hideChildModal() {
    try {
      this.childModal.hide();
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

}