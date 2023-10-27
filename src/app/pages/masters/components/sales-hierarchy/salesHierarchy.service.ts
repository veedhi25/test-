import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject';
import {GlobalState} from '../../../../../app/global.state';
@Injectable()

export class salesHierarchyService {
    
    constructor(private http: Http, private authService: AuthService,private state:GlobalState) {
    }
   private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    } 
     getSalesHierarchy(bid:string) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        console.log("about to edit");
        let bodyData = {mode:'query',data:{BID:bid}};
        this.http.post(this.apiUrl +'/getSalesHierarchy',bodyData,this.getRequestOption())
            .subscribe(response=>{
                let data = response.json();
                if(data.status == 'ok'){
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
                else{
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            },error =>{
                res.status='error';res.result=error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
            return returnSubject;
       /* return this.http.get("/rategroups.json").toPromise()
            .then((res) => res.json());*/
            

     }

    public saveSalesHierarchy(mode: string, warehouse: any) {
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();
        let bodyData = { mode: mode, data: warehouse };
        console.log("company item"+bodyData);
        this.http.post(this.apiUrl + "/saveSalesHierarchy", bodyData, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
              //  console.log(retData);
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                //    console.log(res);
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error1"; res.result = retData.result;
                    console.log(res);
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
            error => {
                res.status = "error2", res.result = error;
                console.log(res);
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;

    }

      private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }
   
}