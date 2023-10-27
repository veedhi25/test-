import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { AuthService } from "./permission/authService.service";
import { AppSettings } from './AppSettings';
//import {UserSettings} from './AppSettings';
interface Dictionary {
    [index: string]: any
}



@Injectable()
export class SettingService {
    appSetting: AppSettings

    private cacheSetting;
    constructor(private authService: AuthService, private apSetting: AppSettings) {
        //get settings from application cache
        this.appSetting = apSetting;
        let userProfile = authService.getUserProfile()
        this.cacheSetting = authService.getSetting();
        //this.appSetting.setSetting(this.cacheSetting);


    }
    /*
        private setSetingValues(){
            if(this.cacheSetting==undefined){
                return;
            }
            for(var prop in this.setting){
                if(this.setting.hasOwnProperty(prop)){
                    console.log({setting:prop});
                    let val = this.cacheSetting[this.setting[prop].dbName];
                    
                    if(val!==undefined){
                        console.log({prop:prop,val:val,value:this.setting[prop].value});
                        this.setting[this.setting[prop].dbName].value = val;
                        
                    }
                }
            }
        }
        private getValue(obj: any,prop:string,defaultValue:any){
            if(typeof obj === undefined ){
                return defaultValue;
            }
            if(obj[prop] === undefined){
                return defaultValue;
            }
            return (obj[prop]);
        }
        */
}