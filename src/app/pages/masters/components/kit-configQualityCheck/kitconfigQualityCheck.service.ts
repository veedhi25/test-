
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../common/services/permission';
import { GlobalState } from '../../../../global.state';
import { Http,Headers, RequestOptions } from '@angular/http';
@Injectable()
export class KitConfigQualityService {
    constructor(
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

    saveKitQualityConfig( data) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
       
        this.http.post(this.apiUrl + '/saveQualityComboItems', data,this.getRequestOption())
            .subscribe((response: any) => {
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

}