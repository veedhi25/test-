import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ReportMainSerVice } from '../../Reports/Report.service';


@Component({
  selector: 'povsintransit',
  templateUrl: './povsintransit.component.html',
  styleUrls: ["../../modal-style.css", "../../Reports/reportStyle.css"],

})
export class POVSINTRANSITReport {

  @Output() reportdataEmit = new EventEmitter();
  @Input() reportType: string;
  constructor(public reportFilterService: ReportMainSerVice) {

  }
  onload() {
    this.reportdataEmit.emit({ status: "ok", data: this.reportFilterService.repObj });
  }
  ngOnInit() {


  }

  closeReportBox() {
    this.reportdataEmit.emit({ status: "Error!", data: this.reportFilterService.repObj });
  }




}