import { Component, ViewChild, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";

@Component({
  selector: "gate-pass",
  templateUrl: "./gate-pass.component.html",

})
export class GatePassComponent implements OnInit {
  public invoiceNumber: string;
  public vehicleNumber: string;
  public visitorName: string;
  public purpose: string;
  public list: any[];

  constructor(private masterService: MasterRepo) {
    this.get();
  }


  ngOnInit() {

  }
  get() {
    this.masterService.getGatePass().subscribe(res => {
      this.list = res.data;
    })
  }
  submit() {
    console.log(this.visitorName);
    var requestObject = JSON.stringify({
      "VisitorName": this.visitorName,
      "Vehicle": this.vehicleNumber,
      "InvoiceNo": this.invoiceNumber,
      "Purpose": this.purpose
    });
    console.log(requestObject);
    this.masterService.createGatePass(requestObject).subscribe(res => {
      this.vehicleNumber="";
      this.invoiceNumber="";
      this.purpose="";
      this.visitorName="";
      this.get();
    })
  }

}
