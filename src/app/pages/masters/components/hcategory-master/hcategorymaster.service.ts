
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../../../common/services/permission';
import { GlobalState } from '../../../../global.state';
import { Http,Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { hCategoryMaster } from './hCategoryMaster';
@Injectable()
export class hcategorymasterService {
    
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
    GethcategoryMasterList(): Observable<any> {

        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/hcategory/GethcategoryMasterList', this.getRequestOption()).subscribe(
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
    GethCategoryMasterListById(CategoryId:number): Observable<any> {

        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/hcategory/GethCategoryMasterListById/'+CategoryId,this.getRequestOption()).subscribe(
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
    GethCategoryMasterList(): Observable<any> {

        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/hcategory/GethCategoryMasterList', this.getRequestOption()).subscribe(
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
    AddEditHCategory(hCategoryMaster:hCategoryMaster): Observable<any> {
    {
        let reqHeader = new HttpHeaders({
            "Content-type": "application/json",
            Authorization: this.authService.getAuth().token,
            "X-Requested-With": 'XMLHttpRequest'
        });

        let params = new HttpParams();
        var data = JSON.stringify(hCategoryMaster);
        if(hCategoryMaster.CategoryId>0)
        {
            return this.http.post(this.apiUrl + "/hcategory/EdithCategoryMaster",data, this.getRequestOption()) .map(response => response.json() || []);
        }
        else
        {
            return this.http.post(this.apiUrl + "/hcategory/AddhCategoryMaster",data, this.getRequestOption()) .map(response => response.json() || []);
        }
    }
  }
}