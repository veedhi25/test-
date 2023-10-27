import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../common/services/permission';
import { GlobalState } from '../../../../global.state';
@Injectable()
export class SchemeViewService {
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";
        if (!!url && url.length > 0) {
            apiUrl = url[0];
        }
        ;
        return apiUrl;
    }

    public schemeView(schemNo:string){
        let schemeData = {schemeNo:schemNo}
        return this.http.post(`${this.apiUrl}/dmsScheme/schemeView`,schemeData, this.getRequestOption())
        .map(this.extractData)
        .catch(this.handleError)
    }
    public extractData(res: Response) {
        let response = res.json();
        return response || {};
    }
    public handleError(error: Response | any) {
        return Observable.throw(error);
    }
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token });
        return new RequestOptions({ headers: headers });
    }
}
