import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../../../../common/services/permission";
import { Subject } from "rxjs/subject";
import { GlobalState } from "../../../../global.state";
@Injectable()
export class AddClaimTypeService {
  constructor(
    private http: Http,
    private authService: AuthService,
    private state: GlobalState
  ) {}
  private get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    return apiUrl;
  }
  getClaimType(Initial: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    console.log("about to edit");
    let bodyData = { mode: "query", data: { ClaimTypeName: Initial } };
    this.http
      .post(this.apiUrl + "/getClaimType", bodyData, this.getRequestOption())
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
      "Content-type": "application/json",
      Authorization: this.authService.getAuth().token
    });
    console.log({ headers: headers });
    return new RequestOptions({ headers: headers });
  }
}
