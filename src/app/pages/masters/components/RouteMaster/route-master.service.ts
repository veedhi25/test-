import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject';
import { GlobalState } from '../../../../../app/global.state';
@Injectable()

export class RouteMasterService {

    constructor(private http: Http, private authService: AuthService, private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    getRouteMaster(bid: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let bodyData = { mode: 'query', data: { RouteName: bid } };
        this.http.post(this.apiUrl + '/getRouteMaster', bodyData, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
                else {
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;

    }

    public saveRouteMaster(mode: string, warehouse: any) {
        let res = { status: "error", result: "" ,result2:''}
        let returnSubject: Subject<any> = new Subject();
        let bodyData = { mode: mode, data: warehouse };
        this.http.post(this.apiUrl + "/saveRouteMaster", bodyData, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    res.result2 = retData.result2
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error1"; res.result = retData.result;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
                error => {
                    res.status = "error2", res.result = error;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            );
        return returnSubject;

    }

    public getRoutePlan(RouteCode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(`${this.apiUrl}/getRoutePlan?RouteCode=${RouteCode}`, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
                else {
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;
    }

    

    public getAllRouteMasterList() {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(`${this.apiUrl}/getAllRouteMasterList`, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
                else {
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;
    }


    public getRouteSchedule(routeCode,year,month) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(`${this.apiUrl}/getRouteSchedule?routeCode=${routeCode}&year=${year}&month=${month}`, this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
                else {
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;
    }




    public saveRouteSchedule(routeSchedule) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let data = {
            mode: "new",
            data : routeSchedule
        }
        this.http.post(`${this.apiUrl}/saveRouteSchedule`, data,this.getRequestOption())
            .subscribe(response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
                else {
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            }, error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;
    }

    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }

}