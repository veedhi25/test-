import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { Router, ActivatedRoute } from "@angular/router";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { MdDialog } from "@angular/material";
import { MasterDialogReport } from '../../../ReportDialogs/MasterDialogReport/MasterDialogReport';
import { IReport } from '../../../DialogReport/components/reports/report.service';
import { AuthService } from '../../../../common/services/permission';

import * as XLSX from 'xlsx';
import { ReportMainSerVice } from '../../Report.service';
import * as _ from 'lodash';
import { IMSReportColumnFormatComponent } from './ReportColumnFormat/ims-report-column-format.component';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../../common/services/alert/alert.service';



const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const CSV_TYPE = 'text/csv;charset=UTF-8';
@Component({
  selector: 'reportmain',
  templateUrl: './ReportMain.html',
  styleUrls: ["../../../modal-style.css", "../../reportStyle.css"],
})
export class ReportMain implements OnInit {
  DialogMessage: string;
  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('reportFormat') reportFormat: IMSReportColumnFormatComponent;

  // @Input('reportname') reportname: string;
  @Input() reportMaster: IReport = <IReport>{};
  public activeurlpath: string;
  private reportHeaders: any[] = [];
  private allHeaders: any[] = [];
  public reportData: any[] = [];
  public reportDetail: any[] = [];
  public reportmasterData: any = {};
  private reportparam: any;
  private reportname: any;
  dialogReport: any;
  trialUrl: boolean = false;
  public gridTabel: any;
  public userProfile: any;
  public keyValue: string;
  public paramValue: any[] = [];
  public param: any;
  public editTable: boolean = false;
  public editData: any[] = [];
  public editVal: any;
  public myAr: any = [];

  sortTableData(sortKey: string, sortOrder: string, index: number) {
    this.reportHeaders[index].sortOrder = sortOrder == "asc" ? "desc" : "asc";
    this.reportData.sort(compareValues(sortKey, sortOrder));
    function compareValues(key, order = 'asc') {
      return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          return 0;
        }

        const valueA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
        const valueB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

        let comparisonResult = 0;
        if (valueA > valueB) {
          comparisonResult = 1;
        } else if (valueA < valueB) {
          comparisonResult = -1;
        }
        return (
          (order === 'desc') ? (comparisonResult * -1) : comparisonResult
        );
      };
    }
  }







  constructor(private reportFilterService: ReportMainSerVice, public router: Router, private masterService: MasterRepo, private authService: AuthService, private alertService: AlertService, arouter: ActivatedRoute, public dialog: MdDialog, private loadingService: SpinnerService) {

    this.activeurlpath = arouter.snapshot.url[0].path;
    this.userProfile = this.authService.getUserProfile();
  }

  ngOnInit() {
    this.fiterClickEvent();
    let existingDataFromReportDataStore = this.reportFilterService.reportDataStore[this.activeurlpath];
    if (existingDataFromReportDataStore != null && existingDataFromReportDataStore != undefined) {
      this.reportHeaders = existingDataFromReportDataStore.data.result.headers;
      for (var i of this.reportHeaders) {

        if (i.size == null || i.size == 0) { i.width = 'auto'; }
        else { i.width = i.size + 'px'; }
      }
      this.reportData = existingDataFromReportDataStore.data.result.data;
      this.reportDetail = existingDataFromReportDataStore.data.result.repDetails;
      this.reportmasterData = existingDataFromReportDataStore.data.result.reportmaster;
    }
  }
  reportObj: any;
  fiterClickEvent() {
    let dialogRef = this.dialog.open(MasterDialogReport, { hasBackdrop: true, data: { activeurlpath: this.activeurlpath, reportparam: this.reportparam, reportname: this.reportname } });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status == 'ok') {

          this.reportname = result.data.reportname
          this.reportparam = result.data.reportparam;
          this.loadReport(result.data);
          this.reportObj = result.data;
        }
      }
      dialogRef = null;
    });
  }

  onReportDataEmitted(data) {
    this.reportparam = data.reportparam;
    this.loadReport(data);
  }

  selectedRowIndex = 0;
  RowClick(i) {
    this.selectedRowIndex = i;
  }

  storeAndUpdateReportDataStore(reportParam: any, reportData: any) {
    this.reportFilterService.reportDataStore[this.activeurlpath] = {
      param: _.cloneDeep(reportParam),
      data: _.cloneDeep(reportData),
      calendarForm: _.cloneDeep(this.reportFilterService.calendarForm)
    }
  }



  loadReport(reportData) {
    this.DialogMessage = "Report Loading Please Wait...";
    this.childModal.show();
    
    if (reportData.hasOwnProperty("columnSetting") && reportData.columnSetting.length) {
      reportData.columnSetting.forEach(input => {
        input.value = input[input.name];
        if (input.hasOwnProperty("type")) {
          if (input.type.toLowerCase() == "multiselect") {
            if (input[input.name].length) {

              reportData.reportparam[input.name] = input[input.name].map(function (el) { return el[input.multiSelectSetting.primaryKey] }).join(",");
            } else {
              reportData.reportparam[input.name] = "%";
            }
          } else {
            reportData.reportparam[input.name] = input[input.name];
          }
        }
      });
    }

    this.masterService.getReportData(reportData, "/loadReports").subscribe(data => {
      let reportresult = <any>data;
      if (reportresult.status == "ok") {
        this.myAr = reportresult.result.headers;
        this.prepareReportData(reportresult.result.headers, reportresult.result.data);
        this.reportHeaders = reportresult.result.headers;
        this.allHeaders = reportresult.result.allHeaders;
        this.reportmasterData = reportresult.result.reportmaster;
        this.storeAndUpdateReportDataStore(reportData, reportresult);


        for (var i of this.reportHeaders) {

          if (i.size == null || i.size == 0) { i.width = 'auto'; }
          else { i.width = i.size + 'px'; }
          i.sortOrder = "none";
        }

        this.reportData = reportresult.result.data;
        this.reportDetail = reportresult.result.repDetails;
        this.DialogMessage = "Report Loadded successfully.";
        setTimeout(() => {
          this.childModal.hide();
        }, 2000)
      }
      else {
        this.DialogMessage = reportresult.result;
        this.childModal.show();
        setTimeout(() => {
          this.childModal.hide();
        }, 3000)
      }
    }, Error => {
      this.storeAndUpdateReportDataStore(reportData, null);
      this.DialogMessage = Error;
      setTimeout(() => {
        this.childModal.hide();
      }, 3000)
    });
  }


  getFormattedValue(value) {
    if (value != null) {
      if (typeof value === 'number') { return value.toLocaleString('en-us', { minimumFractionDigits: 2 }) }

      else if (new Date(value).toString() != 'Invalid Date') {
        return value.split('T')[0];
      }
    }
    return value;
  }


  SettingClickEvent() {

  }

  showReportName(menupath: String, reportname: String) {
    if (menupath == "itemwisestockandsalessummary") {
      return "Item Stock Ledger Report";
    } else {
      return reportname;
    }



  }

  public promptExportFormat: boolean = false;
  public exportFormat: string = "xlsx";
  cancelExport() {
    this.promptExportFormat = false;
    this.exportFormat = "xlsx";
  }
  exportReport() {
    this.excelDownloadFromHtml_manualTable(this.exportFormat);
  }

  ExportReportInExcel() {
    this.promptExportFormat = true;
  }

  tableEdit() {
    this.editTable = true;
  }
  sendToMail() {
    this.masterService.sendReportToMail("body").subscribe((data: any) => {
      // console.log(data);
    })
  }


  excelDownloadFromHtml_manualTable(exportFormat: string = "xlsx") {
    var item = 1;
    let excelColumnName = this.reportHeaders.map(
      x => {
        return <any>{
          SNO: item++,
          ReportName: this.reportname,
          ColumnName: x.colHeader,
          isChecked: x.isChecked,
          MappingName: x.mappingName
        };
      }
    );
    let paramObj = {
      exportFormat: this.exportFormat,
      reportname: this.reportname, reportparam: this.reportparam, columnSetting: excelColumnName
    };




    if (exportFormat == "xlsx") {
      this.loadingService.show("Downloading Report.Please Wait.")
      this.masterService.getExcelReport(paramObj).subscribe(
        data => {
          this.loadingService.hide();
          this.downloadFile(data);
        },
        error => {
          this.loadingService.hide();
        }
      )
    }
    else {
      this.loadingService.show("Downloading Report.Please Wait.")
      this.masterService.getCSVReport(paramObj).subscribe(
        data => {
          this.loadingService.hide();
          this.downloadFile(data);
        },
        error => {
          this.loadingService.hide();
        }
      )
    }
  }



  downloadFile(response: any) {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(response.content);
    element.download = response.filename;
    document.body.appendChild(element);
    element.click();
  }





  // excelDownloadFromHtml_manualTable(exportFormat: string) {
  //   try {
  //     let ExcelList = [];

  //     for (let row of this.reportData) {
  //       let rowData = <any>{};
  //       for (let column of this.reportHeaders) {
  //         if (column.showhideinexcel == 0) {
  //           rowData[column.colHeader] = row[column.mappingName]
  //         }
  //       };
  //       ExcelList.push(rowData);
  //     };



  //     if (exportFormat == "xlsx") {
  //       const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ExcelList);
  //       //  this.wrapAndCenterCell(worksheet.B2);
  //       const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //       const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  //       const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
  //       FileSaver.saveAs(data, this.userProfile.CompanyInfo.COMPANYID + "_" + this.excelReportNameProvide() + `.${exportFormat}`);
  //     } else {
  //       const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ExcelList);
  //       const excelBuffer: any = XLSX.utils.sheet_to_csv(worksheet);
  //       const data: Blob = new Blob([excelBuffer], { type: CSV_TYPE });
  //       FileSaver.saveAs(data, this.userProfile.CompanyInfo.COMPANYID + "_" + this.excelReportNameProvide() + `.${exportFormat}`);
  //     }


  //   } catch (ex) { alert(ex) };
  // }

  private setCellStyle(cell: XLSX.CellObject, style: {}) {
    cell.s = style;
  }
  repName() {
  }

  excelReportNameProvide(): string {
    switch (this.activeurlpath) {
      case 'itemwisestockandsalessummary':
        return 'Item Stock Ledger';
      default:

        return this.activeurlpath

    }
  }
  setFavourite() {
    try {
      if (confirm("Are you sure to add " + this.reportname + " as your favourite")) {
        var requestOject = {
          "Report_name": this.reportname,
          "Url": this.router.url
        }
        this.loadingService.show("Please wait...");
        this.masterService.masterPostmethod('/AddFavourite', JSON.stringify(requestOject))
          .subscribe(data => {
            if (data.status == 'ok') {
              this.loadingService.hide();
              this.alertService.success(data.result);

            }
            else {
              this.loadingService.hide();
              this.alertService.error(data.result);

            }

          },
            error => {
              this.loadingService.hide();
              this.alertService.error(error)
            }
          );
      }
    }
    catch (e) {
      this.loadingService.hide();
      this.alertService.error(e);
    }
  }

  excelNameChooser() {
    try {
      // if(this.reportname=="CUSTOMERVSITEMWISESALES"){
      //     return "CUSTOMER_VS_ITEM_WISE_SALES_REPORT ("+ this.masterService.customerList.find(x=>x.ACID== this.reportMaster.reportQuery.find(x=>x.param=="CUSTOMER").value).ACNAME+")";}
      if (this.reportname == "DEBITORSREPORT") {
        return "DEBTORS REPORT ( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "DEBITORSREPORTEXD") {
        return "DEBTORS REPORT EXTENDED( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "SALESBOOKREPORT") {
        return "SALES REPORT ( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "STOCKREPORT") {
        return "STOCK REPORT ( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "STOCKREPORTEXD") {
        return "STOCK REPORT EXTENDED( FROM: " + this.reportMaster.reportQuery.find(x => x.param == "DATE1").value + "  TO:" + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "DEBITORSREPORT_AGING") {
        return "DEBTORS AGEING REPORT ( As On Dated: " + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "DEBITORSREPORT_AGINGEXD") {
        return "DEBTORS AGEING REPORT EXTENDED( As On Dated: " + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }
      if (this.reportname == "DEBITORSREPORT_AGINGEXD") {
        return "DEBTORS AGEING REPORT EXTENDED( As On Dated: " + this.reportMaster.reportQuery.find(x => x.param == "DATE2").value + " )";
      }

      if (this.reportname == "STOCKLEDGERREPORT") {
        let CC = this.masterService._itemList.find(x => x.MCODE == this.reportMaster.reportQuery.find(x => x.param == "MCODE").value);
        if (CC != null) {
          return "STOCK LEDGER REPRT ( " + CC.MENUCODE + "  " + CC.DESCA + " )";
        }
      }
      return this.reportMaster.title;
    } catch (ex) { return this.reportMaster.title; }
  }

  getReportParamForPreviewKey(param: any, reportdetails: any[]) {
    let key = Object.keys(param);
    var allValue = "";
    for (let i in key) {
      var label = key[i];
      let paramDetails = reportdetails.filter(x => x.PROPNAME == key[i])[0];
      if (paramDetails != null) {
        if (paramDetails.PRINTLABEL != null && paramDetails.PRINTLABEL != "") {
          label = paramDetails.PRINTLABEL;
        }
      }

      var value = param[key[i]];
      allValue += label + ":" + value + " , ";

    }
    return allValue;

  }



  public totalRow: any = {};
  prepareReportData(reportHeaders: any[], reportData: any[]) {
    this.totalRow = {};
    for (let i in reportHeaders) {
      let currentRowTotal = 0;
      if (reportHeaders[i].totalCalculation) {
        for (let x of reportData) {
          currentRowTotal = this.masterService.nullToZeroConverter(currentRowTotal) + this.masterService.nullToZeroConverter(x[reportHeaders[i].mappingName]);
        }
        this.totalRow[reportHeaders[i].mappingName] = currentRowTotal > 0 ? currentRowTotal.toFixed(2) : null;
      } else {
        this.totalRow[reportHeaders[i].mappingName] = null;
      }
    }
  }


  setting() {
    this.reportFormat.show();
  }




  updateReportColumnFormat(event) {
    // let data = {
    //   REPORTTNAME: this.reportname,
    //   REPORTCOLUMNFORMAT: event
    // }
    let data = {
      REPORTTNAME: this.reportname,
      REPORTCOLUMNFORMAT: this.allHeaders
    }

    this.masterService.masterPostmethod("/updatereportcolumnformat", data).subscribe((res) => {
      if (res.status == "ok") {
        this.reportHeaders = res.result.filter(x => x.visible != 0);
        for (var i of this.reportHeaders) {

          if (i.size == null || i.size == 0) { i.width = 'auto'; }
          else { i.width = i.size + 'px'; }
        }
        this.editTable = false;
        this.loadReport(this.reportObj);
      }
    })
  }

  doubleClick(data: any) {
    if (!this.reportmasterData.hasOwnProperty('DRILLKEY') || !this.reportmasterData.hasOwnProperty('DRILLTO') || !this.reportmasterData.hasOwnProperty('ISDRILLABLE') || !this.reportmasterData.ISDRILLABLE) {
      return;
    }

    let drillTo = this.reportmasterData.DRILLTO.toLowerCase();
    switch (drillTo) {
      case 'tax invoice':
        this.router.navigate(
          ["/pages/transaction/sales/addsientry"],
          {
            queryParams: {
              mode: 'D',
              from: 'INVENTORY',
              voucherNumber: data[this.reportmasterData.DRILLKEY],
              phiscalId: this.reportFilterService.repObj.reportparam.PHISCALID
            }
          }
        );
        break;

      default:
        break;
    }


  }

  onSave() {

  }


}