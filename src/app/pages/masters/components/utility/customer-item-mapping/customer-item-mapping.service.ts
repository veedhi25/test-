import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../../../common/services/permission';
import {Warehouse} from "../../../../common/interfaces/TrnMain";
import { Subject } from 'rxjs/subject';
import {GlobalState} from '../../../../../../app/global.state';
@Injectable()

export class CustomerItemMappingService {
    
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService,private state:GlobalState) {
    }
   private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    } 
     getVerticals() {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
       

       
        this.http.get(this.apiUrl +'/getVerticals',this.getRequestOption())
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
            

    }

    getCustomerItemMappingForDistributor(orgCode) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
       

       
        this.http.post(this.apiUrl +'/getCustomerItemMappingForDistributor',{orgCode:orgCode},this.getRequestOption())
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
            

    }














     SaveCustomerItemMapping(data) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        this.http.post(this.apiUrl +'/SaveCustomerItemMapping',{data:data},this.getRequestOption())
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
            

    }
      private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }
   
}