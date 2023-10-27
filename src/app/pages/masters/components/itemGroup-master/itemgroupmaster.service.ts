
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../../../common/services/permission';
import { GlobalState } from '../../../../global.state';
import { Http,Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ItemGroupMaster } from './ItemGroupMaster';
@Injectable()
export class ItemGroupMasterService {
    
    constructor(
        //private _httpclient: HttpClient,
        private http: Http,
        private authService: AuthService,
        private state: GlobalState,

    ) {


    }
    //getters methods for getting values for api
    public get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) {
            apiUrl = url[0];
        }
        return apiUrl;
    }
    public getRequestOption() {
        let headers: Headers = new Headers({
            "Content-type": "application/json",
            Authorization: this.authService.getAuth().token,
            "X-Requested-With": 'XMLHttpRequest'
        });
        return new RequestOptions({ headers: headers });
    }
    GetItemGroupMasterList(): Observable<any> {

        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/ItemGroup/GetItemGroupMasterList', this.getRequestOption()).subscribe(
            response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
            }
            , error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            });

        return returnSubject;
        // let reqHeader = new HttpHeaders({
        //     "Content-type": "application/json",
        //     Authorization: this.authService.getAuth().token,
        //     "X-Requested-With": 'XMLHttpRequest'
        // });
        // let params = new HttpParams();
        // var data = "";
        // return this.http.get(this.apiUrl + "/ItemGroup/GetItemGroupMasterList", this.getRequestOption());
    }
    GetItemGroupMasterListById(ItemGroupId:number): Observable<any> {

        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/ItemGroup/GetItemGroupMasterListById/'+ItemGroupId,this.getRequestOption()).subscribe(
            response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
            }
            , error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            });

        return returnSubject;
        // let reqHeader = new HttpHeaders({
        //     "Content-type": "application/json",
        //     Authorization: this.authService.getAuth().token,
        //     "X-Requested-With": 'XMLHttpRequest'
        // });
        // let params = new HttpParams();
        // var data = "";
        // return this.http.get(this.apiUrl + "/ItemGroup/GetItemGroupMasterList", this.getRequestOption());
    }
    GetCategoryMasterList(): Observable<any> {

        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/ItemGroup/GetCategoryMasterList', this.getRequestOption()).subscribe(
            response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
            }
            , error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            });

        return returnSubject;
    }
    AddEditItemGroup(ItemGroupMaster:ItemGroupMaster): Observable<any> {
    {
        let reqHeader = new HttpHeaders({
            "Content-type": "application/json",
            Authorization: this.authService.getAuth().token,
            "X-Requested-With": 'XMLHttpRequest'
        });

        let params = new HttpParams();
        var data = JSON.stringify(ItemGroupMaster);
        if(ItemGroupMaster.ItemGroupId>0)
        {
            return this.http.post(this.apiUrl + "/ItemGroup/EditItemGroupMaster",data, this.getRequestOption()) .map(response => response.json() || []);
        }
        else
        {
            return this.http.post(this.apiUrl + "/ItemGroup/AddItemGroupMaster",data, this.getRequestOption());
        }
    }
  }
}