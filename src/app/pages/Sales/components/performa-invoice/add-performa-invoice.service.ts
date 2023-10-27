// import { Component, ViewChild } from "@angular/core";
// import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
// import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
// import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";


// @Component({
//   selector: "addsales-invoice",
//   templateUrl: "./AddSalesInvoice.html",
//   providers: [TransactionService],
//   styles: [
//     `
//       .GRNPopUp tbody tr:hover {
//         background-color: #e0e0e0;
//       }
//       .GRNPopUp tr.active td {
//         background-color: #123456 !important;
//         color: white;
//       }
//       .modal-dialog.modal-md {
//         top: 45%;
//         margin-top: 0px;
//       }

//       .modal-dialog.modal-sm {
//         top: 45%;
//         margin-top: 0px;
//       }

//       .table-summary > tbody > tr > td {
//         font-size: 10px;
//       }

//       .table-summary > tbody > tr > td:first-child {
//         text-align: left !important;
//       }
//     `
//   ]
// })
// export class AddSalesInvoiceComponent {
//   @ViewChild("genericGridSO") genericGridSO: GenericPopUpComponent;
//   gridPopupSettings : GenericPopUpSettings = new GenericPopUpSettings();


//   constructor(
//     public masterService: MasterRepo,
//     public _trnMainService: TransactionService
//   ) {
//     this._trnMainService.initialFormLoad(57);

//     this.gridPopupSettings = {
//       title : "Sales Vouchers",
//       apiEndpoints : `/getTrnMainPagedList/SO`,
//       defaultFilterIndex : 0,
//       columns : [
//         {
//           key : 'VCHRNO',
//           title : 'Voucher No.',
//           hidden : false,
//           noSearch : false
//         },
//         {
//           key : 'DIVISION',
//           title : 'Division',
//           hidden : false,
//           noSearch : false
//         },
//         {
//           key : 'TRNAC',
//           title : 'Trn. A/c',
//           hidden : false,
//           noSearch : false
//         },
//         {
//           key : 'PhiscalId',
//           title : 'Fiscal Year',
//           hidden : false,
//           noSearch : false
//         },
//       ]
//     };
//   }

//   ngOnInit() {
//     this.masterService.masterGetmethod("/gettransactionmodes").subscribe(
//       res => {
//         if (res.status == "ok") {
//           this._trnMainService.paymentmodelist = res.result;
//         } else {
//           console.log("error on getting paymentmode " + res.result);
//         }
//       },
//       error => {
//         console.log("error on getting paymentmode ", error);
//       }
//     );
//   }

//   showLoadFromSOPopup($event){
//       this.genericGridSO.show();
//   }

//   onSalesOrderSelect(item){
//      this.masterService.loadSalesInvoiceFromSalesOrder(item.VCHRNO)
//       .subscribe(
//         result => {
//           console.log(result.result);
//           if(result.status == "ok"){
//             this._trnMainService.TrnMainObj  =result.result; //Object.assign({}, this._trnMainService.TrnMainObj, result.result );
//             //this._trnMainService.ReCalculateBill();
//           }
//       },
//       error => {

//       })
//   }
// onItemDoubleClick(event)
// {
//   this._trnMainService.TrnMainObj.REFORDBILL=event.VCHRNO;
//   this._trnMainService.loadSODataToSales(event.VCHRNO);
// }
// // OnViewSOClickEmit(value)
// // {
// //   this.gridPopupSettings = {
// //     title : "Sales Vouchers",
// //     apiEndpoints : `/getTrnMainPagedList/SO`, 
//        defaultFilterIndex : 0,
// //     columns : [
// //       {
// //         key : 'VCHRNO',
// //         title : 'Voucher No.',
// //         hidden : false,
// //         noSearch : false
// //       },
// //       {
// //         key : 'DIVISION',
// //         title : 'Division',
// //         hidden : false,
// //         noSearch : false
// //       },
// //       {
// //         key : 'TRNAC',
// //         title : 'Trn. A/c',
// //         hidden : false,
// //         noSearch : false
// //       },
// //       {
// //         key : 'PhiscalId',
// //         title : 'Fiscal Year',
// //         hidden : false,
// //         noSearch : false
// //       },
// //     ]
// //   };
// //   this.genericGrid.show();
// // }
// }
