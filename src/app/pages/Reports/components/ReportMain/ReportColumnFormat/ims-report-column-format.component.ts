import {
  Component, Input, OnChanges, Output, EventEmitter
} from "@angular/core";

@Component({
  selector: "ims-report-column-format",
  templateUrl: "./ims-report-column-format.component.html",
  styleUrls: ['./ims-report-column-format.component.scss']
})
export class IMSReportColumnFormatComponent {
  isActive: boolean;
  @Input() Headerlist: any[]=[];
  @Output() columnData = new EventEmitter();
  public headerKeys: any[] = [];
  constructor() {

  }



  show() {
    this.isActive = true;
  }




  hide() {
    this.isActive = false;
  }

  update() {
    this.columnData.emit(this.Headerlist);
    this.hide();
  }






}
