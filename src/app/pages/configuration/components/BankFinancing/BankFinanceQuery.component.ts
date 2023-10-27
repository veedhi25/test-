import { Component, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Http, Response, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment'
import { Subject } from 'rxjs';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { AuthService } from '../../../../common/services/permission';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { GlobalState } from '../../../../global.state';
@Component(
  {
    selector: 'BankFinanceQuery',
    templateUrl: './BankFinanceQuery.component.html',
  }
)
export class BankFinanceQuerycomponent {
  financeForm: FormGroup;
  fileListAddressProof: FileList = null;
  fileListIdentityProof: FileList = null;
  fileListRecentPhotograph: FileList = null;
  fileListBallanceSheet: FileList = null;
  public data = [];
  public baseDownloadUrl = "";
  constructor(private fb: FormBuilder,
    private masterService: MasterRepo,
    private spinnerService: SpinnerService,
    private alertService: AlertService,
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private state: GlobalState) {
    this.getData("/getBankFinancingQuery");
    this.financeForm = this.fb.group({

      BankName: '',
      AddressProofTypeID: '1',
      AddressProofPath: '',
      IdentityProofTypeID: '1',
      IdentityProofPath: '',
      RecentPhotographPath: '',
      TwoYearBallanceSheetPath: '',
      LastYearSalesAchieved: '',
      LoanRangeTypeID: '1',
      IsBankDefaulter: '',
      StatusTypeID: '',
    });
  }
  private get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    return apiUrl;
  }
  UploadFormWithfiles(url: string, model: any) {
    let res = { status: "error", result: "error" };
    let returnSubject: Subject<any> = new Subject();
    debugger;
    this.spinnerService.show("Please wait ...");
    this.http
      .post(this.apiUrl + `${url}`, model, this.getRequestOption())
      .subscribe(
        response => {
          this.spinnerService.hide();
          let data = response.json();
          if (data.status == "ok") {
            this.getData("/getBankFinancingQuery");
            this.alertService.success("Bank Finance Query created successfully");
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            this.alertService.error(data.result.message);
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          this.spinnerService.hide();
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getData(url: string) {
    let res = { status: "error", result: "error" };
    let returnSubject: Subject<any> = new Subject();

    this.baseDownloadUrl = (this.apiUrl + "/FinancingQuery/").replace("/api", "");
    this.spinnerService.show("Please wait ...");
    this.masterService.masterGetmethod(url).subscribe((res) => {
      debugger;
      this.spinnerService.hide();
      if (res.status == "ok") {
        debugger;

        this.data = res.result;
      }
    }, error => {
      this.spinnerService.hide();
      this.alertService.error(error);
    })

    return returnSubject;
  }


  private getRequestOption() {
    let headers: Headers = new Headers({
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers });
  }

  saveFinanceQuery(values) {
    console.log(values);

    if (this.financeForm.valid) {
      const formData = new FormData();
      for (var key in values) {
        formData.append(key, values[key]);
      }
      if (values.BankName == '') {
        this.alertService.error("Bank Name is required");
        return;
      }

      if (this.fileListAddressProof == null) {
        this.alertService.error("Address Proof is required");
        return;
      }
      if (this.fileListIdentityProof == null) {
        this.alertService.error("Identity Proof is required");
        return;
      }
      if (this.fileListRecentPhotograph == null) {
        this.alertService.error("Recent Photograph is required");
        return;
      }
      if (this.fileListBallanceSheet == null) {
        this.alertService.error("Ballance Sheet is required");
        return;
      }
      if (values.LastYearSalesAchieved == '') {
        this.alertService.error("LastYearSalesAchieved is required");
        return;
      }
      
      console.log(formData);
      
      //for (let i = 0; i < this.fileListAddressProof.length; i++) {
      formData.append('fileAddressProof', this.fileListAddressProof[0], this.fileListAddressProof[0].name);
      //formData.append('file[]', this.readyFile[0]);
      //}
      formData.append('fileIdentityProof', this.fileListIdentityProof[0], this.fileListIdentityProof[0].name);
      formData.append('fileRecentPhotograph', this.fileListRecentPhotograph[0], this.fileListRecentPhotograph[0].name);
      formData.append('fileBallanceSheet', this.fileListBallanceSheet[0], this.fileListBallanceSheet[0].name);
      //this.apiService.updateUserData(formData)
      console.log(formData);
      this.UploadFormWithfiles('/updateBankFinancingQuery', formData);

    }
  }
  onAddressProofFileChange($event) {
    this.fileListAddressProof = $event.target.files;
  }
  onIdentityProofFileChange($event) {
    this.fileListIdentityProof = $event.target.files;
  }
  onRecentPhotographFileChange($event) {
    this.fileListRecentPhotograph = $event.target.files;
  }
  onBallanceSheetFileChange($event) {
    this.fileListBallanceSheet = $event.target.files;
  }
  public toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
}