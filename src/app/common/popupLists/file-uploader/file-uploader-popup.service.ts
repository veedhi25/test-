import { Http, Response, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/subject";
import "rxjs/Rx";
import { AuthService } from "../../services/permission";
import { ActivatedRoute } from "@angular/router";
import { GlobalState } from "../../../global.state";

@Injectable()
export class FileUploaderService {
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private state: GlobalState
  ) { }
  private get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    return apiUrl;
  }

  public downloadSampleFile(downloadUrl: string, filename: string = "download",format:string="csv") {
      return this.http
        .get(this.apiUrl + `${downloadUrl}`,format.toLowerCase()=="csv"?this.getRequestOption(): this.getRequestOptionForExcelDownload())
        .map((response: Response) => {
          let data = {
            content: new Blob([(<any>response)._body], {
              type: response.headers.get("Content-Type")
            }),
            filename: `${filename}${format}`
          };
          return data;
        });

  }

  importSelectedFiles(importUrl: string, model: any) {
    let res = { status: "error", result: "error" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .post(this.apiUrl + `${importUrl}`, model, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }


  uploadPrescription(importUrl: string, model: any,billno:string="") {
    let res = { status: "error", result: "error" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .post(this.apiUrl + `${importUrl}?billno=${billno}`, model, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  private getRequestOption() {
    let headers: Headers = new Headers({
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers });
  }
  private getRequestOptionForExcelDownload() {
    let headers: Headers = new Headers({
      "Accept": "application/vnd.ms-excel",
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
  }
}
