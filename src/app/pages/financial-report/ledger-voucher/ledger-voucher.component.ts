import { Component, ViewChild } from '@angular/core';
import { ReportFilterComponent } from '../../../common/popupLists/report-filter/report-filter.component';
import { LedgerVoucherService } from './ledger-voucher.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { AlertService } from '../../../common/services/alert/alert.service';
import { GenericReportListSettings } from '../report-body.component';




@Component({
    selector: 'ledger-voucher',
    templateUrl: './ledger-voucher.component.html',
})

export class LedgerVoucherComponent {
    listSetting: GenericReportListSettings = new GenericReportListSettings()
    public reportType:string="Ledger Voucher"
    @ViewChild('reportFilter') reportFilter: ReportFilterComponent
    ReportDataObj: ReportData = <ReportData>{}
    constructor(private _alertService: AlertService, private _ledgerService: LedgerVoucherService, private _spinnerService: SpinnerService) {

        this.listSetting = {
            title: "Ledger Voucher",
            columns: [
                {
                    key: "DATE",
                    title: "Date"
                },
                {
                    key: "PARTICULARS",
                    title: "Particulars"
                },
                {
                    key: "VCH TYPE",
                    title: "VCH TYPE"
                },
                {
                    key: "VCH NO",
                    title: "VCH NO"
                },
                {
                    key: "DEBIT",
                    title: "DEBIT"
                },
                {
                    key: "CREDIT",
                    title: "CREDIT"
                }
            ]

        }
    }


    loadFilter() {
        this.reportFilter.show()
    }
    public filterObj: any
    applyFilter(filterObj) {
        this.filterObj = filterObj
        this.reportFilter.popupClose()
        this._spinnerService.show(' Please Wait! Getting Report Data.')
        try{
            this._ledgerService.getLedgerVoucherData(filterObj.DATE1, filterObj.DATE2, filterObj.ACID, filterObj.DIVISION).subscribe((res) => {
                if (res.result.length == 0) {
                    this._alertService.warning("No Result Found")
                }
                this.ReportDataObj.particularsRow = res.result
                this.ReportDataObj.totalRow = res.result2==null?[]:res.result2
                this._spinnerService.hide()
            }, error => {
                this._alertService.error(error)
            })
        }catch(ex){
            this._alertService.error(ex)
        }
    }

}


export interface ReportData {
    particularsRow: any,
    totalRow: any
}
