import { Injectable } from '@angular/core';
import { AuthService } from '../../../../common/services/permission';
import { GlobalState } from '../../../../global.state';
import { Http, Response, RequestOptions,Headers } from '@angular/http';
import { Subject } from 'rxjs';
// import { AuthService } from "./permission/authService.service";
// import { AppSettings } from './AppSettings';
//import {UserSettings} from './AppSettings';




@Injectable()
export class DeviceSettingService {
    constructor( private authService: AuthService,
        private state: GlobalState,
        private http:Http) {}
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
      saveDeviceSetting(data){

        let returnSubject: Subject<any> = new Subject();
        this.http
          .post(this.apiUrl + '/saveDeviceSetting',data,this.getRequestOption())
          .subscribe(data => {
            let retData = data.json();
            if (retData.status == "ok") {
              returnSubject.next(retData);
            } else {
              returnSubject.next(retData);
            }
          });
        return returnSubject;
        //   let saveBody = {
        //       mode:mode,
        //       data:data
        //   }
        //   return this.http.post(this.apiUrl + '/saveDeviceSetting',saveBody,this.getRequestOption());
      }
      getDeviceSetting(){
        return this.http.get(this.apiUrl + '/getDeviceSetting',this.getRequestOption()).map((response)=>response.json()); 
      }
      
}