import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject';
import {GlobalState} from '../../../../global.state';
@Injectable()

export class TaxGroupService {
    
    constructor(private http: Http, private authService: AuthService,private state:GlobalState) {
    }
   private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    } 
    getTAXfromMCODE(ID:number) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        console.log("about to edit");
        let bodyData = {mode:'query',data:{ID:ID}};
        
        this.http.post(this.apiUrl +'/getTaxfromMCODE',bodyData,this.getRequestOption())
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
 
    
    getAllPCL() {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getPCL', this.getRequestOption()).subscribe(response => {
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
    public saveTax(mode: string, Tax: any) {
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();
        let bodyData = { mode: mode, data: Tax };
        this.http.post(this.apiUrl + "/saveTax", bodyData, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
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