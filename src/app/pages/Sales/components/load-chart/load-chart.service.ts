import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Subject } from 'rxjs/subject';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { GlobalState } from '../../../../global.state';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';


@Injectable()

export class LoadChartService {

    public router: Router;
    public apiUrl: string;


    constructor(private http: Http, private authService: AuthService, private gblState: GlobalState) {
        let url = this.gblState.getGlobalSetting("apiUrl");
        if (!!url && url.length > 0) this.apiUrl = url[0]
    }

    getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }
   

    public saveLoadChartInfo(data: any) {
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();
        let bodyData = { param: data };
        this.http.post(this.apiUrl + "/saveLoadChart",bodyData, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error"; res.result = retData.result;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
                error => {
                    res.status = "error", res.result = error;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            );
        return returnSubject;

    }
     public loadInvoiceForLoadChart(filterOption) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.post(`${this.apiUrl}/loadSheetinvoice`, filterOption, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error"; res.result = retData.result;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
                error => {
                    res.status = "error", res.result = error;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            );
        return returnSubject;
    }

    public loadChartItemSummary(invoiceList){
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.post(`${this.apiUrl}/loadChartItemSummary`, invoiceList, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error"; res.result = retData.result;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
                error => {
                    res.status = "error", res.result = error;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            );
        return returnSubject;
    }

    public getLoadChartInfoVoucherWise(VCHRNO){
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.post(`${this.apiUrl}/loadChartSheetVoucherWise`, {VOUCHERNO:VCHRNO}, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error"; res.result = retData.result;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
                error => {
                    res.status = "error", res.result = error._body;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            );
        return returnSubject;
    }


    public cancelLoadSheet(loadChart:any){
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.post(`${this.apiUrl}/cancelLoadChartSheet`, loadChart, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error";
                    res.result = retData.result;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
                error => {
                    res.status = "error", res.result = error;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            );
        return returnSubject;
    }


    public getCollectionSheet(listOfVoucherNo){
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.post(`${this.apiUrl}/getCollectionSheet`, {VOUCHERNO:listOfVoucherNo}, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error"; res.result = retData.result;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
                error => {
                    res.status = "error", res.result = error;
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            );
        return returnSubject;
    }

}