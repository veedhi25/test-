import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { AuthService } from "../../../../common/services/permission";
import { GenericPopUpSettings, GenericPopUpComponent } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";
import { ReorderService } from "./reorder.service";

@Component({
  selector: "app-reorder",
  templateUrl: "./reorder.component.html",

  providers: [ReorderService],
  styleUrls: ["../../../modal-style.css"]
})
export class ReorderComponent {
  public mode: string = "NEW";
  IndentMain: any = <any>{};
  IndentList: any[] = [];
  TempIndList: any[] = [];
  userProfile: any = <any>{};
  gridPopupSettings: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGrid") genericGrid: GenericPopUpComponent;

  constructor(
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected masterService: MasterRepo,
    protected service: ReorderService,
    private router: Router,
    authservice: AuthService
  ) {
    this.userProfile = authservice.getUserProfile();
    this.gridPopupSettings =
      Object.assign({
        title: "Intend List",
        apiEndpoints: `/getAllIndentPagedListForEdit`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'INDENTNO',
            title: 'Indent No.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },

        ]
      });


  }

  ngOnInit() {

    this.GetIndentList();



  }

  EditIndent() {
    this.genericGrid.show();
  }


  onItemDoubleClick(event) {
    this.loadingService.show("Please wait.Getting Data.");
    this.masterService.masterGetmethod(`/getIndentDetail?INDENTNO=${event.INDENTNO}`).subscribe((res) => {
      this.loadingService.hide();
      if (res.status == "ok") {
        this.mode = "EDIT";
        this.IndentMain = res.result;
        this.IndentList = res.result.IndentList;
      } else {
        alert(res.result);
      }
    }, err => {
      this.loadingService.hide();
      alert(err);
    })
  }



  GetIndentList() {
    this.loadingService.show("Getting Data, please wait...");
    this.service.getAllIndent().subscribe(res => {
      this.IndentList.push(res);
      if (this.IndentList == null) {
        this.loadingService.hide();
        this.alertService.info("Indent were not found");
      }

    }, (error) => {
      this.loadingService.hide();
    }
      , () => {
        this.loadingService.hide();

      });
  }
  saveIndentList: any[] = [];
  GenerateIndent() {
    this.IndentMain.MODE = this.mode;
    this.loadingService.show("Saving data, please wait...");
    this.service.saveIndent(this.IndentMain, this.IndentList).subscribe(res => {
      this.loadingService.hide();

      if (res.status == 'ok') {
        this.alertService.success("Data Saved Successfully");
        this.IndentList = []
      }
      else {
        this.loadingService.hide();
        if (
          res.result._body ==
          "The ConnectionString property has not been initialized."
        ) {
          this.router.navigate(["/login", this.router.url]);
          return;
        }
        this.alertService.error(
          `Error in Saving Data: ${res.result._body}`
        );
      }
    })
  }
  ResetIndent() {
    this.IndentList = [];
    this.GetIndentList();
  }

}
