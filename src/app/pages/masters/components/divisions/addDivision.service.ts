import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject'
import { GlobalState } from '../../../../../app/global.state';
@Injectable()

export class AddDivisionService {
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private gblState: GlobalState) {
        let url = this.gblState.getGlobalSetting("apiUrl");
        if (!!url && url.length > 0) this.apiUrl = url[0]
        console.log(this.apiUrl);
    }
    private apiUrl: string;
    getDivision(Initial: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        console.log("about to edit");
        let bodyData = { mode: 'query', data: { INITIAL: Initial } };

        this.http.post(this.apiUrl + '/getDivision', bodyData, this.getRequestOption())
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
        /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/


    }
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }


}