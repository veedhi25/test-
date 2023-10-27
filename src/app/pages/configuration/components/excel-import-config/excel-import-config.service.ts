import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../../../../common/services/permission";
import { Subject } from "rxjs/subject";
import { GlobalState } from "../../../../../app/global.state";
import "rxjs/Rx";

@Injectable()
export class ExcelImportService {
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

  public loadConfig(importName: string, tag: string = undefined) {
    return this.http
      .get(this.apiUrl + `/getConfig/${importName}?tag=${tag}`, this.getRequestOption())
      .map(response => response.json() || []);
  }

  public downloadConfigCSV(importName: string, tag: string = null) {
    return this.http
      .get(this.apiUrl + `/downloadCSV/${importName}?tag=${tag}`, this.getRequestOption())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `${importName}.csv`
        };
        return data;
      });
  }










  public saveConfig(data: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();

    let opt = this.getRequestOption();
    //  console.log(opt.headers.toJSON());
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: "EDIT", data: data };
    this.http
      .post(this.apiUrl + "/saveConfig", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          //  console.log(retData);
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            //    console.log(res);
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            console.log(res);
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  importConfig(model: any, importName: string, extraid: string = "nothing") {
    let res = { status: "error", result: "error" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .post(
        this.apiUrl + `/masterImport/${importName}/${extraid}`,
        model,
        this.getRequestOptionWithoutContent()
      )
      .subscribe(
        response => {
          let data = response.json();
          // console.log("ulploadcheck",data);
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

  public loadImportErrorList(importName: string) {
    return this.http
      .get(this.apiUrl + `/masterImportErrorList/${importName}`, this.getRequestOption())
      .map(response => response.json() || []);
  }

  public saveCorrectedList(data: any, importName: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();

    let opt = this.getRequestOption();
    //  console.log(opt.headers.toJSON());
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: "EDIT", data: data };
    this.http
      .post(
        this.apiUrl + `/masterImportCorrection/${importName}`,
        data,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          //  console.log(retData);
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            //    console.log(res);
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            console.log(res);
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          console.log(res);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }



  public downloadSampleFile(prefix: string, filename: string) {
    return this.http
      .get(this.apiUrl + `/downloadSampleFile/${prefix}`, this.getRequestOption())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: filename == "SchemeSample" ? `${filename}.xlsx` : `${filename}.csv`
        };
        return data;
      });

  }


























  private getRequestOption() {
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: this.authService.getAuth().token
    });
    console.log({ headers: headers });
    return new RequestOptions({ headers: headers });
  }

  private getRequestOptionWithoutContent() {
    let headers: Headers = new Headers({
      Authorization: this.authService.getAuth().token
    });
    console.log({ headers: headers });
    return new RequestOptions({ headers: headers });
  }
}
